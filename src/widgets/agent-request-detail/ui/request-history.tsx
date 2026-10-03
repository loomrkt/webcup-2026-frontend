import { Clock } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import {
  STATUS_LABELS,
  type Request,
  type RequestHistory,
} from "@/entities/request";
import { cn } from "@/lib/utils";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function actorLabel(entry: RequestHistory) {
  const actor = entry.createdBy;
  if (!actor) return "Système";
  return actor.firstName || actor.email;
}

function statusChip(status: string) {
  const known = STATUS_LABELS[status as keyof typeof STATUS_LABELS];
  if (!known) {
    return (
      <span className="hud-chip border border-[var(--dg-border)] bg-[var(--dg-text-muted)]/15 px-2 py-0.5 text-[11px] text-[var(--dg-text-muted)]">
        {status.replaceAll("_", " ")}
      </span>
    );
  }
  const meta: Record<string, string> = {
    pending:
      "bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border-[var(--dg-border)]",
    in_progress:
      "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40",
    resolved:
      "bg-[var(--dg-success)]/15 text-[var(--dg-success)] border-[var(--dg-success-border)]",
    rejected:
      "bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border-[var(--dg-danger-border)]",
  };
  return (
    <span
      className={cn(
        "hud-chip border px-2 py-0.5 text-[11px]",
        meta[status],
      )}
    >
      {known}
    </span>
  );
}

export function RequestHistoryTimeline({ request }: { request: Request }) {
  const entries = [...(request.history ?? [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <HudPanel edge className="flex flex-col gap-3 p-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
        <Clock className="h-4 w-4 text-[var(--dg-accent-bright)]" />
        Historique du suivi
      </h2>

      {entries.length === 0 ? (
        <p className="text-sm text-[var(--dg-text-faint)]">
          Aucun événement enregistré pour le moment.
        </p>
      ) : (
        <ol className="relative flex flex-col gap-4 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-[var(--dg-border)]">
          {entries.map((entry) => (
            <li key={entry.id} className="relative flex gap-3 pl-6">
              <span
                aria-hidden
                className="absolute top-1.5 left-0 size-2.5 rounded-full border border-[var(--dg-accent)] bg-[var(--dg-bg-raised)] shadow-[0_0_8px_var(--dg-accent-glow)]"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  {statusChip(entry.status)}
                  <span className="text-xs text-[var(--dg-text-faint)]">
                    {actorLabel(entry)} · {formatDateTime(entry.createdAt)}
                  </span>
                </div>
                {entry.comment ? (
                  <p className="text-sm text-[var(--dg-text-muted)]">
                    {entry.comment}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </HudPanel>
  );
}