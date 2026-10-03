"use client";

import { CalendarX2, Loader2, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  APPOINTMENT_STATUS_BADGE,
  APPOINTMENT_STATUS_LABELS,
  formatDate,
  formatTime,
  useCancelAppointmentMutation,
  useMyAppointmentsQuery,
  type Appointment,
} from "@/entities/appointment";
import { cn } from "@/lib/utils";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-20 rounded-xl bg-white/10" />
      ))}
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const cancel = useCancelAppointmentMutation();
  const [busy, setBusy] = useState(false);
  const inPast = new Date(appointment.startsAt) <= new Date();

  return (
    <li className="hud-cut flex flex-wrap items-center gap-3 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 backdrop-blur transition-colors hover:border-[var(--dg-border-strong)] hover:bg-[var(--dg-bg-card-hover)]">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[var(--dg-accent-bright)]">
            {appointment.ref}
          </span>
          <span
            className={cn(
              "hud-chip border px-2 py-0.5 text-[10px]",
              APPOINTMENT_STATUS_BADGE[appointment.status],
            )}
          >
            {APPOINTMENT_STATUS_LABELS[appointment.status]}
          </span>
        </div>
        <p className="mt-1 text-[13.5px] font-medium text-white">
          {formatDate(appointment.startsAt)} · {formatTime(appointment.startsAt)}
          {" – "}
          {formatTime(appointment.endsAt)}
        </p>
        <p className="text-[11px] text-[var(--dg-text-faint)]">
          {appointment.service?.name ?? appointment.location ?? "Rendez-vous municipal"}
          {appointment.notes ? ` — ${appointment.notes}` : ""}
        </p>
      </div>

      {appointment.status === "scheduled" && !inPast ? (
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => {
            if (!confirm("Annuler ce rendez-vous ?")) return;
            setBusy(true);
            cancel.mutate(appointment.id, { onSettled: () => setBusy(false) });
          }}
          className="cursor-pointer border-[var(--dg-danger-border)] text-[var(--dg-danger)] hover:bg-[var(--dg-danger-soft)]"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CalendarX2 className="h-3.5 w-3.5" />
          )}
          Annuler
        </Button>
      ) : null}
    </li>
  );
}

export function AppointmentList() {
  const { data, isLoading, isError, refetch } = useMyAppointmentsQuery();

  if (isLoading) return <ListSkeleton />;

  if (isError || !data) {
    return (
      <HudPanel edge className="flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-sm text-[var(--dg-text-muted)]">
          Impossible de charger vos rendez-vous.
        </p>
        <Button
          variant="outline"
          onClick={() => void refetch()}
          className="cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)]"
        >
          <RefreshCcw className="h-4 w-4" />
          Réessayer
        </Button>
      </HudPanel>
    );
  }

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[var(--dg-text-faint)]">
        Aucun rendez-vous pour le moment.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5" aria-live="polite">
      {data.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </ul>
  );
}