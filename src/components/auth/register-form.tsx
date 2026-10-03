"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/auth-card";
import { ErrorSummary, type FormError } from "@/components/auth/error-summary";
import { PasswordChecklist } from "@/components/auth/password-checklist";
import {
  registerFormSchema,
  type RegisterFormInput,
} from "@/schemas/auth/register-schema";
import { registerService } from "@/services/auth/register-service";
import { getAuthErrorMessage } from "@/services/auth/types";
import TransitionLink from "@/components/pageTransitions/TransitionLink";

export function RegisterForm() {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = form;

  const password = watch("password");

  useEffect(() => {
    if (!submitted) return;
    if (Object.keys(errors).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }, [errors, submitted]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => router.push("/login?registered=1"), 1800);
    return () => clearTimeout(timer);
  }, [success, router]);

  const summaryErrors: FormError[] = (
    Object.entries(errors) as [keyof RegisterFormInput, { message?: string }][]
  )
    .filter(([, error]) => error?.message)
    .map(([field, error]) => ({ field, message: error.message as string }));

  async function onSubmit(values: RegisterFormInput) {
    setServerError(null);
    setSubmitted(true);

    try {
      await registerService({
        email: values.email,
        password: values.password,
      });
      setSuccess(true);
    } catch (error) {
      setServerError(getAuthErrorMessage(error, "L'inscription a échoué. Réessayez."));
    }
  }

  if (success) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center py-8 text-center" role="status">
          <div className="mb-6 flex size-16 items-center justify-center rounded-full border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] shadow-[0_0_40px_var(--dg-success-glow)]">
            <CheckCircle2 className="size-8 text-[var(--dg-success)]" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-[var(--dg-accent)]">Presque terminé</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--dg-text)]">
            Compte créé
          </h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--dg-text-muted)]">
            Vérifiez votre boîte mail pour valider votre inscription.
            Redirection vers la connexion…
          </p>
          <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-full rounded-full bg-[linear-gradient(90deg,var(--dg-accent),var(--dg-success),var(--dg-accent))] bg-[length:200%_100%] [animation:dg-progress_1.2s_ease-in-out_infinite]" />
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-[var(--dg-accent)]/30 bg-[var(--dg-accent)]/10 shadow-[0_0_32px_var(--dg-accent-glow)]">
          <Rocket className="size-7 text-[var(--dg-accent-bright)]" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-[var(--dg-accent)]">Nouveau membre</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--dg-text)]">
          Rejoignez le réseau
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--dg-text-muted)]">
          Créez votre identité citoyenne en quelques secondes.
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

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-[var(--dg-text-muted)]">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--dg-text-faint)]" aria-hidden="true" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="8+ caractères, 1 majuscule, 1 chiffre"
              className={`pl-10 pr-11 ${errors.password ? "border-[var(--dg-danger)]/60 focus:border-[var(--dg-danger)]/60 focus:ring-[var(--dg-danger)]/15" : ""}`}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            <button
              type="button"
              aria-label={
                showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
              }
              aria-pressed={showPassword}
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5 text-[var(--dg-text-faint)] transition-colors hover:text-[var(--dg-accent)] focus-visible:outline-2 focus-visible:outline-[var(--dg-accent)]"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {password.length > 0 && <PasswordChecklist password={password} />}
          {errors.password && (
            <p id="password-error" className="flex items-center gap-1.5 text-xs text-[var(--dg-danger)]">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--dg-text-muted)]">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--dg-text-faint)]" aria-hidden="true" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className={`pl-10 ${errors.confirmPassword ? "border-[var(--dg-danger)]/60 focus:border-[var(--dg-danger)]/60 focus:ring-[var(--dg-danger)]/15" : ""}`}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? "confirm-password-error" : undefined
              }
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="flex items-center gap-1.5 text-xs text-[var(--dg-danger)]">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.confirmPassword.message}
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
              Création du compte…
            </>
          ) : (
            <>
              Créer mon compte
              <span className="ml-1 flex size-6 items-center justify-center rounded-full bg-white text-[var(--dg-accent)] transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--dg-text-faint)]">
        <ShieldCheck className="size-4 text-[var(--dg-accent)]/80" aria-hidden="true" />
        Chiffrement de bout en bout
      </div>

      <p className="mt-6 text-center text-sm text-[var(--dg-text-muted)]">
        Déjà inscrit ?{" "}
        <TransitionLink
          href="/login"
          className="rounded font-semibold text-[var(--dg-accent)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[var(--dg-accent)]"
        >
          Se connecter
        </TransitionLink>
      </p>
    </AuthCard>
  );
}