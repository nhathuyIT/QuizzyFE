import React from 'react';

export function DailyObjectivesWidget() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col">
      <div className="flex items-center gap-sm mb-md pb-sm border-b border-outline-variant">
        <span className="material-symbols-outlined text-primary">task_alt</span>
        <h3 className="font-headline-md text-headline-md text-on-surface text-[18px]">Daily Objectives</h3>
      </div>
      <div className="flex flex-col gap-sm">
        <label className="flex items-start gap-sm cursor-pointer group">
          <input defaultChecked className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest" type="checkbox" />
          <div className="flex flex-col">
            <span className="font-body-sm text-body-sm text-on-surface line-through opacity-70">Complete 1 lesson</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant opacity-70">50 XP</span>
          </div>
        </label>
        <label className="flex items-start gap-sm cursor-pointer group">
          <input className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest" type="checkbox" />
          <div className="flex flex-col">
            <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Review Flashcards</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">20 XP</span>
          </div>
        </label>
        <label className="flex items-start gap-sm cursor-pointer group">
          <input className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest" type="checkbox" />
          <div className="flex flex-col">
            <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Contribute to Forum</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">30 XP</span>
          </div>
        </label>
      </div>
    </div>
  );
}
