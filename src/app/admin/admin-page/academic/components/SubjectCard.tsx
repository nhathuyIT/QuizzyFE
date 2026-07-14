import { Edit3, RefreshCcw, Trash2 } from "lucide-react";
import type { AdminAcademicSubject } from "@/services/api";
import { AcademicStatusBadge } from "./AdminAcademicUi";

export function SubjectCard({
  onEdit,
  onStatusChange,
  subject,
}: {
  onEdit: () => void;
  onStatusChange: () => void;
  subject: AdminAcademicSubject;
}) {
  return (
    <article className="rounded-[24px] border border-black/5 bg-[#fbf9f4] p-4 transition hover:border-[#cabeff] hover:bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-[#e6deff] px-2.5 py-1 text-xs font-extrabold text-[#311485]">
              {subject.code}
            </span>
            <AcademicStatusBadge
              status={subject.isActive ? "active" : "inactive"}
            />
          </div>
          <h4 className="mt-3 truncate text-lg font-extrabold text-[#1b1c19]">
            {subject.name}
          </h4>
          <p className="mt-1 text-xs font-bold text-[#8a8784]">
            Semester {subject.semester} · {subject.documentCount ?? 0} documents
          </p>
        </div>

        <div className="flex shrink-0 gap-1.5">
          <button
            aria-label={`Edit ${subject.code}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#5f5e5e] shadow-sm transition hover:bg-[#e6deff] hover:text-[#311485]"
            onClick={onEdit}
            type="button"
          >
            <Edit3 aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            aria-label={`${subject.isActive ? "Deactivate" : "Restore"} ${subject.code}`}
            className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition ${
              subject.isActive
                ? "bg-[#fff0f0] text-[#a33a3a] hover:bg-[#ffe3e3]"
                : "bg-[#e2f6ea] text-[#267047] hover:bg-[#d0efdc]"
            }`}
            onClick={onStatusChange}
            type="button"
          >
            {subject.isActive ? (
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            ) : (
              <RefreshCcw aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
