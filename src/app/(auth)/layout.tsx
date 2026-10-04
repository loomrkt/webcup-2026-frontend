import type { Metadata } from "next";
import { AuthBackground } from "@/components/auth/auth-background";
import { BrandMark } from "@/components/auth/brand-mark";
import { Logo } from "@/helpers/icons";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentification | Terra Nova",
  description: "Accès sécurisé à la plateforme Terra Nova",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-accent="violet"
      className="relative min-h-svh overflow-hidden bg-[var(--dg-bg)] font-sans text-[var(--dg-text)]"
    >
      <AuthBackground />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
        </Link>
        <div className="hidden items-center gap-2 rounded-full border border-[var(--dg-border)] bg-white/[0.06] px-4 py-1.5 text-xs text-[var(--dg-text-muted)] sm:flex">
          <span
            className="dg-animate size-1.5 rounded-full bg-[var(--dg-success)] shadow-[0_0_8px_var(--dg-success-glow)] [animation:dg-glow-pulse_6s_ease-in-out_infinite]"
            aria-hidden="true"
          />
          System online
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 flex min-h-svh items-center justify-center px-4 py-24 outline-none"
      >
        {children}
      </main>
    </div>
  );
}