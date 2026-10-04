"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Applique le mode éco sur <html> (data-eco-mode) — consommé par globals.css. */
export function applyEcoMode(ecoMode: boolean): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (ecoMode) root.setAttribute("data-eco-mode", "");
  else root.removeAttribute("data-eco-mode");
}

interface EcoState {
  ecoMode: boolean;
  setEcoMode: (ecoMode: boolean) => void;
}

export const useEcoStore = create<EcoState>()(
  persist(
    (set) => ({
      ecoMode: false,
      setEcoMode: (ecoMode) => {
        set({ ecoMode });
        applyEcoMode(ecoMode);
      },
    }),
    {
      name: "terra-nova:eco",
      partialize: (state) => ({ ecoMode: state.ecoMode }),
    },
  ),
);