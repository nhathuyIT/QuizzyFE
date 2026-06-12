"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpenText, ImageIcon, Lightbulb, Loader2 } from "lucide-react";
import { cardsAPI, decksAPI } from "@/services/api";

export default function CardDetailPage() {
  const { cardId } = useParams<{ cardId: string }>();
  const cardQuery = useQuery({ queryKey: ["cards", cardId], queryFn: () => cardsAPI.getById(cardId) });
  const card = cardQuery.data?.data;
  const deckQuery = useQuery({ queryKey: ["decks", card?.deckId], queryFn: () => decksAPI.getById(card!.deckId), enabled: Boolean(card?.deckId) });
  if (cardQuery.isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#614db7]" /></div>;
  if (!card || cardQuery.isError) return <div className="p-8"><div className="rounded-2xl bg-[#fff0f0] p-5 font-bold text-[#a33a3a]">{cardQuery.error?.message ?? "Card not found."}</div></div>;
  return <div className="h-full overflow-y-auto bg-[#fbf9f4] p-4 sm:p-8"><div className="mx-auto max-w-[900px]"><Link className="inline-flex items-center gap-2 text-sm font-bold text-[#777474]" href={`/decks/${card.deckId}`}><ArrowLeft className="h-4 w-4" />Back to {deckQuery.data?.data.title ?? "deck"}</Link><div className="mt-6 grid gap-5 md:grid-cols-2"><section className="min-h-72 rounded-[30px] bg-[#311485] p-7 text-white"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#cabeff]">Front</p><h1 className="mt-8 [font-family:var(--font-outfit)] text-3xl font-extrabold leading-tight">{card.front}</h1></section><section className="min-h-72 rounded-[30px] border border-black/5 bg-white p-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#614db7]">Back</p><p className="mt-8 text-xl font-bold leading-8">{card.back}</p></section></div><div className="mt-5 grid gap-5 md:grid-cols-2">{card.hint && <Info icon={<Lightbulb className="h-5 w-5" />} label="Hint" text={card.hint} />}{card.explanation && <Info icon={<BookOpenText className="h-5 w-5" />} label="Explanation" text={card.explanation} />}{card.imageUrl && <section className="rounded-[24px] border border-black/5 bg-white p-5"><p className="flex items-center gap-2 font-bold"><ImageIcon className="h-5 w-5" />Image URL</p><a className="mt-3 block break-all text-sm text-[#614db7] underline" href={card.imageUrl} rel="noreferrer" target="_blank">{card.imageUrl}</a></section>}{card.examples.length > 0 && <section className="rounded-[24px] border border-black/5 bg-white p-5"><p className="font-bold">Examples</p><ul className="mt-3 space-y-2 text-sm text-[#777474]">{card.examples.map((example) => <li key={example}>• {example}</li>)}</ul></section>}</div></div></div>;
}
function Info({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) { return <section className="rounded-[24px] border border-black/5 bg-white p-5"><p className="flex items-center gap-2 font-bold text-[#614db7]">{icon}{label}</p><p className="mt-3 text-sm leading-6 text-[#5f5e5e]">{text}</p></section>; }
