"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FlashcardPanel } from "@/features/study-session/components/FlashcardPanel";
import { InlineFeedbackControls } from "@/features/study-session/components/InlineFeedbackControls";
import { QuestionPanel } from "@/features/study-session/components/QuestionPanel";
import { SessionMatchPanel } from "@/features/study-session/components/SessionMatchPanel";
import { useMatchBoard } from "@/features/study-session/hooks/useMatchBoard";
import { useReviewSyncQueue } from "@/features/study-session/hooks/useReviewSyncQueue";
import type { MatchSize } from "@/features/study-session/types";
import {
  buildMatchResults,
  buildMatchReviewPayloads,
  formatStudyMode,
  isFlashcardItem,
  isMatchItem,
  isSessionCardItem,
  normalizeAnswer,
  stableShuffle,
} from "@/features/study-session/utils";
import {
  decksAPI,
  studyAPI,
  type FlashcardStudyItem,
  type MultipleChoiceStudyItem,
  type ReviewRating,
  type ReviewResult,
} from "@/services/api";

export default function StudySessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<ReviewResult | null>(null);
  const [isBackVisible, setIsBackVisible] = useState(false);
  const [itemStartedAt, setItemStartedAt] = useState(() => Date.now());
  const matchBoard = useMatchBoard();

  const sessionQuery = useQuery({
    queryKey: ["study", "session", sessionId],
    queryFn: () => studyAPI.getSession(sessionId),
  });
  const session = sessionQuery.data?.data;
  const isMatchMode = session?.mode === "match";
  const deckQuery = useQuery({
    queryKey: ["decks", session?.deckId],
    queryFn: () => decksAPI.getById(session!.deckId),
    enabled: Boolean(session?.deckId),
  });
  const itemsQuery = useQuery({
    queryKey: ["study", "session", sessionId, "items"],
    queryFn: () => studyAPI.getSessionItems(sessionId),
    enabled: Boolean(session),
  });

  const rawItems = useMemo(() => itemsQuery.data?.data ?? [], [itemsQuery.data?.data]);
  const matchFrontItems = useMemo(
    () => rawItems.filter(isMatchItem).filter((item) => item.side === "front"),
    [rawItems],
  );
  const matchBackItems = useMemo(
    () => rawItems.filter(isMatchItem).filter((item) => item.side === "back"),
    [rawItems],
  );
  const selectedMatchFrontItems = useMemo(() => {
    const size =
      matchBoard.matchSize === "half"
        ? Math.max(1, Math.ceil(matchFrontItems.length / 2))
        : matchFrontItems.length;

    return matchFrontItems.slice(0, size);
  }, [matchBoard.matchSize, matchFrontItems]);
  const selectedMatchCardIds = useMemo(
    () => new Set(selectedMatchFrontItems.map((item) => item.cardId)),
    [selectedMatchFrontItems],
  );
  const selectedMatchBackItems = useMemo(
    () =>
      stableShuffle(
        matchBackItems.filter((item) => selectedMatchCardIds.has(item.cardId)),
      ),
    [matchBackItems, selectedMatchCardIds],
  );
  const studyItems = useMemo(() => rawItems.filter(isSessionCardItem), [rawItems]);
  const totalItems = isMatchMode ? selectedMatchFrontItems.length : studyItems.length;
  const currentIndex = !isMatchMode && totalItems ? Math.min(index, totalItems - 1) : 0;
  const currentItem = !isMatchMode ? studyItems[currentIndex] : undefined;
  const pairedMatchCount = selectedMatchFrontItems.filter(
    (item) => matchBoard.matches[item.cardId],
  ).length;

  const handleReviewsSynced = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["progress"] });
    queryClient.invalidateQueries({ queryKey: ["study", "session", sessionId] });
  }, [queryClient, sessionId]);
  const reviewSyncQueue = useReviewSyncQueue({
    sessionId,
    onSynced: handleReviewsSynced,
  });
  const finishMutation = useMutation({
    mutationFn: async () => {
      await reviewSyncQueue.flushAllQueuedReviews();
      return studyAPI.finishSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study"] });
      router.push(`/study/${sessionId}/result`);
    },
  });

  useEffect(() => {
    if (session?.finishedAt) router.replace(`/study/${sessionId}/result`);
  }, [router, session?.finishedAt, sessionId]);

  function submitWritten(event: FormEvent) {
    event.preventDefault();
    if (!currentItem || isFlashcardItem(currentItem)) return;
    if (!answer.trim() || feedback) return;

    const submittedAnswer = answer.trim();
    const correctAnswer = currentItem.correctAnswer ?? submittedAnswer;
    const isCorrect = normalizeAnswer(submittedAnswer) === normalizeAnswer(correctAnswer);
    const queuedReview = reviewSyncQueue.enqueueReview({
      cardId: currentItem.cardId,
      responseTimeMs: Date.now() - itemStartedAt,
      userAnswer: submittedAnswer,
    });

    setFeedback(
      buildOptimisticReviewResult({
        cardId: currentItem.cardId,
        correctAnswer,
        isCorrect,
        reviewId: queuedReview.clientReviewId,
      }),
    );
  }

  function submitChoice(item: MultipleChoiceStudyItem) {
    if (!answer || feedback) return;

    const correctAnswer = item.correctAnswer ?? answer;
    const isCorrect = normalizeAnswer(answer) === normalizeAnswer(correctAnswer);
    const queuedReview = reviewSyncQueue.enqueueReview({
      cardId: item.cardId,
      responseTimeMs: Date.now() - itemStartedAt,
      userAnswer: answer,
    });

    setFeedback(
      buildOptimisticReviewResult({
        cardId: item.cardId,
        correctAnswer,
        isCorrect,
        reviewId: queuedReview.clientReviewId,
      }),
    );
  }

  function submitFlashcard(item: FlashcardStudyItem, rating: ReviewRating) {
    if (feedback) return;

    reviewSyncQueue.enqueueReview({
      cardId: item.cardId,
      rating,
      responseTimeMs: Date.now() - itemStartedAt,
    });
    next();
  }

  function submitMatchBoard() {
    if (!selectedMatchFrontItems.length || pairedMatchCount < selectedMatchFrontItems.length) {
      return;
    }

    matchBoard.setMatchResults(
      buildMatchResults(selectedMatchFrontItems, matchBoard.matches),
    );
    reviewSyncQueue.enqueueReviews(
      buildMatchReviewPayloads(
        selectedMatchFrontItems,
        selectedMatchBackItems,
        matchBoard.matches,
      ).map((payload) => ({
        ...payload,
        responseTimeMs: Date.now() - itemStartedAt,
      })),
    );
  }

  function resetMatchRound(size: MatchSize = matchBoard.matchSize) {
    matchBoard.resetMatchBoard(size);
    setItemStartedAt(Date.now());
  }

  function moveBack() {
    if (currentIndex <= 0) return;
    setIndex((value) => value - 1);
    resetCurrentItem();
  }

  function next() {
    if (currentIndex >= totalItems - 1) {
      finishMutation.mutate();
      return;
    }

    setIndex((value) => value + 1);
    resetCurrentItem();
  }

  function resetCurrentItem() {
    setAnswer("");
    setFeedback(null);
    setIsBackVisible(false);
    setItemStartedAt(Date.now());
  }

  if (sessionQuery.isLoading || itemsQuery.isLoading) return <Loading />;
  if (sessionQuery.isError || itemsQuery.isError || !session) {
    return (
      <ErrorBox
        message={
          sessionQuery.error?.message ??
          itemsQuery.error?.message ??
          "Session not found."
        }
      />
    );
  }
  if (!totalItems || (!isMatchMode && !currentItem)) {
    return <EmptySession deckId={session.deckId} />;
  }

  const progress = isMatchMode
    ? matchBoard.matchResults
      ? 100
      : (pairedMatchCount / totalItems) * 100
    : ((currentIndex + (feedback ? 1 : 0)) / totalItems) * 100;
  const isCurrentFlashcard = !isMatchMode && currentItem && isFlashcardItem(currentItem);

  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] p-4 sm:p-8">
      <div className="mx-auto max-w-[940px]">
        <div className="flex items-center justify-between gap-3">
          <Link
            className="inline-flex items-center gap-2 text-sm font-bold text-[#777474]"
            href={`/decks/${session.deckId}`}
          >
            <ArrowLeft className="h-4 w-4" />
            Leave session
          </Link>
          <span className="rounded-full bg-[#e6deff] px-4 py-2 text-xs font-extrabold capitalize text-[#311485]">
            {formatStudyMode(session.mode)}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e7e2db]">
            <div
              className="h-full rounded-full bg-[#614db7] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-bold text-[#777474]">
            {isMatchMode
              ? `${pairedMatchCount}/${totalItems}`
              : `${currentIndex + 1}/${totalItems}`}
          </span>
        </div>

        <section
          className={`mt-6 rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_20px_60px_rgba(27,28,25,0.07)] sm:p-10 ${
            isCurrentFlashcard ? "min-h-[600px] sm:min-h-[660px]" : ""
          }`}
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#614db7]">
            {deckQuery.data?.data.title ?? "Study card"}
          </p>

          {isMatchMode ? (
            <SessionMatchPanel
              definitions={selectedMatchBackItems}
              isFinishing={finishMutation.isPending}
              isPending={finishMutation.isPending}
              matchSize={matchBoard.matchSize}
              matches={matchBoard.matches}
              onCheck={submitMatchBoard}
              onChooseDefinition={matchBoard.chooseDefinition}
              onChooseTerm={matchBoard.chooseTerm}
              onFinish={() => finishMutation.mutate()}
              onSizeChange={resetMatchRound}
              pairedCount={pairedMatchCount}
              results={matchBoard.matchResults}
              selectedDefinitionId={matchBoard.selectedDefinitionId}
              selectedTermId={matchBoard.selectedTermId}
              terms={selectedMatchFrontItems}
              totalCards={matchFrontItems.length}
            />
          ) : currentItem && isFlashcardItem(currentItem) ? (
            <FlashcardPanel
              feedback={feedback}
              isBackVisible={isBackVisible}
              isPending={finishMutation.isPending}
              item={currentItem}
              onFlip={() => setIsBackVisible((value) => !value)}
              onMoveBack={moveBack}
              onReview={submitFlashcard}
            />
          ) : currentItem ? (
            <QuestionPanel
              answer={answer}
              feedback={feedback}
              isPending={finishMutation.isPending}
              item={currentItem}
              onAnswerChange={setAnswer}
              onCheckChoice={submitChoice}
              onChoice={setAnswer}
              onSubmit={submitWritten}
            />
          ) : null}

          {finishMutation.isError && (
            <p className="mt-4 text-sm font-bold text-[#a33a3a]">
              {finishMutation.error.message}
            </p>
          )}

          {!isMatchMode && feedback && !(currentItem && isFlashcardItem(currentItem)) && (
            <InlineFeedbackControls
              feedback={feedback}
              isFinishing={finishMutation.isPending}
              isLastItem={currentIndex === totalItems - 1}
              onNext={next}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function buildOptimisticReviewResult({
  cardId,
  correctAnswer,
  isCorrect,
  reviewId,
}: {
  cardId: string;
  correctAnswer: string;
  isCorrect: boolean;
  reviewId: string;
}): ReviewResult {
  return {
    reviewId,
    cardId,
    isCorrect,
    correctAnswer,
    progressUpdate: {
      status: isCorrect ? "review" : "learning",
      mastery: isCorrect ? 15 : 0,
      easeFactor: 2.5,
      intervalDays: isCorrect ? 3 : 0,
      dueAt: new Date().toISOString(),
    },
  };
}

function EmptySession({ deckId }: { deckId: string }) {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-[620px] rounded-[28px] bg-white p-8 text-center">
        <h1 className="text-2xl font-extrabold">No cards to study</h1>
        <Link
          className="mt-5 inline-block rounded-full bg-[#614db7] px-5 py-3 text-sm font-bold text-white"
          href={`/flashcards?deckId=${deckId}`}
        >
          Add cards
        </Link>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-[#614db7]" />
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="p-8">
      <div className="rounded-2xl bg-[#fff0f0] p-5 font-bold text-[#a33a3a]">
        {message}
      </div>
    </div>
  );
}
