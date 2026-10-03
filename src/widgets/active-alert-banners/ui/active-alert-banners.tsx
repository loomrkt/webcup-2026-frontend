"use client";

import { AlertTriangle, Info, ShieldAlert, Siren, X } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useActiveAlertsQuery,
  type Alert,
  type AlertCriticality,
} from "@/entities/alert";
import { cn } from "@/lib/utils";

const CRITICALITY_META: Record<
  AlertCriticality,
  {
    label: string;
    border: string;
    text: string;
    soft: string;
    icon: React.ReactNode;
  }
> = {
  info: {
    label: "Information",
    border: "border-[var(--dg-accent-border)]",
    text: "text-[var(--dg-accent-bright)]",
    soft: "bg-[var(--dg-accent)]/10",
    icon: <Info className="h-4 w-4" />,
  },
  warning: {
    label: "Avertissement",
    border: "border-[#ffb454]/40",
    text: "text-[#ffb454]",
    soft: "bg-[#ffb454]/10",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  critical: {
    label: "Alerte critique",
    border: "border-[var(--dg-danger-border)]",
    text: "text-[var(--dg-danger)]",
    soft: "bg-[var(--dg-danger-soft)]",
    icon: <ShieldAlert className="h-4 w-4" />,
  },
};

function BannersSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-24 rounded-2xl bg-white/10" />
      <Skeleton className="h-24 rounded-2xl bg-white/10" />
    </div>
  );
}

export function ActiveAlertBanners() {
  const { data, isLoading } = useActiveAlertsQuery();
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-3">
        <BannersSkeleton />
      </div>
    );
  }

  const alerts = data.filter((alert) => !dismissed.has(alert.id));
  if (alerts.length === 0) return null;

  return (
    <section
      aria-label="Alertes actives"
      className="flex flex-col gap-3 px-4 pt-4 lg:px-6 lg:pt-6"
    >
      {alerts.map((alert) => (
        <AlertBanner
          key={alert.id}
          alert={alert}
          onDismiss={() =>
            setDismissed((current) => new Set(current).add(alert.id))
          }
        />
      ))}
    </section>
  );
}

function AlertBanner({
  alert,
  onDismiss,
}: {
  alert: Alert;
  onDismiss: () => void;
}) {
  const meta = CRITICALITY_META[alert.criticality] ?? CRITICALITY_META.info;

  return (
    <div
      className={cn(
        "hud-cut relative border bg-[var(--dg-bg-card)]/80 p-4 backdrop-blur-xl",
        meta.border,
        alert.criticality === "critical" &&
          "shadow-[0_0_24px_var(--dg-danger-glow)]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-1",
          alert.criticality === "info" && "bg-[var(--dg-accent)]",
          alert.criticality === "warning" && "bg-[#ffb454]",
          alert.criticality === "critical" && "bg-[var(--dg-danger)]",
        )}
      />

      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            meta.soft,
            meta.text,
          )}
        >
          {meta.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-[var(--dg-text)]">
              {alert.title}
            </h2>
            <span
              className={cn(
                "hud-chip border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                meta.border,
                meta.text,
                meta.soft,
              )}
            >
              {meta.label}
            </span>
            {alert.zone ? (
              <span className="hud-chip border border-[var(--dg-border)] bg-[var(--dg-text-muted)]/15 px-2 py-0.5 text-[10px] text-[var(--dg-text-muted)]">
                {alert.zone}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-[var(--dg-text-muted)]">
            {alert.message}
          </p>

          {alert.recommendations && alert.recommendations.length > 0 ? (
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-[11px] font-semibold tracking-wider text-[var(--dg-text-faint)] uppercase">
                Consignes
              </p>
              <ul className="flex flex-col gap-1.5">
                {alert.recommendations.map((recommendation, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-xs text-[var(--dg-text)]"
                  >
                    <Siren className="mt-0.5 size-3 shrink-0 text-[var(--dg-accent-bright)]" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {alert.vulnerableRecommendations &&
          alert.vulnerableRecommendations.length > 0 ? (
            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-[var(--dg-border)] bg-[var(--dg-bg-card-hover)] p-3">
              <p className="text-[11px] font-semibold tracking-wider text-[var(--dg-danger)] uppercase">
                Publics vulnérables
              </p>
              <ul className="flex flex-col gap-1.5">
                {alert.vulnerableRecommendations.map((recommendation, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-xs text-[var(--dg-text-muted)]"
                  >
                    <ShieldAlert className="mt-0.5 size-3 shrink-0 text-[var(--dg-danger)]" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Masquer cette alerte"
          className="cursor-pointer rounded-md p-1 text-[var(--dg-text-faint)] transition-colors hover:bg-[var(--dg-bg-card-hover)] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}