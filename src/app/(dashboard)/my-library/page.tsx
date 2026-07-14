"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  Layers3,
  LockKeyhole,
  Plus,
  Sparkles,
  Star,
} from "lucide-react";
import { decksAPI, type Deck, type DeckVisibility } from "@/services/api";
import { CreateDeckModal } from "@/features/my-library/components/CreateDeckModal";

type DeckTab = "all" | "mine" | "starred";

const tabs: Array<{ id: DeckTab; label: string }> = [
  { id: "all", label: "All decks" },
  { id: "mine", label: "My decks" },
  { id: "starred", label: "Starred decks" },
];

const visibilityOptions = ["all", "private", "link", "public"] as const;

export default function MyLibraryPage() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("keyword") ?? "";
  const tabParam = searchParams.get("tab");
  const initialTab: DeckTab =
    tabParam === "all" || tabParam === "mine" || tabParam === "starred"
      ? tabParam
      : initialKeyword
        ? "all"
        : "mine";

  return (
    <MyDecksContent
      initialKeyword={initialKeyword}
      initialTab={initialTab}
      key={`${initialTab}:${initialKeyword}`}
    />
  );
}

function MyDecksContent({
  initialKeyword,
  initialTab,
}: {
  initialKeyword: string;
  initialTab: DeckTab;
}) {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const keyword = initialKeyword;
  const [visibility, setVisibility] = useState<DeckVisibility | "all">("all");
  const [activeTab, setActiveTab] = useState<DeckTab>(initialTab);
  const [page, setPage] = useState(1);

  const deckParams = {
    keyword: keyword || undefined,
    visibility: visibility === "all" ? undefined : visibility,
    page,
    take: 9,
  };

  const decksQuery = useQuery({
    queryKey: ["decks", activeTab, deckParams],
    queryFn: () => {
      if (activeTab === "all") {
        return decksAPI.search(deckParams);
      }

      return activeTab === "mine"
        ? decksAPI.getMy(deckParams)
        : decksAPI.getStarred(deckParams);
    },
  });

  const toggleStarMutation = useMutation({
    mutationFn: (deck: Deck) =>
      deck.star ? decksAPI.unstar(deck._id) : decksAPI.star(deck._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });

  const decks = decksQuery.data?.data ?? [];
  const meta = decksQuery.data?.meta;
  const emptyTitle =
    activeTab === "all"
      ? "No decks found"
      : activeTab === "mine"
        ? "No decks found"
        : "No starred decks yet";

  function changeVisibility(next: DeckVisibility | "all") {
    setVisibility(next);
    setPage(1);
  }

  function changeTab(next: DeckTab) {
    setActiveTab(next);
    setPage(1);
  }

  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#614db7]">
              Deck workspace
            </p>
            <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">
              My decks
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6e6b68] sm:text-base">
              Manage the decks you created and the public sets you saved.
            </p>
          </div>
          <button
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#1b1c19] px-5 py-3 text-sm font-bold text-white"
            onClick={() => setIsCreateModalOpen(true)}
            type="button"
          >
            <Plus className="h-4 w-4" />
            New deck
          </button>
        </header>

        <section className="mt-8 rounded-[28px] border border-black/5 bg-white p-4 shadow-[0_12px_36px_rgba(27,28,25,0.05)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-fit rounded-full bg-[#f6f3ee] p-1">
              {tabs.map((tab) => (
                <button
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    activeTab === tab.id
                      ? "bg-[#1b1c19] text-white"
                      : "text-[#777474] hover:text-[#1b1c19]"
                  }`}
                  key={tab.id}
                  onClick={() => changeTab(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-1 flex-wrap gap-2 lg:justify-end">
              {visibilityOptions.map((item) => (
                <button
                  className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${
                    visibility === item
                      ? "bg-[#e6deff] text-[#311485]"
                      : "text-[#777474] hover:bg-[#f6f3ee]"
                  }`}
                  key={item}
                  onClick={() => changeVisibility(item)}
                  type="button"
                >
                  {item === "all" ? "All" : item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-normal">
                {activeTab === "all"
                  ? "All matching decks"
                  : activeTab === "mine"
                    ? "Decks you created"
                    : "Decks you starred"}
              </h2>
              <p className="mt-1 text-sm text-[#777474]">
                {meta?.itemCount ?? decks.length} matching decks
              </p>
            </div>
          </div>

          {decksQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div
                  className="h-56 animate-pulse rounded-[24px] bg-white"
                  key={item}
                />
              ))}
            </div>
          ) : decksQuery.isError ? (
            <div className="rounded-[24px] bg-[#fff0f0] p-6 text-sm font-bold text-[#a33a3a]">
              {decksQuery.error.message}
            </div>
          ) : decks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {decks.map((deck, index) => (
                <DeckCard
                  deck={deck}
                  index={index}
                  isTogglingStar={toggleStarMutation.isPending}
                  key={deck._id}
                  onToggleStar={() => toggleStarMutation.mutate(deck)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-[#bbaef0] bg-[#f6f2ff] px-6 py-14 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]">
                <Sparkles className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-xl font-bold tracking-normal">
                {emptyTitle}
              </h3>
              <p className="mt-2 text-sm text-[#777474]">
                Change the filters or create a new deck.
              </p>
            </div>
          )}

          {meta && meta.pageCount > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                className="rounded-full border border-black/10 p-3 disabled:opacity-40"
                disabled={!meta.hasPreviousPage}
                onClick={() => setPage((value) => value - 1)}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-bold text-[#777474]">
                Page {meta.page} of {meta.pageCount}
              </span>
              <button
                className="rounded-full border border-black/10 p-3 disabled:opacity-40"
                disabled={!meta.hasNextPage}
                onClick={() => setPage((value) => value + 1)}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      </div>
      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

function DeckCard({
  deck,
  index,
  isTogglingStar,
  onToggleStar,
}: {
  deck: Deck;
  index: number;
  isTogglingStar: boolean;
  onToggleStar: () => void;
}) {
  const accentClass =
    index % 3 === 0
      ? "bg-[#e6deff] text-[#614db7]"
      : index % 3 === 1
        ? "bg-[#ffd9e4] text-[#7b3451]"
        : "bg-[#d7f2e3] text-[#276345]";

  return (
    <article className="group relative rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)] transition hover:-translate-y-1 hover:border-[#cabeff]">
      <Link
        aria-label={`Open ${deck.title}`}
        className="absolute inset-0 rounded-[24px]"
        href={`/decks/${deck._id}`}
      />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentClass}`}
        >
          <Layers3 className="h-6 w-6" />
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f6f3ee] px-3 py-1.5 text-[11px] font-bold capitalize text-[#777474]">
            {deck.visibility === "private" && (
              <LockKeyhole className="h-3 w-3" />
            )}
            {deck.visibility}
          </span>
          <button
            aria-label={deck.star ? "Unstar deck" : "Star deck"}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-black/5 ${
              deck.star
                ? "bg-[#fff1b3] text-[#8a5a00]"
                : "bg-white text-[#9a9692] hover:text-[#8a5a00]"
            }`}
            disabled={isTogglingStar}
            onClick={onToggleStar}
            type="button"
          >
            <Star className={`h-4 w-4 ${deck.star ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      <h3 className="relative z-10 mt-5 text-xl font-semibold leading-tight tracking-normal group-hover:text-[#614db7]">
        {deck.title}
      </h3>
      <p className="relative z-10 mt-2 min-h-12 line-clamp-2 text-sm leading-6 text-[#777474]">
        {deck.description || "No description yet."}
      </p>
      <div className="relative z-10 mt-5 flex min-h-6 flex-wrap gap-2">
        {deck.tags.slice(0, 3).map((tag) => (
          <span
            className="rounded-full bg-[#f2eefe] px-3 py-1 text-[11px] font-bold text-[#614db7]"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-black/5 pt-4">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-[#777474]">
          <BookOpenText className="h-4 w-4" />
          {deck.cardCount} cards
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-extrabold text-[#614db7]">
          Open
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}
