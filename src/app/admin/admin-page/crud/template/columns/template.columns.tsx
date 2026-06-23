import { Eye, Pencil, Trash2 } from "lucide-react";
import type { CrudColumn } from "../../components";
import type { TemplateRecord } from "../template-form.config";

type TemplateColumnContext = {
  onDelete?: (record: TemplateRecord) => void;
  onEdit?: (record: TemplateRecord) => void;
  onView?: (record: TemplateRecord) => void;
};

export function createTemplateColumns(): CrudColumn<
  TemplateRecord,
  TemplateColumnContext
>[] {
  return [
    {
      header: "Name",
      key: "name",
      render: (record) => (
        <span className="truncate font-extrabold">{record.name}</span>
      ),
    },
    {
      header: "Description",
      key: "description",
      render: (record) => (
        <span className="truncate text-[#5f5e5e]">
          {record.description || "N/A"}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (record) => <StatusBadge status={record.status} />,
    },
    {
      header: "Actions",
      key: "actions",
      render: (record, { onDelete, onEdit, onView }) => (
        <div className="flex gap-2">
          {onView ? (
            <IconButton label="View" onClick={() => onView(record)}>
              <Eye aria-hidden="true" className="h-4 w-4" />
            </IconButton>
          ) : null}
          {onEdit ? (
            <IconButton label="Edit" onClick={() => onEdit(record)}>
              <Pencil aria-hidden="true" className="h-4 w-4" />
            </IconButton>
          ) : null}
          {onDelete ? (
            <IconButton
              label="Delete"
              onClick={() => onDelete(record)}
              tone="danger"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </IconButton>
          ) : null}
        </div>
      ),
    },
  ];
}

function IconButton({
  children,
  label,
  onClick,
  tone = "default",
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: "danger" | "default";
}) {
  const toneClassName =
    tone === "danger"
      ? "border-[#ffdad6] text-[#a33a3a] hover:bg-[#fff0f0]"
      : "border-[#cabeff] text-[#614db7] hover:bg-[#f6f2ff]";

  return (
    <button
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${toneClassName}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: TemplateRecord["status"] }) {
  const active = status === "active";

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold capitalize ${
        active ? "bg-[#d7f2e3] text-[#276345]" : "bg-[#eeeeee] text-[#5f5e5e]"
      }`}
    >
      {status}
    </span>
  );
}
