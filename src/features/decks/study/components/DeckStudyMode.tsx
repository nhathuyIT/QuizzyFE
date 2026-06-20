import { ArrowRight } from "lucide-react";
import type { Card } from "@/services/api";
import { getChoiceResult } from "../utils";
import { ResultMark } from "./ResultMark";

export function DeckStudyMode({
  answer,
  card,
  checked,
  currentIndex,
  onCheck,
  onChoose,
  onNext,
  options,
  total,
}: {
  answer: string;
  card: Card;
  checked: boolean;
  currentIndex: number;
  onCheck: () => void;
  onChoose: (answer: string) => void;
  onNext: () => void;
  options: Array<{ label: string; value: string }>;
  total: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#614db7]">
            Study mode
          </p>
          <h2 className="mt-1 text-2xl font-extrabold">
            Choose the best meaning
          </h2>
        </div>
        <span className="rounded-full bg-[#e6deff] px-4 py-2 text-sm font-extrabold text-[#311485]">
          {currentIndex + 1}/{total}
        </span>
      </div>

      <div className="mt-6 rounded-[28px] bg-[#fbf9f4] p-7 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#b0aaa2]">
          Select the best meaning
        </p>
        <h3 className="mt-3 text-3xl font-extrabold text-[#311485]">
          {card.front}
        </h3>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((option, index) => {
          const result = checked ? getChoiceResult(option.value, answer, card.back) : null;

          return (
            <button
              className={`flex min-h-16 items-center justify-between gap-3 rounded-[18px] border px-4 py-4 text-left text-sm font-bold transition ${
                result === "correct"
                  ? "border-[#8fd7a9] bg-[#e4f5eb] text-[#205c3c]"
                  : result === "wrong"
                    ? "border-[#f1a4a4] bg-[#fff0f0] text-[#8e3030]"
                    : answer === option.value
                      ? "border-[#614db7] bg-[#e6deff] text-[#311485]"
                      : "border-black/5 bg-white hover:border-[#cabeff]"
              }`}
              disabled={checked}
              key={option.value}
              onClick={() => onChoose(option.value)}
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

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          className="rounded-full bg-[#614db7] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
          disabled={!answer || checked}
          onClick={onCheck}
          type="button"
        >
          Check
        </button>
        {checked && (
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[#1b1c19] px-6 py-3 text-sm font-bold text-white"
            onClick={onNext}
            type="button"
          >
            Next card
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
