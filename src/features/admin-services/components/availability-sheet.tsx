"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Loader2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  disableServiceSchema,
  enableServiceSchema,
  type DisableServiceFormInput,
  type EnableServiceInput,
} from "@/schemas/services/availability-schema";
import { getApiErrorMessage } from "@/services/common/error-message";
import { setServiceAvailability } from "@/services/services/services-service";
import type { Service } from "@/services/services/types";

const textareaClass =
  "h-24 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

function StatusSegmented({
  value,
  onChange,
}: {
  value: "incident" | "maintenance";
  onChange: (value: "incident" | "maintenance") => void;
}) {
  const options = [
    { value: "incident", label: "Incident" },
    { value: "maintenance", label: "Maintenance" },
  ] as const;
  return (
    <div role="radiogroup" aria-label="Type d'indisponibilité" className="flex gap-2">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              "hud-chip cursor-pointer rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors focus-within:ring-3 focus-within:ring-[var(--dg-accent)]/40 focus-within:outline-none",
              selected
                ? "border-[var(--dg-accent-border)] bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)]"
                : "border-[var(--dg-border)] bg-[var(--dg-bg-card)] text-[var(--dg-text-muted)]",
            )}
          >
            <input
              type="radio"
              name="disable-status"
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}

export function AvailabilitySheet({
  service,
  onClose,
  onChanged,
}: {
  service: Service;
  onClose: () => void;
  onChanged: () => void;
}) {
  const disabling = service.active;

  const disableForm = useForm<DisableServiceFormInput>({
    resolver: zodResolver(disableServiceSchema),
    mode: "onTouched",
    defaultValues: { reason: "", status: "incident" },
  });

  const enableForm = useForm<EnableServiceInput>({
    resolver: zodResolver(enableServiceSchema),
    mode: "onTouched",
    defaultValues: { reason: "" },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const disableStatus = disableForm.watch("status") ?? "incident";

  const submit = async () => {
    setServerError(null);
    try {
      if (disabling) {
        const values = disableForm.getValues();
        const parsed = disableServiceSchema.parse(values);
        await setServiceAvailability(service.id, {
          available: false,
          status: parsed.status,
          reason: parsed.reason,
        });
      } else {
        const values = enableForm.getValues();
        const parsed = enableServiceSchema.parse(values);
        await setServiceAvailability(service.id, {
          available: true,
          status: "available",
          reason: parsed.reason?.trim() ? parsed.reason.trim() : null,
        });
      }
      onChanged();
    } catch (error) {
      setServerError(
        getApiErrorMessage(
          error,
          disabling
            ? "Impossible de désactiver le service."
            : "Impossible de réactiver le service.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    void submit();
  };

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full border-none bg-[var(--dg-bg-raised)] p-0 sm:max-w-[28rem]!"
      >
        <SheetHeader>
          <SheetTitle className="text-base font-semibold text-white">
            {disabling ? "Désactiver" : "Réactiver"} — {service.name}
          </SheetTitle>
          <SheetDescription className="text-sm text-[var(--dg-text-muted)]">
            {disabling
              ? "Le service sera masqué aux habitants et marqué indisponible (F63). Le motif est obligatoire."
              : "Le service redevient visible et opérationnel pour les habitants."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 px-4">
          {serverError && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] px-4 py-3 text-sm text-[var(--dg-danger)]"
            >
              <CircleAlert className="size-4 shrink-0" aria-hidden />
              {serverError}
            </p>
          )}

          {disabling ? (
            <>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]">
                  Type d&apos;indisponibilité
                </p>
                <StatusSegmented
                  value={disableStatus}
                  onChange={(status) =>
                    disableForm.setValue("status", status, { shouldDirty: true })
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="disable-reason"
                  className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]"
                >
                  Motif (obligatoire)
                </label>
                <textarea
                  id="disable-reason"
                  placeholder="Ex. : panne réseau au secteur B, maintenance du dôme…"
                  aria-invalid={disableForm.formState.errors.reason ? true : undefined}
                  aria-describedby={
                    disableForm.formState.errors.reason
                      ? "disable-reason-error"
                      : undefined
                  }
                  className={cn(
                    textareaClass,
                    disableForm.formState.errors.reason &&
                      "border-[var(--dg-danger-border)]",
                  )}
                  {...disableForm.register("reason")}
                />
                {disableForm.formState.errors.reason && (
                  <p
                    id="disable-reason-error"
                    role="alert"
                    className="text-xs text-[var(--dg-danger)]"
                  >
                    {disableForm.formState.errors.reason.message}
                  </p>
                )}
                <p className="text-xs text-[var(--dg-text-faint)]">
                  Ce motif sera affiché aux habitants sur la page « État des
                  services ».
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="enable-reason"
                className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]"
              >
                Motif (facultatif)
              </label>
              <textarea
                id="enable-reason"
                placeholder="Ex. : incident résolu, maintenance terminée…"
                className={textareaClass}
                {...enableForm.register("reason")}
              />
            </div>
          )}

          <SheetFooter>
            <Button
              type="submit"
              disabled={submitting}
              className={cn("w-full", disabling ? "" : "dg-btn-accent")}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Enregistrement…
                </>
              ) : (
                <>
                  <Power aria-hidden />
                  {disabling ? "Désactiver le service" : "Réactiver le service"}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={submitting}
              className="w-full"
            >
              Annuler
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}