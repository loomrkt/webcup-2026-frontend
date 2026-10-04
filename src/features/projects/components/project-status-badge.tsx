import { cn } from "@/lib/utils";
import {
  PROJECT_STATUS_LABELS,
  type ProjectStatus,
} from "@/services/civic/project-types";
import { StatusBadge, type StatusTone } from "@/components/common/status-badge";

const STATUS_TONES: Record<ProjectStatus, StatusTone> = {
  planned: "neutral",
  in_progress: "accent",
  paused: "neutral",
  completed: "success",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <StatusBadge
      label={PROJECT_STATUS_LABELS[status]}
      tone={STATUS_TONES[status]}
    />
  );
}

export function ProgressBar({ progress }: { progress: number }) {
  const safe = Math.max(0, Math.min(100, progress));
  return (
    <div className="flex items-center gap-2">
      <div
        role="progressbar"
        aria-valuenow={safe}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Avancement : ${safe} %`}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--dg-bg-card-hover)]"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--dg-accent)] to-[var(--dg-accent-bright)] transition-all"
          style={{ width: `${safe}%` }}
        />
      </div>
      <span
        className={cn(
          "font-mono text-[11px]",
          safe === 100
            ? "text-[var(--dg-success)]"
            : "text-[var(--dg-accent-bright)]",
        )}
      >
        {safe} %
      </span>
    </div>
  );
}