"use client";

import {
  Clock,
  Landmark,
  MapPin,
  Phone,
  RefreshCcw,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Place } from "@/entities/place";
import { usePlacesQuery } from "@/entities/place";
import { cn } from "@/lib/utils";

const inputClassName =
  "h-12 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

function PlaceCard({ place }: { place: Place }) {
  return (
    <div className="hud-cut flex flex-col gap-2.5 rounded-2xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-4 backdrop-blur transition-colors hover:border-[var(--dg-accent)]/40 hover:bg-[var(--dg-bg-card-hover)]">
      <div className="flex flex-wrap items-center gap-2">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--dg-accent)]/10 text-[var(--dg-accent-bright)]"
        >
          <Landmark className="h-4.5 w-4.5" />
        </span>
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
          {place.name}
        </h3>
        <span className="hud-chip border border-[var(--dg-border)] bg-[var(--dg-text-muted)]/15 px-2 py-0.5 text-[10px] text-[var(--dg-text-muted)]">
          {place.category}
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
        {place.phone ? (
          <span className="inline-flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {place.phone}
          </span>
        ) : null}
        {place.hours ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {place.hours}
          </span>
        ) : null}
      </div>

      {place.service ? (
        <p className="text-[11px] text-[var(--dg-text-faint)]">
          Service associé :{" "}
          <span className="text-[var(--dg-accent-bright)]">
            {place.service.name}
          </span>
        </p>
      ) : null}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-36 rounded-2xl bg-white/10" />
      ))}
    </div>
  );
}

export function PlacesCatalog() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const timer = setTimeout(() => setSearchTerm(trimmed), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isError, refetch } = usePlacesQuery({
    q: searchTerm,
    category: category || undefined,
  });

  const items = data ?? [];
  const categories = [...new Set(items.map((place) => place.category))].sort();

  if (isLoading) return <GridSkeleton />;

  if (isError || !data) {
    return (
      <EmptyState
        icon={<RefreshCcw className="h-6 w-6" />}
        title="Impossible de charger les lieux"
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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-[var(--dg-text-faint)]"
          />
          <Input
            type="search"
            className={cn(inputClassName, "pl-11")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un lieu (mairie, hôpital, piscine…)"
            aria-label="Rechercher un lieu"
          />
        </div>
        <label className="flex flex-col gap-1.5 sm:w-56">
          <span className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
            Catégorie
          </span>
          <select
            className={cn(inputClassName, "cursor-pointer")}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filtrer par catégorie"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="Aucun lieu trouvé"
          description="Modifiez votre recherche ou vos filtres."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}