"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProfile,
  fetchProfileCompletion,
  updateLanguage,
  updateProfile,
} from "./profile-api";
import type { UpdateProfileInput } from "../model/types";

export const profileQueryKeys = {
  all: ["profile"] as const,
  me: ["profile", "me"] as const,
  completion: ["profile", "completion"] as const,
};

export function useProfileQuery() {
  return useQuery({
    queryKey: profileQueryKeys.me,
    queryFn: fetchProfile,
  });
}

export function useProfileCompletionQuery() {
  return useQuery({
    queryKey: profileQueryKeys.completion,
    queryFn: fetchProfileCompletion,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
    },
  });
}

export function useUpdateLanguageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (language: string) => updateLanguage(language),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
    },
  });
}