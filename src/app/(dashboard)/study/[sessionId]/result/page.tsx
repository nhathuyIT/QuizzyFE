"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Clock3, Loader2, RotateCcw, XCircle } from "lucide-react";
import { decksAPI, studyAPI } from "@/services/api";

export default function StudyResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sessionQuery = useQuery({ queryKey: ["study", "session", sessionId], queryFn: () => studyAPI.getSession(sessionId) });
  const session = sessionQuery.data?.data;
  const deckQuery = useQuery({ queryKey: ["decks", session?.deckId], queryFn: () => decksAPI.getById(session!.deckId), enabled: Boolean(session?.deckId) });
  if (sessionQuery.isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#614db7]" /></div>;
  if (!session) return <div className="p-8">Session not found.</div>;
  const total = session.stats.correct + session.stats.wrong;
  const score = total ? Math.round((session.stats.correct / total) * 100) : 0;
  return <div className="h-full overflow-y-auto bg-[#fbf9f4] p-4 sm:p-8"><div className="mx-auto max-w-[820px]"><section className="rounded-[32px] bg-[#311485] p-7 text-center text-white sm:p-10"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-[#f5d547]"><CheckCircle2 className="h-8 w-8" /></span><p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[#cabeff]">Session complete</p><h1 className="mt-3 [font-family:var(--font-outfit)] text-4xl font-extrabold">{deckQuery.data?.data.title ?? "Study results"}</h1><p className="mt-4 text-6xl font-extrabold text-[#f5d547]">{score}%</p></section><div className="mt-5 grid gap-4 sm:grid-cols-3"><Stat icon={<CheckCircle2 />} label="Correct" value={session.stats.correct} color="text-[#276345] bg-[#d7f2e3]" /><Stat icon={<XCircle />} label="Wrong" value={session.stats.wrong} color="text-[#8e3030] bg-[#ffd9e4]" /><Stat icon={<Clock3 />} label="Time" value={`${session.stats.timeSpentSec}s`} color="text-[#614db7] bg-[#e6deff]" /></div><div className="mt-6 flex flex-wrap justify-center gap-3"><Link className="inline-flex items-center gap-2 rounded-full bg-[#614db7] px-6 py-3 text-sm font-bold text-white" href={`/decks/${session.deckId}`}><RotateCcw className="h-4 w-4" />Study again</Link><Link className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-bold" href="/study-history">View history <ArrowRight className="h-4 w-4" /></Link></div></div></div>;
}
function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) { return <div className="rounded-[24px] border border-black/5 bg-white p-5"><span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${color}`}>{icon}</span><p className="mt-4 text-xs font-bold uppercase tracking-[0.1em] text-[#9a9692]">{label}</p><p className="mt-1 text-2xl font-extrabold">{value}</p></div>; }
