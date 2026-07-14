import type {
  AdminAcademicDepartment,
  AdminAcademicSubject,
} from "@/services/api";

export const SEMESTERS = Array.from({ length: 9 }, (_, index) => index + 1);

export type AcademicConfirmAction =
  | { kind: "deactivate-department"; department: AdminAcademicDepartment }
  | { kind: "restore-department"; department: AdminAcademicDepartment }
  | { kind: "deactivate-subject"; subject: AdminAcademicSubject }
  | { kind: "restore-subject"; subject: AdminAcademicSubject };

export const academicInputClass =
  "h-12 w-full rounded-2xl border border-black/10 bg-[#fbf9f4] px-4 text-sm font-semibold text-[#1b1c19] outline-none transition focus:border-[#8f7ce0] focus:bg-white disabled:cursor-not-allowed disabled:bg-[#efede9] disabled:text-[#8a8784]";

export function getAcademicEntityId(
  entity?: { _id?: string; id?: string } | null,
) {
  return entity?._id ?? entity?.id ?? "";
}

export function getAcademicConfirmDescription(action: AcademicConfirmAction) {
  if ("department" in action) {
    return action.kind === "deactivate-department"
      ? `Deactivate ${action.department.code}? Existing subjects remain stored, but new subjects cannot be added until it is restored.`
      : `Restore ${action.department.code} and allow admins to add subjects again?`;
  }

  return action.kind === "deactivate-subject"
    ? `Deactivate ${action.subject.code}? It will remain available in the inactive filter.`
    : `Restore ${action.subject.code} and make it active again?`;
}

