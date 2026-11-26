"use client";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import React from "react";
import StoreProvider, { useAppSelector } from "./redux";
import AuthProvider from "./authProvider";
import ThemeProvider from "./themeProvider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
          !isSidebarCollapsed ? "md:pl-64" : ""
        }`}
      >
        {/* Navbar */}
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <ThemeProvider>
        <AuthProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </AuthProvider>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default DashboardWrapper;
