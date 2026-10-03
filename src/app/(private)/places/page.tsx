"use client";

import { Map, Shield, Siren } from "lucide-react";
import Link from "next/link";
import { HudPanel } from "@/components/ui/hud-panel";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { PlacesCatalog } from "@/widgets/places-catalog";

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40 bg-white/10" />
        <Skeleton className="h-7 w-72 bg-white/10" />
      </div>
      <Skeleton className="h-12 rounded-2xl bg-white/10" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-36 rounded-2xl bg-white/10" />
        ))}
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <HudPanel
      tone="danger"
      className="flex flex-col items-center justify-center gap-4 p-10"
    >
      <Shield className="h-12 w-12 text-[var(--dg-danger)]" />
      <h2 className="text-lg font-semibold text-[var(--dg-text)]">
        Accès refusé
      </h2>
    </HudPanel>
  );
}

export default function PlacesPage() {
  const { isLoading, hasRole } = useRoleGuard();

  if (isLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.CITIZEN)) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader
        eyebrow="Citoyen · Services de proximité"
        title="Lieux & services de la ville"
        description="Retrouvez les services physiques de Terra Nova : administrations, équipements, commerces et services d'urgence."
      />

      <Link
        href="/places/emergency"
        className="hud-cut group flex items-center gap-3 rounded-2xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] p-4 shadow-[0_0_16px_var(--dg-danger-glow)] backdrop-blur transition-all hover:bg-[var(--dg-danger)]/20"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--dg-danger)]/15 text-[var(--dg-danger)]">
          <Siren className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-white">
            Services d&apos;urgence
          </span>
          <span className="block text-xs text-[var(--dg-text-muted)]">
            Hôpitaux, police, ambulances : accédez à leurs coordonnées.
          </span>
        </span>
        <span className="text-xs font-medium text-[var(--dg-danger)]">
          Voir
        </span>
      </Link>

      <HudPanel edge className="flex flex-col gap-5 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
          <Map className="h-4 w-4 text-[var(--dg-accent-bright)]" />
          Services physiques
        </h2>
        <PlacesCatalog />
      </HudPanel>
    </div>
  );
}