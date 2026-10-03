import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/session-provider";
import { PageTransitionProvider } from "@/components/pageTransitions/PageTransitionProvider";
import LoadingWrapper from "@/components/loaders/LoadingWrapper";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Loomrkt - application",
  description: "Loomrkt - application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", poppins.variable, "font-sans", geist.variable)}
    >
      <body className={`${poppins.className} min-h-full flex flex-col`}>
        <AuthProvider>
          <PageTransitionProvider>
            <LoadingWrapper>{children}</LoadingWrapper>
          </PageTransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
