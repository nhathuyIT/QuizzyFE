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
      <div className="overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm w-full">
        <div className="w-full">
          <div className="grid grid-cols-[170px_minmax(0,1fr)_220px_minmax(0,2fr)_100px] bg-[#f6f2ff] px-4 py-3 text-xs font-extrabold uppercase tracking-normal text-[#614db7]">
              {auditLogColumns.map((column) => (
                <span 
                  key={column.key}
                  className={column.key === "metadata" ? "text-center block w-full" : ""}
                >
                  {column.header}
                </span>
              ))}
            </div>

            <div className="w-full">
              {isLoading ? <LogsLoading /> : null}
              {isError ? <LogsError error={error} /> : null}
              {!isLoading && !isError && !logs.length ? <LogsEmpty /> : null}

              {logs.map((log) => (
                <div
                  className="grid grid-cols-[170px_minmax(0,1fr)_220px_minmax(0,2fr)_100px] items-center border-t border-black/5 px-4 py-4 text-sm text-[#1b1c19] w-full"
                  key={log._id || log.id}
                >
                  {auditLogColumns.map((column) => (
                    <div 
                      className={`min-w-0 w-full ${column.key === "metadata" ? "text-center" : ""}`} 
                      key={column.key}
                    >
                      {column.render(log)}
                    </div>
                  ))}
                </div>
              ))}
          </div>
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
