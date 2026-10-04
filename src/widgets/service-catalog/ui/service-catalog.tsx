"use client";

import { Boxes, RefreshCcw, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ServiceStatusBadge } from "@/components/ui/service-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service } from "@/entities/service";
import {
  useFeaturedServicesQuery,
  useServiceSearchQuery,
  useServicesQuery,
} from "@/entities/service";
import { cn } from "@/lib/utils";

const inputClassName =
  "h-12 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] pl-11 pr-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.id}`}
      className="hud-cut group flex flex-col gap-2.5 rounded-2xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-4 backdrop-blur transition-all hover:border-[var(--dg-accent)]/40 hover:bg-[var(--dg-bg-card-hover)]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--dg-accent)]/10 text-[var(--dg-accent-bright)]"
        >
          <Boxes className="h-4.5 w-4.5" />
        </span>
        <h3 className="min-w-0 truncate text-sm font-semibold text-white transition-colors group-hover:text-[var(--dg-accent-bright)]">
          {service.name}
        </h3>
        <ServiceStatusBadge
          status={service.status}
          className="ml-auto shrink-0"
        />
      </div>
      <p className="line-clamp-2 text-xs leading-relaxed text-[var(--dg-text-muted)]">
        {service.description || "Description à venir."}
      </p>
      {service.status !== "available" && service.statusMessage ? (
        <p className="flex items-start gap-1.5 text-xs text-[var(--dg-text-muted)]">
          <span
            className={cn(
              "mt-0.5 size-1.5 shrink-0 rounded-full",
              service.status === "incident"
                ? "bg-[var(--dg-danger)] shadow-[0_0_8px_var(--dg-danger-glow)]"
                : "bg-[#ffb454]",
            )}
          />
          <span className="line-clamp-1">{service.statusMessage}</span>
        </p>
      ) : null}
      <span className="text-xs font-medium text-[var(--dg-accent-bright)] group-hover:underline">
        Voir le service
      </span>
    </Link>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-32 rounded-2xl bg-white/10" />
      ))}
    </div>
  );
}

export function ServiceCatalog() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const timer = setTimeout(() => setSearchTerm(trimmed), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const searching = query.trim().length > 0;

  const { data: services, isLoading, isError, refetch } = useServicesQuery();
  const { data: featured } = useFeaturedServicesQuery();
  const { data: searchResult, isFetching: isSearching } =
    useServiceSearchQuery(searchTerm);

  const onQueryChange = (value: string) => setQuery(value);

  if (isLoading) return <GridSkeleton />;

  if (isError || !services) {
    return (
      <EmptyState
        icon={<RefreshCcw className="h-6 w-6" />}
        title="Impossible de charger le catalogue"
        description="Une erreur est survenue lors du chargement des services."
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
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-[var(--dg-text-faint)]"
        />
        <Input
          type="search"
          className={inputClassName}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Rechercher un service (ex. état civil, déchets, transport…)"
          aria-label="Rechercher un service"
        />
      </div>

      {searching ? (
        <section aria-label="Résultats de recherche">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
            <Search className="h-4 w-4 text-[var(--dg-accent-bright)]" />
            Résultats pour « {searchTerm.trim()} »
            <span className="text-xs text-[var(--dg-text-faint)]">
              {isSearching
                ? "…"
                : `${searchResult?.items.length ?? 0} service${
                    (searchResult?.items.length ?? 0) > 1 ? "s" : ""
                  }`}
            </span>
          </h2>
          {isSearching ? (
            <div className="mt-3">
              <GridSkeleton />
            </div>
          ) : searchResult && searchResult.items.length > 0 ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {searchResult.items.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="mt-3">
              <EmptyState
                icon={<Search className="h-6 w-6" />}
                title="Aucun service trouvé"
                description="Essayez un autre terme ou parcourez le catalogue complet ci-dessous."
              />
            </div>
          )}
        </section>
      ) : null}

      {!searching && featured && featured.length > 0 ? (
        <section aria-label="Services mis en avant">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
            <Sparkles className="h-4 w-4 text-[var(--dg-accent-bright)]" />
            Services mis en avant
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      ) : null}

      <section aria-label="Tous les services">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
          <Boxes className="h-4 w-4 text-[var(--dg-accent-bright)]" />
          Tous les services
        </h2>
        {services.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              icon={<Boxes className="h-6 w-6" />}
              title="Aucun service disponible"
              description="Le catalogue sera bientôt alimenté par les services de Terra Nova."
            />
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}