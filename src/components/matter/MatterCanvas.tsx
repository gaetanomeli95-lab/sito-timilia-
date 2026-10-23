"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

type Props = {
  progress: MotionValue<number>;
  tone?: "mineral" | "warm";
  className?: string;
  onReady?: () => void;
};

const TAU = Math.PI * 2;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Seeded once: scrolling back reconstructs the same material, rather than
// generating a new cloud. Coordinates describe flour, folds and a single mass.
function makeMaterial(count: number) {
  let seed = 8191;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    angle: random() * TAU,
    radius: Math.sqrt(random()),
    spreadX: random(),
    spreadY: random(),
    size: 0.35 + random() * 1.05,
    shade: Math.floor(random() * 5),
  }));
}

/** Decorative only. The story and photographs always remain HTML. */
export default function MatterCanvas({ progress, tone = "mineral", className, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const palette = tone === "warm"
      ? ["#ac8661", "#c7a27b", "#dfc6a5", "#f0dfc5", "#fff4df"]
      : ["#8e9d83", "#b6b99c", "#d5d1b6", "#e9e3ce", "#fff5df"];
    let width = 1;
    let height = 1;
    let material = makeMaterial(2800);
    let frame = 0;
    let visible = false;
    let disposed = false;
    let displayed = progress.get();
    let pointerX = 0;
    let pointerY = 0;
    let lastFrame = 0;

    const draw = (p: number) => {
      ctx.clearRect(0, 0, width, height);
      const gather = ease(0.02, 0.35, p);
      const unite = ease(0.38, 0.72, p);
      const release = ease(0.77, 1, p);
      const scale = Math.min(width, height * 1.22);
      const cx = width * 0.51 + pointerX * 5;
      const cy = height * 0.50 + pointerY * 4;
      const rotation = -0.28 + p * 0.5;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      // Fine, broken strata: a worked surface, with no glow or neon strokes.
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = palette[2];
      ctx.globalAlpha = (0.025 + gather * 0.045) * (1 - release);
      for (let layer = 0; layer < 18; layer++) {
        const r = 0.19 + layer * 0.009;
        ctx.beginPath();
        for (let j = 0; j <= 100; j++) {
          const a = j / 100 * TAU;
          const fold = Math.sin(a * 3 + p * 4 + layer * 0.11) * (0.024 - unite * 0.015);
          const x = Math.cos(a) * (r + fold) * 1.19;
          const y = Math.sin(a) * (r + fold) * (0.63 + unite * 0.14);
          const px = cx + (x * cos - y * sin) * scale;
          const py = cy + (x * sin + y * cos) * scale;
          if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Bucket by colour to keep canvas state changes bounded on mobile.
      for (let shade = 0; shade < palette.length; shade++) {
        ctx.fillStyle = palette[shade];
        ctx.globalAlpha = (0.38 + shade * 0.11) * (1 - release * 0.95);
        for (const grain of material) {
          if (grain.shade !== shade) continue;
          const { angle: a, radius: r } = grain;
          const scatteredX = (grain.spreadX - 0.5) * 1.22;
          const scatteredY = (grain.spreadY - 0.5) * 0.58 + Math.sin(scatteredX * 5) * 0.10;
          const ripple = Math.sin(a * 3 + p * 5) * 0.035 + Math.sin(a * 7) * 0.012;
          const split = (1 - unite) * 0.085 * (Math.cos(a) > 0 ? 1 : -1);
          const foldedX = Math.cos(a) * r * (0.32 + ripple) + split;
          const foldedY = Math.sin(a) * r * (0.19 + ripple) + Math.sin(a * 2 + p * 7) * 0.035 * (1 - unite);
          const x = mix(scatteredX, foldedX, gather);
          const y = mix(scatteredY, foldedY, gather);
          const z = Math.sqrt(1 - r * r);
          const size = grain.size * (0.6 + z * 0.6) * Math.min(1.25, scale / 520);
          const px = cx + (x * cos - y * sin) * scale;
          const py = cy + (x * sin + y * cos) * scale;
          ctx.fillRect(px, py, size, size * (0.72 + grain.spreadY * 0.55));
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden || reduced.matches) return;
      const dt = Math.min(48, now - lastFrame || 16);
      lastFrame = now;
      displayed = mix(displayed, progress.get(), 1 - Math.exp(-dt / 95));
      draw(displayed);
      if (Math.abs(displayed - progress.get()) > 0.00025) schedule();
    };
    const schedule = () => {
      if (!frame && !disposed && visible && !document.hidden && !reduced.matches) {
        frame = requestAnimationFrame(tick);
      }
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, width < 640 ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      material = makeMaterial(width < 640 ? 2800 : 5600);
      schedule();
    };
    const pointer = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      const rect = canvas.getBoundingClientRect();
      pointerX = clamp((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = clamp((event.clientY - rect.top) / rect.height) * 2 - 1;
      schedule();
    };
    const resetPointer = () => { pointerX = 0; pointerY = 0; schedule(); };
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    };
    const motionPreference = () => {
      if (reduced.matches) { cancelAnimationFrame(frame); frame = 0; ctx.clearRect(0, 0, width, height); }
      else schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule(); else { cancelAnimationFrame(frame); frame = 0; }
    });
    observer.observe(canvas);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const unsubscribe = progress.on("change", schedule);
    const surface = canvas.parentElement;
    surface?.addEventListener("pointermove", pointer);
    surface?.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", motionPreference);
    resize();
    readyRef.current?.();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      unsubscribe();
      observer.disconnect();
      resizeObserver.disconnect();
      surface?.removeEventListener("pointermove", pointer);
      surface?.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", motionPreference);
    };
  }, [progress, tone]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
