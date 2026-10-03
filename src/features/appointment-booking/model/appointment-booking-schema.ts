import { z } from "zod";

export const appointmentBookingSchema = z.object({
  date: z.string().min(1, "Choisissez une date."),
  slotId: z.string().min(1, "Sélectionnez un créneau."),
  notes: z.string().max(2000).optional(),
  reminderMinutes: z.coerce.number().int().min(0).max(1440),
});

export type AppointmentBookingFormValues = z.infer<
  typeof appointmentBookingSchema
>;

export const REMINDER_OPTIONS = [
  { value: 30, label: "30 minutes avant" },
  { value: 60, label: "1 heure avant" },
  { value: 120, label: "2 heures avant" },
  { value: 1440, label: "La veille" },
];