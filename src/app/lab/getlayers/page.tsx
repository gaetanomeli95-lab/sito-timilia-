import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import TeraSection from "@/components/TeraSection";
import HeroGetLayers from "@/components/experiments/HeroGetLayers";
import DoughSpotlightGetLayers from "@/components/experiments/DoughSpotlightGetLayers";

export const metadata: Metadata = {
  title: "Timilia — Visual Lab",
  description: "Laboratorio visivo isolato per sperimentare la nuova direzione Timilia.",
  robots: { index: false, follow: false },
};

export default function GetLayersLabPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050504]">
      <Navbar />

      <div className="pointer-events-none fixed bottom-4 left-4 z-[90] rounded-full border border-gold/25 bg-black/65 px-3 py-2 text-[8px] font-medium uppercase tracking-[0.26em] text-gold/70 backdrop-blur-md md:bottom-6 md:left-6">
        Timilia · visual lab · non produzione
      </div>

      <main className="flex-1">
        <HeroGetLayers />
        <DoughSpotlightGetLayers />
        <TeraSection />
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
