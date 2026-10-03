"use client";

import { CheckCheck, Compass, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCompleteGuideMutation,
  useDismissGuideMutation,
  useMyGuidesQuery,
} from "@/entities/guide";

export function OnboardingGuides() {
  const { data: data, isLoading, isError } = useMyGuidesQuery();
  const complete = useCompleteGuideMutation();
  const dismiss = useDismissGuideMutation();

  if (isError) return null;

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24 rounded-2xl bg-white/10" />
      </div>
    );
  }

  const pending = data.steps.filter(
    (step) => !step.completed && !step.dismissed,
  );

  if (pending.length === 0) return null;

  const total = data.progress.total || data.steps.length;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--dg-accent)]/40 bg-[var(--dg-accent)]/10 p-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)]">
          <Compass className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-white">
            Premiers pas sur Terra Nova
          </h2>
          <p className="text-[11px] text-[var(--dg-text-muted)]">
            {data.progress.completed}/{total} étapes accomplies
          </p>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuenow={data.progress.completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Progression des guides"
        className="h-1.5 overflow-hidden rounded-full bg-[var(--dg-border)]"
      >
        <span
          className="block h-full bg-gradient-to-r from-[var(--dg-accent)] to-[var(--dg-accent-bright)] shadow-[0_0_8px_var(--dg-accent-glow)]"
          style={{
            width: `${total > 0 ? (data.progress.completed / total) * 100 : 0}%`,
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        {pending.map((step) => (
          <div
            key={step.key}
            className="flex flex-col gap-2 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-3 backdrop-blur"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="min-w-0 flex-1 text-sm font-medium text-white">
                {step.title}
              </p>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => void complete.mutate(step.key)}
                aria-label={`Marquer « ${step.title} » comme terminée`}
                className="h-7 w-7 shrink-0 cursor-pointer text-[var(--dg-success)] hover:bg-[var(--dg-success)]/15"
              >
                <CheckCheck />
              </Button>
              {step.dismissible ? (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => void dismiss.mutate(step.key)}
                  aria-label={`Ignorer « ${step.title} »`}
                  className="h-7 w-7 shrink-0 cursor-pointer text-[var(--dg-text-faint)] hover:bg-[var(--dg-danger)]/15 hover:text-[var(--dg-danger)]"
                >
                  <X />
                </Button>
              ) : null}
            </div>
            <p className="text-xs leading-relaxed text-[var(--dg-text-muted)]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}