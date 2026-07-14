import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { AdminStudySession } from "@/services/api";
import type { PageMeta } from "@/services/api/client";
import { studySessionColumns } from "../columns/study-session.columns";

type StudySessionTableProps = {
  error: unknown;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  meta?: PageMeta;
  onOpenSession: (session: AdminStudySession) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  sessions: AdminStudySession[];
};

const tableGridClassName =
  "grid min-w-[1080px] grid-cols-[minmax(190px,1.45fr)_minmax(170px,1.25fr)_105px_120px_165px_110px_85px] gap-3";

export function StudySessionTable({
  error,
  isError,
  isFetching,
  isLoading,
  meta,
  onOpenSession,
  onPageChange,
  onRetry,
  sessions,
}: StudySessionTableProps) {
  const currentPage = meta?.page ?? 1;
  const pageCount = Math.max(meta?.pageCount ?? 1, 1);
  const itemCount = meta?.itemCount ?? sessions.length;

  return (
    <div className="flex flex-col gap-4" aria-busy={isFetching}>
      <div className="relative overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm">
        {isFetching && !isLoading ? (
          <div className="absolute inset-x-0 top-0 z-10 h-1 overflow-hidden bg-[#e6deff]">
            <span className="block h-full w-1/2 animate-pulse rounded-full bg-[#614db7]" />
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <div
            className={`${tableGridClassName} bg-[#f6f2ff] px-4 py-3 text-xs font-extrabold uppercase tracking-normal text-[#614db7]`}
          >
            {studySessionColumns.map((column) => (
              <span key={column.key}>{column.header}</span>
            ))}
          </div>

          {isLoading ? <SessionsLoading /> : null}
          {isError && !isLoading ? (
            <SessionsError error={error} onRetry={onRetry} />
          ) : null}
          {!isLoading && !isError && sessions.length === 0 ? (
            <SessionsEmpty />
          ) : null}

          {!isLoading && !isError ? (
            <div
              className={`transition-opacity ${
                isFetching ? "pointer-events-none opacity-55" : "opacity-100"
              }`}
            >
              {sessions.map((session, index) => (
                <div
                  className={`${tableGridClassName} items-center border-t border-black/5 px-4 py-4 text-sm text-[#1b1c19]`}
                  key={
                    session.id ||
                    session._id ||
                    `${session.userId}-${session.startedAt}-${index}`
                  }
                >
                  {studySessionColumns.map((column) => (
                    <div className="min-w-0" key={column.key}>
                      {column.render(session, { onOpenSession })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {!isLoading && !isError ? (
        <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold text-[#5f5e5e]">
            {itemCount === 0
              ? "No sessions"
              : `${itemCount.toLocaleString()} total ${
                  itemCount === 1 ? "session" : "sessions"
                }`}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#5f5e5e]">
              Page {currentPage} of {pageCount}
            </span>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous page"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:bg-[#e6deff] hover:text-[#311485] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[#f6f3ee] disabled:hover:text-[#5f5e5e]"
                disabled={!meta?.hasPreviousPage || isFetching}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                type="button"
              >
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                aria-label="Next page"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:bg-[#e6deff] hover:text-[#311485] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[#f6f3ee] disabled:hover:text-[#5f5e5e]"
                disabled={!meta?.hasNextPage || isFetching}
                onClick={() => onPageChange(currentPage + 1)}
                type="button"
              >
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SessionsLoading() {
  return (
    <div
      className="flex min-h-60 min-w-[1080px] items-center justify-center gap-2 text-sm font-bold text-[#614db7]"
      role="status"
    >
      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      Loading sessions...
    </div>
  );
}

function SessionsError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-52 min-w-[1080px] flex-col items-center justify-center gap-3 bg-[#fff7f7] p-6 text-center">
      <AlertTriangle aria-hidden="true" className="h-6 w-6 text-[#a33a3a]" />
      <div>
        <p className="text-sm font-extrabold text-[#a33a3a]">
          Unable to load study sessions.
        </p>
        <p className="mt-1 text-xs font-semibold text-[#875f5f]">
          {error instanceof Error ? error.message : "Please try again."}
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

function SessionsEmpty() {
  return (
    <div className="flex min-h-52 min-w-[1080px] items-center justify-center p-8 text-center text-sm font-bold text-[#614db7]">
      No study sessions match the current filters.
    </div>
  );
}
