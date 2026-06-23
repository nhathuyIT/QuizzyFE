"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  CrudConfirmBox,
  CrudFormModal,
  CrudPanel,
} from "../components";
import { TemplateTable } from "./components/TemplateTable";
import {
  getTemplateRecordId,
  mapTemplateRecordToForm,
  templateConfirmActions,
  templateFields,
  templateInitialFormValues,
  type TemplateDialogMode,
  type TemplateFormData,
  type TemplateRecord,
} from "./template-form.config";

const seedRecords: TemplateRecord[] = [
  {
    createdAt: "2026-06-23T00:00:00.000Z",
    description: "Copy this folder and connect real APIs.",
    id: "template-1",
    name: "Example record",
    status: "active",
  },
];

export default function CrudTemplatePage() {
  const [records, setRecords] = useState<TemplateRecord[]>(seedRecords);
  const [keyword, setKeyword] = useState("");
  const [dialogMode, setDialogMode] = useState<TemplateDialogMode | null>(null);
  const [formValues, setFormValues] = useState<TemplateFormData>(
    templateInitialFormValues,
  );
  const [selectedRecord, setSelectedRecord] = useState<TemplateRecord | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<TemplateRecord | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);

  const filteredRecords = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) return records;

    return records.filter((record) => {
      return `${record.name} ${record.description ?? ""}`
        .toLowerCase()
        .includes(normalizedKeyword);
    });
  }, [keyword, records]);

  function openCreate() {
    setSelectedRecord(null);
    setFormValues(templateInitialFormValues);
    setDialogMode("create");
  }

  function openEdit(record: TemplateRecord) {
    setSelectedRecord(record);
    setFormValues(mapTemplateRecordToForm(record));
    setDialogMode("edit");
  }

  function openView(record: TemplateRecord) {
    setSelectedRecord(record);
    setFormValues(mapTemplateRecordToForm(record));
    setDialogMode("view");
  }

  function closeDialog() {
    setDialogMode(null);
    setSelectedRecord(null);
    setFormValues(templateInitialFormValues);
  }

  function handleFormChange<TKey extends keyof TemplateFormData>(
    name: TKey,
    value: TemplateFormData[TKey],
  ) {
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit() {
    if (!formValues.name.trim() || !dialogMode) return;

    setIsActionPending(true);

    if (dialogMode === "create") {
      const nextRecord: TemplateRecord = {
        createdAt: new Date().toISOString(),
        description: formValues.description,
        id: crypto.randomUUID(),
        name: formValues.name,
        status: formValues.status === "inactive" ? "inactive" : "active",
      };
      setRecords((current) => [nextRecord, ...current]);
    }

    if (dialogMode === "edit" && selectedRecord) {
      setRecords((current) =>
        current.map((record) =>
          getTemplateRecordId(record) === getTemplateRecordId(selectedRecord)
            ? {
                ...record,
                description: formValues.description,
                name: formValues.name,
                status:
                  formValues.status === "inactive" ? "inactive" : "active",
              }
            : record,
        ),
      );
    }

    setIsActionPending(false);
    closeDialog();
  }

  function handleDelete() {
    if (!deleteTarget) return;

    setRecords((current) =>
      current.filter(
        (record) => getTemplateRecordId(record) !== getTemplateRecordId(deleteTarget),
      ),
    );
    setDeleteTarget(null);
  }

  return (
    <CrudPanel
      description="Copy this module folder and replace the mock state with API queries and mutations."
      isRefreshing={false}
      onRefresh={() => undefined}
      refreshLabel="Refresh"
      title="CRUD Template"
    >
      <div className="mb-4 flex justify-end">
        <button
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#614db7] px-5 text-sm font-extrabold text-white transition hover:bg-[#4f3aa0]"
          onClick={openCreate}
          type="button"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add record
        </button>
      </div>

      <TemplateTable
        error={null}
        isError={false}
        isLoading={false}
        onDelete={setDeleteTarget}
        onEdit={openEdit}
        onSearchChange={setKeyword}
        onView={openView}
        records={filteredRecords}
        searchValue={keyword}
        selectedRecordId={
          selectedRecord ? getTemplateRecordId(selectedRecord) : null
        }
      />

      {dialogMode ? (
        <CrudFormModal<TemplateFormData>
          description={
            dialogMode === "create"
              ? "Create a new record."
              : dialogMode === "edit"
                ? "Update this record."
                : "View record details."
          }
          fields={templateFields}
          isSubmitting={isActionPending}
          mode={dialogMode}
          onChange={handleFormChange}
          onClose={closeDialog}
          onSubmit={handleSubmit}
          title={
            dialogMode === "create"
              ? "Create Record"
              : dialogMode === "edit"
                ? "Edit Record"
                : "View Record"
          }
          values={formValues}
        />
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1c19]/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[420px] rounded-[28px] bg-white p-5 shadow-2xl">
            <CrudConfirmBox
              action={templateConfirmActions.delete}
              isPending={isActionPending}
              onCancel={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
            />
          </div>
        </div>
      ) : null}
    </CrudPanel>
  );
}
