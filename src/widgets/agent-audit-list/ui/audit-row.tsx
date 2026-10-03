import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AuditEvent } from "@/entities/audit";

const ACTION_META: Record<string, string> = {
  create:
    "bg-[var(--dg-success)]/15 text-[var(--dg-success)] border-[var(--dg-success-border)]",
  update:
    "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40",
  delete:
    "bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border-[var(--dg-danger-border)]",
  restore:
    "bg-[var(--dg-success)]/15 text-[var(--dg-success)] border-[var(--dg-success-border)]",
  cancel:
    "bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border-[var(--dg-border)]",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function DiffBlock({ title, value }: { title: string; value: unknown }) {
  if (value == null) return null;
  return (
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
        {title}
      </p>
      <pre className="mt-1 max-h-40 overflow-auto rounded-lg border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-2 text-[10px] leading-relaxed text-[var(--dg-text-muted)]">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

export function AuditRow({ event }: { event: AuditEvent }) {
  const [open, setOpen] = useState(false);
  const hasDiff = event.before != null || event.after != null;

  return (
    <li className="hud-cut border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 backdrop-blur transition-colors hover:border-[var(--dg-border-strong)] hover:bg-[var(--dg-bg-card-hover)]">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "hud-chip border px-2 py-0.5 text-[11px]",
            ACTION_META[event.action] ?? ACTION_META.update,
          )}
        >
          {event.action}
        </span>
        <span className="hud-chip border border-[var(--dg-border)] bg-[var(--dg-text-muted)]/15 px-2 py-0.5 text-[11px] text-[var(--dg-text-muted)]">
          {event.entityType}
        </span>
        <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-white">
          {event.summary ?? event.entityId ?? "—"}
        </span>
        {event.entityId ? (
          <span className="font-mono text-[11px] text-[var(--dg-text-faint)]">
            {event.entityId.slice(0, 8)}…
          </span>
        ) : null}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--dg-text-faint)]">
        <span>{event.actorEmail ?? "Système"}</span>
        <span>{formatDate(event.createdAt)}</span>
        {event.ip ? <span>IP {event.ip}</span> : null}
        {hasDiff ? (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="ml-auto inline-flex cursor-pointer items-center gap-1 text-[var(--dg-accent-bright)] transition-colors hover:underline"
            aria-expanded={open}
          >
            Détails
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        ) : null}
      </div>

      {open && (
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <DiffBlock title="Avant" value={event.before} />
          <DiffBlock title="Après" value={event.after} />
        </div>
      )}
    </li>
  );
}