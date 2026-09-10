"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type Piece = {
  id: string;
  kind: "bufala" | "pomodoro" | "basilico";
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
  index: number;
};

type Prepared = {
  base: string;
  pieces: Piece[];
  width: number;
  height: number;
};

export type RealPhotoPizzaExplodeProps = {
  image: string;
  eyebrow: string;
  title: string;
  lead: string;
  body: string;
  closing: string;
  notes: Array<{ label: string; detail: string }>;
};

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max] as const;
}

function dilate(mask: Uint8Array, w: number, h: number, iterations = 1) {
  let src = mask;
  for (let it = 0; it < iterations; it++) {
    const out = new Uint8Array(src);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (src[i]) continue;
        if (src[i - 1] || src[i + 1] || src[i - w] || src[i + w]) out[i] = 1;
      }
    }
    src = out;
  }
  return src;
}

function connectedComponents(mask: Uint8Array, w: number, h: number, minArea: number) {
  const seen = new Uint8Array(mask.length);
  const comps: number[][] = [];
  const dirs = [-1, 1, -w, w];

  for (let i = 0; i < mask.length; i++) {
    if (!mask[i] || seen[i]) continue;
    const q = [i];
    seen[i] = 1;
    const comp: number[] = [];
    for (let p = 0; p < q.length; p++) {
      const cur = q[p];
      comp.push(cur);
      const x = cur % w;
      for (const d of dirs) {
        const n = cur + d;
        if (n < 0 || n >= mask.length) continue;
        if ((d === -1 && x === 0) || (d === 1 && x === w - 1)) continue;
        if (mask[n] && !seen[n]) { seen[n] = 1; q.push(n); }
      }
    }
    if (comp.length >= minArea) comps.push(comp);
  }
  return comps.sort((a, b) => b.length - a.length);
}

function makePieceCanvas(
  source: ImageData,
  comp: number[],
  w: number,
  kind: Piece["kind"],
  index: number,
): Piece {
  let minX = w, minY = source.height, maxX = 0, maxY = 0;
  const set = new Set(comp);
  for (const i of comp) {
    const x = i % w, y = Math.floor(i / w);
    minX = Math.min(minX, x); minY = Math.min(minY, y);
    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  const pad = 5;
  minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(source.height - 1, maxY + pad);
  const cw = maxX - minX + 1, ch = maxY - minY + 1;
  const c = document.createElement("canvas");
  c.width = cw; c.height = ch;
  const ctx = c.getContext("2d")!;
  const out = ctx.createImageData(cw, ch);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const si = y * w + x;
      if (!set.has(si)) continue;
      const src = si * 4;
      const dst = ((y - minY) * cw + (x - minX)) * 4;
      out.data[dst] = source.data[src];
      out.data[dst + 1] = source.data[src + 1];
      out.data[dst + 2] = source.data[src + 2];
      out.data[dst + 3] = source.data[src + 3];
    }
  }
  ctx.putImageData(out, 0, 0);
  return {
    id: `${kind}-${index}`,
    kind,
    src: c.toDataURL("image/png"),
    left: minX / w,
    top: minY / source.height,
    width: cw / w,
    height: ch / source.height,
    cx: ((minX + maxX) / 2) / w,
    cy: ((minY + maxY) / 2) / source.height,
    index,
  };
}

function inpaint(source: ImageData, removeMask: Uint8Array, w: number, h: number) {
  const data = new Uint8ClampedArray(source.data);
  let unresolved = new Uint8Array(removeMask);
  const maxPasses = 42;

  for (let pass = 0; pass < maxPasses; pass++) {
    const next = new Uint8Array(unresolved);
    let changed = 0;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (!unresolved[i]) continue;
        const neigh = [i - 1, i + 1, i - w, i + w, i - w - 1, i - w + 1, i + w - 1, i + w + 1];
        let rr = 0, gg = 0, bb = 0, count = 0;
        for (const n of neigh) {
          if (unresolved[n]) continue;
          const p = n * 4;
          rr += data[p]; gg += data[p + 1]; bb += data[p + 2]; count++;
        }
        if (count >= 2) {
          const p = i * 4;
          data[p] = rr / count; data[p + 1] = gg / count; data[p + 2] = bb / count; data[p + 3] = 255;
          next[i] = 0; changed++;
        }
      }
    }
    unresolved = next;
    if (!changed) break;
  }

  // soften repaired regions so they read as sauce/under-surface instead of hard holes
  const copy = new Uint8ClampedArray(data);
  for (let y = 2; y < h - 2; y++) {
    for (let x = 2; x < w - 2; x++) {
      const i = y * w + x;
      if (!removeMask[i]) continue;
      let rr = 0, gg = 0, bb = 0, n = 0;
      for (let yy = -2; yy <= 2; yy++) for (let xx = -2; xx <= 2; xx++) {
        const p = ((y + yy) * w + (x + xx)) * 4;
        rr += copy[p]; gg += copy[p + 1]; bb += copy[p + 2]; n++;
      }
      const p = i * 4;
      data[p] = rr / n; data[p + 1] = gg / n; data[p + 2] = bb / n;
    }
  }
  return new ImageData(data, w, h);
}

async function preparePhoto(src: string): Promise<Prepared> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Impossibile caricare la foto della pizza"));
    img.src = src;
  });

  const maxW = 760;
  const scale = Math.min(1, maxW / img.naturalWidth);
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  const source = ctx.getImageData(0, 0, w, h);

  const cheese = new Uint8Array(w * h);
  const tomato = new Uint8Array(w * h);
  const basil = new Uint8Array(w * h);

  // Limit semantic extraction to the central pizza surface: this protects plate/table/background.
  const cx = w * 0.5, cy = h * 0.49;
  const rx = w * 0.39, ry = h * 0.40;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ellipse = ((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2);
      if (ellipse > 1) continue;
      const i = y * w + x, p = i * 4;
      const r = source.data[p], g = source.data[p + 1], b = source.data[p + 2];
      const [hh, s, v] = rgbToHsv(r, g, b);

      // Bufala: bright, low saturation, neutral-warm whites. Crust is excluded by saturation/value relationship.
      if (v > 0.66 && s < 0.30 && r > 155 && g > 145 && b > 125) cheese[i] = 1;
      // Confit tomato: saturated warm reds/oranges, but only bright enough to avoid dark baked spots.
      if (((hh < 28 || hh > 345) && s > 0.46 && v > 0.38 && r > g * 1.20)) tomato[i] = 1;
      // Basil: green hue with enough chroma; excludes neutral shadows.
      if (hh > 55 && hh < 155 && s > 0.26 && g > r * 0.88 && g > b * 1.05 && v > 0.20) basil[i] = 1;
    }
  }

  const cm = dilate(cheese, w, h, 2);
  const tm = dilate(tomato, w, h, 1);
  const bm = dilate(basil, w, h, 1);
  const minArea = Math.max(18, Math.round((w * h) * 0.00012));
  const cheeseComps = connectedComponents(cm, w, h, minArea).slice(0, 9);
  const tomatoComps = connectedComponents(tm, w, h, minArea).slice(0, 10);
  const basilComps = connectedComponents(bm, w, h, Math.max(8, minArea / 3)).slice(0, 10);

  const pieces: Piece[] = [
    ...cheeseComps.map((comp, i) => makePieceCanvas(source, comp, w, "bufala", i)),
    ...tomatoComps.map((comp, i) => makePieceCanvas(source, comp, w, "pomodoro", i)),
    ...basilComps.map((comp, i) => makePieceCanvas(source, comp, w, "basilico", i)),
  ];

  const remove = new Uint8Array(w * h);
  for (const comp of [...cheeseComps, ...tomatoComps, ...basilComps]) for (const i of comp) remove[i] = 1;
  const expandedRemove = dilate(remove, w, h, 3);
  const repaired = inpaint(source, expandedRemove, w, h);
  ctx.putImageData(repaired, 0, 0);

  return { base: c.toDataURL("image/jpeg", 0.94), pieces, width: w, height: h };
}

export default function RealPhotoPizzaExplode({ image, eyebrow, title, lead, body, closing, notes }: RealPhotoPizzaExplodeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [failed, setFailed] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const explode = useTransform(scrollYProgress, [0.22, 0.42, 0.72, 0.90], [0, 0.15, 1, 0.84]);
  const camera = useTransform(scrollYProgress, [0.15, 0.55, 0.92], [8, 2, -4]);

  useEffect(() => {
    let alive = true;
    preparePhoto(image).then((v) => alive && setPrepared(v)).catch(() => alive && setFailed(true));
    return () => { alive = false; };
  }, [image]);

  const bg = useMemo(() => "radial-gradient(circle at 62% 48%, rgba(201,139,70,.16), transparent 28%), radial-gradient(circle at 20% 25%, rgba(88,42,18,.18), transparent 25%), #050403", []);

  return (
    <section ref={sectionRef} className="relative min-h-[190vh] bg-[#050403] text-white" style={{ background: bg }}>
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <div className="mx-auto grid min-h-screen max-w-[1550px] items-center gap-8 px-5 py-24 md:px-10 lg:grid-cols-[.72fr_1.28fr] lg:px-14">
          <div className="relative z-20 max-w-xl">
            <div className="flex items-center gap-3"><span className="h-px w-10 bg-gold/70"/><span className="text-[10px] uppercase tracking-[.34em] text-gold">{eyebrow}</span></div>
            <h2 className="mt-7 text-[clamp(3.4rem,7vw,7.5rem)] font-light leading-[.86] tracking-[-.055em]">{title}</h2>
            <p className="mt-7 text-xl font-light text-white/82 md:text-2xl">{lead}</p>
            <p className="mt-5 max-w-lg text-sm font-light leading-7 text-white/52 md:text-base">{body}</p>
            <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5">
              {notes.slice(0,5).map((n,i)=><div key={n.label} className="border-t border-white/10 pt-3"><span className="text-[9px] tracking-[.22em] text-gold/70">0{i+1}</span><div className="mt-1 text-[11px] uppercase tracking-[.12em] text-white/82">{n.label}</div><div className="mt-1 text-xs leading-5 text-white/38">{n.detail}</div></div>)}
            </div>
            <p className="mt-10 max-w-md border-l border-gold/30 pl-4 text-sm italic leading-6 text-white/52">{closing}</p>
          </div>

          <div className="relative h-[58vh] min-h-[430px] md:h-[72vh] lg:h-[82vh]" onPointerMove={(e)=>{const r=e.currentTarget.getBoundingClientRect();setPointer({x:(e.clientX-r.left)/r.width*2-1,y:(e.clientY-r.top)/r.height*2-1})}} onPointerLeave={()=>setPointer({x:0,y:0})}>
            <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1450px" }}>
              {!prepared && !failed && <div className="text-[10px] uppercase tracking-[.3em] text-white/30">Preparazione della materia…</div>}
              {failed && <img src={image} alt="A Bufalina" className="max-h-full max-w-full object-contain"/>}
              {prepared && <motion.div className="relative w-[min(94%,920px)]" style={{ aspectRatio: `${prepared.width}/${prepared.height}`, rotateX: reduced ? 0 : camera, rotateY: reduced ? 0 : pointer.x * 6, transformStyle: "preserve-3d" }}>
                <img src={prepared.base} alt="Base reale A Bufalina privata degli ingredienti sollevati" className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,.58)]"/>
                {prepared.pieces.map((piece) => {
                  const dx = piece.cx - .5, dy = piece.cy - .5;
                  const radial = piece.kind === "pomodoro" ? 130 : piece.kind === "bufala" ? 54 : 95;
                  const lift = piece.kind === "bufala" ? -110 : piece.kind === "pomodoro" ? -165 : -235;
                  const z = piece.kind === "bufala" ? 90 : piece.kind === "pomodoro" ? 155 : 220;
                  const delay = piece.kind === "bufala" ? .04 * piece.index : piece.kind === "pomodoro" ? .05 * piece.index + .12 : .07 * piece.index + .24;
                  const x = useTransform(explode, v => reduced ? 0 : dx * radial * v + (piece.kind === "pomodoro" ? Math.sign(dx || 1) * 22 * v : 0));
                  const y = useTransform(explode, v => reduced ? 0 : (lift + dy * 42) * Math.max(0, v - delay));
                  const zz = useTransform(explode, v => reduced ? 0 : z * Math.max(0, v - delay));
                  const rz = useTransform(explode, v => reduced ? 0 : (dx * 10 + (piece.index%2?2:-2)) * Math.max(0, v - delay));
                  return <motion.img key={piece.id} src={piece.src} alt="" className="absolute origin-center drop-shadow-[0_18px_16px_rgba(0,0,0,.38)]" style={{left:`${piece.left*100}%`,top:`${piece.top*100}%`,width:`${piece.width*100}%`,height:`${piece.height*100}%`,x,y,z:zz,rotateZ:rz,transformStyle:"preserve-3d"}}/>;
                })}
                <motion.div className="pointer-events-none absolute left-[12%] right-[12%] top-[79%] h-[10%] rounded-[50%] bg-black/50 blur-2xl" style={{scale:useTransform(explode,[0,1],[.8,1.15]),opacity:useTransform(explode,[0,1],[.35,.12])}}/>
              </motion.div>}
            </div>
            <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-center"><div className="mx-auto h-9 w-px bg-gradient-to-b from-gold/70 to-transparent"/><span className="mt-2 block text-[9px] uppercase tracking-[.28em] text-white/30">Scorri · la pizza si smonta davvero</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
