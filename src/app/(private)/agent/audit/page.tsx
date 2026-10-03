"use client";

import { Shield } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditFilters } from "@/features/audit-filters";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { AuditList } from "@/widgets/agent-audit-list";

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64 bg-white/10" />
        <Skeleton className="h-3.5 w-96 bg-white/10" />
      </div>
      <Skeleton className="h-16 rounded-2xl bg-white/10" />
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
        Cette section est réservée aux agents disposant des droits d&apos;audit
        du Haut Conseil de Terra Nova.
      </p>
    </HudPanel>
  );
}

export default function AgentAuditPage() {
  const { isLoading, hasRole, hasPermission } = useRoleGuard();

  if (isLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.AGENT_MUNICIPAL) || !hasPermission("audit.read")) {
    return <AccessDenied />;
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Espace agent · Traçabilité</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Journal d&apos;audit
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Consultez les actions réalisées sur la plateforme, filtrables par
          acteur, type, action et période.
        </p>
      </header>

      <HudPanel edge className="flex flex-col gap-4 p-4">
        <AuditFilters />
      </HudPanel>

      <AuditList />
    </div>
  );
}