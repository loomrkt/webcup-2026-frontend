"use client";

import Link from "next/link";
import { CircleAlert, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import type { Consultation } from "@/services/civic/consultation-types";
import { useConsultations } from "../hooks/use-consultations";

function formatEndsAt(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ConsultationCard({ consultation }: { consultation: Consultation }) {
  const endsAt = formatEndsAt(consultation.endsAt);
  return (
    <li className="hud-cut flex flex-col gap-2.5 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-4 transition-colors hover:border-[var(--dg-border-strong)]">
      <p className="text-sm font-semibold text-[var(--dg-text)]">
        {consultation.title}
      </p>
      <p className="text-xs leading-relaxed text-[var(--dg-text-muted)]">
        {consultation.question}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-[var(--dg-text-faint)]">
          {consultation.choices.length} choix possibles
          {endsAt ? ` · clôture le ${endsAt}` : ""}
        </span>
        <Link
          href={`/consultations/${consultation.id}`}
          className="text-xs font-medium text-[var(--dg-accent-bright)] underline-offset-4 hover:underline"
        >
          Répondre →
        </Link>
      </div>
    </li>
  );
}

export function ConsultationList() {
  const { data, isLoading, isError, refetch } = useConsultations();

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
          Impossible de charger les consultations.
        </p>
        <Button variant="outline" onClick={() => void refetch()}>
          Réessayer
        </Button>
      </HudPanel>
    );
  }

  const consultations = data ?? [];

  if (consultations.length === 0) {
    return (
      <HudPanel className="flex flex-col items-center gap-2 p-8 text-center">
        <Vote aria-hidden className="h-8 w-8 text-[var(--dg-text-faint)]" />
        <p className="text-sm text-[var(--dg-text-muted)]">
          Aucune consultation ouverte pour le moment.
        </p>
      </HudPanel>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {consultations.map((consultation) => (
        <ConsultationCard
          key={consultation.id}
          consultation={consultation}
        />
      ))}
    </ul>
  );
}