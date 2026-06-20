"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  BrainCircuit,
  History,
  FolderPlus,
  Home,
  Library,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";

const mainLinks = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/my-library", icon: Library, label: "My decks" },
  { href: "/flashcards", icon: BookOpenText, label: "Create cards" },
  { href: "/study-history", icon: History, label: "Study history" },
  { href: "/ai-tutor", icon: Sparkles, label: "AI Tutor" },
  { href: "/classes", icon: UsersRound, label: "Study groups" },
];

interface SideNavBarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SideNavBar({ isOpen = false, onClose }: SideNavBarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-[#1b1c19]/25 backdrop-blur-sm md:hidden"
          onClick={onClose}
          type="button"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-black/5 bg-white px-4 py-5 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <Link className="flex items-center gap-3" href="/home" onClick={onClose}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1b1c19] text-white">
              <BrainCircuit aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="[font-family:var(--font-outfit)] text-xl font-extrabold tracking-[-0.02em]">
                Quizzy AI
              </p>
              <p className="text-xs font-semibold text-[#777474]">Study workspace</p>
            </div>
          </Link>

          <button
            aria-label="Close navigation"
            className="rounded-full p-2 text-[#777474] hover:bg-[#f3f0eb] md:hidden"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1.5">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-[#e6deff] text-[#311485]"
                    : "text-[#5f5e5e] hover:bg-[#f6f3ee] hover:text-[#1b1c19]"
                }`}
                href={link.href}
                key={link.href}
                onClick={onClose}
              >
                <Icon aria-hidden="true" className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="my-6 h-px bg-black/5" />

        <p className="px-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9a9692]">
          Your workspace
        </p>
        <Link
          className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-[#9b87f5]/50 bg-[#f8f5ff] px-4 py-3 text-sm font-bold text-[#614db7] transition hover:border-[#614db7] hover:bg-[#efe9ff]"
          href="/my-library"
          onClick={onClose}
        >
          <FolderPlus aria-hidden="true" className="h-5 w-5" />
          Create a new deck
        </Link>

      </aside>
    </>
  );
}
