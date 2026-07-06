"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import type { MenuItem } from "@/data/menuData";

const allergenMap: Record<string, string> = {
  "1": "Cereali",
  "2": "Crostacei",
  "3": "Uova",
  "4": "Pesce",
  "5": "Frutta a guscio",
  "6": "Soia",
  "7": "Lattosio",
  "8": "Sesamo",
  "9": "Sedano",
  "10": "Senape",
  "11": "Solfiti",
  "12": "Lupini",
};

function parseAllergens(note?: string): string[] {
  if (!note) return [];
  const match = note.match(/Allergeni\s+([\d-]+)/i);
  if (!match) return [];
  return match[1].split("-").map((s) => s.trim());
}

type ProductCardProps = {
  item: MenuItem;
  index: number;
  categoryTitle: string;
  onOpen: (item: MenuItem, cat: string) => void;
};

export default function ProductCard({
  item,
  index,
  categoryTitle,
  onOpen,
}: ProductCardProps) {
  const ref = useRef(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const hasImage = !!item.image;
  const allergens = parseAllergens(item.note);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -2;
    const rotateY = ((x - centerX) / centerX) * 2;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
      transformPerspective: 800,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      data-entrance
    >
      <div
        ref={cardRef}
        onClick={() => onOpen(item, categoryTitle)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group cursor-pointer relative overflow-hidden rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-gold/20 transition-colors duration-700"
        style={{ willChange: "transform", transformStyle: "preserve-3d" }}
      >
        {/* Image */}
        {hasImage ? (
          <div
            ref={imageRef}
            className="relative aspect-[4/3] overflow-hidden bg-[#111]"
          >
            <Image
              src={item.image!}
              alt={item.name}
              fill
              className="object-contain transition-transform duration-[1.2s] group-hover:scale-[1.06]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Sheen effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute -inset-x-full top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent skew-x-[-18deg] group-hover:translate-x-[300%] transition-transform duration-[1.4s] ease-out" />
            </div>
          </div>
        ) : (
          <div className="relative aspect-[4/3] flex items-center justify-center bg-white/[0.01]">
            <Image
              src="/images/logo-timilia-original.jpg"
              alt=""
              fill
              className="object-contain p-10 opacity-15"
              sizes="300px"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4 md:p-5" style={{ transform: "translateZ(20px)" }}>
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="text-foreground text-sm md:text-base font-light tracking-wide leading-tight group-hover:text-gold transition-colors duration-500">
              {item.name}
            </h3>
            {item.price !== undefined && (
              <span className="text-gold/80 text-sm font-light whitespace-nowrap shrink-0">
                € {item.price.toFixed(2)}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-foreground/40 text-xs font-light leading-relaxed line-clamp-2 group-hover:text-foreground/55 transition-colors duration-500">
              {item.description}
            </p>
          )}
          {allergens.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {allergens.slice(0, 6).map((code) => {
                const label = allergenMap[code];
                if (!label) return null;
                return (
                  <span
                    key={code}
                    className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/5 text-[10px] text-foreground/35 font-light"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
