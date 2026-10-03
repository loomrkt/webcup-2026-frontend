"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  Loader2,
  Mail,
  MailWarning,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/auth-card";
import { ErrorSummary, type FormError } from "@/components/auth/error-summary";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/schemas/auth/forgot-password-schema";
import { emailVerificationTokenSchema } from "@/schemas/auth/verify-email-schema";
import {
  resendVerificationService,
  verifyEmailService,
} from "@/services/auth/verify-email-service";
import { getAuthErrorMessage } from "@/services/auth/types";
import TransitionLink from "@/components/pageTransitions/TransitionLink";

type Status = "verifying" | "verified" | "error";

export function VerifyEmailCard({ token }: { token: string }) {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<Status>("verifying");
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const resendForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = resendForm;

  function updateStatus(next: Status) {
    statusRef.current = next;
    setStatus(next);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (statusRef.current === "verified") {
        router.push("/login?verified=1");
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    const isValid = emailVerificationTokenSchema.safeParse(token).success;
    const task = isValid
      ? verifyEmailService({ token })
      : Promise.reject(new Error("invalid-token"));

    task
      .then(() => {
        if (cancelled) return;
        updateStatus("verified");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        updateStatus("error");
        setErrorMessage(
          isValid
            ? getAuthErrorMessage(
                error,
                "Ce lien de vérification est invalide ou a expiré.",
              )
            : "Ce lien de vérification est invalide ou incomplet. Demandez un nouveau lien.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const summaryErrors: FormError[] = (
    Object.entries(errors) as [keyof ForgotPasswordInput, { message?: string }][]
  )
    .filter(([, error]) => error?.message)
    .map(([field, error]) => ({ field, message: error.message as string }));

  async function onResend(values: ForgotPasswordInput) {
    setResendStatus("sending");
    try {
      await resendVerificationService(values);
      setResendStatus("sent");
    } catch (error) {
      setResendStatus("error");
      setErrorMessage(
        getAuthErrorMessage(error, "Impossible de renvoyer l'email."),
      );
    }
  }

  return (
    <AuthCard>
      <div className="flex flex-col items-center py-6 text-center">
        {status === "verifying" && (
          <>
            <div className="mb-6 flex size-16 items-center justify-center rounded-full border border-[var(--dg-accent)]/30 bg-[var(--dg-accent)]/10 shadow-[0_0_40px_var(--dg-accent-glow)]">
              <Loader2 className="size-8 animate-spin text-[var(--dg-accent-bright)]" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[var(--dg-accent)]">Vérification</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--dg-text)]">
              Vérification de l&apos;email
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--dg-text-muted)]">
              Nous vérifions votre adresse email…
            </p>
          </>
        )}

        {status === "verified" && (
          <>
            <div className="mb-6 flex size-16 items-center justify-center rounded-full border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] shadow-[0_0_40px_var(--dg-success-glow)]">
              <BadgeCheck className="size-8 text-[var(--dg-success)]" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[var(--dg-accent)]">Email confirmé</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--dg-text)]">
              Votre email est vérifié
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--dg-text-muted)]">
              Vous pouvez maintenant vous connecter. Redirection vers la
              connexion…
            </p>
            <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full rounded-full bg-[linear-gradient(90deg,var(--dg-accent),var(--dg-success),var(--dg-accent))] bg-[length:200%_100%] [animation:dg-progress_1.2s_ease-in-out_infinite]" />
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-6 flex size-16 items-center justify-center rounded-full border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] shadow-[0_0_40px_var(--dg-danger)]/20">
              <MailWarning className="size-8 text-[var(--dg-danger)]" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[var(--dg-accent)]">Lien invalide</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--dg-text)]">
              Impossible de vérifier
            </h1>
            {errorMessage && (
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--dg-text-muted)]">
                {errorMessage}
              </p>
            )}

            <div className="mt-8 w-full">
              {resendStatus === "sent" ? (
                <div
                  className="rounded-2xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-4 text-sm text-[var(--dg-success)]"
                  role="status"
                >
                  Email de vérification renvoyé. Vérifiez votre boîte mail.
                </div>
              ) : (
                <>
                  <p className="mb-4 text-left text-sm font-medium text-[var(--dg-text-muted)]">
                    Renvoyez un email de vérification :
                  </p>
                  <form onSubmit={handleSubmit(onResend)} noValidate className="space-y-4">
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
                    <ErrorSummary ref={summaryRef} errors={summaryErrors} />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="group h-12 w-full cursor-pointer rounded-full border border-white/20 bg-gradient-to-b from-[var(--dg-accent-bright)] to-[var(--dg-accent)] text-sm font-semibold text-white transition-all hover:shadow-[0_0_36px_var(--dg-accent-glow)] hover:brightness-110 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                          Envoi…
                        </>
                      ) : (
                        <>
                          <Send className="size-4" aria-hidden="true" />
                          Renvoyer l&apos;email de vérification
                        </>
                      )}
                    </Button>
                  </form>
                  {resendStatus === "error" && errorMessage && (
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[var(--dg-danger)]">
                      <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
                      {errorMessage}
                    </p>
                  )}
                </>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="h-12 w-full cursor-pointer rounded-full border border-[var(--dg-border)] bg-white/[0.04] text-sm font-semibold text-[var(--dg-text)] transition-colors hover:bg-white/[0.08]"
                >
                  Aller à la connexion
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {status !== "error" && (
        <p className="mt-6 text-center text-sm text-[var(--dg-text-muted)]">
          <TransitionLink
            href="/login"
            className="inline-flex items-center gap-1.5 rounded font-semibold text-[var(--dg-accent)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[var(--dg-accent)]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour à la connexion
          </TransitionLink>
        </p>
      )}
    </AuthCard>
  );
}