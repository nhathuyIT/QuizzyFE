"use client";

import { useState, type FormEvent } from "react";
import type {
  AdminAcademicSubject,
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
  departmentId,
  error,
  initialSemester,
  isPending,
  onClose,
  onSubmit,
  subject,
}: {
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await onSubmit({
        code: code.trim().toUpperCase(),
        departmentId,
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
      description="Moving a subject to another semester updates the subject itself through the admin API."
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
