import { GraduationCap } from "lucide-react";
import {
  DEPARTMENT_CODES,
  type DepartmentCode,
} from "../academic.config";

export function AcademicHeader({
  departmentCode,
  onDepartmentChange,
}: {
  departmentCode: DepartmentCode;
  onDepartmentChange: (code: DepartmentCode) => void;
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
          Maintain the AI and SE programs, then organize their subjects across nine semesters.
        </p>
      </div>

      <div className="inline-flex self-start rounded-2xl bg-[#f3efff] p-1.5">
        {DEPARTMENT_CODES.map((code) => (
          <button
            className={`min-w-24 rounded-xl px-5 py-3 text-sm font-extrabold transition ${
              departmentCode === code
                ? "bg-[#614db7] text-white shadow-sm"
                : "text-[#5f5e5e] hover:bg-white hover:text-[#311485]"
            }`}
            key={code}
            onClick={() => onDepartmentChange(code)}
            type="button"
          >
            {code}
          </button>
        ))}
      </div>
    </div>
  );
}
