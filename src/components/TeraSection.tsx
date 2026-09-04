"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Grain from "@/components/tera/Grain";
import { chapters, type TeraChapter } from "@/data/teraStoryData";

const EASE = [0.16, 1, 0.3, 1] as const;
/* Ritmo del trailer: ogni capitolo resta aperto per questo tempo */
const AUTOPLAY_MS = 4600;

/* Palette TERA, la stessa della pagina: avorio, inchiostro, salvia */
const IVORY = "#f4f1ea";
const HOME_BLACK = "#050505";

export default function TeraSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isOnScreen = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);

  /* Quando nessuno tocca i capitoli, si aprono da soli uno dopo l'altro */
  useEffect(() => {
    if (reduce || paused || !isOnScreen) return;
    const t = setTimeout(() => {
      setActive((a) => (a + 1) % chapters.length);
      setCycle((c) => c + 1);
    }, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused, isOnScreen, reduce]);

  const select = (i: number) => {
    if (i !== active) {
      setActive(i);
      setCycle((c) => c + 1);
    }
  };

  return (
    <section id="tera" ref={ref} className="relative overflow-hidden text-[#262b25]" style={{ background: IVORY }}>
      <Grain />
      {/* Il foglio avorio emerge dal nero della Home e vi ritorna */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 md:h-36"
        style={{ background: `linear-gradient(to bottom, ${HOME_BLACK}, transparent)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-36"
        style={{ background: `linear-gradient(to top, ${HOME_BLACK}, transparent)` }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 md:py-36 lg:px-8 lg:py-44">
        {/* Testata: il progetto, il titolo, l'invito */}
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: EASE }}
          >
            <div className="flex flex-wrap items-center gap-5">
              <Link href="/tera" aria-label="TERA — Pura Natura" className="group/logo block shrink-0">
                <Image
                  src="/images/tera-logo-new.png"
                  alt="TERA — Pura Natura"
                  width={1568}
                  height={627}
                  className="h-auto w-[8.5rem] rounded-[3px] shadow-[0_14px_40px_rgba(38,43,37,0.18)] transition-transform duration-700 group-hover/logo:-translate-y-0.5 md:w-[10rem]"
                  sizes="(max-width: 768px) 136px, 160px"
                />
              </Link>
              <span className="text-[10px] font-medium uppercase tracking-[0.34em] text-[#262b25]/60 md:text-xs">
                Il progetto senza glutine di Timilia
              </span>
            </div>
            <h2 className="mt-9 max-w-[18ch] text-[clamp(2.1rem,4.8vw,4.4rem)] font-light leading-[1.06] tracking-[-0.02em]">
              Sette anni per un impasto.
              <br />
              <span className="text-[#5a6957]">Cinque capitoli per raccontarlo.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            className="lg:pb-2"
          >
            <p className="max-w-md text-[0.98rem] font-light leading-[1.85] text-[#262b25]/74 md:text-lg">
              TERA non racconta ciò che manca. Racconta ciò che abbiamo dovuto imparare per costruire qualcosa di nuovo.
            </p>
            <Link
              href="/tera"
              className="group mt-6 inline-flex items-center gap-3 border-b border-[#262b25]/25 pb-2 text-[11px] font-medium uppercase tracking-[0.26em] text-[#262b25]/80 transition-colors duration-500 hover:border-[#5a6957] hover:text-[#5a6957] md:text-xs"
            >
              Leggi tutta la storia
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
            </Link>
          </motion.div>
        </div>

        {/* I capitoli: cinque pagine affiancate, una si apre alla volta */}
        <motion.ol
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
          onMouseLeave={() => setPaused(false)}
          className="mt-14 flex h-[38rem] flex-col gap-2 md:mt-20 md:h-[30rem] md:flex-row md:gap-3 lg:h-[34rem]"
        >
          {chapters.map((chapter, i) => (
            <ChapterPage
              key={chapter.id}
              chapter={chapter}
              isActive={i === active}
              isFinale={i === chapters.length - 1}
              cycle={cycle}
              running={!reduce && !paused && isOnScreen}
              onActivate={() => {
                select(i);
                setPaused(true);
              }}
            />
          ))}
        </motion.ol>

        {/* Chiusura: il conto dei capitoli e l'ingresso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          className="mt-10 flex flex-col gap-6 md:mt-12 md:flex-row md:items-center md:justify-between"
        >
          <p className="text-[11px] uppercase leading-[1.7] tracking-[0.22em] text-[#262b25]/55">
            Dal primo impasto alla pizza. Una storia in cinque capitoli.
          </p>
          <Link
            href="/tera"
            className="group inline-flex items-center gap-3 self-start rounded-full bg-[#262b25] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#f4f1ea] transition-colors duration-500 hover:bg-[#5a6957] md:self-auto"
          >
            Entra nel mondo TERA
            <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Una pagina del libro ---------- */
function ChapterPage({
  chapter,
  isActive,
  isFinale,
  cycle,
  running,
  onActivate,
}: {
  chapter: TeraChapter;
  isActive: boolean;
  isFinale: boolean;
  cycle: number;
  running: boolean;
  onActivate: () => void;
}) {
  return (
    <li
      className="relative min-h-0 min-w-0 transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ flex: `${isActive ? 3.6 : 1} 1 0%` }}
    >
      <Link
        href={chapter.href}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        aria-current={isActive ? "true" : undefined}
        aria-label={`Capitolo ${chapter.number}: ${chapter.title}`}
        className="group relative block h-full w-full overflow-hidden rounded-[1rem] bg-[#262b25] outline-none focus-visible:ring-2 focus-visible:ring-[#5a6957] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ea]"
      >
        <Image
          src={chapter.photo.src}
          alt={chapter.photo.alt}
          fill
          className={`object-cover transition-[transform,filter] duration-[1200ms] ease-out ${
            isActive ? "scale-100 brightness-100" : "scale-[1.12] brightness-[0.62] saturate-[0.85]"
          } group-hover:scale-[1.03]`}
          style={{ objectPosition: chapter.position ?? "50% 50%" }}
          sizes="(max-width: 768px) 100vw, 60vw"
          quality={78}
        />
        {/* Ombra per il testo: dal basso quando la pagina è aperta, piena quando è chiusa */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            isActive
              ? "bg-[linear-gradient(180deg,rgba(20,26,20,0.10)_0%,transparent_38%,rgba(20,26,20,0.78)_100%)]"
              : "bg-[linear-gradient(180deg,rgba(20,26,20,0.55)_0%,rgba(20,26,20,0.25)_50%,rgba(20,26,20,0.70)_100%)]"
          }`}
        />

        {/* Avanzamento del trailer sul bordo alto della pagina aperta */}
        {isActive && (
          <span
            key={`bar-${cycle}`}
            className="absolute inset-x-0 top-0 h-[2px] origin-left bg-[#f4f1ea]/85"
            style={{ animation: running ? `tera-progress ${AUTOPLAY_MS}ms linear both` : "none", transform: running ? undefined : "scaleX(1)" }}
          />
        )}

        {/* Il numero del capitolo, grande, in filigrana */}
        {isActive && (
          <span
            key={`num-${cycle}`}
            aria-hidden
            className="tera-num-in pointer-events-none absolute right-5 top-4 text-[clamp(3.5rem,8vw,7rem)] font-light leading-none tabular-nums text-[#f4f1ea]/18 md:right-8 md:top-6"
          >
            {chapter.number}
          </span>
        )}

        {/* La costa del libro: numero e titolo, visibili quando la pagina è chiusa */}
        <div
          className={`absolute inset-0 flex items-center justify-between gap-4 px-5 transition-opacity duration-500 md:flex-col md:items-start md:justify-between md:px-0 md:py-5 ${
            isActive ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <span className="text-xs tabular-nums tracking-[0.2em] text-[#f4f1ea]/70 md:pl-5">{chapter.number}</span>
          <span className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-[#f4f1ea] md:[writing-mode:vertical-rl] md:rotate-180 md:self-center">
            {chapter.title}
            {isFinale && <span className="text-[#c9d3c2]/80">· Il finale</span>}
          </span>
          <span className="text-[#f4f1ea]/70 md:hidden">→</span>
        </div>

        {/* La pagina aperta: capitolo, titolo, una frase, l'invito */}
        <div
          className={`absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10 ${isActive ? "" : "pointer-events-none opacity-0"}`}
        >
          {isActive && (
            <div key={`open-${cycle}`} className="tera-caption-in w-[min(100%,34rem)]">
              <span className="block text-[10px] font-medium uppercase tracking-[0.34em] text-[#f4f1ea]/65">
                Capitolo {chapter.number}
                {isFinale && <span className="text-[#c9d3c2]"> · Il finale</span>}
              </span>
              <span className="mt-3 block text-[clamp(1.6rem,3.2vw,2.8rem)] font-light leading-[1.08] tracking-[-0.02em] text-[#f7f5ee]">
                {chapter.title}
              </span>
              <span className="mt-3 block max-w-md text-sm font-light leading-[1.75] text-[#f4f1ea]/78 md:text-base">
                {chapter.teaser}
              </span>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f4f1ea] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#262b25] transition-colors duration-500 group-hover:bg-[#c9d3c2]">
                {isFinale ? "Leggi il finale" : "Leggi il capitolo"}
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </span>
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}
