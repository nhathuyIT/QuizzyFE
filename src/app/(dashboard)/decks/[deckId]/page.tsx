"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CardsList } from "@/features/decks/detail/components/CardsList";
import { DeckHeader } from "@/features/decks/detail/components/DeckHeader";
import { DueCardsPanel } from "@/features/decks/detail/components/DueCardsPanel";
import { Stat } from "@/features/decks/detail/components/Stat";
import { TrackedSessionPanel } from "@/features/decks/detail/components/TrackedSessionPanel";
import { DeckPracticeSurface } from "@/features/decks/study/components/DeckPracticeSurface";
import {
  authAPI,
  cardProgressAPI,
  cardsAPI,
  decksAPI,
  studyAPI,
  type CardProgress,
  type StudyMode,
} from "@/services/api";

export default function DeckDetailPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const deckQuery = useQuery({
    queryKey: ["decks", deckId],
    queryFn: () => decksAPI.getById(deckId),
  });
  const cardsQuery = useQuery({
    queryKey: ["cards", "deck", deckId],
    queryFn: () => cardsAPI.getByDeckId(deckId),
  });
  const summaryQuery = useQuery({
    queryKey: ["progress", "summary", deckId],
    queryFn: () => cardProgressAPI.getDeckSummary(deckId),
  });
  const dueQuery = useQuery({
    queryKey: ["progress", "due", deckId],
    queryFn: () => cardProgressAPI.getDueCards(deckId),
  });
  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe(),
  });

  const deck = deckQuery.data?.data;
  const cards = useMemo(() => cardsQuery.data?.data ?? [], [cardsQuery.data?.data]);
  const summary = summaryQuery.data?.data;
  const dueCards = dueQuery.data?.data ?? [];
  const cardMap = useMemo(() => new Map(cards.map((card) => [card._id, card])), [cards]);
  const isOwner = deck?.createdBy === userQuery.data?.data.id;

  const startMutation = useMutation({
    mutationFn: (mode: StudyMode) => studyAPI.createSession(deckId, mode),
    onSuccess: (response) => router.push(`/study/${response.data._id}`),
  });
  const starMutation = useMutation({
    mutationFn: () => (deck?.star ? decksAPI.unstar(deckId) : decksAPI.star(deckId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks", deckId] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
  const progressMutation = useMutation({
    mutationFn: ({ progress, mastered }: { progress: CardProgress; mastered: boolean }) => {
      const dueAt = new Date();
      dueAt.setDate(dueAt.getDate() + (mastered ? 30 : 1));

      return cardProgressAPI.upsert({
        ...progress,
        status: mastered ? "mastered" : "review",
        mastery: mastered ? 100 : Math.max(progress.mastery, 10),
        intervalDays: mastered ? 30 : 1,
        dueAt: dueAt.toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", "summary", deckId] });
      queryClient.invalidateQueries({ queryKey: ["progress", "due", deckId] });
    },
  });

  if (deckQuery.isLoading) return <PageLoading />;
  if (deckQuery.isError || !deck) {
    return <PageError message={deckQuery.error?.message ?? "Deck not found."} />;
  }

  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-bold text-[#777474]"
          href="/my-library"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my decks
        </Link>

        <DeckHeader
          deckId={deckId}
          description={deck.description}
          isOwner={Boolean(isOwner)}
          isStarPending={starMutation.isPending}
          onToggleStar={() => starMutation.mutate()}
          star={Boolean(deck.star)}
          tags={deck.tags}
          title={deck.title}
          visibility={deck.visibility}
        />

        <DeckPracticeSurface
          cards={cards}
          deckId={deckId}
          isLoading={cardsQuery.isLoading}
          isOwner={Boolean(isOwner)}
        />

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <Stat label="Total" value={summary?.total ?? deck.cardCount} />
          <Stat label="Due today" value={summary?.dueToday ?? 0} />
          <Stat label="New" value={summary?.new ?? 0} />
          <Stat label="Learning" value={summary?.learning ?? 0} />
          <Stat label="Review" value={summary?.review ?? 0} />
          <Stat label="Mastered" value={summary?.mastered ?? 0} />
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <CardsList cards={cards} isLoading={cardsQuery.isLoading} />
          <aside className="space-y-5">
            <TrackedSessionPanel
              cardCount={cards.length}
              error={startMutation.error?.message}
              isError={startMutation.isError}
              isPending={startMutation.isPending}
              onStart={(mode) => startMutation.mutate(mode)}
            />
            <DueCardsPanel
              cardMap={cardMap}
              dueCards={dueCards}
              isPending={progressMutation.isPending}
              onUpdate={(progress, mastered) =>
                progressMutation.mutate({ progress, mastered })
              }
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

function PageLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-[#614db7]" />
    </div>
  );
}

function PageError({ message }: { message: string }) {
  return (
    <div className="p-8">
      <div className="rounded-[24px] bg-[#fff0f0] p-6 font-bold text-[#a33a3a]">
        {message}
      </div>
    </div>
  );
}
