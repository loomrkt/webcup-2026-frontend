"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAllAnnouncements,
  updateAnnouncement,
} from "./announcement-api";
import type {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "../model/types";

export const announcementQueryKeys = {
  all: ["announcements"] as const,
  admin: ["announcements", "admin"] as const,
};

export function useAllAnnouncementsQuery() {
  return useQuery({
    queryKey: announcementQueryKeys.admin,
    queryFn: fetchAllAnnouncements,
  });
}

export function useCreateAnnouncementMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAnnouncementInput) => createAnnouncement(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: announcementQueryKeys.all,
      });
    },
  });
}

export function useUpdateAnnouncementMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateAnnouncementInput;
    }) => updateAnnouncement(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: announcementQueryKeys.all,
      });
    },
  });
}

export function useDeleteAnnouncementMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: announcementQueryKeys.all,
      });
    },
  });
}