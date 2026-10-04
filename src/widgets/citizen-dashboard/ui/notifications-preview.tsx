"use client";

import { Bell } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotificationsQuery } from "@/entities/notification";
import { formatDate } from "@/helpers/format";
import { cn } from "@/lib/utils";

export function NotificationsPreview() {
  const { data, isLoading } = useNotificationsQuery({ limit: 5 });

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
        icon={<Bell className="h-5 w-5" />}
        title="Aucune notification"
        description="Les nouvelles notifications apparaîtront ici dès qu'elles arrivent."
        className="py-8"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {data.items.map((notification) => (
        <div
          key={notification.id}
          className="hud-cut flex items-start gap-3 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-3 backdrop-blur"
        >
          <span
            aria-hidden
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              notification.readAt
                ? "bg-[var(--dg-text-muted)]/10 text-[var(--dg-text-faint)]"
                : "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] shadow-[0_0_10px_var(--dg-accent-glow)]",
            )}
          >
            <Bell className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--dg-text)]">
              {notification.title}
            </p>
            <p className="mt-0.5 line-clamp-2 text-xs text-[var(--dg-text-muted)]">
              {notification.body}
            </p>
            <p className="mt-1 text-[11px] text-[var(--dg-text-faint)]">
              {formatDate(notification.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}