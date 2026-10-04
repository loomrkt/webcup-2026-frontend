import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStatsQuery } from "@/entities/dashboard";

function shortDay(day: string) {
  const date = new Date(`${day}T00:00:00`);
  if (Number.isNaN(date.getTime())) return day.slice(5);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function DashboardActivityChart() {
  const { data, isLoading } = useDashboardStatsQuery();

  if (isLoading || !data) {
    return <Skeleton className="h-52 rounded-2xl bg-white/10" />;
  }

  const days = data.requestsByDay ?? [];
  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <HudPanel edge className="flex flex-col gap-3 p-4">
      <h2 className="text-sm font-semibold text-[var(--dg-text)]">
        Demandes déposées par jour (14 jours)
      </h2>
      <div className="flex h-36 items-end gap-1.5">
        {days.map(({ day, count }) => (
          <div
            key={day}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-1"
          >
            <span className="text-[10px] font-semibold text-[var(--dg-accent-bright)] opacity-0 transition-opacity group-hover:opacity-100">
              {count}
            </span>
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-[var(--dg-accent)]/70 to-[var(--dg-accent-bright)] shadow-[0_0_10px_var(--dg-accent-glow-soft)] transition-all group-hover:brightness-125"
              style={{ height: `${Math.max((count / max) * 100, 4)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {days.map(({ day }) => (
          <span
            key={day}
            className="flex-1 truncate text-center text-[10px] text-[var(--dg-text-faint)]"
          >
            {shortDay(day)}
          </span>
        ))}
      </div>
    </HudPanel>
  );
}