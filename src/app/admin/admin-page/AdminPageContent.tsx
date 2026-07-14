"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Gauge, HelpCircle } from "lucide-react";
import type { AuthUser } from "@/services/api";
import {
  AdminSidebar,
  adminSidebarItems,
  type AdminSection,
} from "@/components/admin/AdminSidebar";
import { MonitoringPanel } from "./dashboard/components/MonitoringPanel";
import { UsersPanel } from "./user/user-crud";
import { ReportsPanel } from "./reports";
import { AuditLogsPanel } from "./audit-logs";

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
      <div className="min-h-screen w-full">
        <AdminSidebar
          activeSection={activeSection}
          onLogout={onLogout}
          onSectionChange={handleSectionChange}
          user={user}
        />

        <section className="relative ml-[248px] min-h-screen px-5 py-8 sm:px-8 lg:px-12 lg:py-12 xl:px-16">
          <div className="mx-auto w-full max-w-[1180px]">
            <AdminPageHeader activeSection={activeSection} />
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

        </section>
      </div>
    </main>
  );
}

function AdminPageHeader({ activeSection }: { activeSection: AdminSection }) {
  if (activeSection === "dashboard") {
    return (
      <header>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#cabeff] bg-[#f6f2ff] px-4 py-2 text-xs font-bold text-[#614db7]">
          <Gauge aria-hidden="true" className="h-4 w-4" />
          Admin analytics
        </span>
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-[#1b1c19] sm:text-5xl">
              Platform overview
            </h1>
            <p className="mt-3 max-w-[680px] text-sm font-semibold leading-6 text-[#5f5e5e] sm:text-base">
              Track audience growth, learning quality, and study engagement across Quizzy.
            </p>
          </div>
        </div>
      </header>
    );
  }

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
          Manage users, decks, reports, and operational activity from the Admin
          Portal.
        </p>
      </header>
    </>
  );
}

function AdminComingSoonPanel({ section }: { section: AdminSection }) {
  const title =
    adminSidebarItems.find((item) => item.id === section)?.title ?? "Module";

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
  return adminSidebarItems.some((item) => item.id === section)
    ? (section as AdminSection)
    : "dashboard";
}
