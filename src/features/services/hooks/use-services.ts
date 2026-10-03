"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchServices,
  fetchServiceStatus,
} from "@/services/services/services-service";
import { useEcoStore } from "@/stores/eco-store";

/** F38 — services publics ; passe le mode light de l'API quand l'éco est actif (F62). */
export function useServices() {
  const ecoMode = useEcoStore((s) => s.ecoMode);

  return useQuery({
    queryKey: ["services", ecoMode ? "light" : "full"],
    queryFn: () => fetchServices(ecoMode),
    staleTime: 5 * 60 * 1000,
  });
}

/** F38 — vue d'ensemble de l'état des services. */
export function useServiceStatus() {
  return useQuery({
    queryKey: ["services-status"],
    queryFn: fetchServiceStatus,
    staleTime: 60_000,
  });
}