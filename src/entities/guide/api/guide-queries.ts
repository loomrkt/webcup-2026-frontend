"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  completeGuide,
  dismissGuide,
  fetchGuides,
  fetchMyGuides,
} from "./guide-api";

export const guideQueryKeys = {
  all: ["guides"] as const,
  catalog: ["guides", "catalog"] as const,
  mine: ["guides", "me"] as const,
};

export function useGuidesQuery() {
  return useQuery({
    queryKey: guideQueryKeys.catalog,
    queryFn: fetchGuides,
  });
}

export function useMyGuidesQuery() {
  return useQuery({
    queryKey: guideQueryKeys.mine,
    queryFn: fetchMyGuides,
  });
}

export function useCompleteGuideMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => completeGuide(key),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: guideQueryKeys.all });
    },
  });
}

export function useDismissGuideMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => dismissGuide(key),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: guideQueryKeys.all });
    },
  });
}