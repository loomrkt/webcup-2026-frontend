import type { ComponentType } from "react";
import {
  Accessibility,
  Activity,
  BookOpen,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  ConciergeBell,
  Database,
  Inbox,
  LayoutGrid,
  Lightbulb,
  Map,
  Megaphone,
  MessageCircle,
  Newspaper,
  ScrollText,
  ShieldCheck,
  ThumbsUp,
  TramFront,
  TriangleAlert,
  UserRound,
  UsersIcon,
  Vote,
  Wrench,
} from "lucide-react";
import { ADMIN_ROLES, ROLES } from "@/guards/roles";

export type NavSection = "Accueil" | "Participation" | "Services & aide" | "Réglages" | "Administration";

export type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: number;
  /** Clé de traduction UI (repli sur `label`). */
  tKey?: string;
  /** Section de navigation (regroupement visuel dans la sidebar). */
  section?: NavSection;
  /** Rôles autorisés à voir l'item. Vide = visible pour tout utilisateur connecté. */
  roles?: string[];
  /** Permissions requises (toutes) pour voir l'item. */
  permissions?: string[];
  // Item is always visible when omitted.
  hasAccess?: (access: boolean) => boolean;
  /** Matcher personnalisé de l'état actif (défaut : pathname commence par href). */
  isActive?: (pathname: string) => boolean;
};

export const navItems: NavItem[] = [
  {
    key: "dashboard",
    label: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutGrid,
    tKey: "nav.dashboard",
    section: "Accueil",
  },
  {
    key: "services",
    label: "Services",
    href: "/services",
    icon: ConciergeBell,
    tKey: "nav.services",
    roles: [ROLES.CITIZEN],
  },
  {
    key: "news",
    label: "Actualités",
    href: "/news",
    icon: Newspaper,
    tKey: "nav.news",
    roles: [ROLES.CITIZEN],
  },
  {
    key: "mobility",
    label: "Transports",
    href: "/mobility",
    icon: TramFront,
    tKey: "nav.mobility",
    roles: [ROLES.CITIZEN],
  },
  {
    key: "places",
    label: "Lieux & urgences",
    href: "/places",
    icon: Map,
    tKey: "nav.places",
    roles: [ROLES.CITIZEN],
  },
  {
    key: "citizen-requests",
    label: "Mes demandes",
    href: "/requests",
    icon: Inbox,
    tKey: "nav.requests",
    roles: [ROLES.CITIZEN],
    isActive: (pathname) =>
      pathname === "/requests" ||
      (pathname.startsWith("/requests/") &&
        !pathname.startsWith("/requests/new")),
  },
  {
    key: "request-report",
    label: "Signaler un problème",
    href: "/requests/new",
    icon: TriangleAlert,
    tKey: "nav.report",
    roles: [ROLES.CITIZEN],
  },
  {
    key: "contact",
    label: "Contact",
    href: "/contact",
    icon: MessageCircle,
    tKey: "nav.contact",
    roles: [ROLES.CITIZEN],
  },
  {
    key: "profile",
    label: "Mon profil",
    href: "/profile",
    icon: UserRound,
    tKey: "nav.profile",
    roles: [ROLES.CITIZEN],
  },
  {
    key: "agent-requests",
    label: "Demandes",
    href: "/agent/requests",
    icon: Inbox,
    tKey: "nav.agent.requests",
    roles: [ROLES.AGENT_MUNICIPAL],
  },
  {
    key: "agent-dashboard",
    label: "Statistiques",
    href: "/agent/dashboard",
    icon: ChartNoAxesCombined,
    tKey: "nav.agent.dashboard",
    roles: [ROLES.AGENT_MUNICIPAL],
  },
  {
    key: "agent-communications",
    label: "Alertes & annonces",
    href: "/agent/communications",
    icon: Megaphone,
    tKey: "nav.agent.communications",
    roles: [ROLES.AGENT_MUNICIPAL],
  },
  {
    key: "agent-audit",
    label: "Journal d'audit",
    href: "/agent/audit",
    icon: ScrollText,
    tKey: "nav.agent.audit",
    roles: [ROLES.AGENT_MUNICIPAL],
    permissions: ["audit.read"],
  },
  {
    key: "appointments",
    label: "Rendez-vous",
    href: "/appointments",
    icon: CalendarDays,
    tKey: "nav.appointments",
  },
  {
    key: "security",
    label: "Sécurité",
    href: "/security",
    icon: ShieldCheck,
    tKey: "nav.security",
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
    label: "Gestion des utilisateurs",
    href: "/admin/users",
    icon: UsersIcon,
    tKey: "nav.users",
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