"use client";

import { create } from "zustand";

export const AUDIT_ACTIONS = [
  "create",
  "update",
  "delete",
  "restore",
  "cancel",
] as const;

interface AuditFiltersState {
  q: string;
  entityType: string;
  action: string;
  from: string;
  to: string;
  page: number;
  limit: number;
  setFilter: (filter: Partial<Pick<AuditFiltersState, "q" | "entityType" | "action" | "from" | "to">>) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

export const useAuditFiltersStore = create<AuditFiltersState>((set) => ({
  q: "",
  entityType: "",
  action: "",
  from: "",
  to: "",
  page: 1,
  limit: 50,
  setFilter: (filter) => set({ ...filter, page: 1 }),
  setPage: (page) => set({ page }),
  reset: () =>
    set({ q: "", entityType: "", action: "", from: "", to: "", page: 1 }),
}));