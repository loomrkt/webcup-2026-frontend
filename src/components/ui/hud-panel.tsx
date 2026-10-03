"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type HudPanelVariant = "frame" | "card";
export type HudPanelTone = "accent" | "danger" | "success";

const BORDER: Record<HudPanelTone, string> = {
  accent:
    "from-[var(--dg-accent)] via-[var(--dg-border)] to-[var(--dg-accent)]/70",
  danger:
    "from-[var(--dg-danger)]/80 via-[var(--dg-border)] to-[var(--dg-danger)]/40",
  success:
    "from-[var(--dg-success)]/80 via-[var(--dg-border)] to-[var(--dg-success)]/40",
};

const EDGE: Record<HudPanelTone, string> = {
  accent: "via-[var(--dg-accent)]/60",
  danger: "via-[var(--dg-danger)]/45",
  success: "via-[var(--dg-success)]/45",
};

function HudPanel({
  variant = "card",
  tone = "accent",
  hover = false,
  edge = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: HudPanelVariant;
  tone?: HudPanelTone;
  hover?: boolean;
  edge?: boolean;
}) {
  const frame = variant === "frame";
  const cut = frame ? "hud-frame" : "hud-panel";

  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      {/* Couche bordure (dégradé chanfreiné) */}
      <span
        aria-hidden
        className={cn(
          cut,
          "absolute inset-0 bg-gradient-to-br",
          BORDER[tone],
        )}
      />

      {/* Couche contenu */}
      <div
        className={cn(
          cut,
          "absolute inset-px overflow-hidden backdrop-blur-xl transition-colors",
          frame
            ? "bg-[var(--dg-bg-raised)]"
            : "bg-[var(--dg-bg-raised)]/60",
          hover && "hover:bg-[var(--dg-bg-raised)]/80",
        )}
      >
        {edge || frame ? (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
              EDGE[tone],
            )}
          />
        ) : null}

        {frame && (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute top-[14px] left-[14px] h-2 w-2 rounded-full bg-[var(--dg-accent-bright)] shadow-[0_0_10px_var(--dg-accent)]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-[14px] bottom-[14px] h-2 w-2 rounded-full bg-[var(--dg-accent-bright)] shadow-[0_0_10px_var(--dg-accent)]"
            />
          </>
        )}

        {children}
      </div>
    </div>
  );
}

export { HudPanel };