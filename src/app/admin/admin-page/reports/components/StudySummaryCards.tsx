import { BrainCircuit, Target, CheckCircle2, Clock, UsersRound, BookOpenCheck } from "lucide-react";
import type { AdminStudySummary } from "@/services/api";

export function StudySummaryCards({ summary }: { summary?: AdminStudySummary }) {
  const cards = [
    {
      label: "Total Sessions",
      value: summary?.sessions ?? 0,
      icon: BrainCircuit,
      color: "text-[#614db7]",
      bg: "bg-[#e6deff]",
    },
    {
      label: "Active Learners",
      value: summary?.activeUsers ?? 0,
      icon: UsersRound,
      color: "text-[#311485]",
      bg: "bg-[#d8ccff]",
    },
    {
      label: "Total Reviews",
      value: summary?.reviews ?? 0,
      icon: BookOpenCheck,
      color: "text-[#276345]",
      bg: "bg-[#d7f2e3]",
    },
    {
      label: "Accuracy",
      value: `${summary?.accuracy ?? 0}%`,
      icon: Target,
      color: "text-[#b25e09]",
      bg: "bg-[#fcecd4]",
    },
    {
      label: "Completion Rate",
      value: `${summary?.completionRate ?? 0}%`,
      icon: CheckCircle2,
      color: "text-[#1d5c7a]",
      bg: "bg-[#d4f0fc]",
    },
    {
      label: "Avg. Session Time",
      value: `${summary?.averageStudyTimeSeconds ?? 0}s`,
      icon: Clock,
      color: "text-[#a33a3a]",
      bg: "bg-[#fff0f0]",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-white p-5 text-center shadow-sm"
          >
            <span
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="text-2xl font-extrabold text-[#1b1c19]">{card.value}</span>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#8a8784]">
              {card.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
