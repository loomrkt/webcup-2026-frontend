import { IdeaForm } from "@/features/ideas/components/idea-form";
import { MyIdeas } from "@/features/ideas/components/my-ideas";
import { HudPanel } from "@/components/ui/hud-panel";

export default function IdeasPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Participation citoyenne</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Proposer une idée
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Une idée pour améliorer Terra Nova ? Proposez-la au Haut Conseil.
          Vous recevrez une référence et pourrez suivre son évolution.
        </p>
      </header>

      <HudPanel className="p-5">
        <IdeaForm />
      </HudPanel>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--dg-text)]">
          Mes idées
        </h2>
        <MyIdeas />
      </section>
    </div>
  );
}