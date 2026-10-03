import type { ComponentType } from "react";
import {
  CalendarDays,
  ChartNoAxesCombined,
  Inbox,
  LayoutGrid,
  Megaphone,
  ScrollText,
  ShieldCheck,
  UsersIcon,
} from "lucide-react";
import { ADMIN_ROLES, ROLES } from "@/guards/roles";

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
    key: "agent-requests",
    label: "Demandes",
    href: "/agent/requests",
    icon: Inbox,
    roles: [ROLES.AGENT_MUNICIPAL],
  },
  {
    key: "agent-dashboard",
    label: "Statistiques",
    href: "/agent/dashboard",
    icon: ChartNoAxesCombined,
    roles: [ROLES.AGENT_MUNICIPAL],
  },
  {
    key: "agent-communications",
    label: "Alertes & annonces",
    href: "/agent/communications",
    icon: Megaphone,
    roles: [ROLES.AGENT_MUNICIPAL],
  },
  {
    key: "agent-audit",
    label: "Journal d'audit",
    href: "/agent/audit",
    icon: ScrollText,
    roles: [ROLES.AGENT_MUNICIPAL],
    permissions: ["audit.read"],
  },
  {
    key: "appointments",
    label: "Rendez-vous",
    href: "/appointments",
    icon: CalendarDays,
  },
  {
    key: "security",
    label: "Sécurité",
    href: "/security",
    icon: ShieldCheck,
  },
  {
    key: "users",
    label: "Gestion des utilisateurs",
    href: "/admin/users",
    icon: UsersIcon,
    roles: [...ADMIN_ROLES],
  },
];