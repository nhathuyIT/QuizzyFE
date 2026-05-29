import React from 'react';
import { SideNavBar } from '@/components/dashboard/SideNavBar';
import './dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-theme bg-background text-on-surface font-body-md min-h-screen antialiased flex">
      <SideNavBar />

      {/* Main Content Wrapper */}
      <div className="flex-grow flex flex-col md:ml-[260px] h-screen overflow-hidden">
        {children}
      </div>
    </div>
  );
}
