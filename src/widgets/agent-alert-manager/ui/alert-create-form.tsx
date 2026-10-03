"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateAlertMutation,
  type AiAlertDraft,
} from "@/entities/alert";
import { cn } from "@/lib/utils";
import { AiAlertGenerator } from "./ai-alert-generator";
import { ALERT_CRITICALITY_LABELS } from "../model/alert-meta";
import {
  alertCreateSchema,
  splitLines,
  type AlertCreateFormValues,
} from "../model/alert-create-schema";

const inputClassName =
  "h-12 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

const textareaClassName =
  "min-h-24 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

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

export function AlertCreateForm() {
  const [feedback, setFeedback] = useState<
    { kind: "success" | "error"; message: string } | null
  >(null);
  const createAlert = useCreateAlertMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<AlertCreateFormValues>({
    resolver: zodResolver(alertCreateSchema),
    defaultValues: {
      title: "",
      message: "",
      criticality: "warning",
      zone: "",
      recommendationsText: "",
      vulnerableRecommendationsText: "",
      publish: true,
    },
  });

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 6000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const applyDraft = (draft: AiAlertDraft) => {
    setValue("title", draft.title);
    setValue("message", draft.message);
    setValue("criticality", draft.criticality);
    setValue("zone", draft.zone ?? "");
    setValue("recommendationsText", draft.recommendations.join("\n"));
    setValue(
      "vulnerableRecommendationsText",
      draft.vulnerableRecommendations.join("\n"),
    );
    setFeedback({
      kind: "success",
      message: "Brouillon IA chargé : vérifiez puis publiez.",
    });
  };

  const submit = handleSubmit((values) => {
    createAlert.mutate(
      {
        title: values.title.trim(),
        message: values.message.trim(),
        criticality: values.criticality,
        zone: values.zone?.trim() || null,
        recommendations: splitLines(values.recommendationsText),
        vulnerableRecommendations: splitLines(
          values.vulnerableRecommendationsText,
        ),
        publish: values.publish,
      },
      {
        onSuccess: (alert) => {
          reset();
          setFeedback({
            kind: "success",
            message: alert.status === "active"
              ? "Alerte créée et diffusée aux habitants."
              : "Alerte enregistrée en brouillon.",
          });
        },
        onError: () => {
          setFeedback({
            kind: "error",
            message: "Impossible de créer l'alerte.",
          });
        },
      },
    );
  });

  return (
    <div className="flex flex-col gap-4">
      <AiAlertGenerator onDraft={applyDraft} />

      <div className="border-t border-[var(--dg-border)]" />

      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        {feedback && (
          <div
            role="status"
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm backdrop-blur",
              feedback.kind === "success"
                ? "border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] text-[var(--dg-success)]"
                : "border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] text-[var(--dg-danger)]",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                feedback.kind === "success"
                  ? "bg-[var(--dg-success)] shadow-[0_0_8px_var(--dg-success-glow)]"
                  : "bg-[var(--dg-danger)]",
              )}
            />
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Titre" htmlFor="alert-title">
            <Input
              id="alert-title"
              placeholder="Ex. : Vague de chaleur extrême"
              className="h-12"
              {...register("title")}
            />
          </Field>
          <Field label="Criticité" htmlFor="alert-criticality">
            <select
              id="alert-criticality"
              className={cn(inputClassName, "cursor-pointer")}
              {...register("criticality")}
            >
              {(Object.keys(ALERT_CRITICALITY_LABELS) as Array<
                keyof typeof ALERT_CRITICALITY_LABELS
              >).map((value) => (
                <option key={value} value={value}>
                  {ALERT_CRITICALITY_LABELS[value]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Message (consignes)" htmlFor="alert-message">
          <textarea
            id="alert-message"
            className={textareaClassName}
            placeholder="Que doivent faire les habitants ?"
            {...register("message")}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Zone / quartier" htmlFor="alert-zone">
            <Input
              id="alert-zone"
              placeholder="Toute la ville si vide"
              className="h-12"
              {...register("zone")}
            />
          </Field>
          <Field label="Statut" htmlFor="alert-publish">
            <label className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)]">
              <input
                id="alert-publish"
                type="checkbox"
                className="size-4 rounded accent-[var(--dg-accent)]"
                {...register("publish")}
              />
              Publier immédiatement
            </label>
          </Field>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <Field label="Recommandations (une par ligne)" htmlFor="alert-rec">
            <textarea
              id="alert-rec"
              className={textareaClassName}
              placeholder="Restez à l'ombre…"
              {...register("recommendationsText")}
            />
          </Field>
          <Field
            label="Recommandations publics vulnérables"
            htmlFor="alert-vulnerable"
          >
            <textarea
              id="alert-vulnerable"
              className={textareaClassName}
              placeholder="Surveillez les personnes âgées…"
              {...register("vulnerableRecommendationsText")}
            />
          </Field>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="dg-btn-accent cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Créer l&apos;alerte
          </Button>
          <span className="text-xs text-[var(--dg-text-faint)]">
            La diffusion notifie les habitants de la zone concernée.
          </span>
        </div>
      </form>
    </div>
  );
}