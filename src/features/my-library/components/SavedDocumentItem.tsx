import React from 'react';

export interface SavedDocumentItemProps {
  icon: string;
  title: string;
  meta: string;
}

export function SavedDocumentItem({ icon, title, meta }: SavedDocumentItemProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-lg flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
      <div className="flex items-center gap-md">
        <div className="text-outline-variant">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <h4 className="font-body-md text-body-md font-medium text-on-surface">{title}</h4>
          <p className="font-label-sm text-label-sm text-on-surface-variant">{meta}</p>
        </div>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors" style={{ fontSize: '20px' }}>bookmark_remove</span>
    </div>
  );
}
