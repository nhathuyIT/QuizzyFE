"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  ChevronRight,
  Clock3,
  Flame,
  Layers3,
  MoreHorizontal,
  Plus,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { authAPI, cardProgressAPI, decksAPI, studyAPI } from "@/services/api";

export default function DashboardHome() {
  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe(),
    retry: false,
  });
  const decksQuery = useQuery({
    queryKey: ["decks"],
    queryFn: () => decksAPI.getAll(),
    retry: false,
  });
  const sessionsQuery = useQuery({
    queryKey: ["study", "sessions"],
    queryFn: () => studyAPI.getSessions(),
    retry: false,
  });
  const activeDeckId = decksQuery.data?.data[0]?._id;
  const activeSummaryQuery = useQuery({
    queryKey: ["progress", "summary", activeDeckId],
    queryFn: () => cardProgressAPI.getDeckSummary(activeDeckId!),
    enabled: Boolean(activeDeckId),
  });

  const user = userQuery.data?.data;
  const decks = decksQuery.data?.data ?? [];
  const sessions = sessionsQuery.data?.data ?? [];
  const activeDeck = decks[0];
  const activeSummary = activeSummaryQuery.data?.data;
  const activeProgress = activeSummary?.total ? Math.round((activeSummary.mastered / activeSummary.total) * 100) : 0;
  const firstName = user?.name?.split(" ")[0] || "Learner";
  const today = new Date();
  const todayKey = today.toDateString();
  const reviewedToday = sessions.filter((session) => new Date(session.startedAt).toDateString() === todayKey).reduce((sum, session) => sum + session.stats.correct + session.stats.wrong, 0);
  const studyDays = new Set(sessions.filter((session) => session.stats.correct + session.stats.wrong > 0).map((session) => new Date(session.startedAt).toDateString()));
  let streak = 0;
  for (let offset = 0; offset < 365; offset += 1) {
    const date = new Date(today); date.setDate(today.getDate() - offset);
    if (!studyDays.has(date.toDateString())) break;
    streak += 1;
  }
  const week = Array.from({ length: 7 }, (_, index) => { const date = new Date(today); date.setDate(today.getDate() - (6 - index)); return { label: date.toLocaleDateString("en", { weekday: "narrow" }), done: studyDays.has(date.toDateString()) }; });
  const goal = 20;
  const goalPercent = Math.min(100, Math.round((reviewedToday / goal) * 100));

  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#614db7]">
              Your study space
            </p>
            <h1 className="[font-family:var(--font-outfit)] text-3xl font-extrabold tracking-[-0.03em] text-[#1b1c19] sm:text-4xl">
              Welcome back, {firstName}.
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6e6b68] sm:text-base">
              Pick up a deck or turn today&apos;s notes into something worth remembering.
            </p>
          </div>
          <Link
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#1b1c19] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#30312e]"
            href="/flashcards"
          >
            <Plus className="h-4 w-4" />
            Create cards
          </Link>
        </header>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-10">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold tracking-[-0.02em]">
                  Continue studying
                </h2>
                <button
                  aria-label="More study options"
                  className="rounded-full p-2 text-[#777474] hover:bg-white"
                  type="button"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              {activeDeck ? <article className="relative overflow-hidden rounded-[30px] border border-[#cfc4f5] bg-[#e6deff] p-6 shadow-[0_18px_50px_rgba(49,20,133,0.09)] sm:p-8">
                <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-[#9b87f5]/35" />
                <div className="pointer-events-none absolute bottom-[-90px] right-24 h-48 w-48 rotate-12 rounded-[40px] bg-[#f5d547]/55" />
                <div className="relative z-10 max-w-[650px]">
                  <div className="mb-7 flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#311485] text-white">
                      <BookOpenText className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#614db7]">
                        Current deck
                      </p>
                      <h3 className="mt-1 [font-family:var(--font-outfit)] text-2xl font-extrabold text-[#311485] sm:text-3xl">
                        {activeDeck.title}
                      </h3>
                    </div>
                  </div>
                  <p className="max-w-[560px] text-sm leading-6 text-[#4e3d88] sm:text-base">
                    {activeDeck.description || "Your next review is ready whenever you are."}
                  </p>
                  <div className="mt-7 max-w-[520px]">
                    <div className="mb-2 flex justify-between text-xs font-bold text-[#4e3d88]">
                      <span>Review progress</span>
                      <span>Ready to continue</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/60">
                      <div className="h-full rounded-full bg-[#614db7]" style={{ width: `${activeProgress}%` }} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#4e3d88]">
                      {activeDeck.cardCount ?? 0} cards in this deck
                    </p>
                  </div>
                  <Link
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#614db7] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#614db7]/20 transition hover:-translate-y-0.5 hover:bg-[#49339d]"
                    href={`/decks/${activeDeck._id}`}
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article> : <div className="rounded-[30px] border border-dashed border-[#cabeff] bg-[#f6f2ff] p-8 text-center"><BookOpenText className="mx-auto h-9 w-9 text-[#614db7]" /><h3 className="mt-4 text-xl font-extrabold">Create your first deck</h3><p className="mt-2 text-sm text-[#777474]">Your real decks will appear here after creation.</p><Link className="mt-5 inline-flex rounded-full bg-[#614db7] px-5 py-3 text-sm font-bold text-white" href="/my-library">Open library</Link></div>}
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold tracking-[-0.02em]">
                    Recent decks
                  </h2>
                  <p className="mt-1 text-sm text-[#777474]">Jump back into your latest material.</p>
                </div>
                <Link
                  className="hidden items-center gap-1 text-sm font-bold text-[#614db7] hover:text-[#49339d] sm:flex"
                  href="/my-library"
                >
                  View library <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {decks.slice(0, 4).map((deck, index) => (
                  <Link
                    className="group rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)] transition hover:-translate-y-1 hover:border-[#cabeff] hover:shadow-[0_18px_44px_rgba(49,20,133,0.09)]"
                    href={`/decks/${deck._id}`}
                    key={deck._id}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${index % 2 === 0 ? "bg-[#ffd9e4] text-[#7b3451]" : "bg-[#d7f2e3] text-[#276345]"}`}>
                        <Layers3 className="h-5 w-5" />
                      </span>
                      <ChevronRight className="h-5 w-5 text-[#aaa5a0] transition group-hover:translate-x-1 group-hover:text-[#614db7]" />
                    </div>
                    <h3 className="mt-5 [font-family:var(--font-outfit)] text-lg font-extrabold text-[#1b1c19]">{deck.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#777474]">
                      {deck.description || "A focused set of cards ready for active recall."}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4 text-xs font-bold text-[#777474]">
                      <span>{deck.cardCount ?? 0} cards</span>
                      <span>{deck.tags?.[0] || "Flashcards"}</span>
                    </div>
                  </Link>
                ))}
              </div>
              {!decks.length && <p className="rounded-[22px] bg-white p-5 text-sm text-[#777474]">No recent decks yet.</p>}
            </section>

            <section className="rounded-[28px] bg-[#1b1c19] p-6 text-white sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-[590px]">
                  <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#cabeff]">
                    <Sparkles className="h-4 w-4" /> Build faster
                  </p>
                  <h2 className="mt-3 [font-family:var(--font-outfit)] text-2xl font-extrabold sm:text-3xl">Turn rough notes into a clean study deck.</h2>
                  <p className="mt-3 text-sm leading-6 text-white/65 sm:text-base">Start with manual cards today. AI generation will slot into this same workflow when the backend is ready.</p>
                </div>
                <Link className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#f5d547] px-6 py-3 text-sm font-extrabold text-[#493600] transition hover:-translate-y-0.5 hover:bg-[#ffe36a]" href="/flashcards">
                  Start creating <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-[26px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#9a6900]">Daily streak</p>
                  <p className="mt-2 [font-family:var(--font-outfit)] text-3xl font-extrabold">{streak} days</p>
                </div>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1b3] text-[#b06f00]"><Flame className="h-7 w-7" /></span>
              </div>
              <div className="mt-6 grid grid-cols-7 gap-1.5">
                {week.map((day, index) => (
                  <div className="text-center" key={index}>
                    <span className={`mx-auto block h-7 w-7 rounded-full ${day.done ? "bg-[#f5d547]" : "bg-[#f0ece7]"}`} />
                    <span className="mt-2 block text-[10px] font-bold text-[#9a9692]">{day.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[26px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]"><Target className="h-5 w-5" /></span>
                <div><h2 className="[font-family:var(--font-outfit)] text-lg font-extrabold">Today&apos;s goal</h2><p className="text-xs font-semibold text-[#777474]">Review 20 cards</p></div>
              </div>
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#eee9e2]"><div className="h-full rounded-full bg-[#9b87f5]" style={{ width: `${goalPercent}%` }} /></div>
              <div className="mt-3 flex justify-between text-xs font-bold text-[#777474]"><span>{reviewedToday} completed</span><span>{Math.max(0, goal - reviewedToday)} remaining</span></div>
            </section>

            <section className="rounded-[26px] bg-[#311485] p-5 text-white shadow-[0_16px_40px_rgba(49,20,133,0.18)]">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#f5d547]"><Trophy className="h-5 w-5" /></span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#cabeff]">{user?.totalPoints ?? 0} XP</span>
              </div>
              <h2 className="mt-6 [font-family:var(--font-outfit)] text-xl font-extrabold">Your momentum</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">One short review today keeps your learning rhythm moving.</p>
              <Link className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#f5d547]" href="/my-library">Choose a deck <ArrowRight className="h-4 w-4" /></Link>
            </section>

            <section className="rounded-[26px] border border-black/5 bg-[#f2eefe] p-5">
              <div className="flex items-center gap-3 text-[#614db7]"><BrainCircuit className="h-5 w-5" /><p className="text-xs font-extrabold uppercase tracking-[0.13em]">Quick tip</p></div>
              <p className="mt-4 text-sm font-semibold leading-6 text-[#4e3d88]">Short, repeated sessions usually beat one long review. Aim for ten focused minutes.</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#7566aa]"><Clock3 className="h-4 w-4" />About 10 minutes</div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
