"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchFeedbackSummary,
  fetchMyFeedback,
  fetchProject,
  fetchProjects,
  submitProjectFeedback,
} from "@/services/civic/projects-service";
import type { SubmitFeedbackInput } from "@/services/civic/project-types";
import { useEcoStore } from "@/stores/eco-store";

export const projectKey = (id: string) => ["projects", "detail", id];
export const feedbackSummaryKey = (id: string) => ["feedback-summary", id];
export const myFeedbackKey = (id: string) => ["my-feedback", id];

/** F67 — liste publique (mode light en éco). */
export function useProjects() {
  const ecoMode = useEcoStore((s) => s.ecoMode);

  return useQuery({
    queryKey: ["projects", ecoMode ? "light" : "full"],
    queryFn: () => fetchProjects(ecoMode),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKey(id),
    queryFn: () => fetchProject(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

/** F66 — résumé public des avis. */
export function useFeedbackSummary(id: string) {
  return useQuery({
    queryKey: feedbackSummaryKey(id),
    queryFn: () => fetchFeedbackSummary(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

/** F66 — mon avis actuel (null si je n'ai pas encore répondu). */
export function useMyFeedback(id: string) {
  return useQuery({
    queryKey: myFeedbackKey(id),
    queryFn: () => fetchMyFeedback(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useSubmitFeedback(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SubmitFeedbackInput) =>
      submitProjectFeedback(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: feedbackSummaryKey(id) });
      void queryClient.invalidateQueries({ queryKey: myFeedbackKey(id) });
      void queryClient.invalidateQueries({ queryKey: projectKey(id) });
    },
  });
}