import type { AdminDashboardSummary } from "@/services/api";
import { PanelEmpty, PanelError, PanelLoading } from "./PanelState";
import { formatDate, formatNumber, formatSeconds } from "./formatters";

export function SummaryPanel({
  data,
  error,
  isLoading,
}: {
  data?: AdminDashboardSummary;
  error: unknown;
  isLoading: boolean;
}) {
  if (isLoading) return <PanelLoading label="Loading summary API" />;
  if (error) return <PanelError error={error} />;
  if (!data) return <PanelEmpty label="No summary data available." />;

  const totals = [
    { label: "Users", value: data.totals.users },
    { label: "Decks", value: data.totals.decks },
    { label: "Cards", value: data.totals.cards },
    { label: "Sessions", value: data.totals.sessions },
    { label: "Reviews", value: data.totals.reviews },
  ];

  const metrics = [
    { label: "DAU", value: data.dau },
    { label: "WAU", value: data.wau },
    { label: "MAU", value: data.mau },
    { label: "Accuracy", value: data.accuracy, suffix: "%" },
    { label: "Completion", value: data.sessionCompletionRate, suffix: "%" },
    { label: "Avg Study", value: formatSeconds(data.averageStudyTimeSeconds) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <TotalsChart totals={totals} />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <ProgressMetric
            label="Accuracy"
            value={data.accuracy}
            helper="Correct review rate"
          />
          <ProgressMetric
            label="Completion"
            value={data.sessionCompletionRate}
            helper="Finished study sessions"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[26px] border border-[#cabeff] bg-[#f6f2ff] p-5">
          <p className="text-xs font-bold uppercase tracking-normal text-[#614db7]">
            Range
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Metric label="From" value={formatDate(data.range.from)} />
            <Metric label="To" value={formatDate(data.range.to)} />
            <Metric label="New Users" value={formatNumber(data.range.newUsers)} />
            <Metric label="Active Users" value={formatNumber(data.range.activeUsers)} />
            <Metric label="Sessions" value={formatNumber(data.range.sessions)} />
            <Metric label="Reviews" value={formatNumber(data.range.reviews)} />
          </div>
        </div>

        <div className="rounded-[26px] border border-black/5 bg-[#1b1c19] p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-normal text-[#cabeff]">
            Key Metrics
          </p>
          <div className="mt-4 space-y-3">
            {metrics.map((item) => (
              <div className="flex items-center justify-between gap-3" key={item.label}>
                <span className="text-sm font-semibold text-white/70">{item.label}</span>
                <span className="text-sm font-extrabold">
                  {typeof item.value === "number"
                    ? `${formatNumber(item.value)}${item.suffix ?? ""}`
                    : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TotalsChart({
  totals,
}: {
  totals: Array<{ label: string; value: number }>;
}) {
  const maxValue = Math.max(1, ...totals.map((item) => item.value));

  return (
    <article className="rounded-[28px] border border-black/5 bg-[#fbf9f4] p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-[#614db7]">
            Platform Totals
          </p>
          <h3 className="mt-2 [font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
            System snapshot
          </h3>
        </div>
        <p className="text-sm font-semibold text-[#797583]">Current totals</p>
      </div>

      <div className="mt-7 flex h-[260px] items-end gap-3 rounded-[24px] bg-white p-4 sm:gap-5">
        {totals.map((item) => {
          const height = Math.max(10, Math.round((item.value / maxValue) * 100));

          return (
            <div className="flex min-w-0 flex-1 flex-col items-center gap-3" key={item.label}>
              <div className="flex h-[180px] w-full items-end justify-center">
                <div
                  className="w-full max-w-[56px] rounded-t-2xl bg-[#614db7] shadow-lg shadow-[#614db7]/15 transition"
                  style={{ height: `${height}%` }}
                  title={`${item.label}: ${formatNumber(item.value)}`}
                />
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-[#1b1c19]">
                  {formatNumber(item.value)}
                </p>
                <p className="mt-1 truncate text-xs font-bold text-[#797583]">
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function ProgressMetric({
  helper,
  label,
  value,
}: {
  helper: string;
  label: string;
  value: number;
}) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <article className="rounded-[28px] border border-[#cabeff] bg-[#f6f2ff] p-5">
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-[#614db7]">
            {label}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#5f5e5e]">
            {helper}
          </p>
        </div>

        <div
          className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#614db7 ${clampedValue}%, #e4e2dd 0)`,
          }}
        >
          <div className="grid h-[74px] w-[74px] place-items-center rounded-full bg-white">
            <span className="text-xl font-extrabold text-[#311485]">
              {formatNumber(value)}%
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-normal text-[#797583]">
        {label}
      </p>
      <p className="mt-1 text-sm font-extrabold text-[#1b1c19]">{value}</p>
    </div>
  );
}
