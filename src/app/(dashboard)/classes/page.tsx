import React from 'react';
import { TopNavBar } from '@/components/dashboard/TopNavBar';

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
          
          {/* Class Card 1: In Progress */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-md hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.05),_0_2px_4px_-2px_rgb(0_0_0_/_0.05)] transition-all duration-200 group">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-xs">
                <span className="bg-primary/10 text-primary font-label-sm text-label-sm px-sm py-xs rounded-full w-max">In Progress</span>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors mt-xs">Advanced UI Design</h3>
              </div>
              <button className="text-on-surface-variant hover:text-primary transition-colors p-xs">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            <div className="flex flex-col gap-sm border-y border-outline-variant/30 py-sm my-xs">
              <div className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span className="font-body-sm text-body-sm">Elena Rodriguez</span>
              </div>
              <div className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span className="font-body-sm text-body-sm">24 Members</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-xs">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Next Session</span>
                <span className="font-body-sm text-body-sm text-on-surface">Today, 2:00 PM</span>
              </div>
              <button className="border border-primary text-primary font-label-sm text-label-sm px-md py-xs rounded-lg hover:bg-primary/5 transition-colors">
                Manage
              </button>
            </div>
          </div>
          
          {/* Class Card 2: Scheduled */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-md hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.05),_0_2px_4px_-2px_rgb(0_0_0_/_0.05)] transition-all duration-200 group">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-xs">
                <span className="bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-sm py-xs rounded-full w-max">Scheduled</span>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors mt-xs">React Fundamentals</h3>
              </div>
              <button className="text-on-surface-variant hover:text-primary transition-colors p-xs">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            <div className="flex flex-col gap-sm border-y border-outline-variant/30 py-sm my-xs">
              <div className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span className="font-body-sm text-body-sm">Marcus Chen</span>
              </div>
              <div className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span className="font-body-sm text-body-sm">18 Members</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-xs">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Next Session</span>
                <span className="font-body-sm text-body-sm text-on-surface">Oct 24, 10:00 AM</span>
              </div>
              <button className="border border-outline-variant text-on-surface font-label-sm text-label-sm px-md py-xs rounded-lg hover:bg-surface-container-low transition-colors">
                View Details
              </button>
            </div>
          </div>
          
          {/* Class Card 3: Joined */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-md hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.05),_0_2px_4px_-2px_rgb(0_0_0_/_0.05)] transition-all duration-200 group">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-xs">
                <span className="bg-secondary-container/20 text-secondary font-label-sm text-label-sm px-sm py-xs rounded-full w-max">Joined</span>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors mt-xs">Data Structures 101</h3>
              </div>
              <button className="text-on-surface-variant hover:text-primary transition-colors p-xs">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            <div className="flex flex-col gap-sm border-y border-outline-variant/30 py-sm my-xs">
              <div className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span className="font-body-sm text-body-sm">Dr. Sarah Jenkins</span>
              </div>
              <div className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span className="font-body-sm text-body-sm">42 Members</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-xs">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Next Session</span>
                <span className="font-body-sm text-body-sm text-on-surface">Oct 26, 1:00 PM</span>
              </div>
              <button className="border border-outline-variant text-on-surface font-label-sm text-label-sm px-md py-xs rounded-lg hover:bg-surface-container-low transition-colors">
                Enter Room
              </button>
            </div>
          </div>
          
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
