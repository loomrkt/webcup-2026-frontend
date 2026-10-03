"use client";

import { Megaphone, Shield } from "lucide-react";
import { useState } from "react";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { AlertCreateForm, AlertManager } from "@/widgets/agent-alert-manager";
import {
  AnnouncementCreateForm,
  AnnouncementManager,
} from "@/widgets/agent-announcement-manager";
import { cn } from "@/lib/utils";

type Tab = "alerts" | "announcements";

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-72 bg-white/10" />
        <Skeleton className="h-3.5 w-96 bg-white/10" />
      </div>
      <Skeleton className="h-12 rounded-2xl bg-white/10" />
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
      <p className="max-w-md text-center text-sm text-[var(--dg-text-muted)]">
        Cette section est réservée aux agents municipaux du Haut Conseil de
        Terra Nova.
      </p>
    </HudPanel>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border border-[var(--dg-accent)]/40 bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)]"
          : "border border-transparent text-[var(--dg-text-muted)] hover:text-white",
      )}
    >
      {label}
    </button>
  );
}

export default function AgentCommunicationsPage() {
  const { isLoading, hasRole } = useRoleGuard();
  const [tab, setTab] = useState<Tab>("alerts");

  if (isLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.AGENT_MUNICIPAL)) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Espace agent · Communications</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Alertes & annonces
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Créez, diffusez et gérez les alertes de sécurité et les annonces
          municipales.
        </p>
      </header>

      <div className="flex items-center gap-1 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-1">
        <TabButton
          active={tab === "alerts"}
          onClick={() => setTab("alerts")}
          label="Alertes"
        />
        <TabButton
          active={tab === "announcements"}
          onClick={() => setTab("announcements")}
          label="Annonces"
        />
      </div>

      {tab === "alerts" ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_24rem]">
          <HudPanel edge className="flex flex-col gap-4 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
              <Megaphone className="h-4 w-4 text-[var(--dg-accent-bright)]" />
              Alertes existantes
            </h2>
            <AlertManager />
          </HudPanel>
          <HudPanel edge className="flex flex-col gap-4 p-4">
            <h2 className="text-sm font-semibold text-[var(--dg-text)]">
              Nouvelle alerte
            </h2>
            <AlertCreateForm />
          </HudPanel>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1fr_24rem]">
          <HudPanel edge className="flex flex-col gap-4 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
              <Megaphone className="h-4 w-4 text-[var(--dg-accent-bright)]" />
              Annonces existantes
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
      )}
    </div>
  );
}