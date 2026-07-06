'use client';
import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import DiagramCards from "@/components/landing/diagram-cards";
import Features from "@/components/landing/features";

export default function Home() {
  return (
    <main className="dark min-h-screen overflow-x-hidden bg-[#101010]">
      <Navbar />
      <Hero />
      <DiagramCards />
      <Features/>
    </main>
  );
}
