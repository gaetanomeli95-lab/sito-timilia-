import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuStorySection from "@/components/MenuStorySection";
import ExplodedPizzaShowcase from "@/components/experiments/ExplodedPizzaShowcase";

export const metadata: Metadata = {
  title: "La Nostra Pizza – TIMILIA | Pizzeria Palermo",
  description:
    "Il racconto della pizza Timilia: materia prima, tecnica, tempo e consapevolezza. Dalla farina al forno, il modo in cui pensiamo la pizza a Palermo, Via Maqueda 221.",
  openGraph: {
    title: "La Nostra Pizza – TIMILIA",
    description:
      "Il racconto della pizza Timilia: materia prima, tecnica, tempo e consapevolezza.",
    images: ["/images/menu-story/bedda-matri.jpeg"],
  },
};

export default function LaNostraPizzaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <main className="flex-1">
        <MenuStorySection />
        <ExplodedPizzaShowcase
          eyebrow="La materia prima, senza nascondigli"
          title="A Bufalina"
          subtitle="Una pizza reale del menu diventa un oggetto da esplorare: la fotografia si apre in profondità, i livelli si separano e la composizione si legge come nel riferimento 3D che mi hai mandato."
          image="/images/menu-story/bufalina.png"
          imageAlt="Pizza A Bufalina di Timilia"
          notes={[
            { label: "Pomodorino siccagno", detail: "La base aromatica, scelta prima del forno." },
            { label: "Bufala DOP", detail: "Morbidezza e carattere senza coprire l'impasto." },
            { label: "Pomodorino confit", detail: "Una nota più concentrata e dolce." },
            { label: "Olio EVO · basilico", detail: "Il finale essenziale, aggiunto per chiudere il morso." },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
