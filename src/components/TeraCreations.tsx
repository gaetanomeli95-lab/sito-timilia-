"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Creation = {
  src: string;
  aspect: string;
};

const creations: Creation[] = [
  { src: "/images/tera-creazioni/creazione-1.png", aspect: "aspect-[4/3]" },
  { src: "/images/tera-creazioni/creazione-2.png", aspect: "aspect-[4/3]" },
  { src: "/images/tera-creazioni/creazione-3.png", aspect: "aspect-[3/4]" },
  { src: "/images/tera-creazioni/creazione-4.png", aspect: "aspect-[4/3]" },
  { src: "/images/tera-creazioni/creazione-5.png", aspect: "aspect-[4/3]" },
  { src: "/images/tera-creazioni/creazione-6.png", aspect: "aspect-[4/3]" },
  { src: "/images/tera-creazioni/creazione-7.png", aspect: "aspect-[4/3]" },
  { src: "/images/tera-creazioni/creazione-8.png", aspect: "aspect-[3/4]" },
  { src: "/images/tera-creazioni/creazione-9.png", aspect: "aspect-[4/3]" },
  { src: "/images/tera-creazioni/creazione-10.png", aspect: "aspect-[4/5]" },
  { src: "/images/tera-creazioni/creazione-11.png", aspect: "aspect-[3/2]" },
  { src: "/images/tera-creazioni/creazione-12.png", aspect: "aspect-[3/2]" },
  { src: "/images/tera-creazioni/creazione-13.png", aspect: "aspect-[5/4]" },
  { src: "/images/tera-creazioni/creazione-14.png", aspect: "aspect-[4/3]" },
];

/* Tre colonne che respirano a velocità diverse durante lo scroll */
const columns = [
  [0, 2, 4, 10, 6],
  [1, 7, 3, 11],
  [5, 8, 13, 9, 12],
];

/* ------------------------------------------------------------------ */
/* Tessera della galleria: rivelazione morbida + zoom al passaggio     */
/* ------------------------------------------------------------------ */
function GalleryTile({
  idx,
  delay,
  onSelect,
}: {
  idx: number;
  delay: number;
  onSelect: (index: number) => void;
}) {
  const c = creations[idx];
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(idx)}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-black/25 shadow-[0_18px_60px_rgba(0,0,0,0.3)] outline-none transition-[transform,border-color] duration-500 hover:scale-[1.02] hover:border-white/30 focus-visible:ring-2 focus-visible:ring-white/60 ${c.aspect}`}
    >
      <Image
        src={c.src}
        alt={`Creazione TERA senza glutine ${idx + 1}`}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 46vw, 30vw"
        quality={74}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-0" />
      <div className="absolute inset-0 flex items-end justify-start p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
          Guarda da vicino
        </span>
      </div>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Colonna con deriva parallasse propria                               */
/* ------------------------------------------------------------------ */
function GalleryColumn({
  indices,
  y,
  colIndex,
  onSelect,
}: {
  indices: number[];
  y?: MotionValue<number>;
  colIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <motion.div style={y ? { y } : undefined} className="flex flex-col gap-4 md:gap-6">
      {indices.map((idx, i) => (
        <GalleryTile
          key={idx}
          idx={idx}
          delay={colIndex * 0.08 + i * 0.06}
          onSelect={onSelect}
        />
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Lightbox a schermo intero con navigazione da tastiera               */
/* ------------------------------------------------------------------ */
function Lightbox({
  index,
  onClose,
  onNavigate,
}: {
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        onNavigate((index + 1) % creations.length);
      if (e.key === "ArrowLeft")
        onNavigate((index - 1 + creations.length) % creations.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, onClose, onNavigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Galleria creazioni TERA"
    >
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-[70svh] w-[88vw] max-w-5xl md:h-[78svh] md:w-[92vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={creations[index].src}
          alt={`Creazione TERA senza glutine ${index + 1}`}
          fill
          className="object-contain"
          sizes="92vw"
          quality={90}
          priority
        />
      </motion.div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Chiudi galleria"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + creations.length) % creations.length);
        }}
        aria-label="Creazione precedente"
        className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black md:left-8 md:h-12 md:w-12"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % creations.length);
        }}
        aria-label="Creazione successiva"
        className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black md:right-8 md:h-12 md:w-12"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-light tracking-[0.3em] text-white/70">
        {index + 1} / {creations.length}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Creazioni con TERA                                                  */
/* ------------------------------------------------------------------ */
export default function TeraCreations() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<number | null>(null);

  /* Le colonne derivano a velocità diverse mentre la galleria attraversa il viewport */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yLeft = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yCenter = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const yRight = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const handleSelect = useCallback((idx: number) => setSelected(idx), []);
  const handleClose = useCallback(() => setSelected(null), []);
  const handleNavigate = useCallback((next: number) => setSelected(next), []);

  return (
    <div ref={ref} className="relative py-4">
      {/* Intestazione */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center"
        >
          <span className="mb-4 block text-xs font-medium uppercase tracking-[0.34em] text-white/60">
            Dal laboratorio senza glutine
          </span>
          <h3 className="text-3xl font-light tracking-[0.03em] text-white md:text-5xl">
            Creazioni con{" "}
            <span className="font-serif italic text-white/90">TERA</span>
          </h3>
          <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed text-white/60 md:text-base">
            Ogni creazione nasce dal nostro blend e da sette anni di ricerca.
            Avvicinati: il senza glutine non è mai stato così.
          </p>
        </motion.div>
      </div>

      {/* Mosaico: tre colonne che respirano a velocità diverse */}
      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 md:mt-16 lg:px-8">
        {/* Mobile: due colonne semplici, senza parallasse */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          <GalleryColumn
            indices={[...columns[0], ...columns[1].slice(0, 2)]}
            colIndex={0}
            onSelect={handleSelect}
          />
          <GalleryColumn
            indices={[...columns[2], ...columns[1].slice(2)]}
            colIndex={1}
            onSelect={handleSelect}
          />
        </div>
        {/* Desktop: tre colonne con deriva parallasse */}
        <div className="hidden grid-cols-3 items-start gap-6 md:grid">
          <GalleryColumn
            indices={columns[0]}
            y={reduce ? undefined : yLeft}
            colIndex={0}
            onSelect={handleSelect}
          />
          <GalleryColumn
            indices={columns[1]}
            y={reduce ? undefined : yCenter}
            colIndex={1}
            onSelect={handleSelect}
          />
          <GalleryColumn
            indices={columns[2]}
            y={reduce ? undefined : yRight}
            colIndex={2}
            onSelect={handleSelect}
          />
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <Lightbox
            index={selected}
            onClose={handleClose}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
