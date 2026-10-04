import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStatsQuery } from "@/entities/dashboard";
import { STATUS_LABELS } from "@/entities/request";
import { StatusBadge } from "@/widgets/agent-request-list";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <HudPanel edge className="flex min-w-0 flex-col gap-3 p-4">
      <h2 className="text-sm font-semibold text-[var(--dg-text)]">{title}</h2>
      {children}
    </HudPanel>
  );
}

function Empty() {
  return <p className="text-sm text-[var(--dg-text-faint)]">Aucune donnée.</p>;
}

export function DashboardRecentActivity() {
  const { data, isLoading } = useDashboardStatsQuery();

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-2xl bg-white/10" />
        <Skeleton className="h-64 rounded-2xl bg-white/10" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Section title="Dernières demandes">
        {data.recentRequests.length === 0 ? (
          <Empty />
        ) : (
          <ul className="flex flex-col gap-2">
            {data.recentRequests.map((request) => (
              <li
                key={request.id}
                className="flex items-center gap-2 border-b border-[var(--dg-border)] pb-2 last:border-0 last:pb-0"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-white">
                    {request.title}
                  </span>
                  <span className="block truncate text-[11px] text-[var(--dg-text-faint)]">
                    {request.citizen.email} · {formatDate(request.createdAt)}
                  </span>
                </span>
                <StatusBadge status={request.status} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Activité récente">
        {data.recentActivity.length === 0 ? (
          <Empty />
        ) : (
          <ul className="flex flex-col gap-2">
            {data.recentActivity.map((entry) => (
              <li
                key={entry.id}
                className="border-b border-[var(--dg-border)] pb-2 last:border-0 last:pb-0"
              >
                <p className="text-[13px] text-[var(--dg-text)]">
                  <span className="font-mono text-[var(--dg-accent-bright)]">
                    {entry.request?.ref}
                  </span>{" "}
                  →{" "}
                  {STATUS_LABELS[entry.status as keyof typeof STATUS_LABELS] ??
                    entry.status}
                </p>
                <p className="truncate text-[11px] text-[var(--dg-text-faint)]">
                  {entry.createdBy?.firstName ?? entry.createdBy?.email ?? "Système"}{" "}
                  · {formatDate(entry.createdAt)}
                </p>
                {entry.comment ? (
                  <p className="truncate text-xs text-[var(--dg-text-muted)] italic">
                    « {entry.comment} »
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Derniers messages de contact">
        {data.latestContactMessages.length === 0 ? (
          <Empty />
        ) : (
          <ul className="flex flex-col gap-2">
            {data.latestContactMessages.map((message) => (
              <li
                key={message.id}
                className="flex items-center gap-2 border-b border-[var(--dg-border)] pb-2 last:border-0 last:pb-0"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-white">
                    {message.subject ?? message.message}
                  </span>
                  <span className="block truncate text-[11px] text-[var(--dg-text-faint)]">
                    {message.name} · {message.email} ·{" "}
                    {formatDate(message.createdAt)}
                  </span>
                </span>
                <span className="hud-chip border border-[var(--dg-border)] bg-[var(--dg-text-muted)]/15 px-2 py-0.5 text-[11px] text-[var(--dg-text-muted)]">
                  {message.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}