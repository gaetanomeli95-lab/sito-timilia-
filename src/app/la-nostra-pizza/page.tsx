import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuStorySection from "@/components/MenuStorySection";

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
      </main>
      <Footer />
    </div>
  );
}
