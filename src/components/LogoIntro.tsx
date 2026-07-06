"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const dust = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 43) % 84)}%`,
  top: `${14 + ((index * 31) % 72)}%`,
  size: 1.5 + (index % 3),
  delay: 0.18 + (index % 9) * 0.09,
  duration: 1.35 + (index % 5) * 0.16,
  driftX: -18 + (index % 7) * 6,
  driftY: 20 + (index % 6) * 12,
}));

const words = [
  "Farina",
  "Fuoco",
  "Sicilia",
  "Ricerca",
];

type LogoIntroProps = {
  initiallyVisible: boolean;
};

export default function LogoIntro({ initiallyVisible }: LogoIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = prefersReducedMotion === true;
  const [visible, setVisible] = useState(initiallyVisible);

  const completeIntro = useCallback(() => {
    try {
      sessionStorage.setItem("timilia_intro_seen", "1");
    } catch {
    }

    setVisible(false);
  }, []);

  useEffect(() => {
    if (!initiallyVisible) {
      setVisible(false);
      return;
    }

    try {
      if (sessionStorage.getItem("timilia_intro_seen")) {
        setVisible(false);
        return;
      }
    } catch {
    }

    setVisible(true);
  }, [initiallyVisible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const timer = window.setTimeout(completeIntro, shouldReduceMotion ? 850 : 3450);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [completeIntro, shouldReduceMotion, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Ingresso TIMILIA"
          className="fixed inset-0 z-[100] flex h-[100dvh] min-h-[100svh] touch-none items-center justify-center overflow-hidden bg-background text-foreground"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.025, filter: shouldReduceMotion ? "none" : "blur(14px)" }}
          transition={{ duration: shouldReduceMotion ? 0.22 : 0.82, ease: [0.22, 1, 0.36, 1] }}
          onPointerUp={completeIntro}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            initial={{ scale: 1.08 }}
            animate={shouldReduceMotion ? { scale: 1 } : { scale: 1 }}
            transition={{ duration: 3.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background:
                "radial-gradient(circle at 50% 42%, rgba(200,169,126,0.26), transparent 24%), radial-gradient(circle at 20% 18%, rgba(212,165,116,0.12), transparent 24%), radial-gradient(circle at 80% 78%, rgba(245,240,232,0.08), transparent 26%), linear-gradient(135deg, #010101 0%, #100b06 48%, #050505 100%)",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute inset-0 opacity-70 mix-blend-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: shouldReduceMotion ? 0.35 : [0.2, 0.7, 0.42] }}
            transition={{ duration: 2.4, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(200,169,126,0.14) 48%, rgba(245,240,232,0.34) 50%, rgba(200,169,126,0.14) 52%, transparent 100%)",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-px w-[min(88vw,54rem)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-gold-light to-transparent shadow-[0_0_60px_rgba(212,196,168,0.45)]"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: shouldReduceMotion ? 0.45 : [0, 1, 0.35], scaleX: [0, 1, 0.72] }}
            transition={{ duration: shouldReduceMotion ? 0.55 : 1.85, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[min(92vw,70svh,42rem)] w-[min(92vw,70svh,42rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10"
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: [0, 0.42, 0], scale: [0.82, 1.05, 1.2] }}
            transition={{ duration: shouldReduceMotion ? 0.5 : 2.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {!shouldReduceMotion && dust.map((grain) => (
            <motion.span
              key={grain.id}
              aria-hidden="true"
              className="absolute rounded-full bg-gold-light shadow-[0_0_14px_rgba(212,196,168,0.72)]"
              style={{ left: grain.left, top: grain.top, width: grain.size, height: grain.size }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
              animate={{ opacity: [0, 0.85, 0], x: [0, grain.driftX], y: [0, -grain.driftY], scale: [0.35, 1, 0.25] }}
              transition={{ duration: grain.duration, delay: grain.delay, ease: "easeOut" }}
            />
          ))}

          <div className="relative z-10 flex h-full w-full max-w-6xl flex-col items-center justify-center gap-[clamp(0.85rem,2.8svh,1.8rem)] px-5 pb-[max(1.35rem,env(safe-area-inset-bottom))] pt-8 text-center sm:px-8">
            <motion.div
              className="relative flex h-[clamp(15rem,48svh,30rem)] w-[min(92vw,44rem)] items-center justify-center"
              initial={{ opacity: 0, scale: 0.86, y: 18, filter: shouldReduceMotion ? "none" : "blur(18px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: shouldReduceMotion ? 0.3 : 1.05, delay: shouldReduceMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-x-[10%] top-1/2 h-2/3 -translate-y-1/2 rounded-full bg-gold/18 blur-3xl"
                animate={shouldReduceMotion ? { opacity: 0.38 } : { opacity: [0.16, 0.56, 0.28], scale: [0.88, 1.08, 1] }}
                transition={{ duration: 2.7, ease: "easeInOut" }}
              />

              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-[42%] h-[42%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-2xl mix-blend-screen"
                initial={{ opacity: 0, scaleX: 0.3 }}
                animate={{ opacity: shouldReduceMotion ? 0.22 : [0, 0.52, 0.18], scaleX: [0.3, 1, 0.82] }}
                transition={{ duration: shouldReduceMotion ? 0.45 : 1.4, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              />

              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.94, clipPath: "inset(45% 18% 45% 18% round 999px)" }}
                animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 56px)" }}
                transition={{ duration: shouldReduceMotion ? 0.32 : 1.12, delay: shouldReduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.86 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0.28 : 0.82, delay: shouldReduceMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-[clamp(10rem,32svh,20rem)] w-[clamp(10rem,32svh,20rem)]"
                  style={{
                    mixBlendMode: "screen",
                    WebkitMaskImage: "radial-gradient(ellipse 72% 72% at 50% 50%, black 40%, rgba(0,0,0,0.5) 72%, transparent 100%)",
                    maskImage: "radial-gradient(ellipse 72% 72% at 50% 50%, black 40%, rgba(0,0,0,0.5) 72%, transparent 100%)",
                  }}
                >
                  <Image
                    src="/images/logo-timilia-original.jpg"
                    alt="TIMILIA Pizza di Sicilia"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 80vw, 320px"
                    priority
                    style={{ filter: "invert(1) brightness(1.08) contrast(1.12)" }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-[58%] h-px w-0 -translate-x-1/2 bg-gold/44"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "62%", opacity: 0.44 }}
                transition={{ duration: shouldReduceMotion ? 0.25 : 0.92, delay: shouldReduceMotion ? 0 : 0.62, ease: [0.16, 1, 0.3, 1] }}
              />

              <motion.div
                aria-hidden="true"
                className="absolute inset-x-[3%] top-1/2 h-px -translate-y-1/2 overflow-hidden rounded-full bg-gold/20 mix-blend-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: shouldReduceMotion ? 0 : [0, 1, 0] }}
                transition={{ duration: 1.2, delay: 0.64, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white to-transparent blur-sm"
                  animate={shouldReduceMotion ? {} : { x: ["0%", "420%"] }}
                  transition={{ duration: 0.9, delay: 0.66, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.24 : 0.72, delay: shouldReduceMotion ? 0.12 : 0.98, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="overflow-hidden">
                <motion.p
                  className="text-[clamp(0.68rem,2.2vw,0.9rem)] uppercase tracking-[0.36em] text-gold-light/82 sm:tracking-[0.54em]"
                  initial={{ y: "115%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: shouldReduceMotion ? 0.22 : 0.58, delay: shouldReduceMotion ? 0.14 : 1.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  Pizza contemporanea siciliana
                </motion.p>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 text-[0.56rem] uppercase tracking-[0.2em] text-foreground/38 sm:gap-2.5 sm:text-xs sm:tracking-[0.24em]">
                {words.map((word, index) => (
                  <motion.span
                    key={word}
                    className="rounded-full border border-gold/12 bg-white/[0.025] px-2.5 py-1.5 backdrop-blur-sm sm:px-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.16 : 0.38, delay: shouldReduceMotion ? 0.14 : 1.18 + index * 0.055, ease: "easeOut" }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="w-[min(16rem,68vw)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.36, delay: shouldReduceMotion ? 0.14 : 1.16 }}
            >
              <div className="h-px overflow-hidden rounded-full bg-foreground/10">
                <motion.div
                  className="h-full origin-left bg-gradient-to-r from-transparent via-gold-light to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0.65 : 2.75, ease: "easeInOut" }}
                />
              </div>
              <p className="mt-2.5 text-[0.56rem] uppercase tracking-[0.28em] text-foreground/28">tocca per saltare</p>
            </motion.div>
          </div>

          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/50 to-transparent"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: shouldReduceMotion ? 0.35 : [0.55, 0.25, 0.6] }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
