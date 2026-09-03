import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TERA – Il progetto senza glutine | TIMILIA",
  description:
    "Quando cambia la materia, ricomincia la ricerca. TERA è il progetto senza glutine di TIMILIA: un impasto costruito con una propria identità, tra materia, prove, osservazione e manualità. Palermo, Via Maqueda 221.",
  openGraph: {
    title: "TERA – Il progetto senza glutine | TIMILIA",
    description:
      "Quando cambia la materia, ricomincia la ricerca. L'impasto senza glutine di TIMILIA, costruito con una propria identità.",
    images: ["/images/tera-hero-1.png"],
  },
};

export default function TeraLayout({ children }: { children: React.ReactNode }) {
  return children;
}
