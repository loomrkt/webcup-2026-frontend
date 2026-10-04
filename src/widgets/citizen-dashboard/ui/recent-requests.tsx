"use client";

import { ArrowRight, Inbox } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyRequestsQuery } from "@/entities/request";
import { useQuickActions } from "@/features/quick-actions/store";
import { formatDate } from "@/helpers/format";
import { StatusBadge } from "@/widgets/agent-request-list";

export function RecentRequests() {
  const { data, isLoading } = useMyRequestsQuery({ limit: 5 });
  const openAction = useQuickActions((s) => s.open);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-2.5">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-12 rounded-xl bg-white/10" />
        ))}
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-5 w-5" />}
        title="Aucune démarche pour le moment"
        description="Lancez votre première démarche ou signalez un problème en quelques clics."
        actions={
          <button
            type="button"
            onClick={() => openAction("report")}
            className="dg-btn-accent inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            Commencer une démarche
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        }
        className="py-8"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {data.items.map((request) => (
        <Link
          key={request.id}
          href={`/requests/${request.id}`}
          className="hud-cut group flex items-center gap-3 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-3 py-2.5 backdrop-blur transition-colors hover:border-[var(--dg-accent)]/40 hover:bg-[var(--dg-bg-card-hover)]"
        >
          <span className="font-mono text-[11px] font-semibold text-[var(--dg-accent-bright)]">
            {request.ref}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-white transition-colors group-hover:text-[var(--dg-accent-bright)]">
            {request.title}
          </span>
          <span className="text-[11px] text-[var(--dg-text-faint)]">
            {formatDate(request.createdAt)}
          </span>
          <StatusBadge status={request.status} />
          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--dg-text-faint)] group-hover:text-[var(--dg-accent-bright)]" />
        </Link>
      ))}
    </div>
  );
}