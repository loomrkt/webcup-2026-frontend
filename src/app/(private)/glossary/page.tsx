import { GlossaryExplorer } from "@/features/plain-language/components/glossary-explorer";

export default function GlossaryPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Espace citoyen · Aide</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Glossaire
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Les termes complexes de la plateforme expliqués simplement. Activez
          le mode « langage simple » dans vos réglages d&apos;accessibilité
          pour voir les définitions automatiquement dans les contenus.
        </p>
      </header>

      <GlossaryExplorer />
    </div>
  );
}