import { Badge } from "@/components/ui/badge";
import {
  STATUS_LABELS,
  type RequestStatus,
} from "@/entities/request";
import { cn } from "@/lib/utils";

const STATUS_META: Record<RequestStatus, { label: string; className: string }> =
  {
    pending: {
      label: STATUS_LABELS.pending,
      className:
        "hud-chip bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border border-[var(--dg-border)]",
    },
    in_progress: {
      label: STATUS_LABELS.in_progress,
      className:
        "hud-chip bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border border-[var(--dg-accent)]/40 shadow-[0_0_10px_var(--dg-accent-glow)]",
    },
    resolved: {
      label: STATUS_LABELS.resolved,
      className:
        "hud-chip bg-[var(--dg-success)]/15 text-[var(--dg-success)] border border-[var(--dg-success-border)]",
    },
    rejected: {
      label: STATUS_LABELS.rejected,
      className:
        "hud-chip bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border border-[var(--dg-danger-border)]",
    },
  };

export function StatusBadge({ status }: { status: RequestStatus }) {
  const meta = STATUS_META[status];
  return <Badge className={cn("border", meta.className)}>{meta.label}</Badge>;
}