export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errors: unknown[] | null;
  timestamp: string;
}

export interface PermissionEntity {
  id: string;
  name: string;
  description: string | null;
}

export interface RoleEntity {
  id: string;
  name: string;
  description: string | null;
  isSuperAdmin: boolean;
  parentId?: string | null;
  organizationId?: string | null;
  permissions?: PermissionEntity[];
}

export interface UserRoleEntity {
  userId: string;
  roleId: string;
  canCreateSubRoles: boolean;
  canCreateSubUsers: boolean;
  role?: RoleEntity | null;
}

export interface RbacUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  userRoles?: UserRoleEntity[];
}

export interface CreateUserInput {
  email: string;
  password: string;
  roleIds: string[];
}

export interface AssignRoleInput {
  roleId: string;
  canCreateSubRoles?: boolean;
  canCreateSubUsers?: boolean;
}

export type UserStatus = "active" | "pending" | "suspended" | "locked" | "deleted";