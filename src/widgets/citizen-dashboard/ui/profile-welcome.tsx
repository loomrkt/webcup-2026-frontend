"use client";

import { FilePlus2, UserRound } from "lucide-react";
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

  const identity = profile.profile;
  const firstName = identity.firstName?.trim() || profile.email.split("@")[0];
  const lastName = identity.lastName?.trim() ?? "";
  const initials = (
    (firstName[0] ?? "") + (lastName[0] ?? "")
  ).toUpperCase() || profile.email[0].toUpperCase();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--dg-accent-bright)] to-[var(--dg-accent-deep)] font-mono text-sm font-bold text-white shadow-[0_0_16px_var(--dg-accent-glow)]"
          >
            {initials}
          </span>
          <div className="min-w-0">
            <p className="dg-eyebrow">Bienvenue sur Terra Nova</p>
            <h1 className="mt-0.5 truncate text-2xl font-bold tracking-tight text-[var(--dg-text)]">
              Bonjour {firstName}
            </h1>
          </div>
        </div>

        <Link
          href="/requests/new"
          className="dg-btn-accent inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-transform duration-300 hover:scale-[1.02]"
        >
          <FilePlus2 className="h-4 w-4" />
          Nouvelle démarche
        </Link>
      </div>

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
            href="/account?tab=profile"
            className="text-xs font-medium text-[var(--dg-accent-bright)] transition-colors hover:underline"
          >
            Compléter mon profil
          </Link>
        </div>
      ) : null}
    </div>
  );
}