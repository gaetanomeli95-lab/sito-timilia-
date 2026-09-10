"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Kind = "bufala" | "pomodoro" | "basilico";
type Piece = {
  id: string;
  kind: Kind;
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
  index: number;
};
type Prepared = { base: string; pieces: Piece[]; width: number; height: number };

export type RealPhotoPizzaExplodeV2Props = {
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
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, mx === 0 ? 0 : d / mx, mx] as const;
}

function dilate(mask: Uint8Array, w: number, h: number, amount = 1) {
  let src = mask;
  for (let pass = 0; pass < amount; pass += 1) {
    const out = new Uint8Array(src);
    for (let y = 1; y < h - 1; y += 1) {
      for (let x = 1; x < w - 1; x += 1) {
        const i = y * w + x;
        if (!src[i] && (src[i - 1] || src[i + 1] || src[i - w] || src[i + w])) out[i] = 1;
      }
    }
    src = out;
  }
  return src;
}

function connectedComponents(mask: Uint8Array, w: number, minArea: number) {
  const seen = new Uint8Array(mask.length);
  const out: number[][] = [];
  for (let i = 0; i < mask.length; i += 1) {
    if (!mask[i] || seen[i]) continue;
    const queue = [i];
    const component: number[] = [];
    seen[i] = 1;
    for (let q = 0; q < queue.length; q += 1) {
      const cur = queue[q];
      const x = cur % w;
      component.push(cur);
      for (const delta of [-1, 1, -w, w]) {
        const next = cur + delta;
        if (next < 0 || next >= mask.length) continue;
        if ((delta === -1 && x === 0) || (delta === 1 && x === w - 1)) continue;
        if (mask[next] && !seen[next]) {
          seen[next] = 1;
          queue.push(next);
        }
      }
    }
    if (component.length >= minArea) out.push(component);
  }
  return out.sort((a, b) => b.length - a.length);
}

function makePiece(source: ImageData, component: number[], w: number, kind: Kind, index: number): Piece {
  let minX = w;
  let minY = source.height;
  let maxX = 0;
  let maxY = 0;
  const selected = new Set(component);
  for (const i of component) {
    const x = i % w;
    const y = Math.floor(i / w);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const pad = 5;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad);
  maxY = Math.min(source.height - 1, maxY + pad);
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d")!;
  const out = ctx.createImageData(cw, ch);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const srcIndex = y * w + x;
      if (!selected.has(srcIndex)) continue;
      const sourcePixel = srcIndex * 4;
      const targetPixel = ((y - minY) * cw + x - minX) * 4;
      out.data[targetPixel] = source.data[sourcePixel];
      out.data[targetPixel + 1] = source.data[sourcePixel + 1];
      out.data[targetPixel + 2] = source.data[sourcePixel + 2];
      out.data[targetPixel + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);

  return {
    id: `${kind}-${index}`,
    kind,
    index,
    src: canvas.toDataURL("image/png"),
    left: minX / w,
    top: minY / source.height,
    width: cw / w,
    height: ch / source.height,
    cx: (minX + maxX) / 2 / w,
    cy: (minY + maxY) / 2 / source.height,
  };
}

function inpaint(source: ImageData, mask: Uint8Array, w: number, h: number) {
  const pixels = new Uint8ClampedArray(source.data);
  let unresolved = new Uint8Array(mask);

  for (let pass = 0; pass < 60; pass += 1) {
    const next = new Uint8Array(unresolved);
    let changed = 0;
    for (let y = 1; y < h - 1; y += 1) {
      for (let x = 1; x < w - 1; x += 1) {
        const i = y * w + x;
        if (!unresolved[i]) continue;
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (const n of [i - 1, i + 1, i - w, i + w, i - w - 1, i - w + 1, i + w - 1, i + w + 1]) {
          if (unresolved[n]) continue;
          const p = n * 4;
          r += pixels[p];
          g += pixels[p + 1];
          b += pixels[p + 2];
          count += 1;
        }
        if (count >= 2) {
          const p = i * 4;
          pixels[p] = r / count;
          pixels[p + 1] = g / count;
          pixels[p + 2] = b / count;
          pixels[p + 3] = 255;
          next[i] = 0;
          changed += 1;
        }
      }
    }
    unresolved = next;
    if (!changed) break;
  }

  return new ImageData(pixels, w, h);
}

async function prepare(src: string): Promise<Prepared> {
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("load"));
    image.src = src;
  });

  const scale = Math.min(1, 820 / image.naturalWidth);
  const w = Math.round(image.naturalWidth * scale);
  const h = Math.round(image.naturalHeight * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(image, 0, 0, w, h);
  const source = ctx.getImageData(0, 0, w, h);

  const bufala = new Uint8Array(w * h);
  const tomato = new Uint8Array(w * h);
  const basil = new Uint8Array(w * h);
  const cx = w * 0.5;
  const cy = h * 0.49;
  const rx = w * 0.37;
  const ry = h * 0.39;

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const ellipse = ((x - cx) ** 2) / rx ** 2 + ((y - cy) ** 2) / ry ** 2;
      if (ellipse > 1) continue;
      const i = y * w + x;
      const p = i * 4;
      const r = source.data[p];
      const g = source.data[p + 1];
      const b = source.data[p + 2];
      const [hue, saturation, value] = rgbToHsv(r, g, b);

      if (value > 0.72 && saturation < 0.23 && r > 178 && g > 170 && b > 150) bufala[i] = 1;
      if ((hue < 22 || hue > 352) && saturation > 0.56 && value > 0.46 && r > g * 1.28 && r > b * 1.22) tomato[i] = 1;
      if (hue > 64 && hue < 145 && saturation > 0.34 && g > r * 0.94 && g > b * 1.12 && value > 0.23) basil[i] = 1;
    }
  }

  const bufalaMask = dilate(bufala, w, h, 2);
  const tomatoMask = dilate(tomato, w, h, 1);
  const basilMask = dilate(basil, w, h, 1);
  const minArea = Math.max(22, Math.round(w * h * 0.00013));

  const bufalaParts = connectedComponents(bufalaMask, w, minArea).slice(0, 7);
  const tomatoParts = connectedComponents(tomatoMask, w, minArea).slice(0, 9);
  const basilParts = connectedComponents(basilMask, w, Math.max(9, Math.round(minArea * 0.35))).slice(0, 8);

  const pieces = [
    ...bufalaParts.map((part, i) => makePiece(source, part, w, "bufala", i)),
    ...tomatoParts.map((part, i) => makePiece(source, part, w, "pomodoro", i)),
    ...basilParts.map((part, i) => makePiece(source, part, w, "basilico", i)),
  ];

  const removal = new Uint8Array(w * h);
  for (const part of [...bufalaParts, ...tomatoParts, ...basilParts]) {
    for (const i of part) removal[i] = 1;
  }
  const repaired = inpaint(source, dilate(removal, w, h, 4), w, h);
  ctx.putImageData(repaired, 0, 0);

  return { base: canvas.toDataURL("image/jpeg", 0.95), pieces, width: w, height: h };
}

function targetFor(piece: Piece) {
  const dx = piece.cx - 0.5;
  const dy = piece.cy - 0.5;
  if (piece.kind === "bufala") {
    return {
      x: dx * 70,
      y: -92 + dy * 34,
      z: 110,
      rotateZ: dx * 8 + (piece.index % 2 ? 2 : -2),
      rotateX: piece.index % 2 ? 4 : -4,
      scale: 1.03,
      delay: piece.index * 0.055,
    };
  }
  if (piece.kind === "pomodoro") {
    return {
      x: dx * 220 + Math.sign(dx || 1) * 45,
      y: -155 + dy * 56,
      z: 190,
      rotateZ: dx * 14 + (piece.index % 2 ? 5 : -5),
      rotateX: piece.index % 2 ? 10 : -10,
      scale: 1.06,
      delay: 0.12 + piece.index * 0.05,
    };
  }
  return {
    x: dx * 145,
    y: -225 + dy * 70,
    z: 270,
    rotateZ: dx * 18 + (piece.index % 2 ? 10 : -10),
    rotateX: piece.index % 2 ? 16 : -16,
    scale: 1.08,
    delay: 0.28 + piece.index * 0.06,
  };
}

function IngredientPiece({ piece, exploded }: { piece: Piece; exploded: boolean }) {
  const target = targetFor(piece);
  const transition = `transform 950ms cubic-bezier(.16,1,.3,1) ${target.delay}s, filter 700ms ease ${target.delay}s, opacity 300ms ease ${target.delay}s`;
  const transform = exploded
    ? `translate3d(${target.x}px, ${target.y}px, ${target.z}px) rotateZ(${target.rotateZ}deg) rotateX(${target.rotateX}deg) scale(${target.scale})`
    : "translate3d(0px,0px,0px) rotateZ(0deg) rotateX(0deg) scale(1)";

  return (
    <div
      className="absolute origin-center"
      style={{
        left: `${piece.left * 100}%`,
        top: `${piece.top * 100}%`,
        width: `${piece.width * 100}%`,
        height: `${piece.height * 100}%`,
        transform,
        transformStyle: "preserve-3d",
        transition,
        zIndex: piece.kind === "basilico" ? 30 : piece.kind === "pomodoro" ? 20 : 10,
      }}
    >
      {exploded && (
        <img
          src={piece.src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-contain opacity-30 blur-[1px]"
          style={{ transform: "translate3d(0,7px,-12px) scale(.99)", filter: "brightness(.28)" }}
        />
      )}
      <img
        src={piece.src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain"
        style={{
          filter: exploded
            ? "drop-shadow(0 22px 17px rgba(0,0,0,.5)) drop-shadow(0 3px 2px rgba(255,198,120,.08))"
            : "none",
        }}
      />
    </div>
  );
}

export default function RealPhotoPizzaExplodeV2({
  image,
  eyebrow,
  title,
  lead,
  body,
  closing,
  notes,
}: RealPhotoPizzaExplodeV2Props) {
  const reducedMotion = useReducedMotion();
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [failed, setFailed] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let alive = true;
    prepare(image)
      .then((value) => alive && setPrepared(value))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [image]);

  const background = useMemo(
    () =>
      "radial-gradient(circle at 67% 47%,rgba(206,143,72,.17),transparent 30%),radial-gradient(circle at 17% 23%,rgba(92,44,20,.16),transparent 26%),#050403",
    [],
  );

  const cameraX = reducedMotion ? 0 : -1.5 - pointer.y * 3.5;
  const cameraY = reducedMotion ? 0 : pointer.x * 6;
  const cameraScale = exploded ? 0.9 : 1;

  return (
    <section className="relative overflow-hidden text-white" style={{ background: background }}>
      <div className="mx-auto grid min-h-[100svh] max-w-[1580px] items-center gap-8 px-5 py-24 md:px-10 lg:grid-cols-[.68fr_1.32fr] lg:px-14">
        <div className="relative z-20 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold/70" />
            <span className="text-[10px] uppercase tracking-[.34em] text-gold">{eyebrow}</span>
          </div>
          <h2 className="mt-7 text-[clamp(3.5rem,7vw,7.8rem)] font-light leading-[.86] tracking-[-.055em]">{title}</h2>
          <p className="mt-7 text-xl font-light text-white/84 md:text-2xl">{lead}</p>
          <p className="mt-5 max-w-lg text-sm font-light leading-7 text-white/52 md:text-base">{body}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setExploded((value) => !value)}
              disabled={!prepared || failed}
              className="group relative overflow-hidden rounded-full border border-gold/35 bg-gold/10 px-6 py-3 text-[10px] font-medium uppercase tracking-[.24em] text-gold transition hover:bg-gold/18 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="relative z-10">{exploded ? "Ricompone la pizza" : "Apri la materia"}</span>
              <span className="absolute inset-y-0 left-0 w-0 bg-gold/10 transition-all duration-500 group-hover:w-full" />
            </button>
            <span className="text-[9px] uppercase tracking-[.22em] text-white/28">
              {exploded ? "Ingredienti reali · separati nello spazio" : "Foto reale · stato originale"}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={exploded ? "exploded-notes" : "intact-note"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mt-9"
            >
              {exploded ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {notes.slice(0, 5).map((note, index) => (
                    <div key={note.label} className="border-t border-white/10 pt-3">
                      <span className="text-[9px] tracking-[.22em] text-gold/70">0{index + 1}</span>
                      <div className="mt-1 text-[11px] uppercase tracking-[.12em] text-white/82">{note.label}</div>
                      <div className="mt-1 text-xs leading-5 text-white/38">{note.detail}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="max-w-sm text-xs font-light leading-6 text-white/34">Prima la guardi intera. Poi, solo se vuoi, la smonti.</p>
              )}
            </motion.div>
          </AnimatePresence>

          <p className="mt-9 max-w-md border-l border-gold/30 pl-4 text-sm italic leading-6 text-white/52">{closing}</p>
        </div>

        <div
          className="relative h-[60vh] min-h-[470px] md:h-[74vh] lg:h-[82vh]"
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setPointer({
              x: ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1,
              y: ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1,
            });
          }}
          onPointerLeave={() => setPointer({ x: 0, y: 0 })}
        >
          <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1600px" }}>
            {!prepared && !failed && (
              <div className="text-[10px] uppercase tracking-[.3em] text-white/30">Preparazione della materia…</div>
            )}

            {failed && <img src={image} alt="A Bufalina" className="max-h-full max-w-full object-contain" />}

            {prepared && (
              <div
                className="relative w-[min(96%,980px)] transition-transform duration-300 ease-out"
                style={{
                  aspectRatio: `${prepared.width}/${prepared.height}`,
                  transform: `rotateX(${cameraX}deg) rotateY(${cameraY}deg) scale(${cameraScale})`,
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="absolute left-[10%] right-[10%] top-[82%] h-[8%] rounded-[50%] bg-black/55 blur-3xl transition-all duration-700"
                  style={{ opacity: exploded ? 0.14 : 0.34, transform: `scale(${exploded ? 1.22 : 0.88})` }}
                />

                <img
                  src={prepared.base}
                  alt="Base della A Bufalina"
                  className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
                  style={{ opacity: exploded ? 1 : 0, filter: "drop-shadow(0 42px 65px rgba(0,0,0,.62))" }}
                />

                {prepared.pieces.map((piece) => (
                  <div
                    key={`piece-shell-${piece.id}`}
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: exploded ? 1 : 0 }}
                  >
                    <IngredientPiece piece={piece} exploded={exploded} />
                  </div>
                ))}

                <img
                  src={image}
                  alt="A Bufalina di Timilia"
                  className="absolute inset-0 h-full w-full object-contain transition-all duration-500"
                  style={{
                    opacity: exploded ? 0 : 1,
                    transform: exploded ? "translate3d(0,0,18px) scale(.992)" : "translate3d(0,0,24px) scale(1)",
                    filter: "drop-shadow(0 44px 70px rgba(0,0,0,.62))",
                  }}
                />

                {!exploded && (
                  <button
                    type="button"
                    onClick={() => setExploded(true)}
                    aria-label="Apri la pizza e separa gli ingredienti"
                    className="absolute inset-[12%] z-40 cursor-pointer rounded-[50%] bg-transparent"
                  />
                )}
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
            <span className="block text-[9px] uppercase tracking-[.28em] text-white/28">
              {exploded ? "Click sul pulsante per ricomporla" : "Click sulla pizza · apri la materia"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
