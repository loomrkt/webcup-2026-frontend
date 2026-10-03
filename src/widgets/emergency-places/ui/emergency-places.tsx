"use client";

import {
  Ambulance,
  Clock,
  Hospital,
  MapPin,
  Phone,
  RefreshCcw,
  Siren,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { Place } from "@/entities/place";
import { useEmergencyPlacesQuery } from "@/entities/place";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  hospital: <Hospital className="h-5 w-5" />,
  police: <Siren className="h-5 w-5" />,
  ambulance: <Ambulance className="h-5 w-5" />,
};

function EmergencyCard({ place }: { place: Place }) {
  return (
    <div className="hud-cut flex flex-col gap-2.5 rounded-2xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] p-4 shadow-[0_0_16px_var(--dg-danger-glow)] backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--dg-danger)]/15 text-[var(--dg-danger)]">
          {CATEGORY_ICONS[place.category] ?? (
            <Hospital className="h-5 w-5" />
          )}
        </span>
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
          {place.name}
        </h3>
        <span className="hud-chip border border-[var(--dg-danger-border)] bg-[var(--dg-danger)]/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--dg-danger)] uppercase">
          Urgence
        </span>
      </div>

      {place.description ? (
        <p className="line-clamp-2 text-xs leading-relaxed text-[var(--dg-text-muted)]">
          {place.description}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--dg-text-faint)]">
        {place.address ? (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {place.address}
          </span>
        ) : null}
        {place.hours ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {place.hours}
          </span>
        ) : null}
      </div>

      {place.phone ? (
        <a
          href={`tel:${place.phone.replaceAll(" ", "")}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--dg-danger)]/40 bg-[var(--dg-danger)]/15 px-3 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--dg-danger)]/25"
        >
          <Phone className="h-4 w-4 text-[var(--dg-danger)]" />
          {place.phone}
        </a>
      ) : null}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-40 rounded-2xl bg-white/10" />
      ))}
    </div>
  );
}

export function EmergencyPlaces() {
  const { data, isLoading, isError, refetch } = useEmergencyPlacesQuery();

  if (isLoading || !data) return <GridSkeleton />;

  if (isError) {
    return (
      <EmptyState
        icon={<RefreshCcw className="h-6 w-6" />}
        title="Impossible de charger les urgences"
        description="Une erreur est survenue. Réessayez dans quelques instants."
        actions={
          <Button
            variant="outline"
            onClick={() => void refetch()}
            className="cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)]"
          >
            <RefreshCcw className="h-4 w-4" />
            Réessayer
          </Button>
        }
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<Siren className="h-6 w-6" />}
        title="Aucun lieu d'urgence référencé"
        description="Les services d'urgence de Terra Nova apparaîtront ici."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((place) => (
        <EmergencyCard key={place.id} place={place} />
      ))}
    </div>
  );
}