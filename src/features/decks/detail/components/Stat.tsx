export function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] border border-black/5 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#9a9692]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
    </div>
  );
}
