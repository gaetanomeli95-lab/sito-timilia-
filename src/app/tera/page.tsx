"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, WheatOff, FlaskConical, Leaf, Heart, Sparkles } from "lucide-react";

const farine = [
  {
    nome: "Teff",
    desc: "Un cereale antico originario dell'Etiopia, naturalmente senza glutine. Ricco di ferro, calcio e fibre, conferisce all'impasto una struttura morbida e un leggero sapore di nocciola.",
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

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#6F7E5C" }}>
      {/* Sfondo */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.06), transparent 40%), radial-gradient(circle at 80% 30%, rgba(0,0,0,0.08), transparent 35%), radial-gradient(circle at 50% 80%, rgba(0,0,0,0.10), transparent 40%), #6F7E5C",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header con logo TIMILIA */}
      <header className="relative z-20 flex items-center justify-between px-5 lg:px-10 pt-6 pb-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[10px] tracking-[0.2em] uppercase font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Torna al sito</span>
        </Link>
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="TIMILIA"
            width={32}
            height={32}
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

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 pb-24">
        {/* Hero — TIMILIA presenta TERA */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center pt-12 pb-16"
        >
          <span className="text-white/60 text-xs tracking-[0.3em] uppercase font-medium block mb-4">
            Timilia presenta
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-[0.08em] text-white mb-4">
            TERA
          </h1>
          <span className="text-white/50 text-sm tracking-[0.2em] uppercase font-light block mb-6">
            L'eccellenza del gluten-free
          </span>
          <div className="w-16 h-px bg-white/30 mx-auto mb-6" />
          <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Nel cuore di Palermo, Timilia dà vita a Tera: un progetto senza glutine
            che unisce qualità, innovazione e responsabilità con un unico obiettivo:
            raggiungere l'eccellenza.
          </p>
        </motion.div>

        {/* Immagine TERA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="relative aspect-[16/9] overflow-hidden rounded-lg mb-16"
        >
          <Image
            src="/images/tera-experience.png"
            alt="Progetto TERA"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#6F7E5C]/50 to-transparent" />
        </motion.div>

        {/* Racconto — La storia */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="space-y-6 mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-white mb-4">
            La storia
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
            oggi, si può essere assolutamente in grado di offrire una soluzione degna di essere
            considerata gourmet: la pizza senza glutine può essere di altissimo livello. È proprio
            questa l'essenza di Tera: <span className="text-white font-medium">raggiungere l'eccellenza del gluten-free</span>.
          </p>
        </motion.div>

        {/* Proprietà nutrizionali */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-white mb-2">
            Proprietà nutrizionali
          </h2>
          <p className="text-white/50 text-sm font-light mb-8">
            Tera possiede un ricco quantitativo di vitamine e un notevole apporto di fibre.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {proprieta.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                className="flex items-start gap-4 p-5 rounded-lg border border-white/10 bg-white/[0.05]"
              >
                <p.icon className="w-5 h-5 text-white/70 mt-0.5 shrink-0 stroke-[1.2]" />
                <div>
                  <h3 className="text-white text-sm tracking-wide font-medium mb-1">
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

        {/* Le farine */}
        <motion.div
          ref={farineRef}
          initial={{ opacity: 0, y: 30 }}
          animate={farineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-white/60" />
            <h2 className="text-2xl md:text-3xl font-light tracking-wide text-white">
              Le farine che usiamo
            </h2>
          </div>
          <p className="text-white/50 text-sm font-light mb-8">
            Un blend esclusivo studiato da Timilia per un impasto leggero, digeribile e gustoso.
          </p>
          <div className="space-y-6">
            {farine.map((f, i) => (
              <motion.div
                key={f.nome}
                initial={{ opacity: 0, x: -20 }}
                animate={farineInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4 p-6 rounded-lg border border-white/10 bg-white/[0.04]"
              >
                <div className="sm:w-32 flex-shrink-0">
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

        {/* Citazione */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={farineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-center py-12 mb-16"
        >
          <p className="text-white/80 text-xl md:text-2xl font-light italic leading-relaxed max-w-2xl mx-auto">
            "Ma siamo sicuri che sia senza glutine?"
          </p>
          <p className="text-white/50 text-sm font-light mt-4 max-w-xl mx-auto">
            Questa è la domanda che spesso ci viene posta dopo che i clienti gustano la nostra
            pizza senza glutine. Siamo orgogliosi del lavoro svolto, degli obiettivi raggiunti e
            non vediamo l'ora di stupirvi sempre di più.
          </p>
        </motion.div>

        {/* Giuseppe D'Angelo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={farineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="border-t border-white/10 pt-12"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white/5">
                <Image
                  src="/images/tommaso.png"
                  alt="Giuseppe D'Angelo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            </div>
            <div className="md:w-2/3 flex flex-col justify-center">
              <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase font-medium block mb-3">
                Il Maestro di Timilia
              </span>
              <h3 className="text-2xl md:text-3xl font-light tracking-wide text-white mb-4">
                Giuseppe D'Angelo
              </h3>
              <div className="w-10 h-px bg-white/30 mb-5" />
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
          initial={{ opacity: 0 }}
          animate={farineInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a
            href="/menu"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-white/10 transition-all duration-500 group"
          >
            Scopri il menu
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
