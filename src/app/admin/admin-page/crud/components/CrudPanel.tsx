"use client";

import { Loader2, RefreshCw } from "lucide-react";

export function CrudPanel({
  children,
  description,
  isRefreshing,
  onRefresh,
  refreshLabel = "Refresh",
  title,
}: {
  children: React.ReactNode;
  description: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  refreshLabel?: string;
  title: string;
}) {
  return (
    <section className="mt-10 rounded-[32px] border border-black/5 bg-white p-5 shadow-[0_18px_60px_rgba(49,20,133,0.08)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-black/5 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#5f5e5e]">{description}</p>
        </div>

        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f6f3ee] px-5 text-sm font-extrabold text-[#5f5e5e] transition hover:text-[#1b1c19] disabled:opacity-60"
          disabled={isRefreshing}
          onClick={onRefresh}
          type="button"
        >
          {isRefreshing ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
          )}
          {refreshLabel}
        </button>
      </div>

      <div className="pt-6">{children}</div>
    </section>
  );
}
