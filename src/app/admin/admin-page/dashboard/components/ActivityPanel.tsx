"use client";

import { useState } from "react";
import {
  Activity,
  CalendarDays,
  Check,
  MessageSquareText,
  Target,
  TimerReset,
  UserPlus,
} from "lucide-react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminActivityPoint } from "@/services/api";
import { PanelEmpty, PanelError, PanelLoading } from "./PanelState";
import { formatDate, formatNumber } from "./formatters";

export function ActivityPanel({
  data,
  error,
  isLoading,
}: {
  data: AdminActivityPoint[];
  error: unknown;
  isLoading: boolean;
}) {
  if (isLoading) return <PanelLoading label="Loading activity trends" />;
  if (error) return <PanelError error={error} />;
  if (!data.length) return <PanelEmpty label="No activity series available." />;

  return <ActivityDashboard data={data} />;
}

function ActivityDashboard({ data }: { data: AdminActivityPoint[] }) {
  const [selectedPeriod, setSelectedPeriod] = useState(
    () => data[data.length - 1]?.period ?? "",
  );
  const selectedActivity =
    data.find((item) => item.period === selectedPeriod) ?? data[data.length - 1];
  const activePeriod = selectedActivity.period;
  const chartData = data.map((item) => ({
    ...item,
    periodLabel: formatChartDate(item.period),
  }));

  const metrics = [
    {
      icon: UserPlus,
      iconClassName: "bg-[#eee8ff] text-[#614db7]",
      label: "New users",
      value: formatNumber(selectedActivity.newUsers),
    },
    {
      icon: Activity,
      iconClassName: "bg-[#e7f7ef] text-[#2f7a55]",
      label: "Active users",
      value: formatNumber(selectedActivity.activeUsers),
    },
    {
      icon: TimerReset,
      iconClassName: "bg-[#e9f3ff] text-[#35689b]",
      label: "Sessions",
      value: formatNumber(selectedActivity.sessions),
    },
    {
      icon: MessageSquareText,
      iconClassName: "bg-[#fff0d8] text-[#9a5b16]",
      label: "Reviews",
      value: formatNumber(selectedActivity.reviews),
    },
    {
      icon: Target,
      iconClassName: "bg-[#ffe8ee] text-[#a44f67]",
      label: "Accuracy",
      value: `${formatNumber(selectedActivity.accuracy)}%`,
    },
  ];

  return (
    <div className="space-y-5">
      <TimelinePicker
        data={data}
        onSelect={setSelectedPeriod}
        selectedPeriod={activePeriod}
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              className="rounded-[22px] border border-black/5 bg-white p-4 shadow-[0_10px_30px_rgba(49,20,133,0.05)]"
              key={metric.label}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${metric.iconClassName}`}>
                <Icon aria-hidden="true" className="h-4 w-4" />
              </div>
              <p className="mt-4 text-xl font-extrabold tracking-[-0.02em] text-[#1b1c19]">
                {metric.value}
              </p>
              <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#797583]">
                {metric.label}
              </p>
              <p className="mt-1 text-[10px] font-semibold text-[#aaa5a1]">
                {formatDate(activePeriod)}
              </p>
            </article>
          );
        })}
      </section>

      <AudienceTrendChart data={chartData} selectedPeriod={activePeriod} />
      <EngagementChart data={chartData} selectedPeriod={activePeriod} />
      <ActivityTable data={data} selectedPeriod={activePeriod} />
    </div>
  );
}

function TimelinePicker({
  data,
  onSelect,
  selectedPeriod,
}: {
  data: AdminActivityPoint[];
  onSelect: (period: string) => void;
  selectedPeriod: string;
}) {
  return (
    <section className="rounded-[26px] border border-[#d8ceff] bg-[#f5f1ff] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#614db7] text-white">
            <CalendarDays aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#614db7]">
              Select time point
            </p>
            <p className="mt-1 text-sm font-bold text-[#1b1c19]">
              Showing data for {formatDate(selectedPeriod)}
            </p>
          </div>
        </div>
        <p className="text-xs font-semibold text-[#797583]">
          Choose a day to update the metrics below
        </p>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {data.map((item) => {
          const isSelected = item.period === selectedPeriod;

          return (
            <button
              aria-pressed={isSelected}
              className={`relative min-w-[104px] rounded-2xl border px-3 py-3 text-left transition ${
                isSelected
                  ? "border-[#614db7] bg-[#614db7] text-white shadow-lg shadow-[#614db7]/20"
                  : "border-white bg-white text-[#5f5e5e] hover:border-[#cabeff] hover:text-[#311485]"
              }`}
              key={item.period}
              onClick={() => onSelect(item.period)}
              type="button"
            >
              <span className={`block text-[10px] font-extrabold uppercase tracking-[0.08em] ${isSelected ? "text-white/65" : "text-[#999492]"}`}>
                {formatWeekday(item.period)}
              </span>
              <span className="mt-1 block text-sm font-extrabold">
                {formatChartDate(item.period)}
              </span>
              {isSelected ? (
                <Check aria-hidden="true" className="absolute right-2.5 top-2.5 h-3.5 w-3.5" />
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AudienceTrendChart({
  data,
  selectedPeriod,
}: {
  data: Array<AdminActivityPoint & { periodLabel: string }>;
  selectedPeriod: string;
}) {
  const selectedLabel = formatChartDate(selectedPeriod);

  return (
    <article className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_14px_40px_rgba(49,20,133,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#614db7]">
            Audience & quality
          </p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-[#1b1c19]">
            Daily platform momentum
          </h3>
        </div>
        <p className="max-w-[420px] text-sm font-semibold leading-6 text-[#797583]">
          Active and new users are measured on the left axis; accuracy uses the percentage axis.
        </p>
      </div>

      <div className="mt-5 h-[360px] min-w-0 rounded-[22px] bg-[#fbf9f4] px-1 py-4 sm:px-4">
        <ResponsiveContainer height="100%" minWidth={0} width="100%">
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={{ bottom: 4, left: 0, right: 4, top: 8 }}
          >
            <defs>
              <linearGradient id="adminActiveGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#9b87f5" stopOpacity={0.42} />
                <stop offset="100%" stopColor="#9b87f5" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e9e4f3" strokeDasharray="4 4" vertical={false} />
            <ReferenceLine
              label={{ fill: "#614db7", fontSize: 10, fontWeight: 800, value: "Selected" }}
              stroke="#614db7"
              strokeDasharray="5 5"
              x={selectedLabel}
              yAxisId="users"
            />
            <XAxis
              axisLine={false}
              dataKey="periodLabel"
              minTickGap={18}
              tick={{ fill: "#797583", fontSize: 11, fontWeight: 700 }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tick={{ fill: "#797583", fontSize: 11, fontWeight: 700 }}
              tickFormatter={(value) => compactNumber(Number(value))}
              tickLine={false}
              width={52}
              yAxisId="users"
            />
            <YAxis
              axisLine={false}
              domain={[0, 100]}
              orientation="right"
              tick={{ fill: "#9a5b16", fontSize: 11, fontWeight: 700 }}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              width={44}
              yAxisId="accuracy"
            />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value, name) => [
                name === "Accuracy"
                  ? `${formatNumber(Number(value))}%`
                  : formatNumber(Number(value)),
                String(name),
              ]}
              labelStyle={{ color: "#614db7", fontWeight: 800 }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", fontWeight: 700, paddingTop: "12px" }}
            />
            <Area
              dataKey="activeUsers"
              fill="url(#adminActiveGradient)"
              name="Active users"
              stroke="#614db7"
              strokeWidth={3}
              type="monotone"
              yAxisId="users"
            />
            <Line
              activeDot={{ fill: "#311485", r: 6, stroke: "#ffffff", strokeWidth: 3 }}
              dataKey="newUsers"
              dot={false}
              name="New users"
              stroke="#311485"
              strokeWidth={3}
              type="monotone"
              yAxisId="users"
            />
            <Line
              activeDot={{ fill: "#f2b84b", r: 6, stroke: "#ffffff", strokeWidth: 3 }}
              dataKey="accuracy"
              dot={false}
              name="Accuracy"
              stroke="#f2b84b"
              strokeDasharray="7 5"
              strokeWidth={3}
              type="monotone"
              yAxisId="accuracy"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function EngagementChart({
  data,
  selectedPeriod,
}: {
  data: Array<AdminActivityPoint & { periodLabel: string }>;
  selectedPeriod: string;
}) {
  const selectedLabel = formatChartDate(selectedPeriod);

  return (
    <article className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_14px_40px_rgba(49,20,133,0.06)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#614db7]">
            Study engagement
          </p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-[#1b1c19]">
            Sessions and reviews
          </h3>
        </div>
        <p className="text-xs font-bold text-[#999492]">Daily interval</p>
      </div>

      <div className="mt-5 h-[320px] min-w-0 rounded-[22px] bg-[#fbf9f4] px-1 py-4 sm:px-4">
        <ResponsiveContainer height="100%" minWidth={0} width="100%">
          <BarChart
            accessibilityLayer
            barGap={4}
            data={data}
            margin={{ bottom: 4, left: 0, right: 2, top: 8 }}
          >
            <CartesianGrid stroke="#e9e4f3" strokeDasharray="4 4" vertical={false} />
            <ReferenceLine
              stroke="#614db7"
              strokeDasharray="5 5"
              x={selectedLabel}
              yAxisId="sessions"
            />
            <XAxis
              axisLine={false}
              dataKey="periodLabel"
              minTickGap={18}
              tick={{ fill: "#797583", fontSize: 11, fontWeight: 700 }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tick={{ fill: "#797583", fontSize: 11, fontWeight: 700 }}
              tickFormatter={(value) => compactNumber(Number(value))}
              tickLine={false}
              width={52}
              yAxisId="sessions"
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              orientation="right"
              tick={{ fill: "#797583", fontSize: 11, fontWeight: 700 }}
              tickFormatter={(value) => compactNumber(Number(value))}
              tickLine={false}
              width={52}
              yAxisId="reviews"
            />
            <Tooltip
              contentStyle={chartTooltipStyle}
              cursor={{ fill: "#f1ecff" }}
              formatter={(value, name) => [formatNumber(Number(value)), String(name)]}
              labelStyle={{ color: "#614db7", fontWeight: 800 }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", fontWeight: 700, paddingTop: "12px" }}
            />
            <Bar
              dataKey="sessions"
              fill="#614db7"
              maxBarSize={28}
              name="Sessions"
              radius={[8, 8, 2, 2]}
              yAxisId="sessions"
            />
            <Bar
              dataKey="reviews"
              fill="#b7a8ff"
              maxBarSize={28}
              name="Reviews"
              radius={[8, 8, 2, 2]}
              yAxisId="reviews"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function ActivityTable({
  data,
  selectedPeriod,
}: {
  data: AdminActivityPoint[];
  selectedPeriod: string;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_14px_40px_rgba(49,20,133,0.05)]">
      <div className="flex items-center justify-between gap-4 border-b border-black/5 px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#614db7]">
            Daily breakdown
          </p>
          <h3 className="mt-1 text-lg font-extrabold text-[#1b1c19]">Activity data</h3>
        </div>
        <span className="rounded-full bg-[#f1ecff] px-3 py-1 text-xs font-extrabold text-[#614db7]">
          {formatNumber(data.length)} periods
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-[760px] grid-cols-[1.4fr_repeat(5,minmax(92px,1fr))] bg-[#fbf9f4] px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#797583] sm:px-6">
          <span>Period</span>
          <span>New</span>
          <span>Active</span>
          <span>Sessions</span>
          <span>Reviews</span>
          <span>Accuracy</span>
        </div>
        {data.map((item) => (
          <div
            aria-current={item.period === selectedPeriod ? "date" : undefined}
            className={`grid min-w-[760px] grid-cols-[1.4fr_repeat(5,minmax(92px,1fr))] border-t px-5 py-4 text-sm font-semibold text-[#1b1c19] transition sm:px-6 ${
              item.period === selectedPeriod
                ? "border-[#d8ceff] bg-[#f5f1ff]"
                : "border-black/5 hover:bg-[#fbf9f4]"
            }`}
            key={item.period}
          >
            <span className="font-bold text-[#5f5e5e]">{formatDate(item.period)}</span>
            <span>{formatNumber(item.newUsers)}</span>
            <span>{formatNumber(item.activeUsers)}</span>
            <span>{formatNumber(item.sessions)}</span>
            <span>{formatNumber(item.reviews)}</span>
            <span>
              <span className="rounded-full bg-[#eee8ff] px-2.5 py-1 text-xs font-extrabold text-[#614db7]">
                {item.accuracy}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatChartDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function formatWeekday(value: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    new Date(value),
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
