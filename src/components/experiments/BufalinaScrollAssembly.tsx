"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

const MODEL_URL = "https://d2ol7oe51mr4n9.cloudfront.net/user_3J5bcdAgqMsyUqzT0zx6yGprNjK/a6b3ee8a-244a-4a33-a4cc-162aaf52c069.glb";

const STAGES = [
  { from: 0.00, to: 0.18, label: "Salsa di pomodorino siccagno NP", detail: "Il pomodoro, scelto prima del forno" },
  { from: 0.18, to: 0.34, label: "Pomodorino confit", detail: "La concentrazione" },
  { from: 0.34, to: 0.50, label: "Bufala DOP", detail: "La mozzarella, senza compromessi" },
  { from: 0.50, to: 0.66, label: "Basilico", detail: "Il finale, semplice" },
  { from: 0.66, to: 0.80, label: "Olio EVO", detail: "Il gesto finale" },
  { from: 0.80, to: 0.90, label: "Impasto", detail: "La base prende forma" },
  { from: 0.90, to: 1.01, label: "A Bufalina", detail: "La pizza reale" },
];

type ModelViewerElement = HTMLElement & {
  duration?: number;
  currentTime?: number;
  pause?: () => void;
};

export default function BufalinaScrollAssembly() {
  const sectionRef = useRef<HTMLElement>(null);
  const modelRef = useRef<ModelViewerElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -rect.top / total));
      setProgress(p);
      const mv = modelRef.current;
      if (mv && ready && typeof mv.duration === "number" && mv.duration > 0) {
        mv.pause?.();
        mv.currentTime = Math.min(mv.duration, p * mv.duration);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ready]);

  const stage = useMemo(
    () => STAGES.find((s) => progress >= s.from && progress < s.to) ?? STAGES[STAGES.length - 1],
    [progress],
  );

  const reveal = Math.min(1, Math.max(0, (progress - 0.90) / 0.10));

  return (
    <>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js"
        strategy="afterInteractive"
      />

      <section ref={sectionRef} className="relative h-[700vh] bg-[#030201] text-[#f4eee5]">
        <div className="sticky top-0 h-screen overflow-hidden bg-[radial-gradient(circle_at_58%_44%,rgba(145,76,26,.18),transparent_28%),linear-gradient(180deg,#030201,#070402_65%,#020101)]">
          <div className="mx-auto grid h-full max-w-[1600px] grid-cols-1 lg:grid-cols-[.72fr_1.28fr]">
            <div className="relative z-30 flex flex-col justify-center px-6 pt-24 lg:px-14 lg:pt-16">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[.34em] text-[#d2aa72]">
                <span className="h-px w-10 bg-[#d2aa72]/70" />
                La materia prima, senza nascondigli
              </div>
              <h1 className="mt-6 font-serif text-[clamp(4rem,7vw,8rem)] font-light leading-[.85] tracking-[-.05em]">A Bufalina</h1>
              <p className="mt-7 font-serif text-2xl text-white/88 md:text-3xl">Pochi elementi.<br />Tutti decisivi.</p>
              <div className="mt-10 max-w-[360px] border-l border-[#d2aa72]/40 pl-5">
                <div className="text-[10px] uppercase tracking-[.26em] text-[#d2aa72]">{stage.label}</div>
                <p className="mt-2 font-serif text-xl italic text-white/68">{stage.detail}</p>
              </div>
              <div className="mt-10 text-[9px] uppercase tracking-[.28em] text-white/35">Scroll · il 3D segue il tuo movimento</div>
            </div>

            <div className="relative min-h-0">
              {typeof window !== "undefined" &&
                (globalThis as any).React?.createElement?.("model-viewer", {
                  ref: (node: ModelViewerElement | null) => {
                    modelRef.current = node;
                  },
                  src: MODEL_URL,
                  autoplay: true,
                  "camera-controls": true,
                  "interaction-prompt": "none",
                  "shadow-intensity": "1.4",
                  exposure: "1.1",
                  style: {
                    width: "100%",
                    height: "100%",
                    minHeight: "100vh",
                    background: "transparent",
                    opacity: 1 - reveal,
                    transition: "opacity 80ms linear",
                  },
                  onLoad: () => {
                    setReady(true);
                    modelRef.current?.pause?.();
                  },
                })}

              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 pt-20"
                style={{ opacity: reveal, transform: `scale(${0.94 + reveal * 0.06})`, transition: "opacity 80ms linear" }}
              >
                <div className="relative w-full max-w-[980px]">
                  <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(219,104,29,.2),transparent_64%)] blur-3xl" />
                  <img
                    src="/images/menu-story/bufalina.png"
                    alt="Pizza A Bufalina di Timilia"
                    className="relative z-10 mx-auto block max-h-[82vh] w-full object-contain drop-shadow-[0_55px_55px_rgba(0,0,0,.7)]"
                  />
                </div>
              </div>

              <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 lg:block">
                <div className="flex items-center gap-3">
                  <span className="h-px w-14 bg-[#d2aa72]/50" />
                  <div>
                    <div className="text-[11px] uppercase tracking-[.2em] text-white/90">{stage.label}</div>
                    <div className="mt-1 font-serif text-sm italic text-white/52">{stage.detail}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
