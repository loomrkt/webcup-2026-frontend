"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useNotificationPrefsQuery,
  useUpdateNotificationPrefsMutation,
} from "@/entities/notification";
import { cn } from "@/lib/utils";

const PREF_LABELS: Record<PrefKey, string> = {
  announcement: "Annonces municipales",
  alert: "Alertes de sécurité",
  system: "Messages système",
};

const PREF_KEYS = ["announcement", "alert", "system"] as const;
type PrefKey = (typeof PREF_KEYS)[number];

function Toggle({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors",
        checked
          ? "border-[var(--dg-accent)]/50 bg-[var(--dg-accent)] shadow-[0_0_10px_var(--dg-accent-glow)]"
          : "border-[var(--dg-border)] bg-[var(--dg-bg-card-hover)]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-4.5 rounded-full bg-white transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

export function NotificationPrefs() {
  const { data: prefs, isLoading } = useNotificationPrefsQuery();
  const updatePrefs = useUpdateNotificationPrefsMutation();

  if (isLoading || !prefs) {
    return (
      <div className="flex flex-col gap-3 px-4">
        <Skeleton className="h-12 rounded-xl bg-white/10" />
        <Skeleton className="h-12 rounded-xl bg-white/10" />
        <Skeleton className="h-12 rounded-xl bg-white/10" />
      </div>
    );
  }

  const toggle = (key: PrefKey) => (checked: boolean) => {
    void updatePrefs.mutate({ [key]: checked });
  };

  return (
    <div className="flex flex-col gap-2 px-4">
      <p className="text-xs text-[var(--dg-text-faint)]">
        Choisissez les notifications que vous souhaitez recevoir.
      </p>
      {PREF_KEYS.map((key) => (
        <div
          key={key}
          className="hud-cut flex items-center gap-3 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3"
        >
          <span className="min-w-0 flex-1 text-sm text-[var(--dg-text)]">
            {PREF_LABELS[key]}
          </span>
          <Toggle
            checked={prefs[key] ?? false}
            onCheckedChange={toggle(key)}
            label={PREF_LABELS[key]}
          />
        </div>
      ))}
    </div>
  );
}