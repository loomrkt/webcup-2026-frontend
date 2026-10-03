export const ROLES = {
  ADMIN: "admin",
  PRESIDENT: "president",
  SECRETARY: "secretary",
  MANAGER: "manager",
  FEDERATION: "federation",
  AGENT_MUNICIPAL: "agent_municipal",
  CITIZEN: "citoyen",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES] | (string & {});

export const CLUB_ROLES: Role[] = [
  ROLES.ADMIN,
  ROLES.PRESIDENT,
  ROLES.SECRETARY,
  ROLES.MANAGER,
];

export const FEDERATION_ROLES: Role[] = [
  ROLES.ADMIN,
  ROLES.FEDERATION,
  ROLES.AGENT_MUNICIPAL,
];

export function canAccessRoles(
  userRoles: string[],
  required?: string[],
): boolean {
  if (!required || required.length === 0) return true;
  if (userRoles.includes(ROLES.ADMIN)) return true;
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
  return (
    canAccessRoles(userRoles, requiredRoles) &&
    canAccessPermissions(userPermissions, requiredPermissions)
  );
}