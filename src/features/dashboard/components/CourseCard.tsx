import React from 'react';

export interface CourseCardProps {
  category: string;
  categoryColorClass: string;
  title: string;
  description: string;
  duration: string;
  imageSrc: string;
}

export function CourseCard({ category, categoryColorClass, title, description, duration, imageSrc }: CourseCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col hover:shadow-[0_4px_6px_-1px_rgb(0,0,0,0.05),0_2px_4px_-2px_rgb(0,0,0,0.05)] transition-shadow">
      <div className="h-32 bg-surface-container relative">
        <img 
          alt={title} 
          className="w-full h-full object-cover" 
          src={imageSrc}
        />
      </div>
      <div className="p-md flex flex-col flex-grow">
        <span className={`font-label-sm text-label-sm mb-xs ${categoryColorClass}`}>{category}</span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs font-semibold">{title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-md flex-grow">{description}</p>
        <div className="flex items-center justify-between mt-auto pt-sm border-t border-outline-variant">
          <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px]">schedule</span> {duration}
          </div>
          <button className="text-primary hover:bg-primary/10 p-xs rounded transition-colors">
            <span className="material-symbols-outlined">bookmark_add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
