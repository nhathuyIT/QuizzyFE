import { Loader2 } from "lucide-react";

export function PanelLoading({ label }: { label: string }) {
  return (
    <div
      aria-live="polite"
      className="flex min-h-[260px] items-center justify-center gap-2 rounded-[26px] bg-[#fbf9f4] text-sm font-bold text-[#614db7]"
      role="status"
    >
      <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
      {label}
    </div>
  );
}

export function PanelError({
  error,
  isRetrying = false,
  onRetry,
}: {
  error: unknown;
  isRetrying?: boolean;
  onRetry?: () => void;
}) {
  return (
    <div
      className="rounded-[24px] bg-[#fff0f0] p-5 text-sm font-bold text-[#a33a3a]"
      role="alert"
    >
      <p>
        {error instanceof Error ? error.message : "Unable to load admin data."}
      </p>
      {onRetry ? (
        <button
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#e9bcbc] bg-white px-4 py-2.5 text-xs font-extrabold text-[#a33a3a] transition hover:bg-[#ffe3e3] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isRetrying}
          onClick={onRetry}
          type="button"
        >
          {isRetrying ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : null}
          {isRetrying ? "Retrying" : "Retry"}
        </button>
      ) : null}
    </div>
  );
}

export function PanelEmpty({ label }: { label: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#cabeff] bg-[#f6f2ff] p-8 text-center text-sm font-bold text-[#614db7]">
      {label}
    </div>
  );
}
