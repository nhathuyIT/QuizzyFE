import React from 'react';
import { TopNavBar } from '@/components/dashboard/TopNavBar';
import { ClassCard, ClassCardProps } from '@/features/classes/components/ClassCard';

const CLASSES_DATA: ClassCardProps[] = [
  {
    status: 'In Progress',
    title: 'Advanced UI Design',
    instructor: 'Elena Rodriguez',
    members: 24,
    nextSession: 'Today, 2:00 PM',
  },
  {
    status: 'Scheduled',
    title: 'React Fundamentals',
    instructor: 'Marcus Chen',
    members: 18,
    nextSession: 'Oct 24, 10:00 AM',
  },
  {
    status: 'Joined',
    title: 'Data Structures 101',
    instructor: 'Dr. Sarah Jenkins',
    members: 42,
    nextSession: 'Oct 26, 1:00 PM',
  },
];

export default function ClassesPage() {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto custom-scrollbar">
      {/* TopNavBar */}
      <TopNavBar searchPlaceholder="Search classes, members..." />
      
      {/* Main Canvas */}
      <main className="flex-1 w-full max-w-max_content_width mx-auto p-md md:p-lg flex flex-col gap-lg">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-sm">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Classes Management</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Overview of your joined and managed study groups.</p>
          </div>
          <button className="bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded-lg flex items-center justify-center gap-sm hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap w-full md:w-auto">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create New Class
          </button>
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {CLASSES_DATA.map((cls, idx) => (
            <ClassCard key={idx} {...cls} />
          ))}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-md px-lg flex flex-col md:flex-row justify-between items-center max-w-max_content_width mx-auto bg-surface-container-low border-t border-outline-variant mt-auto">
        <div className="font-headline-md text-headline-md text-primary mb-sm md:mb-0 hidden md:block">Creator Academy</div>
        <p className="font-label-sm text-label-sm text-on-surface-variant">© 2024 Creator Academy. All rights reserved.</p>
        <div className="flex gap-md mt-sm md:mt-0">
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Support</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
