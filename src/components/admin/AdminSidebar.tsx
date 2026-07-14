"use client";

import {
  Activity,
  BarChart3,
  FileCheck2,
  GraduationCap,
  Home,
  Layers3,
  LogOut,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { AuthUser } from "@/services/api";

export const adminSidebarItems = [
  { id: "dashboard", title: "Home", icon: Home },
  { id: "users", title: "Users", icon: UsersRound },
  { id: "decks", title: "Decks", icon: Layers3 },
  { id: "academic", title: "Academic", icon: GraduationCap },
  { id: "document-review", title: "Document Review", icon: FileCheck2 },
  { id: "reports", title: "Reports", icon: BarChart3 },
  { id: "audit-logs", title: "Audit Logs", icon: Activity },
] as const;

export type AdminSection = (typeof adminSidebarItems)[number]["id"];

type AdminSidebarProps = {
  activeSection: AdminSection;
  onLogout: () => void;
  onSectionChange: (section: AdminSection) => void;
  user: AuthUser;
};

export function AdminSidebar({
  activeSection,
  onLogout,
  onSectionChange,
  user,
}: AdminSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-[248px] flex-col overflow-y-auto border-r border-black/5 bg-white">
      <div className="flex w-full flex-col px-4 py-5">
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1b1c19] text-white">
            <ShieldCheck aria-hidden="true" className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-extrabold leading-tight text-[#1b1c19]">
              Admin Portal
            </p>
            <p className="text-[11px] font-semibold text-[#8a8784]">
              Admin Page
            </p>
          </div>
        </div>

        <nav
          aria-label="Admin navigation"
          className="flex flex-col gap-2"
        >
          {adminSidebarItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeSection;

            return (
              <button
                aria-current={active ? "page" : undefined}
                className={`flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-sm font-bold transition ${
                  active
                    ? "bg-[#e6deff] text-[#311485]"
                    : "text-[#5f5e5e] hover:bg-[#f6f3ee] hover:text-[#1b1c19]"
                }`}
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                type="button"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    active ? "bg-[#d8ccff]" : "bg-[#f6f3ee]"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <span>{item.title}</span>
                {active ? (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#614db7]" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-black/5 px-4 py-5">
        <div className="mb-3 flex items-center gap-3 rounded-2xl px-3 py-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f6f3ee] text-[#5f5e5e]">
            <Search aria-hidden="true" className="h-4 w-4" />
          </span>
          <p className="truncate text-xs font-bold text-[#1b1c19]">
            {user.email}
          </p>
        </div>
        <button
          className="flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-[#5f5e5e] transition hover:bg-[#f6f3ee] hover:text-[#1b1c19]"
          onClick={onLogout}
          type="button"
        >
          <LogOut aria-hidden="true" className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
