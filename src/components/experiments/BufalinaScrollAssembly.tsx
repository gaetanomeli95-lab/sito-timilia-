"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";

type Ingredient = {
  key: string;
  step: string;
  label: string;
  detail: string;
  accent: string;
  image?: string;
  imageFit?: "contain" | "cover";
  align: "left" | "right";
  cluster: { x: number; y: number; scale: number; rotate: number };
};

const INGREDIENTS: Ingredient[] = [
  {
    key: "basilico",
    step: "01",
    label: "Basilico",
    detail: "Profumo netto, fresco. Il gesto che chiude la composizione.",
    accent: "#6d8b3d",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Basil.png",
    imageFit: "contain",
    align: "right",
    cluster: { x: 92, y: -128, scale: 0.46, rotate: 9 },
  },
  {
    key: "salsa",
    step: "02",
    label: "Salsa di pomodorino siccagno NP",
    detail: "Intensità e profondità. La base aromatica della A Bufalina.",
    accent: "#9e2d1f",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tomato%20passata.jpg",
    imageFit: "cover",
    align: "left",
    cluster: { x: -74, y: -70, scale: 0.42, rotate: -7 },
  },
  {
    key: "pomodorini",
    step: "03",
    label: "Pomodorini confit",
    detail: "Dolcezza concentrata, piccoli punti di luce e sapore.",
    accent: "#bd3f24",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tomato.png",
    imageFit: "contain",
    align: "right",
    cluster: { x: 95, y: -28, scale: 0.39, rotate: 11 },
  },
  {
    key: "bufala",
    step: "04",
    label: "Bufala DOP",
    detail: "Cremosa, piena, protagonista. Morbidezza senza rumore.",
    accent: "#eee5d1",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mozzarella%20di%20bufala3.jpg",
    imageFit: "cover",
    align: "left",
    cluster: { x: -28, y: 18, scale: 0.48, rotate: -4 },
  },
  {
    key: "olio",
    step: "05",
    label: "Olio EVO",
    detail: "Il finale: luce, materia, brillantezza. Poche gocce, precise.",
    accent: "#d5a02b",
    align: "right",
    cluster: { x: 52, y: 78, scale: 0.58, rotate: 0 },
  },
  {
    key: "impasto",
    step: "06",
    label: "Impasto",
    detail: "La struttura che tiene tutto insieme: tempo, equilibrio e forno.",
    accent: "#c8a274",
    image: "/images/menu-story/mani-tommaso.jpeg",
    imageFit: "cover",
    align: "left",
    cluster: { x: 0, y: 126, scale: 0.44, rotate: 0 },
  },
];

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function OilVisual({ intensity = 1 }: { intensity?: number }) {
  const drops = [
    [48, 8, 15],
    [18, 52, 8],
    [78, 49, 10],
    [34, 83, 9],
    [69, 86, 6],
  ];
  return (
    <div className="relative h-full w-full">
      {drops.map(([x, y, size], index) => (
        <div
          key={index}
          className="absolute rounded-[48%_52%_58%_42%/62%_46%_54%_38%] shadow-[0_12px_26px_rgba(196,134,27,.22)]"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}%`,
            aspectRatio: "0.72",
            transform: `translate(-50%,-50%) rotate(${index % 2 ? 12 : -8}deg) scale(${intensity})`,
            background:
              "radial-gradient(circle at 31% 23%, rgba(255,250,205,.92) 0 7%, rgba(255,220,92,.9) 14%, rgba(203,137,23,.95) 48%, rgba(108,67,8,.96) 100%)",
            boxShadow:
              "inset -8px -12px 18px rgba(62,35,0,.35), inset 7px 8px 13px rgba(255,248,180,.28), 0 18px 30px rgba(0,0,0,.35)",
          }}
        />
      ))}
    </div>
  );
}

function IngredientVisual({ ingredient }: { ingredient: Ingredient }) {
  if (ingredient.key === "olio") {
    return (
      <div className="h-[330px] w-[280px] md:h-[430px] md:w-[360px]">
        <OilVisual />
      </div>
    );
  }

  return (
    <div
      className="relative h-[320px] w-[320px] overflow-hidden rounded-[42%] md:h-[440px] md:w-[440px]"
      style={{
        maskImage:
          "radial-gradient(ellipse 66% 66% at 50% 50%, #000 58%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 66% 66% at 50% 50%, #000 58%, transparent 100%)",
      }}
    >
      <img
        src={ingredient.image}
        alt={ingredient.label}
        className="h-full w-full"
        style={{
          objectFit: ingredient.imageFit ?? "contain",
          filter:
            ingredient.key === "salsa"
              ? "saturate(1.35) contrast(1.15) brightness(.92)"
              : ingredient.key === "bufala"
                ? "saturate(.82) contrast(1.08) brightness(1.04)"
                : "saturate(1.13) contrast(1.08)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 38%, rgba(5,4,3,.12) 62%, rgba(5,4,3,.94) 100%)",
        }}
      />
    </div>
  );
}

export default function BufalinaScrollAssembly() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => setProgress(value));

  const totalStages = INGREDIENTS.length + 1;
  const stage = progress * totalStages;
  const activeIndex = Math.min(
    totalStages - 1,
    Math.max(0, Math.floor(stage)),
  );
  const local = stage - activeIndex;
  const finalReveal = clamp((stage - INGREDIENTS.length + 0.05) / 0.88);

  const glow = useMemo(
    () =>
      "radial-gradient(circle at 61% 44%, rgba(169,92,32,.16), transparent 27%), radial-gradient(circle at 22% 26%, rgba(96,48,20,.11), transparent 22%), linear-gradient(180deg,#050403 0%,#090604 55%,#030302 100%)",
    [],
  );

  return (
    <section
      ref={ref}
      className="relative bg-[#050403] text-white"
      style={{ minHeight: `${totalStages * 105}vh`, background: glow }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 72% 80%, rgba(228,116,38,.10), transparent 21%), radial-gradient(circle at 47% 52%, rgba(255,203,122,.05), transparent 31%)",
          }}
        />

        <div className="relative mx-auto grid h-full max-w-[1560px] grid-cols-1 items-center gap-3 px-5 pb-10 pt-24 md:px-10 lg:grid-cols-[.72fr_1.28fr] lg:px-14">
          <div className="relative z-30 max-w-xl self-center">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#cda66c]/70" />
              <span className="text-[10px] uppercase tracking-[.34em] text-[#cda66c]">
                La materia prima, senza nascondigli
              </span>
            </div>
            <h2 className="mt-6 text-[clamp(3.4rem,7vw,7.7rem)] font-light leading-[.86] tracking-[-.055em]">
              A Bufalina
            </h2>
            <p className="mt-7 max-w-md text-xl font-light text-white/84 md:text-2xl">
              Pochi elementi. Tutti decisivi.
            </p>
            <p className="mt-4 max-w-md text-sm font-light leading-7 text-white/48 md:text-base">
              Scorri lentamente. Ogni ingrediente entra da solo, trova il suo posto e lascia spazio al successivo. Alla fine resta soltanto la pizza.
            </p>

            <div className="mt-9 hidden max-w-[360px] md:block">
              {INGREDIENTS.map((ingredient, index) => {
                const passed = stage > index + 0.55;
                const current = activeIndex === index;
                return (
                  <div
                    key={ingredient.key}
                    className="grid grid-cols-[38px_1fr] items-center gap-3 py-1.5 transition-opacity duration-300"
                    style={{ opacity: current ? 1 : passed ? 0.42 : 0.18 }}
                  >
                    <span className="font-mono text-[9px] tracking-[.18em] text-[#cda66c]">
                      {ingredient.step}
                    </span>
                    <span className="text-[10px] uppercase tracking-[.17em] text-white/75">
                      {ingredient.label}
                    </span>
                  </div>
                );
              })}
              <div
                className="grid grid-cols-[38px_1fr] items-center gap-3 py-1.5 transition-opacity duration-300"
                style={{ opacity: activeIndex === INGREDIENTS.length ? 1 : 0.18 }}
              >
                <span className="font-mono text-[9px] tracking-[.18em] text-[#cda66c]">07</span>
                <span className="text-[10px] uppercase tracking-[.17em] text-white/75">A Bufalina</span>
              </div>
            </div>
          </div>

          <div
            className="relative h-[58vh] min-h-[430px] md:h-[72vh] lg:h-[82vh]"
            onPointerMove={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              setPointer({
                x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
                y: ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
              });
            }}
            onPointerLeave={() => setPointer({ x: 0, y: 0 })}
          >
            <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1450px" }}>
              <motion.div
                className="relative h-full w-full max-w-[820px]"
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        rotateX: pointer.y * -2.4,
                        rotateY: pointer.x * 3.2,
                      }
                }
                transition={{ type: "spring", stiffness: 95, damping: 18 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {INGREDIENTS.map((ingredient, index) => {
                  const distance = stage - index;
                  const enter = ease(clamp(distance / 0.72));
                  const leave = ease(clamp((distance - 0.62) / 0.9));
                  const currentOpacity = clamp(enter * (1 - leave * 0.78));
                  const alreadyPlaced = distance > 1.05;
                  const clusterOpacity = alreadyPlaced ? clamp(0.28 + (1 - finalReveal) * 0.28) : 0;
                  const calloutOpacity = clamp(enter * (1 - ease(clamp((distance - 0.55) / 0.42))));
                  const direction = ingredient.align === "left" ? -1 : 1;
                  const enterX = direction * (1 - enter) * 150;
                  const enterY = (1 - enter) * 92;
                  const activeScale = 0.82 + enter * 0.18 - leave * 0.08;

                  return (
                    <div key={ingredient.key} className="absolute inset-0">
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{
                          opacity: currentOpacity * (1 - finalReveal),
                          transform: `translate(calc(-50% + ${enterX}px), calc(-50% + ${enterY}px)) scale(${activeScale})`,
                          transition: "opacity 80ms linear",
                          filter: "drop-shadow(0 34px 38px rgba(0,0,0,.44))",
                        }}
                      >
                        <IngredientVisual ingredient={ingredient} />
                      </div>

                      <div
                        className="absolute left-1/2 top-1/2 hidden md:block"
                        style={{
                          opacity: calloutOpacity * (1 - finalReveal),
                          transform: `translate(${ingredient.align === "right" ? 190 : -470}px, -25px)`,
                          width: 260,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {ingredient.align === "right" && <span className="h-px flex-1 bg-white/24" />}
                          <span className="font-mono text-[10px] tracking-[.18em] text-[#cda66c]">
                            {ingredient.step}
                          </span>
                          {ingredient.align === "left" && <span className="h-px flex-1 bg-white/24" />}
                        </div>
                        <div className={`mt-3 ${ingredient.align === "left" ? "text-right" : "text-left"}`}>
                          <div className="text-[12px] uppercase tracking-[.16em] text-white/92">
                            {ingredient.label}
                          </div>
                          <p className="mt-2 text-xs leading-5 text-white/48">
                            {ingredient.detail}
                          </p>
                        </div>
                      </div>

                      <div
                        className="absolute left-1/2 top-1/2"
                        style={{
                          opacity: clusterOpacity,
                          transform: `translate(calc(-50% + ${ingredient.cluster.x}px), calc(-50% + ${ingredient.cluster.y}px)) scale(${ingredient.cluster.scale}) rotate(${ingredient.cluster.rotate}deg)`,
                          filter: "saturate(.85) brightness(.66) blur(.15px)",
                        }}
                      >
                        <IngredientVisual ingredient={ingredient} />
                      </div>
                    </div>
                  );
                })}

                <div
                  className="absolute inset-[8%] flex items-center justify-center"
                  style={{
                    opacity: finalReveal,
                    transform: `translateY(${(1 - finalReveal) * 54}px) scale(${0.84 + finalReveal * 0.16}) rotateX(${(1 - finalReveal) * 7}deg)`,
                    transition: "opacity 70ms linear",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="relative h-full w-full">
                    <div className="absolute inset-x-[7%] bottom-[6%] h-[18%] rounded-[50%] bg-black/70 blur-3xl" />
                    <img
                      src="/images/menu-story/bufalina.png"
                      alt="A Bufalina di Timilia"
                      className="absolute inset-0 h-full w-full object-contain"
                      style={{
                        filter:
                          "drop-shadow(0 42px 54px rgba(0,0,0,.62)) saturate(1.08) contrast(1.03)",
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-[10%] rounded-full opacity-60"
                      style={{
                        background:
                          "radial-gradient(circle, transparent 46%, rgba(221,151,63,.08) 70%, transparent 78%)",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
              <div className="mx-auto h-10 w-px bg-gradient-to-b from-[#cda66c]/70 to-transparent" />
              <span className="mt-2 block whitespace-nowrap text-[9px] uppercase tracking-[.28em] text-white/30">
                {activeIndex < INGREDIENTS.length
                  ? `${INGREDIENTS[activeIndex].step} · ${INGREDIENTS[activeIndex].label}`
                  : "07 · nasce A Bufalina"}
              </span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 xl:block">
          <div className="flex flex-col items-center gap-3">
            {Array.from({ length: totalStages }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: activeIndex === index ? 7 : 4,
                    height: activeIndex === index ? 7 : 4,
                    background: activeIndex === index ? "#cda66c" : "rgba(255,255,255,.22)",
                    boxShadow: activeIndex === index ? "0 0 22px rgba(205,166,108,.45)" : "none",
                  }}
                />
                {index < totalStages - 1 && <span className="h-4 w-px bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
