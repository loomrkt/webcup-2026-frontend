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
      className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50"
    >
      <div className="flex items-center gap-2 font-semibold text-rose-200">
        <CircleAlert className="size-4 shrink-0" />
        {title}
      </div>
      <ul className="mt-2 space-y-1">
        {errors.map((error) => (
          <li key={error.field}>
            <a
              href={`#${error.field}`}
              className="rounded text-rose-300 underline decoration-rose-400/50 underline-offset-2 transition-colors hover:text-rose-200 focus-visible:outline-2 focus-visible:outline-rose-300"
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