"use client";

import { CircleAlert, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, type StatusTone } from "@/components/common/status-badge";
import {
  IDEA_STATUS_LABELS,
  type CitizenIdea,
  type IdeaStatus,
} from "@/services/civic/types";
import { useMyIdeas } from "../hooks/use-my-ideas";

const STATUS_TONES: Record<IdeaStatus, StatusTone> = {
  received: "neutral",
  studied: "accent",
  retained: "success",
  rejected: "danger",
  realized: "success",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function IdeaItem({ idea }: { idea: CitizenIdea }) {
  return (
    <li className="hud-cut flex flex-col gap-2 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] tracking-wider text-[var(--dg-accent-bright)]">
          {idea.ref}
        </span>
        {idea.category ? (
          <span className="hud-chip rounded-md border border-[var(--dg-border)] px-2 py-0.5 text-[11px] text-[var(--dg-text-muted)]">
            {idea.category}
          </span>
        ) : null}
        <span className="ml-auto">
          <StatusBadge
            label={IDEA_STATUS_LABELS[idea.status]}
            tone={STATUS_TONES[idea.status]}
          />
        </span>
      </div>
      <p className="text-sm font-semibold text-[var(--dg-text)]">
        {idea.title}
      </p>
      <p className="line-clamp-3 text-xs leading-relaxed text-[var(--dg-text-muted)]">
        {idea.description}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-[var(--dg-text-faint)]">
          Proposée le {formatDate(idea.createdAt)}
        </span>
        {idea.adminNote ? (
          <span className="text-[11px] text-[var(--dg-accent-bright)]">
            Retour de la ville : {idea.adminNote}
          </span>
        ) : null}
      </div>
    </li>
  );
}

export function MyIdeas() {
  const { data, isLoading, isError, refetch } = useMyIdeas();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl bg-white/10" />
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
          Impossible de charger vos idées.
        </p>
        <Button variant="outline" onClick={() => void refetch()}>
          Réessayer
        </Button>
      </HudPanel>
    );
  }

  const ideas = data?.items ?? [];

  if (ideas.length === 0) {
    return (
      <HudPanel className="flex flex-col items-center gap-2 p-8 text-center">
        <Lightbulb aria-hidden className="h-8 w-8 text-[var(--dg-text-faint)]" />
        <p className="text-sm text-[var(--dg-text-muted)]">
          Vous n&apos;avez pas encore proposé d&apos;idée.
        </p>
      </HudPanel>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {ideas.map((idea) => (
        <IdeaItem key={idea.id} idea={idea} />
      ))}
    </ul>
  );
}