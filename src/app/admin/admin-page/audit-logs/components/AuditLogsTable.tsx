"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { AdminAuditLog } from "@/services/api";
import type { PageMeta } from "@/services/api/client";
import { auditLogColumns } from "../columns/audit-log.columns";
import { AuditLogMetadataModal } from "./AuditLogMetadataModal";

const tableGridClassName =
  "grid min-w-[1040px] grid-cols-[180px_220px_230px_minmax(280px,1fr)_110px]";

export function AuditLogsTable({
  error,
  isError,
  isFetching,
  isLoading,
  logs,
  meta,
  onPageChange,
}: {
  error: unknown;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  logs: AdminAuditLog[];
  meta?: PageMeta;
  onPageChange: (page: number) => void;
}) {
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm">
        <div className="overflow-x-auto" role="region" aria-label="Audit logs table">
          <div aria-busy={isFetching} className="min-w-[1040px]" role="table">
            <div
              className={`${tableGridClassName} bg-[#f6f2ff] px-4 py-3 text-left text-xs font-extrabold uppercase tracking-normal text-[#614db7]`}
              role="row"
            >
              {auditLogColumns.map((column) => (
                <span key={column.key} role="columnheader">
                  {column.header}
                </span>
              ))}
            </div>

            <div
              className={
                isFetching && !isLoading
                  ? "transition-opacity opacity-60"
                  : "transition-opacity"
              }
              role="rowgroup"
            >
              {isLoading ? <LogsLoading /> : null}
              {isError ? <LogsError error={error} /> : null}
              {!isLoading && !isError && !logs.length ? <LogsEmpty /> : null}

              {!isLoading && !isError
                ? logs.map((log, index) => (
                    <div
                      className={`${tableGridClassName} items-center border-t border-black/5 px-4 py-4 text-sm text-[#1b1c19]`}
                      key={
                        log._id ||
                        log.id ||
                        `${log.createdAt}-${log.targetId}-${index}`
                      }
                      role="row"
                    >
                      {auditLogColumns.map((column) => (
                        <div className="min-w-0 pr-4" key={column.key} role="cell">
                          {column.render(log, {
                            onOpenMetadata: setSelectedLog,
                          })}
                        </div>
                      ))}
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>

      {meta && meta.itemCount > 0 ? (
        <Pagination
          isFetching={isFetching}
          meta={meta}
          onPageChange={onPageChange}
        />
      ) : null}

      {selectedLog ? (
        <AuditLogMetadataModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      ) : null}
    </div>
  );
}

function Pagination({
  isFetching,
  meta,
  onPageChange,
}: {
  isFetching: boolean;
  meta: PageMeta;
  onPageChange: (page: number) => void;
}) {
  const firstItem = (meta.page - 1) * meta.take + 1;
  const lastItem = Math.min(meta.page * meta.take, meta.itemCount);

  return (
    <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-[#5f5e5e]">
        Showing {firstItem}–{lastItem} of {meta.itemCount} logs
      </p>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#5f5e5e]">
          Page {meta.page} of {Math.max(meta.pageCount, 1)}
        </span>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous audit log page"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:bg-[#e6deff] hover:text-[#311485] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[#f6f3ee] disabled:hover:text-[#5f5e5e]"
            disabled={!meta.hasPreviousPage || isFetching}
            onClick={() => onPageChange(meta.page - 1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            aria-label="Next audit log page"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:bg-[#e6deff] hover:text-[#311485] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[#f6f3ee] disabled:hover:text-[#5f5e5e]"
            disabled={!meta.hasNextPage || isFetching}
            onClick={() => onPageChange(meta.page + 1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function LogsLoading() {
  return (
    <div
      className="flex min-h-[220px] min-w-[1040px] items-center justify-center gap-2 border-t border-black/5 text-sm font-bold text-[#614db7]"
      role="status"
    >
      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      Loading audit logs
    </div>
  );
}

function LogsError({ error }: { error: unknown }) {
  return (
    <div
      className="min-w-[1040px] border-t border-black/5 bg-[#fff0f0] p-5 text-sm font-bold text-[#a33a3a]"
      role="alert"
    >
      {error instanceof Error ? error.message : "Unable to load audit logs."}
    </div>
  );
}

function LogsEmpty() {
  return (
    <div className="min-w-[1040px] border-t border-black/5 p-8 text-center text-sm font-bold text-[#614db7]">
      No audit logs match the current filters.
    </div>
  );
}
