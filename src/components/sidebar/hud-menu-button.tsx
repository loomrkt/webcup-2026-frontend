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
      "group flex h-10 w-10 shrink-0 cursor-pointer flex-col items-end justify-center gap-[5px] overflow-hidden rounded-xl border border-[var(--dg-accent)]/40 bg-[var(--dg-bg)] pr-[11px] drop-shadow-[0_0_8px_var(--dg-accent-glow)] transition-all duration-300 hover:border-[var(--dg-accent)]/70 hover:bg-[var(--dg-accent)]/20 hover:drop-shadow-[0_0_14px_var(--dg-accent-glow-strong)] focus-visible:ring-3 focus-visible:ring-[var(--dg-accent)]/60 focus-visible:outline-none active:scale-95 data-[state=open]:border-[var(--dg-accent)]/70 data-[state=open]:bg-[var(--dg-accent)]/30",
      className,
    )}
    {...props}
  >
    <span className="h-0.5 w-5 rounded-full bg-white transition-all duration-300 group-data-[state=open]:translate-y-[7px] group-data-[state=open]:rotate-45" />
    <span className="h-0.5 w-3 rounded-full bg-[var(--dg-accent-bright)] shadow-[0_0_6px_var(--dg-accent)] transition-all duration-300 group-hover:w-5 group-data-[state=open]:opacity-0" />
    <span className="h-0.5 w-4 rounded-full bg-white transition-all duration-300 group-hover:w-5 group-data-[state=open]:w-5 group-data-[state=open]:-translate-y-[7px] group-data-[state=open]:-rotate-45" />
  </button>
));
HudMenuButton.displayName = "HudMenuButton";