import { auth } from "@/auth";
import { AppSidebar, MobileSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleGuardProvider } from "@/guards/role-guard";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <div className="relative min-h-screen bg-[var(--dg-bg)] font-sans text-[var(--dg-text)]">
      {/* Lueurs d'arrière-plan */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-[var(--dg-accent)] opacity-[0.15] blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[var(--dg-accent)] opacity-10 blur-[120px]" />
      </div>

      <RoleGuardProvider>
        <AppSidebar />

        <div className="relative flex min-h-screen flex-col lg:ml-[284px] lg:py-3 lg:pr-5">
          {/* ───────── Header mobile : bannière à gradin ───────── */}
          <header className="relative z-12 px-4 pt-4 lg:hidden">
            <div className="relative h-14 drop-shadow-[0_0_16px_rgba(109,74,255,0.35)]">
              {/* Couche bordure */}
              <div
                aria-hidden
                className="hud-banner absolute inset-0 bg-gradient-to-r from-[var(--dg-accent)] via-[var(--dg-border)] to-[var(--dg-accent)]/50"
              />

              {/* Couche contenu */}
              <div className="hud-banner absolute inset-px flex items-center gap-3 overflow-hidden bg-[var(--dg-bg-raised)] pr-4 pl-3 backdrop-blur-xl">
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-4 h-px w-32 bg-gradient-to-r from-[var(--dg-accent)] to-transparent"
                />

                <MobileSidebar />

                {/* Séparateur incliné */}
                <span
                  aria-hidden
                  className="h-6 w-px -skew-x-[20deg] bg-gradient-to-b from-transparent via-[var(--dg-accent)] to-transparent"
                />

                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt=""
                    className="h-6 w-auto drop-shadow-[0_0_10px_rgba(109,74,255,0.5)]"
                  />
                  <span className="bg-gradient-to-r from-white to-[var(--dg-accent-bright)] bg-clip-text font-mono text-lg font-bold tracking-[0.2em] text-transparent uppercase">
                    Terra Nova
                  </span>
                </div>

                <div
                  aria-hidden
                  className="ml-auto flex items-center gap-1.5 self-end pb-2.5"
                >
                  <span className="h-1 w-1 rounded-full bg-[var(--dg-accent)]/40" />
                  <span className="h-1 w-1 rounded-full bg-[var(--dg-accent)]/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--dg-accent-bright)] shadow-[0_0_8px_var(--dg-accent)]" />
                </div>
              </div>
            </div>
          </header>

          {/* ───────── Cadre principal ───────── */}
          <main className="relative flex-1 p-4 md:p-0">
            <div className="relative h-[calc(100vh-24px-32px-72px)] drop-shadow-[0_0_24px_rgba(109,74,255,0.35)] lg:h-[calc(100vh-24px)]">
              {/* Couche bordure */}
              <div
                aria-hidden
                className="hud-frame absolute inset-0 bg-gradient-to-br from-[var(--dg-accent)] via-[var(--dg-border)] to-[var(--dg-accent)]/70"
              />

              {/* Couche contenu */}
              <div className="hud-frame absolute inset-px overflow-hidden bg-[var(--dg-bg-raised)] backdrop-blur-xl">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--dg-accent)] to-transparent"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-[14px] left-[14px] h-2 w-2 rounded-full bg-[var(--dg-accent-bright)] shadow-[0_0_10px_var(--dg-accent)]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-[14px] bottom-[14px] h-2 w-2 rounded-full bg-[var(--dg-accent-bright)] shadow-[0_0_10px_var(--dg-accent)]"
                />

                <div className="not-lg:mt-18 h-full overflow-y-auto">
                  <TooltipProvider>{children}</TooltipProvider>
                </div>
              </div>
            </div>
          </main>
        </div>
      </RoleGuardProvider>
    </div>
  );
}