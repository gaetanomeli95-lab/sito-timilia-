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
    <section id="brand" ref={ref} className="relative py-24 md:py-40 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col justify-center"
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
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7 relative aspect-[16/9] md:aspect-[3/2] lg:aspect-[3/2] overflow-hidden"
          >
            <Image
              src="/images/brand-details.png"
              alt="Brand TIMILIA"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-charcoal/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
