export const NOTIFICATION_TYPES = [
  "announcement",
  "alert",
  "system",
  "appointment",
  "reminder",
  "request",
  "security",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  priority: string;
  payload: Record<string, unknown> | null;
  readAt: string | null;
  scheduledAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  read?: boolean;
}

export interface PaginatedNotifications {
  items: Notification[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    unreadCount: number;
  };
}

export interface NotificationPrefs {
  announcement: boolean;
  alert: boolean;
  system: boolean;
}

export interface NotificationPrefsInput {
  announcement?: boolean;
  alert?: boolean;
  system?: boolean;
}