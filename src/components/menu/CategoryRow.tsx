"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { menuCategories } from "@/data/menuData";
import { categoryEmojis } from "@/data/menuMeta";

type CategoryRowProps = {
  cat: (typeof menuCategories)[number];
  idx: number;
  isActive: boolean;
  isExpanded: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
};

export default function CategoryRow({
  cat,
  idx,
  isActive,
  isExpanded,
  onHover,
  onLeave,
  onClick,
}: CategoryRowProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    gsap.to(ref.current, {
      x: x * 0.04,
      duration: 0.5,
      ease: "power3.out",
    });
    if (glowRef.current) {
      const glowX = ((e.clientX - rect.left) / rect.width) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${glowX}% 50%, rgba(216, 154, 61, 0.1), transparent 70%)`;
      gsap.to(glowRef.current, { opacity: 1, duration: 0.4 });
    }
  };

  const handleMouseLeave = () => {
    onLeave();
    if (ref.current) {
      gsap.to(ref.current, { x: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
    }
  };

  return (
    <button
      ref={ref}
      data-enter
      onMouseEnter={onHover}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group relative flex items-center gap-3 py-2.5 px-3 rounded-xl text-left transition-colors duration-500 hover:bg-white/[0.04]"
      style={{ willChange: "transform" }}
    >
      <span
        ref={glowRef}
        className="absolute inset-0 opacity-0 rounded-xl pointer-events-none"
      />
      <span
        className={`text-base transition-all duration-500 ${
          isActive ? "scale-110" : "opacity-60 group-hover:opacity-100"
        }`}
      >
        {categoryEmojis[cat.id] ?? "•"}
      </span>
      <span
        className={`text-sm lg:text-base font-light tracking-wide transition-all duration-500 ${
          isActive
            ? "text-gold"
            : "text-[#f5f0e8]/52 group-hover:text-[#f5f0e8]/82"
        }`}
        style={{
          textShadow: isActive ? "0 0 20px rgba(216, 154, 61, 0.2)" : "none",
          fontWeight: isActive ? 400 : 300,
          letterSpacing: isActive ? "0.03em" : "0.01em",
        }}
      >
        {cat.title}
      </span>
      {isExpanded && (
        <span className="ml-auto text-gold/40 text-[10px]">▾</span>
      )}
    </button>
  );
}
