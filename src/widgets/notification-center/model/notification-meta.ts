import {
  type Notification,
  type NotificationType,
} from "@/entities/notification";

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  announcement: "Annonce",
  alert: "Alerte",
  system: "Système",
  appointment: "Rendez-vous",
  reminder: "Rappel",
  request: "Demande",
  security: "Sécurité",
};

const TYPE_BADGE: Record<NotificationType, string> = {
  announcement:
    "bg-[var(--dg-success)]/15 text-[var(--dg-success)] border-[var(--dg-success-border)]",
  alert: "bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border-[var(--dg-danger-border)]",
  system: "bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border-[var(--dg-border)]",
  appointment:
    "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40",
  reminder:
    "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40",
  request:
    "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40",
  security:
    "bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border-[var(--dg-danger-border)]",
};

export function typeBadgeClass(type: NotificationType) {
  return TYPE_BADGE[type] ?? TYPE_BADGE.system;
}

export function formatRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function notificationPayloadUrl(notification: Notification) {
  const url = notification.payload?.url;
  return typeof url === "string" && url.startsWith("/") ? url : null;
}