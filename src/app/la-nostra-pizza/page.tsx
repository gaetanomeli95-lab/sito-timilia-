import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuStorySection from "@/components/MenuStorySection";
import RealPhotoPizzaExplodeV2 from "@/components/experiments/RealPhotoPizzaExplodeV2";

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
        <RealPhotoPizzaExplodeV2
          image="/images/menu-story/bufalina.png"
          eyebrow="La materia prima, senza nascondigli"
          title="A Bufalina"
          lead="Pochi elementi. Tutti decisivi."
          body="La Bufalina vive di equilibrio, non di rumore. La base è costruita sulla pulizia del pomodoro, sulla qualità della bufala e su un finale essenziale che lascia parlare la materia prima."
          closing="Quando gli ingredienti sono veri, non serve aggiungere rumore."
          notes={[
            { label: "Pomodorino siccagno", detail: "Intensità, identità e precisione." },
            { label: "Bufala DOP", detail: "Morbidezza e carattere senza compromessi." },
            { label: "Pomodorino confit", detail: "Il gusto si concentra senza perdere eleganza." },
            { label: "Olio EVO", detail: "Il gesto finale che mette ordine." },
            { label: "Basilico", detail: "Il profumo che chiude il cerchio." },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
