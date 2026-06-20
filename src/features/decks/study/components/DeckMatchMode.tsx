import type { Card } from "@/services/api";
import type { MatchSize } from "../types";
import { findPairedTermId, getMatchResult } from "../utils";
import { ResultMark } from "./ResultMark";

export function DeckMatchMode({
  checked,
  definitions,
  matchSize,
  matches,
  onCheck,
  onChooseDefinition,
  onChooseTerm,
  onReset,
  onSizeChange,
  pairedCount,
  selectedDefinitionId,
  selectedTermId,
  terms,
  totalCards,
}: {
  checked: boolean;
  definitions: Card[];
  matchSize: MatchSize;
  matches: Record<string, string>;
  onCheck: () => void;
  onChooseDefinition: (cardId: string) => void;
  onChooseTerm: (cardId: string) => void;
  onReset: () => void;
  onSizeChange: (size: MatchSize) => void;
  pairedCount: number;
  selectedDefinitionId: string | null;
  selectedTermId: string | null;
  terms: Card[];
  totalCards: number;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#614db7]">
            Match mode
          </p>
          <h2 className="mt-1 text-2xl font-extrabold">Match the terms</h2>
          <p className="mt-1 text-sm text-[#777474]">
            Select a term and a definition. Press Check when every pair is ready.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`rounded-full px-4 py-2 text-sm font-extrabold ${
              matchSize === "half"
                ? "bg-[#311485] text-white"
                : "bg-[#e6deff] text-[#311485]"
            }`}
            onClick={() => onSizeChange("half")}
            type="button"
          >
            1/2
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm font-extrabold ${
              matchSize === "all"
                ? "bg-[#311485] text-white"
                : "bg-[#e6deff] text-[#311485]"
            }`}
            onClick={() => onSizeChange("all")}
            type="button"
          >
            All
          </button>
          <span className="rounded-full bg-[#f6f3ee] px-4 py-2 text-sm font-bold text-[#777474]">
            {pairedCount}/{terms.length || totalCards} paired
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {terms.map((term) => {
            const pairedDefinition = matches[term._id];
            const result = checked ? getMatchResult(term._id, pairedDefinition) : null;

            return (
              <button
                className={`flex min-h-16 w-full items-center justify-between gap-3 rounded-[18px] border px-5 py-4 text-left font-bold transition ${
                  result === "correct"
                    ? "border-[#8fd7a9] bg-[#e4f5eb] text-[#205c3c]"
                    : result === "wrong"
                      ? "border-[#f1a4a4] bg-[#fff0f0] text-[#8e3030]"
                      : selectedTermId === term._id
                        ? "border-[#614db7] bg-[#e6deff] text-[#311485]"
                        : pairedDefinition
                          ? "border-[#cabeff] bg-white text-[#311485]"
                          : "border-black/5 bg-[#fbf9f4] hover:border-[#cabeff]"
                }`}
                disabled={checked}
                key={term._id}
                onClick={() => onChooseTerm(term._id)}
                type="button"
              >
                <span>
                  <span className="block">{term.front}</span>
                  {pairedDefinition && (
                    <span className="mt-1 block text-xs font-bold text-[#777474]">
                      paired with {definitions.find((item) => item._id === pairedDefinition)?.back}
                    </span>
                  )}
                </span>
                <ResultMark result={result} />
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {definitions.map((definition) => {
            const pairedTermId = findPairedTermId(matches, definition._id);
            const result =
              checked && pairedTermId ? getMatchResult(pairedTermId, definition._id) : null;

            return (
              <button
                className={`flex min-h-16 w-full items-center justify-between gap-3 rounded-[18px] border px-5 py-4 text-left text-sm font-bold transition ${
                  result === "correct"
                    ? "border-[#8fd7a9] bg-[#e4f5eb] text-[#205c3c]"
                    : result === "wrong"
                      ? "border-[#f1a4a4] bg-[#fff0f0] text-[#8e3030]"
                      : selectedDefinitionId === definition._id
                        ? "border-[#614db7] bg-[#e6deff] text-[#311485]"
                        : pairedTermId
                          ? "border-[#cabeff] bg-white text-[#311485]"
                          : "border-black/5 bg-[#fbf9f4] hover:border-[#cabeff]"
                }`}
                disabled={checked}
                key={definition._id}
                onClick={() => onChooseDefinition(definition._id)}
                type="button"
              >
                <span>{definition.back}</span>
                <ResultMark result={result} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          className="rounded-full bg-[#614db7] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
          disabled={!terms.length || pairedCount < terms.length || checked}
          onClick={onCheck}
          type="button"
        >
          Check
        </button>
        {checked && (
          <button
            className="rounded-full bg-[#f6f3ee] px-6 py-3 text-sm font-bold text-[#311485]"
            onClick={onReset}
            type="button"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
