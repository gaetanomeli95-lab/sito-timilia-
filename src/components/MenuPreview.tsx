"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function MenuPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="menu" ref={ref} className="relative py-24 md:py-40 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/sfondi/3.png"
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
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium block mb-4">
            I nostri piatti
          </span>
          <h2 className="text-4xl md:text-6xl font-light tracking-[0.05em] text-foreground">
            Menu Preview
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/9] overflow-hidden edge-fade-wide image-glow">
            <Image
              src="/images/menu-hero.png"
              alt="Menu TIMILIA"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="mt-12 md:mt-16"
        >
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-foreground/70 text-lg md:text-xl font-light leading-relaxed mb-8">
              Ogni piatto racconta una storia di ricerca, equilibrio e identità. La nostra pizza nasce da una ricerca continua sulle materie prime, da impasti studiati e da combinazioni di gusto che uniscono tradizione e creatività.
            </p>
            <a
              href="/menu"
              className="inline-block px-8 py-4 border border-gold text-gold text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold hover:text-background transition-all duration-300"
            >
              Esplora il menu
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
