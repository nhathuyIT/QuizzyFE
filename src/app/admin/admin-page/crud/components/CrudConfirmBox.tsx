"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import type { CrudConfirmAction } from "./crud.types";

export function CrudConfirmBox({
  action,
  isPending,
  onCancel,
  onConfirm,
  onReasonChange,
  reason,
}: {
  action: CrudConfirmAction;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onReasonChange?: (reason: string) => void;
  reason?: string;
}) {
  const buttonClassName =
    action.tone === "danger"
      ? "bg-[#a33a3a] text-white hover:bg-[#842d2d]"
      : "bg-[#614db7] text-white hover:bg-[#4f3aa0]";
  const reasonValue = reason ?? "";
  const confirmDisabled =
    isPending || Boolean(action.requiresReason && !reasonValue.trim());

  return (
    <div className="rounded-[24px] border border-black/5 bg-[#fbf9f4] p-4">
      <div className="flex gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0f0] text-[#a33a3a]">
          <AlertTriangle aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-extrabold text-[#1b1c19]">{action.title}</p>
          <p className="mt-1 text-sm leading-6 text-[#5f5e5e]">
            {action.description}
          </p>
        </div>
      </div>

      {action.requiresReason ? (
        <div className="mt-4">
          <label
            className="text-xs font-bold uppercase tracking-normal text-[#a33a3a]"
            htmlFor={`crud-reason-${action.type}`}
          >
            {action.reasonLabel ?? "Reason"}
          </label>
          <textarea
            className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-[#ffdad6] bg-white px-4 py-3 text-sm font-semibold text-[#1b1c19] outline-none transition placeholder:text-[#9d8f8f] focus:border-[#a33a3a] focus:ring-4 focus:ring-[#a33a3a]/10 disabled:opacity-60"
            disabled={isPending}
            id={`crud-reason-${action.type}`}
            onChange={(event) => onReasonChange?.(event.target.value)}
            placeholder={action.reasonPlaceholder ?? "Enter reason"}
            value={reasonValue}
          />
        </div>
      ) : null}

      <div className="mt-4 flex gap-2">
        <button
          className="h-10 flex-1 rounded-2xl bg-white text-sm font-extrabold text-[#5f5e5e] transition hover:text-[#1b1c19] disabled:opacity-50"
          disabled={isPending}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-extrabold transition disabled:opacity-50 ${buttonClassName}`}
          disabled={confirmDisabled}
          onClick={onConfirm}
          type="button"
        >
          {isPending ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : null}
          {action.label}
        </button>
      </div>
    </div>
  );
}
