"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import TransitionLink from "@/components/pageTransitions/TransitionLink";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  Fingerprint,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/auth-card";
import { ErrorSummary, type FormError } from "@/components/auth/error-summary";
import { loginSchema } from "@/schemas/auth/login-schema";
import { loginService } from "@/services/auth/login-service";

type FieldErrors = Partial<Record<"email" | "password", string>>;

function getServerError(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message) return message;
    if (Array.isArray(message) && message[0]) return String(message[0]);
  }
  return "Échec de la connexion. Vérifiez vos identifiants.";
}

export function LoginForm({ registered }: { registered?: boolean }) {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validateField(field: "email" | "password", value: string) {
    if (field === "email") {
      if (!value.trim()) return "L'email est requis.";
      if (!loginSchema.shape.email.safeParse(value).success)
        return "Adresse email invalide.";
    }
    if (field === "password" && !value) return "Le mot de passe est requis.";
    return undefined;
  }

  function validateAll(): FieldErrors {
    return {
      email: validateField("email", email),
      password: validateField("password", password),
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const errors = validateAll();
    const summaryErrors: FormError[] = Object.entries(errors)
      .filter(([, message]) => message)
      .map(([field, message]) => ({ field, message: message as string }));

    if (summaryErrors.length > 0) {
      setFieldErrors(errors);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const serverMessage = await loginService({ email, password })
          .then(() => null)
          .catch(getServerError);
        setServerError(serverMessage ?? "Identifiants invalides.");
        return;
      }

      router.push(process.env.NEXT_PUBLIC_REDIRECT_URL ?? "/");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-[var(--dg-accent)]/30 bg-[var(--dg-accent)]/10 shadow-[0_0_32px_var(--dg-accent-glow)]">
          <Fingerprint className="size-7 text-[var(--dg-accent-bright)]" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-[var(--dg-accent)]">Accès membre</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--dg-text)]">
          Content de vous revoir
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--dg-text-muted)]">
          Connectez-vous pour retrouver votre espace Loomrkt.
        </p>
      </div>

      {registered && (
        <div
          className="mb-6 flex items-start gap-3 rounded-2xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-3 text-sm text-[var(--dg-success)]"
          role="status"
        >
          <span
            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--dg-success)] shadow-[0_0_8px_var(--dg-success)]"
            aria-hidden="true"
          />
          <p>
            Compte créé avec succès. Vérifiez votre boîte mail pour valider
            votre inscription, puis connectez-vous.
          </p>
        </div>
      )}

      <ErrorSummary
        ref={summaryRef}
        errors={Object.entries(fieldErrors)
          .filter(([, message]) => message)
          .map(([field, message]) => ({
            field,
            message: message as string,
          }))}
      />

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
              onBlur={() => {
                const message = validateField("email", email);
                setFieldErrors((prev) => ({
                  ...prev,
                  email: message,
                }));
              }}
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[var(--dg-text-muted)]">
              Mot de passe
            </label>
            <Link
              href="/forgot-password"
              className="rounded text-xs text-[var(--dg-accent)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[var(--dg-accent)]"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--dg-text-faint)]" aria-hidden="true" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`pl-10 pr-11 ${fieldErrors.password ? "border-[var(--dg-danger)]/60 focus:border-[var(--dg-danger)]/60 focus:ring-[var(--dg-danger)]/15" : ""}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              onBlur={() => {
                const message = validateField("password", password);
                setFieldErrors((prev) => ({
                  ...prev,
                  password: message,
                }));
              }}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
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
          {fieldErrors.password && (
            <p id="password-error" className="flex items-center gap-1.5 text-xs text-[var(--dg-danger)]">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              {fieldErrors.password}
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
              Vérification…
            </>
          ) : (
            <>
              Se connecter
              <span className="ml-1 flex size-6 items-center justify-center rounded-full bg-white text-[var(--dg-accent)] transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 flex items-center gap-3 text-[11px] text-[var(--dg-text-faint)]">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--dg-border-strong)]" aria-hidden="true" />
        Protocole chiffré
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--dg-border-strong)]" aria-hidden="true" />
      </div>

      <p className="mt-6 text-center text-sm text-[var(--dg-text-muted)]">
        Pas encore de compte ?{" "}
        <TransitionLink
          href="/register"
          className="rounded font-semibold text-[var(--dg-accent)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[var(--dg-accent)]"
        >
          Créer un compte
        </TransitionLink>
      </p>
    </AuthCard>
  );
}