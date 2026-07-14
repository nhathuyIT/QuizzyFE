"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cardsAPI } from "@/services/api";
import {
  buildManualCardInput,
  getEmptyManualDraft,
  hasInvalidBulkCards,
  parseBulkCards,
} from "@/features/flashcards/utils";
import type {
  CardInputMode,
  ManualCardField,
  ManualCardDraft,
  StatusMessage,
} from "@/features/flashcards/types";

export function useFlashcardCreator() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [selectedDeckId, setSelectedDeckId] = useState(
    searchParams.get("deckId") ?? "",
  );
  const [mode, setMode] = useState<CardInputMode>("manual");
  const [manualDraft, setManualDraft] = useState<ManualCardDraft>(() =>
    getEmptyManualDraft(),
  );
  const [bulkText, setBulkText] = useState("");
  const [statusMsg, setStatusMsg] = useState<StatusMessage>({
    text: "",
    type: "",
  });

  const deckCardsQuery = useQuery({
    queryKey: ["cards", "deck", selectedDeckId],
    queryFn: () => cardsAPI.getByDeckId(selectedDeckId),
    enabled: Boolean(selectedDeckId),
  });

  const nextPosition = deckCardsQuery.data?.data.length ?? 0;
  const parsedBulkCards = useMemo(
    () => parseBulkCards(bulkText, selectedDeckId, nextPosition),
    [bulkText, nextPosition, selectedDeckId],
  );

  const createMutation = useMutation({
    mutationFn: async () => {
      if (mode === "bulk") {
        const response = await cardsAPI.bulkCreate(parsedBulkCards);
        return { count: response.data.length };
      }

      const card = buildManualCardInput(
        manualDraft,
        selectedDeckId,
        nextPosition,
      );
      await cardsAPI.create(card);
      return { count: 1 };
    },
    onSuccess: (response) => {
      const count = response.count;
      setStatusMsg({
        text: `${count} card${count > 1 ? "s" : ""} created successfully.`,
        type: "success",
      });
      setManualDraft(getEmptyManualDraft());
      setBulkText("");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
    onError: (error: Error) => {
      setStatusMsg({ text: error.message, type: "error" });
    },
  });

  function updateManualDraft(field: ManualCardField, value: string) {
    setManualDraft((current) => ({ ...current, [field]: value }));
  }

  function handleCreate() {
    setStatusMsg({ text: "", type: "" });

    if (!selectedDeckId) {
      setStatusMsg({
        text: "Choose a deck before saving.",
        type: "error",
      });
      return;
    }

    if (mode === "upload") {
      setStatusMsg({
        text: "The backend does not expose an upload endpoint yet.",
        type: "error",
      });
      return;
    }

    if (
      mode === "bulk" &&
      (!parsedBulkCards.length || hasInvalidBulkCards(parsedBulkCards))
    ) {
      setStatusMsg({
        text: "Each bulk line must use the format front :: back.",
        type: "error",
      });
      return;
    }

    if (
      mode === "manual" &&
      (!manualDraft.front.trim() || !manualDraft.back.trim())
    ) {
      setStatusMsg({ text: "Front and back are required.", type: "error" });
      return;
    }

    if (mode === "bulk") {
      setStatusMsg({
        text: `Creating ${parsedBulkCards.length} cards. Please keep this page open.`,
        type: "pending",
      });
    }

    createMutation.mutate();
  }

  return {
    bulkText,
    handleCreate,
    isCreating: createMutation.isPending,
    isDeckCardsLoading: deckCardsQuery.isLoading,
    manualDraft,
    mode,
    nextPosition,
    parsedBulkCards,
    selectedDeckId,
    setBulkText,
    setMode,
    setSelectedDeckId,
    statusMsg,
    updateManualDraft,
  };
}
