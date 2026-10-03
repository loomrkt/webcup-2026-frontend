"use client";

import { AlarmClock, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatDate,
  formatTime,
  useMyAppointmentsQuery,
  type Appointment,
} from "@/entities/appointment";
import { cn } from "@/lib/utils";

function countdownLabel(reminderAt: Date, now: number) {
  const diffMs = reminderAt.getTime() - now;
  if (diffMs <= 0) return "Rappel imminent";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `Rappel dans ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMin = minutes % 60;
  if (hours < 24) {
    return `Rappel dans ${hours} h${remainingMin > 0 ? ` ${remainingMin}` : ""}`;
  }
  const days = Math.floor(hours / 24);
  return `Rappel dans ${days} j`;
}

function reminderTimeLabel(appointment: Appointment) {
  const reminderAt = new Date(
    new Date(appointment.startsAt).getTime() -
      appointment.reminderMinutes * 60_000,
  );
  return `${formatDate(reminderAt)} · ${formatTime(reminderAt)}`;
}

export function AppointmentReminders() {
  const { data, isLoading } = useMyAppointmentsQuery();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (isLoading) {
    return <Skeleton className="h-40 rounded-2xl bg-white/10" />;
  }

  const upcoming = (data ?? []).filter(
    (appointment) =>
      appointment.status === "scheduled" &&
      new Date(appointment.startsAt) > new Date(),
  );

  if (upcoming.length === 0) return null;

  return (
    <HudPanel edge tone="accent" className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <BellRing className="h-4 w-4 text-[var(--dg-accent-bright)]" />
        <h2 className="text-sm font-semibold text-[var(--dg-text)]">
          Rappels à venir
        </h2>
        <span className="ml-auto text-xs text-[var(--dg-text-faint)]">
          {upcoming.length} rendez-vous
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {upcoming.map((appointment) => {
          const reminderAt = new Date(
            new Date(appointment.startsAt).getTime() -
              appointment.reminderMinutes * 60_000,
          );
          const soon = reminderAt.getTime() - now <= 24 * 3600_000;
          return (
            <li
              key={appointment.id}
              className={cn(
                "hud-cut flex items-center gap-3 border px-3 py-2.5",
                soon
                  ? "border-[var(--dg-accent)]/50 bg-[var(--dg-accent)]/10"
                  : "border-[var(--dg-border)] bg-[var(--dg-bg-card)]",
              )}
            >
              <AlarmClock
                className={cn(
                  "size-4 shrink-0",
                  soon
                    ? "text-[var(--dg-accent-bright)]"
                    : "text-[var(--dg-text-faint)]",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-white">
                  {formatDate(appointment.startsAt)} ·{" "}
                  {formatTime(appointment.startsAt)}
                </p>
                <p className="text-[11px] text-[var(--dg-text-faint)]">
                  {appointment.ref} · {appointment.reminderMinutes} min avant
                </p>
              </div>
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  soon ? "text-[var(--dg-accent-bright)]" : "text-[var(--dg-text-muted)]",
                )}
              >
                {countdownLabel(reminderAt, now)}
              </span>
              <span className="hidden text-[11px] text-[var(--dg-text-faint)] md:block">
                {reminderTimeLabel(appointment)}
              </span>
            </li>
          );
        })}
      </ul>
    </HudPanel>
  );
}