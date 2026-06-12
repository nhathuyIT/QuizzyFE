"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookOpenText, BrainCircuit, CheckCircle2, Clock3, Edit3, Layers3, Loader2, Plus, RotateCcw } from "lucide-react";
import { authAPI, cardProgressAPI, cardsAPI, decksAPI, studyAPI, type CardProgress, type StudyMode } from "@/services/api";

const modes: Array<{ id: StudyMode; label: string }> = [
  { id: "flashcard", label: "Flashcards" },
  { id: "learn", label: "Learn" },
  { id: "test", label: "Test" },
  { id: "match", label: "Match" },
];

export default function DeckDetailPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const deckQuery = useQuery({ queryKey: ["decks", deckId], queryFn: () => decksAPI.getById(deckId) });
  const cardsQuery = useQuery({ queryKey: ["cards", "deck", deckId], queryFn: () => cardsAPI.getByDeckId(deckId) });
  const summaryQuery = useQuery({ queryKey: ["progress", "summary", deckId], queryFn: () => cardProgressAPI.getDeckSummary(deckId) });
  const dueQuery = useQuery({ queryKey: ["progress", "due", deckId], queryFn: () => cardProgressAPI.getDueCards(deckId) });
  const userQuery = useQuery({ queryKey: ["auth", "me"], queryFn: () => authAPI.getMe() });
  const startMutation = useMutation({ mutationFn: (mode: StudyMode) => studyAPI.createSession(deckId, mode), onSuccess: (response) => router.push(`/study/${response.data._id}`) });
  const progressMutation = useMutation({
    mutationFn: ({ progress, mastered }: { progress: CardProgress; mastered: boolean }) => {
      const dueAt = new Date();
      dueAt.setDate(dueAt.getDate() + (mastered ? 30 : 1));
      return cardProgressAPI.upsert({ ...progress, status: mastered ? "mastered" : "review", mastery: mastered ? 100 : Math.max(progress.mastery, 10), intervalDays: mastered ? 30 : 1, dueAt: dueAt.toISOString() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", "summary", deckId] });
      queryClient.invalidateQueries({ queryKey: ["progress", "due", deckId] });
    },
  });

  const deck = deckQuery.data?.data;
  const cards = cardsQuery.data?.data ?? [];
  const summary = summaryQuery.data?.data;
  const dueCards = dueQuery.data?.data ?? [];
  const cardMap = new Map(cards.map((card) => [card._id, card]));
  const isOwner = deck?.createdBy === userQuery.data?.data.id;

  if (deckQuery.isLoading) return <PageLoading />;
  if (deckQuery.isError || !deck) return <PageError message={deckQuery.error?.message ?? "Deck not found."} />;

  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#777474]" href="/my-library"><ArrowLeft className="h-4 w-4" />Back to library</Link>
        <header className="mt-5 rounded-[30px] bg-[#311485] p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#cabeff]">{deck.visibility} deck</p><h1 className="mt-3 [font-family:var(--font-outfit)] text-3xl font-extrabold sm:text-5xl">{deck.title}</h1><p className="mt-4 text-sm leading-6 text-white/70 sm:text-base">{deck.description || "No description yet."}</p><div className="mt-5 flex flex-wrap gap-2">{deck.tags.map((tag) => <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold" key={tag}>{tag}</span>)}</div></div>
            <div className="flex flex-wrap gap-3">{isOwner && <Link className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold" href={`/decks/${deckId}/edit`}><Edit3 className="h-4 w-4" />Edit deck</Link>}<Link className="inline-flex items-center gap-2 rounded-full bg-[#f5d547] px-5 py-3 text-sm font-extrabold text-[#493600]" href={`/flashcards?deckId=${deckId}`}><Plus className="h-4 w-4" />Add cards</Link></div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <Stat label="Total" value={summary?.total ?? deck.cardCount} /><Stat label="Due today" value={summary?.dueToday ?? 0} /><Stat label="New" value={summary?.new ?? 0} /><Stat label="Learning" value={summary?.learning ?? 0} /><Stat label="Review" value={summary?.review ?? 0} /><Stat label="Mastered" value={summary?.mastered ?? 0} />
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between"><div><h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold">Cards</h2><p className="mt-1 text-sm text-[#777474]">{cards.length} cards ordered for study</p></div><Layers3 className="h-6 w-6 text-[#614db7]" /></div>
            {cardsQuery.isLoading ? <p className="mt-6 text-sm text-[#777474]">Loading cards...</p> : cards.length ? <div className="mt-6 space-y-3">{cards.map((card, index) => <Link className="flex items-center gap-4 rounded-[20px] border border-black/5 bg-[#fbf9f4] p-4 transition hover:border-[#cabeff]" href={`/cards/${card._id}`} key={card._id}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6deff] text-sm font-extrabold text-[#614db7]">{index + 1}</span><div className="min-w-0"><p className="truncate font-bold">{card.front}</p><p className="mt-1 truncate text-sm text-[#777474]">{card.back}</p></div></Link>)}</div> : <div className="mt-6 rounded-[22px] border border-dashed border-[#cabeff] p-8 text-center"><BookOpenText className="mx-auto h-8 w-8 text-[#614db7]" /><p className="mt-3 font-bold">This deck has no cards yet.</p></div>}
          </section>

          <aside className="space-y-5">
            <section className="rounded-[26px] bg-[#e6deff] p-5"><div className="flex items-center gap-3 text-[#311485]"><BrainCircuit className="h-6 w-6" /><h2 className="[font-family:var(--font-outfit)] text-xl font-extrabold">Start studying</h2></div><p className="mt-3 text-sm leading-6 text-[#4e3d88]">Choose a backend-supported study mode.</p><div className="mt-5 grid grid-cols-2 gap-2">{modes.map((mode) => <button className="rounded-2xl bg-white px-3 py-3 text-sm font-bold text-[#311485] disabled:opacity-50" disabled={!cards.length || startMutation.isPending} key={mode.id} onClick={() => startMutation.mutate(mode.id)} type="button">{startMutation.isPending ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : mode.label}</button>)}</div>{startMutation.isError && <p className="mt-3 text-sm font-bold text-[#a33a3a]">{startMutation.error.message}</p>}</section>
            <section className="rounded-[26px] border border-black/5 bg-white p-5"><div className="flex items-center justify-between"><h2 className="[font-family:var(--font-outfit)] text-lg font-extrabold">Due cards</h2><Clock3 className="h-5 w-5 text-[#614db7]" /></div>{dueCards.length ? <div className="mt-4 space-y-4">{dueCards.slice(0, 5).map((progress) => <div className="rounded-2xl bg-[#f6f3ee] p-4" key={progress._id}><p className="truncate text-sm font-bold">{cardMap.get(progress.cardId)?.front ?? "Card"}</p><p className="mt-1 text-xs text-[#777474]">{progress.mastery}% mastery · {progress.status}</p><div className="mt-3 flex gap-2"><button className="flex-1 rounded-full bg-white px-3 py-2 text-xs font-bold" disabled={progressMutation.isPending} onClick={() => progressMutation.mutate({ progress, mastered: false })} type="button"><RotateCcw className="mr-1 inline h-3 w-3" />Tomorrow</button><button className="flex-1 rounded-full bg-[#d7f2e3] px-3 py-2 text-xs font-bold text-[#276345]" disabled={progressMutation.isPending} onClick={() => progressMutation.mutate({ progress, mastered: true })} type="button"><CheckCircle2 className="mr-1 inline h-3 w-3" />Mastered</button></div></div>)}</div> : <p className="mt-4 text-sm text-[#777474]">No cards are due right now.</p>}</section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-[22px] border border-black/5 bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#9a9692]">{label}</p><p className="mt-2 [font-family:var(--font-outfit)] text-2xl font-extrabold">{value}</p></div>; }
function PageLoading() { return <div className="flex h-full items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#614db7]" /></div>; }
function PageError({ message }: { message: string }) { return <div className="p-8"><div className="rounded-[24px] bg-[#fff0f0] p-6 font-bold text-[#a33a3a]">{message}</div></div>; }
