"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BookOpenText, Search } from "lucide-react";
import { cardsAPI, decksAPI } from "@/services/api";

export default function CardsPage() {
  const [keyword, setKeyword] = useState("");
  const cardsQuery = useQuery({ queryKey: ["cards", "all"], queryFn: () => cardsAPI.getAll() });
  const decksQuery = useQuery({ queryKey: ["decks", "all"], queryFn: () => decksAPI.getAll() });
  const deckMap = new Map((decksQuery.data?.data ?? []).map((deck) => [deck._id, deck.title]));
  const cards = (cardsQuery.data?.data ?? []).filter((card) => `${card.front} ${card.back}`.toLowerCase().includes(keyword.toLowerCase()));

  return <div className="h-full overflow-y-auto bg-[#fbf9f4] p-4 sm:p-8"><div className="mx-auto max-w-[1240px]"><header><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#614db7]">Card catalog</p><h1 className="mt-2 [font-family:var(--font-outfit)] text-3xl font-extrabold sm:text-4xl">All cards</h1></header><div className="relative mt-6 max-w-[480px]"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9a9692]" /><input className="h-12 w-full rounded-2xl border border-black/5 bg-white pl-12 pr-4 outline-none focus:ring-4 focus:ring-[#9b87f5]/10" onChange={(event) => setKeyword(event.target.value)} placeholder="Search questions and answers" value={keyword} /></div>{cardsQuery.isError ? <div className="mt-6 rounded-2xl bg-[#fff0f0] p-4 font-bold text-[#a33a3a]">{cardsQuery.error.message}</div> : <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <Link className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#cabeff]" href={`/cards/${card._id}`} key={card._id}><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]"><BookOpenText className="h-5 w-5" /></span><h2 className="mt-5 line-clamp-2 font-bold">{card.front}</h2><p className="mt-3 line-clamp-2 text-sm leading-6 text-[#777474]">{card.back}</p><p className="mt-5 border-t border-black/5 pt-4 text-xs font-bold text-[#9a9692]">{deckMap.get(card.deckId) ?? "Unknown deck"}</p></Link>)}</div>}</div></div>;
}
