import type {
  AdminAcademicDocument,
  AdminAcademicDocumentFileType,
  AdminAcademicDocumentStatus,
  AdminAcademicSubject,
} from "@/services/api";

export const DOCUMENT_FILE_TYPES: AdminAcademicDocumentFileType[] = [
  "pdf",
  "docx",
  "pptx",
  "xlsx",
  "other",
];

export type DocumentFilterStatus = AdminAcademicDocumentStatus | "all";
export type DocumentReviewAction =
  | "approve"
  | "reject"
  | "pending"
  | "archive"
  | "restore";

export const documentFilterClass =
  "h-12 w-full rounded-2xl border border-black/10 bg-[#fbf9f4] px-4 text-sm font-bold text-[#5f5e5e] outline-none transition focus:border-[#8f7ce0] focus:bg-white";
export const documentInputClass =
  "h-12 w-full rounded-2xl border border-black/10 bg-[#fbf9f4] px-4 text-sm font-semibold text-[#1b1c19] outline-none transition focus:border-[#8f7ce0] focus:bg-white";

export const documentActionLabels: Record<DocumentReviewAction, string> = {
  approve: "Approve document",
  archive: "Archive document",
  pending: "Move to pending",
  reject: "Decline document",
  restore: "Restore document",
};

export const documentActionDescriptions: Record<DocumentReviewAction, string> = {
  approve:
    "This document will become active and available through the academic catalog.",
  archive:
    "This document will leave the active moderation flow and remain available in the archived filter.",
  pending: "This document will return to the pending queue for another review.",
  reject:
    "This upload will be marked as rejected. The review note is optional and will be sent when provided.",
  restore: "This archived document will be restored to the pending review queue.",
};

export function getDocumentEntityId(
  entity?: { _id?: string; id?: string } | null,
) {
  return entity?._id ?? entity?.id ?? "";
}

export function getDocumentRelationId(
  relation?: string | { _id?: string; id?: string } | null,
) {
  return typeof relation === "string"
    ? relation
    : getDocumentEntityId(relation);
}

export function resolveDocumentSubject(
  document: AdminAcademicDocument,
  subjects: AdminAcademicSubject[],
) {
  if (document.subject) return document.subject;
  if (typeof document.subjectId !== "string") return document.subjectId;
  return subjects.find(
    (subject) => getDocumentEntityId(subject) === document.subjectId,
  );
}

export function getDocumentSubjectLabel(
  subject: AdminAcademicDocument["subjectId"],
) {
  return typeof subject === "string" ? subject : subject.code || subject.name;
}

export function getDocumentSubjectDepartmentId(
  subject?: AdminAcademicDocument["subjectId"],
) {
  if (!subject || typeof subject === "string") return "";
  return getDocumentRelationId(subject.departmentId);
}

export function getDocumentDepartmentId(document?: AdminAcademicDocument) {
  if (!document) return "";
  const populatedDepartmentId = getDocumentEntityId(document.department);
  if (populatedDepartmentId) return populatedDepartmentId;

  const subject = document.subject ??
    (typeof document.subjectId === "string" ? undefined : document.subjectId);
  return getDocumentSubjectDepartmentId(subject);
}

export function getDocumentUploader(
  document: AdminAcademicDocument,
) {
  return document.uploader ??
    (typeof document.uploadedBy === "string" ? undefined : document.uploadedBy);
}

export function isMongoObjectId(value: string) {
  return /^[a-f\d]{24}$/i.test(value);
}

export function formatDocumentBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formatDocumentDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}
