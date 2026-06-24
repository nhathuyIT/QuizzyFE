import Link from "next/link";
import { Edit3, MessageSquareText, Plus, Star } from "lucide-react";

export function DeckHeader({
  deckId,
  description,
  isOwner,
  isStarPending,
  onToggleStar,
  star,
  tags,
  title,
  visibility,
}: {
  deckId: string;
  description?: string;
  isOwner: boolean;
  isStarPending: boolean;
  onToggleStar: () => void;
  star: boolean;
  tags: string[];
  title: string;
  visibility: string;
}) {
  return (
    <header className="mt-5 rounded-[28px] border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-[760px]">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#614db7]">
            {visibility} deck
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#1b1c19] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#777474]">
            {description || "No description yet."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                className="rounded-full bg-[#e6deff] px-3 py-1.5 text-xs font-bold text-[#311485]"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-[#e6deff] px-5 py-3 text-sm font-bold text-[#311485]"
            href={`/ai-tutor?deckId=${encodeURIComponent(deckId)}&deckTitle=${encodeURIComponent(title)}`}
          >
            <MessageSquareText className="h-4 w-4" />
            Ask AI
          </Link>
          <button
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold disabled:opacity-60 ${
              star ? "bg-[#fff1b3] text-[#493600]" : "bg-[#f6f3ee] text-[#311485]"
            }`}
            disabled={isStarPending}
            onClick={onToggleStar}
            type="button"
          >
            <Star className={`h-4 w-4 ${star ? "fill-current" : ""}`} />
            {star ? "Starred" : "Star deck"}
          </button>
          {isOwner && (
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-[#f6f3ee] px-5 py-3 text-sm font-bold text-[#311485]"
              href={`/decks/${deckId}/edit`}
            >
              <Edit3 className="h-4 w-4" />
              Edit deck
            </Link>
          )}
          {isOwner && (
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-[#f5d547] px-5 py-3 text-sm font-extrabold text-[#493600]"
              href={`/flashcards?deckId=${deckId}`}
            >
              <Plus className="h-4 w-4" />
              Add cards
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
