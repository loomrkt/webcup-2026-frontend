"use client";

import { CheckCheck, UserRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileCompletionQuery } from "@/entities/profile";
import { cn } from "@/lib/utils";

const MISSING_LABELS: Record<string, string> = {
  firstName: "Prénom",
  lastName: "Nom",
  phone: "Téléphone",
  address: "Adresse",
  city: "Ville",
  emailVerified: "Adresse email vérifiée",
};

export function ProfileCompletion() {
  const { data: completion, isLoading } = useProfileCompletionQuery();

  if (isLoading || !completion) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-20 rounded-2xl bg-white/10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
          <UserRound className="h-4 w-4 text-[var(--dg-accent-bright)]" />
          Complétion du profil
        </p>
        <span className="font-mono text-lg font-bold text-[var(--dg-accent-bright)]">
          {completion.percentage}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={completion.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Complétion du profil"
        className="h-2 overflow-hidden rounded-full bg-[var(--dg-border)]"
      >
        <span
          className="block h-full bg-gradient-to-r from-[var(--dg-accent)] to-[var(--dg-accent-bright)] shadow-[0_0_10px_var(--dg-accent-glow)]"
          style={{ width: `${completion.percentage}%` }}
        />
      </div>

      {completion.complete ? (
        <p className="flex items-center gap-2 text-xs text-[var(--dg-success)]">
          <CheckCheck className="h-4 w-4" />
          Profil complet. Merci !
        </p>
      ) : (
        <div className="flex flex-col gap-1.5 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-3 backdrop-blur">
          <p className="text-[11px] font-semibold tracking-wider text-[var(--dg-text-faint)] uppercase">
            Champs manquants
          </p>
          <ul className="flex flex-col gap-1.5">
            {completion.missing.map((key) => (
              <li
                key={key}
                className="flex items-center gap-2 text-xs text-[var(--dg-text-muted)]"
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    key === "emailVerified"
                      ? "bg-[var(--dg-danger)] shadow-[0_0_6px_var(--dg-danger-glow)]"
                      : "bg-[#ffb454]",
                  )}
                />
                {MISSING_LABELS[key] ?? key}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}