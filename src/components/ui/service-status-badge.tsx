import { Badge } from "@/components/ui/badge";
import type { ServiceStatus } from "@/entities/service";
import { SERVICE_STATUS_LABELS } from "@/entities/service";
import { cn } from "@/lib/utils";

const SERVICE_STATUS_META: Record<
  ServiceStatus,
  { className: string; label: string }
> = {
  available: {
    label: SERVICE_STATUS_LABELS.available,
    className:
      "hud-chip bg-[var(--dg-success)]/15 text-[var(--dg-success)] border border-[var(--dg-success-border)]",
  },
  maintenance: {
    label: SERVICE_STATUS_LABELS.maintenance,
    className:
      "hud-chip bg-[#ffb454]/15 text-[#ffb454] border border-[#ffb454]/40",
  },
  incident: {
    label: SERVICE_STATUS_LABELS.incident,
    className:
      "hud-chip bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border border-[var(--dg-danger-border)] shadow-[0_0_10px_var(--dg-danger-glow)]",
  },
};

export function ServiceStatusBadge({
  status,
  className,
}: {
  status: ServiceStatus;
  className?: string;
}) {
  const meta = SERVICE_STATUS_META[status] ?? SERVICE_STATUS_META.available;
  return (
    <Badge className={cn("border", meta.className, className)}>
      {meta.label}
    </Badge>
  );
}