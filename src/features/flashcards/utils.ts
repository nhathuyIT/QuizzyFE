import type { CardInput } from "@/services/api";
import type { ManualCardDraft } from "./types";

export function parseBulkCards(
  bulkText: string,
  deckId: string,
  nextPosition: number,
): CardInput[] {
  return bulkText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [frontValue, ...backParts] = line.split("::");

      return {
        deckId,
        front: frontValue?.trim() ?? "",
        back: backParts.join("::").trim(),
        position: nextPosition + index,
      };
    });
}

export function hasInvalidBulkCards(cards: CardInput[]) {
  return cards.some((card) => !card.front || !card.back);
}

export function buildManualCardInput(
  draft: ManualCardDraft,
  deckId: string,
  position: number,
): CardInput {
  return {
    deckId,
    front: draft.front.trim(),
    back: draft.back.trim(),
    hint: draft.hint.trim() || undefined,
    explanation: draft.explanation.trim() || undefined,
    examples: draft.examples
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    position,
  };
}

export function getEmptyManualDraft(): ManualCardDraft {
  return {
    front: "",
    back: "",
    hint: "",
    explanation: "",
    examples: "",
  };
}
