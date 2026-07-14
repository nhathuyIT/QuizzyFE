"use client";

import type { ReactNode } from "react";
import {
  BookOpenText,
  ChevronLeft,
  FileText,
  Folder,
  Loader2,
} from "lucide-react";
import {
  formatFileSize,
  getDocumentTypeLabel,
  getFileTypeClass,
} from "@/features/academic/utils";
import { cn } from "@/lib/utils/cn";
import type {
  AcademicDocument,
  Department,
  Subject,
} from "@/types/academic.type";

const semesters = Array.from({ length: 9 }, (_, index) => index + 1);

interface AcademicDocumentBrowserProps {
  activeDocumentId?: string;
  departments: Department[];
  departmentsError?: string;
  documents: AcademicDocument[];
  documentsError?: string;
  isDepartmentsLoading?: boolean;
  isDocumentsLoading?: boolean;
  isSubjectsLoading?: boolean;
  selectedDepartment?: Department;
  selectedSemester?: number;
  selectedSubject?: Subject;
  subjects: Subject[];
  subjectsError?: string;
  onBack: () => void;
  onSelectDepartment: (department: Department) => void;
  onSelectDocument: (document: AcademicDocument) => void;
  onSelectSemester: (semester: number) => void;
  onSelectSubject: (subject: Subject) => void;
}

export function AcademicDocumentBrowser({
  activeDocumentId,
  departments,
  departmentsError,
  documents,
  documentsError,
  isDepartmentsLoading = false,
  isDocumentsLoading = false,
  isSubjectsLoading = false,
  selectedDepartment,
  selectedSemester,
  selectedSubject,
  subjects,
  subjectsError,
  onBack,
  onSelectDepartment,
  onSelectDocument,
  onSelectSemester,
  onSelectSubject,
}: AcademicDocumentBrowserProps) {
  const canGoBack = Boolean(
    selectedDepartment || selectedSemester || selectedSubject,
  );
  const title = selectedSubject
    ? selectedSubject.code
    : selectedSemester
      ? `Semester ${selectedSemester}`
      : selectedDepartment
        ? selectedDepartment.code
        : "Academic docs";
  const subtitle = [
    selectedDepartment?.code,
    selectedSemester ? `Sem ${selectedSemester}` : undefined,
    selectedSubject?.code,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <section className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#614db7]">
            Choose source
          </p>
          <h2 className="mt-1 truncate text-lg font-bold tracking-normal">
            {title}
          </h2>
          <p className="mt-1 truncate text-xs font-semibold text-[#8a8784]">
            {subtitle || "Pick a folder until you reach a PDF file"}
          </p>
        </div>
        <button
          aria-label="Go back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f6f3ee] text-[#777474] transition hover:text-[#311485] disabled:opacity-40"
          disabled={!canGoBack}
          onClick={onBack}
          type="button"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 max-h-[420px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
        {!selectedDepartment ? (
          <FolderList
            emptyText="No departments found."
            error={departmentsError}
            isLoading={isDepartmentsLoading}
          >
            {departments.map((department) => (
              <FolderButton
                key={department._id}
                label={department.code}
                meta={department.name}
                onClick={() => onSelectDepartment(department)}
              />
            ))}
          </FolderList>
        ) : !selectedSemester ? (
          semesters.map((semester) => (
            <FolderButton
              key={semester}
              label={`Semester ${semester}`}
              meta="Open subjects"
              onClick={() => onSelectSemester(semester)}
            />
          ))
        ) : !selectedSubject ? (
          <FolderList
            emptyText="No subjects found in this semester."
            error={subjectsError}
            isLoading={isSubjectsLoading}
          >
            {subjects.map((subject) => (
              <FolderButton
                key={subject._id}
                label={subject.code}
                meta={`${subject.name} - ${subject.documentCount} documents`}
                onClick={() => onSelectSubject(subject)}
              />
            ))}
          </FolderList>
        ) : (
          <FolderList
            emptyText="No documents found for this subject."
            error={documentsError}
            isLoading={isDocumentsLoading}
          >
            {documents.map((document) => (
              <DocumentButton
                document={document}
                isActive={document._id === activeDocumentId}
                key={document._id}
                onClick={() => onSelectDocument(document)}
              />
            ))}
          </FolderList>
        )}
      </div>
    </section>
  );
}

function FolderList({
  children,
  emptyText,
  error,
  isLoading,
}: {
  children: ReactNode;
  emptyText: string;
  error?: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-[#f6f3ee] px-4 py-3 text-sm font-bold text-[#777474]">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[22px] bg-[#fff0f0] p-4 text-sm font-bold text-[#a33a3a]">
        {error}
      </div>
    );
  }

  if (!children || (Array.isArray(children) && children.length === 0)) {
    return (
      <div className="rounded-[22px] border border-dashed border-[#cabeff] bg-[#f8f5ff] p-5 text-center">
        <BookOpenText className="mx-auto h-7 w-7 text-[#614db7]" />
        <p className="mt-3 text-sm font-bold text-[#1b1c19]">{emptyText}</p>
      </div>
    );
  }

  return <>{children}</>;
}

function FolderButton({
  label,
  meta,
  onClick,
}: {
  label: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button
      className="flex w-full items-center gap-3 rounded-[20px] border border-transparent bg-[#fbf9f4] p-3 text-left transition hover:border-[#cabeff] hover:bg-[#f4f0ff]"
      onClick={onClick}
      type="button"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]">
        <Folder className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-[#1b1c19]">
          {label}
        </span>
        <span className="mt-1 block truncate text-xs font-semibold text-[#8a8784]">
          {meta}
        </span>
      </span>
    </button>
  );
}

function DocumentButton({
  document,
  isActive,
  onClick,
}: {
  document: AcademicDocument;
  isActive: boolean;
  onClick: () => void;
}) {
  const isUnsupported = document.fileType !== "pdf";

  return (
    <button
      className={cn(
        "flex w-full items-start gap-3 rounded-[20px] border p-3 text-left transition",
        isActive
          ? "border-[#cabeff] bg-[#f2eefe]"
          : "border-transparent bg-[#fbf9f4] hover:border-[#cabeff] hover:bg-[#f4f0ff]",
        isUnsupported && "cursor-not-allowed opacity-60 hover:bg-[#fbf9f4]",
      )}
      disabled={isUnsupported}
      onClick={onClick}
      title={isUnsupported ? "Only PDF documents can be used for chat" : undefined}
      type="button"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#614db7]">
        <FileText className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-[#1b1c19]">
          {document.title}
        </span>
        <span className="mt-1 block truncate text-xs font-semibold text-[#8a8784]">
          {document.fileName}
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-extrabold",
              getFileTypeClass(document.fileType),
            )}
          >
            {getDocumentTypeLabel(document)}
          </span>
          <span className="text-[11px] font-bold text-[#8a8784]">
            {formatFileSize(document.fileSize)}
          </span>
          {isActive && (
            <span className="rounded-full bg-[#311485] px-2.5 py-1 text-[11px] font-extrabold text-white">
              Current
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
