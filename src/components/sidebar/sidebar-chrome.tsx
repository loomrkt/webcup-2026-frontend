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

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="z-10 flex h-full flex-col">
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

/** Sidebar desktop — rail fixe, masqué sous le breakpoint lg. */
export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] shrink-0 border-r border-white/5 lg:block">
      <SidebarContent />
    </aside>
  );
}

/** Sidebar mobile et tablette — bouton hamburger ouvrant un Sheet depuis la gauche. */
export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button
          variant="ghost"
          className="z-15 cursor-pointer rounded-full bg-primary p-4 py-6 text-white hover:bg-primary/90 hover:text-white lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        showCloseButton={false}
        side="left"
        className="w-[280px] border-none bg-primary p-0 before:absolute before:inset-0 before:bg-[url(/pattern.png)] before:opacity-30 before:content-[''] not-lg:before:opacity-90"
      >
        <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
