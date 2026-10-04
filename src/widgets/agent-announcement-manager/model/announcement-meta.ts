import type {
  AnnouncementPriority,
  AnnouncementStatus,
} from "@/entities/announcement";

export const ANNOUNCEMENT_PRIORITY_LABELS: Record<AnnouncementPriority, string> =
  {
    low: "Basse",
    normal: "Normale",
    high: "Haute",
    urgent: "Urgente",
  };

export const ANNOUNCEMENT_STATUS_LABELS: Record<AnnouncementStatus, string> = {
  draft: "Brouillon",
  published: "Publiée",
  archived: "Archivée",
};

export const ANNOUNCEMENT_STATUS_BADGE: Record<AnnouncementStatus, string> = {
  draft: "bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border-[var(--dg-border)]",
  published:
    "bg-[var(--dg-success)]/15 text-[var(--dg-success)] border-[var(--dg-success-border)]",
  archived:
    "bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border-[var(--dg-border)]",
};

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}