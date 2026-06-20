"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { API_BASE_URL, withApiVersion } from "@/api/axios.config";
import { studyAPI, type LogReviewInput } from "@/services/api";

const DEFAULT_SYNC_THRESHOLD = 10;
const QUEUE_KEY_PREFIX = "quizzy:study-review-queue:";

type QueuedReview = LogReviewInput & { clientReviewId: string };
type ReviewDraft = Omit<LogReviewInput, "sessionId">;

interface UseReviewSyncQueueOptions {
  sessionId: string;
  syncThreshold?: number;
  onSynced?: () => void;
}

export function useReviewSyncQueue({
  sessionId,
  syncThreshold = DEFAULT_SYNC_THRESHOLD,
  onSynced,
}: UseReviewSyncQueueOptions) {
  const pendingReviewsRef = useRef<QueuedReview[]>([]);
  const activeSyncPromiseRef = useRef<Promise<void> | null>(null);
  const onSyncedRef = useRef(onSynced);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    onSyncedRef.current = onSynced;
  }, [onSynced]);

  const replaceQueue = useCallback(
    (reviews: QueuedReview[]) => {
      pendingReviewsRef.current = reviews;
      setPendingCount(reviews.length);
      writeQueuedReviews(sessionId, reviews);
    },
    [sessionId],
  );

  const syncQueuedReviews = useCallback(
    async ({ throwOnError = false }: { throwOnError?: boolean } = {}) => {
      if (activeSyncPromiseRef.current) {
        try {
          await activeSyncPromiseRef.current;
          return true;
        } catch (error) {
          if (throwOnError) throw error;
          return false;
        }
      }

      const reviewsToSync = pendingReviewsRef.current;

      if (reviewsToSync.length === 0) {
        setSyncError(null);
        return true;
      }

      setIsSyncing(true);
      replaceQueue([]);
      let didSync = false;

      const syncPromise = studyAPI
        .syncReviews(toReviewPayload(reviewsToSync))
        .then(() => {
          setSyncError(null);
          onSyncedRef.current?.();
        });

      activeSyncPromiseRef.current = syncPromise;

      try {
        await syncPromise;
        didSync = true;
        return true;
      } catch (error) {
        replaceQueue([...reviewsToSync, ...pendingReviewsRef.current]);
        setSyncError(getErrorMessage(error));
        if (throwOnError) throw error;
        return false;
      } finally {
        if (activeSyncPromiseRef.current === syncPromise) {
          activeSyncPromiseRef.current = null;
        }
        setIsSyncing(false);

        if (
          didSync &&
          pendingReviewsRef.current.length >= syncThreshold &&
          !activeSyncPromiseRef.current
        ) {
          void syncQueuedReviews();
        }
      }
    },
    [replaceQueue, syncThreshold],
  );

  const flushAllQueuedReviews = useCallback(async () => {
    do {
      await syncQueuedReviews({ throwOnError: true });
    } while (pendingReviewsRef.current.length > 0);
  }, [syncQueuedReviews]);

  const enqueueReviews = useCallback(
    (reviews: ReviewDraft[]) => {
      const queuedReviews = reviews.map((review) => ({
        ...review,
        sessionId,
        clientReviewId:
          review.clientReviewId ??
          createClientReviewId(sessionId, review.cardId),
      }));
      const nextReviews = [...pendingReviewsRef.current, ...queuedReviews];

      replaceQueue(nextReviews);

      if (nextReviews.length >= syncThreshold) {
        void syncQueuedReviews();
      }

      return queuedReviews;
    },
    [replaceQueue, sessionId, syncQueuedReviews, syncThreshold],
  );

  const enqueueReview = useCallback(
    (review: ReviewDraft) => enqueueReviews([review])[0],
    [enqueueReviews],
  );

  useEffect(() => {
    const storedReviews = readQueuedReviews(sessionId);

    pendingReviewsRef.current = storedReviews;
    writeQueuedReviews(sessionId, storedReviews);

    queueMicrotask(() => {
      setPendingCount(storedReviews.length);

      if (storedReviews.length > 0) {
        void syncQueuedReviews();
      }
    });
  }, [replaceQueue, sessionId, syncQueuedReviews]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let didFlush = false;
    const flushOnUnload = () => {
      if (didFlush) return;
      didFlush = true;
      flushQueuedReviewsWithKeepalive(pendingReviewsRef.current);
    };

    window.addEventListener("pagehide", flushOnUnload);
    window.addEventListener("beforeunload", flushOnUnload);

    return () => {
      window.removeEventListener("pagehide", flushOnUnload);
      window.removeEventListener("beforeunload", flushOnUnload);
    };
  }, []);

  return {
    enqueueReview,
    enqueueReviews,
    flushAllQueuedReviews,
    isSyncing,
    pendingCount,
    syncError,
    syncQueuedReviews,
  };
}

function getQueueKey(sessionId: string) {
  return `${QUEUE_KEY_PREFIX}${sessionId}`;
}

function readQueuedReviews(sessionId: string): QueuedReview[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(getQueueKey(sessionId));
    const parsedValue = value ? (JSON.parse(value) as unknown) : [];

    if (!Array.isArray(parsedValue)) return [];

    return parsedValue
      .filter(isReviewLike)
      .map((review) => ({
        ...review,
        clientReviewId:
          review.clientReviewId ??
          createClientReviewId(review.sessionId, review.cardId),
      }));
  } catch {
    return [];
  }
}

function writeQueuedReviews(sessionId: string, reviews: QueuedReview[]) {
  if (typeof window === "undefined") return;

  const key = getQueueKey(sessionId);

  if (reviews.length === 0) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(toReviewPayload(reviews)));
}

function flushQueuedReviewsWithKeepalive(reviews: QueuedReview[]) {
  if (typeof window === "undefined" || reviews.length === 0) return;

  const body = JSON.stringify(toReviewPayload(reviews));
  const token = window.localStorage.getItem("accessToken");
  const url = `${API_BASE_URL}${withApiVersion("/study/reviews/sync")}`;

  if (token) {
    void fetch(url, {
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      keepalive: true,
      method: "POST",
    });
    return;
  }

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      url,
      new Blob([body], { type: "application/json" }),
    );
  }
}

function toReviewPayload(reviews: QueuedReview[]): LogReviewInput[] {
  return reviews.map(
    ({
      cardId,
      clientReviewId,
      rating,
      responseTimeMs,
      sessionId,
      userAnswer,
    }) => ({
      cardId,
      clientReviewId,
      rating,
      responseTimeMs,
      sessionId,
      userAnswer,
    }),
  );
}

function createClientReviewId(sessionId: string, cardId: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${sessionId}:${crypto.randomUUID()}`;
  }

  return `${sessionId}:${cardId}:${Date.now()}:${Math.random()
    .toString(36)
    .slice(2)}`;
}

function isReviewLike(value: unknown): value is QueuedReview {
  if (typeof value !== "object" || value === null) return false;

  const review = value as Partial<QueuedReview>;

  return (
    typeof review.sessionId === "string" &&
    typeof review.cardId === "string" &&
    (review.userAnswer === undefined || typeof review.userAnswer === "string") &&
    (review.rating === undefined ||
      review.rating === "again" ||
      review.rating === "hard" ||
      review.rating === "good" ||
      review.rating === "easy") &&
    (review.responseTimeMs === undefined ||
      typeof review.responseTimeMs === "number") &&
    (review.clientReviewId === undefined ||
      typeof review.clientReviewId === "string")
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Could not sync study progress. Your answers are saved locally.";
}
