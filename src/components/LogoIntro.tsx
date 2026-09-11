"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const VIDEO_URL = "https://d2ol7oe51mr4n9.cloudfront.net/user_3J5bcdAgqMsyUqzT0zx6yGprNjK/ccfb3b9c-b304-4c16-807a-5455a37256a9.mp4";

type LogoIntroProps = {
  initiallyVisible: boolean;
};

type IntroPhase = "gate" | "playing" | "ready" | "leaving";

export default function LogoIntro({ initiallyVisible }: LogoIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefersReducedMotion === true;
  const videoRef = useRef<HTMLVideoElement>(null);
  const exitTimerRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(initiallyVisible);
  const [phase, setPhase] = useState<IntroPhase>("gate");
  const [videoError, setVideoError] = useState(false);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem("timilia_intro_seen", "1");
    } catch {
      // Storage is optional.
    }
    setVisible(false);
  }, []);

  const enterSite = useCallback(() => {
    if (phase === "leaving") return;

    videoRef.current?.pause();
    setPhase("leaving");

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
    }

    exitTimerRef.current = window.setTimeout(
      finishIntro,
      reduceMotion ? 160 : 760,
    );
  }, [finishIntro, phase, reduceMotion]);

  const startFilm = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    setVideoError(false);
    video.muted = false;
    video.volume = 1;

    try {
      video.currentTime = 0;
      await video.play();
      setPhase("playing");
    } catch {
      setVideoError(true);
      setPhase("gate");
    }
  }, []);

  useEffect(() => {
    if (!initiallyVisible) {
      setVisible(false);
      return;
    }

    let forceIntro = false;
    try {
      forceIntro = new URLSearchParams(window.location.search).get("intro") === "1";
    } catch {
      forceIntro = false;
    }

    try {
      if (!forceIntro && sessionStorage.getItem("timilia_intro_seen")) {
        setVisible(false);
        return;
      }
    } catch {
      // Show intro when storage is unavailable.
    }

    setPhase("gate");
    setVisible(true);
  }, [initiallyVisible]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [visible]);

  const revealEnding = () => {
    if (phase !== "playing") return;

    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration;
    const currentTime = video.currentTime;
    if (Number.isFinite(duration) && duration > 0 && duration - currentTime <= 1.15) {
      setPhase("ready");
    }
  };

  if (!visible) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Ingresso nel mondo TIMILIA"
      className="fixed inset-0 z-[100] min-h-[100svh] overflow-hidden bg-black text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "leaving" ? 0 : 1 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.5 }}
    >
      <video
        ref={videoRef}
        src={VIDEO_URL}
        poster="/images/logo-timilia-original.jpg"
        preload="auto"
        playsInline
        controls={false}
        onTimeUpdate={revealEnding}
        onEnded={() => setPhase("ready")}
        onError={() => {
          setVideoError(true);
          setPhase("gate");
        }}
        className={`absolute inset-0 h-full w-full bg-black object-contain transition-opacity duration-700 md:object-cover ${
          phase === "gate" ? "opacity-0" : "opacity-100"
        }`}
      />

      <AnimatePresence mode="wait">
        {phase === "gate" && (
          <motion.div
            key="gate"
            className="absolute inset-0 z-20 flex items-center justify-center bg-black px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.45 }}
          >
            <div className="flex w-full max-w-2xl flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduceMotion ? 0.15 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-[clamp(8rem,24vw,14rem)] w-[min(76vw,24rem)]"
              >
                <Image
                  src="/images/logo-timilia-original.jpg"
                  alt="TIMILIA"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 76vw, 384px"
                  priority
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.18 }}
                className="mt-5 text-[0.68rem] font-light uppercase tracking-[0.28em] text-white/55 sm:text-xs"
              >
                Un&apos;esperienza da vedere. E da ascoltare.
              </motion.p>

              {!videoError ? (
                <motion.button
                  type="button"
                  onClick={startFilm}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.32 }}
                  whileHover={reduceMotion ? undefined : { scale: 1.035 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="group mt-8 flex items-center gap-4 rounded-full border border-white/30 bg-white/[0.035] px-7 py-4 text-xs font-medium uppercase tracking-[0.27em] text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white/35 transition-transform duration-300 group-hover:scale-110">
                    <span className="ml-0.5 text-[0.62rem]">▶</span>
                  </span>
                  Inizia
                </motion.button>
              ) : (
                <div className="mt-8 flex flex-col items-center gap-4">
                  <p className="max-w-md text-xs leading-relaxed tracking-[0.08em] text-white/45">
                    Il filmato non è disponibile in questo momento.
                  </p>
                  <button
                    type="button"
                    onClick={enterSite}
                    className="text-xs font-medium uppercase tracking-[0.24em] text-white underline decoration-white/30 underline-offset-8 transition-colors hover:text-white/70"
                  >
                    Entra nel sito
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(phase === "playing" || phase === "ready") && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {phase === "playing" && (
            <div className="pointer-events-none absolute left-5 top-5 z-20 flex items-center gap-2 text-[0.56rem] uppercase tracking-[0.25em] text-white/55 sm:left-7 sm:top-7">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/45" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white/80" />
              </span>
              Audio on
            </div>
          )}

          <button
            type="button"
            onClick={enterSite}
            className="absolute right-5 top-5 z-30 text-[0.58rem] uppercase tracking-[0.24em] text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:right-7 sm:top-7"
          >
            Salta intro
          </button>
        </>
      )}

      <AnimatePresence>
        {phase === "ready" && (
          <motion.div
            key="ending-cta"
            className="absolute inset-x-0 bottom-[max(2rem,6svh)] z-30 flex flex-col items-center px-6 text-center"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.18 : 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-3 text-[0.58rem] uppercase tracking-[0.32em] text-white/50">
              Pizzaioli per passione
            </span>
            <motion.button
              type="button"
              onClick={enterSite}
              whileHover={reduceMotion ? undefined : { scale: 1.025 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              className="group relative px-2 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:text-base sm:tracking-[0.24em]"
            >
              <span className="flex items-center gap-3">
                Entra nel mondo Timilia
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </span>
              <span className="absolute inset-x-2 bottom-1 h-px origin-left scale-x-[0.4] bg-white/35 transition-transform duration-500 group-hover:scale-x-100" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "leaving" && (
        <div className="pointer-events-none absolute inset-0 z-50 grid place-items-center overflow-hidden">
          <motion.div
            className="h-20 w-20 rounded-full bg-[#f5f1e8]"
            initial={{ scale: reduceMotion ? 45 : 0, opacity: 0 }}
            animate={{ scale: 45, opacity: 1 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.7, ease: [0.7, 0, 0.2, 1] }}
          />
        </div>
      )}
    </motion.div>
  );
}
