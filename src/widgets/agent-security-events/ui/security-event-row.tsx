import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SecurityEvent } from "@/entities/security";

export const SECURITY_EVENT_LABELS: Record<string, string> = {
  login_success: "Connexion réussie",
  login_failed: "Échec de connexion",
  login_locked: "Connexion bloquée",
  account_locked: "Compte verrouillé",
  password_reset_requested: "Réinitialisation demandée",
  password_reset: "Mot de passe réinitialisé",
  email_verified: "Email vérifié",
  two_factor_verified: "Code 2FA validé",
  two_factor_failed: "Échec du code 2FA",
  passwordless_requested: "Code magique demandé",
  passwordless_verified: "Code magique validé",
  mfa_email_sent: "Code email envoyé",
  new_device_login: "Nouvel appareil détecté",
  session_revoked: "Session révoquée",
};

const EVENT_META: Record<string, string> = {
  login_success:
    "bg-[var(--dg-success)]/15 text-[var(--dg-success)] border-[var(--dg-success-border)]",
  email_verified:
    "bg-[var(--dg-success)]/15 text-[var(--dg-success)] border-[var(--dg-success-border)]",
  two_factor_verified:
    "bg-[var(--dg-success)]/15 text-[var(--dg-success)] border-[var(--dg-success-border)]",
  passwordless_verified:
    "bg-[var(--dg-success)]/15 text-[var(--dg-success)] border-[var(--dg-success-border)]",
  password_reset_requested:
    "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40",
  password_reset:
    "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40",
  two_factor_failed:
    "bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border-[var(--dg-danger-border)]",
  login_failed:
    "bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border-[var(--dg-danger-border)]",
  login_locked:
    "bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border-[var(--dg-danger-border)]",
  account_locked:
    "bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border-[var(--dg-danger-border)]",
  new_device_login:
    "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40",
  session_revoked:
    "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40",
};

export function SecurityEventRow({ event }: { event: SecurityEvent }) {
  const [open, setOpen] = useState(false);
  const label = SECURITY_EVENT_LABELS[event.type] ?? event.type;
  const meta = EVENT_META[event.type];
  const hasDetails = event.details != null && Object.keys(event.details).length > 0;

  return (
    <li className="hud-cut border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 backdrop-blur transition-colors hover:border-[var(--dg-border-strong)] hover:bg-[var(--dg-bg-card-hover)]">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "hud-chip border px-2 py-0.5 text-[11px]",
            meta ??
              "bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border-[var(--dg-border)]",
          )}
        >
          {label}
        </span>
        <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-white">
          {event.email ?? "Système"}
        </span>
        {event.userAgent ? (
          <span className="max-w-52 truncate text-[11px] text-[var(--dg-text-faint)]">
            {event.userAgent}
          </span>
        ) : null}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--dg-text-faint)]">
        <span>
          {new Date(event.createdAt).toLocaleString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
        {event.ip ? <span>IP {event.ip}</span> : null}
        {hasDetails ? (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="ml-auto inline-flex cursor-pointer items-center gap-1 text-[var(--dg-accent-bright)] transition-colors hover:underline"
            aria-expanded={open}
            aria-label={`Afficher les détails de l'événement ${label}`}
          >
            Détails
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        ) : null}
      </div>

      {open && event.details && (
        <pre className="mt-2 max-h-44 overflow-auto rounded-lg border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-2 text-[10px] leading-relaxed text-[var(--dg-text-muted)]">
          {JSON.stringify(event.details, null, 2)}
        </pre>
      )}
    </li>
  );
}