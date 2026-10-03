import Nav from "@/components/landing/nav";
import Hero from "@/components/landing/hero";
import LogoStrip from "@/components/landing/logo-strip";
import Mission from "@/components/landing/mission";
import Services from "@/components/landing/services";
import System from "@/components/landing/system";
import Cta from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div
      data-accent="violet"
      className="dg-landing relative min-h-svh overflow-x-clip font-sans"
    >
      <Nav />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <LogoStrip />
        <Mission />
        <Services />
        <System />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
