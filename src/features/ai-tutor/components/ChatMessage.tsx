"use client";

import { BrainCircuit, Copy, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isPending?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function ChatMessage({
  role,
  content,
  isPending = false,
  isError = false,
  onRetry,
}: ChatMessageProps) {
  const isUser = role === "user";

  if (isPending) {
    return (
      <div className="flex justify-start gap-3 pr-8 sm:pr-16">
        <BotAvatar />
        <div className="flex items-center gap-2 rounded-[22px] rounded-tl-md border border-black/5 bg-white px-5 py-4 shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#9b87f5]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#9b87f5] [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#9b87f5] [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "justify-end pl-8 sm:pl-16" : "justify-start pr-8 sm:pr-16",
      )}
    >
      {!isUser && <BotAvatar />}
      <div
        className={cn(
          "group max-w-[760px] rounded-[22px] px-5 py-4 text-sm leading-6 shadow-sm sm:text-[15px]",
          isUser
            ? "rounded-br-md bg-[#614db7] text-white"
            : "rounded-tl-md border border-black/5 bg-white text-[#4d4a47]",
          isError && "border-[#ffd6d6] bg-[#fff6f6] text-[#9b2f2f]",
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {!isUser && (
          <div className="mt-4 flex items-center gap-2">
            <button
              className="inline-flex items-center gap-1 rounded-full bg-[#f6f3ee] px-3 py-1.5 text-[11px] font-bold text-[#777474] transition hover:text-[#614db7]"
              onClick={() => void navigator.clipboard?.writeText(content)}
              type="button"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
            {isError && onRetry && (
              <button
                className="inline-flex items-center gap-1 rounded-full bg-[#fff0f0] px-3 py-1.5 text-[11px] font-bold text-[#a33a3a]"
                onClick={onRetry}
                type="button"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BotAvatar() {
  return (
    <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#1b1c19] text-white shadow-sm">
      <BrainCircuit className="h-5 w-5" />
    </span>
  );
}
