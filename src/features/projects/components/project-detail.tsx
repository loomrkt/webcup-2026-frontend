"use client";

import { CircleAlert, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FEEDBACK_SENTIMENT_LABELS,
  FEEDBACK_SENTIMENTS,
} from "@/services/civic/project-types";
import { useFeedbackSummary, useProject } from "../hooks/use-projects";
import { FeedbackForm } from "./feedback-form";
import { ProgressBar, ProjectStatusBadge } from "./project-status-badge";

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function FeedbackSummaryPanel({ projectId }: { projectId: string }) {
  const { data, isLoading } = useFeedbackSummary(projectId);

  if (isLoading) {
    return <Skeleton className="h-24 rounded-xl bg-white/10" />;
  }

  const total = data?.total ?? 0;
  const max = Math.max(1, total);

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-sm text-[var(--dg-text-muted)]">
        <strong className="font-semibold text-[var(--dg-text)]">{total}</strong>{" "}
        avis recueillis sur ce projet
      </p>
      <div className="flex flex-col gap-2">
        {FEEDBACK_SENTIMENTS.map((sentiment) => {
          const count = data?.bySentiment[sentiment] ?? 0;
          const width = Math.round((count / max) * 100);
          return (
            <div key={sentiment} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs text-[var(--dg-text-muted)]">
                {FEEDBACK_SENTIMENT_LABELS[sentiment]}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--dg-bg-card-hover)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--dg-accent)] to-[var(--dg-accent-bright)] transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-mono text-xs text-[var(--dg-text)]">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProjectDetail({ projectId }: { projectId: string }) {
  const { data: project, isLoading, isError, refetch } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-2/3 bg-white/10" />
        <Skeleton className="h-40 rounded-2xl bg-white/10" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <HudPanel
        tone="danger"
        className="flex flex-col items-center gap-3 p-8 text-center"
      >
        <CircleAlert aria-hidden className="h-8 w-8 text-[var(--dg-danger)]" />
        <p className="text-sm text-[var(--dg-text-muted)]">
          Impossible de charger ce projet.
        </p>
        <Button variant="outline" onClick={() => void refetch()}>
          Réessayer
        </Button>
      </HudPanel>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-[var(--dg-text)]">
            {project.title}
          </h1>
          <ProjectStatusBadge status={project.status} />
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--dg-text-faint)]">
          {project.category ? (
            <span>Catégorie : {project.category}</span>
          ) : null}
          {project.location ? (
            <span className="flex items-center gap-1">
              <MapPin aria-hidden className="size-3" />
              {project.location}
            </span>
          ) : null}
          {project.responsible ? (
            <span className="flex items-center gap-1">
              <User aria-hidden className="size-3" />
              {project.responsible}
            </span>
          ) : null}
          {formatDate(project.startDate) ? (
            <span>
              {formatDate(project.startDate)}
              {formatDate(project.endDate)
                ? ` → ${formatDate(project.endDate)}`
                : ""}
            </span>
          ) : null}
        </div>
        <ProgressBar progress={project.progress} />
      </div>

      {project.description ? (
        <HudPanel className="p-5">
          <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--dg-text-muted)]">
            {project.description}
          </p>
        </HudPanel>
      ) : null}

      {project.nextSteps ? (
        <HudPanel className="p-5">
          <h2 className="dg-eyebrow mb-2">Prochaines étapes</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--dg-text-muted)]">
            {project.nextSteps}
          </p>
        </HudPanel>
      ) : null}

      <HudPanel className="p-5">
        <h2 className="mb-3 text-base font-semibold text-[var(--dg-text)]">
          Avis des habitants
        </h2>
        <div className="flex flex-col gap-4">
          <FeedbackSummaryPanel projectId={projectId} />
          <FeedbackForm projectId={projectId} />
        </div>
      </HudPanel>
    </div>
  );
}