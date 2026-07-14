"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, LayoutDashboard } from "lucide-react";
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
    <section className="mt-8">
      <div className="flex flex-col gap-4 rounded-[26px] border border-black/5 bg-white p-3 shadow-[0_12px_36px_rgba(49,20,133,0.06)] sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div>
          <div className="flex items-center gap-3 px-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1b1c19] text-white">
              <LayoutDashboard aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-[#1b1c19]">Analytics workspace</h2>
              <p className="mt-0.5 text-xs font-semibold text-[#797583]">
                Platform health and daily activity
              </p>
            </div>
          </div>
        </div>

        <div
          aria-label="Dashboard view"
          className="flex w-full rounded-2xl bg-[#f6f3ee] p-1.5 sm:w-fit"
          role="group"
        >
          <button
            aria-pressed={activeView === "summary"}
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold transition sm:flex-none ${
              activeView === "summary"
                ? "bg-[#614db7] text-white shadow-lg shadow-[#614db7]/20"
                : "text-[#5f5e5e] hover:text-[#1b1c19]"
            }`}
            onClick={() => setActiveView("summary")}
            type="button"
          >
            <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
            Overview
          </button>
          <button
            aria-pressed={activeView === "activity"}
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold transition sm:flex-none ${
              activeView === "activity"
                ? "bg-[#614db7] text-white shadow-lg shadow-[#614db7]/20"
                : "text-[#5f5e5e] hover:text-[#1b1c19]"
            }`}
            onClick={() => setActiveView("activity")}
            type="button"
          >
            <Activity aria-hidden="true" className="h-4 w-4" />
            Activity
          </button>
        </div>
      </div>

      <div
        aria-busy={
          activeView === "summary"
            ? summaryQuery.isFetching
            : activityQuery.isFetching
        }
        className="pt-5"
      >
        {activeView === "summary" ? (
          <SummaryPanel
            data={summaryQuery.data?.data}
            error={summaryQuery.error}
            isLoading={summaryQuery.isPending}
            isRetrying={summaryQuery.isFetching}
            onRetry={() => void summaryQuery.refetch()}
          />
        ) : (
          <ActivityPanel
            data={activityQuery.data?.data?.series ?? []}
            error={activityQuery.error}
            isLoading={activityQuery.isPending}
            isRetrying={activityQuery.isFetching}
            onRetry={() => void activityQuery.refetch()}
          />
        )}
      </div>
    </section>
  );
}
