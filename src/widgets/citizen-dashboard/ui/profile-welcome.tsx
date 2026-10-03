"use client";

import { UserRound } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileCompletionQuery, useProfileQuery } from "@/entities/profile";

export function ProfileWelcome() {
  const { data: profile, isLoading } = useProfileQuery();
  const { data: completion } = useProfileCompletionQuery();

  if (isLoading || !profile) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-7 w-72 bg-white/10" />
        <Skeleton className="h-3.5 w-96 bg-white/10" />
      </div>
    );
  }

  const firstName =
    profile.profile.firstName?.trim() || profile.email.split("@")[0];

  return (
    <div className="flex flex-col gap-2">
      <p className="dg-eyebrow">Bienvenue sur Terra Nova</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
        Bonjour {firstName}
      </h1>

      {completion && !completion.complete ? (
        <div className="flex flex-col gap-2 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-3 backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs text-[var(--dg-text-muted)]">
              <UserRound className="h-3.5 w-3.5 text-[var(--dg-accent-bright)]" />
              Complétion du profil
            </p>
            <span className="font-mono text-xs font-semibold text-[var(--dg-accent-bright)]">
              {completion.percentage}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={completion.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Complétion du profil"
            className="h-1.5 overflow-hidden rounded-full bg-[var(--dg-border)]"
          >
            <span
              className="block h-full bg-gradient-to-r from-[var(--dg-accent)] to-[var(--dg-accent-bright)] shadow-[0_0_8px_var(--dg-accent-glow)]"
              style={{ width: `${completion.percentage}%` }}
            />
          </div>
          <Link
            href="/profile"
            className="text-xs font-medium text-[var(--dg-accent-bright)] transition-colors hover:underline"
          >
            Compléter mon profil
          </Link>
        </div>
      ) : null}
    </div>
  );
}