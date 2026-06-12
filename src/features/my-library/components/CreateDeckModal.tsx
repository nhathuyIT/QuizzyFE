"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layers3, Loader2, X } from "lucide-react";
import { decksAPI } from "@/services/api";

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDeckModal({ isOpen, onClose }: CreateDeckModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const createMutation = useMutation({
    mutationFn: () => decksAPI.create({ title: title.trim(), description: description.trim(), visibility: "private", tags: [] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      setTitle("");
      setDescription("");
      setErrorMsg("");
      onClose();
    },
    onError: (error: unknown) => setErrorMsg(error instanceof Error ? error.message : "Failed to create deck."),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg("");
    if (!title.trim()) {
      setErrorMsg("Deck title is required.");
      return;
    }
    createMutation.mutate();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1c19]/30 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[520px] rounded-[30px] border border-black/5 bg-white p-6 shadow-[0_28px_80px_rgba(27,28,25,0.18)] sm:p-8">
        <button aria-label="Close" className="absolute right-5 top-5 rounded-full p-2 text-[#777474] hover:bg-[#f6f3ee]" onClick={onClose} type="button"><X className="h-5 w-5" /></button>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]"><Layers3 className="h-6 w-6" /></span>
        <h2 className="mt-5 [font-family:var(--font-outfit)] text-3xl font-extrabold tracking-[-0.03em]">Create a new deck</h2>
        <p className="mt-2 text-sm leading-6 text-[#777474]">Give your study material a clear home. You can add cards right after creating it.</p>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          {errorMsg && <div className="rounded-2xl bg-[#fff0f0] px-4 py-3 text-sm font-bold text-[#a33a3a]">{errorMsg}</div>}
          <label className="block text-sm font-bold text-[#1b1c19]">Deck title<input className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#fbf9f4] px-4 font-medium outline-none transition focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10" disabled={createMutation.isPending} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. English vocabulary" value={title} /></label>
          <label className="block text-sm font-bold text-[#1b1c19]">Description <span className="font-medium text-[#9a9692]">(optional)</span><textarea className="mt-2 h-28 w-full resize-none rounded-2xl border border-black/10 bg-[#fbf9f4] p-4 font-medium outline-none transition focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10" disabled={createMutation.isPending} onChange={(event) => setDescription(event.target.value)} placeholder="What will you learn from this deck?" value={description} /></label>
          <div className="flex justify-end gap-3 pt-2">
            <button className="rounded-full px-5 py-3 text-sm font-bold text-[#777474] hover:bg-[#f6f3ee]" disabled={createMutation.isPending} onClick={onClose} type="button">Cancel</button>
            <button className="inline-flex items-center gap-2 rounded-full bg-[#614db7] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#614db7]/20 disabled:opacity-60" disabled={createMutation.isPending} type="submit">{createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}{createMutation.isPending ? "Creating..." : "Create deck"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
