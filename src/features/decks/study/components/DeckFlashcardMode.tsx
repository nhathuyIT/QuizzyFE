import { ArrowRight, ChevronLeft } from "lucide-react";
import type { Card } from "@/services/api";

export function DeckFlashcardMode({
  card,
  currentIndex,
  isFlipped,
  onFlip,
  onMove,
  total,
}: {
  card: Card;
  currentIndex: number;
  isFlipped: boolean;
  onFlip: () => void;
  onMove: (direction: -1 | 1) => void;
  total: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#614db7]">
            Learning set
          </p>
          <h2 className="mt-1 text-2xl font-extrabold">Flashcards</h2>
        </div>
        <span className="rounded-full bg-[#e6deff] px-4 py-2 text-sm font-extrabold text-[#311485]">
          {currentIndex + 1}/{total}
        </span>
      </div>

      <button
        aria-label="Flip flashcard"
        className="mt-6 block w-full rounded-[30px] [perspective:1400px]"
        onClick={onFlip}
        type="button"
      >
        <span
          className={`relative block min-h-[500px] rounded-[30px] transition-transform duration-500 [transform-style:preserve-3d] ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <span className="absolute inset-0 flex flex-col items-center justify-center rounded-[30px] border border-black/5 bg-[#fbf9f4] p-8 text-center shadow-inner [backface-visibility:hidden]">
            <span className="quizlet-font text-s font-bold uppercase text-[#b0aaa2]">
              Term
            </span>
            <span className="quizlet-card-title mt-5 max-w-[760px] text-4xl text-[#1b1c19] sm:text-5xl">
              {card.front}
            </span>
            {card.hint && (
              <span className="mt-6 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#614db7]">
                Hint: {card.hint}
              </span>
            )}
          </span>
          <span className="absolute inset-0 flex flex-col items-center justify-center rounded-[30px] border border-black/5 bg-[#fbf9f4] p-8 text-center shadow-inner [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="quizlet-font text-s font-bold uppercase text-[#b0aaa2]">
              Definition
            </span>
            <span className="quizlet-card-title mt-5 max-w-[760px] text-4xl text-[#311485] sm:text-5xl">
              {card.back}
            </span>
            {card.explanation && (
              <span className="quizlet-font mt-6 max-w-[680px] text-sm leading-6 text-[#777474]">
                {card.explanation}
              </span>
            )}
          </span>
        </span>
      </button>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-[#777474] transition hover:border-[#cabeff] hover:text-[#311485]"
          onClick={() => onMove(-1)}
          type="button"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#311485] text-white transition hover:bg-[#614db7]"
          onClick={() => onMove(1)}
          type="button"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
