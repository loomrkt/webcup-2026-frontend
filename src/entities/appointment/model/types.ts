export const APPOINTMENT_STATUSES = [
  "scheduled",
  "cancelled",
  "completed",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const SLOT_STATUSES = ["available", "booked", "blocked"] as const;
export type SlotStatus = (typeof SLOT_STATUSES)[number];

export interface AppointmentService {
  id: string;
  name: string;
}

export interface AppointmentSlot {
  id: string;
  serviceId: string | null;
  service?: AppointmentService | null;
  agentId: string | null;
  startsAt: string;
  endsAt: string;
  status: SlotStatus;
}

export interface Appointment {
  id: string;
  ref: string;
  citizenId: string;
  slotId: string;
  slot?: AppointmentSlot | null;
  serviceId: string | null;
  service?: AppointmentService | null;
  agentId: string | null;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  location: string | null;
  notes: string | null;
  reminderMinutes: number;
  reminderSentAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SlotListParams {
  date: string;
  serviceId?: string;
}

export interface BookAppointmentInput {
  slotId: string;
  notes?: string | null;
  reminderMinutes?: number;
}