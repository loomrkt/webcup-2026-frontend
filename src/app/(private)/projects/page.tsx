import { ProjectList } from "@/features/projects/components/project-list";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Participation citoyenne</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Projets de la ville
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Suivez les projets en cours à Terra Nova et donnez votre avis — sans
          que ce soit un vote officiel.
        </p>
      </header>

      <ProjectList />
    </div>
  );
}