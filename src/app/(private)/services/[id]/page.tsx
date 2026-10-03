"use client";

import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HudPanel } from "@/components/ui/hud-panel";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useServiceQuery } from "@/entities/service";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { ServiceDetail } from "@/widgets/service-detail";

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40 bg-white/10" />
        <Skeleton className="h-7 w-80 bg-white/10" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <Skeleton className="h-64 rounded-2xl bg-white/10" />
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
        Cette section est réservée aux habitants de Terra Nova.
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
        Service introuvable
      </h2>
      <p className="text-sm text-[var(--dg-text-muted)]">
        Le service demandé n&apos;existe pas ou n&apos;est plus disponible.
      </p>
    </HudPanel>
  );
}

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { isLoading: guardLoading, hasRole } = useRoleGuard();
  const { data: service, isLoading, isError } = useServiceQuery(id);

  if (guardLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.CITIZEN)) return <AccessDenied />;
  if (isLoading) return <PageSkeleton />;
  if (isError || !service) return <NotFound />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-[var(--dg-text-muted)] transition-colors hover:text-[var(--dg-accent-bright)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Catalogue des services
        </Link>
      </div>

      <PageHeader
        eyebrow="Citoyen · Service"
        title={service.name}
        description={service.category}
      />

      <ServiceDetail service={service} />
    </div>
  );
}