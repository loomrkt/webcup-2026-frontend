"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, CircleAlert, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { debounce } from "@/lib/debounce-utils";
import { useGlossary } from "../hooks/use-glossary";

function GlossarySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-12 rounded-xl bg-white/10" />
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-24 rounded-2xl bg-white/10" />
      ))}
    </div>
  );
}

export function GlossaryExplorer() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const update = debounce((value: string) => setDebouncedQuery(value), 300);
    update(query);
  }, [query]);

  const { data, isLoading, isError, refetch } = useGlossary(
    debouncedQuery.trim() || undefined,
  );

  const groups = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, typeof data>();
    for (const term of data) {
      const category = term.category?.trim() || "Général";
      const list = map.get(category) ?? [];
      list.push(term);
      map.set(category, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, "fr"));
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dg-text-faint)]"
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un terme…"
          aria-label="Rechercher un terme du glossaire"
          className="pl-9!"
        />
      </div>

      {isLoading ? (
        <GlossarySkeleton />
      ) : isError ? (
        <HudPanel
          tone="danger"
          className="flex flex-col items-center gap-3 p-8 text-center"
        >
          <CircleAlert aria-hidden className="h-8 w-8 text-[var(--dg-danger)]" />
          <p className="text-sm text-[var(--dg-text-muted)]">
            Impossible de charger le glossaire.
          </p>
          <Button variant="outline" onClick={() => void refetch()}>
            Réessayer
          </Button>
        </HudPanel>
      ) : data?.length === 0 ? (
        <HudPanel className="flex flex-col items-center gap-2 p-8 text-center">
          <BookOpen aria-hidden className="h-8 w-8 text-[var(--dg-text-faint)]" />
          <p className="text-sm text-[var(--dg-text-muted)]">
            {debouncedQuery.trim()
              ? "Aucun terme ne correspond à votre recherche."
              : "Aucun terme dans le glossaire pour le moment."}
          </p>
        </HudPanel>
      ) : (
        groups.map(([category, terms]) => (
          <HudPanel key={category} className="p-5">
            <h2 className="dg-eyebrow mb-3">{category}</h2>
            <dl className="flex flex-col divide-y divide-[var(--dg-border)]">
              {terms.map((term) => (
                <div key={term.id} className="flex flex-col gap-1 py-3">
                  <dt className="text-sm font-semibold text-[var(--dg-text)]">
                    {term.term}
                  </dt>
                  <dd className="text-sm leading-relaxed text-[var(--dg-text-muted)]">
                    {term.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </HudPanel>
        ))
      )}
    </div>
  );
}