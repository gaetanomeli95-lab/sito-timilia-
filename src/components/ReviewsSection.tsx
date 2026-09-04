"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* Tre voci, tre piattaforme diverse. La citazione resta l'elemento principale;
   la piattaforma si legge subito, ma senza loghi né punteggi. */
const voices = [
  {
    platform: "Google",
    mark: "G",
    quote: "Locale nella zona turistica di Palermo, ma con servizio per nulla turistico.",
    name: "Mattia Fasana",
    note: "recensione su Google",
  },
  {
    platform: "Tripadvisor",
    mark: "T",
    quote: "L'alta qualità dei piatti si sposa con la grande cordialità del personale.",
    name: "Maddalena",
    note: "recensione su Tripadvisor",
  },
  {
    platform: "Restaurant Guru",
    mark: "R",
    quote: "…mostrava con grande amore il suo lavoro.",
    name: "Gabriella Scarongella",
    note: "recensione mostrata su Restaurant Guru",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ReviewsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="recensioni" ref={ref} className="relative overflow-hidden py-16 md:py-24">
      {/* Un respiro caldo dietro le parole, come nelle altre sezioni della Home */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(200,169,126,0.09),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* Testata: si capisce subito cosa sono, e chi parla */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE }}
          className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12"
        >
          <div>
            <span className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-gold/70">
              <span className="h-px w-8 bg-gold/40" />
              Recensioni
            </span>
            <h2 className="mt-4 max-w-[26ch] text-xl font-light leading-[1.3] tracking-[0.01em] text-foreground md:text-2xl lg:text-3xl">
              Non siamo noi a raccontare Timilia.{" "}
              <span className="italic text-gold">Sono le persone che ci sono state.</span>
            </h2>
          </div>
          <p className="max-w-xs text-xs font-light leading-[1.8] text-foreground/45 md:text-right md:text-sm">
            Tre voci, da Google, Tripadvisor e Restaurant Guru. Riportate così come sono state scritte.
          </p>
        </motion.div>

        {/* Un solo piano leggero, diviso da fili sottili: tre voci, non tre scatole */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
          className="mt-10 grid overflow-hidden rounded-2xl border border-gold/[0.14] bg-[linear-gradient(180deg,rgba(200,169,126,0.07),rgba(255,255,255,0.015))] divide-y divide-white/[0.07] md:mt-12 lg:grid-cols-3 lg:divide-x lg:divide-y-0"
        >
          {voices.map((v, i) => (
            <motion.figure
              key={v.name}
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: EASE }}
              className="flex flex-col p-6 md:p-8 lg:p-9"
            >
              {/* La piattaforma: un piccolo marchio con l'iniziale, e il nome */}
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/35 bg-gold/[0.08] text-[11px] font-medium text-gold"
                >
                  {v.mark}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-gold/80">{v.platform}</span>
              </div>

              <blockquote className="relative mt-6 flex-1 text-[1.05rem] font-light leading-[1.7] text-foreground/85 lg:text-lg">
                <span aria-hidden className="mr-1 font-serif text-2xl leading-none text-gold/50">&ldquo;</span>
                {v.quote}
                <span aria-hidden className="ml-0.5 font-serif text-2xl leading-none text-gold/50">&rdquo;</span>
              </blockquote>

              <figcaption className="mt-6 flex flex-col gap-1 border-t border-white/[0.07] pt-4 text-[11px] font-light tracking-[0.06em]">
                <span className="text-foreground/75">{v.name}</span>
                <span className="text-foreground/35">{v.note}</span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
