import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { ReviewResult } from "@/services/api";

export function InlineFeedbackControls({
  feedback,
  isFinishing,
  isLastItem,
  onNext,
}: {
  feedback: ReviewResult;
  isFinishing: boolean;
  isLastItem: boolean;
  onNext: () => void;
}) {
  return (
    <div className="mt-8 flex flex-col gap-4 rounded-[22px] bg-[#fbf9f4] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold ${
          feedback.isCorrect
            ? "bg-[#e4f5eb] text-[#205c3c]"
            : "bg-[#fff0f0] text-[#8e3030]"
        }`}
      >
        {feedback.isCorrect ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        {feedback.isCorrect ? "Correct" : "Keep reviewing"}
      </div>
      <div className="text-xs font-bold uppercase tracking-[0.1em] text-[#777474]">
        Mastery {feedback.progressUpdate.mastery}% - {feedback.progressUpdate.status}
      </div>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b1c19] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
        disabled={isFinishing}
        onClick={onNext}
        type="button"
      >
        {isFinishing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isLastItem ? (
          "Finish session"
        ) : (
          <>
            Next card
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}
