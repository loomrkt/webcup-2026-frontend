"use client";

import {
  ArrowUpRight,
  Bell,
  Boxes,
  Inbox,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotificationsQuery } from "@/entities/notification";
import { useProfileCompletionQuery } from "@/entities/profile";
import { useMyRequestsQuery } from "@/entities/request";
import { useFeaturedServicesQuery } from "@/entities/service";
import { cn } from "@/lib/utils";

type StatTone = "accent" | "danger" | "success";

const TONE: Record<StatTone, string> = {
  accent: "bg-[var(--dg-accent)]/10 text-[var(--dg-accent-bright)]",
  danger: "bg-[var(--dg-danger-soft)] text-[var(--dg-danger)]",
  success: "bg-[var(--dg-success-soft)] text-[var(--dg-success)]",
};

function StatCard({
  href,
  icon,
  label,
  value,
  tone = "accent",
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tone?: StatTone;
}) {
  const content = (
    <div className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-4 backdrop-blur transition-colors duration-300 hover:border-[var(--dg-accent-border)] hover:bg-[var(--dg-bg-card-hover)]">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-[var(--dg-accent)] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-25"
      />
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            TONE[tone],
          )}
        >
          {icon}
        </span>
        {href ? (
          <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--dg-text-faint)] transition-colors duration-300 group-hover:text-[var(--dg-accent-bright)]" />
        ) : null}
      </div>
      <div className="min-w-0">
        <p className="font-mono text-2xl leading-none font-bold text-white tabular-nums">
          {value}
        </p>
        <p className="mt-1.5 text-xs font-medium text-[var(--dg-text-muted)]">
          {label}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

function StatCardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-4">
      <Skeleton className="size-9 rounded-lg bg-white/10" />
      <Skeleton className="h-6 w-14 bg-white/10" />
      <Skeleton className="h-3 w-24 bg-white/10" />
    </div>
  );
}

export function DashboardStats() {
  const requests = useMyRequestsQuery({ limit: 1 });
  const notifications = useNotificationsQuery({ limit: 1 });
  const services = useFeaturedServicesQuery();
  const completion = useProfileCompletionQuery();

  const unreadCount = notifications.data?.meta.unreadCount ?? 0;
  const profileComplete = completion.data?.complete ?? false;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {requests.isLoading || !requests.data ? (
        <StatCardSkeleton />
      ) : (
        <StatCard
          href="/requests"
          icon={<Inbox className="h-4 w-4" />}
          label="Mes démarches"
          value={requests.data.meta.total}
        />
      )}

      {notifications.isLoading || !notifications.data ? (
        <StatCardSkeleton />
      ) : (
        <StatCard
          icon={<Bell className="h-4 w-4" />}
          label="Notifications non lues"
          value={unreadCount}
          tone={unreadCount > 0 ? "danger" : "success"}
        />
      )}

      {services.isLoading || !services.data ? (
        <StatCardSkeleton />
      ) : (
        <StatCard
          href="/services"
          icon={<Boxes className="h-4 w-4" />}
          label="Services en avant"
          value={services.data.length}
        />
      )}

      {completion.isLoading || !completion.data ? (
        <StatCardSkeleton />
      ) : (
        <StatCard
          href="/account?tab=profile"
          icon={<UserRound className="h-4 w-4" />}
          label="Profil complété"
          value={`${completion.data.percentage}%`}
          tone={profileComplete ? "success" : "accent"}
        />
      )}
    </div>
  );
}