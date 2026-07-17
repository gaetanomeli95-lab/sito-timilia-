import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TERA – Il Progetto | TIMILIA",
  description: "TERA è il progetto di ricerca sugli impasti di TIMILIA. Un blend di grani antichi siciliani per una pizza leggera, digeribile e senza glutine. Scopri la rivoluzione di Giuseppe D'Angelo.",
  openGraph: {
    title: "TERA – Il Progetto | TIMILIA",
    description: "Impasti di grani antichi siciliani. Pizza senza glutine leggera e digeribile.",
    images: ["/images/tera-experience.png"],
  },
};

export default function TeraLayout({ children }: { children: React.ReactNode }) {
  return children;
}
