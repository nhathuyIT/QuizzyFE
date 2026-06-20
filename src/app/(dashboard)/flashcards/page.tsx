"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Save, Sparkles } from "lucide-react";
import { cardsAPI, type CardInput } from "@/services/api";
import { InputTabs, type CardInputMode } from "@/features/flashcards/components/InputTabs";
import { SettingsPanel } from "@/features/flashcards/components/SettingsPanel";

interface StatusMessage { text: string; type: "" | "error" | "success" }

export default function FlashcardsPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [selectedDeckId, setSelectedDeckId] = useState(searchParams.get("deckId") ?? "");
  const [mode, setMode] = useState<CardInputMode>("manual");
  const [front, setFront] = useState(""); const [back, setBack] = useState("");
  const [hint, setHint] = useState(""); const [explanation, setExplanation] = useState("");
  const [examples, setExamples] = useState(""); const [bulkText, setBulkText] = useState("");
  const [statusMsg, setStatusMsg] = useState<StatusMessage>({ text: "", type: "" });
  const deckCardsQuery = useQuery({ queryKey: ["cards", "deck", selectedDeckId], queryFn: () => cardsAPI.getByDeckId(selectedDeckId), enabled: Boolean(selectedDeckId) });
  const nextPosition = deckCardsQuery.data?.data.length ?? 0;
  const parsedBulkCards = useMemo(() => bulkText.split("\n").map((line) => line.trim()).filter(Boolean).map((line, index) => { const [frontValue, ...backParts] = line.split("::"); return { deckId: selectedDeckId, front: frontValue?.trim() ?? "", back: backParts.join("::").trim(), position: nextPosition + index }; }), [bulkText, nextPosition, selectedDeckId]);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (mode === "bulk") {
        const response = await cardsAPI.bulkCreate(parsedBulkCards);
        return { count: response.data.length };
      }
      const card: CardInput = { deckId: selectedDeckId, front: front.trim(), back: back.trim(), hint: hint.trim() || undefined, explanation: explanation.trim() || undefined, examples: examples.split("\n").map((item) => item.trim()).filter(Boolean), position: nextPosition };
      await cardsAPI.create(card);
      return { count: 1 };
    },
    onSuccess: (response) => {
      const count = response.count;
      setStatusMsg({ text: `${count} card${count > 1 ? "s" : ""} created successfully.`, type: "success" });
      setFront(""); setBack(""); setHint(""); setExplanation(""); setExamples(""); setBulkText("");
      queryClient.invalidateQueries({ queryKey: ["cards"] }); queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
    onError: (error: Error) => setStatusMsg({ text: error.message, type: "error" }),
  });

  function handleCreate() {
    setStatusMsg({ text: "", type: "" });
    if (!selectedDeckId) return setStatusMsg({ text: "Choose a deck before saving.", type: "error" });
    if (mode === "upload") return setStatusMsg({ text: "The backend does not expose an upload endpoint yet.", type: "error" });
    if (mode === "bulk" && (!parsedBulkCards.length || parsedBulkCards.some((card) => !card.front || !card.back))) return setStatusMsg({ text: "Each bulk line must use the format front :: back.", type: "error" });
    if (mode === "manual" && (!front.trim() || !back.trim())) return setStatusMsg({ text: "Front and back are required.", type: "error" });
    createMutation.mutate();
  }

  return <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar"><div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8"><header className="mb-8"><p className="mb-2 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#614db7]"><Sparkles className="h-4 w-4" />Build a deck</p><h1 className="[font-family:var(--font-outfit)] text-3xl font-extrabold sm:text-4xl">Create flashcards</h1><p className="mt-2 max-w-[680px] text-sm leading-6 text-[#6e6b68]">Create one detailed card or submit a batch through the backend bulk endpoint.</p></header><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><InputTabs back={back} bulkText={bulkText} examples={examples} explanation={explanation} front={front} hint={hint} mode={mode} onModeChange={setMode} setBack={setBack} setBulkText={setBulkText} setExamples={setExamples} setExplanation={setExplanation} setFront={setFront} setHint={setHint} /><div className="space-y-5"><SettingsPanel onDeckChange={setSelectedDeckId} selectedDeckId={selectedDeckId} /><section className="rounded-[26px] border border-black/5 bg-[#e6deff] p-5">{statusMsg.text && <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-bold ${statusMsg.type === "error" ? "bg-[#fff0f0] text-[#a33a3a]" : "bg-white/70 text-[#276345]"}`}>{statusMsg.text}</div>}<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#311485] text-white"><CheckCircle2 className="h-6 w-6" /></span><h2 className="mt-5 [font-family:var(--font-outfit)] text-xl font-extrabold text-[#311485]">Ready to save?</h2><p className="mt-2 text-sm leading-6 text-[#4e3d88]">{mode === "bulk" ? `${parsedBulkCards.length} parsed cards` : `Next position: ${nextPosition}`}</p><button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#614db7] px-5 py-3.5 text-sm font-bold text-white disabled:opacity-60" disabled={createMutation.isPending || deckCardsQuery.isLoading} onClick={handleCreate} type="button">{createMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}{createMutation.isPending ? "Saving..." : mode === "bulk" ? "Create batch" : "Save flashcard"}</button></section></div></div></div></div>;
}
