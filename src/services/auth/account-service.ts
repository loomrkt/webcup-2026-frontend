import { axiosCredential } from "@/lib/axios";
import type { AuthApiEnvelope } from "./types";

export interface DeleteOwnAccountInput {
  password?: string;
  email?: string;
  confirm: boolean;
}

export const deleteOwnAccountService = async (
  input: DeleteOwnAccountInput,
): Promise<void> => {
  await axiosCredential.delete<AuthApiEnvelope<null>>("/auth/me", { data: input });
};