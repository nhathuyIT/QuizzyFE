import React from 'react';

export function ChatInput() {
  return (
    <div className="p-md md:p-lg bg-surface-bright border-t border-outline-variant shrink-0 relative z-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-sm relative">
        <div className="absolute -top-12 left-0 flex gap-sm">
          <button className="bg-surface-container-lowest border border-outline-variant rounded-full px-md py-sm font-label-sm text-label-sm text-on-surface-variant hover:border-primary hover:text-primary transition-all shadow-sm">
            Explain further
          </button>
          <button className="bg-surface-container-lowest border border-outline-variant rounded-full px-md py-sm font-label-sm text-label-sm text-on-surface-variant hover:border-primary hover:text-primary transition-all shadow-sm">
            Provide math formulas
          </button>
        </div>
        <div className="flex items-end gap-sm bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-sm relative">
          <button className="p-sm text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-colors shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <textarea 
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-sm font-body-md text-body-md text-on-surface placeholder:text-outline-variant custom-scrollbar" 
            placeholder="Ask follow-up questions..." 
            rows={1}
          />
          <button className="h-11 w-11 bg-primary text-on-primary rounded-lg hover:bg-on-primary-fixed-variant transition-colors shrink-0 flex items-center justify-center shadow-sm self-end">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </div>
        <div className="text-center font-label-sm text-label-sm text-outline px-lg">
          AI Tutor is an educational tool. Always verify complex physical concepts with academic sources.
        </div>
      </div>
    </div>
  );
}
