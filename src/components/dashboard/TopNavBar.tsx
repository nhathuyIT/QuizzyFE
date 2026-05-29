import React from 'react';

interface TopNavBarProps {
  searchPlaceholder?: string;
}

export function TopNavBar({ searchPlaceholder = "Search courses, resources..." }: TopNavBarProps) {
  return (
    <header className="flex justify-between items-center px-lg py-sm w-full sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant">
      <div className="flex-1 flex items-center">
        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">search</span>
          <input 
            className="w-full bg-surface-container-low border border-outline-variant rounded-full py-xs pl-xl pr-md text-body-sm font-body-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant" 
            placeholder={searchPlaceholder} 
            type="text" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-md">
        <button className="text-on-surface-variant hover:bg-surface-container-low p-sm rounded-full transition-colors cursor-pointer active:scale-95 duration-200 flex items-center justify-center">
          <span className="material-symbols-outlined">local_fire_department</span>
        </button>
        <button className="text-on-surface-variant hover:bg-surface-container-low p-sm rounded-full transition-colors cursor-pointer active:scale-95 duration-200 flex items-center justify-center relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
          <img 
            alt="User profile avatar" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpQwU_agneRvLq_aRQOysrZ-jA_1SLPcPmVgZn5HlCmstD64IhPuKYelzccuTuYWwid8YAZE0sdsTEWPlNu-PIAzzZBIWnVilAsk-TbXPk2-j5NmBJ_RCraLm5VN5TaqYTwnAiMA-CfBwvF8AaVPoehfILFO_JxdrtZxg_iMdtIjGtttTx1WtpRZGTSkjA19ZZEQ-mn9HbqavdzVR2n_KH6zVY4aLDY4va_-u3uILhwxpRcEULx7lyLDbBdek3rbHLZcTKF9eRB04"
          />
        </div>
      </div>
    </header>
  );
}
