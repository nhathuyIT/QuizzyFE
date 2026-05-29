import React from 'react';

export interface ClassCardProps {
  status: 'In Progress' | 'Scheduled' | 'Joined';
  title: string;
  instructor: string;
  members: number;
  nextSession: string;
}

export function ClassCard({ status, title, instructor, members, nextSession }: ClassCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-md hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.05),_0_2px_4px_-2px_rgb(0_0_0_/_0.05)] transition-all duration-200 group">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-xs">
          <span 
            className={`font-label-sm text-label-sm px-sm py-xs rounded-full w-max ${
              status === 'In Progress' ? 'bg-primary/10 text-primary' :
              status === 'Scheduled' ? 'bg-surface-variant text-on-surface-variant' :
              'bg-secondary-container/20 text-secondary'
            }`}
          >
            {status}
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors mt-xs">{title}</h3>
        </div>
        <button className="text-on-surface-variant hover:text-primary transition-colors p-xs">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
      
      <div className="flex flex-col gap-sm border-y border-outline-variant/30 py-sm my-xs">
        <div className="flex items-center gap-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">person</span>
          <span className="font-body-sm text-body-sm">{instructor}</span>
        </div>
        <div className="flex items-center gap-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">group</span>
          <span className="font-body-sm text-body-sm">{members} Members</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-xs">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Next Session</span>
          <span className="font-body-sm text-body-sm text-on-surface">{nextSession}</span>
        </div>
        <button 
          className={`font-label-sm text-label-sm px-md py-xs rounded-lg transition-colors border ${
            status === 'In Progress' ? 'border-primary text-primary hover:bg-primary/5' :
            'border-outline-variant text-on-surface hover:bg-surface-container-low'
          }`}
        >
          {status === 'In Progress' ? 'Manage' : status === 'Scheduled' ? 'View Details' : 'Enter Room'}
        </button>
      </div>
    </div>
  );
}
