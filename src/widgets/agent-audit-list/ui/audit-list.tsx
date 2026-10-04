"use client";

import { FileSearch, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditQuery } from "@/entities/audit";
import { useAuditFiltersStore } from "@/features/audit-filters";
import { Pagination } from "@/widgets/agent-request-list";
import { AuditRow } from "./audit-row";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 rounded-xl bg-white/10" />
      ))}
    </div>
  );
}

export function AuditList() {
  const { q, entityType, action, from, to, page, limit, setPage } =
    useAuditFiltersStore();
  const [actor, setActor] = useState("");

  const { data, isLoading, isError, refetch } = useAuditQuery({
    q: q || undefined,
    entityType: entityType || undefined,
    action: action || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    limit,
  });

  const items = useMemo(() => {
    const all = data?.items ?? [];
    if (!actor) return all;
    return all.filter((event) => event.actorEmail === actor);
  }, [data?.items, actor]);

  const actors = useMemo(() => {
    const set = new Set<string>();
    for (const event of data?.items ?? []) {
      if (event.actorEmail) set.add(event.actorEmail);
    }
    return [...set].sort();
  }, [data?.items]);

  return (
    <HudPanel edge className="flex flex-col gap-4 p-4">
      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-[var(--dg-text-muted)]">
            Impossible de charger le journal d&apos;audit.
          </p>
          <Button
            variant="outline"
            onClick={() => void refetch()}
            className="cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)]"
          >
            <RefreshCcw className="h-4 w-4" />
            Réessayer
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <FileSearch className="h-8 w-8 text-[var(--dg-text-faint)]" />
          <p className="text-sm text-[var(--dg-text-muted)]">
            Aucun événement ne correspond aux critères.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[var(--dg-text-faint)]">
              {data?.meta.total ?? items.length} événement(s) —{" "}
              {actors.length} acteur(s)
            </span>
            {actors.length > 1 && (
              <label className="flex items-center gap-2 text-xs text-[var(--dg-text-faint)]">
                Acteur
                <select
                  value={actor}
                  onChange={(event) => setActor(event.target.value)}
                  className="h-9 cursor-pointer rounded-lg border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-2 text-sm text-[var(--dg-text)] outline-none"
                  aria-label="Filtrer par acteur"
                >
                  <option value="">Tous</option>
                  {actors.map((email) => (
                    <option key={email} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <ul className="flex flex-col gap-2.5" aria-live="polite">
            {items.map((event) => (
              <AuditRow key={event.id} event={event} />
            ))}
          </ul>

          <Pagination
            page={page}
            totalPages={data?.meta.totalPages ?? 1}
            total={data?.meta.total ?? 0}
            onPageChange={setPage}
          />
        </>
      )}
    </HudPanel>
  );
}