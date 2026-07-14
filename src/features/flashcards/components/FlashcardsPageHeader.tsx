import { Sparkles } from "lucide-react";

export function FlashcardsPageHeader() {
  return (
    <header className="mb-8">
      <p className="mb-2 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#614db7]">
        <Sparkles className="h-4 w-4" />
        Build a deck
      </p>
      <h1 className="[font-family:var(--font-outfit)] text-3xl font-extrabold sm:text-4xl">
        Create flashcards
      </h1>
      <p className="mt-2 max-w-[680px] text-sm leading-6 text-[#6e6b68]">
        Create one detailed card or submit a batch through the backend bulk endpoint.
      </p>
    </header>
  );
}
