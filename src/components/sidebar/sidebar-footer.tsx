"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoleGuard } from "@/guards/role-guard";

function getInitials(email?: string | null) {
  if (!email) return "?";
  const localPart = email.split("@")[0];
  return localPart.slice(0, 2).toUpperCase();
}

export function SidebarFooter() {
  const { data: session, status } = useSession();
  const { roles, isLoading: rolesLoading } = useRoleGuard();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="mx-3 flex items-center gap-3 rounded-2xl border border-[var(--dg-border)] bg-white/[0.04] px-4 py-4">
        <Skeleton className="h-9 w-9 rounded-xl bg-white/10" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="h-3 w-24 bg-white/10" />
          <Skeleton className="h-2.5 w-16 bg-white/10" />
        </div>
      </div>
    );
  }

  const email = session?.user?.email ?? "";
  const displayRole = rolesLoading
    ? "…"
    : roles[0]
      ? roles[0].replaceAll("_", " ")
      : "Membre";

  return (
    <div className="mx-3 flex items-center gap-3 rounded-2xl border border-[var(--dg-border)] bg-white/[0.04] px-4 py-4 backdrop-blur-md">
      <div className="relative shrink-0">
        <span
          aria-hidden
          className="absolute inset-0 rounded-xl bg-[var(--dg-accent)] opacity-40 blur-md"
        />
        <Avatar className="relative h-9 w-9">
          <AvatarImage src="" alt={email} className="rounded-xl!" />
          <AvatarFallback className="rounded-xl! bg-[var(--dg-accent)]/25 text-[var(--dg-accent-bright)]">
            {getInitials(email)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-white">
          {email || "Utilisateur"}
        </p>
        <p className="truncate text-[11px] text-[var(--dg-text-faint)] capitalize">
          {displayRole}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        disabled={signingOut}
        aria-label="Se déconnecter"
        className="h-8 w-8 shrink-0 cursor-pointer text-[var(--dg-text-faint)] hover:bg-[var(--dg-danger)]/15 hover:text-[var(--dg-danger)]"
      >
        <LogOut />
      </Button>
    </div>
  );
}