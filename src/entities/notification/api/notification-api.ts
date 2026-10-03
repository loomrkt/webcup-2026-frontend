import { axiosCredential } from "@/lib/axios";
import type {
  Notification,
  NotificationListParams,
  NotificationPrefs,
  NotificationPrefsInput,
  PaginatedNotifications,
} from "../model/types";

interface ApiEnvelope<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    unreadCount?: number;
  };
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchNotifications = async (
  params: NotificationListParams = {},
): Promise<PaginatedNotifications> => {
  const response = await axiosCredential.get<ApiEnvelope<Notification[]>>(
    "/notifications",
    {
      params: {
        page: params.page,
        limit: params.limit,
        type: params.type,
        ...(params.read === undefined ? {} : { read: String(params.read) }),
      },
    },
  );
  const items = response.data.data;
  const meta = {
    page: response.data.meta?.page ?? 1,
    limit: response.data.meta?.limit ?? 20,
    total: response.data.meta?.total ?? items.length,
    totalPages: response.data.meta?.totalPages ?? 1,
    unreadCount: response.data.meta?.unreadCount ?? 0,
  };
  return { items, meta };
};

export const fetchUnreadCount = async (): Promise<number> =>
  axiosCredential
    .get<ApiEnvelope<number>>("/notifications/unread-count")
    .then(unwrap);

export const markAllNotificationsRead = async (): Promise<number> =>
  axiosCredential
    .patch<ApiEnvelope<number>>("/notifications/read-all")
    .then(unwrap);

export const markNotificationRead = async (
  id: string,
  read: boolean,
): Promise<Notification> =>
  axiosCredential
    .patch<ApiEnvelope<Notification>>(`/notifications/${id}`, { read })
    .then(unwrap);

export const fetchNotificationPrefs = async (): Promise<NotificationPrefs> =>
  axiosCredential
    .get<ApiEnvelope<NotificationPrefs>>("/notifications/preferences")
    .then(unwrap);

export const updateNotificationPrefs = async (
  input: NotificationPrefsInput,
): Promise<NotificationPrefs> =>
  axiosCredential
    .patch<ApiEnvelope<NotificationPrefs>>("/notifications/preferences", input)
    .then(unwrap);