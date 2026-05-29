import React from 'react';

export interface CourseProgressCardProps {
  category: string;
  categoryColorClass: string;
  lessons: number;
  title: string;
  description: string;
  progressPercentage: number;
  imageSrc: string;
  imageAlt: string;
}

export function CourseProgressCard({ 
  category, 
  categoryColorClass, 
  lessons, 
  title, 
  description, 
  progressPercentage, 
  imageSrc, 
  imageAlt 
}: CourseProgressCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0_4px_6px_-1px_rgb(0,0,0,0.05),0_2px_4px_-2px_rgb(0,0,0,0.05)] transition-shadow duration-300 group cursor-pointer flex flex-col">
      <div className="h-40 w-full relative overflow-hidden bg-surface-container-highest">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt={imageAlt} 
          src={imageSrc}
        />
      </div>
      <div className="p-md flex flex-col flex-1">
        <div className="flex items-center justify-between mb-sm">
          <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded ${categoryColorClass}`}>
            {category}
          </span>
          <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-xs">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>play_circle</span> 
            {lessons} Lessons
          </span>
        </div>
        <h4 className="font-headline-md text-headline-md text-on-surface mb-xs">{title}</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg flex-1">{description}</p>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-xs">
            <span className="font-label-sm text-label-sm text-on-surface">{progressPercentage}% Completed</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
