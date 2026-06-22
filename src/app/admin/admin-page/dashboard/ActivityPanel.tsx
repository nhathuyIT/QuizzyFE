"use client";

import { useState } from "react";
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
  if (isLoading) return <PanelLoading label="Loading activity API" />;
  if (error) return <PanelError error={error} />;
  if (!data.length) return <PanelEmpty label="No activity series available." />;

  return <ActivityContent data={data} />;
}

function ActivityContent({ data }: { data: AdminActivityPoint[] }) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const selectedActivity =
    data.find((item) => item.period === selectedPeriod) ?? null;

  return (
    <div className="space-y-5">
      <ActivityCards
        data={data}
        onSelect={setSelectedPeriod}
        selectedPeriod={selectedPeriod}
      />

      {selectedActivity ? (
        <SelectedDayLineChart data={selectedActivity} />
      ) : (
        <div className="rounded-[26px] border border-dashed border-[#cabeff] bg-[#f6f2ff] p-8 text-center">
          <p className="text-sm font-extrabold text-[#614db7]">
            Select a day to view its line chart.
          </p>
          <p className="mt-2 text-sm font-semibold text-[#5f5e5e]">
            The chart appears only after you choose a period above.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-[26px] border border-black/5">
        <div className="grid min-w-[720px] grid-cols-[1.4fr_repeat(5,minmax(88px,1fr))] bg-[#f6f2ff] px-4 py-3 text-xs font-extrabold uppercase tracking-normal text-[#614db7]">
          <span>Period</span>
          <span>New</span>
          <span>Active</span>
          <span>Sessions</span>
          <span>Reviews</span>
          <span>Accuracy</span>
        </div>
        <div className="overflow-x-auto">
          {data.map((item) => (
            <div
              className="grid min-w-[720px] grid-cols-[1.4fr_repeat(5,minmax(88px,1fr))] border-t border-black/5 px-4 py-4 text-sm font-semibold text-[#1b1c19]"
              key={item.period}
            >
              <span className="text-[#5f5e5e]">{formatDate(item.period)}</span>
              <span>{formatNumber(item.newUsers)}</span>
              <span>{formatNumber(item.activeUsers)}</span>
              <span>{formatNumber(item.sessions)}</span>
              <span>{formatNumber(item.reviews)}</span>
              <span>{item.accuracy}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const activityMetrics = [
  { key: "newUsers", label: "New users", color: "#614db7" },
  { key: "activeUsers", label: "Active users", color: "#311485" },
  { key: "sessions", label: "Sessions", color: "#9b87f5" },
  { key: "reviews", label: "Reviews", color: "#f5d547" },
] as const;

function ActivityCards({
  data,
  onSelect,
  selectedPeriod,
}: {
  data: AdminActivityPoint[];
  onSelect: (period: string) => void;
  selectedPeriod: string | null;
}) {
  return (
    <article className="rounded-[28px] border border-black/5 bg-[#fbf9f4] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-[#614db7]">
            Activity Analytics
          </p>
          <h3 className="mt-2 [font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
            Daily activity cards
          </h3>
        </div>
        <p className="max-w-[420px] text-sm font-semibold leading-6 text-[#5f5e5e]">
          Each card is one period. Select a card to open the line chart for that day.
        </p>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {data.map((item) => (
          <button
            className={`rounded-[26px] border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(49,20,133,0.08)] ${
              selectedPeriod === item.period
                ? "border-[#614db7] bg-[#f6f2ff] shadow-[0_16px_40px_rgba(49,20,133,0.10)]"
                : "border-black/5 bg-white"
            }`}
            key={item.period}
            onClick={() => onSelect(item.period)}
            type="button"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-[#797583]">
                  Period
                </p>
                <h4 className="mt-1 text-lg font-extrabold text-[#1b1c19]">
                  {formatDate(item.period)}
                </h4>
              </div>
              <div className="rounded-2xl bg-[#f6f2ff] px-4 py-2 text-right">
                <p className="text-[11px] font-bold uppercase tracking-normal text-[#614db7]">
                  Accuracy
                </p>
                <p className="text-lg font-extrabold text-[#311485]">
                  {item.accuracy}%
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {activityMetrics.map((metric) => (
                <div
                  className="rounded-2xl border border-black/5 bg-[#fbf9f4] px-4 py-3"
                  key={metric.key}
                >
                  <p className="text-[11px] font-bold uppercase tracking-normal text-[#797583]">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-[#1b1c19]">
                    {formatNumber(Number(item[metric.key]))}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e4e2dd]">
              <div
                className="h-full rounded-full bg-[#614db7]"
                style={{
                  width: `${Math.min(100, Math.max(0, item.accuracy))}%`,
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </article>
  );
}

function SelectedDayLineChart({ data }: { data: AdminActivityPoint }) {
  const chartItems = activityMetrics.map((metric) => ({
    color: metric.color,
    label: metric.label,
    value: Number(data[metric.key]),
  }));
  const width = 760;
  const height = 260;
  const padding = { bottom: 44, left: 48, right: 28, top: 28 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(1, ...chartItems.map((item) => item.value));
  const xForIndex = (index: number) =>
    padding.left + (index / (chartItems.length - 1)) * plotWidth;
  const yForValue = (value: number) =>
    padding.top + plotHeight - (value / maxValue) * plotHeight;
  const points = chartItems.map((item, index) => ({
    ...item,
    x: xForIndex(index),
    y: yForValue(item.value),
  }));
  const gridLines = [0, 0.5, 1].map((ratio) => ({
    label: Math.round(maxValue * (1 - ratio)),
    y: padding.top + plotHeight * ratio,
  }));

  return (
    <article className="rounded-[28px] border border-[#cabeff] bg-white p-5 shadow-[0_18px_60px_rgba(49,20,133,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-[#614db7]">
            Selected Day Chart
          </p>
          <h3 className="mt-2 [font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
            {formatDate(data.period)}
          </h3>
        </div>
        <div className="rounded-2xl bg-[#f6f2ff] px-4 py-2 text-right">
          <p className="text-[11px] font-bold uppercase tracking-normal text-[#614db7]">
            Accuracy
          </p>
          <p className="text-lg font-extrabold text-[#311485]">{data.accuracy}%</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[24px] bg-[#fbf9f4] p-3">
        <svg
          aria-label="Selected day activity line chart"
          className="min-w-[680px]"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
        >
          {gridLines.map((line) => (
            <g key={line.y}>
              <line
                stroke="#ece8f4"
                strokeWidth="1"
                x1={padding.left}
                x2={width - padding.right}
                y1={line.y}
                y2={line.y}
              />
              <text
                fill="#797583"
                fontSize="12"
                fontWeight="700"
                textAnchor="end"
                x={padding.left - 12}
                y={line.y + 4}
              >
                {formatNumber(line.label)}
              </text>
            </g>
          ))}

          <polyline
            fill="none"
            points={points.map((point) => `${point.x},${point.y}`).join(" ")}
            stroke="#614db7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
          />

          {points.map((point) => (
            <g key={point.label}>
              <circle
                cx={point.x}
                cy={point.y}
                fill="#ffffff"
                r="7"
                stroke={point.color}
                strokeWidth="4"
              >
                <title>{`${point.label}: ${formatNumber(point.value)}`}</title>
              </circle>
              <text
                fill="#1b1c19"
                fontSize="13"
                fontWeight="800"
                textAnchor="middle"
                x={point.x}
                y={point.y - 14}
              >
                {formatNumber(point.value)}
              </text>
              <text
                fill="#797583"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                x={point.x}
                y={height - 13}
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </article>
  );
}
