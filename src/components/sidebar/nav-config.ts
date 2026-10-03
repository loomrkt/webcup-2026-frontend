import type { ComponentType } from "react";
import {
  LayoutGrid,
  UsersIcon,
} from "lucide-react";
import { ADMIN_ROLES } from "@/guards/roles";

export type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: number;
  /** Rôles autorisés à voir l'item. Vide = visible pour tout utilisateur connecté. */
  roles?: string[];
  /** Permissions requises (toutes) pour voir l'item. */
  permissions?: string[];
  // Item is always visible when omitted.
  hasAccess?: (access: boolean) => boolean;
};

export const navItems: NavItem[] = [
  {
    key: "dashboard",
    label: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    key: "users",
    label: "Gestion des utilisateurs",
    href: "/admin/users",
    icon: UsersIcon,
    roles: [...ADMIN_ROLES],
  },
];