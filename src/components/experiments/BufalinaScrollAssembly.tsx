"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const SCRUB_VIDEO =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_3J5bcdAgqMsyUqzT0zx6yGprNjK/7de60764-4523-43e7-9610-d28f135247d4.mp4";

const STAGES = [
  { from: 0.00, to: 0.16, step: "01", label: "La materia", detail: "Ogni elemento entra nello spazio." },
  { from: 0.16, to: 0.31, step: "02", label: "Pomodorino siccagno NP", detail: "Il rosso prende forma." },
  { from: 0.31, to: 0.46, step: "03", label: "Bufala DOP", detail: "Volume, morbidezza, contrasto." },
  { from: 0.46, to: 0.61, step: "04", label: "Pomodorino confit", detail: "La concentrazione." },
  { from: 0.61, to: 0.75, step: "05", label: "Basilico · Olio EVO", detail: "Il gesto finale." },
  { from: 0.75, to: 0.88, step: "06", label: "Assemblaggio", detail: "Tutto converge verso il centro." },
  { from: 0.88, to: 1.01, step: "07", label: "A Bufalina", detail: "Quella vera." },
] as const;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};

export default function BufalinaScrollAssembly() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(8);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const onMeta = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
      targetTimeRef.current = 0.001;
      currentTimeRef.current = 0.001;
      try {
        video.currentTime = 0.001;
      } catch {}
      setReady(true);
    };

    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.18,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = clamp(self.progress);
        setProgress(p);
        // Keep the last frames of the generated film out of the hero reveal.
        // The true Timilia photo takes over from 88% onward.
        const filmProgress = Math.min(0.92, p / 0.88 * 0.92);
        targetTimeRef.current = filmProgress * durationRef.current;
      },
    });

    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v && v.readyState >= 2) {
        // Damped seeking makes wheel/trackpad scrolling feel continuous while still
        // allowing reverse scroll. The source video has a 6-frame GOP for fast seeking.
        currentTimeRef.current += (targetTimeRef.current - currentTimeRef.current) * 0.34;
        const next = Math.max(0.001, Math.min(durationRef.current - 0.02, currentTimeRef.current));
        if (Math.abs(v.currentTime - next) > 0.015) {
          try {
            v.currentTime = next;
          } catch {}
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      cancelAnimationFrame(raf);
      trigger.kill();
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  const stage = useMemo(
    () => STAGES.find((item) => progress >= item.from && progress < item.to) ?? STAGES[STAGES.length - 1],
    [progress],
  );

  const reveal = smooth((progress - 0.875) / 0.125);
  const flare = Math.sin(clamp((progress - 0.79) / 0.15) * Math.PI) * (progress < 0.95 ? 1 : 0);
  const introFade = smooth(progress / 0.12);

  return (
    <section ref={sectionRef} className="relative h-[650vh] bg-[#020101] text-[#f5eee6]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#020101]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 68% 48%,rgba(124,50,15,.18),transparent 26%),linear-gradient(180deg,#020101 0%,#070302 55%,#020101 100%)",
          }}
        />

        <div className="absolute inset-0 lg:left-[31%]">
          <video
            ref={videoRef}
            src={SCRUB_VIDEO}
            muted
            playsInline
            preload="auto"
            aria-label="Ingredienti di A Bufalina che convergono e si assemblano"
            className="h-full w-full object-cover object-center md:object-contain"
            style={{ opacity: ready ? 1 - reveal : 0 }}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg,#020101 0%,rgba(2,1,1,.95) 4%,rgba(2,1,1,.38) 22%,transparent 45%),linear-gradient(180deg,rgba(2,1,1,.2),transparent 20%,transparent 78%,rgba(2,1,1,.72))",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-5"
            style={{
              opacity: reveal,
              transform: `scale(${0.94 + reveal * 0.06})`,
            }}
          >
            <div className="relative h-full w-full max-w-[1040px]">
              <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(208,91,25,.23),transparent_63%)] blur-3xl" />
              <img
                src="/images/menu-story/bufalina.png"
                alt="Pizza A Bufalina di Timilia: salsa di pomodorino siccagno NP, bufala DOP, pomodorino confit, olio EVO e basilico"
                className="relative z-10 mx-auto h-full max-h-screen w-full object-contain drop-shadow-[0_55px_65px_rgba(0,0,0,.78)]"
              />
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-20 mix-blend-screen"
          style={{
            opacity: flare * 0.42,
            background: "radial-gradient(circle at 64% 57%,rgba(255,177,88,.92),transparent 18%)",
          }}
        />

        <div className="relative z-30 mx-auto flex h-full max-w-[1600px] items-end px-6 pb-10 pt-24 md:items-center md:px-10 md:pb-0 lg:px-14">
          <div
            className="w-full max-w-[470px] rounded-[2px] md:bg-transparent"
            style={{ opacity: 0.78 + introFade * 0.22 }}
          >
            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[.34em] text-[#d6ad76]">
              <span className="h-px w-9 bg-[#d6ad76]/70" />
              La materia prima, senza nascondigli
            </div>

            <h2 className="mt-5 font-serif text-[clamp(3.7rem,7vw,8rem)] font-light leading-[.82] tracking-[-.055em]">
              A Bufalina
            </h2>
            <p className="mt-6 font-serif text-xl leading-tight text-white/82 md:text-3xl">
              Pochi elementi.<br />Tutti decisivi.
            </p>

            <div className="mt-8 grid grid-cols-[42px_1fr] gap-4 border-t border-white/12 pt-5 md:mt-10">
              <div className="font-mono text-[10px] tracking-[.2em] text-[#d6ad76]">{stage.step}</div>
              <div>
                <div className="text-[10px] uppercase tracking-[.25em] text-[#d6ad76]">{stage.label}</div>
                <p className="mt-2 max-w-[340px] font-serif text-lg italic leading-snug text-white/65 md:text-xl">
                  {stage.detail}
                </p>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <div className="h-px w-32 overflow-hidden bg-white/12">
                <div className="h-full bg-[#d6ad76]" style={{ width: `${progress * 100}%` }} />
              </div>
              <span className="font-mono text-[9px] tracking-[.16em] text-white/35">{Math.round(progress * 100)}%</span>
            </div>
            <div className="mt-4 text-[8px] uppercase tracking-[.3em] text-white/32">
              Scroll · avanti e indietro
            </div>
          </div>
        </div>

        {!ready && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#020101] text-[9px] uppercase tracking-[.3em] text-white/35">
            Preparazione esperienza…
          </div>
        )}
      </div>
    </section>
  );
}
