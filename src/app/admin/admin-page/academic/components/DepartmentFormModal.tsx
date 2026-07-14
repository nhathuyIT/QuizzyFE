"use client";

import { useState, type FormEvent } from "react";
import type {
  AdminAcademicDepartment,
  AdminCreateAcademicDepartmentInput,
  AdminUpdateAcademicDepartmentInput,
} from "@/services/api";
import {
  academicInputClass,
  type DepartmentCode,
} from "../academic.config";
import {
  AcademicInlineError,
  AcademicModal,
} from "./AdminAcademicUi";
import {
  AcademicFormActions,
  AcademicFormField,
} from "./AcademicFormFields";

export function DepartmentFormModal({
  code,
  department,
  error,
  isPending,
  onClose,
  onSubmit,
}: {
  code: DepartmentCode;
  department?: AdminAcademicDepartment;
  error: unknown;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (
    data: AdminCreateAcademicDepartmentInput | AdminUpdateAcademicDepartmentInput,
  ) => Promise<void>;
}) {
  const [name, setName] = useState(department?.name ?? "");
  const [description, setDescription] = useState(department?.description ?? "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await onSubmit({
        ...(department ? {} : { code, isActive: true }),
        description: description.trim() || undefined,
        name: name.trim(),
      });
    } catch {
      // React Query exposes the request error inside this modal.
    }
  }

  return (
    <AcademicModal
      description="Department codes are fixed to keep the AI and SE portal structure stable."
      onClose={onClose}
      title={department ? `Edit ${code}` : `Create ${code}`}
    >
      <form className="space-y-5" onSubmit={(event) => void submit(event)}>
        <AcademicInlineError error={error} />
        <AcademicFormField label="Department code">
          <input className={academicInputClass} disabled value={code} />
        </AcademicFormField>
        <AcademicFormField label="Department name">
          <input
            className={academicInputClass}
            maxLength={120}
            onChange={(event) => setName(event.target.value)}
            placeholder="Artificial Intelligence"
            required
            value={name}
          />
        </AcademicFormField>
        <AcademicFormField label="Description">
          <textarea
            className={`${academicInputClass} min-h-28 resize-y py-3`}
            maxLength={500}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe this academic program"
            value={description}
          />
        </AcademicFormField>
        <AcademicFormActions
          isPending={isPending}
          onCancel={onClose}
          submitLabel={department ? "Save changes" : `Create ${code}`}
        />
      </form>
    </AcademicModal>
  );
}
