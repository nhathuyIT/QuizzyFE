import {
  AlertTriangle,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  Clock,
  RefreshCw,
  Target,
  UsersRound,
} from "lucide-react";
import type { AdminStudySummary } from "@/services/api";

type StudySummaryCardsProps = {
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  onRetry: () => void;
  summary?: AdminStudySummary;
};

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

export function StudySummaryCards({
  error,
  isError,
  isLoading,
  onRetry,
  summary,
}: StudySummaryCardsProps) {
  if (isLoading) {
    return (
      <div
        aria-label="Loading study overview"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6"
        role="status"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <div
            className="flex min-h-36 animate-pulse flex-col items-center justify-center rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
            key={index}
          >
            <span className="h-10 w-10 rounded-xl bg-[#eee9f7]" />
            <span className="mt-3 h-7 w-16 rounded-md bg-[#eee9f7]" />
            <span className="mt-2 h-3 w-24 rounded bg-[#f3eff8]" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-2xl border border-[#f4caca] bg-[#fff7f7] p-6 text-center">
        <AlertTriangle aria-hidden="true" className="h-6 w-6 text-[#a33a3a]" />
        <div>
          <p className="text-sm font-extrabold text-[#a33a3a]">
            Unable to load the study overview.
          </p>
          <p className="mt-1 text-xs font-semibold text-[#875f5f]">
            {getErrorMessage(error)}
          </p>
        </div>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-xs font-extrabold text-[#a33a3a] shadow-sm transition hover:bg-[#fff0f0]"
          onClick={onRetry}
          type="button"
        >
          <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Sessions",
      value: formatNumber(summary?.sessions),
      icon: BrainCircuit,
      color: "text-[#614db7]",
      bg: "bg-[#e6deff]",
    },
    {
      label: "Active Learners",
      value: formatNumber(summary?.activeUsers),
      icon: UsersRound,
      color: "text-[#311485]",
      bg: "bg-[#d8ccff]",
    },
    {
      label: "Total Reviews",
      value: formatNumber(summary?.reviews),
      icon: BookOpenCheck,
      color: "text-[#276345]",
      bg: "bg-[#d7f2e3]",
    },
    {
      label: "Accuracy",
      value: formatPercentage(summary?.accuracy),
      icon: Target,
      color: "text-[#b25e09]",
      bg: "bg-[#fcecd4]",
    },
    {
      label: "Completion Rate",
      value: formatPercentage(summary?.completionRate),
      icon: CheckCircle2,
      color: "text-[#1d5c7a]",
      bg: "bg-[#d4f0fc]",
    },
    {
      label: "Avg. Session Time",
      value: formatDuration(summary?.averageStudyTimeSeconds),
      icon: Clock,
      color: "text-[#a33a3a]",
      bg: "bg-[#fff0f0]",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-black/5 bg-white p-5 text-center shadow-sm"
            key={card.label}
          >
            <span
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="text-2xl font-extrabold text-[#1b1c19]">
              {card.value}
            </span>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#8a8784]">
              {card.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function formatNumber(value?: number) {
  return Number.isFinite(value) ? numberFormatter.format(value ?? 0) : "—";
}

function formatPercentage(value?: number) {
  return Number.isFinite(value) ? `${numberFormatter.format(value ?? 0)}%` : "—";
}

function formatDuration(value?: number) {
  if (!Number.isFinite(value)) return "—";

  const totalSeconds = Math.max(0, Math.round(value ?? 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Please try again in a moment.";
}
