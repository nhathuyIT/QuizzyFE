import { BrainCircuit, Layers3, Sparkles } from "lucide-react";
import type { PracticeMode } from "../types";

const practiceModes: Array<{
  id: PracticeMode;
  label: string;
  description: string;
}> = [
  {
    id: "flashcard",
    label: "Flashcards",
    description: "Flip front and back like Quizlet.",
  },
  {
    id: "study",
    label: "Study",
    description: "Pick an answer, then check it in place.",
  },
  {
    id: "match",
    label: "Match",
    description: "Pair terms with definitions, then scan results.",
  },
];

export function PracticeModeTabs({
  activeMode,
  onChange,
}: {
  activeMode: PracticeMode;
  onChange: (mode: PracticeMode) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {practiceModes.map((mode) => (
        <button
          className={`rounded-[22px] border p-5 text-left transition ${
            activeMode === mode.id
              ? "border-[#614db7] bg-[#311485] text-white shadow-[0_18px_50px_rgba(49,20,133,0.22)]"
              : "border-black/5 bg-white text-[#1b1c19] hover:border-[#cabeff]"
          }`}
          key={mode.id}
          onClick={() => onChange(mode.id)}
          type="button"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]">
            {mode.id === "flashcard" ? (
              <Layers3 className="h-5 w-5" />
            ) : mode.id === "study" ? (
              <BrainCircuit className="h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </span>
          <span className="mt-4 block text-base font-extrabold">{mode.label}</span>
          <span
            className={`mt-1 block text-sm ${
              activeMode === mode.id ? "text-white/70" : "text-[#777474]"
            }`}
          >
            {mode.description}
          </span>
        </button>
      ))}
    </div>
  );
}
