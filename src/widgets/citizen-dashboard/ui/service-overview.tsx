"use client";

import { ArrowRight, Boxes } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceStatusBadge } from "@/components/ui/service-status-badge";
import { useFeaturedServicesQuery } from "@/entities/service";

function ServiceRowSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-12 rounded-xl bg-white/10" />
      ))}
    </div>
  );
}

export function ServiceOverview() {
  const { data: services, isLoading } = useFeaturedServicesQuery();

  if (isLoading || !services) return <ServiceRowSkeleton />;

  const items = services.slice(0, 6);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Boxes className="h-5 w-5" />}
        title="Aucun service en avant pour le moment"
        description="Parcourez le catalogue pour découvrir tous les services proposés par la ville."
        actions={
          <Link
            href="/services"
            className="dg-btn-accent inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            Voir tous les services
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
        className="py-8"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((service) => (
        <Link
          key={service.id}
          href={`/services/${service.id}`}
          className="hud-cut group flex items-center gap-3 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-3 py-2.5 backdrop-blur transition-colors hover:border-[var(--dg-accent)]/40 hover:bg-[var(--dg-bg-card-hover)]"
        >
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--dg-accent)]/10 text-[var(--dg-accent-bright)]"
          >
            <Boxes className="h-4.5 w-4.5" />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-white transition-colors group-hover:text-[var(--dg-accent-bright)]">
            {service.name}
          </span>
          <ServiceStatusBadge status={service.status} />
          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--dg-text-faint)] group-hover:text-[var(--dg-accent-bright)]" />
        </Link>
      ))}
    </div>
  );
}