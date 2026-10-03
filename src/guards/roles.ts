export const ROLES = {
  ADMIN: "admin",
  AGENT_MUNICIPAL: "agent_municipal",
  CITIZEN: "citoyen",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES] | (string & {});

export const ADMIN_ROLES: Role[] = [ROLES.ADMIN];

export function isSuperAdmin(userRoles: string[]): boolean {
  return userRoles.includes(ROLES.ADMIN);
}

export function canAccessRoles(
  userRoles: string[],
  required?: string[],
): boolean {
  if (!required || required.length === 0) return true;
  if (isSuperAdmin(userRoles)) return true;
  return required.some((role) => userRoles.includes(role));
}

export function canAccessPermissions(
  userPermissions: string[],
  required?: string[],
): boolean {
  if (!required || required.length === 0) return true;
  return required.every((permission) => userPermissions.includes(permission));
}

export function canAccess(
  userRoles: string[],
  userPermissions: string[],
  requiredRoles?: string[],
  requiredPermissions?: string[],
): boolean {
  if (isSuperAdmin(userRoles)) return true;
  return (
    canAccessRoles(userRoles, requiredRoles) &&
    canAccessPermissions(userPermissions, requiredPermissions)
  );
}