"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAlert,
  deleteAlert,
  diffuseAlert,
  fetchActiveAlerts,
  fetchAllAlerts,
  generateAlertDraft,
  updateAlert,
} from "./alert-api";
import type { AiGenerateInput, CreateAlertInput, UpdateAlertInput } from "../model/types";

export const alertQueryKeys = {
  all: ["alerts"] as const,
  active: ["alerts", "active"] as const,
  admin: ["alerts", "admin"] as const,
};

export function useActiveAlertsQuery(zone?: string) {
  return useQuery({
    queryKey: [...alertQueryKeys.active, zone ?? ""] as const,
    queryFn: () => fetchActiveAlerts(zone),
  });
}

export function useAllAlertsQuery() {
  return useQuery({
    queryKey: alertQueryKeys.admin,
    queryFn: fetchAllAlerts,
  });
}

export function useCreateAlertMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAlertInput) => createAlert(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: alertQueryKeys.all });
    },
  });
}

export function useUpdateAlertMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAlertInput }) =>
      updateAlert(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: alertQueryKeys.all });
    },
  });
}

export function useDiffuseAlertMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => diffuseAlert(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: alertQueryKeys.all });
    },
  });
}

export function useDeleteAlertMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAlert(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: alertQueryKeys.all });
    },
  });
}

export function useGenerateAlertDraftMutation() {
  return useMutation({
    mutationFn: (input: AiGenerateInput) => generateAlertDraft(input),
  });
}