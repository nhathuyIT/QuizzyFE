import { ArrowRight, Loader2 } from "lucide-react";
import type { MatchStudyItem } from "@/services/api";
import type { MatchSize, ResultState } from "../types";
import { findPairedTermId } from "../utils";
import { ResultMark } from "./ResultMark";

export function SessionMatchPanel({
  definitions,
  isFinishing,
  isPending,
  matchSize,
  matches,
  onCheck,
  onChooseDefinition,
  onChooseTerm,
  onFinish,
  onSizeChange,
  pairedCount,
  results,
  selectedDefinitionId,
  selectedTermId,
  terms,
  totalCards,
}: {
  definitions: MatchStudyItem[];
  isFinishing: boolean;
  isPending: boolean;
  matchSize: MatchSize;
  matches: Record<string, string>;
  onCheck: () => void;
  onChooseDefinition: (cardId: string) => void;
  onChooseTerm: (cardId: string) => void;
  onFinish: () => void;
  onSizeChange: (size: MatchSize) => void;
  pairedCount: number;
  results: Record<string, boolean> | null;
  selectedDefinitionId: string | null;
  selectedTermId: string | null;
  terms: MatchStudyItem[];
  totalCards: number;
}) {
  return (
    <div>
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            Match the terms
          </h1>
          <p className="mt-2 text-sm text-[#777474]">
            Choose 1/2 or All, pair everything, then press Check.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SizeButton
            active={matchSize === "half"}
            disabled={Boolean(results) || isPending}
            label="1/2"
            onClick={() => onSizeChange("half")}
          />
          <SizeButton
            active={matchSize === "all"}
            disabled={Boolean(results) || isPending}
            label="All"
            onClick={() => onSizeChange("all")}
          />
          <span className="rounded-full bg-[#f6f3ee] px-4 py-2 text-sm font-bold text-[#777474]">
            {pairedCount}/{terms.length || totalCards} paired
          </span>
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {terms.map((term) => {
            const pairedDefinitionId = matches[term.cardId];
            const result: ResultState = results
              ? results[term.cardId]
                ? "correct"
                : "wrong"
              : null;

            return (
              <button
                className={`flex min-h-16 w-full items-center justify-between gap-3 rounded-[18px] border px-5 py-4 text-left font-bold transition disabled:opacity-80 ${
                  result === "correct"
                    ? "border-[#8fd7a9] bg-[#e4f5eb] text-[#205c3c]"
                    : result === "wrong"
                      ? "border-[#f1a4a4] bg-[#fff0f0] text-[#8e3030]"
                      : selectedTermId === term.cardId
                        ? "border-[#614db7] bg-[#e6deff] text-[#311485]"
                        : pairedDefinitionId
                          ? "border-[#cabeff] bg-white text-[#311485]"
                          : "border-black/5 bg-[#fbf9f4] hover:border-[#cabeff]"
                }`}
                disabled={Boolean(results) || isPending}
                key={term.tileId}
                onClick={() => onChooseTerm(term.cardId)}
                type="button"
              >
                <span>
                  <span className="block">{term.text}</span>
                  {pairedDefinitionId && (
                    <span className="mt-1 block text-xs font-bold text-[#777474]">
                      paired with{" "}
                      {definitions.find((definition) => definition.cardId === pairedDefinitionId)
                        ?.text ?? "definition"}
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
            const pairedTermId = findPairedTermId(matches, definition.cardId);
            const result: ResultState =
              results && pairedTermId
                ? results[pairedTermId]
                  ? "correct"
                  : "wrong"
                : null;

            return (
              <button
                className={`flex min-h-16 w-full items-center justify-between gap-3 rounded-[18px] border px-5 py-4 text-left text-sm font-bold transition disabled:opacity-80 ${
                  result === "correct"
                    ? "border-[#8fd7a9] bg-[#e4f5eb] text-[#205c3c]"
                    : result === "wrong"
                      ? "border-[#f1a4a4] bg-[#fff0f0] text-[#8e3030]"
                      : selectedDefinitionId === definition.cardId
                        ? "border-[#614db7] bg-[#e6deff] text-[#311485]"
                        : pairedTermId
                          ? "border-[#cabeff] bg-white text-[#311485]"
                          : "border-black/5 bg-[#fbf9f4] hover:border-[#cabeff]"
                }`}
                disabled={Boolean(results) || isPending}
                key={definition.tileId}
                onClick={() => onChooseDefinition(definition.cardId)}
                type="button"
              >
                <span>{definition.text}</span>
                <ResultMark result={result} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          className="inline-flex items-center gap-2 rounded-full bg-[#614db7] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
          disabled={!terms.length || pairedCount < terms.length || Boolean(results) || isPending}
          onClick={onCheck}
          type="button"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Check
        </button>
        {results && (
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[#1b1c19] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
            disabled={isFinishing || isPending}
            onClick={onFinish}
            type="button"
          >
            {isFinishing || isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Finish session
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SizeButton({
  active,
  disabled,
  label,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-extrabold disabled:opacity-50 ${
        active ? "bg-[#311485] text-white" : "bg-[#e6deff] text-[#311485]"
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
