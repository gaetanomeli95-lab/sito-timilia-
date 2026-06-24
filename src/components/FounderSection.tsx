"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

function AnimatedNumber({ target, suffix = "", trigger }: { target: number; suffix?: string; trigger: boolean }) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!trigger || hasRun.current) return;
    hasRun.current = true;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [trigger, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function FounderSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="founder"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      {/* subtle amber/gold ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.08] blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #c9a962 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full opacity-[0.07] blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #d4a574 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden edge-fade image-glow"
          >
            <Image
              src="/images/tommaso.png"
              alt="Tommaso Di Bella"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 via-transparent to-transparent" />
          </motion.div>

          {/* Right: Content */}
          <div className="flex flex-col gap-8 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              <span className="text-gold/80 text-xs tracking-[0.3em] uppercase font-medium block mb-4">
                Il fondatore
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-[3.2rem] font-light tracking-[0.02em] text-foreground leading-tight">
                Tutto nasce da una visione.
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
              className="text-foreground/50 text-base md:text-lg font-light leading-relaxed"
            >
              Prima di essere una pizzeria, Timilia è l&apos;idea di un uomo che ha dedicato la propria vita alla ricerca dell&apos;impasto perfetto.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="space-y-5 text-foreground/40 text-sm md:text-base font-light leading-relaxed"
            >
              <p>
                Nato e cresciuto a Palermo, Tommaso Di Bella entra nel mondo della pizza giovanissimo, trasformando una passione in una missione. Anni di studio, sperimentazione e ricerca lo portano a creare Timilia, un progetto che unisce identità siciliana, innovazione e rispetto assoluto per le materie prime.
              </p>
              <p>
                Ogni impasto, ogni scelta e ogni dettaglio raccontano una filosofia precisa: la pizza non deve seguire le mode, deve avere un&apos;anima.
              </p>
              <p>
                Oggi Timilia rappresenta un punto di riferimento per chi cerca autenticità, equilibrio e qualità senza compromessi.
              </p>
            </motion.div>

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
              className="border-l border-gold/30 pl-6 my-4"
            >
              <p className="text-foreground/70 text-lg md:text-xl font-light italic leading-relaxed">
                &ldquo;Il successo non nasce da una ricetta segreta.<br />
                Nasce dalla capacità di migliorarsi ogni giorno.&rdquo;
              </p>
              <cite className="text-gold/60 text-xs tracking-[0.2em] uppercase not-italic mt-4 block">
                — Tommaso Di Bella
              </cite>
            </motion.blockquote>

            {/* Numbers */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5"
            >
              <div>
                <span className="text-gold text-2xl md:text-3xl font-light tracking-wide block mb-2">
                  <AnimatedNumber target={2017} trigger={isInView} />
                </span>
                <span className="text-foreground/40 text-xs tracking-[0.15em] uppercase font-light">
                  Nascita di Timilia
                </span>
              </div>
              <div>
                <span className="text-gold text-2xl md:text-3xl font-light tracking-wide block mb-2">
                  +<AnimatedNumber target={10} trigger={isInView} /> anni
                </span>
                <span className="text-foreground/40 text-xs tracking-[0.15em] uppercase font-light">
                  Di ricerca e sperimentazione
                </span>
              </div>
              <div>
                <span className="text-gold text-2xl md:text-3xl font-light tracking-wide block mb-2">
                  <AnimatedNumber target={100} suffix="%" trigger={isInView} />
                </span>
                <span className="text-foreground/40 text-xs tracking-[0.15em] uppercase font-light">
                  Identità siciliana
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
