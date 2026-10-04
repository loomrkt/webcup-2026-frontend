"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type HubTab = {
  key: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
};

/**
 * Onglets de hub — synchronisés avec `?tab=` dans l'URL pour le
 * partage / retour arrière. Remplace les pages indépendantes.
 */
export function useHubTab(defaultTab: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = searchParams.get("tab") ?? defaultTab;

  const setTab = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return { active, setTab } as const;
}

export function HubTabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: HubTab[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Sections"
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-1",
        className,
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border border-[var(--dg-accent)]/40 bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] shadow-[0_0_12px_var(--dg-accent-glow-soft)]"
                : "border border-transparent text-[var(--dg-text-muted)] hover:bg-[var(--dg-bg-card-hover)] hover:text-white",
            )}
          >
            {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/** En-tête de hub réutilisable (eyebrow + titre + description). */
export function HubHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-1">
      <p className="dg-eyebrow">{eyebrow}</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">{description}</p>
      ) : null}
    </header>
  );
}