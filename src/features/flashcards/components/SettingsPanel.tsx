"use client";

import { useQuery } from "@tanstack/react-query";
import { Layers3, SlidersHorizontal } from "lucide-react";
import { decksAPI } from "@/services/api";

interface DeckOption { _id: string; title: string }
interface DecksResponse { data?: DeckOption[] }
interface SettingsPanelProps { selectedDeckId: string; onDeckChange: (id: string) => void }

export function SettingsPanel({ selectedDeckId, onDeckChange }: SettingsPanelProps) {
  const decksQuery = useQuery({ queryKey: ["decks", "my", "card-settings"], queryFn: () => decksAPI.getMy({ take: 100 }) });
  const decks = (decksQuery.data as DecksResponse | undefined)?.data ?? [];

  return (
    <section className="rounded-[26px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)]">
      <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f2eefe] text-[#614db7]"><SlidersHorizontal className="h-5 w-5" /></span><div><h2 className="[font-family:var(--font-outfit)] text-lg font-extrabold">Card settings</h2><p className="text-xs font-semibold text-[#9a9692]">Choose where this card belongs.</p></div></div>
      <label className="mt-6 block text-sm font-bold">Deck<select className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#fbf9f4] px-4 font-medium outline-none focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10" onChange={(event) => onDeckChange(event.target.value)} value={selectedDeckId}><option value="">Choose a deck</option>{decksQuery.isLoading ? <option disabled>Loading decks...</option> : decks.map((deck) => <option key={deck._id} value={deck._id}>{deck.title}</option>)}</select></label>
      <div className="mt-5 rounded-2xl bg-[#f6f3ee] p-4"><div className="flex items-center gap-2 text-sm font-bold text-[#5f5e5e]"><Layers3 className="h-4 w-4" />Manual flashcard</div><p className="mt-2 text-xs leading-5 text-[#8a8784]">This version creates one standard question-and-answer card at a time.</p></div>
    </section>
  );
}
