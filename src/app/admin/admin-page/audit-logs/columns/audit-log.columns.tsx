"use client";

import { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
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

  if (!action) return null;

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

  const formattedAction = action.replace(/[._]/g, " ").toLowerCase();
  const displayAction = formattedAction.charAt(0).toUpperCase() + formattedAction.slice(1);

  return (
    <div className="flex w-full items-center" title={displayAction}>
      <span
        className={`inline-flex max-w-full items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide ${bg} ${text}`}
      >
        <span className="truncate">{displayAction}</span>
      </span>
    </div>
  );
}

function MetadataModal({ metadata, onClose }: { metadata: Record<string, unknown>; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1c19]/45 p-4 backdrop-blur-sm text-left"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="max-h-[92vh] w-full max-w-[600px] flex flex-col overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
          <div>
            <h3 className="[font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
              Action Details
            </h3>
          </div>
          <button
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:text-[#1b1c19]"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <div className="rounded-2xl bg-[#fbf9f4] p-4 border border-black/5">
            <pre className="text-sm leading-snug text-[#5f5e5e] break-all whitespace-pre-wrap">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetadataCell({ metadata }: { metadata: Record<string, unknown> }) {
  const [isOpen, setIsOpen] = useState(false);
  const isEmpty = !metadata || Object.keys(metadata).length === 0;

  if (isEmpty) {
    return <span className="text-xs text-[#8a8784] italic">None</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-[#f6f3ee] px-3 py-1.5 text-xs font-bold text-[#5f5e5e] transition hover:bg-[#ebe8e0] hover:text-[#1b1c19]"
      >
        <Eye aria-hidden="true" className="h-4 w-4" />
        View
      </button>
      {isOpen && <MetadataModal metadata={metadata} onClose={() => setIsOpen(false)} />}
    </>
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
        <span className="truncate text-[13px] font-semibold text-[#1b1c19]" title={log.targetId}>
          {log.targetId}
        </span>
      </div>
    ),
  },
  {
    header: "Details",
    key: "metadata",
    render: (log) => <MetadataCell metadata={log.metadata} />,
  },
];
