"use client";

import { FileSearch, RefreshCcw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useSecurityEventsQuery } from "@/entities/security";
import { Pagination } from "@/widgets/agent-request-list";
import {
  SECURITY_EVENT_LABELS,
  SecurityEventRow,
} from "./security-event-row";

const EVENT_TYPES = Object.keys(SECURITY_EVENT_LABELS);

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 rounded-xl bg-white/10" />
      ))}
    </div>
  );
}

export function AgentSecurityEvents() {
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useSecurityEventsQuery({
    type: type || undefined,
    email: email || undefined,
    page,
    limit: 20,
  });

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const users = useMemo(() => {
    const set = new Set<string>();
    for (const event of items) {
      if (event.email) set.add(event.email);
    }
    return [...set].sort();
  }, [items]);

  return (
    <HudPanel edge className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <ShieldCheck
          aria-hidden
          className="size-4 text-[var(--dg-accent-bright)]"
        />
        <label className="flex items-center gap-2 text-xs text-[var(--dg-text-faint)]">
          Type
          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value);
              setPage(1);
            }}
            className="h-9 cursor-pointer rounded-lg border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-2 text-sm text-[var(--dg-text)] outline-none"
            aria-label="Filtrer par type d'événement"
          >
            <option value="">Tous</option>
            {EVENT_TYPES.map((key) => (
              <option key={key} value={key}>
                {SECURITY_EVENT_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
        {users.length > 1 && (
          <label className="flex items-center gap-2 text-xs text-[var(--dg-text-faint)]">
            Compte
            <select
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setPage(1);
              }}
              className="h-9 cursor-pointer rounded-lg border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-2 text-sm text-[var(--dg-text)] outline-none"
              aria-label="Filtrer par compte"
            >
              <option value="">Tous</option>
              {users.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        )}
        <span className="text-xs text-[var(--dg-text-faint)]">
          {data?.meta.total ?? 0} événement(s)
        </span>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-[var(--dg-text-muted)]">
            Impossible de charger les événements de sécurité.
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
          <ul className="flex flex-col gap-2.5" aria-live="polite">
            {items.map((event) => (
              <SecurityEventRow key={event.id} event={event} />
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