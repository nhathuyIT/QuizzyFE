"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { adminAPI } from "@/services/api";
import { AuditLogsTable } from "./components/AuditLogsTable";

export function AuditLogsPanel() {
  const [page, setPage] = useState(1);
  const take = 10;

  const logsQuery = useQuery({
    queryKey: ["admin", "audit-logs", { page, take }],
    queryFn: () => adminAPI.getAuditLogs({ page, take }),
    retry: false,
  });

  const logs = useMemo(() => logsQuery.data?.data ?? [], [logsQuery.data]);
  const meta = logsQuery.data?.meta;

  const handleRefresh = () => {
    logsQuery.refetch();
  };

  const isFetching = logsQuery.isFetching;

  return (
    <section className="mt-10 rounded-[32px] border border-black/5 bg-white p-5 shadow-[0_18px_60px_rgba(49,20,133,0.08)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-black/5 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
            System Audit Logs
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#5f5e5e]">
            Monitor all critical administrative and user actions across the platform.
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
        <AuditLogsTable
          error={logsQuery.error}
          isError={logsQuery.isError}
          isLoading={logsQuery.isPending}
          logs={logs}
          meta={meta}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}
