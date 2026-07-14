import { Eye } from "lucide-react";
import type { ReactNode } from "react";
import type { AdminAuditLog } from "@/services/api";

export type AuditLogColumnContext = {
  onOpenMetadata: (log: AdminAuditLog) => void;
};

type AuditLogColumn = {
  header: string;
  key: string;
  render: (log: AdminAuditLog, context: AuditLogColumnContext) => ReactNode;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export function formatAuditAction(action: string) {
  if (!action) return "Unknown action";
  const formatted = action.replace(/[._-]+/g, " ").trim().toLowerCase();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export const auditLogColumns: AuditLogColumn[] = [
  {
    header: "Time",
    key: "time",
    render: (log) => (
      <span className="whitespace-nowrap font-semibold text-[#5f5e5e]">
        {formatAuditTime(log.createdAt)}
      </span>
    ),
  },
  {
    header: "Admin",
    key: "admin",
    render: (log) => (
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-extrabold text-[#1b1c19]">
          {log.admin?.name || "Unknown admin"}
        </span>
        <span
          className="truncate text-xs text-[#5f5e5e]"
          title={log.admin?.email || log.adminId}
        >
          {log.admin?.email || log.adminId}
        </span>
      </div>
    ),
  },
  {
    header: "Action",
    key: "action",
    render: (log) => <ActionBadge action={log.action} />,
  },
  {
    header: "Target",
    key: "target",
    render: (log) => (
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-xs font-extrabold uppercase tracking-wide text-[#797583]">
          {log.targetType?.replaceAll("_", " ") || "Unknown target"}
        </span>
        <span
          className="truncate text-[13px] font-semibold text-[#1b1c19]"
          title={log.targetId}
        >
          {log.targetId || "—"}
        </span>
      </div>
    ),
  },
  {
    header: "Details",
    key: "metadata",
    render: (log, { onOpenMetadata }) => {
      const hasDetails = Boolean(
        log.metadata && Object.keys(log.metadata).length,
      );

      return hasDetails ? (
        <button
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[#e6deff] px-3 text-xs font-extrabold text-[#311485] transition hover:bg-[#d8ccff]"
          onClick={() => onOpenMetadata(log)}
          type="button"
        >
          <Eye aria-hidden="true" className="h-3.5 w-3.5" />
          View
        </button>
      ) : (
        <span className="text-xs font-semibold italic text-[#8a8784]">None</span>
      );
    },
  },
];

function formatAuditTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown time" : dateFormatter.format(date);
}

function ActionBadge({ action }: { action: string }) {
  const normalizedAction = action?.toLowerCase() ?? "";
  let colorClassName = "bg-[#f6f2ff] text-[#614db7]";

  if (
    ["delete", "archive", "deactivate", "suspend", "reject"].some((word) =>
      normalizedAction.includes(word),
    )
  ) {
    colorClassName = "bg-[#fff0f0] text-[#a33a3a]";
  } else if (
    ["create", "restore", "activate"].some((word) =>
      normalizedAction.includes(word),
    )
  ) {
    colorClassName = "bg-[#d7f2e3] text-[#276345]";
  } else if (
    ["update", "moderate", "review"].some((word) =>
      normalizedAction.includes(word),
    )
  ) {
    colorClassName = "bg-[#e6deff] text-[#311485]";
  }

  const displayAction = formatAuditAction(action);

  return (
    <span
      className={`inline-flex max-w-full rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide ${colorClassName}`}
      title={displayAction}
    >
      <span className="truncate">{displayAction}</span>
    </span>
  );
}
