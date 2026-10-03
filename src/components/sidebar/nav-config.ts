import type { ElementType } from "react";
import {
  LayoutGrid,
  IdCard,
  Building2,
  Bell,
  Settings,
  UsersIcon,
  ArrowLeftRightIcon,
  CheckCheck,
} from "lucide-react";

export type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: ElementType;
  badge?: number;
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
  },
  {
    key: "licenses",
    label: "Gestion des Licences",
    href: "/lot",
    icon: IdCard,
  },
  {
    key: "mutations",
    label: "Mutations",
    href: "/mutations",
    icon: ArrowLeftRightIcon,
  },
  {
    key: "clubs",
    label: "Listes des Clubs",
    href: "/clubs",
    icon: Building2,
  },
  {
    key: "clubsToValidate",
    label: "Clubs à valider",
    href: "/clubs-to-validate",
    icon: CheckCheck,
  },

  {
    key: "sections",
    label: "Listes des Sections",
    href: "/sections",
    icon: Building2,
  },
  // { key: "notifications", label: "Notifications", href: "/notifications", icon: Bell, badge: 5 },
  {
    key: "settings",
    label: "Paramètres",
    href: "/parametres",
    icon: Settings,
  },
];
