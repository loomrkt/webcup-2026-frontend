"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchConsultation,
  fetchConsultationResults,
  fetchConsultations,
  respondConsultation,
} from "@/services/civic/consultations-service";
import type { RespondInput } from "@/services/civic/consultation-types";
import { useEcoStore } from "@/stores/eco-store";

export const consultationKey = (id: string) => ["consultation", id];
export const resultsKey = (id: string) => ["consultation-results", id];

/** F65 — consultations ouvertes (mode light en éco). */
export function useConsultations() {
  const ecoMode = useEcoStore((s) => s.ecoMode);

  return useQuery({
    queryKey: ["consultations", ecoMode ? "light" : "full"],
    queryFn: () => fetchConsultations(ecoMode),
    staleTime: 60_000,
  });
}

export function useConsultation(id: string) {
  return useQuery({
    queryKey: consultationKey(id),
    queryFn: () => fetchConsultation(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

/** F65 — résultats publics (403 si non publics). */
export function useResults(id: string) {
  return useQuery({
    queryKey: resultsKey(id),
    queryFn: () => fetchConsultationResults(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useRespond(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RespondInput) => respondConsultation(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resultsKey(id) });
      void queryClient.invalidateQueries({ queryKey: consultationKey(id) });
    },
  });
}