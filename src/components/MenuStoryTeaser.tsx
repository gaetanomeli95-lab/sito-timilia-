"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { prologue } from "@/data/menuStoryData";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function MenuStoryTeaser() {
  const reduce = useReducedMotion();

  return (
    <section
      id="menu"
      aria-label="Il racconto della pizza Timilia"
      className="relative min-h-[92svh] overflow-hidden bg-black text-[#f5f0e8]"
    >
      {/* Ingresso morbido dalla sezione precedente */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#050505] to-transparent" />

      {/* Fotografia-manifesto: le mani di Tommaso */}
      <motion.div
        initial={{ scale: reduce ? 1 : 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.4, ease: EASE }}
        className="absolute inset-0 lg:left-auto lg:w-[60%]"
      >
        <Image
          src={prologue.image}
          alt={prologue.alt}
          fill
          className="object-cover object-[50%_35%] lg:object-[50%_45%]"
          sizes="(max-width: 1024px) 100vw, 60vw"
          quality={80}
        />
      </motion.div>

      {/* L'immagine è su nero puro: i gradienti sigillano i bordi */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,transparent_30%,transparent_52%,rgba(0,0,0,0.9)_100%)]" />
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#000_0%,#000_34%,transparent_62%)] lg:block" />

      {/* Luce calda e trama: il nero non resta piatto */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_72%,rgba(200,135,74,0.12),transparent_46%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_center,#c8a97e_1px,transparent_1px)] [background-size:38px_38px]"
      />

      {/* Contenuto */}
      <div className="relative z-10 mx-auto flex min-h-[92svh] w-full max-w-7xl flex-col justify-end px-6 pb-[12svh] pt-28 md:px-12 lg:justify-center lg:px-20 lg:pb-0">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-gold/80" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold md:text-xs">
              {prologue.kicker}
            </span>
          </div>

          <h2 className="mt-7 text-[clamp(1.9rem,4.6vw,3.9rem)] font-light leading-[1.12] tracking-[-0.02em] text-[#fffaf0]">
            In Sicilia abbiamo imparato che ogni fatica{" "}
            <span className="font-serif italic text-gold">aspetta il suo frutto.</span>
          </h2>

          <p className="mt-6 max-w-md text-sm font-light leading-[1.8] text-[#f5f0e8]/60 md:text-base">
            Materia, gesto, tecnica, tempo. Un racconto di come pensiamo la
            pizza, prima ancora di infornarla.
          </p>

          <div className="mt-10">
            <Link
              href="/la-nostra-pizza"
              className="inline-flex items-center gap-3 border border-gold bg-gold px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-black transition-colors duration-300 hover:bg-transparent hover:text-gold md:px-9 md:text-xs"
            >
              Entra nel racconto
              <span aria-hidden>→</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Uscita morbida verso la sezione successiva */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  );
}
