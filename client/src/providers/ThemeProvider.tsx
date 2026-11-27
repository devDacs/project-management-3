"use client";

import { useEffect, type ReactNode } from "react";
import { useAppSelector } from "@/store/store";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return children;
};

export default ThemeProvider;
