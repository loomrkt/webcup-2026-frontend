"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { NavItem, navItems } from "./nav-config";

export function SidebarBrand() {
  return (
    <div className="flex h-20 items-center gap-2 px-5">
      <div className="mt-4 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="logoSecondary.png" alt="" className="z-12 h-8 w-auto" />
        <span className="ml-2 text-lg font-bold text-white">
          CLUB-Management
        </span>
      </div>
    </div>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  if (isLoading) return <SidebarNavSkeleton />;

  const items = navItems.filter((item) => navItemsAccess[item.key] ?? true);

  return (
    <nav className="flex flex-col gap-1 px-3">
      {items.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors",
              active
                ? "bg-[#022864] text-white shadow-sm"
                : "text-slate-300 hover:bg-white/5 hover:text-white",
            )}
          >
            <item.icon
              className={cn(
                "h-[18px] w-[18px] shrink-0",
                active
                  ? "text-slate-white"
                  : "text-slate-400 group-hover:text-white",
              )}
            />
            <span className="truncate">{item.label}</span>
            {item.badge ? (
              <Badge
                className={cn(
                  "ml-auto h-5 min-w-5 justify-center rounded-full px-1 text-[11px]",
                  active ? "bg-slate-900 text-white" : "bg-rose-500 text-white",
                )}
              >
                {item.badge}
              </Badge>
            ) : null}
          </Link>
        );
      })}
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
  return (
    <div className="mx-3 flex flex-col items-center justify-between gap-2 rounded-2xl border-[#D9E2EC0D] bg-primary p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/help.png" alt="" />
      <a
        href="tel:+261387631600"
        className="flex w-full items-center justify-center rounded-xl bg-[#022864] px-3 py-3 text-white hover:bg-[#022864]/90"
      >
        Obtenir de l&apos;aide
      </a>
    </div>
  );
}
