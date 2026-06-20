"use client";

import { useState } from "react";
import type { MatchSize } from "../types";
import { pairCards } from "../utils";

export function useMatchBoard() {
  const [matchSize, setMatchSize] = useState<MatchSize>("half");
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [matchResults, setMatchResults] = useState<Record<string, boolean> | null>(null);

  function chooseTerm(cardId: string) {
    if (matchResults) return;
    if (selectedDefinitionId) {
      setMatches((current) => pairCards(current, cardId, selectedDefinitionId));
      setSelectedTermId(null);
      setSelectedDefinitionId(null);
      return;
    }
    setSelectedTermId((current) => (current === cardId ? null : cardId));
  }

  function chooseDefinition(cardId: string) {
    if (matchResults) return;
    if (selectedTermId) {
      setMatches((current) => pairCards(current, selectedTermId, cardId));
      setSelectedTermId(null);
      setSelectedDefinitionId(null);
      return;
    }
    setSelectedDefinitionId((current) => (current === cardId ? null : cardId));
  }

  function resetMatchBoard(size: MatchSize = matchSize) {
    setMatchSize(size);
    setSelectedTermId(null);
    setSelectedDefinitionId(null);
    setMatches({});
    setMatchResults(null);
  }

  return {
    chooseDefinition,
    chooseTerm,
    matchResults,
    matchSize,
    matches,
    resetMatchBoard,
    selectedDefinitionId,
    selectedTermId,
    setMatchResults,
  };
}
