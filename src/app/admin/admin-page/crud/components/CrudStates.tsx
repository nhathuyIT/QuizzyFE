import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

export function CrudLoading({
  label = "Loading data",
  minWidthClassName = "min-w-[780px]",
}: {
  label?: string;
  minWidthClassName?: string;
}) {
  return (
    <div
      className={`flex min-h-[220px] ${minWidthClassName} items-center justify-center gap-2 text-sm font-bold text-[#614db7]`}
    >
      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function CrudError({
  error,
  fallback = "Unable to load data.",
  minWidthClassName = "min-w-[780px]",
}: {
  error: unknown;
  fallback?: string;
  minWidthClassName?: string;
}) {
  return (
    <div
      className={`${minWidthClassName} bg-[#fff0f0] p-5 text-sm font-bold text-[#a33a3a]`}
    >
      {error instanceof Error ? error.message : fallback}
    </div>
  );
}

export function CrudEmpty({
  label = "No records found.",
  minWidthClassName = "min-w-[780px]",
}: {
  label?: string;
  minWidthClassName?: string;
}) {
  return (
    <div
      className={`${minWidthClassName} p-8 text-center text-sm font-bold text-[#614db7]`}
    >
      {label}
    </div>
  );
}

export function CrudInlineMessage({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "error" | "success";
}) {
  const toneClassName =
    tone === "error"
      ? "bg-[#fff0f0] text-[#a33a3a]"
      : "bg-[#f6f2ff] text-[#614db7]";

  return (
    <p
      aria-live="polite"
      className={`mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold ${toneClassName}`}
    >
      {tone === "success" ? (
        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
      ) : (
        <AlertTriangle aria-hidden="true" className="h-4 w-4" />
      )}
      {children}
    </p>
  );
}
