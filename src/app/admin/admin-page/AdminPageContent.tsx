"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  FileText,
  Headphones,
  HelpCircle,
  Home,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  UsersRound,
  Activity,
} from "lucide-react";
import type { AuthUser } from "@/services/api";
import { MonitoringPanel } from "./dashboard/components/MonitoringPanel";
import { UsersPanel } from "./user/user-crud";
import { ReportsPanel } from "./reports";
import { AuditLogsPanel } from "./audit-logs";

const sidebarItems = [
  { id: "dashboard", title: "Home", icon: Home },
  { id: "users", title: "Users", icon: UsersRound },
  { id: "content", title: "Content", icon: FileText },
  { id: "reports", title: "Reports", icon: BarChart3 },
  { id: "audit-logs", title: "Audit Logs", icon: Activity },
  { id: "settings", title: "Settings", icon: Settings },
] as const;

type AdminSection = (typeof sidebarItems)[number]["id"];

export function AdminPageContent({
  initialSection,
  onLogout,
  user,
}: {
  initialSection?: string;
  onLogout: () => void;
  user: AuthUser;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>(() =>
    getAdminSection(initialSection),
  );

  function handleSectionChange(section: AdminSection) {
    setActiveSection(section);
    const nextUrl =
      section === "dashboard" ? pathname : `${pathname}?section=${section}`;
    router.replace(nextUrl, { scroll: false });
  }

  return (
    <main className="min-h-screen bg-[#fbf9f4] text-[#1b1c19]">
      <div className="grid min-h-screen w-full lg:grid-cols-[248px_minmax(0,1fr)]">
        <AdminSidebar
          activeSection={activeSection}
          onLogout={onLogout}
          onSectionChange={handleSectionChange}
          user={user}
        />

        <section className="relative min-h-[calc(100vh-112px)] px-5 py-8 sm:px-8 lg:min-h-screen lg:px-12 lg:py-12 xl:px-16">
          <div className="mx-auto w-full max-w-[1180px]">
            <AdminPageHeader />
            {activeSection === "dashboard" ? <MonitoringPanel /> : null}
            {activeSection === "users" ? <UsersPanel /> : null}
            {activeSection === "reports" ? <ReportsPanel /> : null}
            {activeSection === "audit-logs" ? <AuditLogsPanel /> : null}
            {activeSection !== "dashboard" &&
            activeSection !== "users" &&
            activeSection !== "reports" &&
            activeSection !== "audit-logs" ? (
              <AdminComingSoonPanel section={activeSection} />
            ) : null}
          </div>

          <button
            className="fixed bottom-5 right-5 hidden h-12 items-center gap-3 rounded-2xl bg-[#1b1c19] px-5 text-sm font-bold text-white shadow-xl shadow-black/15 transition hover:-translate-y-0.5 sm:inline-flex"
            type="button"
          >
            <Headphones aria-hidden="true" className="h-5 w-5 text-[#f5d547]" />
            Talk with us
          </button>
        </section>
      </div>
    </main>
  );
}

function AdminSidebar({
  activeSection,
  onLogout,
  onSectionChange,
  user,
}: {
  activeSection: AdminSection;
  onLogout: () => void;
  onSectionChange: (section: AdminSection) => void;
  user: AuthUser;
}) {
  return (
    <aside className="flex border-b border-black/5 bg-white lg:min-h-screen lg:flex-col lg:border-b-0 lg:border-r">
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

        <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeSection;

            return (
              <button
                className={`flex h-12 min-w-fit items-center gap-3 rounded-2xl px-4 text-left text-sm font-bold transition lg:w-full ${
                  active
                    ? "bg-[#e6deff] text-[#311485]"
                    : "text-[#5f5e5e] hover:bg-[#f6f3ee] hover:text-[#1b1c19]"
                }`}
                key={item.title}
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
                  <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-[#614db7] lg:block" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto hidden border-t border-black/5 px-4 py-5 lg:block">
        <div className="mb-3 flex items-center gap-3 rounded-2xl px-3 py-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f6f3ee] text-[#5f5e5e]">
            <Search aria-hidden="true" className="h-4 w-4" />
          </span>
          <p className="truncate text-xs font-bold text-[#1b1c19]">{user.email}</p>
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

function AdminPageHeader() {
  return (
    <>
      <span className="inline-flex items-center gap-2 rounded-full border border-[#cabeff] bg-[#f6f2ff] px-4 py-2 text-xs font-bold text-[#614db7]">
        <HelpCircle aria-hidden="true" className="h-4 w-4" />
        Start here
      </span>

      <header className="mt-5">
        <h1 className="[font-family:var(--font-outfit)] text-4xl font-extrabold tracking-normal text-[#1b1c19] sm:text-5xl">
          Welcome back.
        </h1>
        <p className="mt-3 max-w-[680px] text-sm leading-6 text-[#5f5e5e] sm:text-base">
          Manage users, content, reports, and operational settings from the Admin
          Portal.
        </p>
      </header>
    </>
  );
}

function AdminComingSoonPanel({ section }: { section: AdminSection }) {
  const title = sidebarItems.find((item) => item.id === section)?.title ?? "Module";

  return (
    <section className="mt-10 rounded-[32px] border border-dashed border-[#cabeff] bg-[#f6f2ff] p-8 text-center">
      <p className="text-sm font-extrabold text-[#614db7]">{title}</p>
      <h2 className="mt-3 [font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
        Module not connected yet
      </h2>
      <p className="mx-auto mt-2 max-w-[520px] text-sm font-semibold leading-6 text-[#5f5e5e]">
        The sidebar route is ready, but this admin API has not been attached to the
        page yet.
      </p>
    </section>
  );
}

function getAdminSection(section?: string): AdminSection {
  return sidebarItems.some((item) => item.id === section)
    ? (section as AdminSection)
    : "dashboard";
}
