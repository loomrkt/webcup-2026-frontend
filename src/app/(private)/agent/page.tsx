"use client";

import { ChartNoAxesCombined, Inbox, Megaphone, ScrollText } from "lucide-react";
import { Shield } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { HubHeader, HubTabs, useHubTab } from "@/components/ui/hub-tabs";
import { RequestFilters } from "@/features/request-filters";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { AgentRequestKpis } from "@/widgets/agent-request-kpis";
import { AgentRequestList } from "@/widgets/agent-request-list";
import { AlertCreateForm, AlertManager } from "@/widgets/agent-alert-manager";
import {
  AnnouncementCreateForm,
  AnnouncementManager,
} from "@/widgets/agent-announcement-manager";
import { AuditFilters } from "@/features/audit-filters";
import { AuditList } from "@/widgets/agent-audit-list";
import {
  DashboardActivityChart,
  DashboardRecentActivity,
  DashboardStatsCards,
  DashboardStatusBreakdown,
  NovaTerraPanel,
  PageSkeleton as AgentPageSkeleton,
} from "@/widgets/agent-dashboard";
import { AgentLockedAccounts } from "@/widgets/agent-locked-accounts";

const TABS = [
  { key: "dashboard", label: "Tableau de bord", icon: ChartNoAxesCombined },
  { key: "requests", label: "Demandes", icon: Inbox },
  { key: "communications", label: "Alertes & annonces", icon: Megaphone },
  { key: "audit", label: "Journal d'audit", icon: ScrollText },
];

function AccessDenied({ message }: { message?: string }) {
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
        {message ??
          "Cette section est réservée aux agents municipaux du Haut Conseil de Terra Nova."}
      </p>
    </HudPanel>
  );
}

export default function AgentHubPage() {
  const { isLoading, hasRole, hasPermission } = useRoleGuard();
  const { active, setTab } = useHubTab("dashboard");

  if (isLoading) return <AgentPageSkeleton />;
  if (!hasRole(ROLES.AGENT_MUNICIPAL)) {
    return <AccessDenied />;
  }
  if (active === "audit" && !hasPermission("audit.read")) {
    return (
      <AccessDenied message="Cette section est réservée aux agents disposant des droits d'audit du Haut Conseil de Terra Nova." />
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <HubHeader
        eyebrow="Espace agent"
        title="Espace agent"
        description="Pilotez les demandes, diffusez les communications et suivez l'activité de la plateforme."
      />

      <HubTabs tabs={TABS} active={active} onChange={setTab} />

      {active === "dashboard" ? (
        <div className="flex flex-col gap-4">
          <DashboardStatsCards />
          <div className="grid gap-4 lg:grid-cols-2">
            <DashboardStatusBreakdown />
            <DashboardActivityChart />
          </div>
          <AgentLockedAccounts />
          <DashboardRecentActivity />
          <NovaTerraPanel />
        </div>
      ) : null}

      {active === "requests" ? (
        <div className="flex flex-col gap-4">
          <AgentRequestKpis />
          <HudPanel edge className="flex flex-col gap-4 p-4">
            <RequestFilters />
          </HudPanel>
          <AgentRequestList />
        </div>
      ) : null}

      {active === "communications" ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_24rem]">
          <HudPanel edge className="flex flex-col gap-4 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
              <Megaphone className="h-4 w-4 text-[var(--dg-accent-bright)]" />
              Alertes
            </h2>
            <AlertManager />
          </HudPanel>
          <HudPanel edge className="flex flex-col gap-4 p-4">
            <h2 className="text-sm font-semibold text-[var(--dg-text)]">
              Nouvelle alerte
            </h2>
            <AlertCreateForm />
          </HudPanel>
          <HudPanel edge className="flex flex-col gap-4 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
              <Megaphone className="h-4 w-4 text-[var(--dg-accent-bright)]" />
              Annonces
            </h2>
            <AnnouncementManager />
          </HudPanel>
          <HudPanel edge className="flex flex-col gap-4 p-4">
            <h2 className="text-sm font-semibold text-[var(--dg-text)]">
              Nouvelle annonce
            </h2>
            <AnnouncementCreateForm />
          </HudPanel>
        </div>
      ) : null}

      {active === "audit" ? (
        <div className="flex flex-col gap-4">
          <HudPanel edge className="flex flex-col gap-4 p-4">
            <AuditFilters />
          </HudPanel>
          <AuditList />
        </div>
      ) : null}
    </div>
  );
}