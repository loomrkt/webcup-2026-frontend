"use client";

import { Shield } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { ServiceCatalog } from "@/widgets/service-catalog";

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40 bg-white/10" />
        <Skeleton className="h-7 w-72 bg-white/10" />
      </div>
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

export default function ServicesPage() {
  const { isLoading, hasRole } = useRoleGuard();

  if (isLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.CITIZEN)) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader
        eyebrow="Citoyen · Services"
        title="Catalogue des services"
        description="Explorez les services de la ville, leur disponibilité en temps réel et lancez vos démarches en ligne."
      />
      <ServiceCatalog />
    </div>
  );
}