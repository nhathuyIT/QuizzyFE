'use client';
import React, { useState } from 'react';

export default function FlashcardsPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');

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
          </div>

          {/* Right Column: Settings & Action */}
          <div className="lg:col-span-5 flex flex-col gap-lg">
            
            {/* Settings Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md custom-shadow">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">tune</span>
                Generation Settings
              </h3>
              <div className="flex flex-col gap-md">
                
                {/* Difficulty */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-sm">
                    <button className="py-sm border border-outline-variant rounded-lg font-label-sm text-label-sm text-on-surface hover:bg-surface-container transition-colors">Beginner</button>
                    <button className="py-sm border-2 border-primary bg-primary/5 rounded-lg font-label-sm text-label-sm text-primary font-semibold">Intermediate</button>
                    <button className="py-sm border border-outline-variant rounded-lg font-label-sm text-label-sm text-on-surface hover:bg-surface-container transition-colors">Advanced</button>
                  </div>
                </div>

                {/* Card Type */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs">Card Style</label>
                  <select className="w-full p-sm border border-outline-variant rounded-lg bg-surface font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary">
                    <option>Q&A (Standard)</option>
                    <option>Fill in the Blank</option>
                    <option>Vocabulary (Term/Definition)</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <div className="flex justify-between items-center mb-xs">
                    <label className="block font-label-md text-label-md text-on-surface">Target Amount</label>
                    <span className="font-label-sm text-label-sm text-primary bg-primary/10 px-xs py-base rounded">~20 Cards</span>
                  </div>
                  <input className="w-full accent-primary" max="50" min="5" type="range" defaultValue="20" />
                </div>
              </div>
            </div>

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
