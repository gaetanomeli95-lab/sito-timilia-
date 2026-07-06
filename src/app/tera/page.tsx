"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, WheatOff, FlaskConical, Leaf, Heart, Sparkles, ArrowRight } from "lucide-react";

const farine = [
  {
    nome: "Teff",
    desc: "Un cereale antico originario dell'Etiopia, naturalmente senza glutine. Ricco di ferro, calcio e fibre, conferisce all'immasto una struttura morbida e un leggero sapore di nocciola.",
  },
  {
    nome: "Miglio",
    desc: "Cereale antico altamente digeribile, fonte di magnesio e fosforo. Contribuisce alla leggerezza dell'impasto e alla sua fragranza.",
  },
  {
    nome: "Piselli",
    desc: "Farina di piselli che apporta proteine vegetali e un basso indice glicemico. Migliora la struttura e la tenuta dell'impasto senza glutine.",
  },
];

const proprieta = [
  { icon: Heart, label: "Ricco di vitamine", desc: "Calcio, magnesio, zinco, fosforo e ferro" },
  { icon: Leaf, label: "Alto apporto di fibre", desc: "Per una digestione leggera e naturale" },
  { icon: WheatOff, label: "Senza glutine", desc: "Impasto dedicato per celiaci e intolleranti" },
  { icon: FlaskConical, label: "Basso indice glicemico", desc: "Teff, miglio e piselli per un impasto equilibrato" },
];

export default function TeraPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const farineRef = useRef(null);
  const farineInView = useInView(farineRef, { once: true, margin: "-50px" });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#6F7E5C" }}>
      {/* Sfondo con gradient e texture */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.08), transparent 40%), radial-gradient(circle at 80% 30%, rgba(0,0,0,0.10), transparent 35%), radial-gradient(circle at 50% 80%, rgba(0,0,0,0.12), transparent 40%), #6F7E5C",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header fisso con logo TIMILIA */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 lg:px-10 py-4 backdrop-blur-md" style={{ background: "rgba(111, 126, 92, 0.85)" }}>
        <Link
          href="/"
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[10px] tracking-[0.2em] uppercase font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Torna al sito</span>
        </Link>
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="TIMILIA"
            width={30}
            height={30}
            className="object-contain"
          />
          <span className="text-white text-[11px] tracking-[0.3em] uppercase font-semibold">
            Timilia
          </span>
        </Link>
        <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-light">
          Tera
        </span>
      </header>

      {/* Hero — full screen con logo TERA */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center z-10">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center px-6"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white/60 text-xs tracking-[0.4em] uppercase font-medium block mb-8"
          >
            Timilia presenta
          </motion.span>

          <motion.div
            style={{ scale: logoScale }}
            className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-8"
          >
            <Image
              src="/images/logo-tera.avif"
              alt="Logo TERA"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 192px, 256px"
              priority
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl font-light tracking-[0.12em] text-white mb-4"
          >
            TERA
          </motion.h1>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-white/50 text-sm tracking-[0.3em] uppercase font-light block mb-6"
          >
            L'eccellenza del gluten-free
          </motion.span>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="w-16 h-px bg-white/40 mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="text-white/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto"
          >
            Nel cuore di Palermo, Timilia dà vita a Tera: un progetto senza glutine
            che unisce ricerca, innovazione e tradizione siciliana.
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase">Scopri</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
            />
          </div>
        </motion.div>
      </section>

      {/* Contenuto */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 pb-24">
        {/* Immagine TERA con parallax */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-20 shadow-2xl"
        >
          <Image
            src="/images/tera-experience.png"
            alt="Progetto TERA"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#6F7E5C]/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-white/80 text-xs tracking-[0.3em] uppercase font-light">
              Timilia · Tera
            </span>
          </div>
        </motion.div>

        {/* Racconto — La storia */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="space-y-6 mb-24"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-10 bg-white/30" />
            <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-medium">
              La storia
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white mb-6">
            Quando la pizza senza glutine<br />diventa gourmet
          </h2>
          <p className="text-white/70 text-base md:text-lg font-light leading-relaxed">
            C'è una cosa che sicuramente preoccupa il 90% delle persone intolleranti al glutine:
            non poter mangiare più una vera pizza! Fino a pochi anni fa era impossibile poterne
            mangiare una gluten-free che avesse lo stesso sapore e l'identico aspetto di una pizza
            contenente glutine.
          </p>
          <p className="text-white/70 text-base md:text-lg font-light leading-relaxed">
            Inizialmente, la scarsa conoscenza di prodotti naturali, freschi e genuini da poter
            utilizzare per la realizzazione di impasti di buona qualità ha fatto sì che la pizza
            per celiaci fosse considerata da tutti non buona, non appetibile e diversa.
          </p>
          <p className="text-white/70 text-base md:text-lg font-light leading-relaxed">
            Grazie all'evoluzione e alla ricerca scientifica si è continuato a lavorare sodo. Ad
            oggi, Timilia è assolutamente in grado di offrire una soluzione degna di essere
            considerata gourmet: la pizza senza glutine può essere di altissimo livello. È proprio
            questa l'essenza di Tera: <span className="text-white font-medium">raggiungere l'eccellenza del gluten-free</span>.
          </p>
        </motion.div>

        {/* Proprietà nutrizionali — card moderne */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-10 bg-white/30" />
            <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-medium">
              Proprietà
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white mb-4">
            Nutrizione d'eccellenza
          </h2>
          <p className="text-white/50 text-sm font-light mb-10 max-w-xl">
            Tera possiede un ricco quantitativo di vitamine quali calcio, magnesio, zinco, fosforo e ferro.
            Un notevole apporto di fibre e un basso contenuto glicemico.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {proprieta.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group flex items-start gap-4 p-6 rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-sm hover:bg-white/[0.10] hover:border-white/20 transition-all duration-500"
              >
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/15 transition-colors duration-500">
                  <p.icon className="w-5 h-5 text-white/80 stroke-[1.3]" />
                </div>
                <div>
                  <h3 className="text-white text-sm tracking-wide font-medium mb-1.5">
                    {p.label}
                  </h3>
                  <p className="text-white/55 text-sm font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Le farine — sezione immersiva */}
        <motion.div
          ref={farineRef}
          initial={{ opacity: 0, y: 30 }}
          animate={farineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-4 h-4 text-white/60" />
            <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-medium">
              Il blend Timilia
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white mb-4">
            Le farine che usiamo
          </h2>
          <p className="text-white/50 text-sm font-light mb-10 max-w-xl">
            Un blend esclusivo studiato da Timilia: teff, miglio e piselli per un impasto
            leggero, digeribile e gustoso. Il basso contenuto glicemico è dettato dalla presenza
            di questi cereali antichi.
          </p>
          <div className="space-y-5">
            {farine.map((f, i) => (
              <motion.div
                key={f.nome}
                initial={{ opacity: 0, x: -30 }}
                animate={farineInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 6, transition: { duration: 0.3 } }}
                className="group flex flex-col sm:flex-row gap-4 p-7 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500"
              >
                <div className="sm:w-36 flex-shrink-0 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 text-xs font-light">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-white text-lg font-light tracking-wide">
                    {f.nome}
                  </h3>
                </div>
                <p className="text-white/60 text-sm md:text-base font-light leading-relaxed flex-1">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Citazione — grande, centrata, d'impatto */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={farineInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-center py-20 mb-20 relative"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-[120px] md:text-[200px] font-light text-white/[0.04] leading-none select-none">
              "
            </div>
          </div>
          <p className="relative text-white/90 text-2xl md:text-4xl font-light italic leading-relaxed max-w-3xl mx-auto">
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
          className="border-t border-white/10 pt-16 mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-10 bg-white/30" />
            <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-medium">
              Il Maestro di Timilia
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white/5">
                <Image
                  src="/images/tommaso.png"
                  alt="Giuseppe D'Angelo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6F7E5C]/40 to-transparent" />
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

        {/* CTA finale */}
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
    </div>
  );
}
