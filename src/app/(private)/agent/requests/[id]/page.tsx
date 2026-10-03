"use client";

import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequestQuery } from "@/entities/request";
import { RequestUpdateForm } from "@/features/request-update";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import {
  RequestHistoryTimeline,
  RequestInfo,
} from "@/widgets/agent-request-detail";
import { PriorityBadge } from "@/widgets/agent-request-list";
import { StatusBadge } from "@/widgets/agent-request-list";

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40 bg-white/10" />
        <Skeleton className="h-7 w-80 bg-white/10" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-48 rounded-2xl bg-white/10" />
          <Skeleton className="h-56 rounded-2xl bg-white/10" />
        </div>
        <Skeleton className="h-96 rounded-2xl bg-white/10" />
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
        Cette section est réservée aux agents municipaux du Haut Conseil de
        Terra Nova.
      </p>
    </HudPanel>
  );
}

function NotFound() {
  return (
    <HudPanel
      tone="danger"
      className="flex flex-col items-center justify-center gap-4 p-10"
    >
      <h2 className="text-lg font-semibold text-[var(--dg-text)]">
        Demande introuvable
      </h2>
      <p className="text-sm text-[var(--dg-text-muted)]">
        La demande demandée n&apos;existe pas ou a été supprimée.
      </p>
    </HudPanel>
  );
}

export default function AgentRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { isLoading: guardLoading, hasRole } = useRoleGuard();
  const { data: request, isLoading, isError } = useRequestQuery(id);

  if (guardLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.AGENT_MUNICIPAL)) return <AccessDenied />;
  if (isLoading) return <PageSkeleton />;
  if (isError || !request) return <NotFound />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/agent/requests"
          className="inline-flex items-center gap-1.5 text-[var(--dg-text-muted)] transition-colors hover:text-[var(--dg-accent-bright)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Demandes
        </Link>
      </div>

      <header className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="dg-eyebrow">Espace agent · Détail</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
            {request.title}
          </h1>
        </div>
        <span className="font-mono text-sm font-semibold text-[var(--dg-accent-bright)]">
          {request.ref}
        </span>
        <StatusBadge status={request.status} />
        <PriorityBadge priority={request.priority} />
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <RequestInfo request={request} />
          <RequestHistoryTimeline request={request} />
        </div>

        <div className="flex flex-col gap-4">
          <HudPanel edge className="p-4">
            <h2 className="text-sm font-semibold text-[var(--dg-text)]">
              Traitement de la demande
            </h2>
            <div className="mt-3">
              <RequestUpdateForm request={request} />
            </div>
          </HudPanel>
        </div>
      </div>
    </div>
  );
}