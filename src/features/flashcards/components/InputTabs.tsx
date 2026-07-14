"use client";

import { FileText, Keyboard, UploadCloud } from "lucide-react";
import type {
  CardInputMode,
  ManualCardDraft,
  ManualCardField,
} from "@/features/flashcards/types";

interface InputTabsProps {
  bulkText: string;
  disabled?: boolean;
  manualDraft: ManualCardDraft;
  mode: CardInputMode;
  onBulkTextChange: (value: string) => void;
  onManualDraftChange: (field: ManualCardField, value: string) => void;
  onModeChange: (mode: CardInputMode) => void;
}

const tabs = [
  { id: "manual" as const, label: "Manual", icon: Keyboard },
  { id: "bulk" as const, label: "Bulk paste", icon: FileText },
  { id: "upload" as const, label: "Upload", icon: UploadCloud },
];

export function InputTabs({
  bulkText,
  disabled = false,
  manualDraft,
  mode,
  onBulkTextChange,
  onManualDraftChange,
  onModeChange,
}: InputTabsProps) {
  return (
    <section className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)] sm:p-6">
      <div className="flex gap-2 overflow-x-auto border-b border-black/5 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold ${
                mode === tab.id
                  ? "bg-[#e6deff] text-[#311485]"
                  : "text-[#777474] hover:bg-[#f6f3ee]"
              } disabled:opacity-60`}
              disabled={disabled}
              key={tab.id}
              onClick={() => onModeChange(tab.id)}
              type="button"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {mode === "manual" && (
        <div className="mt-6 space-y-5">
          <TextArea
            disabled={disabled}
            label="Front"
            note="Question or term"
            onChange={(value) => onManualDraftChange("front", value)}
            placeholder="What do you want to remember?"
            value={manualDraft.front}
          />
          <TextArea
            disabled={disabled}
            label="Back"
            note="Answer or definition"
            onChange={(value) => onManualDraftChange("back", value)}
            placeholder="Write a clear answer."
            value={manualDraft.back}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <TextArea
              compact
              disabled={disabled}
              label="Hint"
              note="Optional"
              onChange={(value) => onManualDraftChange("hint", value)}
              placeholder="A useful clue"
              value={manualDraft.hint}
            />
            <TextArea
              compact
              disabled={disabled}
              label="Explanation"
              note="Optional"
              onChange={(value) => onManualDraftChange("explanation", value)}
              placeholder="Why is this answer correct?"
              value={manualDraft.explanation}
            />
          </div>
          <label className="block text-sm font-extrabold">
            Examples{" "}
            <span className="font-medium text-[#9a9692]">one per line</span>
            <textarea
              className="mt-2 min-h-28 w-full resize-none rounded-[22px] border border-black/10 bg-[#fbf9f4] p-4 text-sm leading-6 outline-none focus:border-[#9b87f5] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={disabled}
              onChange={(event) =>
                onManualDraftChange("examples", event.target.value)
              }
              placeholder="Example one&#10;Example two"
              value={manualDraft.examples}
            />
          </label>
        </div>
      )}

      {mode === "bulk" && (
        <div className="mt-6">
          <h2 className="[font-family:var(--font-outfit)] text-xl font-extrabold">
            Create many cards
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#777474]">
            Enter one card per line using <strong>front :: back</strong>.
          </p>
          <textarea
            className="mt-5 min-h-[430px] w-full resize-none rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 font-mono text-sm leading-7 outline-none focus:border-[#9b87f5] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled}
            onChange={(event) => onBulkTextChange(event.target.value)}
            placeholder={
              "What is HTTP? :: Hypertext Transfer Protocol\nWhat is REST? :: Representational State Transfer"
            }
            value={bulkText}
          />
        </div>
      )}

      {mode === "upload" && (
        <div className="mt-6 flex min-h-[430px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#cabeff] bg-[#f8f5ff] p-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]">
            <UploadCloud className="h-8 w-8" />
          </span>
          <h2 className="mt-5 [font-family:var(--font-outfit)] text-xl font-extrabold">
            Upload API is not exposed
          </h2>
          <p className="mt-2 max-w-[460px] text-sm leading-6 text-[#777474]">
            The backend has AI source schemas but no upload controller endpoint,
            so this control remains disabled.
          </p>
        </div>
      )}
    </section>
  );
}

function TextArea({
  compact = false,
  disabled = false,
  label,
  note,
  onChange,
  placeholder,
  value,
}: {
  compact?: boolean;
  disabled?: boolean;
  label: string;
  note: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="block text-sm font-extrabold">
      {label} <span className="font-medium text-[#9a9692]">{note}</span>
      <textarea
        className={`mt-2 w-full resize-none rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 text-base font-medium leading-7 outline-none focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10 disabled:cursor-not-allowed disabled:opacity-60 ${
          compact ? "min-h-28" : "min-h-40"
        }`}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}
