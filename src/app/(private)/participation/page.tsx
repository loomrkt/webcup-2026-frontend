"use client";

import { Building2, Lightbulb, ThumbsUp, Vote } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { HubHeader, HubTabs, useHubTab } from "@/components/ui/hub-tabs";
import { IdeaForm } from "@/features/ideas/components/idea-form";
import { MyIdeas } from "@/features/ideas/components/my-ideas";
import { ProjectList } from "@/features/projects/components/project-list";
import { ConsultationList } from "@/features/consultations/components/consultation-list";
import { SupportRequestPage } from "@/features/support/components/support-request-page";

const TABS = [
  { key: "ideas", label: "Idées", icon: Lightbulb },
  { key: "projects", label: "Projets", icon: Building2 },
  { key: "consultations", label: "Consultations", icon: Vote },
  { key: "support", label: "Soutenir", icon: ThumbsUp },
];

export default function ParticipationHubPage() {
  const { active, setTab } = useHubTab("ideas");

  return (
    <div className="flex flex-col gap-4 p-6">
      <HubHeader
        eyebrow="Participation citoyenne"
        title="Participer à Terra Nova"
        description="Proposez une idée, suivez les projets de la ville, répondez aux consultations ouvertes et soutenez les demandes utiles."
      />

      <HubTabs tabs={TABS} active={active} onChange={setTab} />

      {active === "ideas" ? (
        <div className="flex flex-col gap-4">
          <HudPanel className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
              <Lightbulb className="h-4 w-4 text-[var(--dg-accent-bright)]" />
              Proposer une idée
            </h2>
            <div className="mt-4">
              <IdeaForm />
            </div>
          </HudPanel>
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-[var(--dg-text)]">
              Mes idées
            </h2>
            <MyIdeas />
          </section>
        </div>
      ) : null}

      {active === "projects" ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-[var(--dg-text)]">
            Projets de la ville
          </h2>
          <ProjectList />
        </section>
      ) : null}

      {active === "consultations" ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-[var(--dg-text)]">
            Consultations ouvertes
          </h2>
          <ConsultationList />
        </section>
      ) : null}

      {active === "support" ? (
        <HudPanel className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
            <ThumbsUp className="h-4 w-4 text-[var(--dg-accent-bright)]" />
            Soutenir une demande
          </h2>
          <div className="mt-4">
            <SupportRequestPage />
          </div>
        </HudPanel>
      ) : null}
    </div>
  );
}