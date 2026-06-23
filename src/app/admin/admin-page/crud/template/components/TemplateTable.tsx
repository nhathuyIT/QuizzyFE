"use client";

import { Search } from "lucide-react";
import { useMemo } from "react";
import { CrudTable } from "../../components";
import { createTemplateColumns } from "../columns/template.columns";
import {
  getTemplateRecordId,
  type TemplateRecord,
} from "../template-form.config";

export function TemplateTable({
  error,
  isError,
  isLoading,
  onDelete,
  onEdit,
  onSearchChange,
  onView,
  records,
  searchValue,
  selectedRecordId,
}: {
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  onDelete?: (record: TemplateRecord) => void;
  onEdit?: (record: TemplateRecord) => void;
  onSearchChange: (value: string) => void;
  onView?: (record: TemplateRecord) => void;
  records: TemplateRecord[];
  searchValue: string;
  selectedRecordId: string | null;
}) {
  const columns = useMemo(() => createTemplateColumns(), []);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          aria-hidden="true"
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#797583]"
        />
        <input
          className="h-12 w-full rounded-2xl border border-black/5 bg-[#fbf9f4] pl-11 pr-4 text-sm font-semibold text-[#1b1c19] outline-none transition placeholder:text-[#797583] focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/20"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name or description..."
          value={searchValue}
        />
      </div>

      <CrudTable
        columns={columns}
        context={{ onDelete, onEdit, onView }}
        emptyMessage="No records found."
        error={error}
        errorMessage="Unable to load records."
        getRowId={getTemplateRecordId}
        gridTemplateClassName="grid-cols-[1.1fr_1.6fr_120px_130px]"
        isError={isError}
        isLoading={isLoading}
        loadingMessage="Loading records"
        rows={records}
        selectedRowId={selectedRecordId}
      />
    </div>
  );
}
