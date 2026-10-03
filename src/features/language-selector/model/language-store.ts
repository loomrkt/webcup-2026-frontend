"use client";

import { create } from "zustand";
import { DEFAULT_LOCALE } from "./language-meta";

interface LanguageState {
  locale: string;
  uiStrings: Record<string, string>;
  setLocale: (locale: string) => void;
  setUiStrings: (strings: Record<string, string>) => void;
  /** Traduit une clé UI ; repli sur la valeur de secours puis sur la clé. */
  t: (key: string, fallback?: string) => string;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  locale: DEFAULT_LOCALE,
  uiStrings: {},
  setLocale: (locale) => set({ locale }),
  setUiStrings: (uiStrings) => set({ uiStrings }),
  t: (key, fallback) => get().uiStrings[key] ?? fallback ?? key,
}));