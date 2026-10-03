"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/entities/request";
import { cn } from "@/lib/utils";
import {
  filtersFormSchema,
  type FiltersFormValues,
} from "../model/filters-schema";
import { useRequestFiltersStore } from "../model/filters-store";

const selectClassName =
  "h-12 w-full cursor-pointer rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={htmlFor}>
      <span className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

export function RequestFilters() {
  const setStatus = useRequestFiltersStore((s) => s.setStatus);
  const setPriority = useRequestFiltersStore((s) => s.setPriority);
  const reset = useRequestFiltersStore((s) => s.reset);

  const { register, reset: resetForm } = useForm<FiltersFormValues>({
    resolver: zodResolver(filtersFormSchema),
    defaultValues: { status: "", priority: "" },
  });

  const handleReset = () => {
    resetForm({ status: "", priority: "" });
    reset();
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Field label="Statut" htmlFor="filters-status">
        <select
          id="filters-status"
          className={cn(selectClassName, "sm:w-52")}
          aria-label="Filtrer par statut"
          {...register("status", {
            onChange: (event) => setStatus(event.target.value),
          })}
        >
          <option value="">Tous les statuts</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Priorité" htmlFor="filters-priority">
        <select
          id="filters-priority"
          className={cn(selectClassName, "sm:w-52")}
          aria-label="Filtrer par priorité"
          {...register("priority", {
            onChange: (event) => setPriority(event.target.value),
          })}
        >
          <option value="">Toutes les priorités</option>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Button
        variant="outline"
        onClick={handleReset}
        className="h-12 cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)] hover:border-[var(--dg-accent)]/40 hover:text-[var(--dg-accent-bright)]"
      >
        <RotateCcw className="h-4 w-4" />
        Réinitialiser
      </Button>
    </div>
  );
}