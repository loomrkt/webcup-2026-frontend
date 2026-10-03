"use client";

import { Shield } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestFilters } from "@/features/request-filters";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { AgentRequestKpis } from "@/widgets/agent-request-kpis";
import { AgentRequestList } from "@/widgets/agent-request-list";

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-72 bg-white/10" />
        <Skeleton className="h-3.5 w-96 bg-white/10" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl bg-white/10" />
        ))}
      </div>
      <Skeleton className="h-16 rounded-2xl bg-white/10" />
      <Skeleton className="h-16 rounded-2xl bg-white/10" />
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
        Cette section est réservée aux agents municipaux du Haut Conseil de
        Terra Nova.
      </p>
    </HudPanel>
  );
}

const AGENT_ROLES = ROLES.AGENT_MUNICIPAL;

export default function AgentRequestsPage() {
  const { isLoading, hasRole } = useRoleGuard();

  if (isLoading) return <PageSkeleton />;
  if (!hasRole(AGENT_ROLES)) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Espace agent · Traitement</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Demandes des habitants
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Suivez et filtrez les demandes adressées aux services de Terra Nova.
        </p>
      </header>

      <AgentRequestKpis />

      <HudPanel edge className="flex flex-col gap-4 p-4">
        <RequestFilters />
      </HudPanel>

      <AgentRequestList />
    </div>
  );
}