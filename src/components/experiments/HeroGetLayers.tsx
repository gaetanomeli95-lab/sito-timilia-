"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import TimiliaFlowShader from "@/components/experiments/TimiliaFlowShader";

const HERO_DESKTOP = "/images/hero-iniziale-desktop.webp";
const HERO_MOBILE = "/images/hero-iniziale-mobile.webp";

export default function HeroGetLayers() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(useTransform(pointerX, [-1, 1], [-10, 10]), { stiffness: 55, damping: 22 });
  const smoothY = useSpring(useTransform(pointerY, [-1, 1], [-7, 7]), { stiffness: 55, damping: 22 });

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-[#050504] text-white"
      onPointerMove={(event) => {
        if (reduceMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1);
        pointerY.set(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.picture
          className="absolute -inset-4 block"
          style={reduceMotion ? undefined : { x: smoothX, y: smoothY, scale: 1.025 }}
        >
          <source media="(min-width: 768px)" srcSet={HERO_DESKTOP} />
          <img
            src={HERO_MOBILE}
            alt="Timilia nel cuore di Palermo"
            className="h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
        </motion.picture>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,2,0.90)_0%,rgba(3,3,2,0.68)_30%,rgba(3,3,2,0.12)_66%,rgba(3,3,2,0.26)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,transparent_42%,rgba(3,3,2,0.90)_100%)]" />

        {/* Real WebGL field: warm, low contrast, intentionally behind the photography. */}
        <TimiliaFlowShader className="mix-blend-screen opacity-75" />

        <motion.div
          aria-hidden="true"
          className="absolute -right-[18vw] top-[14vh] h-[46vw] min-h-[26rem] w-[46vw] min-w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(196,119,45,0.23)_0%,rgba(122,70,30,0.08)_38%,transparent_70%)] blur-3xl"
          animate={reduceMotion ? undefined : { scale: [0.92, 1.08, 0.96], x: [0, -32, 8], y: [0, 18, -8] }}
          transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(235,198,146,0.45)_0.6px,transparent_0.7px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_75%,transparent)]"
        />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-b from-transparent via-[#050504]/65 to-[#050504] md:h-72" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1600px] items-end px-6 pb-20 pt-32 md:items-center md:px-10 md:pb-14 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 1.05, delay: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[43rem]"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-gold/85" />
            <span className="text-[10px] font-medium uppercase tracking-[0.36em] text-gold md:text-xs">
              Palermo · materia · tempo
            </span>
          </div>

          <h1 className="max-w-[12ch] text-[clamp(3rem,6.5vw,7rem)] font-light leading-[0.89] tracking-[-0.045em] text-white">
            Dalla pizza al pane.
            <span className="mt-2 block text-gold">Dal pane alla pizza.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base font-light leading-[1.8] text-white/68 md:mt-9 md:text-lg">
            La storia resta la stessa. Cambia il modo di entrarci dentro: luce, profondità e movimento seguono la fotografia senza coprirla.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#impasti-lab"
              className="border border-gold bg-gold px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-black transition-colors duration-300 hover:bg-transparent hover:text-gold md:text-xs"
            >
              Esplora gli impasti
            </a>
            <a
              href="/"
              className="border border-white/22 bg-black/20 px-7 py-4 text-[10px] font-medium uppercase tracking-[0.24em] text-white/78 backdrop-blur-sm transition-colors duration-300 hover:border-gold/70 hover:text-gold md:text-xs"
            >
              Home originale
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 hidden items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-white/32 md:flex lg:right-10">
        <span>Muovi · scorri</span>
        <motion.span
          aria-hidden="true"
          className="block h-10 w-px bg-gradient-to-b from-gold/80 to-transparent"
          animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
