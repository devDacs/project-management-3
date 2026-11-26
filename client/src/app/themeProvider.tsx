"use client";

import React, { useEffect } from "react";
import { useAppSelector } from "./redux";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return children;
};

export default ThemeProvider;
