"use client";

import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "./contact-api";
import type { ContactInput } from "../model/types";

export function useSendContactMessageMutation() {
  return useMutation({
    mutationFn: (input: ContactInput) => sendContactMessage(input),
  });
}