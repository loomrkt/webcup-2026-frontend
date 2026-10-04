"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheck, Loader2, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendContactMessageMutation } from "@/entities/contact";
import { cn } from "@/lib/utils";
import {
  contactSchema,
  type ContactFormValues,
} from "../model/contact-schema";

const inputClassName =
  "h-12 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

const CONTACT_CATEGORIES = [
  { value: "", label: "Thème de votre message" },
  { value: "information", label: "Demande d'information" },
  { value: "service", label: "Service municipal" },
  { value: "technical", label: "Problème technique" },
  { value: "suggestion", label: "Suggestion" },
  { value: "other", label: "Autre" },
];

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor}>
        <span className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
          {label}
        </span>
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-[var(--dg-danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [reference, setReference] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<
    { kind: "success" | "error"; message: string } | null
  >(null);
  const send = useSendContactMessageMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    },
  });

  const submit = handleSubmit((values) => {
    send.mutate(
      {
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject?.trim() || null,
        category: values.category || null,
        message: values.message.trim(),
      },
      {
        onSuccess: (result) => {
          setReference(result.reference);
          setFeedback(null);
          reset();
        },
        onError: () => {
          setFeedback({
            kind: "error",
            message: "Impossible d'envoyer votre message. Réessayez.",
          });
        },
      },
    );
  });

  if (reference) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] p-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-xl bg-[var(--dg-success)]/20 text-[var(--dg-success)] shadow-[0_0_16px_var(--dg-success-glow)]">
            <CheckCheck className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-[var(--dg-text)]">
              Message envoyé
            </h2>
            <p className="text-sm text-[var(--dg-text-muted)]">
              Nous reviendrons vers vous rapidement.
            </p>
          </div>
        </div>
        <p className="mt-2 text-sm text-[var(--dg-text)]">
          Votre référence de suivi :{" "}
          <span className="font-mono font-semibold text-[var(--dg-success)]">
            {reference}
          </span>
        </p>
        <p className="text-xs text-[var(--dg-text-muted)]">
          Conservez cette référence pour suivre votre demande auprès du Haut
          Conseil de Terra Nova.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setReference(null)}
          className="h-12 w-fit cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)]"
        >
          <MessageCircle className="h-4 w-4" />
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {feedback ? (
        <div
          role="alert"
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
                ? "bg-[var(--dg-success)]"
                : "bg-[var(--dg-danger)]",
            )}
          />
          <span>{feedback.message}</span>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nom complet" htmlFor="contact-name" error={errors.name?.message}>
          <Input
            id="contact-name"
            className={inputClassName}
            placeholder="Votre nom"
            autoComplete="name"
            {...register("name")}
          />
        </Field>
        <Field label="Email" htmlFor="contact-email" error={errors.email?.message}>
          <Input
            id="contact-email"
            type="email"
            className={inputClassName}
            placeholder="vous@exemple.fr"
            autoComplete="email"
            {...register("email")}
          />
        </Field>
      </div>

      <Field label="Objet" htmlFor="contact-subject" error={errors.subject?.message}>
        <Input
          id="contact-subject"
          className={inputClassName}
          placeholder="En quoi pouvons-nous vous aider ?"
          {...register("subject")}
        />
      </Field>

      <Field label="Thème" htmlFor="contact-category" error={errors.category?.message}>
        <select
          id="contact-category"
          className={cn(inputClassName, "cursor-pointer")}
          {...register("category")}
        >
          {CONTACT_CATEGORIES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" htmlFor="contact-message" error={errors.message?.message}>
        <textarea
          id="contact-message"
          rows={5}
          className={cn(inputClassName, "resize-y py-3")}
          placeholder="Décrivez votre demande (10 caractères minimum)."
          {...register("message")}
        />
      </Field>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="dg-btn-accent h-12 w-fit cursor-pointer"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Envoyer le message
      </Button>
    </form>
  );
}