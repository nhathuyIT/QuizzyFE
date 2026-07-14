"use client";

import type { FormEvent, ReactNode } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import type {
  AdminAcademicDepartment,
  AdminAcademicDocument,
  AdminAcademicSubject,
  AdminUpdateAcademicDocumentInput,
} from "@/services/api";
import { AcademicInlineError } from "../../academic/components/AdminAcademicUi";
import {
  documentInputClass,
  getDocumentEntityId,
} from "../document-review.config";

export function DocumentMetadataForm({
  departments,
  document,
  effectiveDepartmentId,
  effectiveSubjectId,
  error,
  isPending,
  onDepartmentChange,
  onSubjectChange,
  onSubmit,
  saved,
  subjects,
}: {
  departments: AdminAcademicDepartment[];
  document: AdminAcademicDocument;
  effectiveDepartmentId: string;
  effectiveSubjectId: string;
  error: unknown;
  isPending: boolean;
  onDepartmentChange: (departmentId: string) => void;
  onSubjectChange: (subjectId: string) => void;
  onSubmit: (data: AdminUpdateAcademicDocumentInput) => Promise<void>;
  saved: boolean;
  subjects: AdminAcademicSubject[];
}) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await onSubmit({
        description:
          String(formData.get("description") ?? "").trim() || undefined,
        subjectId: effectiveSubjectId,
        tags: String(formData.get("tags") ?? "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        title: String(formData.get("title") ?? "").trim(),
      });
    } catch {
      // React Query exposes the request error in this form.
    }
  }

  return (
    <form className="space-y-5" onSubmit={(event) => void submit(event)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.06em] text-[#614db7]">
            Metadata
          </p>
          <h4 className="mt-1 text-xl font-extrabold text-[#1b1c19]">
            Document information
          </h4>
        </div>
        {saved ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#267047]">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> Saved
          </span>
        ) : null}
      </div>

      <AcademicInlineError error={error} />
      <FormField label="Title">
        <input
          className={documentInputClass}
          defaultValue={document.title}
          maxLength={200}
          name="title"
          required
        />
      </FormField>
      <FormField label="Description">
        <textarea
          className={`${documentInputClass} min-h-28 resize-y py-3`}
          defaultValue={document.description ?? ""}
          maxLength={500}
          name="description"
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Department">
          <select
            className={documentInputClass}
            onChange={(event) => onDepartmentChange(event.target.value)}
            value={effectiveDepartmentId}
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
        </FormField>
        <FormField label="Subject">
          <select
            className={documentInputClass}
            onChange={(event) => onSubjectChange(event.target.value)}
            required
            value={effectiveSubjectId}
          >
            <option value="">Select subject</option>
            {subjects.map((subject) => (
              <option
                key={getDocumentEntityId(subject)}
                value={getDocumentEntityId(subject)}
              >
                {subject.code} — {subject.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField label="Tags">
        <input
          className={documentInputClass}
          defaultValue={document.tags?.join(", ") ?? ""}
          name="tags"
          placeholder="slide, chapter-1, oop"
        />
      </FormField>
      <div className="flex justify-end border-t border-black/5 pt-5">
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-[#614db7] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#4f3d99] disabled:opacity-60"
          disabled={isPending || !effectiveSubjectId}
          type="submit"
        >
          {isPending ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <Save aria-hidden="true" className="h-4 w-4" />
          )}
          Save metadata
        </button>
      </div>
    </form>
  );
}

function FormField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.06em] text-[#5f5e5e]">
        {label}
      </span>
      {children}
    </label>
  );
}
