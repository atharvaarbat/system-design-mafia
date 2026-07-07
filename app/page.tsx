'use client';
import Navbar from "@/components/landing/navbar";
import BlueprintHud from "@/components/landing/blueprint-hud";
import SmoothScroll from "@/components/landing/smooth-scroll";
import Hero from "@/components/landing/hero";
import Marquee from "@/components/landing/marquee";
import DiagramCards from "@/components/landing/diagram-cards";
import Features from "@/components/landing/features";
import Cta from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <BlueprintHud />
      <SmoothScroll>
        <main id="main-content" className="relative min-h-screen overflow-x-clip font-mono">
          <Hero />
          <Marquee />
          <DiagramCards />
          <Features />
          <Cta />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
