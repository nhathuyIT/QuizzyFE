import type { FormEvent } from "react";
import { Loader2, SendHorizontal } from "lucide-react";

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  error?: string;
  isSending?: boolean;
  maxLength?: number;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  error,
  isSending = false,
  maxLength,
}: ChatInputProps) {
  const isDisabled = disabled || isSending;
  const canSubmit = Boolean(value.trim()) && !isDisabled;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) onSubmit();
  }

  return (
    <form
      className="shrink-0 border-t border-black/5 bg-white p-4"
      onSubmit={handleSubmit}
    >
      <div className="flex items-end gap-3 rounded-[24px] border border-black/10 bg-[#fbf9f4] p-2 transition focus-within:border-[#9b87f5] focus-within:ring-4 focus-within:ring-[#9b87f5]/10">
        <textarea
          className="min-h-12 max-h-36 flex-1 resize-none bg-transparent px-3 py-3 text-sm font-medium leading-6 text-[#1b1c19] outline-none placeholder:text-[#9a9692] disabled:opacity-60 custom-scrollbar"
          disabled={isDisabled}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (canSubmit) onSubmit();
            }
          }}
          placeholder="Ask a follow-up question..."
          rows={1}
          value={value}
        />

        <button
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#614db7] text-white shadow-lg shadow-[#614db7]/20 transition hover:bg-[#49339d] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canSubmit}
          type="submit"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizontal className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mt-2 flex min-h-5 items-center justify-between gap-3 px-2 text-xs font-semibold">
        <span className={error ? "text-[#a33a3a]" : "text-[#8a8784]"}>
          {error || "Shift + Enter for a new line."}
        </span>
        {maxLength ? (
          <span className="shrink-0 text-[#9a9692]">
            {value.length}/{maxLength}
          </span>
        ) : null}
      </div>
    </form>
  );
}
