"use client";

import { CheckCircle2, Loader2, Save } from "lucide-react";
import type { CardInputMode, StatusMessage } from "@/features/flashcards/types";

interface SaveCardsPanelProps {
  isCreating: boolean;
  isDeckCardsLoading: boolean;
  mode: CardInputMode;
  nextPosition: number;
  onCreate: () => void;
  parsedCardCount: number;
  statusMsg: StatusMessage;
}

export function SaveCardsPanel({
  isCreating,
  isDeckCardsLoading,
  mode,
  nextPosition,
  onCreate,
  parsedCardCount,
  statusMsg,
}: SaveCardsPanelProps) {
  const isBulk = mode === "bulk";
  const isBulkCreating = isCreating && isBulk;
  const statusClass =
    statusMsg.type === "error"
      ? "bg-[#fff0f0] text-[#a33a3a]"
      : statusMsg.type === "pending"
        ? "bg-white/70 text-[#4e3d88]"
        : "bg-white/70 text-[#276345]";

  return (
    <section className="rounded-[26px] border border-black/5 bg-[#e6deff] p-5">
      {statusMsg.text && (
        <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-bold ${statusClass}`}>
          {statusMsg.text}
        </div>
      )}

      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#311485] text-white">
        {isCreating ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <CheckCircle2 className="h-6 w-6" />
        )}
      </span>
      <h2 className="mt-5 [font-family:var(--font-outfit)] text-xl font-extrabold text-[#311485]">
        {isBulkCreating ? "Creating batch..." : "Ready to save?"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#4e3d88]">
        {isBulk ? `${parsedCardCount} parsed cards` : `Next position: ${nextPosition}`}
      </p>

      {isBulkCreating && (
        <div className="mt-5 rounded-2xl bg-white/70 p-4">
          <div className="flex items-center gap-3 text-sm font-bold text-[#311485]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating {parsedCardCount} cards through the bulk endpoint.
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#d8cef8]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#614db7]" />
          </div>
        </div>
      )}

      <button
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#614db7] px-5 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isCreating || isDeckCardsLoading}
        onClick={onCreate}
        type="button"
      >
        {isCreating ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Save className="h-5 w-5" />
        )}
        {getButtonLabel({ isBulk, isCreating, parsedCardCount })}
      </button>
    </section>
  );
}

function getButtonLabel({
  isBulk,
  isCreating,
  parsedCardCount,
}: {
  isBulk: boolean;
  isCreating: boolean;
  parsedCardCount: number;
}) {
  if (isCreating && isBulk) return `Creating ${parsedCardCount} cards...`;
  if (isCreating) return "Saving card...";
  if (isBulk) return "Create batch";
  return "Save flashcard";
}
