import { Globe, Satellite } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useNovaTerraQuery } from "@/entities/dashboard";
import { cn } from "@/lib/utils";

export function NovaTerraPanel() {
  const { data, isLoading } = useNovaTerraQuery();

  if (isLoading || !data) {
    return <Skeleton className="h-48 rounded-2xl bg-white/10" />;
  }

  const statusMeta: Record<string, string> = {
    ok: "text-[var(--dg-success)] border-[var(--dg-success-border)] bg-[var(--dg-success)]/15",
    unconfigured:
      "text-[var(--dg-text-muted)] border-[var(--dg-border)] bg-[var(--dg-text-muted)]/15",
    error:
      "text-[var(--dg-danger)] border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)]",
  };

  return (
    <HudPanel edge className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Satellite className="h-4 w-4 text-[var(--dg-accent-bright)]" />
        <h2 className="text-sm font-semibold text-[var(--dg-text)]">
          Données Nova Terra
        </h2>
        <span
          className={cn(
            "hud-chip ml-auto border px-2 py-0.5 text-[11px]",
            statusMeta[data.status] ?? statusMeta.unconfigured,
          )}
        >
          {data.status}
        </span>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-[var(--dg-text-muted)]">
        <Globe className="h-3.5 w-3.5" />
        Source : {data.source}
      </p>
      {data.message ? (
        <p className="text-xs text-[var(--dg-text-faint)]">{data.message}</p>
      ) : null}
      <pre className="max-h-64 overflow-auto rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-3 text-[11px] leading-relaxed text-[var(--dg-text-muted)]">
        {JSON.stringify(data.data, null, 2)}
      </pre>
    </HudPanel>
  );
}