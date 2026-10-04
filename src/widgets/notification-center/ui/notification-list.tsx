"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useMarkReadMutation,
  useNotificationsQuery,
} from "@/entities/notification";
import { cn } from "@/lib/utils";
import {
  formatRelativeTime,
  notificationPayloadUrl,
  NOTIFICATION_TYPE_LABELS,
  typeBadgeClass,
} from "../model/notification-meta";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-20 rounded-xl bg-white/10" />
      ))}
    </div>
  );
}

export function NotificationList() {
  const { data, isLoading } = useNotificationsQuery({ limit: 50 });
  const markRead = useMarkReadMutation();

  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--dg-text-faint)]">
          {data?.meta.total ?? 0} notification(s)
        </span>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--dg-text-faint)]">
          Aucune notification.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((notification) => {
            const unread = !notification.readAt;
            const url = notificationPayloadUrl(notification);
            return (
              <li key={notification.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (unread) {
                      void markRead.mutate({ id: notification.id, read: true });
                    }
                  }}
                  className={cn(
                    "hud-cut w-full border text-left backdrop-blur transition-colors",
                    unread
                      ? "border-[var(--dg-accent)]/40 bg-[var(--dg-accent)]/10 hover:bg-[var(--dg-accent)]/15"
                      : "border-[var(--dg-border)] bg-[var(--dg-bg-card)] hover:bg-[var(--dg-bg-card-hover)]",
                  )}
                >
                  <div className="flex flex-col gap-1 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-[11px] text-[var(--dg-text-muted)]">
                        <span className={cn("hud-chip border px-1.5 py-0.5 text-[10px]", typeBadgeClass(notification.type))}>
                          {NOTIFICATION_TYPE_LABELS[notification.type]}
                        </span>
                        {unread ? (
                          <span className="size-1.5 rounded-full bg-[var(--dg-accent-bright)] shadow-[0_0_6px_var(--dg-accent-glow)]" />
                        ) : null}
                      </span>
                      <span className="ml-auto text-[10px] text-[var(--dg-text-faint)]">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                    </div>
                    <span className="text-[13px] font-medium text-white">
                      {notification.title}
                    </span>
                    <span className="text-xs leading-relaxed text-[var(--dg-text-muted)] line-clamp-3">
                      {notification.body}
                    </span>
                    {url ? (
                      <span className="text-[11px] text-[var(--dg-accent-bright)]">
                        {url}
                      </span>
                    ) : null}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}