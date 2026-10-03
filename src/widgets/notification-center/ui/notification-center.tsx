"use client";

import { Bell, CheckCheck, Settings2 } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useMarkAllReadMutation,
  useUnreadCountQuery,
} from "@/entities/notification";
import { cn } from "@/lib/utils";
import { NotificationList } from "./notification-list";
import { NotificationPrefs } from "./notification-prefs";

type Tab = "list" | "prefs";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("list");
  const { data: unread = 0 } = useUnreadCountQuery();
  const markAll = useMarkAllReadMutation();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setTab("list");
          setOpen(true);
        }}
        aria-label={`Notifications${unread > 0 ? ` (${unread} non lues)` : ""}`}
        className="fixed right-5 bottom-5 z-50 flex size-12 cursor-pointer items-center justify-center rounded-full border border-[var(--dg-accent-border)] bg-[var(--dg-bg-raised)] text-[var(--dg-accent-bright)] shadow-[0_0_20px_var(--dg-accent-glow-soft)] backdrop-blur-xl transition-all hover:scale-105 hover:bg-[var(--dg-bg-card-hover)]"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--dg-danger)] px-1 text-[10px] font-bold text-white shadow-[0_0_10px_var(--dg-danger-glow)]">
            {unread > 99 ? "99+" : unread}
          </span>
        ) : null}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full border-none bg-[var(--dg-bg-raised)] p-0 sm:max-w-[26rem]!"
        >
          <SheetHeader>
            <SheetTitle className="text-base font-semibold text-white">
              Notifications
            </SheetTitle>
            <SheetDescription className="text-sm text-[var(--dg-text-muted)]">
              {unread > 0
                ? `${unread} non lue${unread > 1 ? "s" : ""}`
                : "Vous êtes à jour"}
            </SheetDescription>
          </SheetHeader>

          <div className="flex items-center gap-2 px-4">
            <TabButton
              active={tab === "list"}
              onClick={() => setTab("list")}
              icon={<Bell className="h-4 w-4" />}
              label="Liste"
            />
            <TabButton
              active={tab === "prefs"}
              onClick={() => setTab("prefs")}
              icon={<Settings2 className="h-4 w-4" />}
              label="Préférences"
            />
            {tab === "list" && unread > 0 ? (
              <button
                type="button"
                onClick={() => void markAll.mutate()}
                className="ml-auto inline-flex cursor-pointer items-center gap-1 text-xs text-[var(--dg-accent-bright)] transition-colors hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Tout marquer lu
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto pb-6">
            {tab === "list" ? <NotificationList /> : <NotificationPrefs />}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border border-[var(--dg-accent)]/40"
          : "text-[var(--dg-text-muted)] border border-transparent hover:text-white",
      )}
    >
      {icon}
      {label}
    </button>
  );
}