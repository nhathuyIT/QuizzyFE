export function PanelLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-[26px] bg-[#fbf9f4] text-sm font-bold text-[#614db7]">
      {label}
    </div>
  );
}

export function PanelError({ error }: { error: unknown }) {
  return (
    <div className="rounded-[24px] bg-[#fff0f0] p-5 text-sm font-bold text-[#a33a3a]">
      {error instanceof Error ? error.message : "Unable to load admin data."}
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
