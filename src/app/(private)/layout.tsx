import { auth } from "@/auth";
import { AppSidebar, MobileSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/");
  return (
    <div className="relative min-h-screen bg-primary p-3 before:absolute before:inset-0 before:bg-[url(/pattern.png)] before:opacity-30 not-lg:before:opacity-90 before:content-['']">
      <AppSidebar />
      <div className="flex min-h-[calc(100vh-24px)] flex-col lg:ml-65 lg:rounded-4xl lg:bg-slate-50">
        <header className="absolute top-6 left-6 flex items-center justify-center z-12">
          <MobileSidebar />
          <div className="flex items-center justify-center ml-4">
            <img src="logoPrimary.png" alt="" className="h-6 w-auto" />
            <span className="font-bold ml-2 text-xl lg:hidden">
              CLUB-Management
            </span>
          </div>
        </header>
        <main className="flex-1 rounded-4xl bg-slate-50 z-10 p-4 md:p-6">
          <div className="not-lg:mt-18 overflow-y-scroll h-[calc(100vh-24px-32px-72px)] lg:h-[calc(100vh-24px-48px)]">
            <TooltipProvider>{children}</TooltipProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
