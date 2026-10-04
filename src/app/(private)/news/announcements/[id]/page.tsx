"use client";

import { ArrowLeft, Shield, Siren } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnnouncementPriority } from "@/entities/announcement";
import { useAnnouncementQuery } from "@/entities/announcement";
import { useQuickActions } from "@/features/quick-actions/store";
import { formatDateTime } from "@/helpers/format";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { cn } from "@/lib/utils";

const PRIORITY_META: Record<
  AnnouncementPriority,
  { label: string; className: string }
> = {
  low: {
    label: "Priorité faible",
    className:
      "hud-chip bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border border-[var(--dg-border)]",
  },
  normal: {
    label: "Priorité normale",
    className:
      "hud-chip bg-[var(--dg-accent)]/10 text-[var(--dg-accent-bright)]/80 border border-[var(--dg-border-strong)]",
  },
  high: {
    label: "Priorité importante",
    className:
      "hud-chip bg-[#ffb454]/15 text-[#ffb454] border border-[#ffb454]/40",
  },
  urgent: {
    label: "Priorité urgente",
    className:
      "hud-chip bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border border-[var(--dg-danger-border)] shadow-[0_0_10px_var(--dg-danger-glow)]",
  },
};

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40 bg-white/10" />
        <Skeleton className="h-7 w-80 bg-white/10" />
      </div>
      <Skeleton className="h-96 rounded-2xl bg-white/10" />
    </div>
  );
}

function AccessDenied() {
  return (
    <HudPanel
      tone="danger"
      className="flex flex-col items-center justify-center gap-4 p-10"
    >
      <Shield className="h-12 w-12 text-[var(--dg-danger)]" />
      <h2 className="text-lg font-semibold text-[var(--dg-text)]">
        Accès refusé
      </h2>
    </HudPanel>
  );
}

function NotFound() {
  return (
    <HudPanel
      tone="danger"
      className="flex flex-col items-center justify-center gap-4 p-10"
    >
      <h2 className="text-lg font-semibold text-[var(--dg-text)]">
        Annonce introuvable
      </h2>
      <p className="text-sm text-[var(--dg-text-muted)]">
        Cette annonce n&apos;existe pas ou n&apos;est plus disponible.
      </p>
    </HudPanel>
  );
}

export default function AnnouncementDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { isLoading: guardLoading, hasRole } = useRoleGuard();
  const { data: announcement, isLoading, isError } = useAnnouncementQuery(id);
  const openAction = useQuickActions((s) => s.open);

  if (guardLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.CITIZEN)) return <AccessDenied />;
  if (isLoading) return <PageSkeleton />;
  if (isError || !announcement) return <NotFound />;

  const meta =
    PRIORITY_META[announcement.priority] ?? PRIORITY_META.normal;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-[var(--dg-text-muted)] transition-colors hover:text-[var(--dg-accent-bright)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Actualités
        </Link>
      </div>

      <article className="flex flex-col gap-4">
        <header className="flex flex-wrap items-start gap-3">
          <span
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--dg-accent)]/10 text-[var(--dg-accent-bright)]"
          >
            <Siren className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="dg-eyebrow">Annonce publique</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
              {announcement.title}
            </h1>
            <p className="mt-1 text-xs text-[var(--dg-text-faint)]">
              {formatDateTime(
                announcement.publishedAt ?? announcement.createdAt,
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge className={cn("border", meta.className)}>
              {meta.label}
            </Badge>
            {announcement.zone ? (
              <span className="hud-chip border border-[var(--dg-border)] bg-[var(--dg-text-muted)]/15 px-2 py-0.5 text-[10px] text-[var(--dg-text-muted)]">
                {announcement.zone}
              </span>
            ) : null}
          </div>
        </header>

        <HudPanel edge className="flex flex-col gap-4 p-6">
          <p className="text-sm leading-relaxed whitespace-pre-line text-[var(--dg-text)]">
            {announcement.content}
          </p>

          {announcement.ctaLabel ? (
            announcement.ctaUrl ? (
              <a
                href={announcement.ctaUrl}
                className="flex w-fit items-center justify-center gap-2 rounded-xl border border-[var(--dg-accent)]/40 bg-gradient-to-b from-[var(--dg-accent-bright)] to-[var(--dg-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_var(--dg-accent-glow)] transition-all hover:brightness-110"
              >
                {announcement.ctaLabel}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => openAction("contact")}
                className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--dg-accent)]/40 bg-gradient-to-b from-[var(--dg-accent-bright)] to-[var(--dg-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_var(--dg-accent-glow)] transition-all hover:brightness-110"
              >
                {announcement.ctaLabel}
              </button>
            )
          ) : null}
        </HudPanel>
      </article>
    </div>
  );
}