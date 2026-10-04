"use client";

import { Archive, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllAnnouncementsQuery,
  useDeleteAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "@/entities/announcement";
import { cn } from "@/lib/utils";
import {
  ANNOUNCEMENT_STATUS_BADGE,
  ANNOUNCEMENT_STATUS_LABELS,
  ANNOUNCEMENT_PRIORITY_LABELS,
  formatDateTime,
} from "../model/announcement-meta";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-20 rounded-xl bg-white/10" />
      ))}
    </div>
  );
}

export function AnnouncementManager() {
  const { data: announcements, isLoading, isError, refetch } =
    useAllAnnouncementsQuery();
  const update = useUpdateAnnouncementMutation();
  const remove = useDeleteAnnouncementMutation();
  const [busy, setBusy] = useState<string | null>(null);

  if (isLoading) return <ListSkeleton />;
  if (isError || !announcements) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-[var(--dg-text-muted)]">
          Impossible de charger les annonces.
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
        {announcements.length} annonce(s) au total
      </p>

      {announcements.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--dg-text-faint)]">
          Aucune annonce pour le moment.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {announcements.map((announcement) => (
            <li
              key={announcement.id}
              className="hud-cut border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 backdrop-blur transition-colors hover:border-[var(--dg-border-strong)] hover:bg-[var(--dg-bg-card-hover)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 text-[13.5px] font-medium text-white">
                  {announcement.title}
                </span>
                <span className="hud-chip border border-[var(--dg-border)] bg-[var(--dg-text-muted)]/15 px-2 py-0.5 text-[10px] text-[var(--dg-text-muted)]">
                  {ANNOUNCEMENT_PRIORITY_LABELS[announcement.priority]}
                </span>
                <span
                  className={cn(
                    "hud-chip border px-2 py-0.5 text-[10px]",
                    ANNOUNCEMENT_STATUS_BADGE[announcement.status],
                  )}
                >
                  {ANNOUNCEMENT_STATUS_LABELS[announcement.status]}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--dg-text-faint)]">
                <span>{announcement.zone ?? "Toute la ville"}</span>
                <span>Créée le {formatDateTime(announcement.createdAt)}</span>
                {announcement.publishedAt ? (
                  <span>
                    Publiée le {formatDateTime(announcement.publishedAt)}
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-xs leading-relaxed text-[var(--dg-text-muted)] line-clamp-2">
                {announcement.content}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {announcement.status === "draft" ? (
                  <Button
                    size="sm"
                    disabled={busy === announcement.id}
                    onClick={() => {
                      setBusy(announcement.id);
                      update.mutate(
                        {
                          id: announcement.id,
                          input: { status: "published" },
                        },
                        { onSettled: () => setBusy(null) },
                      );
                    }}
                    className="dg-btn-accent cursor-pointer"
                  >
                    {busy === announcement.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Archive className="h-3.5 w-3.5" />
                    )}
                    Publier
                  </Button>
                ) : null}
                {announcement.status === "published" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === announcement.id}
                    onClick={() => {
                      setBusy(announcement.id);
                      update.mutate(
                        {
                          id: announcement.id,
                          input: { status: "archived" },
                        },
                        { onSettled: () => setBusy(null) },
                      );
                    }}
                    className="cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)] hover:text-[var(--dg-accent-bright)]"
                  >
                    Archiver
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busy === announcement.id}
                  onClick={() => {
                    if (
                      !confirm("Supprimer définitivement cette annonce ?")
                    ) {
                      return;
                    }
                    setBusy(announcement.id);
                    remove.mutate(announcement.id, {
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