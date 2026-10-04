"use client";

import { forwardRef } from "react";
import { CircleAlert } from "lucide-react";

export interface FormError {
  field: string;
  message: string;
}

export const ErrorSummary = forwardRef<
  HTMLDivElement,
  { errors: FormError[]; title?: string }
>(({ errors, title = "Impossible de continuer" }, ref) => {
  if (errors.length === 0) return null;

  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className="rounded-2xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] p-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--dg-danger)]/40"
    >
      <div className="flex items-center gap-2 font-semibold text-[var(--dg-danger)]">
        <CircleAlert className="size-4 shrink-0" />
        {title}
      </div>
      <ul className="mt-2 space-y-1">
        {errors.map((error) => (
          <li key={error.field}>
            <a
              href={`#${error.field}`}
              className="rounded text-[var(--dg-danger)] underline decoration-[var(--dg-danger)]/40 underline-offset-2 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[var(--dg-danger)]"
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});
ErrorSummary.displayName = "ErrorSummary";