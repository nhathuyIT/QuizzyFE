import React from 'react';

export interface ChatMessageProps {
  type: 'user' | 'bot' | 'typing';
  content?: React.ReactNode;
}

export function ChatMessage({ type, content }: ChatMessageProps) {
  if (type === 'user') {
    return (
      <div className="flex justify-end pl-12 md:pl-24">
        <div className="bg-primary text-on-primary rounded-2xl rounded-tr-sm p-md font-body-md text-body-md shadow-sm max-w-2xl relative group">
          {content}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-outline hover:text-primary"><span className="material-symbols-outlined text-[20px]">content_copy</span></button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'typing') {
    return (
      <div className="flex justify-start gap-md pr-12 md:pr-24">
        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary border border-outline-variant shrink-0 mt-1 shadow-sm">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl rounded-tl-sm p-md text-on-surface font-body-md text-body-md shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-outline animate-pulse"></span>
          <span className="w-2 h-2 rounded-full bg-outline animate-pulse" style={{ animationDelay: "150ms" }}></span>
          <span className="w-2 h-2 rounded-full bg-outline animate-pulse" style={{ animationDelay: "300ms" }}></span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-md pr-12 md:pr-24">
      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary border border-outline-variant shrink-0 mt-1 shadow-sm">
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl rounded-tl-sm p-lg text-on-surface font-body-md text-body-md shadow-sm max-w-3xl flex flex-col gap-md">
        {content}
        <div className="flex items-center gap-sm mt-sm">
          <button className="flex items-center gap-xs text-on-surface-variant hover:text-primary font-label-sm text-label-sm transition-colors bg-surface-bright px-sm py-xs rounded-md border border-outline-variant">
            <span className="material-symbols-outlined text-[16px]">thumb_up</span> Helpful
          </button>
          <button className="flex items-center gap-xs text-on-surface-variant hover:text-error font-label-sm text-label-sm transition-colors bg-surface-bright px-sm py-xs rounded-md border border-outline-variant">
            <span className="material-symbols-outlined text-[16px]">thumb_down</span>
          </button>
          <button className="flex items-center gap-xs text-on-surface-variant hover:text-secondary font-label-sm text-label-sm transition-colors bg-surface-bright px-sm py-xs rounded-md border border-outline-variant ml-auto">
            <span className="material-symbols-outlined text-[16px]">refresh</span> Retry
          </button>
        </div>
      </div>
    </div>
  );
}
