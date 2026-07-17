import type { Metadata } from "next";
import { Suspense } from "react";
import MenuScene from "@/components/menu/MenuScene";
import { MenuSkeleton } from "@/components/Skeletons";

export const metadata: Metadata = {
  title: "Menu – TIMILIA | Pizzeria Palermo",
  description: "Scopri il menu di TIMILIA: pizze senza glutine TERA, antipasti siciliani, passi d'autore, dolci senza glutine e senza lattosio. Via Maqueda 221, Palermo.",
  openGraph: {
    title: "Menu – TIMILIA",
    description: "Pizze senza glutine TERA, antipasti siciliani, dolci senza lattosio. Via Maqueda 221, Palermo.",
    images: ["/images/menu/classiche-MARGHERITA.jpg"],
  },
};

export default function MenuPage() {
  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuScene />
    </Suspense>
  );
}
