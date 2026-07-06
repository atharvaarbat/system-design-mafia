'use client';
import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import DiagramCards from "@/components/landing/diagram-cards";
import Features from "@/components/landing/features";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <Hero />
      <DiagramCards />
      <Features/>
    </main>
  );
}
