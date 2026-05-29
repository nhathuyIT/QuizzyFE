import React from 'react';
import { ChatSidebar } from '@/features/ai-tutor/components/ChatSidebar';
import { ChatMessage } from '@/features/ai-tutor/components/ChatMessage';
import { ChatInput } from '@/features/ai-tutor/components/ChatInput';

export default function AITutorPage() {
  return (
    <div className="flex-1 flex overflow-hidden w-full">
      <ChatSidebar />
      
      <section className="flex-1 h-full flex flex-col bg-surface-bright relative min-w-0">
        <header className="h-16 border-b border-outline-variant flex items-center justify-between px-lg bg-surface-container-lowest shrink-0 z-10 shadow-sm shadow-surface-container-low/50">
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
            </div>
            <div>
              <h2 className="font-headline-md text-[20px] font-bold text-on-surface leading-none">Quantum Physics</h2>
              <div className="flex items-center gap-sm mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <p className="font-label-sm text-label-sm text-on-surface-variant">AI Tutor Active</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-sm">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">ios_share</span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-lg flex flex-col gap-xl">
          <div className="text-center my-md">
            <span className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm px-md py-sm rounded-full border border-outline-variant/50">Today, 2:45 PM</span>
          </div>
          
          <ChatMessage 
            type="user" 
            content="Can you explain the double-slit experiment in simple terms? I'm having trouble visualizing how observation changes the outcome." 
          />
          
          <ChatMessage 
            type="bot" 
            content={
              <>
                <p>It's one of the most mind-bending concepts in physics! Let's break it down using a macroscopic analogy.</p>
                <div className="bg-surface-container-low rounded-xl p-md border border-outline-variant/50 border-l-4 border-l-secondary">
                  <p className="font-semibold mb-sm text-secondary font-label-md text-label-md">The Classic Analogy</p>
                  <p className="text-on-surface-variant text-body-sm font-body-sm">Imagine throwing tennis balls at a wall that has two vertical slits cut into it. Behind that wall is a second wall acting as a screen. If you throw balls randomly, they will only pass through the slits and form two corresponding bands on the back screen. This represents how classical particles behave.</p>
                </div>
                <p>Now, imagine doing the same with water waves. The waves pass through both slits, interfering with each other, and create an interference pattern on the back screen (multiple bands of varying intensity). This is how waves behave.</p>
                <p>The bizarre part? When we fire single electrons (particles) through the slits, they build up an interference pattern over time, suggesting they act like waves passing through both slits simultaneously.</p>
              </>
            }
          />
          
          <ChatMessage 
            type="user" 
            content="Wait, so if we watch them go through, they act like particles?" 
          />
          
          <ChatMessage type="typing" />
        </div>
        
        <ChatInput />
      </section>
    </div>
  );
}
