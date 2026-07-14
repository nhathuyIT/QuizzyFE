"use client";

import {
  BookOpenText,
  Clock3,
  Layers3,
  MessagesSquare,
  UsersRound,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { AdminDashboardSummary } from "@/services/api";
import { PanelEmpty, PanelError, PanelLoading } from "./PanelState";
import { formatDate, formatNumber, formatSeconds } from "./formatters";

export function SummaryPanel({
  data,
  error,
  isRetrying,
  isLoading,
  onRetry,
}: {
  data?: AdminDashboardSummary;
  error: unknown;
  isRetrying?: boolean;
  isLoading: boolean;
  onRetry?: () => void;
}) {
  if (isLoading && !data)
    return <PanelLoading label="Loading platform overview" />;
  if (error && !data)
    return (
      <PanelError
        error={error}
        isRetrying={isRetrying}
        onRetry={onRetry}
      />
    );
  if (!data) return <PanelEmpty label="No summary data available." />;

  const totals = [
    {
      color: "#6c5ce7",
      helper: "Registered accounts",
      icon: UsersRound,
      iconClassName: "bg-[#eee8ff] text-[#614db7]",
      label: "Users",
      value: data.totals.users,
    },
    {
      color: "#2f80ed",
      helper: "Learning collections",
      icon: Layers3,
      iconClassName: "bg-[#e9f3ff] text-[#35689b]",
      label: "Decks",
      value: data.totals.decks,
    },
    {
      color: "#f2b84b",
      helper: "Study materials",
      icon: BookOpenText,
      iconClassName: "bg-[#fff0d8] text-[#9a5b16]",
      label: "Cards",
      value: data.totals.cards,
    },
    {
      color: "#27ae60",
      helper: "Study sessions",
      icon: Clock3,
      iconClassName: "bg-[#e7f7ef] text-[#2f7a55]",
      label: "Sessions",
      value: data.totals.sessions,
    },
    {
      color: "#eb5757",
      helper: "Submitted reviews",
      icon: MessagesSquare,
      iconClassName: "bg-[#ffe8ee] text-[#a44f67]",
      label: "Reviews",
      value: data.totals.reviews,
    },
  ];

  return (
    <div className="space-y-5">
      {error ? (
        <PanelError
          error={error}
          isRetrying={isRetrying}
          onRetry={onRetry}
        />
      ) : null}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {totals.map((item) => {
          const Icon = item.icon;

          return (
            <article
              className="group relative overflow-hidden rounded-[24px] border border-black/5 bg-white p-4 shadow-[0_10px_30px_rgba(49,20,133,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(49,20,133,0.09)]"
              key={item.label}
            >
              <span
                aria-hidden="true"
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10"
                style={{ backgroundColor: item.color }}
              />
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.iconClassName}`}>
                <Icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <p className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-[#1b1c19]">
                {formatNumber(item.value)}
              </p>
              <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.08em] text-[#5f5e5e]">
                {item.label}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-[#999492]">
                {item.helper}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <PlatformTotalsChart
          totals={totals.map(({ color, label, value }) => ({ color, label, value }))}
        />
        <HealthOverview data={data} />
      </section>

      <section className="overflow-hidden rounded-[28px] bg-[#1b1c19] text-white shadow-[0_18px_45px_rgba(27,28,25,0.18)]">
        <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="border-white/10 p-6 lg:border-r">
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#cabeff]">
              Reporting window
            </p>
            <p className="mt-4 text-lg font-extrabold">
              {formatDate(data.range.from)}
            </p>
            <p className="mt-1 text-sm font-semibold text-white/45">through</p>
            <p className="mt-1 text-lg font-extrabold">
              {formatDate(data.range.to)}
            </p>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0">
            <RangeMetric label="New users" value={data.range.newUsers} />
            <RangeMetric label="Active users" value={data.range.activeUsers} />
            <RangeMetric label="Sessions" value={data.range.sessions} />
            <RangeMetric label="Reviews" value={data.range.reviews} />
          </div>
        </div>
      </section>
    </div>
  );
}

function PlatformTotalsChart({
  totals,
}: {
  totals: Array<{ color: string; label: string; value: number }>;
}) {
  return (
    <article className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_14px_40px_rgba(49,20,133,0.06)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#614db7]">
            Platform scale
          </p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-[#1b1c19]">
            Overall
          </h3>
        </div>
        <p className="text-xs font-bold text-[#999492]">All-time totals</p>
      </div>

      <div className="mt-5 grid items-center gap-4 rounded-[22px] bg-[#fbf9f4] p-4 sm:p-5 lg:grid-cols-[minmax(260px,1fr)_220px]">
        <div className="relative h-[300px] min-w-0">
          <ResponsiveContainer height="100%" minWidth={0} width="100%">
            <PieChart accessibilityLayer>
              <Pie
                cornerRadius={8}
                data={totals}
                dataKey="value"
                innerRadius="55%"
                nameKey="label"
                outerRadius="82%"
                paddingAngle={4}
                stroke="none"
              >
                {totals.map((item) => (
                  <Cell fill={item.color} key={item.label} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value) => [formatNumber(Number(value)), "Total"]}
                labelStyle={{ color: "#614db7", fontWeight: 800 }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-3xl font-extrabold tracking-[-0.04em] text-[#311485]">
                {totals.length}
              </p>
              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#797583]">
                Key signals
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {totals.map((item) => (
            <div
              className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2.5 shadow-sm"
              key={item.label}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate text-xs font-bold text-[#5f5e5e]">
                  {item.label}
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#1b1c19]">
                {compactNumber(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function HealthOverview({ data }: { data: AdminDashboardSummary }) {
  return (
    <article className="relative overflow-hidden rounded-[28px] border border-[#d8ceff] bg-[#f5f1ff] p-5 sm:p-6">
      <span className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#9b87f5]/15 blur-2xl" />
      <div className="relative">
        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#614db7]">
          Learning health
        </p>
        <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-[#1b1c19]">
          Quality signals
        </h3>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <RadialMetric label="Accuracy" value={data.accuracy} />
          <RadialMetric label="Completion" value={data.sessionCompletionRate} />
        </div>

        <div className="mt-5 rounded-[22px] bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#797583]">
                Average study time
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#311485]">
                {formatSeconds(data.averageStudyTimeSeconds)}
              </p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]">
              <Clock3 aria-hidden="true" className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <AudienceMetric label="DAU" value={data.dau} />
          <AudienceMetric label="WAU" value={data.wau} />
          <AudienceMetric label="MAU" value={data.mau} />
        </div>
      </div>
    </article>
  );
}

function RadialMetric({ label, value }: { label: string; value: number }) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="rounded-[22px] bg-white/75 p-3 text-center">
      <div
        aria-label={`${label}: ${formatNumber(value)}%`}
        className="relative mx-auto h-28 w-28 max-w-full"
        role="img"
      >
        <ResponsiveContainer height="100%" minWidth={0} width="100%">
          <RadialBarChart
            barSize={10}
            data={[{ name: label, value: clampedValue }]}
            endAngle={-270}
            innerRadius="74%"
            outerRadius="100%"
            startAngle={90}
          >
            <RadialBar
              background={{ fill: "#e8e3ef" }}
              cornerRadius={999}
              dataKey="value"
              fill="#614db7"
              isAnimationActive="auto"
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="text-xl font-extrabold text-[#311485]">
            {formatNumber(value)}%
          </span>
        </div>
      </div>
      <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#5f5e5e]">
        {label}
      </p>
    </div>
  );
}

function AudienceMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#d8ceff] bg-white/50 px-2 py-3 text-center">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#797583]">
        {label}
      </p>
      <p className="mt-1 text-sm font-extrabold text-[#311485]">
        {compactNumber(value)}
      </p>
    </div>
  );
}

function RangeMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex min-h-32 flex-col justify-center px-5 py-6">
      <p className="text-2xl font-extrabold tracking-[-0.03em]">
        {formatNumber(value)}
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-white/50">
        {label}
      </p>
    </div>
  );
}

function compactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(value);
}

const chartTooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #cabeff",
  borderRadius: "16px",
  boxShadow: "0 12px 32px rgba(49, 20, 133, 0.12)",
  color: "#1b1c19",
  fontSize: "12px",
  fontWeight: 700,
};
