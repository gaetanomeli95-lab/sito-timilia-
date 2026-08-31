"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const story = [
  "Quando abbiamo immaginato Timilia, più di dieci anni fa, l’idea era diversa da quella che vedete oggi.",
  "Sapevamo che aprire nel cuore del centro storico di Palermo significava vivere la città fin dalle prime ore del mattino. Per questo non immaginavamo soltanto una pizzeria, ma anche una panetteria.",
  "Pagnotte di Tumminia, pane appena sfornato, pizza al trancio e poi, con il passare delle ore, la pizza. Questa era la visione originale.",
  "Poi sono stati i Quattro Canti e le persone che ogni giorno attraversavano quelle strade a indicarci una direzione diversa.",
  "Ci siamo accorti quasi subito che la pizza stava prendendo il sopravvento sul pane. E in fondo era naturale: i Quattro Canti sono il cuore di Palermo, ma non sono un quartiere residenziale.",
  "La pizza voleva essere la protagonista. E noi abbiamo deciso di darle il suo palcoscenico.",
  "Da quel momento è iniziato un percorso che dura ancora oggi.",
  "Avevo una frase nel cuore: “AMA IL TUO PROSSIMO COME TE STESSO.” Per me, ancora oggi, dentro quelle parole c’è una potenza illimitata.",
  "E credo che una parte importante della nostra idea di eccellenza nasca proprio da qui: fare per gli altri quello che vorremmo fosse fatto per noi. Scegliere ciò che sceglieremmo per noi. Servire ciò che vorremmo mangiare noi. Avere la stessa cura che vorremmo ricevere.",
  "È un principio semplice, ma dopo più di dieci anni continua a guidare molte delle nostre scelte.",
  "Volevo fare pizza, ma volevo farla bene per davvero. Come la immaginavo nella mia testa.",
  "Questo significava cercare le migliori materie prime che riuscivamo a trovare, portarle nella nostra cucina e condividerle con chi avrebbe scelto di sedersi alla nostra tavola.",
  "Non abbiamo mai cercato il cliente disposto semplicemente a spendere di più. Abbiamo cercato persone con un’aspettativa: persone curiose, che amano mangiare e mangiare bene, e alle quali poter offrire tutto il buono che la nostra terra, la nostra cucina e le nostre idee possono dare.",
  "Sono passati più di dieci anni. E anno dopo anno abbiamo reso la pizza sempre più protagonista.",
  "È cambiato il locale. Siamo cambiati noi. È cambiato il nostro modo di lavorare, di studiare gli impasti, di scegliere le materie prime e persino di mettere in discussione alcune delle nostre convinzioni.",
  "Timilia si è trasformata fino ad arrivare a quella che molti oggi chiamano “la boutique della pizza”. È una definizione che ci piace, ma non perché vogliamo rendere la pizza qualcosa di distante o prezioso a tutti i costi. Al contrario: vogliamo darle il valore che merita.",
  "Per questo non facciamo pizze tanto per farle. Cerchiamo di dare a ognuna un’identità, un pensiero, una storia. E attraverso quelle pizze continuiamo a raccontare la Sicilia e tutto quello che di buono la nostra cucina può offrire.",
  "Ma in questi dieci anni abbiamo capito anche un’altra cosa: una grande materia prima e una buona pizza, da sole, non bastano a creare un’esperienza.",
  "Conta come vieni accolto. Conta come vieni accompagnato durante la cena. Conta come ti senti quando sei seduto al nostro tavolo e, soprattutto, come ti senti quando vai via.",
  "Per questo il servizio, per noi, è parte della cucina. Vogliamo che chi entra da Timilia possa sentirsi accolto come a casa, anche trovandosi nel cuore di una delle piazze più conosciute di Palermo.",
  "Dieci anni dopo continuiamo a fare quello che volevamo fare il primo giorno: mettere in tavola il meglio che riusciamo a trovare, lavorarlo al meglio delle nostre capacità e condividerlo con chi sceglie di stare con noi.",
];

const HERO_DESKTOP =
  "https://raw.githubusercontent.com/gaetanomeli95-lab/sito-timilia-/main/public/images/hero-timilia-2026-desktop.webp";
const HERO_MOBILE =
  "https://raw.githubusercontent.com/gaetanomeli95-lab/sito-timilia-/main/public/images/hero-timilia-2026-mobile.webp";

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [storyOpen, setStoryOpen] = useState(false);

  useEffect(() => {
    if (!storyOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [storyOpen]);

  return (
    <>
      <section id="hero" className="relative h-[100svh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <picture className="absolute inset-0 block h-full w-full">
            <source media="(min-width: 768px)" srcSet={HERO_DESKTOP} />
            <img
              src={HERO_MOBILE}
              alt="Timilia nel cuore del centro storico di Palermo"
              className="h-full w-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
            />
          </picture>

          <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.56)_28%,rgba(0,0,0,0.08)_60%,rgba(0,0,0,0.18)_100%)] md:block" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.20)_0%,rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.88)_100%)] md:bg-[linear-gradient(180deg,rgba(0,0,0,0.26)_0%,transparent_42%,rgba(0,0,0,0.58)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,rgba(206,144,72,0.09),transparent_38%)]" />
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-end px-6 pb-20 pt-28 md:items-center md:px-10 md:pb-12 lg:px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 0.9, ease: "easeOut" }}
            className="max-w-[39rem]"
          >
            <div className="mb-5 flex items-center gap-3 md:mb-7">
              <span className="h-px w-9 bg-gold/80" />
              <span className="text-[10px] font-medium uppercase tracking-[0.34em] text-gold md:text-xs">
                La storia di Timilia
              </span>
            </div>

            <h1 className="max-w-[12ch] text-[clamp(2.8rem,6vw,6.6rem)] font-light leading-[0.92] tracking-[-0.035em] text-white">
              Dalla pizza al pane.
              <span className="mt-1 block text-gold">Dal pane alla pizza.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm font-light leading-[1.75] text-white/74 sm:text-base md:mt-8 md:text-lg">
              Più di dieci anni fa Timilia nasceva con una doppia anima: panetteria e pizzeria. Poi Palermo, i Quattro Canti e le persone che attraversavano Via Maqueda ci hanno indicato la strada.
            </p>

            <p className="mt-4 max-w-xl text-sm font-light leading-[1.75] text-white/55 sm:text-base">
              La pizza voleva essere la protagonista. Noi abbiamo deciso di darle il suo palcoscenico.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
              <button
                type="button"
                onClick={() => setStoryOpen(true)}
                className="border border-gold bg-gold px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-black transition-colors duration-300 hover:bg-transparent hover:text-gold md:px-8 md:py-4 md:text-xs"
              >
                Leggi la nostra storia
              </button>
              <a
                href="https://maps.google.com/?q=Via+Maqueda+221+Palermo"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/25 bg-black/15 px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white/82 backdrop-blur-sm transition-colors duration-300 hover:border-gold hover:text-gold md:px-8 md:py-4 md:text-xs"
              >
                Vieni a trovarci
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 1.7, duration: reduceMotion ? 0 : 0.8 }}
          className="absolute bottom-6 right-6 z-10 hidden items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-white/35 md:flex lg:right-10"
        >
          <span>Scorri</span>
          <motion.span
            animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="block h-9 w-px bg-gradient-to-b from-gold/70 to-transparent"
          />
        </motion.div>
      </section>

      <AnimatePresence>
        {storyOpen && (
          <motion.div
            className="fixed inset-0 z-[120] overflow-y-auto bg-[#050505]/98 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
            role="dialog"
            aria-modal="true"
            aria-label="La storia di Timilia"
          >
            <button
              type="button"
              onClick={() => setStoryOpen(false)}
              className="fixed right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/70 backdrop-blur-md transition hover:border-gold/60 hover:text-gold md:right-8 md:top-8"
              aria-label="Chiudi la storia"
            >
              <X size={20} strokeWidth={1.4} />
            </button>

            <div className="mx-auto grid min-h-screen max-w-7xl gap-12 px-6 py-24 md:px-10 md:py-28 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:px-12 xl:px-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-9 bg-gold/80" />
                  <span className="text-[10px] uppercase tracking-[0.34em] text-gold md:text-xs">La nostra storia</span>
                </div>
                <h2 className="max-w-[10ch] text-5xl font-light leading-[0.95] tracking-[-0.03em] md:text-7xl">
                  Dalla pizza al pane.
                  <span className="block text-gold">Dal pane alla pizza.</span>
                </h2>
                <p className="mt-8 max-w-md font-serif text-2xl italic leading-relaxed text-white/72 md:text-3xl">
                  “Mettere in tavola il meglio che riusciamo a trovare, lavorarlo al meglio delle nostre capacità e condividerlo.”
                </p>
              </div>

              <div className="max-w-2xl space-y-7 text-[1.02rem] font-light leading-[1.9] text-white/68 md:text-lg">
                {story.map((paragraph, index) => (
                  <p
                    key={`${index}-${paragraph.slice(0, 22)}`}
                    className={index === 5 || index === 7 || index === 20 ? "text-xl leading-[1.65] text-white/92 md:text-2xl" : undefined}
                  >
                    {paragraph}
                  </p>
                ))}

                <div className="border-t border-gold/25 pt-10">
                  <p className="font-serif text-3xl font-light leading-tight text-white md:text-4xl">Questa è Timilia.</p>
                  <p className="mt-3 text-sm uppercase tracking-[0.26em] text-gold md:text-base">
                    E continuiamo a scriverla, una pizza alla volta.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
