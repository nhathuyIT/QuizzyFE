"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BookOpenText, ChevronLeft, ChevronRight, Layers3, LockKeyhole, Plus, Search, Sparkles } from "lucide-react";
import { decksAPI, type DeckVisibility } from "@/services/api";
import { CreateDeckModal } from "@/features/my-library/components/CreateDeckModal";

export default function MyLibraryPage() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("keyword") ?? "";
  return <MyLibraryContent initialKeyword={initialKeyword} key={initialKeyword} />;
}

function MyLibraryContent({ initialKeyword }: { initialKeyword: string }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [visibility, setVisibility] = useState<DeckVisibility | "all">("all");
  const [page, setPage] = useState(1);

  const decksQuery = useQuery({
    queryKey: ["decks", { keyword, visibility, page }],
    queryFn: () => decksAPI.search({ keyword: keyword || undefined, visibility: visibility === "all" ? undefined : visibility, page, take: 9 }),
  });
  const decks = decksQuery.data?.data ?? [];
  const meta = decksQuery.data?.meta;

  function changeVisibility(next: DeckVisibility | "all") {
    setVisibility(next);
    setPage(1);
  }

  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#614db7]">Your collection</p>
            <h1 className="[font-family:var(--font-outfit)] text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">My Library</h1>
            <p className="mt-2 text-sm leading-6 text-[#6e6b68] sm:text-base">Search, filter and continue every deck available to your account.</p>
          </div>
          <button className="inline-flex w-fit items-center gap-2 rounded-full bg-[#1b1c19] px-5 py-3 text-sm font-bold text-white" onClick={() => setIsCreateModalOpen(true)} type="button"><Plus className="h-4 w-4" />New deck</button>
        </header>

        <section className="mt-8 rounded-[28px] border border-black/5 bg-white p-4 shadow-[0_12px_36px_rgba(27,28,25,0.05)] sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-[440px]">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9a9692]" />
              <input className="h-12 w-full rounded-2xl bg-[#f6f3ee] pl-12 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-[#9b87f5]/10" onChange={(event) => { setKeyword(event.target.value); setPage(1); }} placeholder="Search in your library" type="search" value={keyword} />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "private", "link", "public"] as const).map((item) => (
                <button className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${visibility === item ? "bg-[#e6deff] text-[#311485]" : "text-[#777474] hover:bg-[#f6f3ee]"}`} key={item} onClick={() => changeVisibility(item)} type="button">{item === "all" ? "All decks" : item}</button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div><h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold">Flashcard decks</h2><p className="mt-1 text-sm text-[#777474]">{meta?.itemCount ?? decks.length} matching decks</p></div>
          </div>

          {decksQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((item) => <div className="h-56 animate-pulse rounded-[24px] bg-white" key={item} />)}</div>
          ) : decksQuery.isError ? (
            <div className="rounded-[24px] bg-[#fff0f0] p-6 text-sm font-bold text-[#a33a3a]">{decksQuery.error.message}</div>
          ) : decks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {decks.map((deck, index) => (
                <article className="group rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)] transition hover:-translate-y-1 hover:border-[#cabeff]" key={deck._id}>
                  <div className="flex items-start justify-between"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index % 3 === 0 ? "bg-[#e6deff] text-[#614db7]" : index % 3 === 1 ? "bg-[#ffd9e4] text-[#7b3451]" : "bg-[#d7f2e3] text-[#276345]"}`}><Layers3 className="h-6 w-6" /></span><span className="inline-flex items-center gap-1 rounded-full bg-[#f6f3ee] px-3 py-1.5 text-[11px] font-bold capitalize text-[#777474]">{deck.visibility === "private" && <LockKeyhole className="h-3 w-3" />}{deck.visibility}</span></div>
                  <Link href={`/decks/${deck._id}`}><h3 className="mt-5 [font-family:var(--font-outfit)] text-xl font-extrabold hover:text-[#614db7]">{deck.title}</h3></Link>
                  <p className="mt-2 min-h-12 line-clamp-2 text-sm leading-6 text-[#777474]">{deck.description || "No description yet."}</p>
                  <div className="mt-5 flex min-h-6 flex-wrap gap-2">{deck.tags.slice(0, 3).map((tag) => <span className="rounded-full bg-[#f2eefe] px-3 py-1 text-[11px] font-bold text-[#614db7]" key={tag}>{tag}</span>)}</div>
                  <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-4"><span className="inline-flex items-center gap-2 text-xs font-bold text-[#777474]"><BookOpenText className="h-4 w-4" />{deck.cardCount} cards</span><Link className="inline-flex items-center gap-1 text-sm font-extrabold text-[#614db7]" href={`/decks/${deck._id}`}>Open <ChevronRight className="h-4 w-4" /></Link></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-[#bbaef0] bg-[#f6f2ff] px-6 py-14 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]"><Sparkles className="h-7 w-7" /></span><h3 className="mt-5 [font-family:var(--font-outfit)] text-xl font-extrabold">No decks found</h3><p className="mt-2 text-sm text-[#777474]">Change the filters or create a new deck.</p></div>
          )}

          {meta && meta.pageCount > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3"><button className="rounded-full border border-black/10 p-3 disabled:opacity-40" disabled={!meta.hasPreviousPage} onClick={() => setPage((value) => value - 1)} type="button"><ChevronLeft className="h-4 w-4" /></button><span className="text-sm font-bold text-[#777474]">Page {meta.page} of {meta.pageCount}</span><button className="rounded-full border border-black/10 p-3 disabled:opacity-40" disabled={!meta.hasNextPage} onClick={() => setPage((value) => value + 1)} type="button"><ChevronRight className="h-4 w-4" /></button></div>
          )}
        </section>
      </div>
      <CreateDeckModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
