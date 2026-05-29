import React from 'react';
import Link from 'next/link';
import './dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-theme bg-background text-on-surface font-body-md min-h-screen antialiased flex">
      {/* SideNavBar Component */}
      <nav className="hidden md:flex flex-col w-[260px] h-screen fixed left-0 top-0 py-lg z-40 bg-surface-container-lowest border-r border-outline-variant">
        <div className="px-lg mb-xl flex flex-col gap-xs">
          <span className="font-headline-md text-headline-md font-bold text-primary">Creator Academy</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pro Workspace</span>
        </div>
        
        <div className="flex-grow flex flex-col gap-sm px-sm">
          {/* Active Tab: Home */}
          <Link href="/home" className="flex items-center gap-md bg-primary/10 text-primary border-l-4 border-primary px-md py-sm rounded-r-lg font-label-md text-label-md cursor-pointer transition-all duration-200">
            <span className="material-symbols-outlined filled">home</span>
            Home
          </Link>
          <Link href="#" className="flex items-center gap-md text-on-surface-variant px-md py-sm rounded-lg hover:bg-surface-container transition-all cursor-pointer duration-200 font-label-md text-label-md">
            <span className="material-symbols-outlined">library_books</span>
            My Library
          </Link>
          <Link href="#" className="flex items-center gap-md text-on-surface-variant px-md py-sm rounded-lg hover:bg-surface-container transition-all cursor-pointer duration-200 font-label-md text-label-md">
            <span className="material-symbols-outlined">smart_toy</span>
            AI Tutor
          </Link>
          <Link href="#" className="flex items-center gap-md text-on-surface-variant px-md py-sm rounded-lg hover:bg-surface-container transition-all cursor-pointer duration-200 font-label-md text-label-md">
            <span className="material-symbols-outlined">style</span>
            Flashcards
          </Link>
          <Link href="#" className="flex items-center gap-md text-on-surface-variant px-md py-sm rounded-lg hover:bg-surface-container transition-all cursor-pointer duration-200 font-label-md text-label-md">
            <span className="material-symbols-outlined">school</span>
            Classes
          </Link>
        </div>
        
        <div className="px-md mt-auto mb-lg">
          <button className="w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-sm rounded-lg hover:opacity-90 transition-opacity">
            Upgrade to Pro
          </button>
        </div>
        
        <div className="flex flex-col gap-sm px-sm border-t border-outline-variant pt-sm">
          <Link href="#" className="flex items-center gap-md text-on-surface-variant px-md py-sm rounded-lg hover:bg-surface-container transition-all cursor-pointer duration-200 font-label-md text-label-md">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
          <Link href="#" className="flex items-center gap-md text-on-surface-variant px-md py-sm rounded-lg hover:bg-surface-container transition-all cursor-pointer duration-200 font-label-md text-label-md">
            <span className="material-symbols-outlined">help</span>
            Help Center
          </Link>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-grow flex flex-col md:ml-[260px] h-screen overflow-hidden">
        {children}
      </div>
    </div>
  );
}
