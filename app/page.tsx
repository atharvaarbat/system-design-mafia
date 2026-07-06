'use client';
import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import DiagramCards from "@/components/landing/diagram-cards";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen overflow-x-hidden bg-background">
        <Hero />
        <DiagramCards />
        <Features />
      </main>
      <Footer />
    </>
  );
}
