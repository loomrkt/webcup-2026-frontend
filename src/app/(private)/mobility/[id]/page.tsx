"use client";

import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { HudPanel } from "@/components/ui/hud-panel";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useMobilityLineQuery } from "@/entities/mobility";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { MobilityLineDetailView } from "@/widgets/mobility-line-detail";

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40 bg-white/10" />
        <Skeleton className="h-7 w-80 bg-white/10" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <Skeleton className="h-72 rounded-2xl bg-white/10" />
        <Skeleton className="h-72 rounded-2xl bg-white/10" />
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

function NotFound() {
  return (
    <HudPanel
      tone="danger"
      className="flex flex-col items-center justify-center gap-4 p-10"
    >
      <h2 className="text-lg font-semibold text-[var(--dg-text)]">
        Ligne introuvable
      </h2>
      <p className="text-sm text-[var(--dg-text-muted)]">
        Cette ligne de transport n&apos;existe pas ou n&apos;est plus active.
      </p>
    </HudPanel>
  );
}

export default function MobilityLineDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { isLoading: guardLoading, hasRole } = useRoleGuard();
  const [day, setDay] = useState("today");
  const { data, isLoading, isError } = useMobilityLineQuery(id, day);

  if (guardLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.CITIZEN)) return <AccessDenied />;
  if (isLoading) return <PageSkeleton />;
  if (isError || !data) return <NotFound />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/mobility"
          className="inline-flex items-center gap-1.5 text-[var(--dg-text-muted)] transition-colors hover:text-[var(--dg-accent-bright)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Transports
        </Link>
      </div>

      <PageHeader
        eyebrow="Citoyen · Mobilité"
        title={data.name}
        description={data.origin || data.destination ? `${data.origin ?? "—"} → ${data.destination ?? "—"}` : undefined}
      />

      <MobilityLineDetailView
        line={data}
        schedules={data.schedules}
        day={day}
        onDayChange={setDay}
      />
    </div>
  );
}