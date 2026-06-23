import type { ReactNode } from "react";

export type CrudColumnRenderContext<
  TItem,
  TExtraContext extends object = Record<string, never>,
> = TExtraContext & {
  active: boolean;
  row: TItem;
  rowId: string;
  selectedRowId: string | null;
};

export type CrudColumn<
  TItem,
  TExtraContext extends object = Record<string, never>,
> = {
  header: string;
  key: string;
  render: (
    item: TItem,
    context: CrudColumnRenderContext<TItem, TExtraContext>,
  ) => ReactNode;
};

export type CrudConfirmAction = {
  description: string;
  label: string;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  requiresReason?: boolean;
  title: string;
  tone: "default" | "danger";
  type: string;
};

export type CrudFormValue = boolean | number | string | undefined;

export type CrudFormField<TFormData extends object> = {
  description?: string;
  label: string;
  name: Extract<keyof TFormData, string>;
  options?: Array<{
    label: string;
    value: string;
  }>;
  placeholder?: string;
  required?: boolean;
  type: "checkbox" | "email" | "password" | "select" | "text" | "textarea";
};
