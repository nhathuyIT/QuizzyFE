"use client";

import { useState, type ReactNode } from "react";
import { SideNavBar } from "./SideNavBar";
import { TopNavBar } from "./TopNavBar";
import { AuthGuard } from "@/components/auth/AuthGuard";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="dashboard-theme min-h-screen bg-[#fbf9f4] text-[#1b1c19]">
        <SideNavBar
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />

        <div className="min-h-screen md:pl-[272px]">
          <TopNavBar onMenuClick={() => setIsMenuOpen(true)} />
          <main className="h-screen overflow-hidden pt-[76px]">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
