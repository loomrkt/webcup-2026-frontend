"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

function getInitials(email?: string | null) {
  if (!email) return "?";
  const localPart = email.split("@")[0];
  return localPart.slice(0, 2).toUpperCase();
}

export function SidebarFooter() {
  const { data: session, status } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 rounded-4xl bg-primary px-4 py-4">
        <Skeleton className="h-9 w-9 rounded-md" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
    );
  }

  const email = session?.user?.email ?? "";

  return (
    <div className="flex items-center gap-3 rounded-4xl bg-primary px-4 py-4">
      <Avatar className="h-9 w-9">
        <AvatarImage src="" alt={email} className="rounded-md!" />
        <AvatarFallback className="rounded-md! bg-sky-500/20 text-sky-300">
          {getInitials(email)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-white">
          {email || "Utilisateur"}
        </p>
        <p className="truncate text-[12px] text-slate-400">Connecté</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        disabled={signingOut}
        aria-label="Se déconnecter"
        className="h-8 w-8 shrink-0 cursor-pointer text-slate-400 hover:bg-white/5 hover:text-white"
      >
        <LogOut />
      </Button>
    </div>
  );
}
