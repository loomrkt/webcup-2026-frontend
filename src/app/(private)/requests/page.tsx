"use client";

import { Inbox, Shield, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestFilters } from "@/features/request-filters";
import { useQuickActions } from "@/features/quick-actions/store";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { CitizenRequestList } from "@/widgets/citizen-request-list";

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40 bg-white/10" />
        <Skeleton className="h-7 w-72 bg-white/10" />
      </div>
      <Skeleton className="h-12 rounded-2xl bg-white/10" />
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
    </HudPanel>
  );
}

export default function MyRequestsPage() {
  const { isLoading, hasRole } = useRoleGuard();
  const openAction = useQuickActions((s) => s.open);

  if (isLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.CITIZEN)) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader
        eyebrow="Citoyen · Suivi"
        title="Mes demandes"
        description="Retrouvez l'ensemble de vos signalements et démarches, ainsi que leur état d'avancement."
        actions={
          <Button
            onClick={() => openAction("report")}
            className="dg-btn-accent h-10 w-fit cursor-pointer"
          >
            <TriangleAlert className="h-4 w-4" />
            Signaler un problème
          </Button>
        }
      />

      <HudPanel edge className="flex flex-col gap-4 p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
          <Inbox className="h-4 w-4 text-[var(--dg-accent-bright)]" />
          Filtrer
        </h2>
        <RequestFilters />
      </HudPanel>

      <CitizenRequestList />
    </div>
  );
}