"use client";

import { X } from "lucide-react";

export function CrudModal({
  children,
  eyebrow,
  isCloseDisabled,
  onClose,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  eyebrow: string;
  isCloseDisabled?: boolean;
  onClose: () => void;
  subtitle: string;
  title: string;
}) {
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1c19]/45 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-[32px] border border-black/5 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-[#614db7]">
              {eyebrow}
            </p>
            <h3 className="mt-2 [font-family:var(--font-outfit)] text-3xl font-extrabold text-[#1b1c19]">
              {title}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#5f5e5e]">
              {subtitle}
            </p>
          </div>
          <button
            aria-label="Close detail modal"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:text-[#1b1c19]"
            disabled={isCloseDisabled}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
