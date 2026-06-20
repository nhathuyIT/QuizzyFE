import { CheckCircle2, ChevronLeft, XCircle } from "lucide-react";
import {
  type FlashcardStudyItem,
  type ReviewRating,
  type ReviewResult,
} from "@/services/api";

export function FlashcardPanel({
  feedback,
  isBackVisible,
  isPending,
  item,
  onFlip,
  onMoveBack,
  onReview,
}: {
  feedback: ReviewResult | null;
  isBackVisible: boolean;
  isPending: boolean;
  item: FlashcardStudyItem;
  onFlip: () => void;
  onMoveBack: () => void;
  onReview: (item: FlashcardStudyItem, rating: ReviewRating) => void;
}) {
  return (
    <div>
      <button
        aria-label="Flip flashcard"
        className="mt-6 block w-full rounded-[30px] [perspective:1400px]"
        disabled={Boolean(feedback)}
        onClick={onFlip}
        type="button"
      >
        <span
          className={`relative block min-h-[340px] rounded-[30px] transition-transform duration-500 [transform-style:preserve-3d] ${
            isBackVisible ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <span className="absolute inset-0 flex flex-col items-center justify-center rounded-[30px] border border-black/5 bg-[#e2dff7] p-8 text-center shadow-inner [backface-visibility:hidden]">
            <span className="quizlet-font text-xs font-bold uppercase text-[#b0aaa2]">
              Term
            </span>
            <span className="quizlet-card-title mt-5 max-w-[720px] text-3xl text-[#1b1c19] sm:text-5xl">
              {item.front}
            </span>
            {item.hint && (
              <span className="mt-6 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#614db7]">
                Hint: {item.hint}
              </span>
            )}
          </span>
          <span className="absolute inset-0 flex flex-col items-center justify-center rounded-[30px] border border-black/5 bg-[#e2dff7] p-8 text-center shadow-inner [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="quizlet-font text-xs font-bold uppercase text-[#b0aaa2]">
              Definition
            </span>
            <span className="quizlet-card-title mt-5 max-w-[720px] text-3xl text-[#311485] sm:text-5xl">
              {item.back}
            </span>
            {item.explanation && (
              <span className="quizlet-font mt-6 max-w-[680px] text-sm leading-6 text-[#777474]">
                {item.explanation}
              </span>
            )}
          </span>
        </span>
      </button>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-[#777474] transition hover:border-[#cabeff] hover:text-[#311485] disabled:opacity-40"
          disabled={Boolean(feedback) || isPending}
          onClick={onMoveBack}
          type="button"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          <button
            className="inline-flex h-12 min-w-36 items-center justify-center gap-2 rounded-full border border-[#efb7b7] bg-white px-5 text-sm font-extrabold text-[#8e3030] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fff0f0] hover:shadow-md disabled:translate-y-0 disabled:opacity-50"
            disabled={Boolean(feedback) || isPending}
            onClick={() => onReview(item, "again")}
            type="button"
          >
            <XCircle className="h-5 w-5" />
            Don&apos;t know
          </button>
          <button
            className="inline-flex h-12 min-w-32 items-center justify-center gap-2 rounded-full bg-[#311485] px-6 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(49,20,133,0.24)] transition hover:-translate-y-0.5 hover:bg-[#4f32b4] hover:shadow-[0_14px_30px_rgba(49,20,133,0.28)] disabled:translate-y-0 disabled:opacity-50"
            disabled={Boolean(feedback) || isPending}
            onClick={() => onReview(item, "good")}
            type="button"
          >
            <CheckCircle2 className="h-5 w-5" />
            Know
          </button>
        </div>
      </div>
    </div>
  );
}
