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
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-[var(--dg-accent)] opacity-[0.15] blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[var(--dg-accent)] opacity-10 blur-[120px]" />
      </div>

      <RoleGuardProvider>
        <AppSidebar />

        <div className="relative flex min-h-screen flex-col lg:ml-[284px] lg:py-3 lg:pr-3">
          <header className="relative z-12 flex items-center justify-center px-4 pt-4 lg:px-6 lg:pt-2">
            <MobileSidebar />
            <div className="ml-4 flex items-center justify-center gap-2 lg:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt=""
                className="h-6 w-auto drop-shadow-[0_0_10px_rgba(109,74,255,0.5)]"
              />
              <span className="bg-gradient-to-r from-white to-[var(--dg-accent-bright)] bg-clip-text text-xl font-bold text-transparent">
                TERRA NOVA
              </span>
            </div>
          </header>

          <main className="relative flex-1 overflow-hidden p-4 md:p-6">
            <div className="relative h-[calc(100vh-24px-32px-72px)] overflow-hidden rounded-3xl border border-[var(--dg-border)] bg-[var(--dg-bg-raised)]/60 shadow-[0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl lg:h-[calc(100vh-24px-48px)]">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--dg-accent)]/50 to-transparent"
              />
              <div className="not-lg:mt-18 h-full overflow-y-auto">
                <TooltipProvider>{children}</TooltipProvider>
              </div>
            </div>
          </main>
        </div>
      </RoleGuardProvider>
    </div>
  );
}