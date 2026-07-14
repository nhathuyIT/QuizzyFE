"use client";

import { FlashcardsPageHeader } from "./FlashcardsPageHeader";
import { InputTabs } from "./InputTabs";
import { SaveCardsPanel } from "./SaveCardsPanel";
import { SettingsPanel } from "./SettingsPanel";
import { useFlashcardCreator } from "@/features/flashcards/hooks/useFlashcardCreator";

export function FlashcardCreator() {
  const creator = useFlashcardCreator();

  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        <FlashcardsPageHeader />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <InputTabs
            bulkText={creator.bulkText}
            disabled={creator.isCreating}
            manualDraft={creator.manualDraft}
            mode={creator.mode}
            onBulkTextChange={creator.setBulkText}
            onManualDraftChange={creator.updateManualDraft}
            onModeChange={creator.setMode}
          />

          <div className="space-y-5">
            <SettingsPanel
              disabled={creator.isCreating}
              mode={creator.mode}
              onDeckChange={creator.setSelectedDeckId}
              selectedDeckId={creator.selectedDeckId}
            />
            <SaveCardsPanel
              isCreating={creator.isCreating}
              isDeckCardsLoading={creator.isDeckCardsLoading}
              mode={creator.mode}
              nextPosition={creator.nextPosition}
              onCreate={creator.handleCreate}
              parsedCardCount={creator.parsedBulkCards.length}
              statusMsg={creator.statusMsg}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
