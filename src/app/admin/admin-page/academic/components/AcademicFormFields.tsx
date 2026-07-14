import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function AcademicFormField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.06em] text-[#5f5e5e]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function AcademicFormActions({
  isPending,
  onCancel,
  submitLabel,
}: {
  isPending: boolean;
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-black/5 pt-5">
      <button
        className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-bold text-[#5f5e5e] hover:bg-[#f6f3ee]"
        disabled={isPending}
        onClick={onCancel}
        type="button"
      >
        Cancel
      </button>
      <button
        className="inline-flex items-center gap-2 rounded-xl bg-[#614db7] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#4f3d99] disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : null}
        {submitLabel}
      </button>
    </div>
  );
}
