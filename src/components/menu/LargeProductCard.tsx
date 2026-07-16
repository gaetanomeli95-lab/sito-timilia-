"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import type { MenuItem } from "@/data/menuData";
import { categoryDietary } from "@/data/menuMeta";
import { DietaryIcon } from "./DietaryIcon";

type LargeProductCardProps = {
  item: MenuItem;
  catTitle: string;
  catId: string;
  onOpen: (item: MenuItem, cat: string) => void;
};

export default function LargeProductCard({
  item,
  catTitle,
  catId,
  onOpen,
}: LargeProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateY = ((x - cx) / cx) * 4;
    const rotateX = -((y - cy) / cy) * 4;
    gsap.to(ref.current, {
      rotateY,
      rotateX,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(200,169,126,0.12), transparent 220px)`;
      spotlightRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      gsap.to(ref.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    }
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
  };

  const hasImage = !!item.image;

  return (
    <div
      ref={ref}
      data-product
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item, catTitle)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(item, catTitle);
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] hover:border-gold/30 focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:outline-none transition-all duration-700 flex flex-col sm:flex-row shadow-[0_20px_80px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_110px_rgba(0,0,0,0.4)]"
      style={{ willChange: "transform", transformStyle: "preserve-3d", background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))" }}
    >
      <div ref={spotlightRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-20" />
      <div className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold/50 to-transparent transition-transform duration-700 group-hover:scale-x-100 z-20" />
      <div className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-gradient-to-l from-transparent via-gold/40 to-transparent transition-transform duration-700 group-hover:scale-x-100 z-20" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gold/[0.08] blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 z-10" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-32 w-32 rounded-full bg-gold/[0.06] blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 z-10" />

      {/* Image — adapts to natural shape, no cropping, no empty borders */}
      <div className="relative w-full sm:w-[50%] lg:w-[45%] flex-shrink-0 overflow-hidden bg-[#15120e]">
        {hasImage ? (
          <>
            <Image
              src={item.image!}
              alt={item.name}
              width={600}
              height={450}
              className="w-full h-auto object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, 500px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15120e]/40 via-transparent to-white/[0.03]" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute -inset-x-full top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-[-18deg] group-hover:translate-x-[300%] transition-transform duration-[1.4s] ease-out" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/logo-timilia-original.jpg"
              alt=""
              fill
              className="object-contain p-8 opacity-15"
              sizes="400px"
            />
          </div>
        )}
      </div>

      {/* Content — right side on desktop, below on mobile */}
      <div className="relative flex-1 p-4 sm:p-5 lg:p-7 flex flex-col justify-center" style={{ transform: "translateZ(25px)" }}>
        <div className="flex justify-between items-start gap-3 mb-3">
          <h4 className="relative text-[#f5f0e8] text-base sm:text-lg lg:text-2xl font-light tracking-wide leading-tight group-hover:text-gold transition-colors duration-500">
            {item.name}
          </h4>
          {item.price !== undefined && (
            <span className="relative text-gold text-base sm:text-lg lg:text-2xl font-light whitespace-nowrap shrink-0">
              €{item.price.toFixed(2)}
            </span>
          )}
        </div>
        {item.description && (
          <p className="relative text-[#f5f0e8]/55 text-sm font-light leading-relaxed group-hover:text-[#f5f0e8]/72 transition-colors duration-500 line-clamp-3">
            {item.description}
          </p>
        )}
        {item.note && (
          <p className="relative text-[#f5f0e8]/30 text-[10px] tracking-wide mt-3 font-light">
            {item.note}
          </p>
        )}
        {categoryDietary[catId] && (
          <div className="relative flex flex-wrap gap-1.5 sm:gap-2 mt-3">
            {categoryDietary[catId].map((badge, i) => {
              const isGuaranteed = badge.type === "gf" || badge.type === "lf" || badge.type === "bread-gf";
              return (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs tracking-wide font-medium border ${
                    isGuaranteed
                      ? "bg-gold/12 border-gold/35 text-[#f5f0e8]/90"
                      : "bg-white/[0.03] border-white/12 text-[#f5f0e8]/50"
                  }`}
                >
                  <DietaryIcon type={badge.type} size={14} className={isGuaranteed ? "text-gold" : "text-[#f5f0e8]/50"} />
                  {badge.label}
                </span>
              );
            })}
          </div>
        )}
        <div className="relative mt-4 flex items-center gap-2 text-gold/0 group-hover:text-gold/60 transition-colors duration-500">
          <span className="text-[10px] tracking-[0.2em] uppercase font-light">Scopri</span>
          <span className="text-xs transition-transform duration-500 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
  );
}
