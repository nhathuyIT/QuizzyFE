import type {
  AdminAcademicDocument,
  AdminAcademicDocumentUser,
  AdminAcademicSubject,
} from "@/services/api";
import { getAcademicEntityId } from "./academic.config";

export function getAcademicDocumentId(document?: AdminAcademicDocument | null) {
  return getAcademicEntityId(document);
}

export function getAcademicDocumentSubject(
  document: AdminAcademicDocument,
): AdminAcademicSubject | undefined {
  return document.subject ??
    (typeof document.subjectId === "string" ? undefined : document.subjectId);
}

export function getAcademicDocumentSubjectLabel(
  document: AdminAcademicDocument,
) {
  const subject = getAcademicDocumentSubject(document);
  if (subject) return `${subject.code} — ${subject.name}`;
  return typeof document.subjectId === "string" ? document.subjectId : "—";
}

export function getAcademicDocumentDepartmentLabel(
  document: AdminAcademicDocument,
) {
  const subject = getAcademicDocumentSubject(document);
  const department = document.department ?? subject?.department;
  return department
    ? `${department.code} — ${department.name}`
    : "—";
}

function getUserLabel(
  user?: string | AdminAcademicDocumentUser | null,
) {
  if (!user) return "—";
  if (typeof user === "string") return user;
  return user.email || user.name || getAcademicEntityId(user) || "—";
}

export function getAcademicDocumentUploaderLabel(
  document: AdminAcademicDocument,
) {
  return getUserLabel(document.uploader ?? document.uploadedBy);
}

export function getAcademicDocumentReviewerLabel(
  document: AdminAcademicDocument,
) {
  return getUserLabel(document.reviewer ?? document.reviewedBy);
}

export function formatAcademicDocumentBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formatAcademicDocumentDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}
