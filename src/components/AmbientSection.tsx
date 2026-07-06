"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function AmbientSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ambient" ref={ref} className="relative py-24 md:py-40 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <Image
          src="/images/sfondi/1.png"
          alt="Sfondo"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.5) 12%, rgba(5,5,5,0.5) 88%, rgba(5,5,5,0.92) 100%)",
          }}
        />
        <div className="section-glow" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-16 md:mb-24"
        >
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium block mb-4">
            L&apos;esperienza
          </span>
          <h2 className="text-4xl md:text-6xl font-light tracking-[0.05em] text-foreground">
            Ambient
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative aspect-[4/5] sm:aspect-[4/5] overflow-hidden edge-fade image-glow"
          >
            <Image
              src="/images/ambient-experience.png"
              alt="Atmosfera TIMILIA"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <div className="space-y-6">
              <p className="text-foreground/70 text-lg md:text-xl font-light leading-relaxed tracking-wide">
                Nel cuore del centro storico di Palermo, a due passi dai Quattro Canti, Timilia si rinnova e cresce.
              </p>
              <p className="text-foreground/50 text-base font-light leading-relaxed">
                Da pizzeria da asporto a vera e propria boutique del gusto: un nuovo spazio pensato per accogliervi, dove fermarsi, vivere l&apos;esperienza e assaporare ogni dettaglio con il giusto tempo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
              {[
                { label: "Atmosfera", desc: "Luce calda e design contemporaneo" },
                { label: "Design", desc: "Eleganza minimal e materici autentici" },
                { label: "Esperienza", desc: "Ogni dettaglio curato con passione" },
                { label: "Sicilia", desc: "Tradizione moderna nel cuore di Palermo" },
              ].map((item) => (
                <div key={item.label}>
                  <span className="text-gold text-xs tracking-[0.2em] uppercase block mb-2">
                    {item.label}
                  </span>
                  <p className="text-foreground/60 text-sm font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="mt-16 md:mt-24 relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/9] overflow-hidden edge-fade-wide image-glow"
        >
          <Image
            src="/images/ambient-experience-2.png"
            alt="Dettagli TIMILIA"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        </motion.div>
      </div>
    </section>
  );
}
