import { axiosCredential } from "@/lib/axios";
import type { ContactInput, ContactReference } from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const sendContactMessage = async (
  input: ContactInput,
): Promise<ContactReference> =>
  axiosCredential.post<ApiEnvelope<ContactReference>>("/contact", input).then(unwrap);