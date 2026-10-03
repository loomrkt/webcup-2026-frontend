"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  KeyRound,
  Loader2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/auth-card";
import { ErrorSummary, type FormError } from "@/components/auth/error-summary";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/schemas/auth/forgot-password-schema";
import { forgotPasswordService } from "@/services/auth/forgot-password-service";
import { getAuthErrorMessage } from "@/services/auth/types";
import TransitionLink from "@/components/pageTransitions/TransitionLink";

export function ForgotPasswordForm() {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (!submitted) return;
    if (Object.keys(errors).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }, [errors, submitted]);

  const summaryErrors: FormError[] = (
    Object.entries(errors) as [keyof ForgotPasswordInput, { message?: string }][]
  )
    .filter(([, error]) => error?.message)
    .map(([field, error]) => ({ field, message: error.message as string }));

  async function onSubmit(values: ForgotPasswordInput) {
    setServerError(null);
    setSubmitted(true);

    try {
      await forgotPasswordService(values);
      setSent(true);
    } catch (error) {
      setServerError(
        getAuthErrorMessage(error, "Une erreur est survenue. Réessayez."),
      );
    }
  }

  if (sent) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center py-8 text-center" role="status">
          <div className="mb-6 flex size-16 items-center justify-center rounded-full border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] shadow-[0_0_40px_var(--dg-success-glow)]">
            <CheckCircle2 className="size-8 text-[var(--dg-success)]" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-[var(--dg-accent)]">Email envoyé</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--dg-text)]">
            Vérifiez votre boîte mail
          </h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--dg-text-muted)]">
            Si un compte existe pour cette adresse, un lien de réinitialisation
            vient d&apos;être envoyé. Il expire dans 1 heure.
          </p>
          <Button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-8 h-12 w-full cursor-pointer rounded-full border border-white/20 bg-gradient-to-b from-[var(--dg-accent-bright)] to-[var(--dg-accent)] text-sm font-semibold text-white transition-all hover:shadow-[0_0_36px_var(--dg-accent-glow)] hover:brightness-110"
          >
            Retour à la connexion
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-[var(--dg-accent)]/30 bg-[var(--dg-accent)]/10 shadow-[0_0_32px_var(--dg-accent-glow)]">
          <KeyRound className="size-7 text-[var(--dg-accent-bright)]" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-[var(--dg-accent)]">Récupération</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--dg-text)]">
          Mot de passe oublié
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--dg-text-muted)]">
          Saisissez votre adresse email. Nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
        </p>
      </div>

      <ErrorSummary ref={summaryRef} errors={summaryErrors} />

      {serverError && (
        <div
          className="mb-6 flex items-start gap-3 rounded-2xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] px-4 py-3 text-sm text-[var(--dg-danger)]"
          role="alert"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{serverError}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-busy={isSubmitting}
        className="space-y-5"
      >
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[var(--dg-text-muted)]">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--dg-text-faint)]" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              className={`pl-10 ${errors.email ? "border-[var(--dg-danger)]/60 focus:border-[var(--dg-danger)]/60 focus:ring-[var(--dg-danger)]/15" : ""}`}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="flex items-center gap-1.5 text-xs text-[var(--dg-danger)]">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="group h-12 w-full cursor-pointer rounded-full border border-white/20 bg-gradient-to-b from-[var(--dg-accent-bright)] to-[var(--dg-accent)] text-sm font-semibold text-white transition-all hover:shadow-[0_0_36px_var(--dg-accent-glow)] hover:brightness-110 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Envoi du lien…
            </>
          ) : (
            <>
              Envoyer le lien
              <span className="ml-1 flex size-6 items-center justify-center rounded-full bg-white text-[var(--dg-accent)] transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--dg-text-muted)]">
        <TransitionLink
          href="/login"
          className="inline-flex items-center gap-1.5 rounded font-semibold text-[var(--dg-accent)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[var(--dg-accent)]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour à la connexion
        </TransitionLink>
      </p>
    </AuthCard>
  );
}