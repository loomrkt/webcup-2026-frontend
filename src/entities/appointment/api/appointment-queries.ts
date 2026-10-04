"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookAppointment,
  cancelAppointment,
  fetchMyAppointments,
  fetchSlots,
} from "./appointment-api";
import type { BookAppointmentInput, SlotListParams } from "../model/types";

export const appointmentQueryKeys = {
  all: ["appointments"] as const,
  slots: (params: SlotListParams) =>
    ["appointments", "slots", params.date, params.serviceId ?? ""] as const,
  mine: ["appointments", "me"] as const,
};

export function useSlotsQuery(params: SlotListParams) {
  return useQuery({
    queryKey: appointmentQueryKeys.slots(params),
    queryFn: () => fetchSlots(params),
    enabled: !!params.date,
  });
}

export function useMyAppointmentsQuery() {
  return useQuery({
    queryKey: appointmentQueryKeys.mine,
    queryFn: fetchMyAppointments,
  });
}

export function useBookAppointmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BookAppointmentInput) => bookAppointment(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.all,
      });
    },
  });
}

export function useCancelAppointmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelAppointment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.all,
      });
    },
  });
}