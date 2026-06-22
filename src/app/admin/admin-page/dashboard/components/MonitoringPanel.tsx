"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "@/services/api";
import { ActivityPanel } from "./ActivityPanel";
import { SummaryPanel } from "./SummaryPanel";

type AdminView = "summary" | "activity";

export function MonitoringPanel() {
  const [activeView, setActiveView] = useState<AdminView>("summary");
  const summaryQuery = useQuery({
    queryKey: ["admin", "dashboard-summary"],
    queryFn: () => adminAPI.getDashboardSummary(),
    enabled: activeView === "summary",
    retry: false,
  });
  const activityQuery = useQuery({
    queryKey: ["admin", "activity-analytics", "day"],
    queryFn: () => adminAPI.getActivityAnalytics("day"),
    enabled: activeView === "activity",
    retry: false,
  });

  return (
    <section className="mt-10 rounded-[32px] border border-black/5 bg-white p-5 shadow-[0_18px_60px_rgba(49,20,133,0.08)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-black/5 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
            Monitoring
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#5f5e5e]">
            Switch between the two admin monitoring APIs.
          </p>
        </div>

        <div className="flex w-full rounded-full bg-[#f6f3ee] p-1 sm:w-fit">
          <button
            className={`h-11 flex-1 rounded-full px-5 text-sm font-extrabold transition sm:flex-none ${
              activeView === "summary"
                ? "bg-[#614db7] text-white shadow-lg shadow-[#614db7]/20"
                : "text-[#5f5e5e] hover:text-[#1b1c19]"
            }`}
            onClick={() => setActiveView("summary")}
            type="button"
          >
            Summary
          </button>
          <button
            className={`h-11 flex-1 rounded-full px-5 text-sm font-extrabold transition sm:flex-none ${
              activeView === "activity"
                ? "bg-[#614db7] text-white shadow-lg shadow-[#614db7]/20"
                : "text-[#5f5e5e] hover:text-[#1b1c19]"
            }`}
            onClick={() => setActiveView("activity")}
            type="button"
          >
            Activity
          </button>
        </div>
      </div>

      <div className="pt-6">
        {activeView === "summary" ? (
          <SummaryPanel
            data={summaryQuery.data?.data}
            error={summaryQuery.error}
            isLoading={summaryQuery.isPending}
          />
        ) : (
          <ActivityPanel
            data={activityQuery.data?.data?.series ?? []}
            error={activityQuery.error}
            isLoading={activityQuery.isPending}
          />
        )}
      </div>
    </section>
  );
}
