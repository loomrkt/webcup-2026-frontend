"use client";

import { Accessibility, Database, ShieldCheck, UserRound } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import {
  HubHeader,
  HubTabs,
  useHubTab,
} from "@/components/ui/hub-tabs";
import { ProfileCompletion } from "@/widgets/profile-completion";
import { ProfileEditForm } from "@/features/profile-edit";
import { SecurityPanel } from "@/features/account/security-panel";
import { AccessibilitySettingsForm } from "@/features/accessibility/components/accessibility-settings-form";
import { ConcernForm } from "@/features/data-concerns/components/concern-form";
import { MyConcerns } from "@/features/data-concerns/components/my-concerns";
import { DataExport } from "@/features/privacy/components/data-export";

const TABS = [
  { key: "profile", label: "Profil", icon: UserRound },
  { key: "security", label: "Sécurité", icon: ShieldCheck },
  { key: "accessibility", label: "Accessibilité", icon: Accessibility },
  { key: "data", label: "Données & vie privée", icon: Database },
];

export default function AccountHubPage() {
  const { active, setTab } = useHubTab("profile");

  return (
    <div className="flex flex-col gap-4 p-6">
      <HubHeader
        eyebrow="Citoyen · Compte"
        title="Mon compte"
        description="Gérez vos informations personnelles, votre sécurité, vos préférences d'affichage et vos données."
      />

      <HubTabs tabs={TABS} active={active} onChange={setTab} />

      {active === "profile" ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <HudPanel edge className="flex flex-col gap-4 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
              <UserRound className="h-4 w-4 text-[var(--dg-accent-bright)]" />
              Informations personnelles
            </h2>
            <ProfileEditForm />
          </HudPanel>
          <HudPanel edge className="flex flex-col gap-4 p-5">
            <ProfileCompletion />
          </HudPanel>
        </div>
      ) : null}

      {active === "security" ? <SecurityPanel /> : null}

      {active === "accessibility" ? <AccessibilitySettingsForm /> : null}

      {active === "data" ? (
        <div className="flex flex-col gap-4">
          <HudPanel edge className="flex flex-col gap-4 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
              <Database className="h-4 w-4 text-[var(--dg-accent-bright)]" />
              Signaler une préoccupation
            </h2>
            <ConcernForm />
          </HudPanel>
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-[var(--dg-text)]">
              Mes préoccupations
            </h2>
            <MyConcerns />
          </section>
          <HudPanel edge className="flex flex-col gap-4 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
              <Database className="h-4 w-4 text-[var(--dg-accent-bright)]" />
              Export de mes données
            </h2>
            <DataExport />
          </HudPanel>
        </div>
      ) : null}
    </div>
  );
}