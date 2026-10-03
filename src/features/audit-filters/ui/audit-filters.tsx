"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuditEntityTypesQuery } from "@/entities/audit";
import { AUDIT_ACTIONS, useAuditFiltersStore } from "../model/filters-store";
import {
  auditFiltersSchema,
  type AuditFiltersFormValues,
} from "../model/filters-schema";

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

export function AuditFilters() {
  const setFilter = useAuditFiltersStore((s) => s.setFilter);
  const reset = useAuditFiltersStore((s) => s.reset);
  const { data: entityTypes = [] } = useAuditEntityTypesQuery();

  const { register, handleSubmit, reset: resetForm } =
    useForm<AuditFiltersFormValues>({
      resolver: zodResolver(auditFiltersSchema),
      defaultValues: {
        q: "",
        entityType: "",
        action: "",
        from: "",
        to: "",
      },
    });

  const submit = handleSubmit((values) => {
    setFilter({
      q: values.q?.trim() ?? "",
      entityType: values.entityType ?? "",
      action: values.action ?? "",
      from: values.from ?? "",
      to: values.to ?? "",
    });
  });

  const handleReset = () => {
    resetForm({ q: "", entityType: "", action: "", from: "", to: "" });
    reset();
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-3"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Recherche" htmlFor="audit-q">
          <Input
            id="audit-q"
            placeholder="Mot-clé…"
            aria-label="Rechercher dans le journal"
            className="h-12 pl-9!"
            {...register("q")}
          />
        </Field>

        <Field label="Type d'entité" htmlFor="audit-entity-type">
          <select
            id="audit-entity-type"
            className={selectClassName}
            aria-label="Filtrer par type d'entité"
            {...register("entityType")}
          >
            <option value="">Tous</option>
            {entityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Action" htmlFor="audit-action">
          <select
            id="audit-action"
            className={selectClassName}
            aria-label="Filtrer par action"
            {...register("action")}
          >
            <option value="">Toutes</option>
            {AUDIT_ACTIONS.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Du" htmlFor="audit-from">
          <Input
            id="audit-from"
            type="date"
            className="h-12"
            {...register("from")}
          />
        </Field>

        <Field label="Au" htmlFor="audit-to">
          <Input
            id="audit-to"
            type="date"
            className="h-12"
            {...register("to")}
          />
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" className="dg-btn-accent cursor-pointer">
          <Search className="h-4 w-4" />
          Appliquer les filtres
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="h-12 cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)] hover:border-[var(--dg-accent)]/40 hover:text-[var(--dg-accent-bright)]"
        >
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
      </div>
    </form>
  );
}