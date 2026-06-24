"use client";

import { FormEvent, KeyboardEvent } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";

interface ChatInputProps {
  value: string;
  disabled?: boolean;
  error?: string;
  isSending?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const suggestions = [
  "Explain this concept simply",
  "Quiz me on my weak spots",
  "Turn this into examples",
];

export function ChatInput({
  value,
  disabled = false,
  error,
  isSending = false,
  maxLength,
  onChange,
  onSubmit,
}: ChatInputProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <form
      className="border-t border-black/5 bg-white p-4 sm:p-5"
      onSubmit={handleSubmit}
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-[#f6f3ee] px-3 py-2 text-xs font-bold text-[#777474] transition hover:border-[#cabeff] hover:text-[#614db7]"
              disabled={disabled || isSending}
              key={suggestion}
              onClick={() => onChange(suggestion)}
              type="button"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {suggestion}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-3 rounded-[24px] border border-black/10 bg-[#fbf9f4] p-2 shadow-inner transition focus-within:border-[#9b87f5] focus-within:ring-4 focus-within:ring-[#9b87f5]/10">
          <textarea
            className="max-h-36 min-h-[52px] flex-1 resize-none bg-transparent px-3 py-3 text-sm font-medium leading-6 text-[#1b1c19] outline-none placeholder:text-[#9a9692] custom-scrollbar"
            disabled={disabled || isSending}
            maxLength={maxLength}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a study question..."
            rows={1}
            value={value}
          />
          <button
            aria-label="Send message"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#614db7] text-white shadow-lg shadow-[#614db7]/20 transition hover:-translate-y-0.5 hover:bg-[#49339d] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled || isSending || !value.trim()}
            type="submit"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        {error && (
          <p className="mt-3 rounded-2xl bg-[#fff0f0] px-4 py-3 text-sm font-bold text-[#a33a3a]">
            {error}
          </p>
        )}
        <p className="mt-3 text-center text-xs font-semibold text-[#9a9692]">
          AI can make mistakes. Keep important facts checked against your notes.
        </p>
      </div>
    </form>
  );
}
