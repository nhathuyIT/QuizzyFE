import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { AdminStudySession } from "@/services/api";
import type { PageMeta } from "@/services/api/client";
import { studySessionColumns } from "../columns/study-session.columns";

export function StudySessionTable({
  error,
  isError,
  isLoading,
  sessions,
  meta,
  onPageChange,
  onOpenSession,
}: {
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  sessions: AdminStudySession[];
  meta?: PageMeta;
  onPageChange: (page: number) => void;
  onOpenSession: (session: AdminStudySession) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm">
        <div className="grid min-w-[780px] grid-cols-[1.2fr_1.5fr_100px_140px_100px_90px] bg-[#f6f2ff] px-4 py-3 text-xs font-extrabold uppercase tracking-normal text-[#614db7]">
          {studySessionColumns.map((column) => (
            <span key={column.key}>{column.header}</span>
          ))}
        </div>

        <div className="overflow-x-auto">
          {isLoading ? <SessionsLoading /> : null}
          {isError ? <SessionsError error={error} /> : null}
          {!isLoading && !isError && !sessions.length ? <SessionsEmpty /> : null}

          {sessions.map((session) => (
            <div
              className="grid min-w-[780px] grid-cols-[1.2fr_1.5fr_100px_140px_100px_90px] items-center border-t border-black/5 px-4 py-4 text-sm text-[#1b1c19]"
              key={session._id || session.id}
            >
              {studySessionColumns.map((column) => (
                <div key={column.key}>{column.render(session, { onOpenSession })}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {meta && meta.pageCount > 1 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-semibold text-[#5f5e5e]">
            Page {meta.page} of {meta.pageCount}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={!meta.hasPreviousPage}
              onClick={() => onPageChange(meta.page - 1)}
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:bg-[#e6deff] hover:text-[#311485] disabled:opacity-50 disabled:hover:bg-[#f6f3ee] disabled:hover:text-[#5f5e5e]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              disabled={!meta.hasNextPage}
              onClick={() => onPageChange(meta.page + 1)}
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:bg-[#e6deff] hover:text-[#311485] disabled:opacity-50 disabled:hover:bg-[#f6f3ee] disabled:hover:text-[#5f5e5e]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SessionsLoading() {
  return (
    <div className="flex min-h-[220px] min-w-[780px] items-center justify-center gap-2 text-sm font-bold text-[#614db7]">
      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      Loading sessions...
    </div>
  );
}

function SessionsError({ error }: { error: unknown }) {
  return (
    <div className="min-w-[780px] bg-[#fff0f0] p-5 text-sm font-bold text-[#a33a3a]">
      {error instanceof Error ? error.message : "Unable to load sessions."}
    </div>
  );
}

function SessionsEmpty() {
  return (
    <div className="min-w-[780px] p-8 text-center text-sm font-bold text-[#614db7]">
      No study sessions found.
    </div>
  );
}
