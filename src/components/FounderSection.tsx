"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const stats = [
    { target: 2017, suffix: "", label: "Nascita di Timilia" },
    { target: 10, prefix: "+", suffix: " anni", label: "Di ricerca" },
    { target: 100, suffix: "%", label: "Siciliano" },
  ];

  return (
    <section
      id="founder"
      ref={ref}
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #080808 0%, #0E0B07 40%, #0C0A08 70%, #080808 100%)",
      }}
    >
      {/* Ambient warm glows */}
      <motion.div
        className="absolute top-1/3 -left-32 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,169,98,0.09) 0%, transparent 65%)" }}
        animate={{ opacity: [0.3, 0.6, 0.3], x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(180,100,60,0.07) 0%, transparent 65%)" }}
        animate={{ opacity: [0.2, 0.5, 0.2], x: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Top + bottom decorative lines */}
      <motion.div
        className="absolute left-1/2 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        style={{ width: "50%", translateX: "-50%" }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />
      <motion.div
        className="absolute left-1/2 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
        style={{ width: "40%", translateX: "-50%" }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-3 mb-10 md:mb-16"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold/40" />
            <span className="text-gold/90 text-[11px] tracking-[0.35em] uppercase font-medium">
              Il Fondatore
            </span>
            <span className="h-px w-8 bg-gold/40" />
          </div>
          <span className="text-foreground/30 text-[10px] tracking-[0.2em] uppercase font-light">
            Tommaso Di Bella
          </span>
        </motion.div>

        {/* Photo — centered, large */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-2xl mx-auto"
        >
          {/* Glow behind */}
          <motion.div
            className="absolute -inset-4 sm:-inset-6 rounded-[1.5rem] sm:rounded-[2rem] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 35% 40%, rgba(201,169,98,0.12), transparent 60%)",
            }}
            animate={{ opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            className="relative aspect-[4/3] overflow-hidden rounded-[1rem] sm:rounded-[1.5rem] border border-white/[0.06] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
            style={{
              transform: `perspective(1400px) rotateY(${mousePos.x * 1.5}deg) rotateX(${-mousePos.y * 1.5}deg)`,
              transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <motion.div style={{ y: imgY }} className="absolute inset-0 scale-[1.08]">
              <Image
                src="/images/tommaso-new.png"
                alt="Tommaso Di Bella"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 640px"
                priority
              />
            </motion.div>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 via-transparent to-transparent" />

            {/* Name plate */}
            <motion.div
              className="absolute bottom-5 left-5 flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#080808]/80 backdrop-blur-xl border border-gold/20"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[11px] tracking-[0.25em] uppercase text-foreground/75 font-medium">Tommaso Di Bella</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Title + text below photo */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center mt-8 md:mt-14 max-w-2xl mx-auto px-2"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.01em] text-foreground leading-[1.2] mb-4">
            Tutto nasce da una{" "}
            <span className="text-gold font-normal italic">visione.</span>
          </h2>
          <p className="text-foreground/55 text-sm md:text-base font-light leading-[1.8]">
            Prima di essere una pizzeria, Timilia è l&apos;idea di un uomo che ha dedicato la propria vita alla ricerca dell&apos;impasto perfetto. Nato e cresciuto a Palermo, Tommaso Di Bella entra nel mondo della pizza giovanissimo, trasformando una passione in una missione.
          </p>
        </motion.div>

        {/* Quote — centered below */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative max-w-2xl mx-auto mt-8 md:mt-10 rounded-2xl bg-gradient-to-br from-gold/[0.06] to-transparent border border-gold/15 p-5 sm:p-6 md:p-8 group hover:border-gold/30 transition-all duration-500"
        >
          <span className="absolute -top-3 left-6 text-gold/30 text-3xl font-serif leading-none select-none">&ldquo;</span>
          <p className="text-foreground/80 text-base md:text-lg font-light italic leading-relaxed text-center pt-1">
            Il successo non nasce da una ricetta segreta.<br />
            Nasce dalla capacità di migliorarsi ogni giorno.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="h-px w-6 bg-gold/40" />
            <cite className="text-gold/70 text-[10px] tracking-[0.25em] uppercase not-italic font-medium">
              Tommaso Di Bella
            </cite>
            <span className="h-px w-6 bg-gold/40" />
          </div>
        </motion.div>

        {/* Stats — centered row below quote */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
          className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-2xl mx-auto mt-6 md:mt-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-2 sm:px-3 py-3 md:py-4 text-center cursor-default hover:border-gold/25 hover:bg-gold/[0.04] transition-colors duration-400"
            >
              <span className="text-gold text-lg md:text-xl font-light tracking-wide block mb-1">
                {stat.prefix}<AnimatedNumber target={stat.target} suffix={stat.suffix} trigger={isInView} />
              </span>
              <span className="text-foreground/35 text-[9px] md:text-[10px] tracking-[0.12em] uppercase font-light leading-tight block">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
