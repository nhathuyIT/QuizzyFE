import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { FormEvent } from "react";
import type { StudyReportFilterValue } from "../index";

type StudyReportFiltersProps = {
  activeFilterCount: number;
  error: string;
  onApply: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (value: StudyReportFilterValue) => void;
  onReset: () => void;
  value: StudyReportFilterValue;
};

export function StudyReportFilters({
  activeFilterCount,
  error,
  onApply,
  onChange,
  onReset,
  value,
}: StudyReportFiltersProps) {
  const hasDraftValue = Object.values(value).some(Boolean);

  function updateFilter<Key extends keyof StudyReportFilterValue>(
    key: Key,
    nextValue: StudyReportFilterValue[Key],
  ) {
    onChange({ ...value, [key]: nextValue });
  }

  return (
    <form
      className="mt-6 rounded-[24px] border border-[#e6deff] bg-[#fbf9ff] p-4 sm:p-5"
      onSubmit={onApply}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            aria-hidden="true"
            className="h-4 w-4 text-[#614db7]"
          />
          <h3 className="text-sm font-extrabold text-[#311485]">
            Report filters
          </h3>
        </div>
        <p className="text-xs font-semibold text-[#797583]">
          Date and mode filters also update the overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <FilterField label="From">
          <input
            className={inputClassName}
            onChange={(event) => updateFilter("from", event.target.value)}
            type="date"
            value={value.from}
          />
        </FilterField>

        <FilterField label="To">
          <input
            className={inputClassName}
            onChange={(event) => updateFilter("to", event.target.value)}
            type="date"
            value={value.to}
          />
        </FilterField>

        <FilterField label="Mode">
          <select
            className={inputClassName}
            onChange={(event) =>
              updateFilter(
                "mode",
                event.target.value as StudyReportFilterValue["mode"],
              )
            }
            value={value.mode}
          >
            <option value="">All modes</option>
            <option value="flashcard">Flashcard</option>
            <option value="learn">Learn</option>
            <option value="test">Test</option>
            <option value="match">Match</option>
          </select>
        </FilterField>

        <FilterField label="Status">
          <select
            className={inputClassName}
            onChange={(event) =>
              updateFilter(
                "status",
                event.target.value as StudyReportFilterValue["status"],
              )
            }
            value={value.status}
          >
            <option value="">All statuses</option>
            <option value="finished">Finished</option>
            <option value="unfinished">In progress</option>
          </select>
        </FilterField>

        <FilterField label="User ID">
          <input
            className={inputClassName}
            maxLength={24}
            onChange={(event) => updateFilter("userId", event.target.value)}
            pattern="[0-9a-fA-F]{24}"
            placeholder="MongoDB user ID"
            title="Enter a 24-character MongoDB ID"
            value={value.userId}
          />
        </FilterField>

        <FilterField label="Deck ID">
          <input
            className={inputClassName}
            maxLength={24}
            onChange={(event) => updateFilter("deckId", event.target.value)}
            pattern="[0-9a-fA-F]{24}"
            placeholder="MongoDB deck ID"
            title="Enter a 24-character MongoDB ID"
            value={value.deckId}
          />
        </FilterField>
      </div>

      {error ? (
        <p className="mt-3 text-sm font-bold text-[#a33a3a]" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-extrabold text-[#5f5e5e] transition hover:bg-white hover:text-[#1b1c19] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasDraftValue && activeFilterCount === 0}
          onClick={onReset}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Reset
        </button>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#614db7] px-5 text-sm font-extrabold text-white transition hover:bg-[#4f3ca3]"
          type="submit"
        >
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
          Apply filters
        </button>
      </div>
    </form>
  );
}

function FilterField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-extrabold uppercase tracking-wide text-[#797583]">
      {label}
      {children}
    </label>
  );
}

const inputClassName =
  "h-11 min-w-0 rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-[#1b1c19] outline-none transition placeholder:text-[#a29ca7] focus:border-[#927df0] focus:ring-2 focus:ring-[#e6deff]";
