"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguageStore } from "@/features/language-selector";
import { useQuickActions } from "@/features/quick-actions/store";
import { cn } from "@/lib/utils";
import { useRoleGuard } from "@/guards/role-guard";
import { NAV_SECTIONS, navItems, type NavItem } from "./nav-config";
import { useMemo } from "react";

export function SidebarBrand() {
  return (
    <div className="flex h-20 items-center gap-2.5 px-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" className="h-8 w-auto drop-shadow-[0_0_12px_var(--dg-accent-glow)]" />
      <div className="flex flex-col">
        <span className="bg-gradient-to-r from-white via-white to-[var(--dg-accent-bright)] bg-clip-text text-lg font-bold tracking-tight text-transparent">
          TERRA NOVA
        </span>
        <span className="text-[10px] font-medium tracking-[0.3em] text-[var(--dg-text-faint)] uppercase">
          Plateforme citoyenne
        </span>
      </div>
    </div>
  );
}

function NavRow({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const t = useLanguageStore((s) => s.t);
  const openAction = useQuickActions((s) => s.open);
  const label = item.tKey ? t(item.tKey, item.label) : item.label;

  const className = cn(
    "group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-300",
    active
      ? "text-white"
      : "text-[var(--dg-text-muted)] hover:bg-[var(--dg-bg-card-hover)] hover:text-white",
  );

  const inner = (
    <>
      {active ? (
        <>
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--dg-accent)]/25 via-[var(--dg-accent)]/10 to-transparent" />
          <span className="absolute inset-0 rounded-xl border border-[var(--dg-accent-border)]" />
          <span className="absolute -left-px top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[var(--dg-accent-bright)] shadow-[0_0_12px_var(--dg-accent-glow)]" />
          <span className="absolute inset-0 rounded-xl opacity-0 shadow-[0_0_24px_var(--dg-accent-glow)] transition-opacity duration-300 group-hover:opacity-100" />
        </>
      ) : null}
      <item.icon
        className={cn(
          "relative z-10 h-[18px] w-[18px] shrink-0 transition-colors duration-300",
          active
            ? "text-[var(--dg-accent-bright)] drop-shadow-[0_0_6px_var(--dg-accent-glow)]"
            : "text-[var(--dg-text-faint)] group-hover:text-[var(--dg-accent-bright)]",
        )}
      />
      <span className="relative z-10 truncate">{label}</span>
      {item.badge ? (
        <Badge
          className={cn(
            "relative z-10 ml-auto h-5 min-w-5 justify-center rounded-full px-1 text-[11px]",
            active
              ? "bg-[var(--dg-accent)] text-white shadow-[0_0_12px_var(--dg-accent-glow)]"
              : "bg-[var(--dg-danger)] text-white",
          )}
        >
          {item.badge}
        </Badge>
      ) : null}
    </>
  );

  // Items "action" → ouvrent une modale (Signaler un problème, Contact).
  if (item.action) {
    const action = item.action;
    return (
      <button
        type="button"
        onClick={() => {
          openAction(action);
          onNavigate?.();
        }}
        className={cn(className, "cursor-pointer")}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={item.href ?? "#"} onClick={onNavigate} className={className}>
      {inner}
    </Link>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { isLoading, canAccess } = useRoleGuard();

  const items = useMemo(
    () => navItems.filter((item) => canAccess(item.roles, item.permissions)),
    [canAccess],
  );

  if (isLoading) return <SidebarNavSkeleton />;

  const sections = NAV_SECTIONS.filter((section) =>
    items.some((item) => item.section === section),
  );

  return (
    <nav className="flex flex-col gap-5 px-3" aria-label="Navigation principale">
      {sections.map((section) => (
        <div key={section} className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-[10px] font-semibold tracking-[0.2em] text-[var(--dg-text-faint)]/80 uppercase">
            {section}
          </p>
          {items
            .filter((item) => item.section === section)
            .map((item) => {
              const active = item.isActive
                ? item.isActive(pathname ?? "")
                : item.href
                  ? pathname?.startsWith(item.href)
                  : false;
              return (
                <NavRow
                  key={item.key}
                  item={item}
                  active={active ?? false}
                  onNavigate={onNavigate}
                />
              );
            })}
        </div>
      ))}
    </nav>
  );
}

function SidebarNavSkeleton() {
  return (
    <div className="flex flex-col gap-1 px-3">
      {navItems.map((item) => (
        <div
          key={item.key}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
        >
          <Skeleton className="h-[18px] w-[18px] shrink-0 rounded-md bg-white/10" />
          <Skeleton className="h-3 flex-1 bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export function SidebarHelpCard() {
  const openAction = useQuickActions((s) => s.open);

  return (
    <div className="relative mx-3 flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-4 backdrop-blur-md">
      <span
        aria-hidden
        className="absolute -top-10 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full bg-[var(--dg-accent)] opacity-25 blur-2xl"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" className="relative z-10 h-10 w-auto opacity-80" />
      <span className="relative z-10 text-center text-xs text-[var(--dg-text-muted)]">
        Besoin d&apos;un coup de main ?
      </span>
      <button
        type="button"
        onClick={() => openAction("contact")}
        className="relative z-10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--dg-accent)]/40 bg-gradient-to-b from-[var(--dg-accent-bright)] to-[var(--dg-accent)] px-3 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_var(--dg-accent-glow)] transition-all hover:brightness-110"
      >
        Obtenir de l&apos;aide
      </button>
    </div>
  );
}