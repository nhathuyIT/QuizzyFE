import React from 'react';

export default function AITutorPage() {
  return (
    <div className="flex-1 flex overflow-hidden w-full">
      <aside className="w-80 h-full border-r border-outline-variant bg-surface-container-lowest flex-col hidden lg:flex shrink-0">
        <div className="h-16 px-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest sticky top-0 z-10">
          <span className="font-headline-md text-[18px] font-bold text-on-surface">Chat History</span>
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">edit_square</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-md flex flex-col gap-lg">
          <div className="flex flex-col gap-xs">
            <div className="font-label-sm text-label-sm text-on-surface-variant px-sm mb-xs uppercase tracking-wider">Today</div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-md cursor-pointer transition-colors relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"></div>
              <div className="font-label-md text-label-md text-on-surface truncate font-semibold mb-1">Quantum Physics</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Explain the double-slit experiment...</div>
            </div>
            <div className="hover:bg-surface-container rounded-lg p-md cursor-pointer transition-colors border border-transparent">
              <div className="font-label-md text-label-md text-on-surface truncate mb-1">Advanced React Patterns</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant truncate">How does useMemo work under the hood?</div>
            </div>
          </div>
          <div className="flex flex-col gap-xs">
            <div className="font-label-sm text-label-sm text-on-surface-variant px-sm mb-xs uppercase tracking-wider">Previous 7 Days</div>
            <div className="hover:bg-surface-container rounded-lg p-md cursor-pointer transition-colors border border-transparent">
              <div className="font-label-md text-label-md text-on-surface truncate mb-1">Color Theory UI</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Suggest a palette for a fintech app...</div>
            </div>
            <div className="hover:bg-surface-container rounded-lg p-md cursor-pointer transition-colors border border-transparent">
              <div className="font-label-md text-label-md text-on-surface truncate mb-1">SEO Optimization Basics</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant truncate">What are the core web vitals?</div>
            </div>
            <div className="hover:bg-surface-container rounded-lg p-md cursor-pointer transition-colors border border-transparent">
              <div className="font-label-md text-label-md text-on-surface truncate mb-1">Creative Writing Prompts</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Give me 3 sci-fi story starters.</div>
            </div>
          </div>
        </div>
      </aside>
      
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
          
          <div className="flex justify-end pl-12 md:pl-24">
            <div className="bg-primary text-on-primary rounded-2xl rounded-tr-sm p-md font-body-md text-body-md shadow-sm max-w-2xl relative group">
              Can you explain the double-slit experiment in simple terms? I'm having trouble visualizing how observation changes the outcome.
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-outline hover:text-primary"><span className="material-symbols-outlined text-[20px]">content_copy</span></button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-start gap-md pr-12 md:pr-24">
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary border border-outline-variant shrink-0 mt-1 shadow-sm">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl rounded-tl-sm p-lg text-on-surface font-body-md text-body-md shadow-sm max-w-3xl flex flex-col gap-md">
              <p>It's one of the most mind-bending concepts in physics! Let's break it down using a macroscopic analogy.</p>
              <div className="bg-surface-container-low rounded-xl p-md border border-outline-variant/50 border-l-4 border-l-secondary">
                <p className="font-semibold mb-sm text-secondary font-label-md text-label-md">The Classic Analogy</p>
                <p className="text-on-surface-variant text-body-sm font-body-sm">Imagine throwing tennis balls at a wall that has two vertical slits cut into it. Behind that wall is a second wall acting as a screen. If you throw balls randomly, they will only pass through the slits and form two corresponding bands on the back screen. This represents how classical particles behave.</p>
              </div>
              <p>Now, imagine doing the same with water waves. The waves pass through both slits, interfering with each other, and create an interference pattern on the back screen (multiple bands of varying intensity). This is how waves behave.</p>
              <p>The bizarre part? When we fire single electrons (particles) through the slits, they build up an interference pattern over time, suggesting they act like waves passing through both slits simultaneously.</p>
              
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
          
          <div className="flex justify-end pl-12 md:pl-24">
            <div className="bg-primary text-on-primary rounded-2xl rounded-tr-sm p-md font-body-md text-body-md shadow-sm max-w-2xl">
              Wait, so if we watch them go through, they act like particles?
            </div>
          </div>
          
          {/* Typing Indicator */}
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
        </div>
        
        <div className="p-md md:p-lg bg-surface-bright border-t border-outline-variant shrink-0 relative z-20">
          <div className="max-w-4xl mx-auto flex flex-col gap-sm relative">
            <div className="absolute -top-12 left-0 flex gap-sm">
              <button className="bg-surface-container-lowest border border-outline-variant rounded-full px-md py-sm font-label-sm text-label-sm text-on-surface-variant hover:border-primary hover:text-primary transition-all shadow-sm">
                Explain further
              </button>
              <button className="bg-surface-container-lowest border border-outline-variant rounded-full px-md py-sm font-label-sm text-label-sm text-on-surface-variant hover:border-primary hover:text-primary transition-all shadow-sm">
                Provide math formulas
              </button>
            </div>
            <div className="flex items-end gap-sm bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-sm relative">
              <button className="p-sm text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-colors shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined">add_circle</span>
              </button>
              <textarea 
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-sm font-body-md text-body-md text-on-surface placeholder:text-outline-variant custom-scrollbar" 
                placeholder="Ask follow-up questions..." 
                rows={1}
              />
              <button className="h-11 w-11 bg-primary text-on-primary rounded-lg hover:bg-on-primary-fixed-variant transition-colors shrink-0 flex items-center justify-center shadow-sm self-end">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
              </button>
            </div>
            <div className="text-center font-label-sm text-label-sm text-outline px-lg">
              AI Tutor is an educational tool. Always verify complex physical concepts with academic sources.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
