import type { AppointmentStatus } from "./types";

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Programmé",
  cancelled: "Annulé",
  completed: "Terminé",
};

export const APPOINTMENT_STATUS_BADGE: Record<AppointmentStatus, string> = {
  scheduled:
    "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40",
  cancelled:
    "bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border-[var(--dg-danger-border)]",
  completed:
    "bg-[var(--dg-success)]/15 text-[var(--dg-success)] border-[var(--dg-success-border)]",
};

type DateLike = string | number | Date | null | undefined;

export function formatDate(value: DateLike) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(value: DateLike) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(value: DateLike) {
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