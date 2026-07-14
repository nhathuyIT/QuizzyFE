"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { AdminAuditLog } from "@/services/api";
import { formatAuditAction } from "../columns/audit-log.columns";

export function AuditLogMetadataModal({
  log,
  onClose,
}: {
  log: AdminAuditLog;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1c19]/45 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <div
        className="flex max-h-[calc(100dvh-1.5rem)] w-full min-w-0 max-w-[42rem] flex-col overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-[30px]"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/5 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#614db7]">
              Audit log metadata
            </p>
            <h3
              className="mt-1 truncate [font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]"
              id={titleId}
            >
              {formatAuditAction(log.action)}
            </h3>
          </div>
          <button
            aria-label="Close audit log details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:text-[#1b1c19]"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <dl className="mb-5 grid gap-3 rounded-2xl bg-[#f6f2ff] p-4 text-sm sm:grid-cols-2">
            <Detail label="Admin" value={log.admin?.email || log.adminId} />
            <Detail
              label="Target type"
              value={log.targetType?.replaceAll("_", " ") || "Unknown"}
            />
            <div className="min-w-0 sm:col-span-2">
              <dt className="text-xs font-extrabold uppercase tracking-wide text-[#797583]">
                Target ID
              </dt>
              <dd className="mt-1 break-all font-semibold text-[#1b1c19]">
                {log.targetId || "—"}
              </dd>
            </div>
          </dl>

          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-[#797583]">
              Recorded metadata
            </p>
            <pre className="m-0 max-h-[min(50vh,32rem)] max-w-full min-w-0 overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-black/5 bg-[#fbf9f4] p-4 text-xs leading-6 text-[#454348] [overflow-wrap:anywhere] sm:text-sm">
              {JSON.stringify(log.metadata ?? {}, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-extrabold uppercase tracking-wide text-[#797583]">
        {label}
      </dt>
      <dd className="mt-1 truncate font-semibold capitalize text-[#1b1c19]" title={value}>
        {value || "—"}
      </dd>
    </div>
  );
}
