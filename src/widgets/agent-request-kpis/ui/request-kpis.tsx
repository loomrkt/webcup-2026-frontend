"use client";

import { BellRing, ClipboardCheck, LoaderPinwheel, UserCheck } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequestIndicatorsQuery } from "@/entities/request";

function KpiCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <HudPanel tone="accent" edge className="flex items-center gap-3 p-4">
      <span
        className={
          highlight
            ? "hud-cut flex size-9 shrink-0 items-center justify-center bg-[var(--dg-accent)]/20 text-[var(--dg-accent-bright)] shadow-[0_0_12px_var(--dg-accent-glow)]"
            : "hud-cut flex size-9 shrink-0 items-center justify-center bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)]"
        }
      >
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold text-[var(--dg-text)]">{value}</p>
        <p className="text-[11px] text-[var(--dg-text-faint)]">{label}</p>
      </div>
    </HudPanel>
  );
}

function KpiSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 rounded-2xl bg-white/10" />
      ))}
    </div>
  );
}

export function AgentRequestKpis() {
  const { data, isLoading } = useRequestIndicatorsQuery();

  if (isLoading || !data) return <KpiSkeleton />;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="En attente de traitement"
        value={data.awaiting}
        icon={<BellRing className="h-4 w-4" />}
        highlight
      />
      <KpiCard
        label="Déposées"
        value={data.pending}
        icon={<ClipboardCheck className="h-4 w-4" />}
      />
      <KpiCard
        label="En cours"
        value={data.in_progress}
        icon={<LoaderPinwheel className="h-4 w-4" />}
      />
      <KpiCard
        label="Assignées à moi"
        value={data.assignedToMe}
        icon={<UserCheck className="h-4 w-4" />}
      />
    </div>
  );
}