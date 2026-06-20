import Link from "next/link";
import { BookOpenText, Layers3 } from "lucide-react";

export function CardsList({
  cards,
  isLoading,
}: {
  cards: Array<{ _id: string; front: string; back: string }>;
  isLoading: boolean;
}) {
  return (
    <section className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">Cards</h2>
          <p className="mt-1 text-sm text-[#777474]">
            {cards.length} cards ordered for study
          </p>
        </div>
        <Layers3 className="h-6 w-6 text-[#614db7]" />
      </div>
      {isLoading ? (
        <p className="mt-6 text-sm text-[#777474]">Loading cards...</p>
      ) : cards.length ? (
        <div className="mt-6 space-y-3">
          {cards.map((card, index) => (
            <Link
              className="flex items-center gap-4 rounded-[20px] border border-black/5 bg-[#fbf9f4] p-4 transition hover:border-[#cabeff]"
              href={`/cards/${card._id}`}
              key={card._id}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6deff] text-sm font-extrabold text-[#614db7]">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold">{card.front}</p>
                <p className="mt-1 truncate text-sm text-[#777474]">{card.back}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[22px] border border-dashed border-[#cabeff] p-8 text-center">
          <BookOpenText className="mx-auto h-8 w-8 text-[#614db7]" />
          <p className="mt-3 font-bold">This deck has no cards yet.</p>
        </div>
      )}
    </section>
  );
}
