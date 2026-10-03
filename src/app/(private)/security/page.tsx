"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import {
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getMe } from "@/services/auth/me-service";
import {
  activateTwoFactorService,
  deactivateTwoFactorService,
  disableEmailMfaService,
  enableEmailMfaService,
  setupTwoFactorService,
} from "@/services/auth/two-factor-service";
import { deleteOwnAccountService } from "@/services/auth/account-service";
import { getAuthErrorMessage } from "@/services/auth/types";
import {
  twoFactorCodeSchema,
  type TwoFactorCodeInput,
} from "@/schemas/auth/two-factor-schema";
import {
  deleteAccountSchema,
  type DeleteAccountInput,
} from "@/schemas/auth/delete-account-schema";
import { cn } from "@/lib/utils";

type Feedback = { kind: "success" | "error"; message: string } | null;

function FeedbackBanner({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  return (
    <div
      role="status"
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
            ? "bg-[var(--dg-success)] shadow-[0_0_8px_var(--dg-success-glow)]"
            : "bg-[var(--dg-danger)]",
        )}
      />
      <span>{feedback.message}</span>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <HudPanel edge className="flex flex-col gap-4 p-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
        {icon}
        {title}
      </h2>
      {children}
    </HudPanel>
  );
}

export default function SecurityPage() {
  const queryClient = useQueryClient();
  const { data: me, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  if (isLoading || !me) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-7 w-56 bg-white/10" />
        <Skeleton className="h-40 rounded-2xl bg-white/10" />
        <Skeleton className="h-40 rounded-2xl bg-white/10" />
        <Skeleton className="h-48 rounded-2xl bg-white/10" />
      </div>
    );
  }

  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["me"] });

  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Compte · Sécurité</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Sécurité du compte
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Gérez l&apos;authentification à deux facteurs et la suppression de
          votre compte.
        </p>
      </header>

      <SectionCard
        title="Authentification par application (TOTP)"
        icon={<Smartphone className="h-4 w-4 text-[var(--dg-accent-bright)]" />}
      >
        <TotpPanel active={me.totpActive} onChanged={refresh} />
      </SectionCard>

      <SectionCard
        title="Vérification par code email"
        icon={<Mail className="h-4 w-4 text-[var(--dg-accent-bright)]" />}
      >
        <EmailMfaPanel active={me.mfaEmailActive} onChanged={refresh} />
      </SectionCard>

      <SectionCard
        title="Suppression du compte"
        icon={<Trash2 className="h-4 w-4 text-[var(--dg-danger)]" />}
      >
        <DeleteAccountPanel />
      </SectionCard>
    </div>
  );
}

function TotpPanel({ active, onChanged }: { active: boolean; onChanged: () => void }) {
  const [setup, setSetup] = useState<{
    secret: string;
    qrDataUrl: string;
  } | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busy, setBusy] = useState(false);
  const [disableCode, setDisableCode] = useState("");

  const { register, handleSubmit, reset, formState } = useForm<TwoFactorCodeInput>({
    resolver: zodResolver(twoFactorCodeSchema),
    mode: "onTouched",
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 6000);
    return () => clearTimeout(timer);
  }, [feedback]);

  async function handleSetup() {
    setBusy(true);
    setFeedback(null);
    try {
      setSetup(await setupTwoFactorService());
    } catch (error) {
      setFeedback({ kind: "error", message: getAuthErrorMessage(error, "Configuration impossible.") });
    } finally {
      setBusy(false);
    }
  }

  async function handleActivate(values: TwoFactorCodeInput) {
    setBusy(true);
    setFeedback(null);
    try {
      const result = await activateTwoFactorService(values.code);
      setRecoveryCodes(result.recoveryCodes);
      setSetup(null);
      reset();
      onChanged();
    } catch (error) {
      setFeedback({ kind: "error", message: getAuthErrorMessage(error, "Code invalide.") });
    } finally {
      setBusy(false);
    }
  }

  async function handleDeactivate() {
    if (!disableCode.trim()) {
      setFeedback({ kind: "error", message: "Saisissez votre code TOTP ou mot de passe." });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      await deactivateTwoFactorService(disableCode.trim());
      setDisableCode("");
      setFeedback({ kind: "success", message: "Authentification à deux facteurs désactivée." });
      onChanged();
    } catch (error) {
      setFeedback({ kind: "error", message: getAuthErrorMessage(error, "Désactivation impossible.") });
    } finally {
      setBusy(false);
    }
  }

  const copyCodes = () => {
    if (!recoveryCodes) return;
    void navigator.clipboard.writeText(recoveryCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (recoveryCodes) {
    return (
      <div className="flex flex-col gap-3">
        <div
          className="flex items-start gap-3 rounded-xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-3 text-sm text-[var(--dg-success)]"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Authentification activée</p>
            <p className="mt-0.5 text-xs opacity-90">
              Conservez ces codes de récupération dans un endroit sûr. Chacun
              ne peut être utilisé qu&apos;une seule fois.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {recoveryCodes.map((code) => (
            <code
              key={code}
              className="rounded-lg border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-2 py-1 font-mono text-xs text-[var(--dg-accent-bright)]"
            >
              {code}
            </code>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={copyCodes}
            className="cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)] hover:text-[var(--dg-accent-bright)]"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copiés !" : "Copier les codes"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setRecoveryCodes(null)}
            className="cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)] hover:text-[var(--dg-accent-bright)]"
          >
            Fermer
          </Button>
        </div>
      </div>
    );
  }

  if (setup) {
    return (
      <div className="flex flex-col gap-3">
        <FeedbackBanner feedback={feedback} />
        <p className="text-xs text-[var(--dg-text-muted)]">
          Scannez ce QR code avec votre application d&apos;authentification
          (Google Authenticator, Authy…), puis saisissez le code à 6 chiffres.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={setup.qrDataUrl}
            alt="QR code d'authentification"
            className="h-40 w-40 rounded-xl border border-[var(--dg-border)] bg-white p-2"
          />
          <div className="flex w-full flex-col gap-2">
            <form onSubmit={handleSubmit(handleActivate)} className="flex flex-col gap-2" noValidate>
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Code à 6 chiffres"
                className="h-12 text-center text-lg tracking-[0.3em]"
                aria-label="Code de validation"
                {...register("code")}
              />
              {formState.errors.code && (
                <p className="text-xs text-[var(--dg-danger)]">
                  {formState.errors.code.message}
                </p>
              )}
              <Button
                type="submit"
                disabled={busy}
                className="dg-btn-accent cursor-pointer"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Activer la 2FA
              </Button>
            </form>
            <Button
              variant="ghost"
              onClick={() => setSetup(null)}
              className="cursor-pointer text-[var(--dg-text-muted)]"
            >
              Annuler
            </Button>
          </div>
        </div>
        <p className="text-xs text-[var(--dg-text-faint)]">
          Clé secrète : <code className="font-mono">{setup.secret}</code>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <FeedbackBanner feedback={feedback} />
      {active ? (
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2 text-sm text-[var(--dg-success)]">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Authentification par application activée.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={disableCode}
              onChange={(event) => setDisableCode(event.target.value)}
              placeholder="Code TOTP ou mot de passe"
              className="h-12 sm:max-w-xs"
              aria-label="Code ou mot de passe pour désactiver"
            />
            <Button
              variant="outline"
              onClick={() => void handleDeactivate()}
              disabled={busy}
              className="h-12 cursor-pointer border-[var(--dg-danger-border)] text-[var(--dg-danger)] hover:bg-[var(--dg-danger-soft)]"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Désactiver
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[var(--dg-text-muted)]">
            Ajoutez une couche de sécurité avec une application
            d&apos;authentification (TOTP).
          </p>
          <Button onClick={() => void handleSetup()} disabled={busy} className="dg-btn-accent h-12 w-fit cursor-pointer">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
            Configurer l&apos;authentification
          </Button>
        </div>
      )}
    </div>
  );
}

function EmailMfaPanel({ active, onChanged }: { active: boolean; onChanged: () => void }) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busy, setBusy] = useState(false);
  const [disableCode, setDisableCode] = useState("");

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 6000);
    return () => clearTimeout(timer);
  }, [feedback]);

  async function handleEnable() {
    setBusy(true);
    setFeedback(null);
    try {
      await enableEmailMfaService();
      setFeedback({ kind: "success", message: "Code email activé." });
      onChanged();
    } catch (error) {
      setFeedback({ kind: "error", message: getAuthErrorMessage(error, "Activation impossible.") });
    } finally {
      setBusy(false);
    }
  }

  async function handleDisable() {
    if (!disableCode.trim()) {
      setFeedback({ kind: "error", message: "Saisissez votre code TOTP ou mot de passe." });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      await disableEmailMfaService(disableCode.trim());
      setDisableCode("");
      setFeedback({ kind: "success", message: "Code email désactivé." });
      onChanged();
    } catch (error) {
      setFeedback({ kind: "error", message: getAuthErrorMessage(error, "Désactivation impossible.") });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <FeedbackBanner feedback={feedback} />
      {active ? (
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2 text-sm text-[var(--dg-success)]">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Vérification par code email activée.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={disableCode}
              onChange={(event) => setDisableCode(event.target.value)}
              placeholder="Code TOTP ou mot de passe"
              className="h-12 sm:max-w-xs"
              aria-label="Code ou mot de passe pour désactiver"
            />
            <Button
              variant="outline"
              onClick={() => void handleDisable()}
              disabled={busy}
              className="h-12 cursor-pointer border-[var(--dg-danger-border)] text-[var(--dg-danger)] hover:bg-[var(--dg-danger-soft)]"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Désactiver
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[var(--dg-text-muted)]">
            Recevez un code de vérification par email à chaque connexion.
          </p>
          <Button onClick={() => void handleEnable()} disabled={busy} className="dg-btn-accent h-12 w-fit cursor-pointer">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Activer le code email
          </Button>
        </div>
      )}
    </div>
  );
}

function DeleteAccountPanel() {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    mode: "onTouched",
    defaultValues: { confirm: false, password: "", email: "" },
  });

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 6000);
    return () => clearTimeout(timer);
  }, [feedback]);

  async function onSubmit(values: DeleteAccountInput) {
    setFeedback(null);
    try {
      await deleteOwnAccountService({
        confirm: values.confirm,
        password: values.password || undefined,
        email: values.email || undefined,
      });
      await signOut({ callbackUrl: "/login?deleted=1" });
    } catch (error) {
      setFeedback({ kind: "error", message: getAuthErrorMessage(error, "Suppression impossible.") });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <FeedbackBanner feedback={feedback} />
      <p className="text-sm text-[var(--dg-text-muted)]">
        La suppression est définitive : vos données sont anonymisées et vos
        sessions révoquées. Cette action est irréversible.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
              Mot de passe
            </span>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              className="h-12"
              {...register("password")}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
              Email (si pas de mot de passe)
            </span>
            <Input
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              className="h-12"
              {...register("email")}
            />
          </label>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 text-sm text-[var(--dg-text)]">
          <input
            type="checkbox"
            className="size-4 rounded accent-[var(--dg-danger)]"
            {...register("confirm")}
          />
          Je comprends que cette action est définitive et irréversible.
        </label>
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="destructive"
          className="h-12 w-fit cursor-pointer"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Supprimer définitivement mon compte
        </Button>
      </form>
    </div>
  );
}