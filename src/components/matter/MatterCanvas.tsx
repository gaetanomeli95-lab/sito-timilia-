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
const ease = (start: number, end: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};

function makeMaterial(count: number) {
  let seed = 8191;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const buckets = Array.from({ length: 5 }, () => [] as {
    sx: number; sy: number; fx: number; fy: number;
    ux: number; uy: number; bend: number; size: number;
  }[]);
  for (let i = 0; i < count; i++) {
    const a = random() * TAU;
    const r = Math.sqrt(random());
    const x = random() - 0.5;
    const y = random() - 0.5;
    const c = Math.cos(a), s = Math.sin(a);
    const shade = Math.floor(random() * 5);
    // All per-grain trigonometry happens once. The frame loop only interpolates
    // three worked surfaces, in colour buckets with no repeated array scans.
    buckets[shade].push({
      sx: x * 1.18,
      sy: Math.sin(x * 5) * 0.13 + y * 0.25,
      fx: c * r * 0.30 + (c > 0 ? 0.075 : -0.075),
      fy: s * r * 0.18 + Math.sin(a * 2) * 0.04,
      ux: c * r * (0.34 + Math.cos(a * 3) * 0.014),
      uy: s * r * (0.22 + Math.sin(a * 5) * 0.012),
      bend: Math.sin(a * 3) * r,
      size: (0.45 + random() * 1.0) * (0.65 + Math.sqrt(1 - r * r) * 0.5),
    });
  }
  return buckets;
}
const contour = Array.from({ length: 49 }, (_, i) => {
  const a = i / 48 * TAU;
  return { x: Math.cos(a), y: Math.sin(a), fold: Math.sin(a * 3) };
});

/** Shares the already-smoothed timeline with photos; no second easing clock. */
export default function MatterCanvas({ progress, tone = "mineral", className, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const palette = tone === "warm"
      ? ["#ac8661", "#c7a27b", "#dfc6a5", "#f0dfc5", "#fff4df"]
      : ["#8e9d83", "#b6b99c", "#d5d1b6", "#e9e3ce", "#fff5df"];
    let width = 1, height = 1;
    let material = makeMaterial(1100);
    let visible = false;
    let frame = 0;
    let disposed = false;

    const draw = () => {
      if (disposed || !visible || document.hidden || reduced.matches) return;
      const p = Math.min(1, Math.max(0, progress.get()));
      const gather = ease(0.01, 0.36, p);
      const unite = ease(0.38, 0.73, p);
      const release = 1 - ease(0.76, 1, p);
      const scale = Math.min(width, height * 1.22);
      const cx = width * 0.51, cy = height * 0.50;
      const rotation = -0.25 + p * 0.48;
      const cos = Math.cos(rotation), sin = Math.sin(rotation);
      const bend = Math.sin(p * TAU) * 0.014 * gather * (1 - unite);
      const sizeScale = Math.min(1.2, scale / 460);
      ctx.clearRect(0, 0, width, height);
      if (release < 0.001) return;

      ctx.strokeStyle = palette[2];
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.045 * gather * release;
      ctx.beginPath();
      for (let layer = 0; layer < 8; layer++) {
        const r = 0.18 + layer * 0.017;
        contour.forEach((point, index) => {
          const fold = point.fold * 0.023 * (1 - unite);
          const x = point.x * (r + fold) * 1.13;
          const y = point.y * (r + fold) * 0.72;
          const px = cx + (x * cos - y * sin) * scale;
          const py = cy + (x * sin + y * cos) * scale;
          if (index === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
      }
      ctx.stroke();
      for (let shade = 0; shade < material.length; shade++) {
        ctx.fillStyle = palette[shade];
        ctx.globalAlpha = (0.40 + shade * 0.10) * release;
        for (const grain of material[shade]) {
          const x = grain.sx + (grain.fx - grain.sx) * gather + (grain.ux - grain.fx) * unite;
          const y = grain.sy + (grain.fy - grain.sy) * gather + (grain.uy - grain.fy) * unite + grain.bend * bend;
          const size = grain.size * sizeScale;
          ctx.fillRect(cx + (x * cos - y * sin) * scale, cy + (x * sin + y * cos) * scale, size, size * 0.8);
        }
      }
      ctx.globalAlpha = 1;
    };
    // Progress is emitted from Motion's frame loop. Draw within that same frame,
    // rather than queueing an extra rAF and lagging a frame behind the images.
    const unsubscribe = progress.on("change", draw);
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; draw(); });
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (bounds.width < 1 || bounds.height < 1) return;
      width = bounds.width; height = bounds.height;
      const mobile = width < 640;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.4);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      material = makeMaterial(mobile ? 1100 : 1900);
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", schedule);
    resize();
    readyRef.current?.();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      unsubscribe();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, [progress, tone]);
  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
