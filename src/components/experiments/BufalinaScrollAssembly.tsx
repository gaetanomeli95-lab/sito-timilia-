"use client";

import { motion } from "framer-motion";

const INGREDIENTS = [
  {
    step: "01",
    label: "Basilico",
    detail: "Il profumo che chiude la composizione.",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Basil.png",
    fit: "contain" as const,
  },
  {
    step: "02",
    label: "Salsa di pomodorino siccagno NP",
    detail: "La base intensa e pulita da cui parte tutto.",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tomato%20passata.jpg",
    fit: "cover" as const,
  },
  {
    step: "03",
    label: "Pomodorini confit",
    detail: "Dolcezza concentrata, succo e materia.",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tomato.png",
    fit: "contain" as const,
  },
  {
    step: "04",
    label: "Bufala DOP",
    detail: "Cremosa, autentica, protagonista.",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mozzarella%20di%20bufala3.jpg",
    fit: "cover" as const,
  },
  {
    step: "05",
    label: "Olio EVO",
    detail: "Il gesto finale: brillantezza, profumo, equilibrio.",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/OliveOil.png",
    fit: "contain" as const,
  },
  {
    step: "06",
    label: "Impasto",
    detail: "La struttura che accoglie tutto: tempo, aria e forno.",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pizza%201%20bg.jpg",
    fit: "cover" as const,
  },
];

function IngredientPhoto({
  src,
  alt,
  fit,
}: {
  src: string;
  alt: string;
  fit: "contain" | "cover";
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden">
      <div className="absolute inset-[9%] rounded-full bg-[radial-gradient(circle,rgba(194,117,50,.14),transparent_62%)] blur-2xl" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="relative z-10 h-full w-full"
        style={{
          objectFit: fit,
          objectPosition: "center",
          maskImage:
            "radial-gradient(ellipse 61% 61% at 50% 50%, #000 48%, rgba(0,0,0,.94) 60%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 61% 61% at 50% 50%, #000 48%, rgba(0,0,0,.94) 60%, transparent 82%)",
          filter: "contrast(1.08) saturate(1.08)",
        }}
      />
    </div>
  );
}

export default function BufalinaScrollAssembly() {
  return (
    <section className="relative overflow-clip bg-[#050403] text-[#f3eee5]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 77% 19%,rgba(159,78,25,.15),transparent 24%), radial-gradient(circle at 67% 69%,rgba(213,133,54,.08),transparent 25%), linear-gradient(180deg,#050403 0%,#090604 48%,#030302 100%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1540px] grid-cols-1 gap-8 px-5 pb-32 pt-28 md:px-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-14 lg:px-14 lg:pt-36">
        <aside className="relative z-20 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:self-start lg:pt-8">
          <div className="max-w-[470px]">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[.34em] text-[#d2aa72]">
              <span className="h-px w-10 bg-[#d2aa72]/70" />
              La materia prima, senza nascondigli
            </div>

            <h2 className="mt-7 font-serif text-[clamp(4rem,7.7vw,8.5rem)] font-light leading-[.84] tracking-[-.055em]">
              A Bufalina
            </h2>

            <div className="mt-8 h-px w-16 bg-[#d2aa72]/70" />

            <p className="mt-8 font-serif text-2xl leading-tight text-white/90 md:text-3xl">
              Pochi elementi.<br />Tutti decisivi.
            </p>

            <p className="mt-7 max-w-[390px] text-[15px] font-light leading-7 text-white/58">
              Salsa di pomodorino siccagno NP, bufala DOP, pomodorino confit,
              olio EVO e basilico. Scorrendo non smontiamo la pizza: attraversiamo
              la materia, ingrediente dopo ingrediente, fino alla A Bufalina vera.
            </p>

            <p className="mt-8 max-w-[340px] font-serif text-xl italic leading-relaxed text-white/72">
              Quando gli ingredienti sono veri, non serve aggiungere rumore.
            </p>

            <div className="mt-12 hidden items-center gap-4 lg:flex">
              <span className="block h-14 w-px bg-gradient-to-b from-[#d2aa72] to-transparent" />
              <span className="text-[9px] uppercase tracking-[.3em] text-white/38">
                Scroll<br />come nasce
              </span>
            </div>
          </div>
        </aside>

        <div className="relative z-10">
          <div className="pointer-events-none absolute bottom-[13%] left-[42%] top-8 hidden w-px bg-gradient-to-b from-transparent via-[#c89554]/20 to-transparent md:block" />

          {INGREDIENTS.map((ingredient, index) => (
            <motion.article
              key={ingredient.step}
              initial={{ opacity: 0.22, y: 34, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.42 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex min-h-[78vh] items-center py-16 md:min-h-[88vh] md:py-24"
            >
              <div className="grid w-full items-center gap-6 md:grid-cols-[1.28fr_.72fr] md:gap-4">
                <div className="relative">
                  <IngredientPhoto
                    src={ingredient.image}
                    alt={ingredient.label}
                    fit={ingredient.fit}
                  />
                  <div className="pointer-events-none absolute bottom-[11%] left-1/2 h-10 w-[58%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-xl" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.72 }}
                  transition={{ duration: 0.55, delay: 0.12 }}
                  className="relative md:-ml-3"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-px w-10 bg-[#d2aa72]/55 md:w-16" />
                    <span className="font-mono text-[10px] tracking-[.2em] text-[#d2aa72]">
                      {ingredient.step}
                    </span>
                  </div>
                  <h3 className="max-w-[320px] text-[13px] uppercase tracking-[.17em] text-white/88 md:text-[14px]">
                    {ingredient.label}
                  </h3>
                  <p className="mt-2 max-w-[290px] font-serif text-lg italic leading-relaxed text-white/56">
                    {ingredient.detail}
                  </p>
                  {index < INGREDIENTS.length - 1 && (
                    <div className="mt-8 text-[9px] uppercase tracking-[.28em] text-white/23">
                      ↓ continua
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.article>
          ))}

          <motion.article
            initial={{ opacity: 0.15, y: 42, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex min-h-screen items-center py-20 md:py-28"
          >
            <div className="w-full">
              <div className="mb-7 flex items-center gap-3 md:justify-end md:pr-[10%]">
                <span className="h-px w-12 bg-[#d2aa72]/60" />
                <span className="font-mono text-[10px] tracking-[.22em] text-[#d2aa72]">07</span>
                <span className="text-[11px] uppercase tracking-[.2em] text-white/64">Nasce A Bufalina</span>
              </div>

              <div className="relative mx-auto max-w-[900px]">
                <div className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(218,111,38,.19),transparent_64%)] blur-3xl" />
                <motion.img
                  src="/images/menu-story/bufalina.png"
                  alt="Pizza A Bufalina di Timilia"
                  className="relative z-10 mx-auto block h-auto w-full object-contain drop-shadow-[0_55px_55px_rgba(0,0,0,.6)]"
                  initial={{ scale: 0.92, rotate: -1.2 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <div className="mx-auto mt-4 grid max-w-[900px] gap-5 border-t border-white/10 pt-7 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <div className="text-[10px] uppercase tracking-[.32em] text-[#d2aa72]">A Bufalina</div>
                  <p className="mt-3 max-w-xl font-serif text-2xl leading-tight text-white/88 md:text-3xl">
                    Gli ingredienti non crollano dentro la pizza. Il percorso termina qui:
                    nella pizza reale, intera, protagonista.
                  </p>
                </div>
                <div className="text-[9px] uppercase tracking-[.28em] text-white/34 md:text-right">
                  Timilia<br />Pizzaioli per passione
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
