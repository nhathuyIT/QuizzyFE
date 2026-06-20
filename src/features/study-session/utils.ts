import type {
  FlashcardStudyItem,
  MatchStudyItem,
  MultipleChoiceStudyItem,
  StudyItem,
  WrittenStudyItem,
} from "@/services/api";
import type { ResultState } from "./types";

export function stableShuffle<T extends MatchStudyItem>(items: T[]) {
  return [...items].sort((first, second) => hashText(first.tileId) - hashText(second.tileId));
}

export function pairCards(
  current: Record<string, string>,
  termId: string,
  definitionId: string,
) {
  const next = { ...current, [termId]: definitionId };

  for (const [pairedTermId, pairedDefinitionId] of Object.entries(next)) {
    if (pairedTermId !== termId && pairedDefinitionId === definitionId) {
      delete next[pairedTermId];
    }
  }

  return next;
}

export function findPairedTermId(matches: Record<string, string>, definitionId: string) {
  return Object.entries(matches).find(
    ([, pairedDefinitionId]) => pairedDefinitionId === definitionId,
  )?.[0];
}

export function getChoiceResult(
  option: string,
  answer: string,
  correctAnswer: string,
): ResultState {
  if (option === correctAnswer) return "correct";
  if (option === answer) return "wrong";
  return null;
}

export function normalizeAnswer(answer: string) {
  return answer.trim().replace(/\s+/g, " ").toLowerCase();
}

export function buildMatchResults(
  terms: MatchStudyItem[],
  matches: Record<string, string>,
) {
  return terms.reduce<Record<string, boolean>>((current, item) => {
    current[item.cardId] = matches[item.cardId] === item.cardId;
    return current;
  }, {});
}

export function buildMatchReviewPayloads(
  terms: MatchStudyItem[],
  definitions: MatchStudyItem[],
  matches: Record<string, string>,
) {
  return terms.map((item) => ({
    cardId: item.cardId,
    userAnswer:
      definitions.find((definition) => definition.cardId === matches[item.cardId])?.text ??
      "",
  }));
}

export function isFlashcardItem(item: StudyItem): item is FlashcardStudyItem {
  return "type" in item && item.type === "flashcard";
}

export function isMatchItem(item: StudyItem): item is MatchStudyItem {
  return "tileId" in item;
}

export function isSessionCardItem(
  item: StudyItem,
): item is FlashcardStudyItem | WrittenStudyItem | MultipleChoiceStudyItem {
  return !isMatchItem(item);
}

export function formatStudyMode(mode: string) {
  if (mode === "flashcard") return "Flashcard";
  return mode;
}

function hashText(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 9973;
  }

  return hash;
}
