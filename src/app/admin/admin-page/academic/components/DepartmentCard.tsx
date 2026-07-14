import {
  Building2,
  Edit3,
  FilePlus2,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import type { AdminAcademicDepartment } from "@/services/api";
import { AcademicStatusBadge } from "./AdminAcademicUi";

export function DepartmentCard({
  department,
  onEdit,
  onStatusChange,
}: {
  department: AdminAcademicDepartment;
  onEdit: () => void;
  onStatusChange: () => void;
}) {
  return (
    <div className="rounded-[30px] border border-black/5 bg-gradient-to-br from-white to-[#f6f2ff] p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e6deff] text-[#311485]">
            <Building2 aria-hidden="true" className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-extrabold text-[#1b1c19]">
                {department.name}
              </h3>
              <AcademicStatusBadge
                status={department.isActive ? "active" : "inactive"}
              />
            </div>
            <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.08em] text-[#614db7]">
              {department.code}
            </p>
            <p className="mt-3 max-w-[680px] text-sm font-semibold leading-6 text-[#6e6a67]">
              {department.description ||
                "No department description has been added yet."}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm font-bold text-[#5f5e5e] transition hover:border-[#cabeff] hover:text-[#311485]"
            onClick={onEdit}
            type="button"
          >
            <Edit3 aria-hidden="true" className="h-4 w-4" /> Edit
          </button>
          <button
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
              department.isActive
                ? "bg-[#fff0f0] text-[#a33a3a] hover:bg-[#ffe3e3]"
                : "bg-[#e2f6ea] text-[#267047] hover:bg-[#d0efdc]"
            }`}
            onClick={onStatusChange}
            type="button"
          >
            {department.isActive ? (
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            ) : (
              <RefreshCcw aria-hidden="true" className="h-4 w-4" />
            )}
            {department.isActive ? "Deactivate" : "Restore"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MissingDepartmentCard({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="rounded-[30px] border border-dashed border-[#cabeff] bg-[#f6f2ff] p-8 text-center">
      <FilePlus2 aria-hidden="true" className="mx-auto h-8 w-8 text-[#614db7]" />
      <h3 className="mt-4 text-2xl font-extrabold text-[#311485]">
        Create the first department
      </h3>
      <p className="mx-auto mt-2 max-w-[520px] text-sm font-semibold leading-6 text-[#6e6a67]">
        There are no departments in the catalog yet. Create one to start
        organizing subjects and academic documents.
      </p>
      <button
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#614db7] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#4f3d99]"
        onClick={onCreate}
        type="button"
      >
        <Plus aria-hidden="true" className="h-4 w-4" /> Create department
      </button>
    </div>
  );
}

