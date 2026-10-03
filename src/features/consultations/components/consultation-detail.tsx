"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleAlert, Loader2, Lock, Vote } from "lucide-react";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Consultation } from "@/services/civic/consultation-types";
import {
  respondPayloadSchema,
  respondSchema,
  type RespondFormInput,
} from "@/schemas/consultations/respond-schema";
import { getApiErrorMessage } from "@/services/common/error-message";
import { useRespond, useResults } from "../hooks/use-consultations";

const textareaClass =
  "h-24 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

export function RespondForm({ consultation }: { consultation: Consultation }) {
  const schema = respondSchema(consultation.choices);
  const respond = useRespond(consultation.id);

  const form = useForm<RespondFormInput>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { choice: undefined, comment: "" },
  });
  const { register, watch, setValue } = form;
  const choice = watch("choice");

  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState<"created" | "updated" | null>(null);

  const onSubmit = async (values: RespondFormInput) => {
    setServerError(null);
    setSaved(null);
    try {
      const payload = respondPayloadSchema(values);
      const result = await respond.mutateAsync(payload);
      setSaved(result.updated ? "updated" : "created");
    } catch (error) {
      setServerError(
        getApiErrorMessage(error, "Impossible d'enregistrer votre réponse."),
      );
    }
  };

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      aria-busy={respond.isPending}
      className="flex flex-col gap-4"
      noValidate
    >
      {saved && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-3 text-sm text-[var(--dg-success)]"
        >
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          {saved === "updated"
            ? "Réponse mise à jour — merci pour votre contribution."
            : "Réponse enregistrée — merci pour votre contribution."}
        </p>
      )}

      {serverError && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] px-4 py-3 text-sm text-[var(--dg-danger)]"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {serverError}
        </p>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]">
          Votre choix
        </legend>
        <div className="flex flex-col gap-2">
          {consultation.choices.map((option) => {
            const selected = choice === option;
            return (
              <label
                key={option}
                className={cn(
                  "hud-cut flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors focus-within:ring-3 focus-within:ring-[var(--dg-accent)]/40 focus-within:outline-none",
                  selected
                    ? "border-[var(--dg-accent-border)] bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] shadow-[0_0_12px_var(--dg-accent-glow-soft)]"
                    : "border-[var(--dg-border)] bg-[var(--dg-bg-card)] text-[var(--dg-text-muted)] hover:border-[var(--dg-border-strong)] hover:text-[var(--dg-text)]",
                )}
              >
                <input
                  type="radio"
                  value={option}
                  checked={selected}
                  className="sr-only"
                  {...register("choice")}
                  onChange={() =>
                    setValue("choice", option, { shouldDirty: true })
                  }
                />
                {option}
              </label>
            );
          })}
        </div>
        {form.formState.errors.choice && (
          <p role="alert" className="text-xs text-[var(--dg-danger)]">
            {form.formState.errors.choice.message}
          </p>
        )}
      </fieldset>

      {consultation.allowComments && (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="respond-comment"
            className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]"
          >
            Commentaire (facultatif)
          </label>
          <textarea
            id="respond-comment"
            placeholder="Précisez votre choix…"
            aria-invalid={form.formState.errors.comment ? true : undefined}
            aria-describedby={
              form.formState.errors.comment ? "respond-comment-error" : undefined
            }
            className={cn(
              textareaClass,
              form.formState.errors.comment && "border-[var(--dg-danger-border)]",
            )}
            {...register("comment")}
          />
          {form.formState.errors.comment && (
            <p
              id="respond-comment-error"
              role="alert"
              className="text-xs text-[var(--dg-danger)]"
            >
              {form.formState.errors.comment.message}
            </p>
          )}
        </div>
      )}

      <Button
        type="submit"
        disabled={respond.isPending}
        className="dg-btn-accent w-full sm:w-auto"
      >
        {respond.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Enregistrement…
          </>
        ) : (
          <>
            <Vote aria-hidden />
            Envoyer ma réponse
          </>
        )}
      </Button>
    </form>
  );
}

export function ResultsPanel({ consultationId }: { consultationId: string }) {
  const { data, isLoading, isError, error, refetch } = useResults(
    consultationId,
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-[var(--dg-text-faint)]">
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
        Chargement des résultats…
      </div>
    );
  }

  if (isError) {
    const isPrivate = isAxiosError(error) && error.response?.status === 403;
    if (isPrivate) {
      return (
        <p className="flex items-center gap-2 text-xs text-[var(--dg-text-muted)]">
          <Lock aria-hidden className="size-3.5" />
          Les résultats de cette consultation ne sont pas publics.
        </p>
      );
    }
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="text-xs text-[var(--dg-danger)]">
          Impossible de charger les résultats.
        </p>
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const { total, counts } = data;
  const max = Math.max(1, total);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-[var(--dg-text-muted)]">
        <strong className="font-semibold text-[var(--dg-text)]">{total}</strong>{" "}
        réponse{total > 1 ? "s" : ""} à ce jour
      </p>
      <div className="flex flex-col gap-2">
        {Object.entries(counts).map(([option, count]) => {
          const width = Math.round((count / max) * 100);
          return (
            <div key={option} className="flex items-center gap-3">
              <span className="min-w-0 flex-1 truncate text-xs text-[var(--dg-text-muted)]">
                {option}
              </span>
              <div className="h-2 w-1/2 shrink-0 overflow-hidden rounded-full bg-[var(--dg-bg-card-hover)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--dg-accent)] to-[var(--dg-accent-bright)] transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-mono text-xs text-[var(--dg-text)]">
                {count}
              </span>
            </div>
          );
        })}
      </div>
      {data.comments.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-[var(--dg-border)] pt-3">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]">
            Commentaires récents
          </p>
          <ul className="flex flex-col gap-1.5">
            {data.comments.slice(0, 10).map((item, index) => (
              <li key={index} className="text-xs text-[var(--dg-text-muted)]">
                {item.comment}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}