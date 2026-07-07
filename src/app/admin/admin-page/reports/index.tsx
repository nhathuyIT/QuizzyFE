"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { adminAPI, type AdminStudySession } from "@/services/api";
import { StudySummaryCards } from "./components/StudySummaryCards";
import { StudySessionTable } from "./components/StudySessionTable";
import { StudySessionDetailModal } from "./components/StudySessionDetailModal";

export function ReportsPanel() {
  const [page, setPage] = useState(1);
  const take = 5; // User requested 5 items per page
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const summaryQuery = useQuery({
    queryKey: ["admin", "study", "summary"],
    queryFn: () => adminAPI.getStudySummary(),
    retry: false,
  });

  const sessionsQuery = useQuery({
    queryKey: ["admin", "study-sessions", { page, take }],
    queryFn: () => adminAPI.getStudySessions({ page, take }),
    retry: false,
  });

  const sessions = useMemo(() => sessionsQuery.data?.data ?? [], [sessionsQuery.data]);
  const meta = sessionsQuery.data?.meta;

  const handleRefresh = () => {
    summaryQuery.refetch();
    sessionsQuery.refetch();
  };

  const handleOpenSession = (session: AdminStudySession) => {
    if (session.id || session._id) {
      setSelectedSessionId(session.id || session._id || null);
    }
  };

  const handleCloseSession = () => {
    setSelectedSessionId(null);
  };

  const isFetching = summaryQuery.isFetching || sessionsQuery.isFetching;

  return (
    <section className="mt-10 rounded-[32px] border border-black/5 bg-white p-5 shadow-[0_18px_60px_rgba(49,20,133,0.08)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-black/5 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
            Study Analytics
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#5f5e5e]">
            Monitor learner engagement, overall accuracy, and recent study sessions.
          </p>
        </div>

        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white border border-black/5 px-5 text-sm font-extrabold text-[#5f5e5e] shadow-sm transition hover:text-[#1b1c19] disabled:opacity-60"
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

      <div className="pt-6">
        <StudySummaryCards summary={summaryQuery.data?.data} />
      </div>

      <div className="pt-6">
        <h3 className="mb-4 text-lg font-extrabold text-[#1b1c19]">Recent Sessions</h3>
        <StudySessionTable
          error={sessionsQuery.error}
          isError={sessionsQuery.isError}
          isLoading={sessionsQuery.isPending}
          sessions={sessions}
          meta={meta}
          onPageChange={setPage}
          onOpenSession={handleOpenSession}
        />
      </div>

      {selectedSessionId ? (
        <StudySessionDetailModal
          sessionId={selectedSessionId}
          onClose={handleCloseSession}
        />
      ) : null}
    </section>
  );
}
