import type { AdminAuditLog } from "@/services/api";

type AuditLogColumn = {
  header: string;
  key: string;
  render: (log: AdminAuditLog) => React.ReactNode;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function ActionBadge({ action }: { action: string }) {
  let bg = "bg-[#f6f2ff]";
  let text = "text-[#614db7]";

  const act = action.toLowerCase();
  if (act.includes("delete") || act.includes("suspend") || act.includes("revoke")) {
    bg = "bg-[#fff0f0]";
    text = "text-[#a33a3a]";
  } else if (act.includes("create") || act.includes("restore") || act.includes("activate")) {
    bg = "bg-[#d7f2e3]";
    text = "text-[#276345]";
  } else if (act.includes("update") || act.includes("moderate")) {
    bg = "bg-[#e6deff]";
    text = "text-[#311485]";
  }

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${bg} ${text}`}
    >
      {action}
    </span>
  );
}

export const auditLogColumns: AuditLogColumn[] = [
  {
    header: "Time",
    key: "time",
    render: (log) => (
      <span className="text-[#5f5e5e] whitespace-nowrap">
        {dateFormatter.format(new Date(log.createdAt))}
      </span>
    ),
  },
  {
    header: "Admin",
    key: "admin",
    render: (log) => (
      <div className="flex flex-col">
        <span className="truncate font-extrabold text-[#1b1c19]">
          {log.admin?.name || "Unknown Admin"}
        </span>
        <span className="truncate text-xs text-[#5f5e5e]">{log.admin?.email}</span>
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
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase text-[#797583]">
          {log.targetType}
        </span>
        <span className="truncate text-[13px] font-semibold text-[#1b1c19]">
          {log.targetId}
        </span>
      </div>
    ),
  },
  {
    header: "Metadata",
    key: "metadata",
    render: (log) => {
      const isEmpty = !log.metadata || Object.keys(log.metadata).length === 0;
      if (isEmpty) return <span className="text-xs text-[#8a8784] italic">None</span>;

      return (
        <div className="max-w-[200px] overflow-x-auto rounded-lg bg-[#f6f3ee] px-3 py-2">
          <pre className="text-[10px] leading-snug text-[#5f5e5e]">
            {JSON.stringify(log.metadata, null, 2)}
          </pre>
        </div>
      );
    },
  },
];
