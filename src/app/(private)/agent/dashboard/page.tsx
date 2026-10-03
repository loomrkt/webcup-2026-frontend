"use client";

import { Shield } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import {
  DashboardActivityChart,
  DashboardRecentActivity,
  DashboardStatsCards,
  DashboardStatusBreakdown,
  NovaTerraPanel,
} from "@/widgets/agent-dashboard";
import { AgentLockedAccounts } from "@/widgets/agent-locked-accounts";
import { PageSkeleton } from "@/widgets/agent-dashboard";

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

export default function AgentDashboardPage() {
  const { isLoading, hasRole } = useRoleGuard();

  if (isLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.AGENT_MUNICIPAL)) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Espace agent · Pilotage</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Tableau de bord agent
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Indicateurs de la ville et données Nova Terra.
        </p>
      </header>

      <DashboardStatsCards />

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardStatusBreakdown />
        <DashboardActivityChart />
      </div>

      <AgentLockedAccounts />

      <DashboardRecentActivity />

      <NovaTerraPanel />
    </div>
  );
}