import type { ComponentType } from "react";
import {
  LayoutGrid,
  IdCard,
  Building2,
  Settings,
  UsersIcon,
  ArrowLeftRightIcon,
  CheckCheck,
} from "lucide-react";
import { CLUB_ROLES, FEDERATION_ROLES, ROLES } from "@/guards/roles";

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
    key: "myClub",
    label: "Mon Club",
    href: "/my-club",
    icon: UsersIcon,
    roles: [...CLUB_ROLES],
  },
  {
    key: "licenses",
    label: "Gestion des Licences",
    href: "/lot",
    icon: IdCard,
    roles: [...CLUB_ROLES],
  },
  {
    key: "mutations",
    label: "Mutations",
    href: "/mutations",
    icon: ArrowLeftRightIcon,
    roles: [...CLUB_ROLES],
  },
  {
    key: "clubs",
    label: "Listes des Clubs",
    href: "/clubs",
    icon: Building2,
    roles: [...FEDERATION_ROLES],
  },
  {
    key: "clubsToValidate",
    label: "Clubs à valider",
    href: "/clubs-to-validate",
    icon: CheckCheck,
    roles: [...FEDERATION_ROLES],
  },

  {
    key: "sections",
    label: "Listes des Sections",
    href: "/sections",
    icon: Building2,
    roles: [...FEDERATION_ROLES],
  },
  // { key: "notifications", label: "Notifications", href: "/notifications", icon: Bell, badge: 5 },
  {
    key: "settings",
    label: "Paramètres",
    href: "/parametres",
    icon: Settings,
    roles: [ROLES.ADMIN],
  },
];