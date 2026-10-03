import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import { AuthBackground } from "@/components/auth/auth-background";
import { BrandMark } from "@/components/auth/brand-mark";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jbm",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Authentification | Loomrkt",
  description: "Accès sécurisé à la plateforme Loomrkt",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`relative min-h-svh overflow-hidden bg-[#04060f] text-white ${orbitron.variable} ${jetbrainsMono.variable}`}
    >
      <AuthBackground />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 lg:px-12">
        <BrandMark />
        <div className="hidden items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 font-[family-name:var(--font-jbm)] text-[10px] tracking-[0.35em] text-cyan-300 uppercase sm:flex">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] motion-reduce:animate-none" aria-hidden="true" />
          System online
        </div>
      </header>

      <main className="relative z-10 flex min-h-svh items-center justify-center px-4 py-24">
        {children}
      </main>
    </div>
  );
}