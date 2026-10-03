export const ANNOUNCEMENT_PRIORITIES = [
  "low",
  "normal",
  "high",
  "urgent",
] as const;
export type AnnouncementPriority = (typeof ANNOUNCEMENT_PRIORITIES)[number];

export const ANNOUNCEMENT_STATUSES = [
  "draft",
  "published",
  "archived",
] as const;
export type AnnouncementStatus = (typeof ANNOUNCEMENT_STATUSES)[number];

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  zone: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  startsAt: string | null;
  endsAt: string | null;
  publishedAt: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  priority?: AnnouncementPriority;
  zone?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  publish?: boolean;
}

export interface UpdateAnnouncementInput {
  title?: string;
  content?: string;
  priority?: AnnouncementPriority;
  status?: AnnouncementStatus;
  zone?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
}