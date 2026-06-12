import React from 'react';

export function HeroSection() {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl flex flex-col md:flex-row justify-between items-center gap-lg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-container/10 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>
      
      <div className="flex flex-col gap-sm z-10 w-full md:w-1/2">
        <h1 className="font-headline-lg md:font-headline-lg text-headline-lg md:text-headline-lg text-on-surface">Welcome back, Alex.</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">You&apos;re on track to hit your weekly learning goal. Keep up the momentum!</p>
        <div className="mt-sm">
          <button className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:opacity-90 transition-opacity">
            View Study Plan
          </button>
        </div>
      </div>
      
      <div className="z-10 w-full md:w-auto flex items-center gap-md bg-surface border border-outline-variant rounded-lg p-md">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path 
              className="text-surface-container-high" 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3"
            />
            <path 
              className="text-primary" 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              fill="none" 
              stroke="currentColor" 
              strokeDasharray="75, 100" 
              strokeLinecap="round" 
              strokeWidth="3"
            />
          </svg>
          <span className="absolute font-label-md text-label-md text-on-surface">75%</span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-md text-label-md text-on-surface">Weekly Goal</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">15 / 20 hours completed</span>
        </div>
      </div>
    </section>
  );
}
