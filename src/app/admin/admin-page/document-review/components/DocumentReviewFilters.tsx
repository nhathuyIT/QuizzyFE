"use client";

import { useState, type FormEvent } from "react";
import { Filter, Search } from "lucide-react";
import type {
  AdminAcademicDepartment,
  AdminAcademicDocumentFileType,
  AdminAcademicSubject,
} from "@/services/api";
import {
  DOCUMENT_FILE_TYPES,
  documentFilterClass,
  getDocumentEntityId,
  type DocumentFilterStatus,
} from "../document-review.config";

export function DocumentReviewFilters({
  departmentId,
  departments,
  fileType,
  onDepartmentChange,
  onFileTypeChange,
  onSearch,
  onStatusChange,
  onSubjectChange,
  status,
  subjectId,
  subjects,
}: {
  departmentId: string;
  departments: AdminAcademicDepartment[];
  fileType: AdminAcademicDocumentFileType | "";
  onDepartmentChange: (departmentId: string) => void;
  onFileTypeChange: (fileType: AdminAcademicDocumentFileType | "") => void;
  onSearch: (keyword: string) => void;
  onStatusChange: (status: DocumentFilterStatus) => void;
  onSubjectChange: (subjectId: string) => void;
  status: DocumentFilterStatus;
  subjectId: string;
  subjects: AdminAcademicSubject[];
}) {
  const [keywordDraft, setKeywordDraft] = useState("");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(keywordDraft.trim());
  }

  return (
    <form className="mt-7 space-y-3" onSubmit={submitSearch}>
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.06em] text-[#5f5e5e]">
        <Filter aria-hidden="true" className="h-4 w-4" /> Filters
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <select
          className={documentFilterClass}
          onChange={(event) =>
            onStatusChange(event.target.value as DocumentFilterStatus)
          }
          value={status}
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="archived">Archived</option>
          <option value="all">All status</option>
        </select>
        <select
          className={documentFilterClass}
          onChange={(event) => onDepartmentChange(event.target.value)}
          value={departmentId}
        >
          <option value="">All departments</option>
          {departments.map((department) => (
            <option
              key={getDocumentEntityId(department)}
              value={getDocumentEntityId(department)}
            >
              {department.code} — {department.name}
            </option>
          ))}
        </select>
        <select
          className={documentFilterClass}
          onChange={(event) => onSubjectChange(event.target.value)}
          value={subjectId}
        >
          <option value="">All subjects</option>
          {subjects.map((subject) => (
            <option
              key={getDocumentEntityId(subject)}
              value={getDocumentEntityId(subject)}
            >
              {subject.code} — {subject.name}
            </option>
          ))}
        </select>
        <select
          className={documentFilterClass}
          onChange={(event) =>
            onFileTypeChange(
              event.target.value as AdminAcademicDocumentFileType | "",
            )
          }
          value={fileType}
        >
          <option value="">All file types</option>
          {DOCUMENT_FILE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Search documents</span>
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8784]"
          />
          <input
            className={`${documentFilterClass} pl-11`}
            onChange={(event) => setKeywordDraft(event.target.value)}
            placeholder="Search title, file name, uploader or tag"
            value={keywordDraft}
          />
        </label>
        <button
          className="h-12 rounded-2xl bg-[#1b1c19] px-6 text-sm font-extrabold text-white transition hover:bg-[#343530]"
          type="submit"
        >
          Search documents
        </button>
      </div>
    </form>
  );
}
