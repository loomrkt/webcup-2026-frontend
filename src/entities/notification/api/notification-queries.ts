"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchNotificationPrefs,
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationPrefs,
} from "./notification-api";
import type {
  NotificationListParams,
  NotificationPrefsInput,
} from "../model/types";

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: (params: NotificationListParams) =>
    ["notifications", "list", params] as const,
  unreadCount: ["notifications", "unread-count"] as const,
  prefs: ["notifications", "prefs"] as const,
};

export function useNotificationsQuery(params: NotificationListParams) {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => fetchNotifications(params),
    placeholderData: keepPreviousData,
  });
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount,
    queryFn: fetchUnreadCount,
  });
}

export function useNotificationPrefsQuery() {
  return useQuery({
    queryKey: notificationQueryKeys.prefs,
    queryFn: fetchNotificationPrefs,
  });
}

export function useMarkAllReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
    },
  });
}

export function useMarkReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) =>
      markNotificationRead(id, read),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
    },
  });
}

export function useUpdateNotificationPrefsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NotificationPrefsInput) =>
      updateNotificationPrefs(input),
    onSuccess: (prefs) => {
      void queryClient.setQueryData(
        notificationQueryKeys.prefs,
        prefs,
      );
    },
  });
}