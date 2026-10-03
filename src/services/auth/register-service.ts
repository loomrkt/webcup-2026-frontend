import { axiosCredential } from "@/lib/axios";
import type { RegisterInput } from "@/schemas/auth/register-schema";
import type { AuthApiEnvelope, RegisteredUser } from "./types";

export const registerService = async (
  data: RegisterInput,
): Promise<RegisteredUser> => {
  const response = await axiosCredential.post<AuthApiEnvelope<RegisteredUser>>(
    "/auth/register",
    { email: data.email, password: data.password },
  );
  return response.data.data;
};