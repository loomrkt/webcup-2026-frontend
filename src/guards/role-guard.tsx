"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { getMe } from "@/services/auth/me-service";
import {
  canAccess as checkAccess,
  canAccessPermissions,
  canAccessRoles,
  isSuperAdmin,
} from "./roles";

export interface RoleGuardValue {
  roles: string[];
  permissions: string[];
  isLoading: boolean;
  isError: boolean;
  hasRole: (...required: string[]) => boolean;
  hasPermission: (...required: string[]) => boolean;
  canAccess: (requiredRoles?: string[], requiredPermissions?: string[]) => boolean;
}

const RoleGuardContext = createContext<RoleGuardValue | null>(null);

export function RoleGuardProvider({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.accessToken) return;

    let active = true;
    getMe()
      .then((me) => {
        if (!active) return;
        setRoles(me.roles.map((role) => role.name));
        setPermissions(me.permissions);
        setHasLoaded(true);
      })
      .catch(() => {
        if (active) {
          setIsError(true);
          setHasLoaded(true);
        }
      });

    return () => {
      active = false;
    };
  }, [status, session?.accessToken]);

  const isLoading =
    status === "loading" ||
    (status === "authenticated" && !!session?.accessToken && !hasLoaded);

  const hasRole = useCallback(
    (...required: string[]) => canAccessRoles(roles, required),
    [roles],
  );

  const hasPermission = useCallback(
    (...required: string[]) =>
      isSuperAdmin(roles) || canAccessPermissions(permissions, required),
    [permissions, roles],
  );

  const canAccess = useCallback(
    (requiredRoles?: string[], requiredPermissions?: string[]) =>
      checkAccess(
        roles,
        permissions,
        requiredRoles,
        requiredPermissions,
      ),
    [roles, permissions],
  );

  const value = useMemo<RoleGuardValue>(
    () => ({
      roles,
      permissions,
      isLoading,
      isError,
      hasRole,
      hasPermission,
      canAccess,
    }),
    [roles, permissions, isLoading, isError, hasRole, hasPermission, canAccess],
  );

  return (
    <RoleGuardContext.Provider value={value}>
      {children}
    </RoleGuardContext.Provider>
  );
}

export function useRoleGuard(): RoleGuardValue {
  const ctx = useContext(RoleGuardContext);
  if (!ctx) throw new Error("useRoleGuard must be used within RoleGuardProvider");
  return ctx;
}

function RoleGuardSkeleton() {
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--dg-bg)]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--dg-border)] border-t-[var(--dg-accent)]" />
    </div>
  );
}

export function RoleGuard({
  roles,
  permissions,
  fallback,
  children,
}: PropsWithChildren<{
  roles?: string[];
  permissions?: string[];
  fallback?: ReactNode;
}>) {
  const { isLoading, canAccess } = useRoleGuard();

  if (isLoading) return <RoleGuardSkeleton />;
  if (!canAccess(roles, permissions)) return fallback ?? <RoleGuardSkeleton />;
  return <>{children}</>;
}