"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatTime,
  useBookAppointmentMutation,
  useSlotsQuery,
} from "@/entities/appointment";
import { cn } from "@/lib/utils";
import {
  appointmentBookingSchema,
  REMINDER_OPTIONS,
  type AppointmentBookingFormValues,
} from "../model/appointment-booking-schema";

const inputClassName =
  "h-12 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

type Feedback = { kind: "success" | "error"; message: string } | null;

export function AppointmentBooking() {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const book = useBookAppointmentMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<AppointmentBookingFormValues>({
    resolver: zodResolver(appointmentBookingSchema),
    mode: "onTouched",
    defaultValues: {
      date: "",
      slotId: "",
      notes: "",
      reminderMinutes: 60,
    },
  });

  const { data: slots, isLoading } = useSlotsQuery({ date: selectedDate });

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 7000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const onDateChange = (value: string) => {
    setSelectedDate(value);
    setValue("slotId", "");
    setValue("date", value);
  };

  const submit = handleSubmit((values) => {
    book.mutate(
      {
        slotId: values.slotId,
        notes: values.notes?.trim() || null,
        reminderMinutes: values.reminderMinutes,
      },
      {
        onSuccess: (appointment) => {
          setFeedback({
            kind: "success",
            message: `Rendez-vous confirmé — référence ${appointment.ref}.`,
          });
          reset({ date: "", slotId: "", notes: "", reminderMinutes: 60 });
          setSelectedDate("");
        },
        onError: () => {
          setFeedback({
            kind: "error",
            message: "Impossible de réserver ce créneau. Réessayez.",
          });
        },
      },
    );
  });

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {feedback && (
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
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
          Date du rendez-vous
        </span>
        <Input
          type="date"
          className={inputClassName}
          value={selectedDate}
          onChange={(event) => onDateChange(event.target.value)}
          aria-label="Choisir une date"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
          Créneaux disponibles
        </span>
        {!selectedDate ? (
          <p className="rounded-xl border border-dashed border-[var(--dg-border)] px-4 py-6 text-center text-sm text-[var(--dg-text-faint)]">
            Sélectionnez une date pour afficher les créneaux.
          </p>
        ) : isLoading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-11 rounded-xl bg-white/10" />
            ))}
          </div>
        ) : slots && slots.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {slots.map((slot) => (
              <label
                key={slot.id}
                className="hud-cut flex cursor-pointer items-center gap-2 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-3 py-2.5 text-sm transition-colors has-[:checked]:border-[var(--dg-accent)]/50 has-[:checked]:bg-[var(--dg-accent)]/10 hover:border-[var(--dg-accent)]/40 hover:bg-[var(--dg-bg-card-hover)]"
              >
                <input
                  type="radio"
                  value={slot.id}
                  className="size-4 accent-[var(--dg-accent)]"
                  {...register("slotId")}
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[13px] font-medium text-white">
                    {formatTime(slot.startsAt)} – {formatTime(slot.endsAt)}
                  </span>
                  {slot.service?.name ? (
                    <span className="truncate text-[11px] text-[var(--dg-text-faint)]">
                      {slot.service.name}
                    </span>
                  ) : null}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-[var(--dg-border)] px-4 py-6 text-center text-sm text-[var(--dg-text-faint)]">
            Aucun créneau disponible à cette date.
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
            Rappel
          </span>
          <select
            className={cn(inputClassName, "cursor-pointer")}
            {...register("reminderMinutes")}
          >
            {REMINDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
            Remarques
          </span>
          <Input
            className={inputClassName}
            placeholder="Motif, documents à prévoir…"
            {...register("notes")}
          />
        </label>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="dg-btn-accent h-12 w-fit cursor-pointer"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CalendarClock className="h-4 w-4" />
        )}
        Réserver ce rendez-vous
      </Button>
    </form>
  );
}