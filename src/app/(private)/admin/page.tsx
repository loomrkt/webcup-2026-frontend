"use client";

import { Shield, UsersIcon, Wrench } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { HubHeader, HubTabs, useHubTab } from "@/components/ui/hub-tabs";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { AdminServices } from "@/features/admin-services/components/admin-services";
import { AdminUsers } from "@/features/admin-users/components/admin-users";

const TABS = [
  { key: "users", label: "Utilisateurs", icon: UsersIcon },
  { key: "services", label: "Services", icon: Wrench },
];

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
        Cette section est réservée au super administrateur du Haut Conseil de
        Terra Nova.
      </p>
    </HudPanel>
  );
}

export default function AdminHubPage() {
  const { isLoading, hasRole } = useRoleGuard();
  const { active, setTab } = useHubTab("users");

  if (isLoading) return null;
  if (!hasRole(ROLES.ADMIN)) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <HubHeader
        eyebrow="Haut Conseil · Administration"
        title="Administration"
        description="Gérez les comptes, les rôles et le catalogue de services de la plateforme."
      />

      <HubTabs tabs={TABS} active={active} onChange={setTab} />

      {active === "users" ? <AdminUsers /> : null}
      {active === "services" ? <AdminServices /> : null}
    </div>
  );
}