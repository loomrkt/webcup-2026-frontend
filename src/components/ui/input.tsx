import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "cn";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-lg border border-cyan-400/20 bg-slate-950/60 px-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none",
      "placeholder:text-slate-500 hover:border-cyan-400/40",
      "focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";