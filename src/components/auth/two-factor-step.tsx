"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Loader2,
  Mail,
  Send,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  sendEmailMfaCodeService,
  verifyRecoveryCodeService,
  verifyTwoFactorService,
} from "@/services/auth/two-factor-service";
import {
  twoFactorCodeSchema,
  type TwoFactorCodeInput,
} from "@/schemas/auth/two-factor-schema";
import { getAuthErrorMessage, type LoginData, type MfaFactor } from "@/services/auth/types";

const FACTOR_LABELS: Record<MfaFactor, string> = {
  totp: "Application d'authentification",
  email: "Code par email",
};

export function TwoFactorStep({
  pendingToken,
  factors = ["totp"],
  onAuthenticated,
  onCancel,
}: {
  pendingToken: string;
  factors?: MfaFactor[];
  onAuthenticated: (data: LoginData) => void;
  onCancel?: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [mode, setMode] = useState<"code" | "recovery">("code");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TwoFactorCodeInput>({
    resolver: zodResolver(twoFactorCodeSchema),
    mode: "onTouched",
    defaultValues: { code: "" },
  });

  const hasEmail = factors.includes("email");
  const hasTotp = factors.includes("totp");

  async function onSubmit(values: TwoFactorCodeInput) {
    setServerError(null);
    try {
      const result =
        mode === "recovery"
          ? await verifyRecoveryCodeService(pendingToken, values.code)
          : await verifyTwoFactorService(pendingToken, values.code);
      onAuthenticated(result);
    } catch (error) {
      setServerError(
        getAuthErrorMessage(error, "Code invalide. Réessayez."),
      );
    }
  }

  async function handleSendEmail() {
    setSendingEmail(true);
    setServerError(null);
    try {
      await sendEmailMfaCodeService(pendingToken);
      setEmailSent(true);
    } catch (error) {
      setServerError(getAuthErrorMessage(error, "Envoi impossible."));
    } finally {
      setSendingEmail(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-[var(--dg-accent)]/30 bg-[var(--dg-accent)]/10 shadow-[0_0_32px_var(--dg-accent-glow)]">
          <ShieldCheck className="size-7 text-[var(--dg-accent-bright)]" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-[var(--dg-accent)]">Vérification en deux étapes</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Confirmez votre identité
        </h1>
        <p className="text-sm leading-relaxed text-[var(--dg-text-muted)]">
          Saisissez le code de vérification demandé par votre méthode de
          sécurité.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {factors.map((factor) => (
          <span
            key={factor}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dg-accent)]/40 bg-[var(--dg-accent)]/10 px-3 py-1 text-xs text-[var(--dg-accent-bright)]"
          >
            {factor === "totp" ? (
              <Smartphone className="size-3.5" aria-hidden="true" />
            ) : (
              <Mail className="size-3.5" aria-hidden="true" />
            )}
            {FACTOR_LABELS[factor]}
          </span>
        ))}
      </div>

      {serverError && (
        <div
          className="flex items-start gap-3 rounded-2xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] px-4 py-3 text-sm text-[var(--dg-danger)]"
          role="alert"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="two-factor-code" className="text-sm font-medium text-[var(--dg-text-muted)]">
              {mode === "recovery"
                ? "Code de récupération"
                : "Code à 6 chiffres"}
            </label>
            <button
              type="button"
              onClick={() => {
                setMode((current) =>
                  current === "code" ? "recovery" : "code",
                );
                setServerError(null);
              }}
              className="cursor-pointer rounded text-xs text-[var(--dg-accent)] transition-opacity hover:opacity-80"
            >
              {mode === "recovery"
                ? "Utiliser le code de vérification"
                : "Utiliser un code de récupération"}
            </button>
          </div>
          <Input
            id="two-factor-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            className={`h-12 text-center text-lg tracking-[0.3em] ${errors.code ? "border-[var(--dg-danger)]/60 focus:border-[var(--dg-danger)]/60 focus:ring-[var(--dg-danger)]/15" : ""}`}
            aria-invalid={Boolean(errors.code)}
            aria-describedby={errors.code ? "two-factor-code-error" : undefined}
            {...register("code")}
          />
          {errors.code && (
            <p id="two-factor-code-error" className="flex items-center gap-1.5 text-xs text-[var(--dg-danger)]">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.code.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full cursor-pointer rounded-full border border-white/20 bg-gradient-to-b from-[var(--dg-accent-bright)] to-[var(--dg-accent)] text-sm font-semibold text-white transition-all hover:shadow-[0_0_36px_var(--dg-accent-glow)] hover:brightness-110 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Vérification…
            </>
          ) : (
            <>
              Vérifier
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      {hasEmail && (
        <div className="flex flex-col gap-2">
          <p className="text-center text-xs text-[var(--dg-text-faint)]">
            {hasTotp
              ? "Vous avez aussi activé le code par email."
              : "Un code de vérification vous a été envoyé par email."}
          </p>
          {!emailSent ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleSendEmail}
              disabled={sendingEmail}
              className="h-11 cursor-pointer rounded-full border-[var(--dg-accent)]/40 text-xs text-[var(--dg-accent)] hover:bg-[var(--dg-accent)]/10"
            >
              {sendingEmail ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="size-3.5" aria-hidden="true" />
              )}
              Envoyer le code par email
            </Button>
          ) : (
            <p className="text-center text-xs text-[var(--dg-success)]">
              Code envoyé. Vérifiez votre boîte mail.
            </p>
          )}
        </div>
      )}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mx-auto inline-flex cursor-pointer items-center gap-1.5 rounded text-xs text-[var(--dg-text-muted)] transition-colors hover:text-[var(--dg-accent)]"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Retour
        </button>
      )}
    </div>
  );
}