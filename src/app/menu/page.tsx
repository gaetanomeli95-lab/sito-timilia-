"use client";

import dynamic from "next/dynamic";

const MenuScene = dynamic(() => import("@/components/menu/MenuScene"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <span className="text-gold/40 text-xs tracking-[0.3em] uppercase animate-pulse">
        Caricamento...
      </span>
    </div>
  ),
});

export default function MenuPage() {
  return <MenuScene />;
}
