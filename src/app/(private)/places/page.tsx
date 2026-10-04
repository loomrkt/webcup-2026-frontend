"use client";

import { Map, Siren } from "lucide-react";
import { Shield } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { HubHeader, HubTabs, useHubTab } from "@/components/ui/hub-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PlacesCatalog } from "@/widgets/places-catalog";
import { EmergencyPlaces } from "@/widgets/emergency-places";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";

const TABS = [
  { key: "places", label: "Lieux & services", icon: Map },
  { key: "emergency", label: "Urgences", icon: Siren },
];

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40 bg-white/10" />
        <Skeleton className="h-7 w-72 bg-white/10" />
      </div>
      <Skeleton className="h-12 rounded-xl bg-white/10" />
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

export default function PlacesHubPage() {
  const { isLoading, hasRole } = useRoleGuard();
  const { active, setTab } = useHubTab("places");

  if (isLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.CITIZEN)) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <HubHeader
        eyebrow="Citoyen · Services de proximité"
        title="Lieux & urgences"
        description="Retrouvez les services physiques de Terra Nova et, en cas d'urgence, les coordonnées à joindre en un appel."
      />

      <HubTabs tabs={TABS} active={active} onChange={setTab} />

      {active === "places" ? (
        <HudPanel edge className="flex flex-col gap-5 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
            <Map className="h-4 w-4 text-[var(--dg-accent-bright)]" />
            Services physiques
          </h2>
          <PlacesCatalog />
        </HudPanel>
      ) : null}

      {active === "emergency" ? (
        <HudPanel edge className="flex flex-col gap-5 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
            <Siren className="h-4 w-4 text-[var(--dg-danger)]" />
            Urgences de proximité
          </h2>
          <EmergencyPlaces />
        </HudPanel>
      ) : null}
    </div>
  );
}