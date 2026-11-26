"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useAppSelector } from "@/store/store";

export default function AppShell({ children }: { children: ReactNode }) {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />

      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
          !isSidebarCollapsed ? "md:pl-64" : ""
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
}
