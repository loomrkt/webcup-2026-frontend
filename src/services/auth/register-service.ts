import { axiosCredential } from "@/lib/axios";
import type { RegisterInput } from "@/schemas/auth/register-schema";

export interface RegisterApiResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
  } | null;
  code: string;
  message: string;
  meta: null;
}

export const registerService = async (
  data: RegisterInput
): Promise<RegisterApiResponse> => {
  const response = await axiosCredential.post<RegisterApiResponse>(
    "/auth/register",
    { email: data.email, password: data.password }
  );

  return response.data;
};