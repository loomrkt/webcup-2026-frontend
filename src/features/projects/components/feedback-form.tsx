"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleAlert, Loader2, MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FEEDBACK_SENTIMENT_LABELS,
  FEEDBACK_SENTIMENTS,
  type FeedbackSentiment,
} from "@/services/civic/project-types";
import {
  feedbackFormSchema,
  feedbackPayloadSchema,
  type FeedbackFormInput,
} from "@/schemas/feedback/feedback-schema";
import { getApiErrorMessage } from "@/services/common/error-message";
import { useMyFeedback, useSubmitFeedback } from "../hooks/use-projects";

const textareaClass =
  "h-24 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

export function FeedbackForm({ projectId }: { projectId: string }) {
  const { data: myFeedback, isLoading: loadingMyFeedback } =
    useMyFeedback(projectId);
  const submit = useSubmitFeedback(projectId);

  const form = useForm<FeedbackFormInput>({
    resolver: zodResolver(feedbackFormSchema),
    mode: "onTouched",
    defaultValues: { sentiment: null, comment: "" },
  });
  const { register, reset, watch } = form;
  const sentiment = watch("sentiment") ?? null;

  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (myFeedback) {
      reset({
        sentiment: myFeedback.sentiment,
        comment: myFeedback.comment ?? "",
      });
    }
  }, [myFeedback, reset]);

  if (loadingMyFeedback) {
    return (
      <div className="flex items-center gap-2 text-xs text-[var(--dg-text-faint)]">
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
        Chargement de votre avis…
      </div>
    );
  }

  const onSubmit = async (values: FeedbackFormInput) => {
    setServerError(null);
    setSaved(false);
    try {
      const payload = feedbackPayloadSchema.parse(values);
      await submit.mutateAsync(payload);
      setSaved(true);
    } catch (error) {
      setServerError(
        getApiErrorMessage(error, "Impossible d'enregistrer votre avis."),
      );
    }
  };

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      aria-busy={submit.isPending}
      className="flex flex-col gap-4"
      noValidate
    >
      {saved && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-3 text-sm text-[var(--dg-success)]"
        >
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          {myFeedback ? "Votre avis a été mis à jour." : "Avis enregistré — merci !"}
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
          Votre avis
        </legend>
        <div className="flex flex-wrap gap-2">
          {FEEDBACK_SENTIMENTS.map((value: FeedbackSentiment) => {
            const selected = sentiment === value;
            return (
              <label
                key={value}
                className={cn(
                  "hud-chip cursor-pointer rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors focus-within:ring-3 focus-within:ring-[var(--dg-accent)]/40 focus-within:outline-none",
                  selected
                    ? "border-[var(--dg-accent-border)] bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)]"
                    : "border-[var(--dg-border)] bg-[var(--dg-bg-card)] text-[var(--dg-text-muted)] hover:text-[var(--dg-text)]",
                )}
              >
                <input
                  type="radio"
                  value={value}
                  checked={selected}
                  {...register("sentiment")}
                  className="sr-only"
                  onChange={() => {
                    const next = selected ? null : value;
                    form.setValue("sentiment", next, { shouldDirty: true });
                  }}
                />
                {FEEDBACK_SENTIMENT_LABELS[value]}
              </label>
            );
          })}
        </div>
        {form.formState.errors.sentiment && (
          <p role="alert" className="text-xs text-[var(--dg-danger)]">
            {form.formState.errors.sentiment.message}
          </p>
        )}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="feedback-comment"
          className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]"
        >
          Commentaire (facultatif)
        </label>
        <textarea
          id="feedback-comment"
          placeholder="Partagez votre avis sur ce projet…"
          aria-invalid={form.formState.errors.comment ? true : undefined}
          aria-describedby={
            form.formState.errors.comment ? "feedback-comment-error" : undefined
          }
          className={cn(
            textareaClass,
            form.formState.errors.comment && "border-[var(--dg-danger-border)]",
          )}
          {...register("comment")}
        />
        {form.formState.errors.comment && (
          <p
            id="feedback-comment-error"
            role="alert"
            className="text-xs text-[var(--dg-danger)]"
          >
            {form.formState.errors.comment.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={submit.isPending}
        className="dg-btn-accent w-full sm:w-auto"
      >
        {submit.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Enregistrement…
          </>
        ) : (
          <>
            <MessageSquareHeart aria-hidden />
            {myFeedback ? "Mettre à jour mon avis" : "Donner mon avis"}
          </>
        )}
      </Button>
    </form>
  );
}