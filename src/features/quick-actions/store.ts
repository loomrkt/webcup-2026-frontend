"use client";

import { create } from "zustand";

export type QuickAction = "report" | "contact" | null;

interface QuickActionsState {
  action: QuickAction;
  open: (action: Exclude<QuickAction, null>) => void;
  close: () => void;
}

/** Ouvre les modales globales (Signaler un problème, Contact) depuis n'importe où. */
export const useQuickActions = create<QuickActionsState>((set) => ({
  action: null,
  open: (action) => set({ action }),
  close: () => set({ action: null }),
}));