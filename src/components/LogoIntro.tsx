"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

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
      // Ignore storage errors and simply close the intro.
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
      // If storage is unavailable, show the intro normally.
    }

    setVisible(true);
  }, [initiallyVisible]);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const timer = window.setTimeout(
      completeIntro,
      shouldReduceMotion ? 900 : 2400,
    );

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
          className="fixed inset-0 z-[100] flex min-h-[100svh] touch-none items-center justify-center overflow-hidden bg-black text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.55, ease: "easeOut" }}
          onPointerUp={completeIntro}
        >
          <div className="flex w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[clamp(10rem,28vw,18rem)] w-[min(78vw,28rem)]"
            >
              <Image
                src="/images/logo-timilia-original.jpg"
                alt="TIMILIA"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 78vw, 448px"
                priority
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, delay: shouldReduceMotion ? 0 : 0.35 }}
              className="mt-5 max-w-2xl text-sm font-light leading-relaxed tracking-[0.08em] text-white/72 sm:text-base md:text-lg"
            >
              Conosciamo la terra. Lavoriamo la materia. Facciamo pizza.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : 0.45 }}
              className="mt-10 flex flex-col items-center gap-3"
              aria-label="Caricamento"
            >
              <div className="h-px w-36 overflow-hidden bg-white/15 sm:w-44">
                <motion.div
                  className="h-full origin-left bg-white/75"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0.7 : 2.1, ease: "easeInOut" }}
                />
              </div>
              <span className="text-[0.58rem] uppercase tracking-[0.32em] text-white/35">
                Loading
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
