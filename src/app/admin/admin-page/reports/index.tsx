"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import {
  adminAPI,
  type AdminStudySession,
  type AdminStudySessionSearchParams,
  type AdminStudySummarySearchParams,
} from "@/services/api";
import { StudyReportFilters } from "./components/StudyReportFilters";
import { StudySessionDetailModal } from "./components/StudySessionDetailModal";
import { StudySessionTable } from "./components/StudySessionTable";
import { StudySummaryCards } from "./components/StudySummaryCards";

export type StudyReportFilterValue = {
  from: string;
  to: string;
  mode: "" | "flashcard" | "learn" | "test" | "match";
  status: "" | "finished" | "unfinished";
  userId: string;
  deckId: string;
};

const EMPTY_FILTERS: StudyReportFilterValue = {
  from: "",
  to: "",
  mode: "",
  status: "",
  userId: "",
  deckId: "",
};

const PAGE_SIZE = 5;

export function ReportsPanel() {
  const [page, setPage] = useState(1);
  const [draftFilters, setDraftFilters] =
    useState<StudyReportFilterValue>(EMPTY_FILTERS);
  const [filters, setFilters] =
    useState<StudyReportFilterValue>(EMPTY_FILTERS);
  const [filterError, setFilterError] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  const summaryParams = useMemo<AdminStudySummarySearchParams>(
    () => ({
      from: toDateBoundary(filters.from, "start"),
      to: toDateBoundary(filters.to, "end"),
      mode: filters.mode || undefined,
    }),
    [filters],
  );

  const sessionParams = useMemo<AdminStudySessionSearchParams>(
    () => ({
      page,
      take: PAGE_SIZE,
      from: toDateBoundary(filters.from, "start"),
      to: toDateBoundary(filters.to, "end"),
      mode: filters.mode || undefined,
      status: filters.status || undefined,
      userId: filters.userId || undefined,
      deckId: filters.deckId || undefined,
    }),
    [filters, page],
  );

  const summaryQuery = useQuery({
    queryKey: ["admin", "study", "summary", summaryParams],
    queryFn: () => adminAPI.getStudySummary(summaryParams),
    retry: false,
  });

  const sessionsQuery = useQuery({
    queryKey: ["admin", "study-sessions", sessionParams],
    queryFn: () => adminAPI.getStudySessions(sessionParams),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const sessions = sessionsQuery.data?.data ?? [];
  const meta = sessionsQuery.data?.meta;
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const isFetching = summaryQuery.isFetching || sessionsQuery.isFetching;

  function handleApplyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      draftFilters.from &&
      draftFilters.to &&
      draftFilters.from > draftFilters.to
    ) {
      setFilterError("The start date must be before or equal to the end date.");
      return;
    }

    setFilterError("");
    setPage(1);
    setFilters({
      ...draftFilters,
      userId: draftFilters.userId.trim(),
      deckId: draftFilters.deckId.trim(),
    });
  }

  function handleResetFilters() {
    setDraftFilters(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setFilterError("");
    setPage(1);
  }

  function handleRefresh() {
    void summaryQuery.refetch();
    void sessionsQuery.refetch();
  }

  function handleOpenSession(session: AdminStudySession) {
    setSelectedSessionId(session.id || session._id || null);
  }

  return (
    <section className="mt-10 rounded-[32px] border border-black/5 bg-white p-5 shadow-[0_18px_60px_rgba(49,20,133,0.08)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-black/5 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
            Study Analytics
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#5f5e5e]">
            Monitor learner engagement, accuracy, and individual study
            sessions.
          </p>
        </div>

        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/5 bg-white px-5 text-sm font-extrabold text-[#5f5e5e] shadow-sm transition hover:text-[#1b1c19] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isFetching}
          onClick={handleRefresh}
          type="button"
        >
          {isFetching ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
          )}
          Refresh
        </button>
      </div>

      <StudyReportFilters
        activeFilterCount={activeFilterCount}
        error={filterError}
        onApply={handleApplyFilters}
        onChange={setDraftFilters}
        onReset={handleResetFilters}
        value={draftFilters}
      />

      <div className="pt-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-extrabold text-[#1b1c19]">Overview</h3>
          {summaryQuery.data?.data ? (
            <span className="text-xs font-bold text-[#797583]">
              {formatSummaryRange(
                summaryQuery.data.data.from,
                summaryQuery.data.data.to,
              )}
            </span>
          ) : null}
        </div>
        <StudySummaryCards
          error={summaryQuery.error}
          isError={summaryQuery.isError}
          isLoading={summaryQuery.isPending}
          onRetry={() => void summaryQuery.refetch()}
          summary={summaryQuery.data?.data}
        />
      </div>

      <div className="pt-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold text-[#1b1c19]">
            Study Sessions
          </h3>
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-[#f6f2ff] px-3 py-1 text-xs font-extrabold text-[#614db7]">
              {activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}
            </span>
          ) : null}
        </div>
        <StudySessionTable
          error={sessionsQuery.error}
          isError={sessionsQuery.isError}
          isFetching={sessionsQuery.isFetching}
          isLoading={sessionsQuery.isPending}
          meta={meta}
          onOpenSession={handleOpenSession}
          onPageChange={setPage}
          onRetry={() => void sessionsQuery.refetch()}
          sessions={sessions}
        />
      </div>

      {selectedSessionId ? (
        <StudySessionDetailModal
          onClose={() => setSelectedSessionId(null)}
          sessionId={selectedSessionId}
        />
      ) : null}
    </section>
  );
}

function toDateBoundary(value: string, boundary: "start" | "end") {
  if (!value) return undefined;

  const time = boundary === "start" ? "00:00:00.000" : "23:59:59.999";
  return new Date(`${value}T${time}`).toISOString();
}

function formatSummaryRange(from: string, to: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return "Current range";
  }

  return `${formatter.format(fromDate)} - ${formatter.format(toDate)}`;
}
