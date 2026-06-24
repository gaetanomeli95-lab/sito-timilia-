"use client";

import type { PointerEvent } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const introParticles = Array.from({ length: 46 }, (_, index) => {
  const angle = (index / 46) * Math.PI * 2;
  const radius = 82 + (index % 6) * 34;

  return {
    id: index,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    size: 2 + (index % 3),
    delay: (index % 12) * 0.08,
    duration: 2.4 + (index % 7) * 0.2,
  };
});

const orbitalLights = [
  { size: 250, duration: 18, delay: 0, opacity: 0.36 },
  { size: 330, duration: 24, delay: 0.4, opacity: 0.24 },
  { size: 430, duration: 32, delay: 0.8, opacity: 0.18 },
];

const introSessionKey = "timilia-intro-entered";

export default function LogoIntro() {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = prefersReducedMotion === true;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(sessionStorage.getItem(introSessionKey) !== "true");
  }, []);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 90, damping: 24, mass: 0.6 });
  const springY = useSpring(cursorY, { stiffness: 90, damping: 24, mass: 0.6 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-9, 9]);
  const logoX = useTransform(springX, [-0.5, 0.5], [-18, 18]);
  const logoY = useTransform(springY, [-0.5, 0.5], [-18, 18]);
  const glowX = useTransform(springX, [-0.5, 0.5], ["28%", "72%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["24%", "76%"]);
  const cursorGlow = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(200, 169, 126, 0.3), transparent 30%), radial-gradient(circle at 50% 44%, rgba(212, 165, 116, 0.18), transparent 34%), linear-gradient(135deg, #050505 0%, #130f0a 48%, #050505 100%)`;

  useEffect(() => {
    if (!visible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    cursorX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    cursorY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const handlePointerLeave = () => {
    cursorX.set(0);
    cursorY.set(0);
  };

  const enterSite = () => {
    sessionStorage.setItem(introSessionKey, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Ingresso TIMILIA"
          className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-hidden bg-background text-foreground [perspective:1400px]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(18px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div className="absolute inset-0" style={{ background: cursorGlow }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.18)_42%,rgba(5,5,5,0.94)_100%)]" />
          <motion.div
            className="absolute -inset-[72%] rounded-full opacity-30 mix-blend-screen"
            style={{ background: "conic-gradient(from 90deg, transparent, rgba(200, 169, 126, 0.22), transparent, rgba(212, 165, 116, 0.16), transparent)" }}
            animate={shouldReduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 0.35], opacity: [0, 0.9, 0.18] }}
            transition={{ duration: shouldReduceMotion ? 0.8 : 2.4, ease: "easeOut" }}
          />

          <motion.div
            className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative mb-12 h-[21rem] w-[21rem] cursor-none [transform-style:preserve-3d] md:h-[31rem] md:w-[31rem]"
              style={shouldReduceMotion ? {} : { rotateX, rotateY, x: logoX, y: logoY }}
            >
              {orbitalLights.map((orbital, index) => (
                <motion.div
                  key={orbital.size}
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 rounded-full border border-gold/20 shadow-[0_0_50px_rgba(200,169,126,0.16)]"
                  style={{
                    width: orbital.size,
                    height: orbital.size,
                    marginLeft: orbital.size / -2,
                    marginTop: orbital.size / -2,
                    opacity: orbital.opacity,
                  }}
                  initial={{ scale: 0.7, rotate: index * 18 }}
                  animate={shouldReduceMotion ? { scale: 1 } : { scale: [0.9, 1.08, 0.9], rotate: 360 }}
                  transition={{
                    scale: { duration: 3.8 + index, repeat: Infinity, ease: "easeInOut", delay: orbital.delay },
                    rotate: { duration: orbital.duration, repeat: Infinity, ease: "linear" },
                  }}
                />
              ))}

              {introParticles.map((particle) => (
                <motion.span
                  key={particle.id}
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 rounded-full bg-gold-light shadow-[0_0_14px_rgba(212,196,168,0.85)]"
                  style={{ width: particle.size, height: particle.size }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={shouldReduceMotion ? { opacity: 0 } : {
                    x: [0, particle.x * 0.35, particle.x],
                    y: [0, particle.y * 0.35, particle.y],
                    opacity: [0, 0.9, 0],
                    scale: [0, 1, 0.25],
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    repeatDelay: 1.1,
                    ease: "easeOut",
                  }}
                />
              ))}

              <motion.div
                aria-hidden="true"
                className="absolute inset-8 rounded-full bg-gold/10 blur-3xl md:inset-6"
                animate={shouldReduceMotion ? { opacity: 0.35 } : { opacity: [0.28, 0.65, 0.28], scale: [0.9, 1.18, 0.9] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                className="absolute -inset-4 md:-inset-8"
                initial={{ opacity: 0, scale: 0.76, filter: "blur(16px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.35, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  WebkitMaskImage: "radial-gradient(ellipse 72% 58% at 50% 53%, black 42%, rgba(0, 0, 0, 0.82) 62%, transparent 86%)",
                  maskImage: "radial-gradient(ellipse 72% 58% at 50% 53%, black 42%, rgba(0, 0, 0, 0.82) 62%, transparent 86%)",
                }}
              >
                <Image
                  src="/images/logo.png"
                  alt="TIMILIA"
                  fill
                  priority
                  sizes="(max-width: 768px) 360px, 560px"
                  className="object-contain mix-blend-screen drop-shadow-[0_0_56px_rgba(212,196,168,0.48)]"
                />
              </motion.div>

              <motion.div
                aria-hidden="true"
                className="absolute inset-4 overflow-hidden rounded-full mix-blend-screen md:inset-8"
              >
                <motion.div
                  className="absolute -left-1/2 top-0 h-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/45 to-transparent blur-sm"
                  animate={shouldReduceMotion ? {} : { x: ["0%", "330%"] }}
                  transition={{ duration: 1.25, delay: 1.05, repeat: Infinity, repeatDelay: 2.35, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>

            <motion.button
              type="button"
              onClick={enterSite}
              className="rounded-full border border-gold/25 bg-background/25 px-8 py-4 text-xs uppercase tracking-[0.34em] text-foreground/72 backdrop-blur-xl transition-colors duration-300 hover:border-gold/70 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/50"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.75, ease: "easeOut" }}
            >
              Entra
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
