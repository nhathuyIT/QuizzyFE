"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import type {
  AdminAcademicDocumentStatus,
  AdminAcademicEntityStatus,
} from "@/services/api";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function AcademicModal({
  children,
  description,
  onClose,
  title,
  widthClass = "max-w-[720px]",
}: {
  children: ReactNode;
  description?: string;
  onClose: () => void;
  title: string;
  widthClass?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const originalBodyOverflow = document.body.style.overflow;

    function getFocusableElements() {
      const dialog = dialogRef.current;
      if (!dialog) return [];

      return Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => {
        const style = window.getComputedStyle(element);
        return (
          element.getAttribute("aria-hidden") !== "true" &&
          style.display !== "none" &&
          style.visibility !== "hidden"
        );
      });
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = getFocusableElements();
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements.at(-1);

      if (!firstFocusableElement || !lastFocusableElement) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const activeElement = document.activeElement;
      if (!dialog.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastFocusableElement : firstFocusableElement).focus({
          preventScroll: true,
        });
        return;
      }

      if (
        event.shiftKey &&
        (activeElement === firstFocusableElement || activeElement === dialog)
      ) {
        event.preventDefault();
        lastFocusableElement.focus({ preventScroll: true });
      } else if (!event.shiftKey && activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus({ preventScroll: true });
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    (closeButtonRef.current ?? dialogRef.current)?.focus({
      preventScroll: true,
    });

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      if (previouslyFocusedElement?.isConnected) {
        previouslyFocusedElement.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1c19]/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={`max-h-[92vh] w-full ${widthClass} overflow-y-auto rounded-[30px] border border-black/5 bg-white shadow-2xl`}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-black/5 bg-white p-5 sm:p-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#614db7]">
              Academic Management
            </p>
            <h3
              className="mt-2 text-2xl font-extrabold text-[#1b1c19] sm:text-3xl"
              id={titleId}
            >
              {title}
            </h3>
            {description ? (
              <p
                className="mt-2 text-sm font-semibold leading-6 text-[#6e6a67]"
                id={descriptionId}
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            aria-label="Close modal"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:bg-[#e6deff] hover:text-[#311485]"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

export function AcademicConfirmDialog({
  confirmLabel,
  description,
  isPending,
  onCancel,
  onConfirm,
  tone = "danger",
  title,
}: {
  confirmLabel: string;
  description: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  tone?: "danger" | "primary";
  title: string;
}) {
  return (
    <AcademicModal onClose={onCancel} title={title} widthClass="max-w-[500px]">
      <div className="flex gap-3 rounded-2xl bg-[#fff7e8] p-4 text-sm font-semibold leading-6 text-[#76511a]">
        <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <p>{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-bold text-[#5f5e5e] transition hover:bg-[#f6f3ee]"
          disabled={isPending}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
            tone === "danger"
              ? "bg-[#b64747] hover:bg-[#963939]"
              : "bg-[#614db7] hover:bg-[#4f3d99]"
          }`}
          disabled={isPending}
          onClick={onConfirm}
          type="button"
        >
          {isPending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
          {confirmLabel}
        </button>
      </div>
    </AcademicModal>
  );
}

export function AcademicStatusBadge({
  status,
}: {
  status: AdminAcademicDocumentStatus | Exclude<AdminAcademicEntityStatus, "all">;
}) {
  const styles = {
    active: "bg-[#e2f6ea] text-[#267047]",
    inactive: "bg-[#f0eeeb] text-[#6e6a67]",
    pending: "bg-[#fff1c9] text-[#805d00]",
    rejected: "bg-[#ffe5e5] text-[#a33a3a]",
    archived: "bg-[#e8e9f2] text-[#555b78]",
  }[status];

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.06em] ${styles}`}>
      {status}
    </span>
  );
}

export function AcademicPagination({
  hasNextPage,
  hasPreviousPage,
  isFetching,
  itemCount,
  onPageChange,
  page,
  pageCount,
}: {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetching: boolean;
  itemCount?: number;
  onPageChange: (page: number) => void;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1 && !itemCount) return null;

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-bold text-[#6e6a67]">
        {typeof itemCount === "number" ? `${itemCount} items · ` : ""}
        Page {page} of {Math.max(pageCount, 1)}
      </p>
      <div className="flex gap-2">
        <button
          aria-label="Previous page"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f3ee] text-[#5f5e5e] transition hover:bg-[#e6deff] hover:text-[#311485] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!hasPreviousPage || isFetching}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          aria-label="Next page"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f3ee] text-[#5f5e5e] transition hover:bg-[#e6deff] hover:text-[#311485] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!hasNextPage || isFetching}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function AcademicInlineError({ error }: { error: unknown }) {
  if (!error) return null;

  return (
    <div className="flex items-start gap-2 rounded-2xl bg-[#fff0f0] px-4 py-3 text-sm font-bold leading-6 text-[#a33a3a]">
      <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      {error instanceof Error ? error.message : "Unable to complete this request."}
    </div>
  );
}

export function AcademicLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-56 items-center justify-center gap-2 rounded-[26px] border border-black/5 bg-white text-sm font-bold text-[#614db7]">
      <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
      {label}
    </div>
  );
}
