"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const chapters = [
  {
    kicker: "Via Maqueda · Palermo",
    title: "Una pizzeria viva, davvero.",
    body: [
      "Timilia nasce nel cuore di Palermo, lungo Via Maqueda, dove la città non fa semplicemente da sfondo: si sente nelle voci, nel movimento, nei profumi e nell’energia che accompagna ogni giornata.",
      "Non cerchiamo il silenzio di una sala formale, ma qualcosa di più autentico: il piacere di stare insieme, la curiosità di scegliere una pizza diversa dal solito e il profumo dell’impasto appena sfornato, nel pieno del centro storico.",
    ],
    image: "/images/ambient-experience.png",
    imageAlt: "Atmosfera di Timilia nel centro storico di Palermo",
    imagePosition: "center",
    visualLabel: "Via Maqueda, Palermo · il luogo",
  },
  {
    kicker: "Materia · tempo · fermentazione",
    title: "Tutto comincia dall’impasto.",
    body: [
      "Per noi la pizza non è soltanto una base sulla quale adagiare degli ingredienti. È ricerca, tempo, fermentazione e materia.",
      "La Timilia, antico grano siciliano che dà il nome alla nostra pizzeria, racconta una parte della nostra filosofia: partire dalla Sicilia, dalle sue radici e dai suoi sapori, per costruire qualcosa di contemporaneo.",
    ],
    image: "/images/menu-hero.jpg",
    imageAlt: "Pizza e impasto Timilia",
    imagePosition: "center",
    visualLabel: "Farina · ricerca · impasto",
  },
  {
    kicker: "Il ritmo delle cose fatte bene",
    title: "Il tempo è uno dei nostri ingredienti.",
    body: [
      "Da Timilia può capitare di aspettare, soprattutto quando Via Maqueda si riempie e tante persone scelgono di venirci a trovare nello stesso momento.",
      "Il nostro impasto aspetta. Le fermentazioni hanno bisogno del loro tempo. Il forno ha i suoi ritmi. E una pizza preparata al momento non ama avere fretta.",
    ],
    image: "/images/hero-banner-nuova.png",
    imageAlt: "Il lavoro e i tempi della pizza Timilia",
    imagePosition: "center",
    visualLabel: "Tempo · fermentazione · forno",
  },
  {
    kicker: "Il carattere del posto",
    title: "Una pizzeria piena è una pizzeria che vive.",
    body: [
      "Timilia può essere rumorosa, affollata, intensa. Persone che aspettano fuori, tavoli che ridono, camerieri che attraversano la sala e pizze che escono dal forno una dopo l’altra.",
      "Siamo nel centro storico di Palermo e non vogliamo cancellarne l’energia. Vogliamo farne parte.",
    ],
    image: "/images/ambient-experience-2.png",
    imageAlt: "Dettagli e atmosfera della sala Timilia",
    imagePosition: "center",
    visualLabel: "Voci · tavoli · energia",
  },
  {
    kicker: "Identità prima del consenso",
    title: "Non cerchiamo la pizza perfetta per tutti.",
    body: [
      "La pizza è profondamente personale. C’è chi ama un cornicione importante e chi lo preferisce sottile, chi cerca la tradizione e chi vuole essere sorpreso.",
      "Cerchiamo una pizza riconoscibile, con una nostra idea di impasto, una nostra selezione delle materie prime e una nostra maniera di interpretare la Sicilia. Avere un’identità significa anche avere il coraggio di non assomigliare a tutti gli altri.",
    ],
    image: "/images/brand-details.png",
    imageAlt: "Dettagli dell'identità visiva e materica Timilia",
    imagePosition: "center",
    visualLabel: "Identità · materia · Sicilia",
  },
  {
    kicker: "Ascoltare · capire · migliorare",
    title: "Un progetto che continua a crescere.",
    body: [
      "Ascoltiamo ciò che ci viene detto. I complimenti ci fanno piacere, ma spesso sono proprio le osservazioni più critiche ad aiutarci a migliorare.",
      "Timilia non è un progetto concluso: è un luogo che continua a crescere, sperimentare e correggersi ogni giorno.",
    ],
    image: "/images/hero-banner.jpg",
    imageAlt: "Esperienza e ricerca continua Timilia",
    imagePosition: "center",
    visualLabel: "Crescere · sperimentare · migliorare",
  },
];

const doughs = [
  {
    number: "01",
    name: "Contemporaneo",
    desc: "Soffice, alveolato, fragrante. Un impasto che nasce dal tempo e da una lunga fermentazione.",
  },
  {
    number: "02",
    name: "Crusta",
    desc: "Più sottile, croccante e diretta. Il morso cambia, l’identità Timilia rimane.",
  },
  {
    number: "03",
    name: "Rotondo in casseruola",
    desc: "Soffice e morbido, lievitato con cura per una struttura uniforme e una consistenza setosa.",
  },
  {
    number: "04",
    name: "Senza glutine",
    desc: "Un percorso dedicato di ricerca: non un’alternativa di serie B, ma una pizza con una propria identità.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function AmbientSection() {
  const reduceMotion = useReducedMotion();
  const [activeChapter, setActiveChapter] = useState(0);
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.8, ease: "easeOut" as const };

  const activeVisual = chapters[activeChapter];

  return (
    <section id="ambient" className="relative overflow-clip bg-[#080807] text-foreground">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(180,119,53,0.10),transparent_28%),radial-gradient(circle_at_12%_40%,rgba(109,84,54,0.07),transparent_34%),linear-gradient(180deg,#070706_0%,#0b0a09_36%,#080807_100%)]" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(245,240,232,0.22)_0.7px,transparent_0.7px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
        <div className="absolute right-[-10%] top-[8%] h-[34rem] w-[34rem] rounded-full bg-white/[0.025] blur-[120px]" />
        <div className="absolute left-0 top-0 h-40 w-full bg-gradient-to-b from-background to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-24 md:pb-36 md:pt-36 lg:px-8 lg:pb-44 lg:pt-44">
        <motion.header
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          transition={transition}
          className="max-w-5xl"
        >
          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-white/28" />
            <span className="text-[10px] font-medium uppercase tracking-[0.36em] text-white/58 md:text-xs">
              L&apos;esperienza Timilia
            </span>
          </div>
          <h2 className="max-w-4xl text-[clamp(2.9rem,7vw,7.4rem)] font-light leading-[0.9] tracking-[-0.035em] text-white">
            Qui la pizza
            <span className="block text-[#f5f0e8]">si vive.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-white/58 md:mt-10 md:text-xl">
            Nel cuore di Via Maqueda, Timilia è impasto, tempo, persone e Sicilia. Un luogo che non cerca il silenzio di una sala formale: cerca autenticità.
          </p>
        </motion.header>

        <div className="mt-20 grid gap-12 lg:mt-32 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20 xl:gap-28">
          <div className="hidden lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-8rem)] lg:self-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={transition}
              className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] shadow-[0_40px_120px_rgba(0,0,0,0.42)]"
            >
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={activeVisual.image}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.025 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeVisual.image}
                    alt={activeVisual.imageAlt}
                    fill
                    priority={activeChapter === 0}
                    className="object-cover"
                    style={{ objectPosition: activeVisual.imagePosition }}
                    sizes="44vw"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(5,5,5,0.22)_48%,rgba(5,5,5,0.88)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 z-10 p-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeVisual.visualLabel}
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
                  >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/56">
                      {activeVisual.visualLabel}
                    </span>
                    <div className="mt-4 flex gap-1.5" aria-hidden="true">
                      {chapters.map((chapter, index) => (
                        <span
                          key={chapter.title}
                          className={`h-px transition-all duration-500 ${index === activeChapter ? "w-10 bg-gold" : "w-4 bg-white/24"}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="space-y-5 lg:space-y-0 lg:divide-y lg:divide-white/[0.09]">
            {chapters.map((chapter, index) => (
              <motion.article
                key={chapter.title}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                onViewportEnter={() => setActiveChapter(index)}
                viewport={{ once: false, amount: 0.42 }}
                transition={{ ...transition, delay: reduceMotion ? 0 : 0.04 }}
                className="relative -mx-2 min-h-[34rem] overflow-hidden rounded-[1.75rem] px-6 py-12 sm:-mx-1 sm:min-h-[38rem] sm:px-8 sm:py-14 lg:mx-0 lg:min-h-[58vh] lg:overflow-visible lg:rounded-none lg:px-0 lg:py-20"
              >
                <div className="absolute inset-0 lg:hidden" aria-hidden="true">
                  <Image
                    src={chapter.image}
                    alt=""
                    fill
                    loading="lazy"
                    className="object-cover"
                    style={{ objectPosition: chapter.imagePosition }}
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.42),rgba(5,5,5,0.76)_48%,rgba(5,5,5,0.96)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(245,240,232,0.045),transparent_35%)]" />
                </div>

                <div className="relative z-10 flex min-h-[28rem] flex-col justify-end sm:min-h-[32rem] lg:min-h-0 lg:justify-start">
                  <div className="mb-5 flex items-center gap-4">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-gold/74">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.28em] text-white/58 md:text-xs lg:text-white/38">
                      {chapter.kicker}
                    </span>
                  </div>
                  <h3 className="max-w-2xl text-3xl font-light leading-[1.06] tracking-[-0.02em] text-white md:text-5xl lg:text-[3.4rem]">
                    {chapter.title}
                  </h3>
                  <div className="mt-7 max-w-2xl space-y-5 md:mt-9">
                    {chapter.body.map((paragraph) => (
                      <p key={paragraph} className="text-base font-light leading-[1.78] text-white/72 md:text-lg lg:text-white/56">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          transition={transition}
          className="mt-14 border-y border-white/10 py-14 md:mt-20 md:py-20"
        >
          <div className="mb-9 max-w-3xl md:mb-12">
            <span className="text-[10px] font-medium uppercase tracking-[0.34em] text-white/54 md:text-xs">
              Quattro modi di vivere l&apos;impasto
            </span>
            <h3 className="mt-5 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
              Scegli quale esperienza di pizza vivere.
            </h3>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
            {doughs.map((dough) => (
              <div
                key={dough.name}
                className="group min-h-[17rem] bg-[#0b0a08]/95 p-6 transition-colors duration-500 hover:bg-[#14100c] md:p-7"
              >
                <span className="font-mono text-[10px] tracking-[0.22em] text-gold/58">{dough.number}</span>
                <h4 className="mt-12 text-xl font-light leading-tight text-white md:text-2xl">{dough.name}</h4>
                <p className="mt-4 text-sm font-light leading-relaxed text-white/48 transition-colors duration-500 group-hover:text-white/64">
                  {dough.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.24 }}
          transition={transition}
          className="relative mt-20 overflow-hidden rounded-[2rem] border border-white/10 md:mt-28"
        >
          <div className="relative min-h-[34rem] md:min-h-[42rem] lg:min-h-[48rem]">
            <Image
              src="/images/ambient-experience-2.png"
              alt="Dettagli e atmosfera dell'esperienza Timilia"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.16),rgba(5,5,5,0.40)_38%,rgba(5,5,5,0.96)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-7 md:p-12 lg:p-16">
              <p className="max-w-5xl text-3xl font-light leading-[1.08] tracking-[-0.025em] text-white md:text-5xl lg:text-7xl">
                Timilia non è una pizzeria da osservare in silenzio.
                <span className="mt-2 block text-[#f5f0e8]">È una pizzeria da vivere.</span>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto mt-20 max-w-4xl text-center md:mt-28">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            transition={transition}
          >
            <span className="text-[10px] uppercase tracking-[0.34em] text-white/50 md:text-xs">La nostra idea di ospitalità</span>
            <h3 className="mt-6 text-3xl font-light leading-tight tracking-[-0.02em] text-white md:text-5xl">
              Portare via qualcosa, oltre alla pizza.
            </h3>
            <p className="mx-auto mt-7 max-w-2xl text-base font-light leading-[1.85] text-white/54 md:text-lg">
              Il ricordo di un impasto particolare. Un ingrediente siciliano scoperto per la prima volta.
              Una pizza condivisa. Una risata al tavolo. Il rumore di Via Maqueda fuori dalla porta.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.12 }}
            className="mt-14 border-t border-white/10 pt-12 md:mt-20 md:pt-16"
          >
            <p className="text-2xl font-light leading-relaxed text-white md:text-4xl">
              Pizza contemporanea.
              <span className="block text-white/72">Anima siciliana.</span>
              <span className="block text-[#f5f0e8]">Energia di Palermo.</span>
            </p>
            <div className="mx-auto mt-7 h-px w-10 bg-gold/55" aria-hidden="true" />
            <p className="mt-9 text-[10px] uppercase tracking-[0.34em] text-white/34 md:text-xs">
              E quando la ricerca sull&apos;impasto diventa un progetto a sé, nasce TERA ↓
            </p>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}