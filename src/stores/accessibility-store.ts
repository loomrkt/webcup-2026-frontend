"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_PREFERENCES,
  type AccessibilityPreferences,
} from "@/interfaces/accessibility";

const BOOLEAN_KEYS: (keyof AccessibilityPreferences)[] = [
  "highContrast",
  "reducedMotion",
  "readableFont",
  "plainLanguage",
];

const ENUM_DEFAULTS: Partial<Record<keyof AccessibilityPreferences, string>> = {
  textSize: "normal",
  lineSpacing: "normal",
  colorScheme: "default",
  colorBlind: "none",
};

/**
 * Applique les préférences sur <html> via des data-attributes dédiés
 * (data-a11y-*) consommés par globals.css, et bascule la classe `.dark`.
 */
export function applyPreferences(preferences: AccessibilityPreferences): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  for (const key of Object.keys(DEFAULT_PREFERENCES) as (keyof AccessibilityPreferences)[]) {
    root.removeAttribute(`data-a11y-${key}`);
  }

  for (const key of BOOLEAN_KEYS) {
    if (preferences[key]) root.setAttribute(`data-a11y-${key}`, "");
  }

  for (const key of Object.keys(ENUM_DEFAULTS) as (keyof AccessibilityPreferences)[]) {
    const value = preferences[key] as string;
    const defaultValue = ENUM_DEFAULTS[key];
    if (defaultValue && value !== defaultValue) {
      root.setAttribute(`data-a11y-${key}`, value);
    }
  }

  root.classList.toggle("dark", preferences.colorScheme === "dark");
}

interface AccessibilityState {
  preferences: AccessibilityPreferences;
  /** true une fois les préférences serveur reçues (GET /auth/me). */
  hydrated: boolean;
  setPreference: <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K],
  ) => void;
  setPreferences: (preferences: AccessibilityPreferences) => void;
  hydrateFromServer: (prefs: Partial<AccessibilityPreferences>) => void;
  reset: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      preferences: DEFAULT_PREFERENCES,
      hydrated: false,

      setPreference: (key, value) => {
        const preferences = { ...get().preferences, [key]: value };
        set({ preferences });
        applyPreferences(preferences);
      },

      setPreferences: (preferences) => {
        set({ preferences });
        applyPreferences(preferences);
      },

      hydrateFromServer: (prefs) => {
        const preferences = {
          ...DEFAULT_PREFERENCES,
          ...get().preferences,
          ...prefs,
        };
        set({ preferences, hydrated: true });
        applyPreferences(preferences);
      },

      reset: () => {
        const preferences = { ...DEFAULT_PREFERENCES };
        set({ preferences });
        applyPreferences(preferences);
      },
    }),
    {
      name: "terra-nova:accessibility",
      partialize: (state) => ({ preferences: state.preferences }),
    },
  ),
);