import { GraduationCap, Plus } from "lucide-react";
import type { AdminAcademicDepartment } from "@/services/api";
import { getAcademicEntityId } from "../academic.config";

export function AcademicHeader({
  departments,
  onCreate,
  onDepartmentChange,
  selectedDepartmentId,
}: {
  departments: AdminAcademicDepartment[];
  onCreate: () => void;
  onDepartmentChange: (departmentId: string) => void;
  selectedDepartmentId: string;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-[30px] border border-black/5 bg-white p-5 shadow-sm sm:p-7 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#614db7]">
          <GraduationCap aria-hidden="true" className="h-4 w-4" />
          Academic catalog
        </div>
        <h2 className="mt-3 text-3xl font-extrabold text-[#1b1c19]">
          Departments & subjects
        </h2>
        <p className="mt-2 max-w-[680px] text-sm font-semibold leading-6 text-[#6e6a67]">
          Maintain departments and organize their subjects across nine semesters.
        </p>
      </div>

      <div className="flex max-w-full flex-wrap items-center gap-2 self-start rounded-2xl bg-[#f3efff] p-1.5 lg:justify-end">
        {departments.map((department) => {
          const departmentId = getAcademicEntityId(department);
          return (
            <button
              className={`min-w-20 rounded-xl px-4 py-3 text-sm font-extrabold transition ${
                selectedDepartmentId === departmentId
                  ? "bg-[#614db7] text-white shadow-sm"
                  : "text-[#5f5e5e] hover:bg-white hover:text-[#311485]"
              }`}
              key={departmentId || department.code}
              onClick={() => onDepartmentChange(departmentId)}
              type="button"
            >
              {department.code}
            </button>
          );
        })}
        <button
          className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-dashed border-[#9c89e8] bg-white px-3 text-sm font-extrabold text-[#614db7] transition hover:bg-[#e6deff]"
          onClick={onCreate}
          type="button"
        >
          <Plus aria-hidden="true" className="h-4 w-4" /> Department
        </button>
      </div>
    </div>
  );
}
