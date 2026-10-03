"use client";

import { CalendarDays, CalendarPlus } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import { AppointmentBooking } from "@/features/appointment-booking";
import { AppointmentList } from "@/widgets/appointment-list";
import { AppointmentReminders } from "@/widgets/appointment-reminders";

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Citoyen · Rendez-vous</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Mes rendez-vous
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Réservez un créneau avec les services municipaux et suivez vos
          rendez-vous à venir.
        </p>
      </header>

      <AppointmentReminders />

      <div className="grid gap-4 xl:grid-cols-2">
        <HudPanel edge className="flex flex-col gap-4 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
            <CalendarDays className="h-4 w-4 text-[var(--dg-accent-bright)]" />
            Mes rendez-vous
          </h2>
          <AppointmentList />
        </HudPanel>

        <HudPanel edge className="flex flex-col gap-4 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
            <CalendarPlus className="h-4 w-4 text-[var(--dg-accent-bright)]" />
            Nouveau rendez-vous
          </h2>
          <AppointmentBooking />
        </HudPanel>
      </div>
    </div>
  );
}