"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleAlert, Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ideaFormSchema,
  ideaPayloadSchema,
  type IdeaFormInput,
} from "@/schemas/ideas/idea-schema";
import { createIdea } from "@/services/civic/ideas-service";
import { getApiErrorMessage } from "@/services/common/error-message";

const textareaClass =
  "h-32 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs text-[var(--dg-danger)]" role="alert">
      {message}
    </p>
  );
}

export function IdeaForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IdeaFormInput>({
    resolver: zodResolver(ideaFormSchema),
    mode: "onTouched",
    defaultValues: { title: "", description: "", category: "" },
  });

  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (values: IdeaFormInput) => {
    setServerError(null);
    setSuccessRef(null);
    try {
      const payload = ideaPayloadSchema.parse(values);
      const idea = await createIdea(payload);
      setSuccessRef(idea.ref);
      reset();
    } catch (error) {
      setServerError(
        getApiErrorMessage(error, "Impossible d'envoyer votre idée."),
      );
    }
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      aria-busy={isSubmitting}
      className="flex flex-col gap-4"
      noValidate
    >
      {successRef && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-3 text-sm text-[var(--dg-success)]"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Idée enregistrée — référence {successRef}</p>
            <p className="mt-0.5 text-[var(--dg-text-muted)]">
              Merci ! Votre idée a bien été prise en compte. Vous pouvez suivre
              son évolution dans « Mes idées ».
            </p>
          </div>
        </div>
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

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="idea-title"
          className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]"
        >
          Titre de votre idée
        </label>
        <Input
          id="idea-title"
          placeholder="Ex. : installer des jardins partagés"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? "idea-title-error" : undefined}
          {...register("title")}
        />
        <FieldError id="idea-title-error" message={errors.title?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="idea-category"
          className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]"
        >
          Catégorie (facultatif)
        </label>
        <Input
          id="idea-category"
          placeholder="Ex. : environnement, mobilité, culture…"
          aria-invalid={errors.category ? true : undefined}
          aria-describedby={errors.category ? "idea-category-error" : undefined}
          {...register("category")}
        />
        <FieldError
          id="idea-category-error"
          message={errors.category?.message}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="idea-description"
          className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]"
        >
          Description
        </label>
        <textarea
          id="idea-description"
          placeholder="Décrivez votre idée pour améliorer Terra Nova…"
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={
            errors.description ? "idea-description-error" : undefined
          }
          className={cn(textareaClass, errors.description && "border-[var(--dg-danger-border)]")}
          {...register("description")}
        />
        <FieldError
          id="idea-description-error"
          message={errors.description?.message}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="dg-btn-accent w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Envoi en cours…
          </>
        ) : (
          <>
            <Lightbulb aria-hidden />
            Proposer mon idée
          </>
        )}
      </Button>
    </form>
  );
}