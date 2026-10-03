"use client";

import { ArrowRight, BusFront, RefreshCcw, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { MobilityLine } from "@/entities/mobility";
import { useMobilityLinesQuery } from "@/entities/mobility";
import { cn } from "@/lib/utils";

const DAY_OPTIONS = [
  { value: "today", label: "Aujourd'hui" },
  { value: "weekday", label: "Semaine" },
  { value: "saturday", label: "Samedi" },
  { value: "sunday", label: "Dimanche" },
] as const;

const inputClassName =
  "h-12 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] pl-11 pr-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

function LineCard({ line }: { line: MobilityLine }) {
  return (
    <Link
      href={`/mobility/${line.id}`}
      className="hud-cut group flex flex-col gap-2.5 rounded-2xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-4 backdrop-blur transition-all hover:border-[var(--dg-accent)]/40 hover:bg-[var(--dg-bg-card-hover)]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg px-1.5 font-mono text-xs font-bold",
            line.color ? "" : "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)]",
          )}
          style={
            line.color
              ? { backgroundColor: `${line.color}33`, color: line.color }
              : undefined
          }
        >
          {line.code}
        </span>
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-white transition-colors group-hover:text-[var(--dg-accent-bright)]">
          {line.name}
        </h3>
      </div>

      {line.origin || line.destination ? (
        <p className="text-xs text-[var(--dg-text-muted)]">
          <span className="truncate">{line.origin ?? "—"}</span>
          <ArrowRight className="mx-1 inline size-3 shrink-0 text-[var(--dg-text-faint)]" />
          <span className="truncate">{line.destination ?? "—"}</span>
        </p>
      ) : null}

      {line.frequency ? (
        <p className="text-[11px] text-[var(--dg-text-faint)]">
          {line.frequency}
        </p>
      ) : null}

      <span className="text-xs font-medium text-[var(--dg-accent-bright)] group-hover:underline">
        Voir les horaires
      </span>
    </Link>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-32 rounded-2xl bg-white/10" />
      ))}
    </div>
  );
}

export function MobilityLines() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [day, setDay] = useState<string>("today");

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const timer = setTimeout(() => setSearchTerm(trimmed), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const searching = query.trim().length > 0;
  const { data, isLoading, isError, refetch, isFetching } =
    useMobilityLinesQuery({ q: searchTerm, day });

  const items = data?.items ?? [];

  if (isLoading) return <GridSkeleton />;

  if (isError || !data) {
    return (
      <EmptyState
        icon={<RefreshCcw className="h-6 w-6" />}
        title="Impossible de charger les lignes"
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
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-[var(--dg-text-faint)]"
        />
        <Input
          type="search"
          className={inputClassName}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher une ligne (ex. L1, tram, gare…)"
          aria-label="Rechercher une ligne de transport"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Jour des horaires">
        {DAY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setDay(option.value)}
            className={cn(
              "inline-flex cursor-pointer items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              day === option.value
                ? "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border border-[var(--dg-accent)]/40"
                : "text-[var(--dg-text-muted)] border border-transparent hover:text-white",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <section aria-label="Lignes de transport">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
          <BusFront className="h-4 w-4 text-[var(--dg-accent-bright)]" />
          {searching ? (
            <>
              Résultats pour « {searchTerm.trim()} »
              <span className="text-xs text-[var(--dg-text-faint)]">
                {isFetching ? "…" : `${items.length} ligne${items.length > 1 ? "s" : ""}`}
              </span>
            </>
          ) : (
            <>Lignes du réseau</>
          )}
        </h2>

        {isFetching ? (
          <div className="mt-3">
            <GridSkeleton />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              icon={<Search className="h-6 w-6" />}
              title="Aucune ligne trouvée"
              description="Essayez un autre terme de recherche."
            />
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((line) => (
              <LineCard key={line.id} line={line} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}