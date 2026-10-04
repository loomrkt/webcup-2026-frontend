"use client";

import {
  ArrowRight,
  Bell,
  Boxes,
  Inbox,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { HudPanel } from "@/components/ui/hud-panel";
import { OnboardingGuides } from "@/widgets/onboarding-guides";
import { AlertsPreview } from "./alerts-preview";
import { DashboardStats } from "./dashboard-stats";
import { NotificationsPreview } from "./notifications-preview";
import { ProfileWelcome } from "./profile-welcome";
import { RecentRequests } from "./recent-requests";
import { ServiceOverview } from "./service-overview";

function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--dg-accent-bright)] transition-colors hover:underline"
    >
      {label}
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

function SectionTitle({
  icon,
  children,
  href,
  linkLabel,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {href ? (
        <SectionLink href={href} label={linkLabel ?? "Tout voir"} />
      ) : null}
    </h2>
  );
}

export function CitizenDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <ProfileWelcome />

      <DashboardStats />

      <OnboardingGuides />

      <div className="grid gap-4 xl:grid-cols-2">
        <HudPanel edge className="flex flex-col gap-4 p-4">
          <SectionTitle
            icon={<Boxes className="h-4 w-4 text-[var(--dg-accent-bright)]" />}
            href="/services"
          >
            Services en avant
          </SectionTitle>
          <ServiceOverview />
        </HudPanel>

        <HudPanel edge className="flex flex-col gap-4 p-4">
          <SectionTitle
            icon={<Inbox className="h-4 w-4 text-[var(--dg-accent-bright)]" />}
            href="/requests"
          >
            Mes démarches
          </SectionTitle>
          <RecentRequests />
        </HudPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <HudPanel edge tone="danger" className="flex flex-col gap-4 p-4">
          <SectionTitle
            icon={<ShieldAlert className="h-4 w-4 text-[var(--dg-danger)]" />}
            href="/news"
            linkLabel="Actualités"
          >
            Alertes actives
          </SectionTitle>
          <AlertsPreview />
        </HudPanel>

        <HudPanel edge className="flex flex-col gap-4 p-4">
          <SectionTitle
            icon={<Bell className="h-4 w-4 text-[var(--dg-accent-bright)]" />}
            linkLabel="Tout voir"
          >
            Notifications récentes
          </SectionTitle>
          <NotificationsPreview />
        </HudPanel>
      </div>
    </div>
  );
}