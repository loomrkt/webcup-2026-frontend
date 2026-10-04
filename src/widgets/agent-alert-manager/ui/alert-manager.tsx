"use client";

import { Loader2, Megaphone, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllAlertsQuery,
  useDeleteAlertMutation,
  useDiffuseAlertMutation,
  useUpdateAlertMutation,
} from "@/entities/alert";
import { cn } from "@/lib/utils";
import {
  ALERT_CRITICALITY_BADGE,
  ALERT_CRITICALITY_LABELS,
  ALERT_STATUS_BADGE,
  ALERT_STATUS_LABELS,
  formatDateTime,
} from "../model/alert-meta";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-20 rounded-xl bg-white/10" />
      ))}
    </div>
  );
}

export function AlertManager() {
  const { data: alerts, isLoading, isError, refetch } = useAllAlertsQuery();
  const diffuse = useDiffuseAlertMutation();
  const resolve = useUpdateAlertMutation();
  const remove = useDeleteAlertMutation();
  const [busy, setBusy] = useState<string | null>(null);

  if (isLoading) return <ListSkeleton />;
  if (isError || !alerts) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-[var(--dg-text-muted)]">
          Impossible de charger les alertes.
        </p>
        <Button
          variant="outline"
          onClick={() => void refetch()}
          className="cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)]"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-[var(--dg-text-faint)]">
        {alerts.length} alerte(s) au total
      </p>

      {alerts.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--dg-text-faint)]">
          Aucune alerte pour le moment.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className="hud-cut border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 backdrop-blur transition-colors hover:border-[var(--dg-border-strong)] hover:bg-[var(--dg-bg-card-hover)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 text-[13.5px] font-medium text-white">
                  {alert.title}
                </span>
                <span
                  className={cn(
                    "hud-chip border px-2 py-0.5 text-[10px]",
                    ALERT_CRITICALITY_BADGE[alert.criticality],
                  )}
                >
                  {ALERT_CRITICALITY_LABELS[alert.criticality]}
                </span>
                <span
                  className={cn(
                    "hud-chip border px-2 py-0.5 text-[10px]",
                    ALERT_STATUS_BADGE[alert.status],
                  )}
                >
                  {ALERT_STATUS_LABELS[alert.status]}
                </span>
                {alert.aiGenerated ? (
                  <span className="hud-chip border border-[var(--dg-accent)]/40 bg-[var(--dg-accent)]/15 px-2 py-0.5 text-[10px] text-[var(--dg-accent-bright)]">
                    IA
                  </span>
                ) : null}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--dg-text-faint)]">
                <span>{alert.zone ?? "Toute la ville"}</span>
                <span>Créée le {formatDateTime(alert.createdAt)}</span>
                {alert.publishedAt ? (
                  <span>Diffusée le {formatDateTime(alert.publishedAt)}</span>
                ) : null}
              </div>

              <p className="mt-2 text-xs leading-relaxed text-[var(--dg-text-muted)] line-clamp-2">
                {alert.message}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {alert.status === "draft" ? (
                  <Button
                    size="sm"
                    disabled={busy === alert.id}
                    onClick={() => {
                      setBusy(alert.id);
                      diffuse.mutate(alert.id, {
                        onSettled: () => setBusy(null),
                      });
                    }}
                    className="dg-btn-accent cursor-pointer"
                  >
                    {busy === alert.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Megaphone className="h-3.5 w-3.5" />
                    )}
                    Diffuser
                  </Button>
                ) : null}
                {alert.status === "active" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === alert.id}
                    onClick={() => {
                      setBusy(alert.id);
                      resolve.mutate(
                        { id: alert.id, input: { status: "resolved" } },
                        { onSettled: () => setBusy(null) },
                      );
                    }}
                    className="cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)] hover:text-[var(--dg-accent-bright)]"
                  >
                    Résoudre
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busy === alert.id}
                  onClick={() => {
                    if (!confirm("Supprimer définitivement cette alerte ?")) {
                      return;
                    }
                    setBusy(alert.id);
                    remove.mutate(alert.id, {
                      onSettled: () => setBusy(null),
                    });
                  }}
                  className="cursor-pointer text-[var(--dg-danger)] hover:bg-[var(--dg-danger-soft)]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Supprimer
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}