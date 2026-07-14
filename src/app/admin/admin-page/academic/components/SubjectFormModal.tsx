"use client";

import { useState, type FormEvent } from "react";
import type {
  AdminAcademicSubject,
  AdminAcademicDepartment,
  AdminCreateAcademicSubjectInput,
} from "@/services/api";
import {
  academicInputClass,
  SEMESTERS,
} from "../academic.config";
import {
  AcademicInlineError,
  AcademicModal,
} from "./AdminAcademicUi";
import {
  AcademicFormActions,
  AcademicFormField,
} from "./AcademicFormFields";

export function SubjectFormModal({
  departments,
  departmentId,
  error,
  initialSemester,
  isPending,
  onClose,
  onSubmit,
  subject,
}: {
  departments: AdminAcademicDepartment[];
  departmentId: string;
  error: unknown;
  initialSemester: number;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: AdminCreateAcademicSubjectInput) => Promise<void>;
  subject: AdminAcademicSubject | null;
}) {
  const [code, setCode] = useState(subject?.code ?? "");
  const [name, setName] = useState(subject?.name ?? "");
  const [semester, setSemester] = useState(
    subject?.semester ?? initialSemester,
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(
    subject?.departmentId ?? departmentId,
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await onSubmit({
        code: code.trim().toUpperCase(),
        departmentId: selectedDepartmentId,
        isActive: subject?.isActive ?? true,
        name: name.trim(),
        semester,
      });
    } catch {
      // React Query exposes the request error inside this modal.
    }
  }

  return (
    <AcademicModal
      description="Update the subject code, department, or semester while keeping its documents connected."
      onClose={onClose}
      title={
        subject
          ? `Edit ${subject.code}`
          : `Add subject to semester ${initialSemester}`
      }
    >
      <form className="space-y-5" onSubmit={(event) => void submit(event)}>
        <AcademicInlineError error={error} />
        <div className="grid gap-5 sm:grid-cols-2">
          <AcademicFormField label="Subject code">
            <input
              className={academicInputClass}
              maxLength={30}
              onChange={(event) => setCode(event.target.value)}
              placeholder="PRF192"
              required
              value={code}
            />
          </AcademicFormField>
          <AcademicFormField label="Semester">
            <select
              className={academicInputClass}
              onChange={(event) => setSemester(Number(event.target.value))}
              value={semester}
            >
              {SEMESTERS.map((item) => (
                <option key={item} value={item}>
                  Semester {item}
                </option>
              ))}
            </select>
          </AcademicFormField>
        </div>
        <AcademicFormField label="Department">
          <select
            className={academicInputClass}
            onChange={(event) => setSelectedDepartmentId(event.target.value)}
            required
            value={selectedDepartmentId}
          >
            {departments.map((department) => {
                const id = department._id ?? department.id ?? "";
                return (
                  <option
                    disabled={!department.isActive && id !== selectedDepartmentId}
                    key={id || department.code}
                    value={id}
                  >
                    {department.code} — {department.name}
                    {!department.isActive ? " (inactive)" : ""}
                  </option>
                );
              })}
          </select>
        </AcademicFormField>
        <AcademicFormField label="Subject name">
          <input
            className={academicInputClass}
            maxLength={160}
            onChange={(event) => setName(event.target.value)}
            placeholder="Programming Fundamentals"
            required
            value={name}
          />
        </AcademicFormField>
        <AcademicFormActions
          isPending={isPending}
          onCancel={onClose}
          submitLabel={subject ? "Save changes" : "Add subject"}
        />
      </form>
    </AcademicModal>
  );
}
