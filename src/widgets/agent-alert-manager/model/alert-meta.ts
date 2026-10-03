import type { AlertCriticality, AlertStatus } from "@/entities/alert";

export const ALERT_CRITICALITY_LABELS: Record<AlertCriticality, string> = {
  info: "Information",
  warning: "Avertissement",
  critical: "Critique",
};

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  draft: "Brouillon",
  active: "Active",
  resolved: "Résolue",
};

export const ALERT_CRITICALITY_BADGE: Record<AlertCriticality, string> = {
  info: "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40",
  warning: "bg-[#ffb454]/10 text-[#ffb454] border-[#ffb454]/40",
  critical: "bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border-[var(--dg-danger-border)]",
};

export const ALERT_STATUS_BADGE: Record<AlertStatus, string> = {
  draft: "bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border-[var(--dg-border)]",
  active: "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40",
  resolved: "bg-[var(--dg-success)]/15 text-[var(--dg-success)] border-[var(--dg-success-border)]",
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