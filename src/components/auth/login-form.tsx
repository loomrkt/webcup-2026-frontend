"use client";

import { useRef, useState } from "react";
import Link from "next/link";
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
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
          <Fingerprint className="size-7 text-cyan-300" aria-hidden="true" />
        </div>
        <p className="font-[family-name:var(--font-jbm)] text-[10px] tracking-[0.4em] text-cyan-400/80 uppercase">
          Identification
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-orbitron)] text-2xl font-bold tracking-[0.12em] uppercase">
          Accès sécurisé
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Identifiez-vous pour rejoindre le réseau Loomrkt
        </p>
      </div>

      {registered && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300" role="status">
          <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" aria-hidden="true" />
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
          className="mb-6 flex items-start gap-3 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300"
          role="alert"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-busy={isLoading} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="font-[family-name:var(--font-jbm)] text-[10px] font-medium tracking-[0.3em] text-slate-400 uppercase"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              className={`pl-10 ${fieldErrors.email ? "border-rose-400/60 focus:border-rose-400/60 focus:ring-rose-400/10" : ""}`}
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
            <p id="email-error" className="flex items-center gap-1.5 text-xs text-rose-400">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="font-[family-name:var(--font-jbm)] text-[10px] font-medium tracking-[0.3em] text-slate-400 uppercase"
            >
              Mot de passe
            </label>
            <Link
              href="/forgot-password"
              className="rounded text-xs text-cyan-400 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`pl-10 pr-11 ${fieldErrors.password ? "border-rose-400/60 focus:border-rose-400/60 focus:ring-rose-400/10" : ""}`}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5 text-slate-500 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p id="password-error" className="flex items-center gap-1.5 text-xs text-rose-400">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              {fieldErrors.password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full cursor-pointer bg-gradient-to-r from-cyan-500 to-violet-600 text-sm font-semibold tracking-wide text-white shadow-[0_0_24px_rgba(34,211,238,0.35)] transition-shadow hover:shadow-[0_0_36px_rgba(139,92,246,0.5)] disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Vérification…
            </>
          ) : (
            <>
              Se connecter
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 flex items-center gap-3 font-[family-name:var(--font-jbm)] text-[9px] tracking-[0.35em] text-slate-500 uppercase">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-400/30" aria-hidden="true" />
        Protocole chiffré
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-400/30" aria-hidden="true" />
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          className="rounded font-semibold text-cyan-400 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400"
        >
          Créer un compte
        </Link>
      </p>
    </AuthCard>
  );
}