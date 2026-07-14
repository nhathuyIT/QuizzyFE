import type { ReactNode } from "react";
import { Archive, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { AdminAcademicDocumentStatus } from "@/services/api";
import type { DocumentReviewAction } from "../document-review.config";

export function DocumentReviewActions({
  onAction,
  status,
}: {
  onAction: (action: DocumentReviewAction) => void;
  status: AdminAcademicDocumentStatus;
}) {
  return (
    <div className="mt-6 rounded-[24px] border border-black/5 bg-[#fbf9f4] p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.06em] text-[#5f5e5e]">
        Review actions
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {status === "pending" ? (
          <>
            <ActionButton
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Approve"
              onClick={() => onAction("approve")}
              tone="success"
            />
            <ActionButton
              icon={<XCircle className="h-4 w-4" />}
              label="Decline"
              onClick={() => onAction("reject")}
              tone="danger"
            />
          </>
        ) : null}
        {status === "active" || status === "rejected" ? (
          <ActionButton
            icon={<RotateCcw className="h-4 w-4" />}
            label="Move to pending"
            onClick={() => onAction("pending")}
            tone="primary"
          />
        ) : null}
        {status !== "archived" ? (
          <ActionButton
            icon={<Archive className="h-4 w-4" />}
            label="Archive"
            onClick={() => onAction("archive")}
            tone="neutral"
          />
        ) : (
          <ActionButton
            icon={<RotateCcw className="h-4 w-4" />}
            label="Restore to pending"
            onClick={() => onAction("restore")}
            tone="primary"
          />
        )}
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  tone,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  tone: "success" | "danger" | "primary" | "neutral";
}) {
  const styles = {
    danger: "bg-[#ffe5e5] text-[#a33a3a] hover:bg-[#ffd5d5]",
    neutral: "bg-[#e8e9f2] text-[#555b78] hover:bg-[#dcdeeb]",
    primary: "bg-[#e6deff] text-[#311485] hover:bg-[#d9ceff]",
    success: "bg-[#e2f6ea] text-[#267047] hover:bg-[#d0efdc]",
  }[tone];

  return (
    <button
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-extrabold transition ${styles}`}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}
