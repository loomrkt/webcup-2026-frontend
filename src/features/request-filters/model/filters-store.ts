"use client";

import { create } from "zustand";
import type { RequestPriority, RequestStatus } from "@/entities/request";

export type StatusFilterValue = "" | RequestStatus;
export type PriorityFilterValue = "" | RequestPriority;

export const DEFAULT_LIMIT = 20;

interface RequestFiltersState {
  status: StatusFilterValue;
  priority: PriorityFilterValue;
  page: number;
  limit: number;
  setStatus: (status: StatusFilterValue) => void;
  setPriority: (priority: PriorityFilterValue) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

export const useRequestFiltersStore = create<RequestFiltersState>((set) => ({
  status: "",
  priority: "",
  page: 1,
  limit: DEFAULT_LIMIT,
  setStatus: (status) => set({ status, page: 1 }),
  setPriority: (priority) => set({ priority, page: 1 }),
  setPage: (page) => set({ page }),
  reset: () => set({ status: "", priority: "", page: 1 }),
}));