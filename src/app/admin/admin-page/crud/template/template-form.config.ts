import type { CrudConfirmAction, CrudFormField } from "../components";

export type TemplateRecord = {
  createdAt?: string;
  description?: string;
  id: string;
  name: string;
  status: "active" | "inactive";
};

export type TemplateFormData = {
  description: string;
  name: string;
  status: string;
};

export type TemplateDialogMode = "create" | "edit" | "view";

export const templateInitialFormValues: TemplateFormData = {
  description: "",
  name: "",
  status: "active",
};

export const templateFields: CrudFormField<TemplateFormData>[] = [
  {
    label: "Name",
    name: "name",
    placeholder: "Enter name",
    required: true,
    type: "text",
  },
  {
    label: "Description",
    name: "description",
    placeholder: "Enter description",
    type: "textarea",
  },
  {
    label: "Status",
    name: "status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    required: true,
    type: "select",
  },
];

export const templateConfirmActions = {
  delete: {
    description: "This action cannot be undone.",
    label: "Delete",
    title: "Delete this record?",
    tone: "danger",
    type: "delete",
  },
} satisfies Record<"delete", CrudConfirmAction>;

export function getTemplateRecordId(record: TemplateRecord) {
  return record.id;
}

export function mapTemplateRecordToForm(
  record?: TemplateRecord | null,
): TemplateFormData {
  if (!record) return templateInitialFormValues;

  return {
    description: record.description ?? "",
    name: record.name,
    status: record.status,
  };
}
