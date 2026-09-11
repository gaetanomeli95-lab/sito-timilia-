"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const VIDEO_URL = "https://d2ol7oe51mr4n9.cloudfront.net/user_3J5bcdAgqMsyUqzT0zx6yGprNjK/ccfb3b9c-b304-4c16-807a-5455a37256a9.mp4";
const LIVE_SITE = "https://pizzeriatimilia.com";

type Phase = "gate" | "playing" | "ready" | "leaving";

export default function IntroPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefersReducedMotion === true;
  const [phase, setPhase] = useState<Phase>("gate");
  const [mediaError, setMediaError] = useState(false);

  const leave = useCallback(() => {
    if (phase === "leaving") return;
    setPhase("leaving");
    videoRef.current?.pause();
    window.setTimeout(() => {
      window.location.assign(LIVE_SITE);
    }, reduceMotion ? 120 : 850);
  }, [phase, reduceMotion]);

  const start = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    setMediaError(false);
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    setPhase("playing");

    try {
      await video.play();
    } catch {
      setPhase("gate");
      setMediaError(true);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") leave();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [leave]);

  const revealEnding = () => {
    const video = videoRef.current;
    if (phase !== "playing" || !video || !Number.isFinite(video.duration)) return;
    if (video.duration - video.currentTime <= 1.05) setPhase("ready");
  };

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        preload="auto"
        playsInline
        controls={false}
        onTimeUpdate={revealEnding}
        onEnded={() => setPhase("ready")}
        onError={() => {
          setMediaError(true);
          setPhase("gate");
        }}
        className={`absolute inset-0 h-full w-full object-contain md:object-cover transition-opacity duration-700 ${
          phase === "gate" ? "opacity-0" : "opacity-100"
        }`}
      />

      <AnimatePresence>
        {phase === "gate" && (
          <motion.section
            key="gate"
            className="absolute inset-0 z-20 flex items-center justify-center bg-black px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.5 }}
          >
            <div className="flex w-full max-w-2xl flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.965 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduceMotion ? 0.15 : 0.75, ease: [0.22, 1, 0.36, 1] }}
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
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.2 }}
                className="mt-5 text-[0.68rem] font-light uppercase tracking-[0.28em] text-white/55 sm:text-xs"
              >
                Un&apos;esperienza da vedere. E da ascoltare.
              </motion.p>

              <motion.button
                type="button"
                onClick={start}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.35 }}
                whileHover={reduceMotion ? undefined : { scale: 1.035 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="group mt-8 flex items-center gap-4 rounded-full border border-white/30 bg-white/[0.035] px-7 py-4 text-xs font-medium uppercase tracking-[0.27em] text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/[0.08]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/35 transition-transform duration-300 group-hover:scale-110">
                  <span className="ml-0.5 text-[0.62rem]">▶</span>
                </span>
                Inizia
              </motion.button>

              {mediaError && (
                <p className="mt-5 max-w-md text-xs leading-relaxed tracking-[0.05em] text-white/50">
                  Il browser non ha avviato il filmato. Tocca di nuovo “Inizia”.
                </p>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {(phase === "playing" || phase === "ready") && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-52 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          {phase === "playing" && (
            <motion.div
              className="pointer-events-none absolute left-5 top-5 z-20 flex items-center gap-2 text-[0.56rem] uppercase tracking-[0.25em] text-white/55 sm:left-7 sm:top-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white/80" />
              </span>
              Audio on
            </motion.div>
          )}
          <button
            type="button"
            onClick={leave}
            className="absolute right-5 top-5 z-30 text-[0.58rem] uppercase tracking-[0.24em] text-white/50 transition-colors hover:text-white sm:right-7 sm:top-7"
          >
            Salta intro
          </button>
        </>
      )}

      <AnimatePresence>
        {phase === "ready" && (
          <motion.div
            key="ending"
            className="absolute inset-x-0 bottom-[max(2.25rem,7svh)] z-30 flex flex-col items-center px-6 text-center"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.18 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-3 text-[0.58rem] uppercase tracking-[0.32em] text-white/48">
              Pizzaioli per passione
            </span>
            <motion.button
              type="button"
              onClick={leave}
              whileHover={reduceMotion ? undefined : { scale: 1.025 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              className="group relative px-2 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white sm:text-base sm:tracking-[0.24em]"
            >
              <span className="flex items-center gap-3">
                Entra nel mondo Timilia
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
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
            transition={{ duration: reduceMotion ? 0.12 : 0.78, ease: [0.7, 0, 0.2, 1] }}
          />
        </div>
      )}
    </main>
  );
}
