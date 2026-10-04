"use client";

import { BookOpen, Boxes, ConciergeBell, Activity } from "lucide-react";
import { Shield } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { HubHeader, HubTabs, useHubTab } from "@/components/ui/hub-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCatalog } from "@/widgets/service-catalog";
import { ServiceStatusPage } from "@/features/services/components/service-status-page";
import { GlossaryExplorer } from "@/features/plain-language/components/glossary-explorer";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";

const TABS = [
  { key: "catalog", label: "Catalogue", icon: ConciergeBell },
  { key: "status", label: "État des services", icon: Activity },
  { key: "glossary", label: "Glossaire", icon: BookOpen },
];

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40 bg-white/10" />
        <Skeleton className="h-7 w-72 bg-white/10" />
      </div>
      <Skeleton className="h-12 rounded-xl bg-white/10" />
      <Skeleton className="h-12 rounded-2xl bg-white/10" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl bg-white/10" />
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
      <p className="max-w-md text-center text-sm text-[var(--dg-text-muted)]">
        Cette section est réservée aux habitants de Terra Nova.
      </p>
    </HudPanel>
  );
}

export default function ServicesHubPage() {
  const { isLoading, hasRole } = useRoleGuard();
  const { active, setTab } = useHubTab("catalog");

  if (isLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.CITIZEN)) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <HubHeader
        eyebrow="Citoyen · Services"
        title="Services & aide"
        description="Explorez les services de la ville, leur disponibilité en temps réel et les termes expliqués simplement."
      />

      <HubTabs tabs={TABS} active={active} onChange={setTab} />

      {active === "catalog" ? (
        <HudPanel edge className="flex flex-col gap-4 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
            <Boxes className="h-4 w-4 text-[var(--dg-accent-bright)]" />
            Catalogue des services
          </h2>
          <ServiceCatalog />
        </HudPanel>
      ) : null}

      {active === "status" ? <ServiceStatusPage /> : null}
      {active === "glossary" ? <GlossaryExplorer /> : null}
    </div>
  );
}