"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { cardsAPI, decksAPI, studyAPI, type ReviewResult } from "@/services/api";

export default function StudySessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<ReviewResult | null>(null);
  const sessionQuery = useQuery({ queryKey: ["study", "session", sessionId], queryFn: () => studyAPI.getSession(sessionId) });
  const session = sessionQuery.data?.data;
  const deckQuery = useQuery({ queryKey: ["decks", session?.deckId], queryFn: () => decksAPI.getById(session!.deckId), enabled: Boolean(session?.deckId) });
  const cardsQuery = useQuery({ queryKey: ["cards", "deck", session?.deckId], queryFn: () => cardsAPI.getByDeckId(session!.deckId), enabled: Boolean(session?.deckId) });
  const reviewMutation = useMutation({ mutationFn: () => studyAPI.logReview(sessionId, cards[index]._id, answer.trim()), onSuccess: (response) => { setFeedback(response.data); queryClient.invalidateQueries({ queryKey: ["progress"] }); } });
  const finishMutation = useMutation({ mutationFn: () => studyAPI.finishSession(sessionId), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["study"] }); router.push(`/study/${sessionId}/result`); } });
  const cards = cardsQuery.data?.data ?? [];
  const currentCard = cards[index];

  useEffect(() => { if (session?.finishedAt) router.replace(`/study/${sessionId}/result`); }, [router, session?.finishedAt, sessionId]);

  function submit(event: FormEvent) { event.preventDefault(); if (!answer.trim() || !currentCard) return; reviewMutation.mutate(); }
  function next() { if (index >= cards.length - 1) { finishMutation.mutate(); return; } setIndex((value) => value + 1); setAnswer(""); setFeedback(null); }

  if (sessionQuery.isLoading || cardsQuery.isLoading) return <Loading />;
  if (sessionQuery.isError || cardsQuery.isError || !session) return <ErrorBox message={sessionQuery.error?.message ?? cardsQuery.error?.message ?? "Session not found."} />;
  if (!cards.length) return <div className="p-8"><div className="mx-auto max-w-[620px] rounded-[28px] bg-white p-8 text-center"><h1 className="text-2xl font-extrabold">No cards to study</h1><Link className="mt-5 inline-block rounded-full bg-[#614db7] px-5 py-3 text-sm font-bold text-white" href={`/flashcards?deckId=${session.deckId}`}>Add cards</Link></div></div>;

  return <div className="h-full overflow-y-auto bg-[#fbf9f4] p-4 sm:p-8"><div className="mx-auto max-w-[900px]"><div className="flex items-center justify-between"><Link className="inline-flex items-center gap-2 text-sm font-bold text-[#777474]" href={`/decks/${session.deckId}`}><ArrowLeft className="h-4 w-4" />Leave session</Link><span className="rounded-full bg-[#e6deff] px-4 py-2 text-xs font-extrabold capitalize text-[#311485]">{session.mode}</span></div><div className="mt-6 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e7e2db]"><div className="h-full rounded-full bg-[#614db7] transition-all" style={{ width: `${((index + (feedback ? 1 : 0)) / cards.length) * 100}%` }} /></div><span className="text-sm font-bold text-[#777474]">{index + 1}/{cards.length}</span></div><section className="mt-6 rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_20px_60px_rgba(27,28,25,0.07)] sm:p-10"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#614db7]">{deckQuery.data?.data.title ?? "Study card"}</p><h1 className="mt-6 [font-family:var(--font-outfit)] text-3xl font-extrabold leading-tight sm:text-4xl">{currentCard.front}</h1>{currentCard.hint && !feedback && <details className="mt-6 rounded-2xl bg-[#f6f3ee] p-4 text-sm text-[#777474]"><summary className="cursor-pointer font-bold text-[#614db7]">Show hint</summary><p className="mt-3 leading-6">{currentCard.hint}</p></details>}{!feedback ? <form className="mt-8" onSubmit={submit}><label className="text-sm font-bold">Your answer<textarea autoFocus className="mt-2 min-h-36 w-full resize-none rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 text-lg outline-none focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10" onChange={(event) => setAnswer(event.target.value)} placeholder="Type your answer" value={answer} /></label>{reviewMutation.isError && <p className="mt-3 text-sm font-bold text-[#a33a3a]">{reviewMutation.error.message}</p>}<button className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#614db7] px-6 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={!answer.trim() || reviewMutation.isPending} type="submit">{reviewMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Check answer</button></form> : <div className={`mt-8 rounded-[24px] p-5 ${feedback.isCorrect ? "bg-[#e4f5eb] text-[#205c3c]" : "bg-[#fff0f0] text-[#8e3030]"}`}><div className="flex items-center gap-3">{feedback.isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}<h2 className="text-lg font-extrabold">{feedback.isCorrect ? "Correct" : "Keep reviewing"}</h2></div>{!feedback.isCorrect && <p className="mt-4 text-sm"><strong>Correct answer:</strong> {feedback.correctAnswer}</p>}{feedback.explanation && <p className="mt-3 text-sm leading-6">{feedback.explanation}</p>}<p className="mt-3 text-xs font-bold uppercase tracking-[0.1em]">Mastery {feedback.progressUpdate.mastery}% · {feedback.progressUpdate.status}</p><button className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1b1c19] px-6 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={finishMutation.isPending} onClick={next} type="button">{finishMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : index === cards.length - 1 ? "Finish session" : <>Next card <ArrowRight className="h-4 w-4" /></>}</button></div>}</section></div></div>;
}

function Loading() { return <div className="flex h-full items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#614db7]" /></div>; }
function ErrorBox({ message }: { message: string }) { return <div className="p-8"><div className="rounded-2xl bg-[#fff0f0] p-5 font-bold text-[#a33a3a]">{message}</div></div>; }
