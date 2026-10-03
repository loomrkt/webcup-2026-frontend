"use client";

import { Loader2, RotateCcw, ShieldOff, Trash2, UserX } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAccountQuery,
  useDeleteAccountMutation,
  useRestoreAccountMutation,
  useUpdateAccountMutation,
  type AccountStatus,
} from "@/entities/account";
import { cn } from "@/lib/utils";

const STATUS_META: Record<AccountStatus, { label: string; className: string }> =
  {
    active: {
      label: "Actif",
      className:
        "hud-chip bg-[var(--dg-success)]/15 text-[var(--dg-success)] border border-[var(--dg-success-border)]",
    },
    pending: {
      label: "En attente",
      className:
        "hud-chip bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border border-[var(--dg-border)]",
    },
    suspended: {
      label: "Suspendu",
      className:
        "hud-chip bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border border-[var(--dg-danger-border)]",
    },
    locked: {
      label: "Verrouillé",
      className:
        "hud-chip bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border border-[var(--dg-danger-border)]",
    },
    deleted: {
      label: "Supprimé",
      className:
        "hud-chip bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border border-[var(--dg-danger-border)]",
    },
  };

function statusMeta(status: string) {
  return STATUS_META[status as AccountStatus] ?? STATUS_META.pending;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[var(--dg-text-faint)]">{label}</span>
      <span className="truncate text-sm text-[var(--dg-text)]">
        {value || "—"}
      </span>
    </div>
  );
}

function Feedback({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="rounded-xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-3 text-sm text-[var(--dg-success)]"
    >
      {message}
    </div>
  );
}

export function AccountDetailSheet({
  userId,
  onClose,
  onChanged,
  onError,
}: {
  userId: string;
  onClose: () => void;
  onChanged: () => void;
  onError: (message: string) => void;
}) {
  const { data: account, isLoading } = useAccountQuery(userId);
  const update = useUpdateAccountMutation();
  const restore = useRestoreAccountMutation();
  const remove = useDeleteAccountMutation();
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const isDeleted = account?.status === "deleted";

  async function suspend() {
    if (!account) return;
    setBusy(true);
    setSuccess(null);
    update.mutate(
      { id: account.id, input: { status: "suspended" } },
      {
        onSuccess: () => {
          setSuccess("Compte suspendu.");
          onChanged();
        },
        onError: () => onError("Impossible de suspendre le compte."),
        onSettled: () => setBusy(false),
      },
    );
  }

  async function reactivate() {
    if (!account) return;
    setBusy(true);
    setSuccess(null);
    update.mutate(
      { id: account.id, input: { status: "active" } },
      {
        onSuccess: () => {
          setSuccess("Compte réactivé.");
          onChanged();
        },
        onError: () => onError("Impossible de réactiver le compte."),
        onSettled: () => setBusy(false),
      },
    );
  }

  async function restoreDeleted() {
    if (!account) return;
    setBusy(true);
    setSuccess(null);
    restore.mutate(account.id, {
      onSuccess: () => {
        setSuccess("Compte restauré.");
        onChanged();
      },
      onError: () => onError("Impossible de restaurer le compte."),
      onSettled: () => setBusy(false),
    });
  }

  async function deleteAccount() {
    if (!account) return;
    if (!confirm("Supprimer définitivement ce compte ? Cette action est irréversible.")) {
      return;
    }
    setBusy(true);
    setSuccess(null);
    remove.mutate(
      { id: account.id },
      {
        onSuccess: () => {
          setSuccess("Compte supprimé.");
          onChanged();
        },
        onError: () => onError("Impossible de supprimer le compte."),
        onSettled: () => setBusy(false),
      },
    );
  }

  return (
    <Sheet open onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <SheetContent
        side="right"
        className="w-full border-none bg-[var(--dg-bg-raised)] p-0 sm:max-w-[28rem]!"
      >
        <SheetHeader>
          <SheetTitle className="text-base font-semibold text-white">
            Gestion du compte
          </SheetTitle>
          <SheetDescription className="text-sm text-[var(--dg-text-muted)]">
            {account?.email ?? "Chargement…"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          {isLoading || !account ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-10 rounded-xl bg-white/10" />
              <Skeleton className="h-24 rounded-xl bg-white/10" />
              <Skeleton className="h-24 rounded-xl bg-white/10" />
            </div>
          ) : (
            <>
              {success && <Feedback message={success} />}

              <div className="flex items-center justify-between rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3">
                <span className="text-sm text-[var(--dg-text-muted)]">Statut</span>
                <Badge className={statusMeta(account.status).className}>
                  {statusMeta(account.status).label}
                </Badge>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3">
                <InfoRow label="Prénom" value={account.firstName} />
                <InfoRow label="Nom" value={account.lastName} />
                <InfoRow label="Téléphone" value={account.phone} />
                <InfoRow label="Adresse" value={account.address} />
                <InfoRow label="Ville" value={account.city} />
                <InfoRow label="Créé le" value={formatDate(account.createdAt)} />
              </div>

              {account.lockedUntil ? (
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] px-4 py-3 text-sm text-[var(--dg-danger)]",
                  )}
                >
                  <ShieldOff className="h-4 w-4" />
                  <span>
                    Verrouillé jusqu&apos;au {formatDate(account.lockedUntil)}
                  </span>
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                {!isDeleted && account.status !== "suspended" ? (
                  <Button
                    onClick={() => void suspend()}
                    disabled={busy}
                    className="cursor-pointer bg-[var(--dg-danger)]/15 text-[var(--dg-danger)] hover:bg-[var(--dg-danger)]/25"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
                    Suspendre le compte
                  </Button>
                ) : null}

                {!isDeleted && account.status === "suspended" ? (
                  <Button
                    onClick={() => void reactivate()}
                    disabled={busy}
                    className="dg-btn-accent cursor-pointer"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                    Réactiver le compte
                  </Button>
                ) : null}

                {isDeleted ? (
                  <Button
                    onClick={() => void restoreDeleted()}
                    disabled={busy}
                    className="dg-btn-accent cursor-pointer"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                    Restaurer le compte
                  </Button>
                ) : null}

                {!isDeleted ? (
                  <Button
                    onClick={() => void deleteAccount()}
                    disabled={busy}
                    variant="destructive"
                    className="cursor-pointer"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Supprimer le compte
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </div>

        <SheetFooter>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Fermer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}