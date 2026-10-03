import { axiosCredential } from "@/lib/axios";
import type {
  Account,
  DeleteAccountInput,
  UpdateAccountInput,
} from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchAccount = async (id: string): Promise<Account> =>
  axiosCredential.get<ApiEnvelope<Account>>(`/accounts/${id}`).then(unwrap);

export const updateAccount = async (
  id: string,
  input: UpdateAccountInput,
): Promise<Account> =>
  axiosCredential.patch<ApiEnvelope<Account>>(`/accounts/${id}`, input).then(unwrap);

export const deleteAccount = async (
  id: string,
  input: DeleteAccountInput = {},
): Promise<null> =>
  axiosCredential
    .delete<ApiEnvelope<null>>(`/accounts/${id}`, { data: input })
    .then(unwrap);

export const restoreAccount = async (id: string): Promise<Account> =>
  axiosCredential
    .post<ApiEnvelope<Account>>(`/accounts/${id}/restore`)
    .then(unwrap);