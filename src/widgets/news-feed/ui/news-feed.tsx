"use client";

import {
  Newspaper,
  RefreshCcw,
  ScrollText,
  Siren,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { HubTabs, type HubTab } from "@/components/ui/hub-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { Announcement, AnnouncementPriority } from "@/entities/announcement";
import {
  usePublicAnnouncementsQuery,
} from "@/entities/announcement";
import type { Publication } from "@/entities/news";
import { usePublicationsQuery } from "@/entities/news";
import { formatDate } from "@/helpers/format";
import { cn } from "@/lib/utils";

const ANNOUNCEMENT_PRIORITY_META: Record<
  AnnouncementPriority,
  { label: string; className: string }
> = {
  low: {
    label: "Faible",
    className:
      "hud-chip bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border border-[var(--dg-border)]",
  },
  normal: {
    label: "Normale",
    className:
      "hud-chip bg-[var(--dg-accent)]/10 text-[var(--dg-accent-bright)]/80 border border-[var(--dg-border-strong)]",
  },
  high: {
    label: "Importante",
    className:
      "hud-chip bg-[#ffb454]/15 text-[#ffb454] border border-[#ffb454]/40",
  },
  urgent: {
    label: "Urgente",
    className:
      "hud-chip bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border border-[var(--dg-danger-border)] shadow-[0_0_10px_var(--dg-danger-glow)]",
  },
};

type Tab = "news" | "announcements";

const NEWS_TABS: HubTab[] = [
  { key: "news", label: "Publications", icon: Newspaper },
  { key: "announcements", label: "Annonces publiques", icon: Siren },
];

function PublicationCard({ publication }: { publication: Publication }) {
  return (
    <Link
      href={`/news/${publication.id}`}
      className="hud-cut group flex flex-col gap-2.5 rounded-2xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-4 backdrop-blur transition-all hover:border-[var(--dg-accent)]/40 hover:bg-[var(--dg-bg-card-hover)]"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--dg-accent)]/10 text-[var(--dg-accent-bright)]"
        >
          <Newspaper className="h-4.5 w-4.5" />
        </span>
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-white transition-colors group-hover:text-[var(--dg-accent-bright)]">
          {publication.title}
        </h3>
      </div>
      {publication.summary ? (
        <p className="line-clamp-3 text-xs leading-relaxed text-[var(--dg-text-muted)]">
          {publication.summary}
        </p>
      ) : null}
      <span className="text-xs font-medium text-[var(--dg-accent-bright)] group-hover:underline">
        Lire l&apos;article
      </span>
    </Link>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const meta =
    ANNOUNCEMENT_PRIORITY_META[announcement.priority] ??
    ANNOUNCEMENT_PRIORITY_META.normal;
  return (
    <Link
      href={`/news/announcements/${announcement.id}`}
      className="hud-cut group flex flex-col gap-2.5 rounded-2xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-4 backdrop-blur transition-all hover:border-[var(--dg-accent)]/40 hover:bg-[var(--dg-bg-card-hover)]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--dg-accent)]/10 text-[var(--dg-accent-bright)]"
        >
          <Siren className="h-4.5 w-4.5" />
        </span>
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-white transition-colors group-hover:text-[var(--dg-accent-bright)]">
          {announcement.title}
        </h3>
        <Badge className={cn("border", meta.className)}>{meta.label}</Badge>
      </div>
      <p className="line-clamp-3 text-xs leading-relaxed text-[var(--dg-text-muted)]">
        {announcement.content}
      </p>
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--dg-text-faint)]">
        {announcement.zone ? <span>Zone : {announcement.zone}</span> : null}
        <span>
          {announcement.publishedAt
            ? `Publiée le ${formatDate(announcement.publishedAt)}`
            : `Créée le ${formatDate(announcement.createdAt)}`}
        </span>
      </div>
    </Link>
  );
}

function FeedSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-32 rounded-2xl bg-white/10" />
      ))}
    </div>
  );
}

export function NewsFeed() {
  const [tab, setTab] = useState<Tab>("news");
  const publications = usePublicationsQuery();
  const announcements = usePublicAnnouncementsQuery();

  const publicationsLoading = publications.isLoading;
  const publicationsError = publications.isError;

  return (
    <div className="flex flex-col gap-5">
      <HubTabs
        tabs={NEWS_TABS}
        active={tab}
        onChange={(key) => setTab(key as Tab)}
      />

      {tab === "news" ? (
        publicationsLoading ? (
          <FeedSkeleton />
        ) : publicationsError ? (
          <EmptyState
            icon={<RefreshCcw className="h-6 w-6" />}
            title="Impossible de charger les publications"
            description="Une erreur est survenue. Réessayez dans quelques instants."
            actions={
              <Button
                variant="outline"
                onClick={() => void publications.refetch()}
                className="cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)]"
              >
                <RefreshCcw className="h-4 w-4" />
                Réessayer
              </Button>
            }
          />
        ) : publications.data && publications.data.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {publications.data.map((publication) => (
              <PublicationCard
                key={publication.id}
                publication={publication}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Newspaper className="h-6 w-6" />}
            title="Aucune publication pour le moment"
            description="Les actualités de Terra Nova apparaîtront ici dès leur publication."
          />
        )
      ) : announcements.isLoading ? (
        <FeedSkeleton />
      ) : announcements.isError ? (
        <EmptyState
          icon={<RefreshCcw className="h-6 w-6" />}
          title="Impossible de charger les annonces"
          description="Une erreur est survenue. Réessayez dans quelques instants."
          actions={
            <Button
              variant="outline"
              onClick={() => void announcements.refetch()}
              className="cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)]"
            >
              <RefreshCcw className="h-4 w-4" />
              Réessayer
            </Button>
          }
        />
      ) : announcements.data && announcements.data.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {announcements.data.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ScrollText className="h-6 w-6" />}
          title="Aucune annonce en cours"
          description="Les annonces publiques du Haut Conseil apparaîtront ici."
        />
      )}
    </div>
  );
}