'use client';
import React, { useState } from 'react';

export function InputTabs() {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md custom-shadow flex-1 flex flex-col">
      {/* Input Tabs */}
      <div className="flex border-b border-outline-variant mb-md">
        <button 
          className={`flex items-center gap-xs px-md py-sm font-label-md text-label-md border-b-2 transition-colors ${activeTab === 'upload' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}`}
          onClick={() => setActiveTab('upload')}
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          Upload Document
        </button>
        <button 
          className={`flex items-center gap-xs px-md py-sm font-label-md text-label-md border-b-2 transition-colors ${activeTab === 'paste' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}`}
          onClick={() => setActiveTab('paste')}
        >
          <span className="material-symbols-outlined text-[18px]">content_paste</span>
          Paste Text
        </button>
      </div>

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
