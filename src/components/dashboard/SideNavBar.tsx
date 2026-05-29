'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MAIN_LINKS = [
  { href: '/home', icon: 'home', label: 'Home' },
  { href: '/my-library', icon: 'library_books', label: 'My Library' },
  { href: '/ai-tutor', icon: 'smart_toy', label: 'AI Tutor' },
  { href: '/flashcards', icon: 'style', label: 'Flashcards' },
  { href: '/classes', icon: 'school', label: 'Classes' },
];

const FOOTER_LINKS = [
  { href: '#', icon: 'settings', label: 'Settings' },
  { href: '#', icon: 'help', label: 'Help Center' },
];

export function SideNavBar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-col w-[260px] h-screen fixed left-0 top-0 py-lg z-40 bg-surface-container-lowest border-r border-outline-variant overflow-y-auto custom-scrollbar">
      <div className="px-lg mb-xl flex flex-col gap-xs mt-sm">
        <span className="font-headline-md text-headline-md font-bold text-primary">Creator Academy</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pro Workspace</span>
      </div>
      
      <div className="flex-grow flex flex-col gap-sm px-sm">
        {MAIN_LINKS.map((link) => {
          const isActive = pathname.startsWith(link.href);
          
          if (isActive) {
            return (
              <Link key={link.href} href={link.href} className="flex items-center gap-md bg-primary/10 text-primary border-l-4 border-primary px-md py-sm rounded-r-lg font-label-md text-label-md cursor-pointer transition-all duration-200">
                <span className="material-symbols-outlined fill-icon">{link.icon}</span>
                {link.label}
              </Link>
            );
          }
          
          return (
            <Link key={link.href} href={link.href} className="flex items-center gap-md text-on-surface-variant px-md py-sm rounded-lg hover:bg-surface-container transition-all cursor-pointer duration-200 font-label-md text-label-md">
              <span className="material-symbols-outlined">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </div>
      
      <div className="px-md mt-auto mb-lg">
        <button className="w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-sm rounded-lg hover:opacity-90 transition-opacity">
          Upgrade to Pro
        </button>
      </div>
      
      <div className="flex flex-col gap-sm px-sm border-t border-outline-variant pt-sm mb-lg">
        {FOOTER_LINKS.map((link) => (
          <Link key={link.label} href={link.href} className="flex items-center gap-md text-on-surface-variant px-md py-sm rounded-lg hover:bg-surface-container transition-all cursor-pointer duration-200 font-label-md text-label-md">
            <span className="material-symbols-outlined">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
