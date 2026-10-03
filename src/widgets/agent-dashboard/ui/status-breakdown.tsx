import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStatsQuery } from "@/entities/dashboard";
import { STATUS_LABELS } from "@/entities/request";

const BAR_CLASS: Record<string, string> = {
  pending:
    "bg-[var(--dg-text-muted)]/50 shadow-[0_0_8px_rgba(255,255,255,0.1)]",
  in_progress: "bg-[var(--dg-accent)] shadow-[0_0_12px_var(--dg-accent-glow)]",
  resolved: "bg-[var(--dg-success)] shadow-[0_0_12px_var(--dg-success-glow)]",
  rejected: "bg-[var(--dg-danger)] shadow-[0_0_12px_var(--dg-danger-glow)]",
};

export function DashboardStatusBreakdown() {
  const { data, isLoading } = useDashboardStatsQuery();

  if (isLoading || !data) {
    return <Skeleton className="h-40 rounded-2xl bg-white/10" />;
  }

  const entries = Object.entries(data.requestsByStatus ?? {});
  const max = Math.max(1, ...entries.map(([, count]) => count));

  return (
    <HudPanel edge className="flex flex-col gap-3 p-4">
      <h2 className="text-sm font-semibold text-[var(--dg-text)]">
        Demandes par statut
      </h2>
      <div className="flex flex-col gap-2.5">
        {entries.map(([status, count]) => (
          <div key={status} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-[var(--dg-text-muted)]">
              {STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status}
            </span>
            <div className="h-4 flex-1 overflow-hidden rounded-md bg-[var(--dg-bg-card-hover)]">
              <div
                className={`h-full rounded-md transition-all ${BAR_CLASS[status] ?? "bg-[var(--dg-accent)]"}`}
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-xs font-semibold text-[var(--dg-text)]">
              {count}
            </span>
          </div>
        ))}
      </div>
    </HudPanel>
  );
}