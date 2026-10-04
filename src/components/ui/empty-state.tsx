"use client";

import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  actions,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--dg-border)] bg-[var(--dg-bg-card)]/50 py-12 text-center backdrop-blur ${className ?? ""}`}
    >
      {icon ? (
        <span className="flex size-12 items-center justify-center rounded-2xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] text-[var(--dg-text-faint)]">
          {icon}
        </span>
      ) : null}
      <h2 className="text-sm font-semibold text-[var(--dg-text)]">{title}</h2>
      {description ? (
        <p className="max-w-md text-sm text-[var(--dg-text-muted)]">
          {description}
        </p>
      ) : null}
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}