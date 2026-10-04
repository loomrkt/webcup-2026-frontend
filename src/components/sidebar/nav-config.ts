import type { ComponentType } from "react";
import {
  Accessibility,
  BookOpen,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  ConciergeBell,
  Inbox,
  LayoutGrid,
  Lightbulb,
  Map,
  Megaphone,
  MessageCircle,
  Newspaper,
  ScrollText,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  TramFront,
  TriangleAlert,
  UserRound,
  UsersIcon,
  Vote,
  Wrench,
} from "lucide-react";
import { ADMIN_ROLES, ROLES } from "@/guards/roles";

export type NavSection =
  | "Accueil"
  | "Découvrir"
  | "Mes démarches"
  | "Participation"
  | "Mon compte"
  | "Espace agent"
  | "Administration";

export type NavItem = {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Rendu en bouton ouvrant une modale d'action rapide. */
  action?: "report" | "contact";
  /** Lien de navigation classique (quand ce n'est pas une action). */
  href?: string;
  badge?: number;
  /** Clé de traduction UI (repli sur `label`). */
  tKey?: string;
  /** Section de navigation (regroupement visuel dans la sidebar). */
  section?: NavSection;
  /** Rôles autorisés à voir l'item. Vide = visible pour tout utilisateur connecté. */
  roles?: string[];
  /** Permissions requises (toutes) pour voir l'item. */
  permissions?: string[];
  /** Matcher personnalisé de l'état actif (défaut : pathname commence par href). */
  isActive?: (pathname: string) => boolean;
};

const startsWith = (...prefixes: string[]) => (pathname: string) =>
  prefixes.some((prefix) => pathname.startsWith(prefix));

export const navItems: NavItem[] = [
  {
    key: "dashboard",
    label: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutGrid,
    tKey: "nav.dashboard",
    section: "Accueil",
  },

  // ─────────────────────────── Citoyen · Découvrir ───────────────────────────
  {
    key: "services",
    label: "Services",
    href: "/services",
    icon: ConciergeBell,
    tKey: "nav.services",
    section: "Découvrir",
    roles: [ROLES.CITIZEN],
    isActive: startsWith("/services", "/glossary"),
  },
  {
    key: "news",
    label: "Actualités",
    href: "/news",
    icon: Newspaper,
    tKey: "nav.news",
    section: "Découvrir",
    roles: [ROLES.CITIZEN],
  },
  {
    key: "mobility",
    label: "Transports",
    href: "/mobility",
    icon: TramFront,
    tKey: "nav.mobility",
    section: "Découvrir",
    roles: [ROLES.CITIZEN],
  },
  {
    key: "places",
    label: "Lieux & urgences",
    href: "/places",
    icon: Map,
    tKey: "nav.places",
    section: "Découvrir",
    roles: [ROLES.CITIZEN],
  },

  // ─────────────────────────── Citoyen · Mes démarches ───────────────────────────
  {
    key: "citizen-requests",
    label: "Mes demandes",
    href: "/requests",
    icon: Inbox,
    tKey: "nav.requests",
    section: "Mes démarches",
    roles: [ROLES.CITIZEN],
    isActive: (pathname) =>
      pathname === "/requests" ||
      (pathname.startsWith("/requests/") &&
        !pathname.startsWith("/requests/new")),
  },
  {
    key: "appointments",
    label: "Rendez-vous",
    href: "/appointments",
    icon: CalendarDays,
    tKey: "nav.appointments",
    section: "Mes démarches",
  },

  // ─────────────────────────── Citoyen · Participation ───────────────────────────
  {
    key: "participation",
    label: "Participation",
    href: "/participation",
    icon: Sparkles,
    tKey: "nav.participation",
    section: "Participation",
    isActive: startsWith(
      "/participation",
      "/ideas",
      "/projects",
      "/consultations",
      "/support",
    ),
  },

  // ─────────────────────────── Citoyen · Mon compte ───────────────────────────
  {
    key: "account",
    label: "Mon compte",
    href: "/account",
    icon: UserRound,
    tKey: "nav.account",
    section: "Mon compte",
    isActive: startsWith(
      "/account",
      "/profile",
      "/security",
      "/settings/accessibility",
      "/data-concerns",
      "/data-export",
    ),
  },

  // ─────────────────────────── Actions rapides (modales) ───────────────────────────
  {
    key: "request-report",
    label: "Signaler un problème",
    action: "report",
    icon: TriangleAlert,
    tKey: "nav.report",
    section: "Mes démarches",
    roles: [ROLES.CITIZEN],
  },
  {
    key: "contact",
    label: "Contact",
    action: "contact",
    icon: MessageCircle,
    tKey: "nav.contact",
    section: "Découvrir",
    roles: [ROLES.CITIZEN],
  },

  // ─────────────────────────── Agent municipal ───────────────────────────
  {
    key: "agent",
    label: "Espace agent",
    href: "/agent",
    icon: ChartNoAxesCombined,
    tKey: "nav.agent",
    section: "Espace agent",
    roles: [ROLES.AGENT_MUNICIPAL],
    isActive: startsWith("/agent"),
  },

  // ─────────────────────────── Administration ───────────────────────────
  {
    key: "admin",
    label: "Administration",
    href: "/admin",
    icon: UsersIcon,
    tKey: "nav.admin",
    section: "Administration",
    roles: [...ADMIN_ROLES],
    isActive: startsWith("/admin"),
  },
];

export const NAV_SECTIONS: NavSection[] = [
  "Accueil",
  "Découvrir",
  "Mes démarches",
  "Participation",
  "Mon compte",
  "Espace agent",
  "Administration",
];

/** Icônes de référence pour les onglets de hubs (import partagé). */
export const HUB_ICONS = {
  Accessibility,
  BookOpen,
  Building2,
  Lightbulb,
  Megaphone,
  ScrollText,
  ShieldCheck,
  ThumbsUp,
  Vote,
  Wrench,
} as const;