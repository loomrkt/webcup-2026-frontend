import {
  Building2,
  FileText,
  Inbox,
  MessageSquareText,
  Users,
} from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStatsQuery } from "@/entities/dashboard";

function Card({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <HudPanel edge className="flex items-center gap-3 p-4">
      <span className="hud-cut flex size-9 shrink-0 items-center justify-center bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)]">
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold text-[var(--dg-text)]">{value}</p>
        <p className="text-[11px] text-[var(--dg-text-faint)]">{label}</p>
      </div>
    </HudPanel>
  );
}

export function DashboardStatsCards() {
  const { data, isLoading } = useDashboardStatsQuery();

  if (isLoading || !data) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl bg-white/10" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <Card
        label="Habitants"
        value={data.totalUsers}
        icon={<Users className="h-4 w-4" />}
      />
      <Card
        label="Services actifs"
        value={data.activeServices}
        icon={<Building2 className="h-4 w-4" />}
      />
      <Card
        label="Publications"
        value={data.publishedPublications}
        icon={<FileText className="h-4 w-4" />}
      />
      <Card
        label="Messages nouveaux"
        value={data.newContactMessages}
        icon={<MessageSquareText className="h-4 w-4" />}
      />
      <Card
        label="Demandes totales"
        value={data.totalRequests}
        icon={<Inbox className="h-4 w-4" />}
      />
    </div>
  );
}