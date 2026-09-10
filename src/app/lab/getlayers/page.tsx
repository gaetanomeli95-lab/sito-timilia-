import type { Metadata } from "next";
import HeroGetLayers from "@/components/experiments/HeroGetLayers";
import DoughSpotlightGetLayers from "@/components/experiments/DoughSpotlightGetLayers";
import ExperimentBoundary from "@/components/experiments/ExperimentBoundary";

export const metadata: Metadata = {
  title: "Timilia — Visual Lab",
  description: "Laboratorio visivo isolato per sperimentare la nuova direzione Timilia.",
  robots: { index: false, follow: false },
};

export default function GetLayersLabPage() {
  return (
    <div className="min-h-screen bg-[#050504] text-white">
      <div className="pointer-events-none fixed bottom-4 left-4 z-[90] rounded-full border border-gold/25 bg-black/65 px-3 py-2 text-[8px] font-medium uppercase tracking-[0.26em] text-gold/70 backdrop-blur-md md:bottom-6 md:left-6">
        Timilia · visual lab · standalone
      </div>

      <div className="fixed right-4 top-4 z-[90] md:right-6 md:top-6">
        <a
          href="/"
          className="inline-flex rounded-full border border-white/15 bg-black/55 px-4 py-2.5 text-[9px] uppercase tracking-[0.22em] text-white/70 backdrop-blur-md transition hover:border-gold/50 hover:text-gold"
        >
          Home originale
        </a>
      </div>

      <main>
        <ExperimentBoundary name="Hero GetLayers">
          <HeroGetLayers />
        </ExperimentBoundary>

        <ExperimentBoundary name="Spotlight impasti">
          <DoughSpotlightGetLayers />
        </ExperimentBoundary>
      </main>

      <footer className="border-t border-white/10 bg-[#050504] px-6 py-10 text-center text-[9px] uppercase tracking-[0.28em] text-white/30">
        TIMILIA · laboratorio visivo isolato · nessuna modifica alla produzione
      </footer>
    </div>
  );
}
