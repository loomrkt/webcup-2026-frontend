import { Badge } from "@/components/ui/badge";
import {
  PRIORITY_LABELS,
  type RequestPriority,
} from "@/entities/request";
import { cn } from "@/lib/utils";

const PRIORITY_META: Record<
  RequestPriority,
  { label: string; className: string }
> = {
  low: {
    label: PRIORITY_LABELS.low,
    className:
      "hud-chip bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border border-[var(--dg-border)]",
  },
  normal: {
    label: PRIORITY_LABELS.normal,
    className:
      "hud-chip bg-[var(--dg-accent)]/10 text-[var(--dg-accent-bright)]/80 border border-[var(--dg-border-strong)]",
  },
  high: {
    label: PRIORITY_LABELS.high,
    className:
      "hud-chip bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border border-[var(--dg-danger-border)]",
  },
};

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  const meta = PRIORITY_META[priority];
  return <Badge className={cn("border", meta.className)}>{meta.label}</Badge>;
}