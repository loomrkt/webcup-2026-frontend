import { ConcernForm } from "@/features/data-concerns/components/concern-form";
import { MyConcerns } from "@/features/data-concerns/components/my-concerns";
import { HudPanel } from "@/components/ui/hud-panel";

export default function DataConcernsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Données & vie privée</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Mes préoccupations sur mes données
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Vous ne comprenez pas comment vos données sont utilisées, ou vous
          avez une inquiétude ? Faites-la remonter au Haut Conseil et suivez
          sa réponse ici.
        </p>
      </header>

      <HudPanel className="p-5">
        <ConcernForm />
      </HudPanel>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--dg-text)]">
          Mes préoccupations
        </h2>
        <MyConcerns />
      </section>
    </div>
  );
}