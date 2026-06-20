import { CheckCircle2, Clock3, RotateCcw } from "lucide-react";
import type { CardProgress } from "@/services/api";

export function DueCardsPanel({
  cardMap,
  dueCards,
  isPending,
  onUpdate,
}: {
  cardMap: Map<string, { front: string }>;
  dueCards: CardProgress[];
  isPending: boolean;
  onUpdate: (progress: CardProgress, mastered: boolean) => void;
}) {
  return (
    <section className="rounded-[26px] border border-black/5 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold">Due cards</h2>
        <Clock3 className="h-5 w-5 text-[#614db7]" />
      </div>
      {dueCards.length ? (
        <div className="mt-4 space-y-4">
          {dueCards.slice(0, 5).map((progress) => (
            <div className="rounded-2xl bg-[#f6f3ee] p-4" key={progress._id}>
              <p className="truncate text-sm font-bold">
                {cardMap.get(progress.cardId)?.front ?? "Card"}
              </p>
              <p className="mt-1 text-xs text-[#777474]">
                {progress.mastery}% mastery - {progress.status}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  className="flex-1 rounded-full bg-white px-3 py-2 text-xs font-bold"
                  disabled={isPending}
                  onClick={() => onUpdate(progress, false)}
                  type="button"
                >
                  <RotateCcw className="mr-1 inline h-3 w-3" />
                  Tomorrow
                </button>
                <button
                  className="flex-1 rounded-full bg-[#d7f2e3] px-3 py-2 text-xs font-bold text-[#276345]"
                  disabled={isPending}
                  onClick={() => onUpdate(progress, true)}
                  type="button"
                >
                  <CheckCircle2 className="mr-1 inline h-3 w-3" />
                  Mastered
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-[#777474]">No cards are due right now.</p>
      )}
    </section>
  );
}
