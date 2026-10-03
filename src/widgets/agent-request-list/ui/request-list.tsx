"use client";

import { FileSearch, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequestFiltersStore } from "@/features/request-filters";
import type { Request } from "@/entities/request";
import { useRequestsQuery } from "@/entities/request";
import { Pagination } from "./pagination";
import { PriorityBadge } from "./priority-badge";
import { StatusBadge } from "./status-badge";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function citizenLabel(request: Request) {
  const { firstName, lastName, email } = request.citizen;
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(" ").trim();
  }
  return email;
}

function latestActivity(request: Request) {
  const history = request.history ?? [];
  if (history.length === 0) return null;
  return [...history].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )[0];
}

function RequestRow({ request }: { request: Request }) {
  const latest = latestActivity(request);
  return (
    <li className="hud-cut flex flex-col gap-2 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 backdrop-blur transition-colors hover:border-[var(--dg-border-strong)] hover:bg-[var(--dg-bg-card-hover)]">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/agent/requests/${request.id}`}
          className="group/link inline-flex min-w-0 items-center gap-2"
        >
          <span className="font-mono text-xs font-semibold text-[var(--dg-accent-bright)]">
            {request.ref}
          </span>
          <span className="truncate text-[13.5px] font-medium text-white transition-colors group-hover/link:text-[var(--dg-accent-bright)]">
            {request.title}
          </span>
        </Link>
        <span className="ml-auto flex shrink-0 flex-wrap gap-1.5">
          <StatusBadge status={request.status} />
          <PriorityBadge priority={request.priority} />
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--dg-text-faint)]">
        <span>{citizenLabel(request)}</span>
        {request.category ? <span>{request.category}</span> : null}
        <span>
          Créée le {formatDate(request.createdAt)}
        </span>
        {request.assignedTo ? (
          <span>
            Assignée à :{" "}
            {request.assignedTo.firstName ?? request.assignedTo.email}
          </span>
        ) : null}
        {latest?.comment ? (
          <span className="truncate italic">
            « {latest.comment} »
          </span>
        ) : null}
      </div>
    </li>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 rounded-xl bg-white/10" />
      ))}
    </div>
  );
}

export function AgentRequestList() {
  const status = useRequestFiltersStore((s) => s.status);
  const priority = useRequestFiltersStore((s) => s.priority);
  const page = useRequestFiltersStore((s) => s.page);
  const limit = useRequestFiltersStore((s) => s.limit);
  const setPage = useRequestFiltersStore((s) => s.setPage);

  const { data, isLoading, isError, refetch, isFetching } = useRequestsQuery({
    status: status || undefined,
    priority: priority || undefined,
    page,
    limit,
  });

  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <HudPanel edge className="flex flex-col gap-4 p-4">
      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-[var(--dg-text-muted)]">
            Impossible de charger les demandes.
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
            Aucune demande ne correspond aux critères.
          </p>
        </div>
      ) : (
        <>
          <ul
            aria-live="polite"
            className="flex flex-col gap-2.5"
            aria-busy={isFetching}
          >
            {items.map((request) => (
              <RequestRow key={request.id} request={request} />
            ))}
          </ul>
          {meta ? (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              onPageChange={setPage}
            />
          ) : null}
        </>
      )}
    </HudPanel>
  );
}