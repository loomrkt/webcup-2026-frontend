"use client";

import { Shield, Siren } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { EmergencyPlaces } from "@/widgets/emergency-places";

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40 bg-white/10" />
        <Skeleton className="h-7 w-72 bg-white/10" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-2xl bg-white/10" />
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

export default function EmergencyPlacesPage() {
  const { isLoading, hasRole } = useRoleGuard();

  if (isLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.CITIZEN)) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader
        eyebrow="Citoyen · Sécurité"
        title="Services d'urgence"
        description="Hôpitaux, police et secours de Terra Nova, joignables en un appel."
      />

      <div className="flex flex-col gap-4">
        <HudPanel edge className="flex flex-col gap-5 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
            <Siren className="h-4 w-4 text-[var(--dg-danger)]" />
            Urgences de proximité
          </h2>
          <EmergencyPlaces />
        </HudPanel>
      </div>
    </div>
  );
}