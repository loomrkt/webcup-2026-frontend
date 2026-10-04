"use client";

import { ArrowRight, Info, ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { AlertCriticality } from "@/entities/alert";
import { useActiveAlertsQuery } from "@/entities/alert";
import { cn } from "@/lib/utils";

const CRITICALITY_META: Record<
  AlertCriticality,
  { icon: React.ReactNode; text: string; soft: string; accent: string }
> = {
  info: {
    icon: <Info className="h-4 w-4" />,
    text: "text-[var(--dg-accent-bright)]",
    soft: "bg-[var(--dg-accent)]/10",
    accent: "bg-[var(--dg-accent)]",
  },
  warning: {
    icon: <TriangleAlert className="h-4 w-4" />,
    text: "text-[#ffb454]",
    soft: "bg-[#ffb454]/10",
    accent: "bg-[#ffb454]",
  },
  critical: {
    icon: <ShieldAlert className="h-4 w-4" />,
    text: "text-[var(--dg-danger)]",
    soft: "bg-[var(--dg-danger-soft)]",
    accent: "bg-[var(--dg-danger)]",
  },
};

export function AlertsPreview() {
  const { data: alerts, isLoading } = useActiveAlertsQuery();

  if (isLoading || !alerts) {
    return (
      <div className="flex flex-col gap-2.5">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl bg-white/10" />
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <EmptyState
        icon={<ShieldCheck className="h-5 w-5 text-[var(--dg-success)]" />}
        title="Aucune alerte active"
        description="La ville est calme pour le moment. Suivez les actualités pour ne rien manquer."
        actions={
          <Link
            href="/news"
            className="dg-btn-accent inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            Voir les actualités
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
        className="py-8"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {alerts.slice(0, 3).map((alert) => {
        const meta = CRITICALITY_META[alert.criticality] ?? CRITICALITY_META.info;
        return (
          <div
            key={alert.id}
            className={cn(
              "hud-cut flex items-start gap-3 rounded-xl border bg-[var(--dg-bg-card)] p-3 backdrop-blur",
              alert.criticality === "critical" &&
                "border-[var(--dg-danger-border)] shadow-[0_0_16px_var(--dg-danger-glow)]",
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                meta.soft,
                meta.text,
              )}
            >
              {meta.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--dg-text)]">
                {alert.title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-[var(--dg-text-muted)]">
                {alert.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}