import type {
  AcademicDocument,
  Department,
  FileType,
  Subject,
} from "@/types/academic.type";

export const semesters = Array.from({ length: 9 }, (_, index) => index + 1);

export const fileTypeOptions: Array<{
  label: string;
  value: FileType | "all";
}> = [
  { label: "All files", value: "all" },
  { label: "PDF", value: "pdf" },
  { label: "Word", value: "docx" },
  { label: "Slides", value: "pptx" },
  { label: "Sheets", value: "xlsx" },
  { label: "Other", value: "other" },
];

export function resolveDepartment(
  departments: Department[],
  routeParam: string,
) {
  const normalizedParam = decodeURIComponent(routeParam).toUpperCase();

  return departments.find((department) => {
    return (
      department._id === routeParam ||
      department.code.toUpperCase() === normalizedParam
    );
  });
}

export function getSemesterDocumentCount(
  subjects: Subject[],
  semester: number,
) {
  return subjects
    .filter((subject) => subject.semester === semester)
    .reduce((total, subject) => total + subject.documentCount, 0);
}

export function formatFileSize(bytes: number) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function formatAcademicDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function getDocumentTypeLabel(document: AcademicDocument) {
  const matched = fileTypeOptions.find((item) => item.value === document.fileType);
  return matched?.label ?? document.fileType.toUpperCase();
}

export function getFileTypeClass(fileType: FileType) {
  switch (fileType) {
    case "pdf":
      return "bg-[#ffe8e8] text-[#9f3333]";
    case "docx":
      return "bg-[#e8f0ff] text-[#2f55a0]";
    case "pptx":
      return "bg-[#fff0d8] text-[#9a5a00]";
    case "xlsx":
      return "bg-[#e6f8ec] text-[#276345]";
    default:
      return "bg-[#f0edf8] text-[#614db7]";
  }
}
