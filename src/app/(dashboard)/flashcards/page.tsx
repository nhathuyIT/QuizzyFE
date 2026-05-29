'use client';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { cardsAPI } from '@/services/api';
import { SettingsPanel } from '@/features/flashcards/components/SettingsPanel';
import { InputTabs } from '@/features/flashcards/components/InputTabs';
import { Loader2 } from 'lucide-react';

export default function FlashcardsPage() {
  const [selectedDeckId, setSelectedDeckId] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  const createCardMutation = useMutation({
    mutationFn: () => cardsAPI.create({ deckId: selectedDeckId, front, back, position: 0 }),
    onSuccess: () => {
      setStatusMsg({ text: 'Card created successfully!', type: 'success' });
      setFront('');
      setBack('');
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    },
    onError: (error: any) => {
      setStatusMsg({ text: error.message || 'Failed to create card', type: 'error' });
    }
  });

  const handleCreateCard = () => {
    if (!selectedDeckId) {
      setStatusMsg({ text: 'Please select a deck first.', type: 'error' });
      return;
    }
    if (!front || !back) {
      setStatusMsg({ text: 'Front and Back content are required.', type: 'error' });
      return;
    }
    createCardMutation.mutate();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-surface relative flex flex-col">
      {/* TopAppBar (Minimal for Task Focus) */}
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-outline-variant px-lg py-md flex justify-between items-center">
        <div className="flex items-center gap-sm">
          <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">Create Flashcards</h2>
        </div>
        
        {/* Progress Indicator */}
        <div className="hidden sm:flex items-center gap-sm">
          <div className="flex items-center gap-xs">
            <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm">1</div>
            <span className="font-label-md text-label-md text-primary">Input Data</span>
          </div>
          <div className="w-8 h-[2px] bg-outline-variant rounded-full"></div>
          <div className="flex items-center gap-xs opacity-50">
            <div className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-label-sm text-label-sm border border-outline-variant">2</div>
            <span className="font-label-md text-label-md text-on-surface-variant">Review</span>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="max-w-max_content_width w-full mx-auto p-lg flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg h-full">
          
          {/* Left Column: Input Panel */}
          <div className="lg:col-span-7 flex flex-col gap-md">
            <InputTabs front={front} setFront={setFront} back={back} setBack={setBack} />
          </div>

          {/* Right Column: Settings & Action */}
          <div className="lg:col-span-5 flex flex-col gap-lg">
            <SettingsPanel selectedDeckId={selectedDeckId} onDeckChange={setSelectedDeckId} />

            {/* Action Area */}
            <div className="mt-auto bg-surface-container-low border border-primary/20 rounded-xl p-md flex flex-col items-center justify-center text-center relative">
              {statusMsg.text && (
                <div className={`absolute top-[-40px] left-0 right-0 p-2 text-center rounded font-label-md ${statusMsg.type === 'error' ? 'bg-error/20 text-error' : 'bg-primary/20 text-primary'}`}>
                  {statusMsg.text}
                </div>
              )}
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-sm">
                <span className="material-symbols-outlined text-primary text-[24px]">add_box</span>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-xs">Save Flashcard</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
                Save this card to your selected deck. You can continue adding more cards afterwards.
              </p>
              <button 
                onClick={handleCreateCard}
                disabled={createCardMutation.isPending}
                className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg shadow-sm hover:bg-primary/90 hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-sm disabled:opacity-70 disabled:pointer-events-none"
              >
                {createCardMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    Create Card
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
