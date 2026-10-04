"use client";

import { CircleAlert, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, type StatusTone } from "@/components/common/status-badge";
import {
  DATA_CONCERN_STATUS_LABELS,
  type DataConcern,
  type DataConcernStatus,
} from "@/services/participation/types";
import { useMyConcerns } from "../hooks/use-my-concerns";

const STATUS_TONES: Record<DataConcernStatus, StatusTone> = {
  new: "neutral",
  acknowledged: "accent",
  answered: "success",
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

function ConcernItem({ concern }: { concern: DataConcern }) {
  return (
    <li className="hud-cut flex flex-col gap-2 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-2">
        {concern.category ? (
          <span className="hud-chip rounded-md border border-[var(--dg-border)] px-2 py-0.5 text-[11px] text-[var(--dg-text-muted)]">
            {concern.category}
          </span>
        ) : (
          <span className="text-[11px] text-[var(--dg-text-faint)]">
            Données personnelles
          </span>
        )}
        <span className="ml-auto">
          <StatusBadge
            label={DATA_CONCERN_STATUS_LABELS[concern.status]}
            tone={STATUS_TONES[concern.status]}
          />
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[var(--dg-text)]">
        {concern.message}
      </p>
      {concern.response ? (
        <div className="rounded-lg border border-[var(--dg-accent-border)] bg-[var(--dg-accent)]/8 px-3 py-2">
          <p className="text-[11px] font-semibold tracking-wider text-[var(--dg-accent-bright)] uppercase">
            Réponse de la ville
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--dg-text-muted)]">
            {concern.response}
          </p>
        </div>
      ) : null}
      <span className="text-[11px] text-[var(--dg-text-faint)]">
        Envoyée le {formatDate(concern.createdAt)}
      </span>
    </li>
  );
}

export function MyConcerns() {
  const { data, isLoading, isError, refetch } = useMyConcerns();

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
          Impossible de charger vos préoccupations.
        </p>
        <Button variant="outline" onClick={() => void refetch()}>
          Réessayer
        </Button>
      </HudPanel>
    );
  }

  const concerns = data ?? [];

  if (concerns.length === 0) {
    return (
      <HudPanel className="flex flex-col items-center gap-2 p-8 text-center">
        <ShieldAlert
          aria-hidden
          className="h-8 w-8 text-[var(--dg-text-faint)]"
        />
        <p className="text-sm text-[var(--dg-text-muted)]">
          Aucune préoccupation enregistrée pour le moment.
        </p>
      </HudPanel>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {concerns.map((concern) => (
        <ConcernItem key={concern.id} concern={concern} />
      ))}
    </ul>
  );
}