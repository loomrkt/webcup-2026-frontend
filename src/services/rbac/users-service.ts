import { axiosCredential } from "@/lib/axios";
import { isAxiosError } from "axios";
import type {
  ApiEnvelope,
  AssignRoleInput,
  CreateUserInput,
  RbacUser,
  RoleEntity,
} from "./types";

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchUsers = async (): Promise<RbacUser[]> =>
  axiosCredential
    .get<ApiEnvelope<RbacUser[]>>("/rbac/users")
    .then(unwrap);

export const fetchRoles = async (): Promise<RoleEntity[]> =>
  axiosCredential.get<ApiEnvelope<RoleEntity[]>>("/rbac/roles").then(unwrap);

export const assignRoleToUser = async (
  userId: string,
  input: AssignRoleInput,
): Promise<unknown> =>
  axiosCredential
    .post<ApiEnvelope<unknown>>(`/rbac/users/${userId}/roles`, input)
    .then(unwrap);

export const createUser = async (
  input: CreateUserInput,
): Promise<{ id: string; email: string }> =>
  axiosCredential
    .post<ApiEnvelope<{ id: string; email: string }>>("/rbac/users", input)
    .then(unwrap);

export function getRoleErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;
    const message = data?.message;
    if (typeof message === "string" && message) return message;
    if (Array.isArray(message) && message[0]) return String(message[0]);
    if (error.code === "ERR_NETWORK")
      return "Impossible de joindre le serveur. Vérifiez votre connexion.";
  }
  return fallback;
}