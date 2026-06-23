"use client";

import { Loader2 } from "lucide-react";
import { CrudModal } from "./CrudModal";
import type { CrudFormField, CrudFormValue } from "./crud.types";

export function CrudFormModal<TFormData extends object>({
  description,
  fields,
  isSubmitting,
  mode,
  onChange,
  onClose,
  onSubmit,
  submitLabel,
  title,
  values,
}: {
  description: string;
  fields: CrudFormField<TFormData>[];
  isSubmitting: boolean;
  mode: "create" | "edit" | "view";
  onChange: <TKey extends keyof TFormData>(
    name: TKey,
    value: TFormData[TKey],
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  title: string;
  values: TFormData;
}) {
  const readonly = mode === "view";

  return (
    <CrudModal
      eyebrow={mode === "create" ? "Create" : mode === "edit" ? "Edit" : "View"}
      isCloseDisabled={isSubmitting}
      onClose={onClose}
      subtitle={description}
      title={title}
    >
      <form
        className="space-y-4 pt-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        {fields.map((field) => (
          <CrudFormFieldControl
            field={field}
            key={field.name}
            onChange={onChange}
            readonly={readonly || isSubmitting}
            value={values[field.name]}
          />
        ))}

        <div className="flex gap-3 pt-2">
          <button
            className="h-11 flex-1 rounded-2xl bg-[#f6f3ee] text-sm font-extrabold text-[#5f5e5e] transition hover:text-[#1b1c19] disabled:opacity-50"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            Close
          </button>
          {mode !== "view" ? (
            <button
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#614db7] text-sm font-extrabold text-white transition hover:bg-[#4f3aa0] disabled:opacity-50"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              ) : null}
              {submitLabel ?? (mode === "create" ? "Create" : "Save changes")}
            </button>
          ) : null}
        </div>
      </form>
    </CrudModal>
  );
}

function CrudFormFieldControl<TFormData extends object>({
  field,
  onChange,
  readonly,
  value,
}: {
  field: CrudFormField<TFormData>;
  onChange: <TKey extends keyof TFormData>(
    name: TKey,
    value: TFormData[TKey],
  ) => void;
  readonly: boolean;
  value: CrudFormValue | TFormData[keyof TFormData];
}) {
  const fieldId = `crud-field-${field.name}`;
  const commonClassName =
    "mt-2 w-full rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-semibold text-[#1b1c19] outline-none transition placeholder:text-[#9d8f8f] focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/20 disabled:opacity-60";

  return (
    <div>
      <label
        className="text-xs font-bold uppercase tracking-normal text-[#614db7]"
        htmlFor={fieldId}
      >
        {field.label}
        {field.required ? <span className="text-[#a33a3a]"> *</span> : null}
      </label>

      {field.type === "textarea" ? (
        <textarea
          className={`${commonClassName} min-h-24 resize-none`}
          disabled={readonly}
          id={fieldId}
          onChange={(event) =>
            onChange(field.name, event.target.value as TFormData[typeof field.name])
          }
          placeholder={field.placeholder}
          value={String(value ?? "")}
        />
      ) : field.type === "select" ? (
        <select
          className={commonClassName}
          disabled={readonly}
          id={fieldId}
          onChange={(event) =>
            onChange(field.name, event.target.value as TFormData[typeof field.name])
          }
          value={String(value ?? "")}
        >
          <option value="">Select {field.label}</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "checkbox" ? (
        <label className="mt-2 flex items-center gap-3 rounded-2xl bg-[#f6f3ee] px-4 py-3 text-sm font-bold text-[#1b1c19]">
          <input
            checked={Boolean(value)}
            disabled={readonly}
            id={fieldId}
            onChange={(event) =>
              onChange(field.name, event.target.checked as TFormData[typeof field.name])
            }
            type="checkbox"
          />
          Enabled
        </label>
      ) : (
        <input
          className={commonClassName}
          disabled={readonly}
          id={fieldId}
          onChange={(event) =>
            onChange(field.name, event.target.value as TFormData[typeof field.name])
          }
          placeholder={field.placeholder}
          type={field.type}
          value={String(value ?? "")}
        />
      )}

      {field.description ? (
        <p className="mt-1 text-xs font-semibold text-[#797583]">
          {field.description}
        </p>
      ) : null}
    </div>
  );
}
