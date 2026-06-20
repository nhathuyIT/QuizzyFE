import type { Card } from "@/services/api";
import type { ResultState } from "./types";

export function buildStudyOptions(cards: Card[], currentCard?: Card) {
  if (!currentCard) return [];

  const distractors = cards
    .filter((card) => card._id !== currentCard._id)
    .map((card) => card.back)
    .filter(Boolean)
    .slice(0, 3);

  return stableShuffle([currentCard.back, ...distractors]).map((value) => ({
    label: value,
    value,
  }));
}

export function stableShuffle<T extends string | Card>(items: T[]) {
  return [...items].sort((first, second) => {
    const firstText = typeof first === "string" ? first : first._id;
    const secondText = typeof second === "string" ? second : second._id;
    return hashText(firstText) - hashText(secondText);
  });
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

export function getMatchResult(termId: string, definitionId?: string): ResultState {
  if (!definitionId) return "wrong";
  return termId === definitionId ? "correct" : "wrong";
}

function hashText(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 9973;
  }

  return hash;
}
