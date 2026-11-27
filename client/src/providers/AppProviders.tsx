"use client";

import type { ReactNode } from "react";
import AuthProvider from "@/providers/AuthProvider";
import StoreProvider from "@/providers/StoreProvider";
import ThemeProvider from "@/providers/ThemeProvider";

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <StoreProvider>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default AppProviders;
