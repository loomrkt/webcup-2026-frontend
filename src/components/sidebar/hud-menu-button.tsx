import * as React from "react";
import { cn } from "@/lib/utils";

export const HudMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Ouvrir le menu"
    className={cn(
      "group relative h-10 w-10 shrink-0 cursor-pointer drop-shadow-[0_0_8px_var(--dg-accent-glow)] transition-[filter] duration-300 hover:drop-shadow-[0_0_14px_var(--dg-accent-glow-strong)] focus-visible:outline-none active:scale-95",
      className,
    )}
    {...props}
  >
    {/* Bordure dégradée */}
    <span
      aria-hidden
      className="hud-btn absolute inset-0 bg-gradient-to-br from-[var(--dg-accent-bright)] via-[var(--dg-accent)] to-[var(--dg-border)]"
    />

    {/* Fond */}
    <span
      aria-hidden
      className="hud-btn absolute inset-px bg-[var(--dg-bg)] transition-colors duration-300 group-hover:bg-[var(--dg-accent)]/20 group-data-[state=open]:bg-[var(--dg-accent)]/30"
    />

    {/* Barres du burger */}
    <span className="absolute inset-0 flex flex-col items-end justify-center gap-[5px] pr-[11px]">
      <span className="h-0.5 w-5 rounded-full bg-white transition-all duration-300 group-data-[state=open]:translate-y-[7px] group-data-[state=open]:rotate-45" />
      <span className="h-0.5 w-3 rounded-full bg-[var(--dg-accent-bright)] shadow-[0_0_6px_var(--dg-accent)] transition-all duration-300 group-hover:w-5 group-data-[state=open]:opacity-0" />
      <span className="h-0.5 w-4 rounded-full bg-white transition-all duration-300 group-hover:w-5 group-data-[state=open]:w-5 group-data-[state=open]:-translate-y-[7px] group-data-[state=open]:-rotate-45" />
    </span>
  </button>
));
HudMenuButton.displayName = "HudMenuButton";