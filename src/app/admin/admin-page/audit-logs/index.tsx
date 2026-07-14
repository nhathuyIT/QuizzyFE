"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Filter,
  Loader2,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import {
  adminAPI,
  type AdminAuditLogSearchParams,
} from "@/services/api";
import { AuditLogsTable } from "./components/AuditLogsTable";

const PAGE_SIZE = 20;
const MONGO_ID_PATTERN = /^[a-f\d]{24}$/i;
const MAX_DATE_RANGE_MS = 365 * 24 * 60 * 60 * 1000;

const auditActions = [
  "user.role_updated",
  "user.status_updated",
  "user.sessions_revoked",
  "user.deleted",
  "user.restored",
  "deck.created",
  "deck.updated",
  "deck.moderated",
  "deck.deleted",
  "deck.restored",
  "academic.department_created",
  "academic.department_updated",
  "academic.department_deactivated",
  "academic.department_restored",
  "academic.subject_created",
  "academic.subject_updated",
  "academic.subject_deactivated",
  "academic.subject_restored",
  "academic.document_updated",
  "academic.document_reviewed",
  "academic.document_archived",
  "academic.document_restored",
];

type AuditLogFilters = {
  action: string;
  adminId: string;
  from: string;
  to: string;
};

const emptyFilters: AuditLogFilters = {
  action: "",
  adminId: "",
  from: "",
  to: "",
};

export function AuditLogsPanel() {
  const [page, setPage] = useState(1);
  const [draftFilters, setDraftFilters] = useState<AuditLogFilters>({
    ...emptyFilters,
  });
  const [appliedFilters, setAppliedFilters] = useState<AuditLogFilters>({
    ...emptyFilters,
  });
  const [filterError, setFilterError] = useState("");

  const queryParams = useMemo<AdminAuditLogSearchParams>(
    () => ({
      page,
      take: PAGE_SIZE,
      adminId: appliedFilters.adminId || undefined,
      action: appliedFilters.action || undefined,
      from: appliedFilters.from
        ? toLocalDayBoundary(appliedFilters.from, "start")
        : undefined,
      to: appliedFilters.to
        ? toLocalDayBoundary(appliedFilters.to, "end")
        : undefined,
    }),
    [appliedFilters, page],
  );

  const logsQuery = useQuery({
    queryKey: ["admin", "audit-logs", queryParams],
    queryFn: () => adminAPI.getAuditLogs(queryParams),
    retry: false,
  });

  const logs = useMemo(() => logsQuery.data?.data ?? [], [logsQuery.data]);
  const meta = logsQuery.data?.meta;
  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  function updateDraftFilter(field: keyof AuditLogFilters, value: string) {
    setDraftFilters((current) => ({ ...current, [field]: value }));
    setFilterError("");
  }

  function handleApplyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedFilters = {
      ...draftFilters,
      action: draftFilters.action.trim(),
      adminId: draftFilters.adminId.trim(),
    };
    const validationError = validateFilters(normalizedFilters);

    if (validationError) {
      setFilterError(validationError);
      return;
    }

    setFilterError("");
    setPage(1);
    setAppliedFilters(normalizedFilters);
  }

  function handleClearFilters() {
    setDraftFilters({ ...emptyFilters });
    setAppliedFilters({ ...emptyFilters });
    setFilterError("");
    setPage(1);
  }

  return (
    <section className="mt-10 rounded-[32px] border border-black/5 bg-white p-5 shadow-[0_18px_60px_rgba(49,20,133,0.08)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-black/5 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
            System Audit Logs
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#5f5e5e]">
            Track administrative actions and inspect the metadata recorded for
            each change.
          </p>
        </div>

        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f6f3ee] px-5 text-sm font-extrabold text-[#5f5e5e] transition hover:text-[#1b1c19] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={logsQuery.isFetching}
          onClick={() => logsQuery.refetch()}
          type="button"
        >
          {logsQuery.isFetching ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
          )}
          Refresh
        </button>
      </div>

      <form
        className="mt-6 rounded-[26px] border border-black/5 bg-[#fbf9f4] p-4 sm:p-5"
        onSubmit={handleApplyFilters}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#311485]">
            <Filter aria-hidden="true" className="h-4 w-4" />
            Filter logs
          </div>
          {activeFilterCount ? (
            <span className="rounded-full bg-[#e6deff] px-3 py-1 text-xs font-extrabold text-[#311485]">
              {activeFilterCount} active
            </span>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FilterField label="Admin ID">
            <input
              className={filterInputClassName}
              onChange={(event) =>
                updateDraftFilter("adminId", event.target.value)
              }
              placeholder="24-character Mongo ID"
              spellCheck={false}
              value={draftFilters.adminId}
            />
          </FilterField>

          <FilterField label="Action">
            <input
              className={filterInputClassName}
              list="audit-log-action-options"
              onChange={(event) =>
                updateDraftFilter("action", event.target.value)
              }
              placeholder="e.g. deck.updated"
              spellCheck={false}
              value={draftFilters.action}
            />
            <datalist id="audit-log-action-options">
              {auditActions.map((action) => (
                <option key={action} value={action} />
              ))}
            </datalist>
          </FilterField>

          <FilterField label="From">
            <input
              className={filterInputClassName}
              max={draftFilters.to || undefined}
              onChange={(event) =>
                updateDraftFilter("from", event.target.value)
              }
              type="date"
              value={draftFilters.from}
            />
          </FilterField>

          <FilterField label="To">
            <input
              className={filterInputClassName}
              min={draftFilters.from || undefined}
              onChange={(event) =>
                updateDraftFilter("to", event.target.value)
              }
              type="date"
              value={draftFilters.to}
            />
          </FilterField>
        </div>

        {filterError ? (
          <p className="mt-3 text-sm font-bold text-[#a33a3a]" role="alert">
            {filterError}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#614db7] px-5 text-sm font-extrabold text-white transition hover:bg-[#4f3c9f] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={logsQuery.isFetching}
            type="submit"
          >
            <Filter aria-hidden="true" className="h-4 w-4" />
            Apply filters
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-extrabold text-[#5f5e5e] shadow-sm transition hover:text-[#1b1c19] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={
              logsQuery.isFetching &&
              !Object.values(draftFilters).some(Boolean) &&
              !activeFilterCount
            }
            onClick={handleClearFilters}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Clear
          </button>
        </div>
      </form>

      <div className="pt-6">
        <AuditLogsTable
          error={logsQuery.error}
          isError={logsQuery.isError}
          isFetching={logsQuery.isFetching}
          isLoading={logsQuery.isPending}
          logs={logs}
          meta={meta}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}

const filterInputClassName =
  "h-11 w-full min-w-0 rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-[#1b1c19] outline-none transition placeholder:text-[#9a9692] focus:border-[#9b87f5] focus:ring-2 focus:ring-[#e6deff]";

function FilterField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="min-w-0 text-xs font-extrabold uppercase tracking-wide text-[#797583]">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  );
}

function validateFilters(filters: AuditLogFilters) {
  if (filters.adminId && !MONGO_ID_PATTERN.test(filters.adminId)) {
    return "Admin ID must be a valid 24-character Mongo ID.";
  }

  if (filters.from && filters.to) {
    const from = new Date(`${filters.from}T00:00:00.000`).getTime();
    const to = new Date(`${filters.to}T23:59:59.999`).getTime();

    if (from > to) return "The start date must be before the end date.";
    if (to - from > MAX_DATE_RANGE_MS) {
      return "Date range cannot exceed 365 days.";
    }
  }

  return "";
}

function toLocalDayBoundary(value: string, boundary: "start" | "end") {
  const time = boundary === "start" ? "00:00:00.000" : "23:59:59.999";
  return new Date(`${value}T${time}`).toISOString();
}
