"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleAlert, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  concernFormSchema,
  concernPayloadSchema,
  type ConcernFormInput,
} from "@/schemas/concerns/concern-schema";
import { submitConcern } from "@/services/participation/concerns-service";
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

export function ConcernForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConcernFormInput>({
    resolver: zodResolver(concernFormSchema),
    mode: "onTouched",
    defaultValues: { message: "", category: "" },
  });

  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (values: ConcernFormInput) => {
    setServerError(null);
    setSubmitted(false);
    try {
      const payload = concernPayloadSchema.parse(values);
      await submitConcern(payload);
      setSubmitted(true);
      reset();
    } catch (error) {
      setServerError(
        getApiErrorMessage(error, "Impossible d'envoyer votre message."),
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
      {submitted && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-3 text-sm text-[var(--dg-success)]"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Préoccupation enregistrée</p>
            <p className="mt-0.5 text-[var(--dg-text-muted)]">
              Merci ! Votre message a bien été pris en compte. Vous pourrez
              suivre sa réponse dans « Mes préoccupations ».
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
          htmlFor="concern-category"
          className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]"
        >
          Catégorie (facultatif)
        </label>
        <Input
          id="concern-category"
          placeholder="Ex. : collecte de données, transparence, sécurité…"
          aria-invalid={errors.category ? true : undefined}
          aria-describedby={
            errors.category ? "concern-category-error" : undefined
          }
          {...register("category")}
        />
        <FieldError
          id="concern-category-error"
          message={errors.category?.message}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="concern-message"
          className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]"
        >
          Votre préoccupation
        </label>
        <textarea
          id="concern-message"
          placeholder="Expliquez comment vos données sont utilisées et ce qui vous inquiète…"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={
            errors.message ? "concern-message-error" : undefined
          }
          className={cn(
            textareaClass,
            errors.message && "border-[var(--dg-danger-border)]",
          )}
          {...register("message")}
        />
        <FieldError id="concern-message-error" message={errors.message?.message} />
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
            <ShieldAlert aria-hidden />
            Faire remonter ma préoccupation
          </>
        )}
      </Button>
    </form>
  );
}