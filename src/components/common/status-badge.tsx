import { cn } from "@/lib/utils";

const TONES = {
  accent: "text-[var(--dg-accent-bright)] border-[var(--dg-accent-border)] bg-[var(--dg-accent)]/10",
  neutral: "text-[var(--dg-text-muted)] border-[var(--dg-border)] bg-[var(--dg-bg-card)]",
  success: "text-[var(--dg-success)] border-[var(--dg-success-border)] bg-[var(--dg-success-soft)]",
  danger: "text-[var(--dg-danger)] border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)]",
} as const;

export type StatusTone = keyof typeof TONES;

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: StatusTone;
}) {
  return (
    <span
      className={cn(
        "hud-chip inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-semibold",
        TONES[tone],
      )}
    >
      {label}
    </span>
  );
}