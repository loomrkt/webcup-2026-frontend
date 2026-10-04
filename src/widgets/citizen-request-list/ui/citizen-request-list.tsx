"use client";

import { FileSearch, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequestFiltersStore } from "@/features/request-filters";
import { useQuickActions } from "@/features/quick-actions/store";
import type { Request } from "@/entities/request";
import { useMyRequestsQuery } from "@/entities/request";
import { formatDate } from "@/helpers/format";
import {
  Pagination,
  PriorityBadge,
  StatusBadge,
} from "@/widgets/agent-request-list";

function RequestRow({ request }: { request: Request }) {
  const latest =
    request.history && request.history.length > 0
      ? [...request.history].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        )[0]
      : null;

  return (
    <li className="hud-cut flex flex-col gap-2 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 backdrop-blur transition-colors hover:border-[var(--dg-accent)]/40 hover:bg-[var(--dg-bg-card-hover)]">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/requests/${request.id}`}
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
        {request.service?.name ? <span>{request.service.name}</span> : null}
        {request.category ? <span>{request.category}</span> : null}
        <span>Déposée le {formatDate(request.createdAt)}</span>
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

export function CitizenRequestList() {
  const status = useRequestFiltersStore((s) => s.status);
  const priority = useRequestFiltersStore((s) => s.priority);
  const page = useRequestFiltersStore((s) => s.page);
  const limit = useRequestFiltersStore((s) => s.limit);
  const setPage = useRequestFiltersStore((s) => s.setPage);
  const openAction = useQuickActions((s) => s.open);

  const { data, isLoading, isError, refetch, isFetching } = useMyRequestsQuery({
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
        <EmptyState
          icon={<RefreshCcw className="h-6 w-6" />}
          title="Impossible de charger vos demandes"
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
      ) : items.length === 0 ? (
        <EmptyState
          icon={<FileSearch className="h-6 w-6" />}
          title={
            status || priority
              ? "Aucune demande ne correspond aux critères"
              : "Aucune demande pour le moment"
          }
          description={
            status || priority
              ? "Modifiez vos filtres pour retrouver vos demandes."
              : "Signalez un problème ou lancez une démarche pour voir vos demandes ici."
          }
          actions={
            !status && !priority ? (
              <Button
                onClick={() => openAction("report")}
                className="dg-btn-accent h-11 w-fit cursor-pointer"
              >
                Signaler un problème
              </Button>
            ) : null
          }
        />
      ) : (
        <>
          <ul
            aria-live="polite"
            aria-busy={isFetching}
            className="flex flex-col gap-2.5"
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