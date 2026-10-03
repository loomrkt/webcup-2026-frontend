import { axiosCredential } from "@/lib/axios";
import type {
  Appointment,
  AppointmentSlot,
  BookAppointmentInput,
  SlotListParams,
} from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchSlots = async (
  params: SlotListParams,
): Promise<AppointmentSlot[]> =>
  axiosCredential
    .get<ApiEnvelope<AppointmentSlot[]>>("/appointments/slots", {
      params: { date: params.date, serviceId: params.serviceId || undefined },
    })
    .then(unwrap);

export const bookAppointment = async (
  input: BookAppointmentInput,
): Promise<Appointment> =>
  axiosCredential
    .post<ApiEnvelope<Appointment>>("/appointments", input)
    .then(unwrap);

export const fetchMyAppointments = async (): Promise<Appointment[]> =>
  axiosCredential
    .get<ApiEnvelope<Appointment[]>>("/appointments/me")
    .then(unwrap);

export const cancelAppointment = async (id: string): Promise<Appointment> =>
  axiosCredential
    .post<ApiEnvelope<Appointment>>(`/appointments/${id}/cancel`)
    .then(unwrap);