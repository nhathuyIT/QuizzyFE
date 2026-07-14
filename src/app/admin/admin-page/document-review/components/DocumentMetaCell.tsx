import type { ReactNode } from "react";

export function DocumentMetaCell({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-[#fbf9f4] px-3 py-2">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.05em] text-[#8a8784]">
        {label}
      </p>
      <p
        className="mt-1 truncate text-xs font-bold text-[#45433f]"
        title={typeof value === "string" ? value : undefined}
      >
        {value || "—"}
      </p>
    </div>
  );
}
