"use client";

import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/common/error-message";
import { useRequestSupport, useToggleSupport } from "../hooks/use-request-support";

/**
 * Bouton de soutien réutilisable : compteur de soutiens + état « soutenu
 * par moi » (F52). Prend l'identifiant UUID d'une demande existante.
 */
export function RequestSupportButton({
  requestId,
  className,
}: {
  requestId: string;
  className?: string;
}) {
  const { data, isLoading, isError, error } = useRequestSupport(requestId);
  const toggle = useToggleSupport(requestId);

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Skeleton className="h-8 w-28 rounded-lg bg-white/10" />
      </div>
    );
  }

  if (isError) {
    return (
      <p role="alert" className={cn("text-xs text-[var(--dg-danger)]", className)}>
        {getApiErrorMessage(error, "Soutien indisponible.")}
      </p>
    );
  }

  const supported = data?.supportedByMe ?? false;
  const count = data?.count ?? 0;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        type="button"
        variant={supported ? "default" : "outline"}
        onClick={() => void toggle.mutate(!supported)}
        disabled={toggle.isPending}
        aria-pressed={supported}
        aria-label={
          supported
            ? `Retirer votre soutien (${count} soutien${count > 1 ? "s" : ""})`
            : `Soutenir cette demande (${count} soutien${count > 1 ? "s" : ""})`
        }
        className={cn(
          "hud-chip",
          supported &&
            "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent-border)] shadow-[0_0_12px_var(--dg-accent-glow-soft)] hover:bg-[var(--dg-accent)]/25",
        )}
      >
        <ThumbsUp aria-hidden className={cn(supported && "fill-current")} />
        {supported ? "Soutenu" : "Soutenir"}
      </Button>
      <span className="text-sm text-[var(--dg-text-muted)]">
        <strong className="font-semibold text-[var(--dg-text)]">{count}</strong>{" "}
        soutien{count > 1 ? "s" : ""}
        {supported ? " · soutenu par moi" : ""}
      </span>
    </div>
  );
}