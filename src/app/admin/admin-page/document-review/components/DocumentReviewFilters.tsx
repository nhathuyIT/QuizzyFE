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
  isMongoObjectId,
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
  onUploaderChange,
  status,
  subjectId,
  subjects,
  uploaderId,
}: {
  departmentId: string;
  departments: AdminAcademicDepartment[];
  fileType: AdminAcademicDocumentFileType | "";
  onDepartmentChange: (departmentId: string) => void;
  onFileTypeChange: (fileType: AdminAcademicDocumentFileType | "") => void;
  onSearch: (keyword: string) => void;
  onStatusChange: (status: DocumentFilterStatus) => void;
  onSubjectChange: (subjectId: string) => void;
  onUploaderChange: (uploaderId: string) => void;
  status: DocumentFilterStatus;
  subjectId: string;
  subjects: AdminAcademicSubject[];
  uploaderId: string;
}) {
  const [keywordDraft, setKeywordDraft] = useState("");
  const [uploaderDraft, setUploaderDraft] = useState(uploaderId);
  const [uploaderError, setUploaderError] = useState("");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextUploaderId = uploaderDraft.trim();
    if (nextUploaderId && !isMongoObjectId(nextUploaderId)) {
      setUploaderError("Uploader ID must be a 24-character MongoDB ObjectId.");
      return;
    }
    setUploaderError("");
    onUploaderChange(nextUploaderId);
    onSearch(keywordDraft.trim());
  }

  return (
    <form className="mt-7 space-y-3" noValidate onSubmit={submitSearch}>
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
          disabled={!departmentId}
          onChange={(event) => onSubjectChange(event.target.value)}
          value={subjectId}
        >
          <option value="">
            {departmentId ? "All subjects" : "Select a department first"}
          </option>
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
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_360px_auto]">
        <label className="relative block">
          <span className="sr-only">Search documents</span>
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8784]"
          />
          <input
            className={`${documentFilterClass} pl-11`}
            onChange={(event) => setKeywordDraft(event.target.value)}
            placeholder="Search title, file name or tag"
            value={keywordDraft}
          />
        </label>
        <label className="block">
          <span className="sr-only">Uploader ID</span>
          <input
            aria-describedby={uploaderError ? "uploader-id-error" : undefined}
            aria-invalid={Boolean(uploaderError)}
            className={documentFilterClass}
            maxLength={24}
            onChange={(event) => {
              setUploaderDraft(event.target.value);
              if (uploaderError) setUploaderError("");
            }}
            pattern="[a-fA-F0-9]{24}"
            placeholder="Uploader ID (24-character ObjectId)"
            title="Enter a 24-character MongoDB ObjectId"
            value={uploaderDraft}
          />
        </label>
        <button
          className="h-12 rounded-2xl bg-[#1b1c19] px-6 text-sm font-extrabold text-white transition hover:bg-[#343530]"
          type="submit"
        >
          Search documents
        </button>
      </div>
      {uploaderError ? (
        <p className="text-xs font-bold text-[#a33a3a]" id="uploader-id-error">
          {uploaderError}
        </p>
      ) : null}
    </form>
  );
}
