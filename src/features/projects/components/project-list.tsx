"use client";

import Link from "next/link";
import { Building2, CircleAlert, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import type { CityProject } from "@/services/civic/project-types";
import { useProjects } from "../hooks/use-projects";
import { ProgressBar, ProjectStatusBadge } from "./project-status-badge";

export function ProjectCard({ project }: { project: CityProject }) {
  return (
    <li className="hud-cut flex flex-col gap-2.5 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-4 transition-colors hover:border-[var(--dg-border-strong)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="min-w-0 flex-1 text-sm font-semibold text-[var(--dg-text)]">
          {project.title}
        </span>
        <ProjectStatusBadge status={project.status} />
      </div>
      {project.category || project.location ? (
        <p className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--dg-text-faint)]">
          {project.category ? (
            <span className="hud-chip rounded-md border border-[var(--dg-border)] px-2 py-0.5">
              {project.category}
            </span>
          ) : null}
          {project.location ? (
            <span className="flex items-center gap-1">
              <MapPin aria-hidden className="size-3" />
              {project.location}
            </span>
          ) : null}
        </p>
      ) : null}
      <ProgressBar progress={project.progress} />
      <Link
        href={`/projects/${project.id}`}
        className="mt-1 text-xs font-medium text-[var(--dg-accent-bright)] underline-offset-4 hover:underline"
      >
        Voir le projet →
      </Link>
    </li>
  );
}

export function ProjectList() {
  const { data, isLoading, isError, refetch } = useProjects();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl bg-white/10" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <HudPanel
        tone="danger"
        className="flex flex-col items-center gap-3 p-8 text-center"
      >
        <CircleAlert aria-hidden className="h-8 w-8 text-[var(--dg-danger)]" />
        <p className="text-sm text-[var(--dg-text-muted)]">
          Impossible de charger les projets.
        </p>
        <Button variant="outline" onClick={() => void refetch()}>
          Réessayer
        </Button>
      </HudPanel>
    );
  }

  const projects = data ?? [];

  if (projects.length === 0) {
    return (
      <HudPanel className="flex flex-col items-center gap-2 p-8 text-center">
        <Building2 aria-hidden className="h-8 w-8 text-[var(--dg-text-faint)]" />
        <p className="text-sm text-[var(--dg-text-muted)]">
          Aucun projet en cours pour le moment.
        </p>
      </HudPanel>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ul>
  );
}