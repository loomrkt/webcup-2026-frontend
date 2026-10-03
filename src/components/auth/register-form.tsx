"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/auth-card";
import { ErrorSummary, type FormError } from "@/components/auth/error-summary";
import { PasswordChecklist } from "@/components/auth/password-checklist";
import { registerPayloadSchema } from "@/schemas/auth/register-schema";
import { registerService } from "@/services/auth/register-service";

type FieldErrors = Partial<
  Record<"email" | "password" | "confirmPassword", string>
>;

function getServerError(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message) return message;
    if (Array.isArray(message) && message[0]) return String(message[0]);
  }
  return "L'inscription a échoué. Réessayez.";
}

export function RegisterForm() {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => router.push("/login?registered=1"), 1800);
    return () => clearTimeout(timer);
  }, [success, router]);

  function validateField(
    field: keyof FieldErrors,
    value: string,
  ): string | undefined {
    if (field === "email") {
      if (!value.trim()) return "L'email est requis.";
      if (!registerPayloadSchema.shape.email.safeParse(value).success)
        return "Adresse email invalide.";
    }
    if (field === "password") {
      if (!value) return "Le mot de passe est requis.";
      const result = registerPayloadSchema.shape.password.safeParse(value);
      if (!result.success) return result.error.issues[0]?.message;
    }
    if (field === "confirmPassword") {
      if (!value) return "Veuillez confirmer le mot de passe.";
      if (password && value !== password)
        return "Les mots de passe ne correspondent pas.";
    }
    return undefined;
  }

  function validateAll(): FieldErrors {
    return {
      email: validateField("email", email),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };
  }

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function toSummaryErrors(errors: FieldErrors): FormError[] {
    return Object.entries(errors)
      .filter(([, message]) => message)
      .map(([field, message]) => ({ field, message: message as string }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const errors = validateAll();
    const summaryErrors = toSummaryErrors(errors);

    if (summaryErrors.length > 0) {
      setFieldErrors(errors);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setIsLoading(true);

    try {
      await registerService({ email, password });
      setSuccess(true);
    } catch (error) {
      setServerError(getServerError(error));
    } finally {
      setIsLoading(false);
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
          Créez votre identité Loomrkt en quelques secondes.
        </p>
      </div>

      <ErrorSummary ref={summaryRef} errors={toSummaryErrors(fieldErrors)} />

      {serverError && (
        <div
          className="mb-6 flex items-start gap-3 rounded-2xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] px-4 py-3 text-sm text-[var(--dg-danger)]"
          role="alert"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-busy={isLoading} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[var(--dg-text-muted)]">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--dg-text-faint)]" aria-hidden="true" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              className={`pl-10 ${fieldErrors.email ? "border-[var(--dg-danger)]/60 focus:border-[var(--dg-danger)]/60 focus:ring-[var(--dg-danger)]/15" : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              onBlur={() =>
                setFieldErrors((prev) => ({
                  ...prev,
                  email: validateField("email", email),
                }))
              }
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              required
            />
          </div>
          {fieldErrors.email && (
            <p id="email-error" className="flex items-center gap-1.5 text-xs text-[var(--dg-danger)]">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              {fieldErrors.email}
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
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="8+ caractères, 1 majuscule, 1 chiffre"
              className={`pl-10 pr-11 ${fieldErrors.password ? "border-[var(--dg-danger)]/60 focus:border-[var(--dg-danger)]/60 focus:ring-[var(--dg-danger)]/15" : ""}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
                clearFieldError("confirmPassword");
              }}
              onBlur={() =>
                setFieldErrors((prev) => ({
                  ...prev,
                  password: validateField("password", password),
                  confirmPassword: validateField("confirmPassword", confirmPassword),
                }))
              }
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              required
            />
            <button
              type="button"
              aria-label={
                showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
              }
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
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
          {fieldErrors.password && (
            <p id="password-error" className="flex items-center gap-1.5 text-xs text-[var(--dg-danger)]">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              {fieldErrors.password}
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
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className={`pl-10 ${fieldErrors.confirmPassword ? "border-[var(--dg-danger)]/60 focus:border-[var(--dg-danger)]/60 focus:ring-[var(--dg-danger)]/15" : ""}`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError("confirmPassword");
              }}
              onBlur={() =>
                setFieldErrors((prev) => ({
                  ...prev,
                  confirmPassword: validateField("confirmPassword", confirmPassword),
                }))
              }
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              aria-describedby={
                fieldErrors.confirmPassword
                  ? "confirm-password-error"
                  : undefined
              }
              required
            />
          </div>
          {fieldErrors.confirmPassword && (
            <p id="confirm-password-error" className="flex items-center gap-1.5 text-xs text-[var(--dg-danger)]">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="group h-12 w-full cursor-pointer rounded-full border border-white/20 bg-gradient-to-b from-[var(--dg-accent-bright)] to-[var(--dg-accent)] text-sm font-semibold text-white transition-all hover:shadow-[0_0_36px_var(--dg-accent-glow)] hover:brightness-110 disabled:opacity-60"
        >
          {isLoading ? (
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
        <Link
          href="/login"
          className="rounded font-semibold text-[var(--dg-accent)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[var(--dg-accent)]"
        >
          Se connecter
        </Link>
      </p>
    </AuthCard>
  );
}