'use client';
import React, { useState } from 'react';

interface InputTabsProps {
  front: string;
  setFront: (val: string) => void;
  back: string;
  setBack: (val: string) => void;
}

export function InputTabs({ front, setFront, back, setBack }: InputTabsProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'upload' | 'paste'>('manual');

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md custom-shadow flex-1 flex flex-col">
      {/* Input Tabs */}
      <div className="flex border-b border-outline-variant mb-md overflow-x-auto custom-scrollbar">
        <button 
          className={`flex items-center gap-xs px-md py-sm font-label-md text-label-md border-b-2 transition-colors whitespace-nowrap ${activeTab === 'manual' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}`}
          onClick={() => setActiveTab('manual')}
        >
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          Manual Input
        </button>
        <button 
          className={`flex items-center gap-xs px-md py-sm font-label-md text-label-md border-b-2 transition-colors whitespace-nowrap ${activeTab === 'upload' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}`}
          onClick={() => setActiveTab('upload')}
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          Upload Document
        </button>
        <button 
          className={`flex items-center gap-xs px-md py-sm font-label-md text-label-md border-b-2 transition-colors whitespace-nowrap ${activeTab === 'paste' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}`}
          onClick={() => setActiveTab('paste')}
        >
          <span className="material-symbols-outlined text-[18px]">content_paste</span>
          Paste Text
        </button>
      </div>

      {/* Tab Content: Manual */}
      {activeTab === 'manual' && (
        <div className="flex-1 flex flex-col gap-md">
          <div className="flex-1 flex flex-col">
            <label className="block font-label-md text-label-md text-on-surface mb-xs">Front (Question / Term)</label>
            <textarea 
              className="w-full flex-1 min-h-[120px] p-md border border-outline-variant rounded-lg bg-surface font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all placeholder:text-outline" 
              placeholder="Enter the front of the flashcard..."
              value={front}
              onChange={(e) => setFront(e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="block font-label-md text-label-md text-on-surface mb-xs">Back (Answer / Definition)</label>
            <textarea 
              className="w-full flex-1 min-h-[120px] p-md border border-outline-variant rounded-lg bg-surface font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all placeholder:text-outline" 
              placeholder="Enter the back of the flashcard..."
              value={back}
              onChange={(e) => setBack(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Tab Content: Upload */}
      {activeTab === 'upload' && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 border-2 border-dashed border-outline-variant rounded-lg bg-surface flex flex-col items-center justify-center p-xl hover:bg-surface-container-low hover:border-primary transition-all cursor-pointer group">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-md group-hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[32px]">cloud_upload</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Drag & drop your file here</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg text-center max-w-sm">
              Supported formats: PDF, TXT, DOCX. We'll automatically extract the key concepts for your cards.
            </p>
            <button className="px-lg py-sm bg-surface-container border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors">
              Browse Files
            </button>
          </div>
        </div>
      )}

      {/* Tab Content: Paste */}
      {activeTab === 'paste' && (
        <div className="flex-1 flex flex-col h-full">
          <textarea 
            className="w-full flex-1 min-h-[300px] p-md border border-outline-variant rounded-lg bg-surface font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all placeholder:text-outline" 
            placeholder="Paste your study notes, lecture transcripts, or textbook excerpts here..."
          />
          <div className="flex justify-between items-center mt-sm px-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">0 / 10,000 characters</span>
            <button className="font-label-sm text-label-sm text-primary hover:underline">Clear text</button>
          </div>
        </div>
      )}
    </div>
  );
}
