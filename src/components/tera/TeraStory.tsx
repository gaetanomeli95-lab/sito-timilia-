"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Grain from "@/components/tera/Grain";
import TeraMatterJourney from "@/components/tera/TeraMatterJourney";
import { useMatterTimeline } from "@/components/matter/useMatterTimeline";
import styles from "./TeraStory.module.css";
import {
  closing,
  hero,
  heroImages,
  origin,
  people,
  strip,
  type TeraPhoto,
} from "@/data/teraStoryData";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Palette TERA: dal logo verde salvia, con avorio, pietra e grigi caldi.
   Nelle classi Tailwind i valori sono scritti in chiaro:
   avorio #f4f1ea · inchiostro #262b25 · salvia profonda #5a6957 · foschia #c9d3c2 */
const IVORY = "#f4f1ea";
const MINERAL_DEEP = "#262e26";

/* ------------------------------------------------------------------ */
/* Primitive                                                           */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -8% 0px" }}
      transition={{ duration: reduce ? 0.5 : 1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Measure a stationary wrapper; only its photo layer moves. */
function Parallax({
  children,
  amount = 30,
  className = "",
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useMatterTimeline(scrollYProgress);
  const y = useTransform(progress, [0, 1], [amount, -amount]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className={styles.parallaxPhoto}>{children}</motion.div>
    </div>
  );
}

function Chapter({
  number,
  title,
  tone = "dark",
}: {
  number: string;
  title: string;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <Reveal className="flex items-center gap-4">
      <span
        className={`text-[11px] tabular-nums tracking-[0.2em] ${light ? `text-[#c9d3c2]` : `text-[#5a6957]`}`}
      >
        {number}
      </span>
      <span className={`h-px w-10 ${light ? "bg-white/30" : `bg-[#262b25]/20`}`} />
      <span
        className={`text-[10px] font-medium uppercase tracking-[0.34em] md:text-xs ${
          light ? `text-[#f4f1ea]/70` : `text-[#262b25]/60`
        }`}
      >
        {title}
      </span>
    </Reveal>
  );
}

function Prose({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={`text-[0.98rem] font-light leading-[1.85] md:text-lg ${
        tone === "light" ? `text-[#f4f1ea]/74` : `text-[#262b25]/78`
      } ${className}`}
    >
      {children}
    </p>
  );
}

function Photo({
  photo,
  className = "",
  imgClassName = "",
  sizes,
  fade = "edge-fade",
  priority = false,
}: {
  photo: TeraPhoto;
  className?: string;
  imgClassName?: string;
  sizes: string;
  fade?: "edge-fade" | "edge-fade-soft" | "edge-fade-wide" | "";
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${fade} ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority={priority}
        className={`object-cover ${imgClassName}`}
        sizes={sizes}
        quality={80}
      />
    </div>
  );
}

const container = "mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20";

/* ------------------------------------------------------------------ */
/* Hero — la parete salvia, la materia sul tavolo                      */
/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useMatterTimeline(scrollYProgress);
  const imgY = useTransform(progress, [0, 1], [0, 70]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-[#6c7152]">
      <motion.div style={reduce ? undefined : { y: imgY }} className={`${styles.heroImage} absolute inset-0`}>
          <Image
            src={heroImages.stillLife.src}
            alt={heroImages.stillLife.alt}
            fill
            priority
            className="object-cover object-[50%_74%] md:object-[50%_62%]"
            sizes="100vw"
            quality={84}
          />
      </motion.div>

      {/* Scrim per il testo: l'alto della parete si scurisce appena */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,34,27,0.66)_0%,rgba(28,34,27,0.40)_36%,transparent_64%)]" />
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(28,34,27,0.48)_0%,rgba(28,34,27,0.22)_38%,transparent_62%)] md:block" />
      {/* Il tavolo si scioglie nell'avorio della pagina */}
      <div
        className="absolute inset-x-0 bottom-0 h-[18svh] md:h-[24svh]"
        style={{ background: `linear-gradient(to bottom, transparent, ${IVORY})` }}
      />
      <Grain />

      <div
        className={`${container} relative z-10 flex min-h-[100svh] flex-col pb-36 pt-28 md:pt-32`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: reduce ? 0 : 0.2 }}
        >
          <Image
            src="/images/tera-logo-transparent.png"
            alt="TERA — Pura Natura"
            width={1983}
            height={793}
            priority
            className="h-auto w-[min(52vw,13rem)] md:w-[15rem]"
            sizes="(max-width: 768px) 52vw, 240px"
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: reduce ? 0 : 0.5 }}
          className="mt-10 block text-[10px] font-medium uppercase tracking-[0.36em] text-[#f4f1ea]/72 md:text-xs"
        >
          {hero.kicker}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: reduce ? 0 : 0.7, ease: EASE }}
          className="mt-5 max-w-[14ch] text-[clamp(2.15rem,5vw,4.6rem)] font-light leading-[1.06] tracking-[-0.02em] text-[#f7f5ee] md:max-w-[26ch]"
        >
          {hero.headline[0]}
          <br />
          <span className="text-[#c9d3c2]">{hero.headline[1]}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: reduce ? 0 : 1, ease: EASE }}
          className="mt-6 max-w-sm text-sm font-light leading-[1.8] text-[#f4f1ea]/78 md:text-base"
        >
          {hero.sub}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: reduce ? 0 : 1.6 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#262b25]/70">
          {hero.scrollHint}
        </span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="block h-9 w-px bg-gradient-to-b from-[#5a6957] to-transparent"
        />
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 01 — Il punto di partenza                                           */
/* ------------------------------------------------------------------ */

function Origin() {
  return (
    <section id={origin.id} className="relative scroll-mt-20 bg-[#f4f1ea] text-[#262b25]">
      <Grain />
      <div className={`${container} relative py-[10svh] md:py-[14svh]`}>
        <Chapter number={origin.number} title={origin.title} />
        <Reveal delay={0.1} className="mt-10 md:mt-14">
          <h2 className="max-w-[26ch] text-[clamp(2rem,4.6vw,4.2rem)] font-light leading-[1.08] tracking-[-0.02em]">
            {origin.headline[0]}
            <br className="hidden md:inline" /> {origin.headline[1]}
            <br className="hidden md:inline" />{" "}
            <span className="text-[#5a6957]">{origin.headline[2]}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid items-start gap-14 md:mt-20 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div className="flex max-w-xl flex-col gap-6 lg:pt-10">
            {origin.paragraphs.map((p, i) => (
              <Reveal key={p.slice(0, 20)} delay={0.08 * i}>
                <Prose>{p}</Prose>
              </Reveal>
            ))}
          </div>

          <div>
            <Reveal>
              <Parallax amount={26} className="mx-auto w-full max-w-[30rem] lg:ml-auto lg:mr-0">
                <Photo
                  photo={origin.photo}
                  className="aspect-[4/3] lg:aspect-[4/5]"
                  sizes="(max-width: 1024px) 90vw, 36vw"
                />
              </Parallax>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xs text-[11px] uppercase leading-[1.7] tracking-[0.22em] text-[#262b25]/55 lg:ml-auto">
                {origin.caption}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Dallo stesso impasto — nastro fotografico, non una griglia          */
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
  const total = strip.photos.length;
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const trigger = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        onNavigate((index + (e.key === "ArrowRight" ? 1 : -1) + total) % total);
      }
      if (e.key === "Tab") {
        const buttons = closeRef.current?.parentElement?.querySelectorAll<HTMLButtonElement>("button");
        if (!buttons?.length) return;
        if (e.shiftKey && document.activeElement === buttons[0]) { e.preventDefault(); buttons[buttons.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === buttons[buttons.length - 1]) { e.preventDefault(); buttons[0].focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onNavigate, total]);

  const photo = strip.photos[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1d221c]/95 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Fotografie TERA"
    >
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative h-[70svh] w-[90vw] max-w-6xl md:h-[80svh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={photo.src} alt={photo.alt} fill className="object-contain" sizes="92vw" quality={88} priority />
      </motion.div>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-[#f4f1ea] transition-colors hover:bg-[#f4f1ea] hover:text-[#262b25]"
      >
        <X className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + total) % total);
        }}
        aria-label="Precedente"
        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-[#f4f1ea] transition-colors hover:bg-[#f4f1ea] hover:text-[#262b25] md:left-8"
      >
        <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % total);
        }}
        aria-label="Successiva"
        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-[#f4f1ea] transition-colors hover:bg-[#f4f1ea] hover:text-[#262b25] md:right-8"
      >
        <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tabular-nums tracking-[0.3em] text-[#f4f1ea]/70">
        {index + 1} / {total}
      </div>
    </motion.div>
  );
}

function Strip() {
  const scroller = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const progressX = useTransform(progress, (value) => `${value * (100 / 0.18 - 100)}%`);
  const reduce = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });
  const [selected, setSelected] = useState<number | null>(null);
  const target = useRef<number | null>(null);
  const drag = useRef<{ id: number; x: number; y: number; left: number; active: boolean } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let settled: ReturnType<typeof setTimeout>;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      progress.set(max > 0 ? Math.max(0, Math.min(1, el.scrollLeft / max)) : 0);
      const start = el.scrollLeft < 2, end = el.scrollLeft >= max - 2;
      setEdges((previous) => previous.start === start && previous.end === end ? previous : { start, end });
      clearTimeout(settled);
      settled = setTimeout(() => { target.current = null; }, 160);
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => { clearTimeout(settled); observer.disconnect(); el.removeEventListener("scroll", update); };
  }, [progress]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const padding = parseFloat(getComputedStyle(el).paddingLeft);
    const positions = Array.from(el.querySelectorAll<HTMLButtonElement>("button")).map((card) => Math.min(max, Math.max(0, card.offsetLeft - padding)));
    const current = target.current ?? el.scrollLeft;
    const next = dir > 0 ? positions.find((p) => p > current + 2) ?? max : positions.reverse().find((p) => p < current - 2) ?? 0;
    target.current = next;
    el.scrollTo({ left: next, behavior: reduce ? "instant" : "smooth" });
  };

  const close = useCallback(() => setSelected(null), []);
  const navigate = useCallback((n: number) => setSelected(n), []);

  return (
    <section id="stesso-impasto" className="relative scroll-mt-28 overflow-hidden bg-[#f4f1ea] pb-[12svh] text-[#262b25]">
      <Grain />
      <div className={`${container} relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between`}>
        <div>
          <Reveal className="flex items-center gap-4">
            <span className="h-px w-10 bg-[#262b25]/20" />
            <span className="text-[10px] font-medium uppercase tracking-[0.34em] text-[#262b25]/60 md:text-xs">
              {strip.title}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="mt-6 max-w-[18ch] text-[clamp(1.7rem,3.4vw,3rem)] font-light leading-[1.12] tracking-[-0.02em]">
              {strip.headline}
            </h3>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-5 max-w-md text-sm font-light leading-[1.8] text-[#262b25]/68 md:text-base">{strip.sub}</p>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Foto precedenti"
            aria-controls="tera-fotografie"
            disabled={edges.start}
            className={styles.galleryArrow}
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Foto successive"
            aria-controls="tera-fotografie"
            disabled={edges.end}
            className={styles.galleryArrow}
          >
            <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="relative mt-10 md:mt-14">
        <div
          ref={scroller}
          id="tera-fotografie"
          role="region"
          aria-label="Dallo stesso impasto: fotografie"
          tabIndex={0}
          data-lenis-prevent-horizontal
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              scrollBy(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            target.current = null;
            suppressClick.current = false;
            drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, active: false };
          }}
          onPointerMove={(event) => {
            const gesture = drag.current;
            if (!gesture || gesture.id !== event.pointerId || !event.buttons) return;
            const dx = event.clientX - gesture.x;
            if (!gesture.active && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(event.clientY - gesture.y)) {
              gesture.active = true;
              suppressClick.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              event.currentTarget.dataset.dragging = "true";
            }
            if (gesture.active) {
              event.preventDefault();
              event.currentTarget.scrollTo({ left: gesture.left - dx, behavior: "instant" });
            }
          }}
          onPointerUp={(event) => {
            drag.current = null;
            delete event.currentTarget.dataset.dragging;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={(event) => { drag.current = null; delete event.currentTarget.dataset.dragging; }}
          onClickCapture={(event) => {
            if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
          }}
          className={`${styles.gallery} flex items-end gap-4 overflow-x-auto px-6 pb-2 scroll-pl-6 md:gap-6 md:px-12 md:scroll-pl-12 lg:px-20 lg:scroll-pl-20`}
        >
          {strip.photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Apri: ${photo.alt}`}
              className="group relative h-[58vw] shrink-0 snap-start overflow-hidden edge-fade-soft outline-none focus-visible:ring-2 focus-visible:ring-[#5a6957]/60 md:h-[26rem] lg:h-[30rem]"
              style={{ aspectRatio: photo.ratio }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                loading="lazy"
                draggable={false}
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 80vw, 46vw"
                quality={76}
              />
            </button>
          ))}
          <span aria-hidden className="w-2 shrink-0 md:w-8" />
        </div>
      </Reveal>

      {/* Indicatore di posizione: una linea che si sposta */}
      <div className={`${container} mt-8`}>
        <div className="relative h-px w-full bg-[#262b25]/12">
          <motion.span
            className="absolute left-0 top-0 h-px bg-[#5a6957]"
            style={{ width: "18%", x: progressX }}
          />
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && <Lightbox index={selected} onClose={close} onNavigate={navigate} />}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Le persone — un passaggio breve, prima della chiusura               */
/* ------------------------------------------------------------------ */

function People() {
  return (
    <section className="relative bg-[#f4f1ea] text-[#262b25]">
      <Grain />
      <div className={`${container} relative border-t border-[#262b25]/12 py-[8svh] md:py-[10svh]`}>
        <div className="grid items-center gap-8 md:grid-cols-[15rem_1fr] md:gap-14 lg:grid-cols-[18rem_1fr] lg:gap-16">
          <Reveal>
            <Photo
              photo={people.photo}
              className="aspect-[4/5] w-[14rem] md:w-full"
              imgClassName="object-[58%_center]"
              sizes="(max-width: 768px) 224px, 288px"
            />
          </Reveal>
          <div>
            <Reveal className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#262b25]/20" />
              <span className="text-[10px] font-medium uppercase tracking-[0.34em] text-[#262b25]/60 md:text-xs">
                {people.title}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-xl font-light tracking-[-0.01em] md:text-2xl">{people.name}</p>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-3 space-y-1">
                {people.roles.map((role) => (
                  <p key={role} className="text-[0.8rem] font-medium uppercase tracking-[0.14em] text-[#262b25]/70 md:text-[0.85rem]">
                    {role}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-4 text-sm font-light italic text-[#262b25]/60 md:text-[0.95rem]">
                {people.tagline}
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="mt-5 max-w-xl space-y-4">
                {people.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="text-[0.95rem] font-light leading-[1.8] text-[#262b25]/68 md:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.26}>
              <blockquote className="mt-6 max-w-xl border-l-2 border-[#262b25]/20 pl-5 text-[0.95rem] font-light italic leading-[1.8] text-[#262b25]/75 md:text-base">
                “{people.quote}”
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Chiusura: la filosofia Timilia, tre righe                           */
/* ------------------------------------------------------------------ */

function Closing() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden text-[#f4f1ea]" style={{ background: MINERAL_DEEP }}>
      <Grain light />
      <div className="relative">
        <div className={`${container} flex flex-col items-center py-[14svh] text-center md:py-[18svh]`}>
          {closing.lines.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: reduce ? 0 : 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-16% 0px" }}
              transition={{ duration: 1.1, delay: i * 0.22, ease: EASE }}
              className={`text-[clamp(1.9rem,5vw,4.8rem)] font-light leading-[1.14] tracking-[-0.02em] ${
                i === 2 ? `text-[#c9d3c2]` : "text-[#f7f5ee]"
              }`}
            >
              {line}
            </motion.p>
          ))}
          <Reveal delay={0.5} className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:mt-16">
            {closing.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group inline-flex items-center gap-3 border-b border-white/25 pb-2 text-[11px] font-medium uppercase tracking-[0.26em] text-[#f4f1ea]/80 transition-colors duration-500 hover:border-[#c9d3c2] hover:text-[#c9d3c2] md:text-xs"
              >
                {l.label}
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pagina                                                              */
/* ------------------------------------------------------------------ */

export default function TeraStory() {
  return (
    <div className="relative overflow-x-clip bg-[#f4f1ea] text-[#262b25]">
      <Hero />
      <Origin />
      <TeraMatterJourney />
      <Strip />
      <People />
      <Closing />
    </div>
  );
}
