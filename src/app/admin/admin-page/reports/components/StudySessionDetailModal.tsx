import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { adminAPI } from "@/services/api";
import { formatDate, formatDuration } from "../columns/study-session.columns";

type StudySessionDetailModalProps = {
  onClose: () => void;
  sessionId: string;
};

export function StudySessionDetailModal({
  onClose,
  sessionId,
}: StudySessionDetailModalProps) {
  const [reviewPage, setReviewPage] = useState(1);

  const sessionQuery = useQuery({
    queryKey: ["admin", "study-sessions", sessionId],
    queryFn: () => adminAPI.getStudySession(sessionId),
    retry: false,
  });

  const reviewsQuery = useQuery({
    queryKey: [
      "admin",
      "study-sessions",
      sessionId,
      "reviews",
      { page: reviewPage, take: 20 },
    ],
    queryFn: () =>
      adminAPI.getStudySessionReviews(sessionId, {
        page: reviewPage,
        take: 20,
      }),
    placeholderData: keepPreviousData,
    retry: false,
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const session = sessionQuery.data?.data;
  const reviews = reviewsQuery.data?.data ?? [];
  const meta = reviewsQuery.data?.meta;

  return (
    <div
      aria-labelledby="study-session-detail-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1c19]/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <div className="flex max-h-[92vh] w-full max-w-[1040px] flex-col overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/5 p-5 sm:p-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-normal text-[#614db7]">
              Study Session Detail
            </p>
            <h3
              className="mt-2 truncate [font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19] sm:text-3xl"
              id="study-session-detail-title"
            >
              {session?.user?.name ?? "Session details"}
            </h3>
            <p className="mt-1 truncate text-sm font-semibold text-[#5f5e5e]">
              Session ID: {sessionId}
            </p>
          </div>
          <button
            aria-label="Close session detail"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:text-[#1b1c19]"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
            <SessionInformation
              error={sessionQuery.error}
              isError={sessionQuery.isError}
              isLoading={sessionQuery.isPending}
              onRetry={() => void sessionQuery.refetch()}
              session={session}
            />

            <div className="flex min-h-96 flex-col overflow-hidden rounded-[24px] border border-black/5 bg-[#fbf9f4]">
              <div className="flex items-center justify-between gap-3 border-b border-black/5 bg-[#f6f2ff] px-5 py-3">
                <h4 className="text-sm font-extrabold text-[#614db7]">
                  Review History
                </h4>
                {reviewsQuery.isFetching && !reviewsQuery.isPending ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#614db7]">
                    <Loader2
                      aria-hidden="true"
                      className="h-3.5 w-3.5 animate-spin"
                    />
                    Updating
                  </span>
                ) : null}
              </div>

              <div className="flex-1 p-5">
                {reviewsQuery.isPending ? <ReviewsLoading /> : null}
                {reviewsQuery.isError && !reviewsQuery.isPending ? (
                  <ReviewsError
                    error={reviewsQuery.error}
                    onRetry={() => void reviewsQuery.refetch()}
                  />
                ) : null}
                {!reviewsQuery.isPending &&
                !reviewsQuery.isError &&
                reviews.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-center text-sm font-bold text-[#5f5e5e]">
                    No reviews were recorded in this session.
                  </div>
                ) : null}

                {!reviewsQuery.isPending && !reviewsQuery.isError ? (
                  <div
                    className={`grid gap-3 transition-opacity ${
                      reviewsQuery.isFetching ? "opacity-55" : "opacity-100"
                    }`}
                  >
                    {reviews.map((review, index) => (
                      <div
                        className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
                        key={
                          review.id ||
                          review._id ||
                          `${review.cardId}-${review.createdAt}-${index}`
                        }
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-[#1b1c19]">
                              {review.card?.front || "Unknown question"}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[#5f5e5e]">
                              {review.card?.back || "Unknown answer"}
                            </p>
                            {review.answer ? (
                              <p className="mt-2 text-xs italic text-[#a33a3a]">
                                Learner answered: {review.answer}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1.5">
                            <ReviewResultBadge isCorrect={review.isCorrect} />
                            <span className="text-[10px] font-semibold text-[#8a8784]">
                              {formatResponseTime(review.responseTimeMs)}
                            </span>
                            {review.rating ? (
                              <span className="text-[10px] font-bold uppercase text-[#614db7]">
                                {review.rating}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {meta && meta.pageCount > 1 ? (
                <div className="flex items-center justify-between border-t border-black/5 p-4">
                  <span className="text-xs font-semibold text-[#5f5e5e]">
                    Page {meta.page} of {meta.pageCount}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Previous reviews page"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#5f5e5e] shadow-sm transition hover:text-[#311485] disabled:cursor-not-allowed disabled:opacity-45"
                      disabled={
                        !meta.hasPreviousPage || reviewsQuery.isFetching
                      }
                      onClick={() => setReviewPage((current) => current - 1)}
                      type="button"
                    >
                      <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Next reviews page"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#5f5e5e] shadow-sm transition hover:text-[#311485] disabled:cursor-not-allowed disabled:opacity-45"
                      disabled={!meta.hasNextPage || reviewsQuery.isFetching}
                      onClick={() => setReviewPage((current) => current + 1)}
                      type="button"
                    >
                      <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionInformation({
  error,
  isError,
  isLoading,
  onRetry,
  session,
}: {
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  onRetry: () => void;
  session: Awaited<ReturnType<typeof adminAPI.getStudySession>>["data"] | undefined;
}) {
  if (isLoading) {
    return (
      <div className="flex min-h-52 items-center justify-center gap-2 text-sm font-bold text-[#614db7]">
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        Loading session...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-2xl bg-[#fff7f7] p-5 text-center">
        <AlertTriangle aria-hidden="true" className="h-6 w-6 text-[#a33a3a]" />
        <p className="text-sm font-extrabold text-[#a33a3a]">
          {error instanceof Error
            ? error.message
            : "Unable to load session details."}
        </p>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-xs font-extrabold text-[#a33a3a] shadow-sm"
          onClick={onRetry}
          type="button"
        >
          <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="space-y-3">
      <DetailRow label="Learner Email" value={session.user?.email || "N/A"} />
      <DetailRow label="Deck" value={session.deck?.title || "N/A"} />
      <div className="grid grid-cols-2 gap-3">
        <DetailRow label="Mode" value={session.mode} />
        <DetailRow
          label="Status"
          value={session.finishedAt ? "Finished" : "In progress"}
        />
      </div>
      <DetailRow
        label="Duration"
        value={formatDuration(session.startedAt, session.finishedAt)}
      />
      <DetailRow label="Started At" value={formatDate(session.startedAt)} />
      <DetailRow
        label="Correct Reviews"
        value={`${session.correctReviewCount ?? 0} / ${
          session.reviewCount ?? 0
        }`}
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-0 rounded-2xl bg-[#fbf9f4] px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-normal text-[#797583]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-extrabold text-[#1b1c19]">
        {value}
      </p>
    </div>
  );
}

function ReviewsLoading() {
  return (
    <div className="flex h-40 items-center justify-center gap-2 text-sm font-bold text-[#614db7]">
      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      Loading reviews...
    </div>
  );
}

function ReviewsError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-3 text-center">
      <AlertTriangle aria-hidden="true" className="h-5 w-5 text-[#a33a3a]" />
      <p className="text-xs font-bold text-[#a33a3a]">
        {error instanceof Error ? error.message : "Unable to load reviews."}
      </p>
      <button
        className="inline-flex h-8 items-center gap-2 rounded-full bg-white px-3 text-xs font-extrabold text-[#a33a3a] shadow-sm"
        onClick={onRetry}
        type="button"
      >
        <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  );
}

function ReviewResultBadge({ isCorrect }: { isCorrect: boolean }) {
  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
        isCorrect
          ? "bg-[#d7f2e3] text-[#276345]"
          : "bg-[#fff0f0] text-[#a33a3a]"
      }`}
    >
      {isCorrect ? (
        <CheckCircle2 aria-hidden="true" className="h-3 w-3" />
      ) : (
        <XCircle aria-hidden="true" className="h-3 w-3" />
      )}
      {isCorrect ? "Correct" : "Incorrect"}
    </span>
  );
}

function formatResponseTime(value: number) {
  if (!Number.isFinite(value)) return "—";
  if (value >= 1000) return `${(value / 1000).toFixed(1)}s`;
  return `${value}ms`;
}
