import React from 'react';

export function SettingsPanel() {
  return (
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
  );
}
