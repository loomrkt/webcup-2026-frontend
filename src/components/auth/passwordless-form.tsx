"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Fingerprint,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/auth-card";
import { ErrorSummary, type FormError } from "@/components/auth/error-summary";
import { TwoFactorStep } from "@/components/auth/two-factor-step";
import {
  passwordlessRequestSchema,
  passwordlessVerifySchema,
  type PasswordlessRequestInput,
  type PasswordlessVerifyInput,
} from "@/schemas/auth/passwordless-schema";
import {
  passwordlessRequestService,
  passwordlessVerifyService,
} from "@/services/auth/passwordless-service";
import {
  getAuthErrorMessage,
  type LoginData,
  type MfaFactor,
} from "@/services/auth/types";
import TransitionLink from "@/components/pageTransitions/TransitionLink";

type Step = "email" | "code" | "two-factor";

export function PasswordlessForm() {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [factors, setFactors] = useState<MfaFactor[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const requestForm = useForm<PasswordlessRequestInput>({
    resolver: zodResolver(passwordlessRequestSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const verifyForm = useForm<PasswordlessVerifyInput>({
    resolver: zodResolver(passwordlessVerifySchema),
    mode: "onTouched",
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (!submitted) return;
    const errors =
      step === "email" ? requestForm.formState.errors : verifyForm.formState.errors;
    if (Object.keys(errors).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }, [submitted, step, requestForm.formState.errors, verifyForm.formState.errors]);

  const currentErrors =
    step === "email" ? requestForm.formState.errors : verifyForm.formState.errors;
  const summaryErrors: FormError[] = (
    Object.entries(currentErrors) as [string, { message?: string }][]
  )
    .filter(([, error]) => error?.message)
    .map(([field, error]) => ({ field, message: error.message as string }));

  async function establishSession(data: LoginData) {
    const result = await signIn("token-session", {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      redirect: false,
    });
    if (result?.error) {
      setServerError("Impossible d'établir la session. Réessayez.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function onSubmitEmail(values: PasswordlessRequestInput) {
    setServerError(null);
    setSubmitted(true);
    try {
      await passwordlessRequestService(values.email);
      setEmail(values.email);
      setStep("code");
    } catch (error) {
      setServerError(getAuthErrorMessage(error, "Une erreur est survenue."));
    }
  }

  async function onSubmitCode(values: PasswordlessVerifyInput) {
    setServerError(null);
    try {
      const data = await passwordlessVerifyService(email, values.code);
      if (data.requiresTwoFactor && data.pendingToken) {
        setPendingToken(data.pendingToken);
        setFactors(data.factors ?? []);
        setStep("two-factor");
        return;
      }
      await establishSession(data);
    } catch (error) {
      setServerError(getAuthErrorMessage(error, "Code invalide ou expiré."));
    }
  }

  return (
    <AuthCard>
      {step === "email" ? (
        <>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-[var(--dg-accent)]/30 bg-[var(--dg-accent)]/10 shadow-[0_0_32px_var(--dg-accent-glow)]">
              <Fingerprint className="size-7 text-[var(--dg-accent-bright)]" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[var(--dg-accent)]">Connexion simplifiée</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--dg-text)]">
              Sans mot de passe
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--dg-text-muted)]">
              Saisissez votre adresse email. Nous vous enverrons un code de
              connexion à usage unique.
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
            onSubmit={requestForm.handleSubmit(onSubmitEmail)}
            noValidate
            className="space-y-5"
          >
            <div className="space-y-2">
              <label htmlFor="passwordless-email" className="text-sm font-medium text-[var(--dg-text-muted)]">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--dg-text-faint)]" aria-hidden="true" />
                <Input
                  id="passwordless-email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@exemple.com"
                  className={`pl-10 ${requestForm.formState.errors.email ? "border-[var(--dg-danger)]/60 focus:border-[var(--dg-danger)]/60 focus:ring-[var(--dg-danger)]/15" : ""}`}
                  aria-invalid={Boolean(requestForm.formState.errors.email)}
                  {...requestForm.register("email")}
                />
              </div>
              {requestForm.formState.errors.email && (
                <p className="flex items-center gap-1.5 text-xs text-[var(--dg-danger)]">
                  <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
                  {requestForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={requestForm.formState.isSubmitting}
              className="group h-12 w-full cursor-pointer rounded-full border border-white/20 bg-gradient-to-b from-[var(--dg-accent-bright)] to-[var(--dg-accent)] text-sm font-semibold text-white transition-all hover:shadow-[0_0_36px_var(--dg-accent-glow)] hover:brightness-110 disabled:opacity-60"
            >
              {requestForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Envoi du code…
                </>
              ) : (
                <>
                  Envoyer le code
                  <ArrowRight className="size-4" aria-hidden="true" />
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
        </>
      ) : step === "code" ? (
        <>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] shadow-[0_0_40px_var(--dg-success-glow)]">
              <CheckCircle2 className="size-8 text-[var(--dg-success)]" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[var(--dg-accent)]">Code envoyé</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
              Vérifiez votre boîte mail
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--dg-text-muted)]">
              Saisissez le code à 6 chiffres reçu sur <span className="text-[var(--dg-text)]">{email}</span>.
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
            onSubmit={verifyForm.handleSubmit(onSubmitCode)}
            noValidate
            className="space-y-5"
          >
            <div className="space-y-2">
              <label htmlFor="passwordless-code" className="text-sm font-medium text-[var(--dg-text-muted)]">
                Code à 6 chiffres
              </label>
              <Input
                id="passwordless-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                className={`h-12 text-center text-lg tracking-[0.3em] ${verifyForm.formState.errors.code ? "border-[var(--dg-danger)]/60 focus:border-[var(--dg-danger)]/60 focus:ring-[var(--dg-danger)]/15" : ""}`}
                aria-invalid={Boolean(verifyForm.formState.errors.code)}
                {...verifyForm.register("code")}
              />
              {verifyForm.formState.errors.code && (
                <p className="flex items-center gap-1.5 text-xs text-[var(--dg-danger)]">
                  <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
                  {verifyForm.formState.errors.code.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={verifyForm.formState.isSubmitting}
              className="h-12 w-full cursor-pointer rounded-full border border-white/20 bg-gradient-to-b from-[var(--dg-accent-bright)] to-[var(--dg-accent)] text-sm font-semibold text-white transition-all hover:shadow-[0_0_36px_var(--dg-accent-glow)] hover:brightness-110 disabled:opacity-60"
            >
              {verifyForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Vérification…
                </>
              ) : (
                <>
                  <Send className="size-4" aria-hidden="true" />
                  Se connecter
                </>
              )}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setStep("email")}
            className="mx-auto mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded text-xs text-[var(--dg-text-muted)] transition-colors hover:text-[var(--dg-accent)]"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Changer d&apos;email
          </button>
        </>
      ) : (
        <TwoFactorStep
          pendingToken={pendingToken ?? ""}
          factors={factors}
          onAuthenticated={(data) => void establishSession(data)}
          onCancel={() => setStep("code")}
        />
      )}
    </AuthCard>
  );
}