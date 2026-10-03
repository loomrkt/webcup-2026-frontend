"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarBrand, SidebarHelpCard, SidebarNav } from "./sidebar-sections";
import { SidebarFooter } from "./sidebar-footer";
import { HudMenuButton } from "./hud-menu-button";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="relative z-10 flex h-full flex-col">
      <SidebarBrand />
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-6 py-2">
          <SidebarNav onNavigate={onNavigate} />
        </div>
      </ScrollArea>
      <div className="flex flex-col gap-3 pb-3">
        <SidebarHelpCard />
        <SidebarFooter />
      </div>
    </div>
  );
}

/** Sidebar desktop — rail glassmorphe flottant, masqué sous le breakpoint lg. */
export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-3 top-3 bottom-3 z-30 hidden w-[260px] shrink-0 lg:block">
      <div className="relative h-full overflow-hidden rounded-3xl border border-[var(--dg-border)] bg-[var(--dg-bg-raised)]/80 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-56 -translate-x-1/2 rounded-full bg-[var(--dg-accent)] opacity-20 blur-3xl"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--dg-accent)]/60 to-transparent"
        />
        <SidebarContent />
      </div>
    </aside>
  );
}

/** Sidebar mobile et tablette — bouton hamburger ouvrant un Sheet depuis la gauche. */
export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
       <HudMenuButton />
      </SheetTrigger>
      <SheetContent
        showCloseButton={false}
        side="left"
        className="w-[280px] border-none bg-[var(--dg-bg-raised)] p-0"
      >
        <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
        <div className="relative h-full overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-48 w-56 -translate-x-1/2 rounded-full bg-[var(--dg-accent)] opacity-20 blur-3xl"
          />
          <SidebarContent onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}