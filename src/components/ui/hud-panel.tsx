"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type HudPanelVariant = "frame" | "card";
export type HudPanelTone = "accent" | "danger" | "success";

const BORDER: Record<HudPanelTone, string> = {
  accent: "border-[var(--dg-border)]",
  danger: "border-[var(--dg-danger-border)]",
  success: "border-[var(--dg-success-border)]",
};

const EDGE: Record<HudPanelTone, string> = {
  accent: "border-t-[var(--dg-accent)]/50",
  danger: "border-t-[var(--dg-danger)]/50",
  success: "border-t-[var(--dg-success)]/50",
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
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border backdrop-blur-xl transition-colors",
        BORDER[tone],
        frame ? "bg-[var(--dg-bg-raised)]" : "bg-[var(--dg-bg-raised)]/60",
        edge && EDGE[tone],
        hover && "hover:bg-[var(--dg-bg-raised)]/80",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { HudPanel };