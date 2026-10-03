"use client";

import { useMemo } from "react";
import {
  Activity,
  CheckCircle2,
  CircleAlert,
  RefreshCw,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service } from "@/services/services/types";
import { useServiceStatus, useServices } from "../hooks/use-services";
import { ServiceStatusBadge } from "./service-status-badge";

function ServiceRow({ service }: { service: Service }) {
  return (
    <li className="hud-cut flex flex-col gap-2 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="min-w-0 flex-1 text-sm font-semibold text-[var(--dg-text)]">
          {service.name}
        </span>
        <ServiceStatusBadge service={service} />
      </div>
      {service.statusMessage ? (
        <p className="text-xs leading-relaxed text-[var(--dg-danger)]">
          {service.statusMessage}
        </p>
      ) : null}
      {service.availability ? (
        <p className="text-xs leading-relaxed text-[var(--dg-text-muted)]">
          {service.availability.nextAction}
        </p>
      ) : null}
      {service.alternativeService ? (
        <p className="text-xs text-[var(--dg-accent-bright)]">
          Service alternatif proposé : {service.alternativeService.name}
        </p>
      ) : null}
    </li>
  );
}

function StatusSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl bg-white/10" />
        ))}
      </div>
      <Skeleton className="h-40 rounded-2xl bg-white/10" />
    </div>
  );
}

export function ServiceStatusPage() {
  const { data: summary, isLoading, isError, refetch } = useServiceStatus();
  const { data: services } = useServices();

  const impacted = useMemo(() => {
    if (!summary) return [];
    return [...summary.maintenance, ...summary.incident];
  }, [summary]);

  const sortedServices = useMemo(
    () =>
      [...(services ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name, "fr"),
      ),
    [services],
  );

  if (isLoading) return <StatusSkeleton />;

  if (isError) {
    return (
      <HudPanel
        tone="danger"
        className="flex flex-col items-center gap-3 p-8 text-center"
      >
        <CircleAlert aria-hidden className="h-8 w-8 text-[var(--dg-danger)]" />
        <p className="text-sm text-[var(--dg-text-muted)]">
          Impossible de charger l&apos;état des services.
        </p>
        <Button variant="outline" onClick={() => void refetch()}>
          Réessayer
        </Button>
      </HudPanel>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <HudPanel tone="success" className="flex flex-col gap-1 p-4">
          <span className="flex items-center gap-2 text-xs text-[var(--dg-text-muted)]">
            <CheckCircle2 aria-hidden className="size-3.5 text-[var(--dg-success)]" />
            Services opérationnels
          </span>
          <strong className="font-mono text-2xl text-[var(--dg-success)]">
            {summary?.healthy ?? 0}
          </strong>
        </HudPanel>
        <HudPanel tone="accent" className="flex flex-col gap-1 p-4">
          <span className="flex items-center gap-2 text-xs text-[var(--dg-text-muted)]">
            <Wrench aria-hidden className="size-3.5 text-[var(--dg-accent-bright)]" />
            Services perturbés
          </span>
          <strong className="font-mono text-2xl text-[var(--dg-accent-bright)]">
            {summary?.maintenance.length ?? 0}
          </strong>
        </HudPanel>
        <HudPanel tone="danger" className="flex flex-col gap-1 p-4">
          <span className="flex items-center gap-2 text-xs text-[var(--dg-text-muted)]">
            <CircleAlert aria-hidden className="size-3.5 text-[var(--dg-danger)]" />
            Services indisponibles
          </span>
          <strong className="font-mono text-2xl text-[var(--dg-danger)]">
            {summary?.incident.length ?? 0}
          </strong>
        </HudPanel>
      </div>

      {impacted.length > 0 ? (
        <HudPanel tone="danger" className="p-5">
          <h2 className="dg-eyebrow mb-3 flex items-center gap-2">
            <RefreshCw aria-hidden className="size-3.5" />
            Attention — services impactés
          </h2>
          <ul className="flex flex-col gap-2.5">
            {impacted.map((service) => (
              <ServiceRow key={service.id} service={service} />
            ))}
          </ul>
        </HudPanel>
      ) : (
        <HudPanel tone="success" className="p-5">
          <p className="flex items-center gap-2 text-sm text-[var(--dg-success)]">
            <CheckCircle2 aria-hidden className="size-4" />
            Tous les services sont opérationnels.
          </p>
        </HudPanel>
      )}

      <HudPanel className="p-5">
        <h2 className="dg-eyebrow mb-3 flex items-center gap-2">
          <Activity aria-hidden className="size-3.5" />
          Tous les services
        </h2>
        <ul className="flex flex-col gap-2.5">
          {sortedServices.map((service) => (
            <ServiceRow key={service.id} service={service} />
          ))}
        </ul>
      </HudPanel>
    </div>
  );
}