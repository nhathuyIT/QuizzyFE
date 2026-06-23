"use client";

import type {
  CrudColumn,
  CrudColumnRenderContext,
} from "./crud.types";
import { CrudEmpty, CrudError, CrudLoading } from "./CrudStates";

export function CrudTable<
  TItem,
  TExtraContext extends object = Record<string, never>,
>({
  columns,
  context,
  emptyMessage,
  error,
  errorMessage,
  getRowId,
  gridTemplateClassName = "grid-cols-[1.2fr_1.5fr_110px_120px_110px]",
  isError,
  isLoading,
  loadingMessage,
  minWidthClassName = "min-w-[780px]",
  rows,
  selectedRowId,
}: {
  columns: CrudColumn<TItem, TExtraContext>[];
  context?: TExtraContext;
  emptyMessage?: string;
  error: unknown;
  errorMessage?: string;
  getRowId: (item: TItem) => string;
  gridTemplateClassName?: string;
  isError: boolean;
  isLoading: boolean;
  loadingMessage?: string;
  minWidthClassName?: string;
  rows: TItem[];
  selectedRowId: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-black/5">
      <div
        className={`grid ${minWidthClassName} ${gridTemplateClassName} bg-[#f6f2ff] px-4 py-3 text-xs font-extrabold uppercase tracking-normal text-[#614db7]`}
      >
        {columns.map((column) => (
          <span key={column.key}>{column.header}</span>
        ))}
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <CrudLoading
            label={loadingMessage}
            minWidthClassName={minWidthClassName}
          />
        ) : null}
        {isError ? (
          <CrudError
            error={error}
            fallback={errorMessage}
            minWidthClassName={minWidthClassName}
          />
        ) : null}
        {!isLoading && !isError && !rows.length ? (
          <CrudEmpty
            label={emptyMessage}
            minWidthClassName={minWidthClassName}
          />
        ) : null}

        {rows.map((row) => {
          const rowId = getRowId(row);
          const active = selectedRowId === rowId;
          const renderContext = {
            ...(context ?? {}),
            active,
            row,
            rowId,
            selectedRowId,
          } as CrudColumnRenderContext<TItem, TExtraContext>;

          return (
            <div
              className={`grid ${minWidthClassName} ${gridTemplateClassName} items-center border-t border-black/5 px-4 py-4 text-sm font-semibold text-[#1b1c19] ${
                active ? "bg-[#fbf9f4]" : "bg-white"
              }`}
              key={rowId}
            >
              {columns.map((column) => (
                <div key={column.key}>{column.render(row, renderContext)}</div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
