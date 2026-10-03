"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Eye,
  EyeOff,
  Fingerprint,
  Loader2,
  Lock,
  Mail,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/auth-card";
import { ErrorSummary, type FormError } from "@/components/auth/error-summary";
import { TwoFactorStep } from "@/components/auth/two-factor-step";
import { loginSchema, type LoginInput } from "@/schemas/auth/login-schema";
import { loginService } from "@/services/auth/login-service";
import { resendVerificationService } from "@/services/auth/verify-email-service";
import {
  getAuthErrorMessage,
  isEmailNotVerifiedError,
  type LoginData,
  type MfaFactor,
} from "@/services/auth/types";
import TransitionLink from "@/components/pageTransitions/TransitionLink";

type ServerError = {
  message: string;
  emailNotVerified: boolean;
};

type TwoFactorState = {
  pendingToken: string;
  factors: MfaFactor[];
};

export function LoginForm({
  registered,
  verified,
  reset,
}: {
  registered?: boolean;
  verified?: boolean;
  reset?: boolean;
}) {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<ServerError | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [twoFactor, setTwoFactor] = useState<TwoFactorState | null>(null);
  const [resendState, setResendState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = form;

  useEffect(() => {
    if (!submitted) return;
    if (Object.keys(errors).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }, [errors, submitted]);

  const summaryErrors: FormError[] = (
    Object.entries(errors) as [keyof LoginInput, { message?: string }][]
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
      setServerError({
        message: "Impossible d'établir la session. Réessayez.",
        emailNotVerified: false,
      });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    setSubmitted(true);

    try {
      const data = await loginService(values);

      if (data.requiresTwoFactor && data.pendingToken) {
        setTwoFactor({
          pendingToken: data.pendingToken,
          factors: data.factors ?? [],
        });
        return;
      }

      await establishSession(data);
    } catch (error) {
      setServerError({
        message: getAuthErrorMessage(error, "Identifiants invalides."),
        emailNotVerified: isEmailNotVerifiedError(error),
      });
    }
  }

  async function handleResendVerification() {
    const email = getValues("email");
    if (!email) return;
    setResendState("sending");
    try {
      await resendVerificationService({ email });
      setResendState("sent");
    } catch {
      setResendState("error");
    }
  }

  return (
    <AuthCard>
      {twoFactor ? (
        <TwoFactorStep
          pendingToken={twoFactor.pendingToken}
          factors={twoFactor.factors}
          onAuthenticated={(data) => void establishSession(data)}
          onCancel={() => setTwoFactor(null)}
        />
      ) : (
        <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-[var(--dg-accent)]/30 bg-[var(--dg-accent)]/10 shadow-[0_0_32px_var(--dg-accent-glow)]">
          <Fingerprint className="size-7 text-[var(--dg-accent-bright)]" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-[var(--dg-accent)]">Accès membre</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--dg-text)]">
          Content de vous revoir
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--dg-text-muted)]">
          Connectez-vous pour retrouver votre espace Terra Nova.
        </p>
      </div>

      {registered && (
        <SuccessBanner
          title="Compte créé avec succès"
          message="Vérifiez votre boîte mail pour valider votre inscription, puis connectez-vous."
        />
      )}

      {verified && (
        <SuccessBanner
          title="Email vérifié"
          message="Votre adresse email est confirmée. Vous pouvez maintenant vous connecter."
        />
      )}

      {reset && (
        <SuccessBanner
          title="Mot de passe réinitialisé"
          message="Votre mot de passe a été mis à jour. Connectez-vous avec votre nouveau mot de passe."
        />
      )}

      <ErrorSummary ref={summaryRef} errors={summaryErrors} />

      {serverError && (
        <div
          className="mb-6 flex items-start gap-3 rounded-2xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] px-4 py-3 text-sm text-[var(--dg-danger)]"
          role="alert"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="space-y-3">
            <p>{serverError.message}</p>
            {serverError.emailNotVerified && resendState !== "sent" && (
              <Button
                type="button"
                variant="outline"
                onClick={handleResendVerification}
                disabled={resendState === "sending"}
                className="h-9 cursor-pointer rounded-full border-[var(--dg-accent)]/40 text-xs text-[var(--dg-accent)] hover:bg-[var(--dg-accent)]/10"
              >
                {resendState === "sending" ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    Envoi…
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" aria-hidden="true" />
                    Renvoyer l&apos;email de vérification
                  </>
                )}
              </Button>
            )}
            {serverError.emailNotVerified && resendState === "sent" && (
              <p className="text-xs text-[var(--dg-success)]">
                Email de vérification renvoyé. Vérifiez votre boîte mail.
              </p>
            )}
            {resendState === "error" && (
              <p className="text-xs">
                Impossible de renvoyer l&apos;email pour le moment. Réessayez.
              </p>
            )}
          </div>
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[var(--dg-text-muted)]">
              Mot de passe
            </label>
            <TransitionLink
              href="/forgot-password"
              className="rounded text-xs text-[var(--dg-accent)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[var(--dg-accent)]"
            >
              Mot de passe oublié ?
            </TransitionLink>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--dg-text-faint)]" aria-hidden="true" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
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
          {errors.password && (
            <p id="password-error" className="flex items-center gap-1.5 text-xs text-[var(--dg-danger)]">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.password.message}
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

      <p className="mt-4 text-center text-sm text-[var(--dg-text-muted)]">
        <TransitionLink
          href="/login/passwordless"
          className="inline-flex items-center gap-1.5 rounded font-medium text-[var(--dg-accent)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[var(--dg-accent)]"
        >
          <Fingerprint className="size-4" aria-hidden="true" />
          Connexion sans mot de passe
        </TransitionLink>
      </p>

      <div className="mt-6 flex items-center gap-3 text-[11px] text-[var(--dg-text-faint)]">
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
        </>
      )}
    </AuthCard>
  );
}

function SuccessBanner({ title, message }: { title: string; message: string }) {
  return (
    <div
      className="mb-6 flex items-start gap-3 rounded-2xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-3 text-sm text-[var(--dg-success)]"
      role="status"
    >
      <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed opacity-90">{message}</p>
      </div>
    </div>
  );
}