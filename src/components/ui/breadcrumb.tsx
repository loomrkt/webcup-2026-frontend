"use client";

import { ChevronRight, House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Tableau de bord",
  services: "Services & aide",
  news: "Actualités",
  announcements: "Annonces",
  requests: "Mes demandes",
  new: "Signaler un problème",
  account: "Mon compte",
  contact: "Contact",
  appointments: "Rendez-vous",
  mobility: "Transports",
  places: "Lieux & urgences",
  participation: "Participation",
  agent: "Espace agent",
  admin: "Administration",
};

export function BreadcrumbBar() {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs: Array<{ label: string; href?: string }> = [
    { label: "Accueil", href: "/dashboard" },
  ];

  let href = "";
  for (const segment of segments) {
    href += `/${segment}`;
    const label = SEGMENT_LABELS[segment];
    if (!label) continue;
    const isLast = href === pathname;
    crumbs.push({ label, href: isLast ? undefined : href });
  }

  return (
    <nav
      aria-label="Fil d'Ariane"
      className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--dg-text-faint)]"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 ? (
              <ChevronRight
                aria-hidden
                className="h-3 w-3 text-[var(--dg-text-faint)]/60"
              />
            ) : null}
            {index === 0 ? (
              <House
                aria-hidden
                className="h-3 w-3 text-[var(--dg-text-faint)]"
              />
            ) : null}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="rounded text-[var(--dg-text-muted)] transition-colors hover:text-[var(--dg-accent-bright)]"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={cn(
                  "font-medium",
                  isLast ? "text-[var(--dg-accent-bright)]" : "text-[var(--dg-text-muted)]",
                )}
              >
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}