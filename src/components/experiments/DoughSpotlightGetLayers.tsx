"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import TimiliaFlowShader from "@/components/experiments/TimiliaFlowShader";

const doughs = [
  {
    number: "01",
    name: "Contemporaneo",
    short: "Soffice · alveolato · fragrante",
    desc: "Un impasto che nasce dal tempo e da una lunga fermentazione. Morbidezza, struttura e leggerezza diventano parte dello stesso morso.",
    image: "/images/menu-story/bufalina.jpeg",
    position: "50% 52%",
  },
  {
    number: "02",
    name: "Crusta",
    short: "Sottile · croccante · diretta",
    desc: "Più sottile e decisa. Cambia la consistenza, resta l'identità Timilia: materia leggibile, cottura precisa e un morso più netto.",
    image: "/images/menu-story/camurria.jpeg",
    position: "50% 50%",
  },
  {
    number: "03",
    name: "Rotondo in casseruola",
    short: "Morbido · setoso · uniforme",
    desc: "Lievitato con cura per ottenere una struttura soffice e regolare. Un modo diverso di lavorare volume, calore e consistenza.",
    image: "/images/menu-story/foto-3.png",
    position: "50% 50%",
  },
  {
    number: "04",
    name: "Senza glutine",
    short: "Ricerca · identità · TERA",
    desc: "Non un'alternativa di serie B. Un percorso autonomo di ricerca che porta a TERA e a una pizza con una propria identità.",
    image: "/images/tera-hero-1.png",
    position: "50% 50%",
  },
] as const;

function relativeSlot(index: number, active: number) {
  const total = doughs.length;
  const clockwise = (index - active + total) % total;
  if (clockwise === 0) return 0;
  if (clockwise === 1) return 1;
  if (clockwise === total - 1) return -1;
  return 2;
}

export default function DoughSpotlightGetLayers() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const current = doughs[active];

  const go = (direction: number) => {
    setActive((value) => (value + direction + doughs.length) % doughs.length);
  };

  return (
    <section
      id="impasti-lab"
      className="relative isolate overflow-hidden bg-[#050504] text-white"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(1);
        if (event.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="absolute inset-0 -z-20">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={current.image}
            className="absolute inset-0"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.26, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={current.image}
              alt=""
              fill
              className="object-cover blur-[2px] saturate-[0.72]"
              style={{ objectPosition: current.position }}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#050504_0%,rgba(5,5,4,0.78)_20%,rgba(5,5,4,0.82)_76%,#050504_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_0%,rgba(5,5,4,0.28)_38%,rgba(5,5,4,0.9)_82%)]" />
      </div>

      <TimiliaFlowShader className="-z-10 mix-blend-screen opacity-55" />

      <div className="mx-auto max-w-[1500px] px-6 py-28 md:px-10 md:py-36 lg:px-14 lg:py-44">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold/80" />
              <span className="text-[10px] font-medium uppercase tracking-[0.36em] text-gold md:text-xs">
                Quattro modi di vivere l'impasto
              </span>
            </div>
            <h2 className="mt-7 max-w-[10ch] text-[clamp(3rem,6vw,6.5rem)] font-light leading-[0.9] tracking-[-0.045em]">
              Non una base.
              <span className="block text-gold">Quattro caratteri.</span>
            </h2>
          </div>

          <p className="max-w-xl text-base font-light leading-[1.85] text-white/58 md:text-lg lg:justify-self-end">
            La sezione prende il principio dello “spotlight carousel”: una pizza domina la scena, le altre restano in prospettiva e aspettano il loro turno.
          </p>
        </div>

        <div className="relative mt-16 md:mt-20 lg:mt-24">
          <div
            className="relative h-[30rem] overflow-hidden sm:h-[38rem] md:h-[44rem] lg:h-[48rem]"
            style={{ perspective: "1600px" }}
          >
            {doughs.map((dough, index) => {
              const slot = relativeSlot(index, active);
              const visible = slot !== 2;
              const left = slot === 0 ? "50%" : slot === -1 ? "17%" : slot === 1 ? "83%" : "50%";
              const scale = slot === 0 ? 1 : 0.68;
              const rotateY = slot === 0 ? 0 : slot === -1 ? 22 : -22;

              return (
                <motion.button
                  type="button"
                  key={dough.name}
                  aria-label={`Mostra impasto ${dough.name}`}
                  aria-current={slot === 0 ? "true" : undefined}
                  onClick={() => setActive(index)}
                  className="absolute top-1/2 w-[78vw] max-w-[780px] overflow-hidden rounded-[1.8rem] border border-white/12 bg-[#0c0b09] text-left shadow-[0_45px_140px_rgba(0,0,0,0.58)] outline-none focus-visible:ring-2 focus-visible:ring-gold sm:w-[68vw] lg:w-[48vw]"
                  style={{ x: "-50%", y: "-50%", transformStyle: "preserve-3d" }}
                  initial={false}
                  animate={{
                    left,
                    scale,
                    rotateY,
                    opacity: visible ? (slot === 0 ? 1 : 0.34) : 0,
                    zIndex: slot === 0 ? 30 : 10,
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/3]">
                    <Image
                      src={dough.image}
                      alt={`Studio visivo Timilia per ${dough.name}`}
                      fill
                      className="object-cover"
                      style={{ objectPosition: dough.position }}
                      sizes="(max-width: 768px) 78vw, 48vw"
                      quality={84}
                    />
                    <div
                      className={`absolute inset-0 transition-colors duration-700 ${
                        slot === 0
                          ? "bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.06)_45%,rgba(4,4,3,0.92)_100%)]"
                          : "bg-black/40"
                      }`}
                    />
                    <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/25 px-3 py-2 font-mono text-[10px] tracking-[0.22em] text-white/75 backdrop-blur-md md:left-7 md:top-7">
                      {dough.number}
                    </span>
                    {slot === 0 && (
                      <motion.div
                        key={`caption-${active}`}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reduceMotion ? 0 : 0.22, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-x-0 bottom-0 p-6 md:p-9 lg:p-11"
                      >
                        <span className="text-[10px] uppercase tracking-[0.3em] text-gold/85 md:text-xs">{dough.short}</span>
                        <h3 className="mt-3 max-w-[12ch] text-3xl font-light leading-[0.96] tracking-[-0.03em] sm:text-4xl md:text-5xl lg:text-6xl">
                          {dough.name}
                        </h3>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mx-auto mt-2 grid max-w-5xl gap-8 border-t border-white/10 pt-8 md:grid-cols-[1fr_auto] md:items-start md:gap-12 md:pt-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.name}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.45 }}
              >
                <p className="max-w-2xl text-base font-light leading-[1.8] text-white/62 md:text-lg">{current.desc}</p>
                {active === 3 && (
                  <a
                    href="/tera"
                    className="mt-6 inline-flex border-b border-gold/45 pb-2 text-[10px] font-medium uppercase tracking-[0.26em] text-gold transition-colors hover:border-gold md:text-xs"
                  >
                    Entra nel mondo TERA →
                  </a>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3 md:justify-self-end">
              <button
                type="button"
                onClick={() => go(-1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/16 bg-white/[0.03] text-white/72 transition hover:border-gold/60 hover:text-gold"
                aria-label="Impasto precedente"
              >
                <ArrowLeft size={17} strokeWidth={1.5} />
              </button>
              <div className="mx-2 flex items-center gap-2" aria-label={`${active + 1} di ${doughs.length}`}>
                {doughs.map((dough, index) => (
                  <button
                    type="button"
                    key={dough.number}
                    onClick={() => setActive(index)}
                    className={`h-px transition-all duration-500 ${index === active ? "w-10 bg-gold" : "w-5 bg-white/24 hover:bg-white/50"}`}
                    aria-label={`Vai a ${dough.name}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/16 bg-white/[0.03] text-white/72 transition hover:border-gold/60 hover:text-gold"
                aria-label="Impasto successivo"
              >
                <ArrowRight size={17} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#050505]" />
    </section>
  );
}
