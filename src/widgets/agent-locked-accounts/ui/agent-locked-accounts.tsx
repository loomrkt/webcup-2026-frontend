"use client";

import { Lock, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useLockedAccountsQuery } from "@/entities/security";

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AgentLockedAccounts() {
  const { data, isLoading, isError, refetch } = useLockedAccountsQuery();

  if (isLoading) {
    return <Skeleton className="h-48 rounded-2xl bg-white/10" />;
  }

  if (isError || !data) {
    return (
      <HudPanel edge className="flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-sm text-[var(--dg-text-muted)]">
          Impossible de charger les comptes verrouillés.
        </p>
        <Button
          variant="outline"
          onClick={() => void refetch()}
          className="cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)]"
        >
          <RefreshCcw className="h-4 w-4" />
          Réessayer
        </Button>
      </HudPanel>
    );
  }

  return (
    <HudPanel edge tone="danger" className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-[var(--dg-danger)]" />
        <h2 className="text-sm font-semibold text-[var(--dg-text)]">
          Comptes verrouillés
        </h2>
        <span className="ml-auto text-xs text-[var(--dg-text-faint)]">
          {data.length} actif(s)
        </span>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-[var(--dg-text-faint)]">
          Aucun compte actuellement verrouillé.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {data.map((account) => (
            <li
              key={account.id}
              className="hud-cut flex items-center gap-3 border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)]/40 px-3 py-2.5"
            >
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-white">
                {account.email}
              </span>
              <span className="text-[11px] text-[var(--dg-text-faint)]">
                Verrouillé jusqu&apos;à {formatDateTime(account.lockedUntil)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </HudPanel>
  );
}