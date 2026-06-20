import { BrainCircuit, Loader2 } from "lucide-react";
import type { StudyMode } from "@/services/api";

const trackedModes: Array<{ id: StudyMode; label: string }> = [
  { id: "flashcard", label: "Flashcards" },
  { id: "learn", label: "Learn" },
  { id: "test", label: "Test" },
  { id: "match", label: "Match" },
];

export function TrackedSessionPanel({
  cardCount,
  error,
  isError,
  isPending,
  onStart,
}: {
  cardCount: number;
  error?: string;
  isError: boolean;
  isPending: boolean;
  onStart: (mode: StudyMode) => void;
}) {
  return (
    <section className="rounded-[26px] bg-[#e6deff] p-5">
      <div className="flex items-center gap-3 text-[#311485]">
        <BrainCircuit className="h-6 w-6" />
        <h2 className="text-xl font-extrabold">Tracked session</h2>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#4e3d88]">
        Use these when you want backend progress and history saved.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {trackedModes.map((mode) => (
          <button
            className="rounded-2xl bg-white px-3 py-3 text-sm font-bold text-[#311485] disabled:opacity-50"
            disabled={!cardCount || isPending}
            key={mode.id}
            onClick={() => onStart(mode.id)}
            type="button"
          >
            {isPending ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : mode.label}
          </button>
        ))}
      </div>
      {isError && <p className="mt-3 text-sm font-bold text-[#a33a3a]">{error}</p>}
    </section>
  );
}
