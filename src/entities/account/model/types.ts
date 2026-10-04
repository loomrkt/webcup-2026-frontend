export type AccountStatus =
  | "active"
  | "pending"
  | "suspended"
  | "locked"
  | "deleted";

export interface Account {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  birthDate: string | null;
  status: string;
  lockedUntil: string | null;
  failedLoginCount: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAccountInput {
  status?: "active" | "suspended";
  firstName?: string | null;
  lastName?: string | null;
}

export interface DeleteAccountInput {
  permanent?: boolean;
}