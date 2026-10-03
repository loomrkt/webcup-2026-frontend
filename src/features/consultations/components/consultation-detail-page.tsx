"use client";

import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useConsultation } from "../hooks/use-consultations";
import { RespondForm, ResultsPanel } from "./consultation-detail";

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

export function ConsultationDetail({ consultationId }: { consultationId: string }) {
  const { data: consultation, isLoading, isError, refetch } =
    useConsultation(consultationId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-2/3 bg-white/10" />
        <Skeleton className="h-32 rounded-2xl bg-white/10" />
      </div>
    );
  }

  if (isError || !consultation) {
    return (
      <HudPanel
        tone="danger"
        className="flex flex-col items-center gap-3 p-8 text-center"
      >
        <CircleAlert aria-hidden className="h-8 w-8 text-[var(--dg-danger)]" />
        <p className="text-sm text-[var(--dg-text-muted)]">
          Impossible de charger cette consultation.
        </p>
        <Button variant="outline" onClick={() => void refetch()}>
          Réessayer
        </Button>
      </HudPanel>
    );
  }

  const startsAt = formatDate(consultation.startsAt);
  const endsAt = formatDate(consultation.endsAt);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <p className="dg-eyebrow">Consultation citoyenne</p>
        <h1 className="text-xl font-bold tracking-tight text-[var(--dg-text)]">
          {consultation.title}
        </h1>
        <p className="text-sm font-medium text-[var(--dg-text)]">
          {consultation.question}
        </p>
        {(startsAt || endsAt) && (
          <p className="text-xs text-[var(--dg-text-faint)]">
            {startsAt ? `Ouverte depuis le ${startsAt}` : ""}
            {startsAt && endsAt ? " · " : ""}
            {endsAt ? `clôture le ${endsAt}` : ""}
          </p>
        )}
      </div>

      {consultation.description ? (
        <HudPanel className="p-5">
          <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--dg-text-muted)]">
            {consultation.description}
          </p>
        </HudPanel>
      ) : null}

      <HudPanel className="p-5">
        <h2 className="mb-3 text-base font-semibold text-[var(--dg-text)]">
          Donner mon avis
        </h2>
        <RespondForm consultation={consultation} />
      </HudPanel>

      <HudPanel className="p-5">
        <h2 className="mb-3 text-base font-semibold text-[var(--dg-text)]">
          Résultats
        </h2>
        <ResultsPanel consultationId={consultationId} />
      </HudPanel>
    </div>
  );
}