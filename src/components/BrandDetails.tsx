"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const details = [
  { label: "Packaging", desc: "Design minimal e materiali di qualità per un'esperienza che inizia prima del primo assaggio." },
  { label: "Identità Visiva", desc: "Un linguaggio grafico contemporaneo che parla di artigianalità e ricerca." },
  { label: "Materiali", desc: "Ogni superficie, ogni texture racconta la passione per l'autenticità." },
  { label: "Atmosfera", desc: "Luce, spazio e dettagli pensati per avvolgere in un'esperienza unica." },
];

export default function BrandDetails() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="brand" ref={ref} className="relative py-24 md:py-40 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/sfondi/4.png"
          alt="Sfondo"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.54) 25%, rgba(10,10,10,0.54) 75%, rgba(10,10,10,0.88) 100%)",
          }}
        />
        <div className="section-glow" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="order-2"
          >
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium block mb-4">
              Il brand
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-[0.05em] text-foreground mb-8">
              Brand Details
            </h2>
            <p className="text-foreground/60 text-lg font-light leading-relaxed mb-8">
              Timilia è oggi un luogo dove il gusto incontra l&apos;accoglienza, nel cuore di Palermo. Qui la pizza non ha etichette, non è gourmet, non è napoletana, non è moda. È ricerca, equilibrio e identità.
            </p>

            <div className="space-y-6">
              {details.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-[1px] bg-gold/50 mt-3 shrink-0" />
                  <div>
                    <h3 className="text-foreground text-sm tracking-[0.1em] uppercase font-medium mb-1">
                      {item.label}
                    </h3>
                    <p className="text-foreground/50 text-sm font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="order-1 relative aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden edge-fade-wide image-glow"
          >
            <Image
              src="/images/brand-details.png"
              alt="Brand TIMILIA"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
