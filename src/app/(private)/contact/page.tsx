"use client";

import { MessageCircle, Shield } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactForm } from "@/features/contact-form";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40 bg-white/10" />
        <Skeleton className="h-7 w-72 bg-white/10" />
      </div>
      <Skeleton className="h-96 rounded-2xl bg-white/10" />
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

export default function ContactPage() {
  const { isLoading, hasRole } = useRoleGuard();

  if (isLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.CITIZEN)) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader
        eyebrow="Citoyen · Communication"
        title="Contactez le Haut Conseil"
        description="Une question, une suggestion ? Écrivez-nous : votre message sera transmis aux services de Terra Nova."
      />
      <HudPanel edge className="flex flex-col gap-4 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
          <MessageCircle className="h-4 w-4 text-[var(--dg-accent-bright)]" />
          Formulaire de contact
        </h2>
        <ContactForm />
      </HudPanel>
    </div>
  );
}