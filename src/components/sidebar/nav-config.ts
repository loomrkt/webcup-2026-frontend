import type { ComponentType } from "react";
import {
  Accessibility,
  Activity,
  BookOpen,
  Building2,
  Database,
  LayoutGrid,
  Lightbulb,
  ThumbsUp,
  UsersIcon,
  Vote,
  Wrench,
} from "lucide-react";
import { ADMIN_ROLES } from "@/guards/roles";

export type NavSection = "Accueil" | "Participation" | "Services & aide" | "Réglages" | "Administration";

export type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: number;
  /** Section de navigation (regroupement visuel dans la sidebar). */
  section?: NavSection;
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
    section: "Accueil",
  },
  {
    key: "ideas",
    label: "Idées",
    href: "/ideas",
    icon: Lightbulb,
    section: "Participation",
  },
  {
    key: "projects",
    label: "Projets",
    href: "/projects",
    icon: Building2,
    section: "Participation",
  },
  {
    key: "consultations",
    label: "Consultations",
    href: "/consultations",
    icon: Vote,
    section: "Participation",
  },
  {
    key: "support",
    label: "Soutenir",
    href: "/support",
    icon: ThumbsUp,
    section: "Participation",
  },
  {
    key: "services-status",
    label: "État des services",
    href: "/services/status",
    icon: Activity,
    section: "Services & aide",
  },
  {
    key: "glossary",
    label: "Glossaire",
    href: "/glossary",
    icon: BookOpen,
    section: "Services & aide",
  },
  {
    key: "accessibility",
    label: "Accessibilité",
    href: "/settings/accessibility",
    icon: Accessibility,
    section: "Réglages",
  },
  {
    key: "data-concerns",
    label: "Données & vie privée",
    href: "/data-concerns",
    icon: Database,
    section: "Réglages",
  },
  {
    key: "users",
    label: "Utilisateurs",
    href: "/admin/users",
    icon: UsersIcon,
    section: "Administration",
    roles: [...ADMIN_ROLES],
  },
  {
    key: "admin-services",
    label: "Services",
    href: "/admin/services",
    icon: Wrench,
    section: "Administration",
    roles: [...ADMIN_ROLES],
  },
];

export const NAV_SECTIONS: NavSection[] = [
  "Accueil",
  "Participation",
  "Services & aide",
  "Réglages",
  "Administration",
];