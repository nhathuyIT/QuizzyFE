import React from 'react';

export function ChatSidebar() {
  return (
    <aside className="w-80 h-full border-r border-outline-variant bg-surface-container-lowest flex-col hidden lg:flex shrink-0">
      <div className="h-16 px-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest sticky top-0 z-10">
        <span className="font-headline-md text-[18px] font-bold text-on-surface">Chat History</span>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">edit_square</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-md flex flex-col gap-lg">
        <div className="flex flex-col gap-xs">
          <div className="font-label-sm text-label-sm text-on-surface-variant px-sm mb-xs uppercase tracking-wider">Today</div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-md cursor-pointer transition-colors relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"></div>
            <div className="font-label-md text-label-md text-on-surface truncate font-semibold mb-1">Quantum Physics</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Explain the double-slit experiment...</div>
          </div>
          <div className="hover:bg-surface-container rounded-lg p-md cursor-pointer transition-colors border border-transparent">
            <div className="font-label-md text-label-md text-on-surface truncate mb-1">Advanced React Patterns</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant truncate">How does useMemo work under the hood?</div>
          </div>
        </div>
        <div className="flex flex-col gap-xs">
          <div className="font-label-sm text-label-sm text-on-surface-variant px-sm mb-xs uppercase tracking-wider">Previous 7 Days</div>
          <div className="hover:bg-surface-container rounded-lg p-md cursor-pointer transition-colors border border-transparent">
            <div className="font-label-md text-label-md text-on-surface truncate mb-1">Color Theory UI</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Suggest a palette for a fintech app...</div>
          </div>
          <div className="hover:bg-surface-container rounded-lg p-md cursor-pointer transition-colors border border-transparent">
            <div className="font-label-md text-label-md text-on-surface truncate mb-1">SEO Optimization Basics</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant truncate">What are the core web vitals?</div>
          </div>
          <div className="hover:bg-surface-container rounded-lg p-md cursor-pointer transition-colors border border-transparent">
            <div className="font-label-md text-label-md text-on-surface truncate mb-1">Creative Writing Prompts</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Give me 3 sci-fi story starters.</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
