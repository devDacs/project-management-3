"use client";

import type { ReactNode } from "react";
import AuthProvider from "@/providers/auth-provider";
import StoreProvider from "@/providers/store-provider";
import ThemeProvider from "@/providers/theme-provider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}
