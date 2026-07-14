import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { AdminAuditLog } from "@/services/api";
import type { PageMeta } from "@/services/api/client";
import { auditLogColumns } from "../columns/audit-log.columns";

export function AuditLogsTable({
  error,
  isError,
  isLoading,
  logs,
  meta,
  onPageChange,
}: {
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  logs: AdminAuditLog[];
  meta?: PageMeta;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm">
        <div className="grid min-w-[1000px] grid-cols-[170px_minmax(0,1fr)_140px_minmax(0,1.8fr)_minmax(0,2fr)] bg-[#f6f2ff] px-4 py-3 text-xs font-extrabold uppercase tracking-normal text-[#614db7]">
          {auditLogColumns.map((column) => (
            <span key={column.key}>{column.header}</span>
          ))}
        </div>

        <div className="overflow-x-auto">
          {isLoading ? <LogsLoading /> : null}
          {isError ? <LogsError error={error} /> : null}
          {!isLoading && !isError && !logs.length ? <LogsEmpty /> : null}

          {logs.map((log) => (
            <div
              className="grid min-w-[1000px] grid-cols-[170px_minmax(0,1fr)_140px_minmax(0,1.8fr)_minmax(0,2fr)] items-start border-t border-black/5 px-4 py-4 text-sm text-[#1b1c19]"
              key={log._id || log.id}
            >
              {auditLogColumns.map((column) => (
                <div key={column.key}>{column.render(log)}</div>
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

function LogsLoading() {
  return (
    <div className="flex min-h-[220px] min-w-[900px] items-center justify-center gap-2 text-sm font-bold text-[#614db7]">
      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      Loading audit logs...
    </div>
  );
}

function LogsError({ error }: { error: unknown }) {
  return (
    <div className="min-w-[900px] bg-[#fff0f0] p-5 text-sm font-bold text-[#a33a3a]">
      {error instanceof Error ? error.message : "Unable to load audit logs."}
    </div>
  );
}

function LogsEmpty() {
  return (
    <div className="min-w-[900px] p-8 text-center text-sm font-bold text-[#614db7]">
      No audit logs found.
    </div>
  );
}
