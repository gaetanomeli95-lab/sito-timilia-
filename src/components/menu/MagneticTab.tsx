"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";

type MagneticTabProps = {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  className?: string;
};

export default function MagneticTab({
  children,
  isActive,
  onClick,
  className = "",
}: MagneticTabProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const btn = ref.current;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.08,
      y: y * 0.08,
      duration: 0.5,
      ease: "power3.out",
    });

    if (glowRef.current) {
      const glowX = ((e.clientX - rect.left) / rect.width) * 100;
      gsap.to(glowRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      glowRef.current.style.background = `radial-gradient(circle at ${glowX}% 50%, rgba(216, 154, 61, 0.25), transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative px-4 py-2 text-xs uppercase font-medium whitespace-nowrap transition-all duration-500 ${className}`}
      style={{
        letterSpacing: isActive ? "0.2em" : "0.15em",
        fontWeight: isActive ? 500 : 400,
        willChange: "transform",
      }}
    >
      <span
        ref={glowRef}
        className="absolute inset-0 opacity-0 pointer-events-none rounded-full"
        style={{ willChange: "opacity" }}
      />
      <span
        className={`relative z-10 transition-colors duration-500 ${
          isActive ? "text-gold" : "text-foreground/40 hover:text-foreground/80"
        }`}
        style={{
          textShadow: isActive
            ? "0 0 20px rgba(216, 154, 61, 0.3)"
            : "none",
        }}
      >
        {children}
      </span>
    </button>
  );
}
