"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, fetchNovaTerraData } from "./dashboard-api";

export const dashboardQueryKeys = {
  stats: ["dashboard", "stats"] as const,
  novaTerra: ["dashboard", "nova-terra"] as const,
};

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: dashboardQueryKeys.stats,
    queryFn: fetchDashboardStats,
  });
}

export function useNovaTerraQuery() {
  return useQuery({
    queryKey: dashboardQueryKeys.novaTerra,
    queryFn: fetchNovaTerraData,
  });
}