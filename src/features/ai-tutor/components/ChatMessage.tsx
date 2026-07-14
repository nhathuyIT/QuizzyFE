import { AlertTriangle, BrainCircuit, Loader2, RefreshCw } from "lucide-react";
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

  if (isUser) {
    return (
      <div className="flex justify-end pl-10 sm:pl-20">
        <div className="max-w-[760px] rounded-[22px] rounded-br-md bg-[#614db7] px-5 py-4 text-sm font-medium leading-6 text-white shadow-sm">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3 pr-10 sm:pr-20">
      <span
        className={cn(
          "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm",
          isError ? "bg-[#a33a3a]" : "bg-[#1b1c19]",
        )}
      >
        {isError ? (
          <AlertTriangle className="h-5 w-5" />
        ) : (
          <BrainCircuit className="h-5 w-5" />
        )}
      </span>

      <div
        className={cn(
          "max-w-[760px] rounded-[22px] rounded-tl-md border px-5 py-4 text-sm font-medium leading-6 shadow-sm",
          isError
            ? "border-[#ffd0d0] bg-[#fff0f0] text-[#8f2f2f]"
            : "border-black/5 bg-white text-[#4f4c49]",
        )}
      >
        {isPending ? (
          <div className="flex items-center gap-2 font-bold text-[#777474]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Thinking...
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}

        {isError && onRetry ? (
          <button
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-[#a33a3a] transition hover:bg-[#ffe5e5]"
            onClick={onRetry}
            type="button"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}
