"use client";

import { ArrowLeft, Newspaper, Shield } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicationQuery } from "@/entities/news";
import { formatDateTime } from "@/helpers/format";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";

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
        Publication introuvable
      </h2>
      <p className="text-sm text-[var(--dg-text-muted)]">
        Cette publication n&apos;existe pas ou n&apos;est plus disponible.
      </p>
    </HudPanel>
  );
}

export default function PublicationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { isLoading: guardLoading, hasRole } = useRoleGuard();
  const { data: publication, isLoading, isError } = usePublicationQuery(id);

  if (guardLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.CITIZEN)) return <AccessDenied />;
  if (isLoading) return <PageSkeleton />;
  if (isError || !publication) return <NotFound />;

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
            <Newspaper className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="dg-eyebrow">Publication officielle</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
              {publication.title}
            </h1>
            <p className="mt-1 text-xs text-[var(--dg-text-faint)]">
              {formatDateTime(publication.publishedAt ?? publication.createdAt)}
            </p>
          </div>
        </header>

        <HudPanel edge className="flex flex-col gap-4 p-6">
          {publication.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={publication.coverImage}
              alt=""
              className="h-56 w-full rounded-2xl object-cover"
            />
          ) : null}
          <p className="text-sm leading-relaxed whitespace-pre-line text-[var(--dg-text)]">
            {publication.content}
          </p>
        </HudPanel>
      </article>
    </div>
  );
}