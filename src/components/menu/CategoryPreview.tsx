"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { menuCategories } from "@/data/menuData";

type CategoryPreviewProps = {
  activeIndex: number;
  hoveredIndex: number | null;
};

const previewImages: Record<string, string> = {
  antipasti: "/images/menu/nuovo-antipasti-stritti-fuddi.png",
  "passi-dautore": "/images/menu/passi-CAMURRIA.jpg",
  "le-storiche": "/images/menu/storiche-PANORMUS.jpg",
  "le-classiche": "/images/menu/nuovo-classiche-caprese.png",
  buffalotti: "/images/menu/buffalotti-CU_CRUDU.jpg",
  crusta: "/images/menu/nuovo-crusta-timpulata.png",
  "le-vegane": "/images/menu/vegane-PATAT.jpg",
  calzoni: "/images/menu/classiche-CALZONE.jpg",
  insalate: "/images/menu/nuovo-insalate-caprese.png",
  hamburger: "/images/menu/classiche-DIAVOLA.jpg",
};

export default function CategoryPreview({
  activeIndex,
  hoveredIndex,
}: CategoryPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const kenBurnsRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());

  const displayIndex = hoveredIndex ?? activeIndex;
  const category = menuCategories[displayIndex];
  const imageSrc =
    previewImages[category?.id] ?? "/images/menu/nuovo-antipasti-stritti-fuddi.png";

  // Ken Burns continuous zoom
  useRef(() => {
    if (kenBurnsRef.current) {
      gsap.to(kenBurnsRef.current, {
        scale: 1.08,
        duration: 8,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });
    }
  });

  return (
    <div
      ref={containerRef}
      className="hidden lg:block relative w-full h-full overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={displayIndex}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <div ref={kenBurnsRef} className="absolute inset-0">
            <Image
              src={imageSrc}
              alt={category?.title ?? ""}
              fill
              className="object-contain"
              sizes="600px"
              onLoad={() => {
                setLoaded((prev) => new Set(prev).add(displayIndex));
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/20 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Category info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            <span className="text-gold/60 text-[10px] tracking-[0.3em] uppercase font-medium block mb-2">
              {String(displayIndex + 1).padStart(2, "0")} — Categoria
            </span>
            <h3 className="text-foreground text-2xl font-light tracking-wide mb-2">
              {category?.title}
            </h3>
            {category?.subtitle && (
              <p className="text-foreground/40 text-sm font-light leading-relaxed line-clamp-2 mb-3">
                {category.subtitle}
              </p>
            )}
            <span className="text-gold/50 text-xs font-light">
              {category?.items.length} prodotti
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Loading shimmer */}
      {!loaded.has(displayIndex) && (
        <div className="absolute inset-0 bg-white/[0.02] animate-pulse" />
      )}
    </div>
  );
}
