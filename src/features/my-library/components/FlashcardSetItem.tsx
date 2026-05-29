import React from 'react';

export interface FlashcardSetItemProps {
  iconColorClass: string;
  title: string;
  meta: string;
}

export function FlashcardSetItem({ iconColorClass, title, meta }: FlashcardSetItemProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-lg flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
      <div className="flex items-center gap-md">
        <div className={`w-10 h-10 rounded flex items-center justify-center ${iconColorClass}`}>
          <span className="material-symbols-outlined">style</span>
        </div>
        <div>
          <h4 className="font-headline-md text-body-lg text-on-surface">{title}</h4>
          <p className="font-label-sm text-label-sm text-on-surface-variant">{meta}</p>
        </div>
      </div>
      <button className="w-8 h-8 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary hover:text-primary transition-colors">
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
      </button>
    </div>
  );
}
