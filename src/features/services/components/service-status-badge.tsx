import { cn } from "@/lib/utils";
import type { Service, ServiceStatus } from "@/services/services/types";

const STATUS_META: Record<
  ServiceStatus,
  { label: string; className: string; dot: string }
> = {
  available: {
    label: "Opérationnel",
    className:
      "text-[var(--dg-success)] border-[var(--dg-success-border)] bg-[var(--dg-success-soft)]",
    dot: "bg-[var(--dg-success)] shadow-[0_0_8px_var(--dg-success-glow)]",
  },
  maintenance: {
    label: "Perturbé",
    className:
      "text-[var(--dg-accent-bright)] border-[var(--dg-accent-border)] bg-[var(--dg-accent)]/10",
    dot: "bg-[var(--dg-accent-bright)] shadow-[0_0_8px_var(--dg-accent-glow)]",
  },
  incident: {
    label: "Indisponible",
    className:
      "text-[var(--dg-danger)] border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)]",
    dot: "bg-[var(--dg-danger)] shadow-[0_0_8px_var(--dg-danger)]/50",
  },
};

function metaOf(service: Pick<Service, "status" | "active">) {
  if (!service.active || service.status === "incident") {
    return STATUS_META.incident;
  }
  if (service.status === "maintenance") return STATUS_META.maintenance;
  return STATUS_META.available;
}

/** F38/F64 — badge d'état d'un service (avant de commencer une démarche). */
export function ServiceStatusBadge({
  service,
  className,
}: {
  service: Pick<Service, "status" | "active">;
  className?: string;
}) {
  const meta = metaOf(service);
  return (
    <span
      className={cn(
        "hud-chip inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold",
        meta.className,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}