import type { FormEvent } from "react";
import { Loader2 } from "lucide-react";
import {
  type MultipleChoiceStudyItem,
  type ReviewResult,
  type WrittenStudyItem,
} from "@/services/api";
import { getChoiceResult } from "../utils";
import { ResultMark } from "./ResultMark";

export function QuestionPanel({
  answer,
  feedback,
  isPending,
  item,
  onAnswerChange,
  onCheckChoice,
  onChoice,
  onSubmit,
}: {
  answer: string;
  feedback: ReviewResult | null;
  isPending: boolean;
  item: WrittenStudyItem | MultipleChoiceStudyItem;
  onAnswerChange: (answer: string) => void;
  onCheckChoice: (item: MultipleChoiceStudyItem) => void;
  onChoice: (answer: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  const isChoiceItem = item.type === "multiple_choice" && item.options.length > 0;

  return (
    <div>
      <h1 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">
        {item.prompt}
      </h1>
      {"hint" in item && item.hint && !feedback && (
        <details className="mt-6 rounded-2xl bg-[#f6f3ee] p-4 text-sm text-[#777474]">
          <summary className="cursor-pointer font-bold text-[#614db7]">
            Show hint
          </summary>
          <p className="mt-3 leading-6">{item.hint}</p>
        </details>
      )}

      {isChoiceItem && (
        <>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {item.options.map((option, index) => {
              const result = feedback
                ? getChoiceResult(option.value, answer, feedback.correctAnswer)
                : null;

              return (
                <button
                  className={`flex min-h-16 items-center justify-between gap-3 rounded-[18px] border px-4 py-4 text-left text-sm font-bold transition disabled:opacity-70 ${
                    result === "correct"
                      ? "border-[#8fd7a9] bg-[#e4f5eb] text-[#205c3c]"
                      : result === "wrong"
                        ? "border-[#f1a4a4] bg-[#fff0f0] text-[#8e3030]"
                        : answer === option.value
                          ? "border-[#614db7] bg-[#e6deff] text-[#311485]"
                          : "border-black/5 bg-[#fbf9f4] hover:border-[#cabeff]"
                  }`}
                  disabled={Boolean(feedback) || isPending}
                  key={option.value}
                  onClick={() => onChoice(option.value)}
                  type="button"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e6deff] text-xs font-extrabold text-[#614db7]">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option.label}
                  </span>
                  <ResultMark result={result} />
                </button>
              );
            })}
          </div>
          {!feedback && (
            <button
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#614db7] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
              disabled={!answer || isPending}
              onClick={() => onCheckChoice(item)}
              type="button"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Check
            </button>
          )}
        </>
      )}

      {!isChoiceItem && (
        <form className="mt-8" onSubmit={onSubmit}>
          <label className="text-sm font-bold">
            Your answer
            <textarea
              autoFocus
              className="mt-2 min-h-36 w-full resize-none rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 text-lg outline-none focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10 disabled:opacity-70"
              disabled={Boolean(feedback) || isPending}
              onChange={(event) => onAnswerChange(event.target.value)}
              placeholder="Type your answer"
              value={answer}
            />
          </label>
          {!feedback && (
            <button
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#614db7] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
              disabled={!answer.trim() || isPending}
              type="submit"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Check
            </button>
          )}
          {feedback && (
            <div
              className={`mt-4 rounded-[18px] px-4 py-3 text-sm font-bold ${
                feedback.isCorrect
                  ? "bg-[#e4f5eb] text-[#205c3c]"
                  : "bg-[#fff0f0] text-[#8e3030]"
              }`}
            >
              {feedback.isCorrect ? "Correct" : `Correct answer: ${feedback.correctAnswer}`}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
