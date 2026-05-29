import React from 'react';
import { SettingsPanel } from '@/features/flashcards/components/SettingsPanel';
import { InputTabs } from '@/features/flashcards/components/InputTabs';

export default function FlashcardsPage() {
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
            <InputTabs />
          </div>

          {/* Right Column: Settings & Action */}
          <div className="lg:col-span-5 flex flex-col gap-lg">
            <SettingsPanel />

            {/* Action Area */}
            <div className="mt-auto bg-surface-container-low border border-primary/20 rounded-xl p-md flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-sm">
                <span className="material-symbols-outlined text-primary text-[24px]">auto_awesome</span>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-xs">Ready to Generate</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
                Our AI will analyze your input and create highly effective study cards based on your settings.
              </p>
              <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg shadow-sm hover:bg-primary/90 hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined">bolt</span>
                Process & Preview Cards
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
