"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGenerateAlertDraftMutation, type AiAlertDraft } from "@/entities/alert";
import { cn } from "@/lib/utils";
import {
  aiGenerateSchema,
  type AiGenerateFormValues,
} from "../model/alert-create-schema";

const inputClassName =
  "h-12 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

export function AiAlertGenerator({
  onDraft,
}: {
  onDraft: (draft: AiAlertDraft) => void;
}) {
  const generate = useGenerateAlertDraftMutation();

  const { register, handleSubmit, reset, formState } =
    useForm<AiGenerateFormValues>({
      resolver: zodResolver(aiGenerateSchema),
      defaultValues: { situation: "", zone: "" },
    });

  const submit = handleSubmit((values) => {
    generate.mutate(
      {
        situation: values.situation.trim(),
        zone: values.zone?.trim() || null,
      },
      {
        onSuccess: (draft) => {
          onDraft(draft);
          reset({ situation: "", zone: "" });
        },
      },
    );
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
      <div>
        <p className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
          Génération assistée par IA
        </p>
        <p className="mt-0.5 text-xs text-[var(--dg-text-muted)]">
          Décrivez la situation : le service d&apos;alerte pré-remplit
          l&apos;alerte (titres, consignes, publics vulnérables).
        </p>
      </div>
      <textarea
        className={cn(inputClassName, "min-h-28")}
        placeholder="Ex. : vague de chaleur extrême prévue à partir de demain dans le quartier Sud…"
        aria-label="Décrire la situation"
        {...register("situation")}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          className="h-12"
          placeholder="Zone / quartier (optionnel)"
          aria-label="Zone concernée"
          {...register("zone")}
        />
        <Button
          type="submit"
          disabled={generate.isPending || !formState.isValid}
          className="dg-btn-accent h-12 cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          {generate.isPending ? "Génération…" : "Générer un brouillon"}
        </Button>
      </div>
      {generate.isError ? (
        <p className="text-xs text-[var(--dg-danger)]">
          La génération a échoué. Réessayez.
        </p>
      ) : null}
    </form>
  );
}