"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TeraWordmark from "@/components/TeraWordmark";
import TeraFeatureModal, { type TeraFeatureContent } from "@/components/TeraFeatureModal";
import TeraShop from "@/components/TeraShop";
import { ArrowLeft, WheatOff, FlaskConical, Leaf, Heart, Sparkles, ArrowRight, Microscope, Compass, Sun, Sprout } from "lucide-react";

const farine: TeraFeatureContent[] = [
  {
    icon: Sprout,
    title: "Sorgo",
    desc: "Cereale antico naturalmente senza glutine, ricco di antiossidanti e fibre. Apporta leggerezza e un sapore delicato all'impasto.",
    body: "Il sorgo è uno dei cereali più antichi coltivati dall'uomo. Naturalmente privo di glutine, è ricco di antiossidanti, fibre e proteine. Nel blend TERA, il sorgo contribuisce alla leggerezza dell'impasto conferendo una struttura morbida e un sapore delicato, quasi dolce. È una farina che lavora bene in sinergia con le altre, migliorando la digeribilità senza sovrastare i gusti.",
    image: "/images/farina-sorgo.png",
    emoji: "🌾",
  },
  {
    icon: Sprout,
    title: "Saraceno",
    desc: "Pseudocereale ad alto valore proteico, ricco di minerali come magnesio e ferro. Dona struttura e un caratteristico aroma tostato.",
    body: "Il grano saraceno non è un vero cereale ma uno pseudocereale, parente del rabarbaro. È naturalmente senza glutine e vanta un eccezionale profilo nutrizionale: alto contenuto proteico, ricco di magnesio, ferro, potassio e vitamine del gruppo B. Nell'impasto TERA, il saraceno dona struttura e un caratteristico aroma tostato che arricchisce il sapore della pizza. Le sue proteine contengono tutti gli amminoacidi essenziali, rendendolo un alleato prezioso per una nutrizione completa.",
    image: "/images/farina-saraceno.png",
    emoji: "🌱",
  },
  {
    icon: Sprout,
    title: "Miglio",
    desc: "Cereale antico altamente digeribile, fonte di magnesio e fosforo. Contribuisce alla leggerezza dell'impasto e alla sua fragranza.",
    body: "Il miglio è uno dei cereali più antichi e digeribili. Naturalmente senza glutine, è una fonte eccellente di magnesio, fosforo, manganese e vitamine del gruppo B. Nel blend TERA, il miglio contribuisce alla leggerezza e alla fragranza dell'impasto, migliorando la sua digeribilità. La sua struttura fine permette di ottenere un impasto elastico e lavorabile, fondamentale per una pizza gluten free di qualità.",
    image: "/images/farina-miglio.png",
    emoji: "🌿",
  },
  {
    icon: Sprout,
    title: "Piselli",
    desc: "Farina di piselli che apporta proteine vegetali e un basso indice glicemico. Migliora la struttura e la tenuta dell'impasto senza glutine.",
    body: "La farina di piselli è ottenuta dalla macinazione di piselli essiccati ed è naturalmente priva di glutine. È eccezionalmente ricca di proteine vegetali, fibre e ferro, con un bassissimo indice glicemico. Nel blend TERA, la farina di piselli svolge una funzione strutturale fondamentale: migliora la tenuta e l'elasticità dell'impasto senza glutine, compensando l'assenza del glutine con le sue proteine. Il risultato è un impasto che si lavora come quello tradizionale, con un apporto nutrizionale superiore.",
    image: "/images/farina-piselli.png",
    emoji: "🟢",
  },
];

const proprieta: TeraFeatureContent[] = [
  {
    icon: Heart,
    title: "Ricco di vitamine",
    desc: "Calcio, magnesio, zinco, fosforo e ferro",
    body: "L'impasto TERA è naturalmente ricco di vitamine e minerali essenziali. Il blend di farine senza glutine apporta calcio per la salute delle ossa, magnesio per la funzione muscolare e nervosa, zinco per il sistema immunitario, fosforo per il metabolismo energetico e ferro per il trasporto dell'ossigeno. Non è solo una pizza buona — è una pizza che nutre.",
  },
  {
    icon: Leaf,
    title: "Alto apporto di fibre",
    desc: "Per una digestione leggera e naturale",
    body: "Le farine naturali di TERA — sorgo, saraceno, miglio e piselli — sono naturalmente ricche di fibre. Questo significa non solo una migliore digestione, ma anche un senso di sazietà più duraturo e un assorbimento più graduale degli zuccheri. Il risultato è una pizza che si fa digerire con facilità, senza quel senso di pesantezza tipico degli impasti tradizionali.",
  },
  {
    icon: WheatOff,
    title: "Senza glutine",
    desc: "Impasto dedicato per celiaci e intolleranti",
    body: "TERA è un progetto dedicato esclusivamente al senza glutine. Attrezzature separate, spazi dedicati, procedure rigorose per evitare ogni rischio di contaminazione. Non è una pizza adattata — è una pizza pensata da zero per chi non può consumare glutine. Il risultato è un prodotto che rispetta le esigenze dei celiaci senza compromettere sapore, texture o piacere.",
  },
  {
    icon: FlaskConical,
    title: "Basso indice glicemico",
    desc: "Teff, miglio e piselli per un impasto equilibrato",
    body: "Grazie alla presenza di cereali antichi come teff, miglio e piselli, l'impasto TERA ha un basso indice glicemico. Questo significa che gli zuccheri vengono rilasciati lentamente nel sangue, evitando picchi glicemici e garantendo un'energia costante nel tempo. È la scelta ideale per chi cerca un'alimentazione equilibrata senza rinunciare al piacere della pizza.",
  },
];

const heroCards: TeraFeatureContent[] = [
  {
    icon: Microscope,
    title: "Anni di ricerca",
    desc: "Studio continuo su farine naturali, tecnica e maturazione.",
    body: "TERA è il frutto di un percorso lungo e meticoloso. Anni di test su farine, idratazioni, tempi di fermentazione e tecniche di impasto hanno portato a un risultato che oggi possiamo definire eccellente. Ogni variabile è stata studiata e ottimizzata: dalla selezione delle materie prime alla gestione della maturazione, fino alla cottura. La ricerca non si ferma mai — ogni giorno cerchiamo di migliorare.",
  },
  {
    icon: Compass,
    title: "Metodo Timilia",
    desc: "Non una scorciatoia, ma un percorso costruito prova dopo prova.",
    body: "Il metodo Timilia non ammette scorciatoie. Ogni passo è studiato e ripetuto fino alla perfezione: dalla scelta delle farine senza glutine alla gestione dell'impasto, dalla maturazione lenta alla cottura ad alta temperatura. È un approccio artigianale che rispetta i tempi naturali e garantisce un risultato costante, digeribile e gustoso. Un metodo che si trasmette dal maestro all'allievo, prova dopo prova.",
  },
  {
    icon: Sun,
    title: "Pura natura",
    desc: "Una nuova idea di gluten free: leggera, autentica, memorabile.",
    body: "TERA nasce da una convinzione semplice: il senza glutine non deve essere un compromesso, ma un'esperienza. Le farine naturali — sorgo, saraceno, miglio, piselli — sono selezionate per le loro proprietà nutrizionali e organolettiche. Niente additivi artificiali, niente mix industriali: solo materia prima di qualità, lavorata con rispetto e tecnica. Il risultato è una pizza leggera, autentica, che si fa ricordare.",
  },
];

export default function TeraPage() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const farineRef = useRef<HTMLDivElement>(null);
  const farineInView = useInView(farineRef, { once: true, margin: "-50px" });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const [activeCard, setActiveCard] = useState<TeraFeatureContent | null>(null);

  const handleOpenCard = useCallback((card: TeraFeatureContent) => {
    setActiveCard(card);
  }, []);

  const handleCloseCard = useCallback(() => {
    setActiveCard(null);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#748470" }}>
      {/* Sfondo con gradient e texture */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.10), transparent 40%), radial-gradient(circle at 80% 30%, rgba(0,0,0,0.12), transparent 35%), radial-gradient(circle at 50% 80%, rgba(0,0,0,0.14), transparent 40%), #748470",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 lg:px-10 py-4 backdrop-blur-md" style={{ background: "rgba(38, 46, 36, 0.38)" }}>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[10px] tracking-[0.2em] uppercase font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Torna al sito</span>
        </button>
        <span className="text-white/78 text-[10px] tracking-[0.34em] uppercase font-light">
          Tera · Pura Natura
        </span>
        <Link href="/menu" className="text-white/70 hover:text-white transition-colors text-[10px] tracking-[0.24em] uppercase font-medium">
          Menu
        </Link>
      </header>

      <section ref={heroRef} className="relative min-h-[100svh] z-10 overflow-hidden px-4 py-20 md:py-28 lg:px-10">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <Image
            src="/images/tera-experience.png"
            alt="Progetto TERA senza glutine"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#182015]/78 via-[#748470]/46 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-transparent to-[#748470]/78" />
          <div className="absolute left-0 top-0 h-full w-[min(62rem,72vw)] bg-[radial-gradient(ellipse_at_left,rgba(8,12,7,0.56),rgba(8,12,7,0.24)_54%,transparent_78%)]" />
        </motion.div>

        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-11rem)] md:min-h-[calc(100svh-14rem)] max-w-7xl items-center gap-6 lg:gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-2xl rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 bg-[#182015]/30 p-4 sm:p-6 shadow-[0_30px_120px_rgba(0,0,0,0.24)] backdrop-blur-[10px] md:p-8">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15 }}
              className="mb-5 md:mb-8 block text-[10px] font-medium uppercase tracking-[0.46em] text-white/72 md:text-xs"
            >
              Timilia presenta
            </motion.span>

            <motion.div
              style={{ scale: logoScale }}
              initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 md:mb-10 w-[min(82vw,35rem)]"
            >
              <TeraWordmark priority />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.72 }}
              className="mb-4 text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light leading-tight tracking-[0.06em] text-white"
            >
              Il senza glutine diventa esperienza.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="max-w-xl text-sm sm:text-base font-light leading-relaxed text-white/76 md:text-xl"
            >
              TERA è il risultato di anni di studio, prove e sacrifici: un progetto nato per cambiare la percezione della pizza gluten free.
            </motion.p>
          </motion.div>

          {/* Mini cards — visible on all viewports, clickable */}
          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 lg:gap-4"
          >
            {heroCards.map((card) => (
              <button
                key={card.title}
                onClick={() => handleOpenCard(card)}
                className="group text-left rounded-2xl sm:rounded-3xl border border-white/12 bg-black/18 p-4 sm:p-6 backdrop-blur-md transition-all duration-500 hover:bg-white/[0.08] hover:border-white/24 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/10 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <card.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white/78 stroke-[1.2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.28em] text-white/88">{card.title}</h3>
                    <p className="text-xs sm:text-sm font-light leading-relaxed text-white/62">{card.desc}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-white/40 group-hover:text-white/70 transition-colors duration-500">
                      <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-light">Scopri di più</span>
                      <span className="text-[10px] sm:text-xs transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/48 text-[9px] tracking-[0.3em] uppercase">Scopri</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-10 w-px bg-gradient-to-b from-white/50 to-transparent"
            />
          </div>
        </motion.div>
      </section>

      {/* Fusione — full-width, consecutiva all'hero, bordi sfumati */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 w-full h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 1%, black 99%, transparent 100%), linear-gradient(to right, transparent 0%, black 1%, black 99%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 1%, black 99%, transparent 100%), linear-gradient(to right, transparent 0%, black 1%, black 99%, transparent 100%)",
          WebkitMaskComposite: "intersect",
          maskComposite: "intersect",
        }}
      >
        <Image
          src="/images/fusione2.png"
          alt="TERA e TIMILIA"
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />

      </motion.div>

      {/* Contenuto */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        {/* Racconto — La storia */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="space-y-5 md:space-y-6 mb-16 md:mb-24"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-10 bg-white/30" />
            <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-medium">
              La storia
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-wide text-white mb-4 md:mb-6">
            Quando la pizza senza glutine<br />diventa gourmet
          </h2>
          <p className="text-white/70 text-sm md:text-base lg:text-lg font-light leading-relaxed">
            C'è una cosa che sicuramente preoccupa il 90% delle persone intolleranti al glutine:
            non poter mangiare più una vera pizza! Fino a pochi anni fa era impossibile poterne
            mangiare una gluten-free che avesse lo stesso sapore e l'identico aspetto di una pizza
            contenente glutine.
          </p>
          <p className="text-white/70 text-sm md:text-base lg:text-lg font-light leading-relaxed">
            Inizialmente, la scarsa conoscenza di prodotti naturali, freschi e genuini da poter
            utilizzare per la realizzazione di impasti di buona qualità ha fatto sì che la pizza
            per celiaci fosse considerata da tutti non buona, non appetibile e diversa.
          </p>
          <p className="text-white/70 text-sm md:text-base lg:text-lg font-light leading-relaxed">
            Grazie all'evoluzione e alla ricerca scientifica si è continuato a lavorare sodo. Ad
            oggi, Timilia è assolutamente in grado di offrire una soluzione degna di essere
            considerata gourmet: la pizza senza glutine può essere di altissimo livello. È proprio
            questa l'essenza di Tera: <span className="text-white font-medium">raggiungere l'eccellenza del gluten-free</span>.
          </p>
        </motion.div>
      </div>

      {/* Shop TERA — blend senza glutine, dopo la storia */}
      <TeraShop />

      {/* Contenuto — proprietà e farine */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        {/* Proprietà nutrizionali — card moderne */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mb-16 md:mb-24"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-10 bg-white/30" />
            <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-medium">
              Proprietà
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-wide text-white mb-3 md:mb-4">
            Nutrizione d'eccellenza
          </h2>
          <p className="text-white/50 text-sm font-light mb-8 md:mb-10 max-w-xl">
            Tera possiede un ricco quantitativo di vitamine quali calcio, magnesio, zinco, fosforo e ferro.
            Un notevole apporto di fibre e un basso contenuto glicemico.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {proprieta.map((p, i) => (
              <ProprietaCard key={p.title} p={p} i={i} isInView={isInView} onClick={() => handleOpenCard(p)} />
            ))}
          </div>
        </motion.div>

        {/* Le farine — sezione immersiva */}
        <motion.div
          ref={farineRef}
          initial={{ opacity: 0, y: 30 }}
          animate={farineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-16 md:mb-24"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-4 h-4 text-white/60" />
            <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-medium">
              Il blend Timilia
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-wide text-white mb-3 md:mb-4">
            Le farine che usiamo
          </h2>
          <p className="text-white/50 text-sm font-light mb-8 md:mb-10 max-w-xl">
            Un blend esclusivo studiato da Timilia: sorgo, saraceno, miglio e piselli per un impasto
            leggero, digeribile e gustoso. Il basso contenuto glicemico è dettato dalla presenza
            di questi cereali antichi.
          </p>
          <div className="space-y-5">
            {farine.map((f, i) => (
              <FarinaCard key={f.title} f={f} i={i} farineInView={farineInView} onClick={() => handleOpenCard(f)} />
            ))}
          </div>
        </motion.div>

        {/* Citazione — grande, centrata, d'impatto */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={farineInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-center py-12 md:py-20 mb-12 md:mb-20 relative"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-[120px] md:text-[200px] font-light text-white/[0.04] leading-none select-none">
              "
            </div>
          </div>
          <p className="relative text-white/90 text-xl sm:text-2xl md:text-4xl font-light italic leading-relaxed max-w-3xl mx-auto">
            Ma siamo sicuri che sia senza glutine?
          </p>
          <p className="text-white/50 text-sm md:text-base font-light mt-6 max-w-xl mx-auto leading-relaxed">
            Questa è la domanda che spesso ci viene posta dopo che i clienti gustano la nostra
            pizza senza glutine. Siamo orgogliosi del lavoro svolto, degli obiettivi raggiunti e
            non vediamo l'ora di stupirvi sempre di più.
          </p>
        </motion.div>

        {/* Giuseppe D'Angelo — il Maestro di Timilia */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={farineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="border-t border-white/10 pt-12 md:pt-16 mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-10 bg-white/30" />
            <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-medium">
              Il Maestro Giuseppe D&apos;Angelo
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <div className="md:w-1/3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white/5">
                <Image
                  src="/images/giuseppe-dangelo-color.png"
                  alt="Giuseppe D'Angelo"
                  fill
                  className="object-cover object-[58%_center] saturate-[1.05]"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#748470]/45 to-transparent" />
              </div>
            </div>
            <div className="md:w-2/3 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-light tracking-wide text-white mb-4">
                Giuseppe D'Angelo
              </h3>
              <div className="w-10 h-px bg-white/30 mb-6" />
              <p className="text-white/65 text-sm md:text-base font-light leading-relaxed mb-4">
                Presidente dell'Associazione Scuola Maestri Pizzaioli Professional, è un Maestro
                Pizzaiolo con 39 anni d'esperienza e apprezzato tecnico di panificazione. Nel corso
                della sua carriera si è distinto per l'introduzione della tecnica di maturazione
                applicata agli impasti alternativi e biologici.
              </p>
              <p className="text-white/55 text-sm font-light leading-relaxed">
                Vanta la presenza come Giurato in importanti Campionati Mondiali, Europei e
                Nazionali. Il suo obiettivo principale è quello di divulgare la pizza di Qualità e
                di rivalutare i prodotti tipici della sua regione quali i Grani Antichi Siciliani.
                Relatore tecnico, Master Istruttore della Scuola Italiana Pizzaioli e da circa 18
                anni Docente di Corsi di alta formazione professionale nel settore della
                panificazione. Ideatore di Blend di farine e di impasti alternativi specializzato
                nelle preparazioni di mix Gluten Free.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA finale */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={farineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center"
        >
          <a
            href="/menu"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 border border-white/20 text-white text-xs tracking-[0.25em] uppercase font-medium hover:bg-white/15 hover:border-white/40 transition-all duration-500 group rounded-full backdrop-blur-sm"
          >
            Scopri il menu Timilia
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
          </a>
          <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-light mt-6">
            Timilia · Pizza di Sicilia · Palermo
          </p>
        </motion.div>
      </div>
      <TeraFeatureModal content={activeCard} onClose={handleCloseCard} />
    </div>
  );
}

/* ---------- Premium Proprieta Card ---------- */
function ProprietaCard({
  p,
  i,
  isInView,
  onClick,
}: {
  p: TeraFeatureContent;
  i: number;
  isInView: boolean;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    const spot = spotlightRef.current;
    if (!el || !spot) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    spot.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.14), transparent 180px)`;
    spot.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    const spot = spotlightRef.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    if (spot) spot.style.opacity = "0";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.6 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={cardRef}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative min-h-44 cursor-pointer overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.105),rgba(255,255,255,0.035))] p-6 backdrop-blur-md transition-all duration-500 hover:border-white/30 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none hover:shadow-[0_28px_90px_rgba(0,0,0,0.26)]"
        style={{ willChange: "transform", transformStyle: "preserve-3d" }}
      >
        <div ref={spotlightRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300" />
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/[0.07] blur-2xl transition-transform duration-700 group-hover:scale-150" />
        <div className="absolute -bottom-16 left-8 h-24 w-24 rounded-full bg-[#d7e0cd]/[0.07] blur-2xl transition-transform duration-700 group-hover:scale-150" />
        <div className="absolute inset-0 translate-y-full bg-gradient-to-t from-white/[0.09] to-transparent transition-transform duration-500 group-hover:translate-y-0" />
        <div className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
        <div className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-gradient-to-l from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
        <div className="relative flex items-start gap-4" style={{ transform: "translateZ(30px)" }}>
          <div className="relative w-12 h-12 rounded-2xl border border-white/12 bg-white/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-white/18 group-hover:rotate-6 group-hover:scale-110">
            <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 blur-md transition-colors duration-500" />
            <p.icon className="relative w-5 h-5 text-white/80 stroke-[1.3] transition-transform duration-500 group-hover:scale-110" />
          </div>
          <div className="relative">
            <h3 className="text-white text-sm tracking-wide font-medium mb-1.5 transition-colors duration-500 group-hover:text-white">
              {p.title}
            </h3>
            <p className="text-white/55 text-sm font-light leading-relaxed transition-colors duration-500 group-hover:text-white/72">
              {p.desc}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-white/40 group-hover:text-white/70 transition-colors duration-500">
              <span className="text-[10px] tracking-[0.2em] uppercase font-light">Scopri di più</span>
              <span className="text-xs transition-transform duration-500 group-hover:translate-x-1">→</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Premium Farina Card ---------- */
function FarinaCard({
  f,
  i,
  farineInView,
  onClick,
}: {
  f: TeraFeatureContent;
  i: number;
  farineInView: boolean;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    const spot = spotlightRef.current;
    if (!el || !spot) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -4;
    const rotateY = ((x - cx) / cx) * 4;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    spot.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12), transparent 200px)`;
    spot.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    const spot = spotlightRef.current;
    if (el) el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    if (spot) spot.style.opacity = "0";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={farineInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={cardRef}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative flex flex-col gap-4 cursor-pointer overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] p-5 sm:p-7 transition-all duration-500 hover:border-white/28 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none hover:shadow-[0_28px_90px_rgba(0,0,0,0.24)] sm:flex-row"
        style={{ willChange: "transform", transformStyle: "preserve-3d" }}
      >
        <div ref={spotlightRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300" />
        <div className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-white/60 to-transparent transition-transform duration-500 group-hover:scale-y-100" />
        <div className="absolute -right-12 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-white/[0.055] blur-2xl transition-transform duration-700 group-hover:scale-150" />
        <div className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-white/50 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
        <div className="absolute top-0 left-0 h-px w-full origin-right scale-x-0 bg-gradient-to-l from-white/40 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
        <div className="relative sm:w-36 flex-shrink-0 flex items-center gap-3" style={{ transform: "translateZ(25px)" }}>
          <div className="relative w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 text-xs font-light transition-all duration-500 group-hover:border-white/40 group-hover:text-white/80 group-hover:scale-110">
            <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/8 blur-md transition-colors duration-500" />
            <span className="relative">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="text-white text-lg font-light tracking-wide transition-colors duration-500 group-hover:text-white">
            {f.title}
          </h3>
          {f.emoji && <span className="text-lg sm:text-xl ml-0.5">{f.emoji}</span>}
        </div>
        <div className="relative flex-1" style={{ transform: "translateZ(15px)" }}>
          <p className="text-white/60 text-sm md:text-base font-light leading-relaxed transition-colors duration-500 group-hover:text-white/76">
            {f.desc}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-white/40 group-hover:text-white/70 transition-colors duration-500">
            <span className="text-[10px] tracking-[0.2em] uppercase font-light">Scopri di più</span>
            <span className="text-xs transition-transform duration-500 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
