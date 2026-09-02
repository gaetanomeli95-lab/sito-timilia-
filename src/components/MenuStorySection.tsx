"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  prologue,
  chapterOne,
  chapterTwo,
  chapterThree,
  chapterFour,
  caprese,
  bufalina,
  camurria,
  epilogue,
  type PizzaMoment,
} from "@/data/menuStoryData";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  className,
  delay = 0,
  y = 30,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: reduce ? 0.5 : 1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Parallasse dolce: le immagini respirano con lo scroll, non sono adesivi */
function Parallax({
  children,
  amount = 36,
  className = "",
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}

function ChapterMark({
  title,
  tone = "dark",
}: {
  title: string;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <Reveal className="flex items-center gap-3">
      <span className={`h-px w-9 ${light ? "bg-[#9c7231]/70" : "bg-gold/70"}`} />
      <span
        className={`text-[10px] font-medium uppercase tracking-[0.34em] md:text-xs ${
          light ? "text-[#9c7231]" : "text-gold"
        }`}
      >
        {title}
      </span>
    </Reveal>
  );
}

/* Pannello avorio caldo: la luce del racconto */
function LightPanel({
  children,
  className = "",
  wheat = false,
}: {
  children: ReactNode;
  className?: string;
  wheat?: boolean;
}) {
  return (
    <div className={`relative bg-[#f3ecdf] text-[#241b10] ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(200,135,74,0.14),transparent_46%),radial-gradient(circle_at_88%_82%,rgba(156,114,49,0.10),transparent_42%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_center,#7a5a2e_1px,transparent_1px)] [background-size:38px_38px]"
      />
      {/* Effetto stencil: il campo di grano affiora dal fondo del pannello */}
      {wheat && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-56 opacity-[0.34] mix-blend-multiply md:h-72"
          style={{
            backgroundImage: "url('/images/menu-story/timilia-stencil.png')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, black 16%, black 60%, transparent 100%)",
            maskImage:
              "linear-gradient(to top, transparent 0%, black 16%, black 60%, transparent 100%)",
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

function Prose({
  children,
  className = "",
  tone = "dark",
}: {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={`text-[0.98rem] font-light leading-[1.85] md:text-lg ${
        tone === "light" ? "text-[#3a2f22]/88" : "text-[#f5f0e8]/70"
      } ${className}`}
    >
      {children}
    </p>
  );
}

/* Micro-label editoriale: ingrediente → ruolo nel racconto */
function IngredientLine({
  ingredient,
  role,
  delay = 0,
}: {
  ingredient: string;
  role: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} y={16} className="flex items-baseline gap-4">
      <span className="mt-2 h-px w-7 shrink-0 self-center bg-[#9c7231]/55" />
      <span>
        <span className="block text-[11px] font-medium uppercase tracking-[0.24em] text-[#241b10]/90 md:text-xs">
          {ingredient}
        </span>
        <span className="mt-1 block font-serif text-sm italic leading-snug text-[#3a2f22]/62 md:text-[0.95rem]">
          {role}
        </span>
      </span>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Prologo — MANI TOMMASO                                              */
/* ------------------------------------------------------------------ */

function Prologue() {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black">
      {/* Fotografia-manifesto: le mani reali di Tommaso */}
      <motion.div
        initial={{ scale: reduce ? 1 : 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
        className="absolute inset-0 lg:left-auto lg:w-[62%]"
      >
        <Image
          src={prologue.image}
          alt={prologue.alt}
          fill
          priority
          className="object-cover object-[50%_38%] lg:object-[50%_45%]"
          sizes="(max-width: 1024px) 100vw, 62vw"
          quality={82}
        />
      </motion.div>

      {/* Fusioni: scrim per il testo in alto, e in basso il nero si scioglie nell'avorio */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.35)_40%,transparent_60%)]" />
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#000_0%,#000_32%,transparent_60%)] lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-[38svh] bg-gradient-to-b from-transparent via-[#f3ecdf]/55 to-[#f3ecdf]" />
      {/* Le spighe stencil affiorano già nella zona scura del prologo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 opacity-[0.30] mix-blend-multiply md:h-60"
        style={{
          backgroundImage: "url('/images/menu-story/timilia-stencil.png')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          WebkitMaskImage:
            "linear-gradient(to top, transparent 0%, black 16%, black 55%, transparent 100%)",
          maskImage:
            "linear-gradient(to top, transparent 0%, black 16%, black 55%, transparent 100%)",
        }}
      />

      {/* Contenuto: tutto visibile subito, niente sorprese */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-32 pt-28 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: reduce ? 0 : 0.2 }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-9 bg-gold/80" />
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold md:text-xs">
            {prologue.kicker}
          </span>
        </motion.div>

        <div className="flex flex-1 flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: reduce ? 0 : 0.45, ease: EASE }}
            className="max-w-[26ch] pt-10 lg:max-w-[19ch]"
          >
            <h2 className="text-[clamp(1.6rem,4.6vw,4rem)] font-light leading-[1.15] tracking-[-0.02em] text-[#fffaf0]">
              In Sicilia abbiamo imparato che ogni fatica{" "}
              <span className="font-serif italic text-gold">aspetta il suo frutto.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm font-light leading-[1.8] text-[#f5f0e8]/68 md:text-base">
              {prologue.microcopy}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Invito allo scroll: chiaro e sempre visibile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: reduce ? 0 : 1 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.3em] text-[#3a2f22]/80 md:text-[11px]">
          Scorri per iniziare il racconto
        </span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <span className="block h-9 w-px bg-gradient-to-b from-[#9c7231] to-[#9c7231]/10" />
          <span className="-mt-1.5 block h-2 w-2 rotate-45 border-b border-r border-[#9c7231]" />
        </motion.span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Momento pizza — la pizza è tonda e vive dentro il racconto          */
/* ------------------------------------------------------------------ */

function PizzaInStory({
  pizza,
  align = "left",
}: {
  pizza: PizzaMoment;
  align?: "left" | "right";
}) {
  return (
    <div className="mt-20 grid items-center gap-10 md:mt-28 lg:grid-cols-2 lg:gap-16">
      <Reveal className={align === "right" ? "lg:order-2" : ""}>
        {/* La foto si fonde con la carta: bordi dissolti, niente cornici */}
        <Parallax
          amount={30}
          className={`relative mx-auto w-full ${
            pizza.landscape ? "max-w-[34rem] md:max-w-[38rem]" : "max-w-[30rem] md:max-w-[34rem]"
          } ${align === "left" ? "lg:ml-0" : "lg:mr-0 lg:ml-auto"}`}
        >
          <div
            className={`relative overflow-hidden edge-fade ${
              pizza.landscape ? "aspect-[4/3]" : "aspect-[4/5]"
            }`}
          >
            <Image
              src={pizza.image}
              alt={pizza.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 88vw, 38vw"
              quality={82}
            />
          </div>
        </Parallax>
      </Reveal>

      <div className={align === "right" ? "lg:order-1" : ""}>
        <Reveal>
          <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-[#9c7231] md:text-xs">
            {pizza.eyebrow}
          </p>
          <h3 className="mt-4 font-serif text-4xl italic tracking-tight text-[#241b10] md:text-5xl">
            {pizza.name}
          </h3>
        </Reveal>

        <div className="mt-10 flex max-w-md flex-col gap-6">
          {pizza.composition.map((note, i) => (
            <IngredientLine
              key={note.ingredient}
              ingredient={note.ingredient}
              role={note.role}
              delay={0.12 + i * 0.1}
            />
          ))}
        </div>

        {pizza.outro && (
          <Reveal delay={0.2} className="mt-10">
            <p className="max-w-md font-serif text-xl italic leading-relaxed text-[#3a2f22]/80 md:text-2xl">
              {pizza.outro}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Capitolo 01 — La qualità non si misura in centimetri                */
/* ------------------------------------------------------------------ */

function ChapterOne() {
  return (
    <div className="relative">
      <LightPanel wheat className="py-[12svh]">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          <ChapterMark title={chapterOne.title} tone="light" />

          <Reveal delay={0.1} className="mt-12 md:mt-16">
            <p className="max-w-[20ch] text-[clamp(2rem,5vw,4.6rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#241b10]">
              Per noi la grandezza del bordo{" "}
              <span className="font-serif italic text-[#9c7231]">non determina</span> la
              qualità di una pizza.
            </p>
          </Reveal>

          {/* La fotografia riempie lo spazio: il piccolo che vale più del grande */}
          <div className="mt-20 grid items-center gap-12 md:mt-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal>
              <Parallax
                amount={26}
                className="relative mx-auto w-full max-w-[28rem] lg:max-w-[34rem]"
              >
                <div className="relative aspect-[4/5] overflow-hidden edge-fade">
                  <Image
                    src="/images/menu-story/piatto-gourmet.png"
                    alt="Piccolo lievitato fritto con tartufo e fiori: la qualità non dipende dalla dimensione"
                    fill
                    className="object-cover mix-blend-multiply"
                    sizes="(max-width: 1024px) 88vw, 36vw"
                    quality={82}
                  />
                      </div>
              </Parallax>
            </Reveal>
            <div className="flex flex-col justify-center gap-10">
              {chapterOne.paragraphs.map((p) => (
                <Reveal key={p.slice(0, 24)}>
                  <Prose tone="light" className="max-w-xl">{p}</Prose>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="mt-24 md:mt-32">
            <p className="max-w-[18ch] text-[clamp(1.7rem,4vw,3.6rem)] font-light leading-[1.15] tracking-[-0.015em] text-[#241b10]">
              Non basta far crescere un impasto.{" "}
              <span className="font-serif italic text-[#9c7231]">Bisogna conoscerlo.</span>
            </p>
            <p className="mt-6 max-w-md text-sm font-light leading-[1.8] text-[#3a2f22]/70 md:text-base">
              {chapterOne.manifestoTwoSub}
            </p>
          </Reveal>

          {/* La Caprese emerge come prima dimostrazione della tesi */}
          <PizzaInStory pizza={caprese} align="left" />
        </div>
      </LightPanel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Capitolo 02 — Il tempo non è un ingrediente                         */
/* ------------------------------------------------------------------ */

function ChapterTwo() {
  const reduce = useReducedMotion();
  return (
    <LightPanel className="py-[12svh]">
    {/* Texture oro e nero: il tempo che lavora dietro le parole */}
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[105svh] overflow-hidden">
      <Image
        src="/images/menu-story/texture-oro.png"
        alt=""
        fill
        className="object-cover"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 55%, transparent 90%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 55%, transparent 90%)",
        }}
        sizes="100vw"
        quality={78}
      />
      <div className="absolute inset-0 bg-[#f3ecdf]/45" />
    </div>
    <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
      <ChapterMark title={chapterTwo.title} tone="light" />

      {/* Manifesto speculare */}
      <div className="mt-14 md:mt-20">
        {chapterTwo.manifesto.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-14% 0px" }}
            transition={{ duration: 1.1, delay: i * 0.22, ease: EASE }}
            className={`text-[clamp(1.9rem,5.6vw,5rem)] font-light uppercase leading-[1.06] tracking-[0.02em] ${
              i === 0 ? "text-[#241b10]" : "text-[#241b10]/40 lg:ml-[14%]"
            }`}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <div className="mt-20 md:mt-28 lg:ml-[42%]">
        {chapterTwo.paragraphs.map((p) => (
          <Reveal key={p.slice(0, 24)}>
            <Prose tone="light" className="max-w-xl">{p}</Prose>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20 md:mt-32">
        <p className="max-w-[22ch] font-serif text-[clamp(1.6rem,3.6vw,3.1rem)] italic leading-[1.25] text-[#9c7231]">
          {chapterTwo.pullOne}
        </p>
      </Reveal>

      {/* Il fritto in doppia panatura: il tempo usato con uno scopo */}
      <div className="mt-20 grid items-center gap-12 md:mt-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <Parallax
            amount={26}
            className="relative mx-auto w-full max-w-[24rem] lg:max-w-[28rem]"
          >
            <div className="relative aspect-[3/5] overflow-hidden edge-fade">
              <Image
                src="/images/menu-story/foto-3.png"
                alt="Bocconi panati e fritti su crema arancione: precisione e tecnica nel piatto"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 80vw, 28vw"
                quality={82}
              />
              </div>
          </Parallax>
        </Reveal>
        <div className="flex flex-col justify-center gap-10">
          {chapterTwo.paragraphsTwo.map((p) => (
            <Reveal key={p.slice(0, 24)}>
              <Prose tone="light" className="max-w-xl">{p}</Prose>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mt-24 md:mt-32">
        <p className="max-w-[16ch] text-[clamp(1.9rem,4.6vw,4.2rem)] font-light leading-[1.12] tracking-[-0.02em] text-[#241b10]">
          Il frigorifero{" "}
          <span className="font-serif italic text-[#9c7231]">non è un ingrediente.</span>
        </p>
        <p className="mt-5 text-sm font-light uppercase tracking-[0.22em] text-[#3a2f22]/60 md:text-base">
          {chapterTwo.pullTwoSub}
        </p>
      </Reveal>

    </div>

    {/* Il momento-viewport: la sintesi del capitolo, sull'intonaco caldo */}
    <div className="relative mt-16 md:mt-24">
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/images/menu-story/sfondo-fondo.png"
          alt=""
          fill
          className="object-cover"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 60%, transparent 92%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 60%, transparent 92%)",
          }}
          sizes="100vw"
          quality={80}
        />
        <div className="absolute inset-0 bg-[#f3ecdf]/15" />
      </div>
      <div className="relative flex min-h-[80svh] items-center justify-center px-6 py-24">
        <div className="text-center">
          {chapterTwo.finale.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: reduce ? 0 : 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-18% 0px" }}
              transition={{ duration: 1, delay: i * 0.24, ease: EASE }}
              className="text-[clamp(1.8rem,5vw,4.6rem)] font-light uppercase leading-[1.18] tracking-[0.08em] text-[#241b10]"
            >
              {i === 1 ? <span className="text-[#9c7231]">{line}</span> : line}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
    </LightPanel>
  );
}

/* ------------------------------------------------------------------ */
/* Capitolo 03 — Ciò che inforni, sforni                               */
/* ------------------------------------------------------------------ */

function ChapterThree() {
  return (
    <div className="relative">
      <LightPanel wheat className="py-[12svh]">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          <ChapterMark title={chapterThree.title} tone="light" />

          <div className="mt-16 md:mt-20">
            <Reveal>
              <p className="text-sm font-light uppercase tracking-[0.3em] text-[#3a2f22]/55 md:text-base">
                {chapterThree.quoteIntro}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-[14ch] font-serif text-[clamp(2.6rem,7vw,6.4rem)] italic leading-[1.05] tracking-[-0.02em] text-[#241b10]">
                Ciò che inforni,{" "}
                <span className="text-[#9c7231]">sforni.</span>
              </p>
            </Reveal>
          </div>

          {/* I pomodori del mercato: la materia prima decide tutto */}
          <div className="mt-20 grid items-center gap-12 md:mt-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal>
              <Parallax
                amount={26}
                className="relative mx-auto w-full max-w-[28rem] lg:max-w-[34rem]"
              >
                <div className="relative aspect-[3/4] overflow-hidden edge-fade">
                  <Image
                    src="/images/menu-story/pomodori.png"
                    alt="Pomodori freschi in cassette al mercato: la scelta degli ingredienti prima del forno"
                    fill
                    className="object-cover mix-blend-multiply"
                    sizes="(max-width: 1024px) 88vw, 36vw"
                    quality={82}
                  />
                      </div>
              </Parallax>
            </Reveal>
            <div className="flex flex-col justify-center gap-10">
              {chapterThree.paragraphs.map((p) => (
                <Reveal key={p.slice(0, 24)}>
                  <Prose tone="light" className="max-w-xl">{p}</Prose>
                </Reveal>
              ))}
            </div>
          </div>

          {/* A Bufalina: acqua, farina, pomodoro, mozzarella — la tesi in una pizza */}
          <PizzaInStory pizza={bufalina} align="right" />

          {/* Camurria: la qualità decisa prima del forno arriva anche dopo */}
          <PizzaInStory pizza={camurria} align="left" />

          {/* La pizza col crudo e l'olio: la qualità che esce dal forno */}
          <div className="grid items-center gap-12 pt-[10svh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <Reveal className="flex flex-col justify-center">
              <p className="max-w-[26ch] font-serif text-[clamp(1.5rem,3.4vw,2.9rem)] italic leading-[1.3] text-[#3a2f22]/85">
                {chapterThree.closing}
              </p>
            </Reveal>
            <Reveal>
              <Parallax
                amount={26}
                className="relative mx-auto w-full max-w-[28rem] lg:max-w-[32rem]"
              >
                <div className="relative aspect-[4/5] overflow-hidden edge-fade">
                  <Image
                    src="/images/menu-story/foto-2.png"
                    alt="Pizza con prosciutto crudo appena sfornata accanto a una bottiglia di olio extravergine di oliva"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 88vw, 34vw"
                    quality={82}
                  />
                      </div>
              </Parallax>
            </Reveal>
          </div>
        </div>
      </LightPanel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Capitolo 04 — Ogni giorno, un impasto diverso                       */
/* ------------------------------------------------------------------ */

function ChapterFour() {
  const reduce = useReducedMotion();
  return (
    <LightPanel className="pb-6 pt-[12svh]">
    <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
      <ChapterMark title={chapterFour.title} tone="light" />

      {/* Il nostro pane: la panificazione raccontata per immagini */}
      <div className="mt-16 grid items-center gap-12 md:mt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <Parallax
            amount={26}
            className="relative mx-auto w-full max-w-[30rem] lg:max-w-[36rem]"
          >
            <div className="relative aspect-[4/3] overflow-hidden edge-fade">
              <Image
                src="/images/menu-story/pane.png"
                alt="Il nostro pane: pagnotte artigianali a lievitazione naturale appena sfornate"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 88vw, 34vw"
                quality={82}
              />
            </div>
          </Parallax>
        </Reveal>
        <div className="flex flex-col justify-center gap-10">
          {chapterFour.paragraphs.map((p) => (
            <Reveal key={p.slice(0, 24)}>
              <Prose tone="light" className="max-w-xl">{p}</Prose>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Il gesto: tre parole che respirano */}
      <div className="mt-24 md:mt-32">
        <Reveal>
          <p className="text-lg font-light text-[#3a2f22]/70 md:text-xl">
            {chapterFour.gestureIntro}
          </p>
        </Reveal>
        <div className="mt-8">
          {chapterFour.gestures.map((word, i) => (
            <motion.p
              key={word}
              initial={{ opacity: 0, y: reduce ? 0 : 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-14% 0px" }}
              transition={{ duration: 1, delay: i * 0.26, ease: EASE }}
              className="font-serif text-[clamp(2.4rem,6.4vw,5.6rem)] italic leading-[1.15] text-[#241b10]"
              style={{ marginLeft: `${i * 8}%` }}
            >
              {i === 2 ? <span className="text-[#9c7231]">{word}</span> : word}
            </motion.p>
          ))}
        </div>
      </div>

      {/* La focaccia farcita: quello che hai davanti, non il numero sulla ricetta */}
      <div className="mt-24 grid items-center gap-12 md:mt-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <Parallax
            amount={26}
            className="relative mx-auto w-full max-w-[30rem] lg:max-w-[38rem]"
          >
            <div className="relative aspect-[4/3] overflow-hidden edge-fade">
              <Image
                src="/images/menu-story/foto-1.png"
                alt="Focaccia farcita con mortadella e parmigiano grattugiato su piatto artigianale"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 88vw, 38vw"
                quality={82}
              />
              </div>
          </Parallax>
        </Reveal>
        <div className="flex flex-col justify-center gap-10">
          {chapterFour.paragraphsTwo.map((p) => (
            <Reveal key={p.slice(0, 24)}>
              <Prose tone="light" className="max-w-xl">{p}</Prose>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Il piccolo fritto nella ciotola: osservare, provare, capire */}
      <div className="mt-20 grid items-center gap-12 md:mt-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="max-w-[20ch] text-[clamp(1.7rem,4vw,3.4rem)] font-light leading-[1.2] tracking-[-0.015em] text-[#241b10]">
              Non sappiamo mai tutto.{" "}
              <span className="font-serif italic text-[#9c7231]">
                E non vogliamo raccontare di saperlo.
              </span>
            </p>
          </Reveal>
          <div className="mt-12">
            {chapterFour.paragraphsThree.map((p) => (
              <Reveal key={p.slice(0, 24)}>
                <Prose tone="light" className="max-w-xl">{p}</Prose>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal>
          <Parallax
            amount={26}
            className="relative mx-auto w-full max-w-[24rem] lg:max-w-[28rem]"
          >
            <div className="relative aspect-[2/3] overflow-hidden edge-fade">
              <Image
                src="/images/menu-story/foto-4.png"
                alt="Piccolo lievitato fritto con stracciatella, tartare e fiori eduli in ciotola artigianale"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 80vw, 28vw"
                quality={82}
              />
              </div>
          </Parallax>
        </Reveal>
      </div>

      <div className="flex flex-col items-center justify-center pb-8 pt-24 text-center md:pt-32">
        <Reveal>
          <p className="mx-auto max-w-[22ch] font-serif text-[clamp(1.8rem,4.4vw,3.9rem)] italic leading-[1.25] text-[#241b10]">
            La pizza possiamo studiarla, misurarla e raccontarla.{" "}
            <span className="text-[#9c7231]">Ma non possiamo chiuderla dentro un libro.</span>
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mx-auto mt-10 max-w-lg text-sm font-light leading-[1.8] text-[#3a2f22]/70 md:text-base">
            {chapterFour.finaleSub}
          </p>
        </Reveal>
      </div>
    </div>
    </LightPanel>
  );
}

/* ------------------------------------------------------------------ */
/* Epilogo — ritorno al silenzio                                       */
/* ------------------------------------------------------------------ */

function Epilogue() {
  const reduce = useReducedMotion();
  return (
    <div className="relative bg-[#f3ecdf] text-[#241b10]">
      {/* L'illustrazione stencil: subito dopo le ultime parole, senza vuoti */}
      <div className="relative">
        <div className="relative mx-auto w-full max-w-[110rem]">
          <Image
            src="/images/menu-story/timilia-stencil.png"
            alt="Illustrazione Timilia: campo di grano siciliano, colline e il marchio Pizzaioli per passione"
            width={1536}
            height={1024}
            className="h-auto w-full mix-blend-multiply"
            sizes="100vw"
            quality={85}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-[#f3ecdf] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-[#f3ecdf] to-transparent" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-6 pb-[14svh] pt-[4svh] text-center">
        {epilogue.lines.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: reduce ? 0 : 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 1.1, delay: i * 0.3, ease: EASE }}
            className={
              i === 0
                ? "font-serif text-[clamp(2.2rem,5.6vw,4.8rem)] italic leading-tight text-[#241b10]"
                : "mt-6 text-base font-light leading-relaxed text-[#3a2f22]/70 md:text-xl"
            }
          >
            {line}
          </motion.p>
        ))}

        <Reveal delay={0.5} className="mt-12">
          <a
            href={epilogue.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 border-b border-[#9c7231]/45 pb-2 text-[11px] font-medium uppercase tracking-[0.26em] text-[#3a2f22]/80 transition-colors duration-500 hover:border-[#9c7231] hover:text-[#9c7231] md:text-xs"
          >
            {epilogue.ctaLabel}
            <span
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-1.5"
            >
              →
            </span>
          </a>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sezione                                                             */
/* ------------------------------------------------------------------ */

export default function MenuStorySection() {
  return (
    <section
      id="menu"
      aria-label="Il racconto della pizza Timilia"
      className="relative overflow-x-clip bg-[#f3ecdf] text-[#241b10]"
    >
      {/* Ingresso morbido dalla sezione precedente */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-[#050505] to-transparent" />

      <Prologue />
      <ChapterOne />
      <ChapterTwo />
      <ChapterThree />
      <ChapterFour />
      <Epilogue />
    </section>
  );
}
