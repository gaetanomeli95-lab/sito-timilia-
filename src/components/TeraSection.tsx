"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import TeraWordmark from "@/components/TeraWordmark";
import { FlaskConical, Leaf, Heart, WheatOff } from "lucide-react";

const features = [
  {
    icon: FlaskConical,
    title: "Ricerca",
    desc: "Un approccio scientifico all'impasto, studiato per garantire leggerezza e digeribilità senza compromessi.",
  },
  {
    icon: WheatOff,
    title: "Senza Glutine",
    desc: "Un impasto dedicato, pensato per chi sceglie il benessere senza rinunciare al piacere della pizza.",
  },
  {
    icon: Leaf,
    title: "Ingredienti Selezionati",
    desc: "Ogni componente è scelto con cura, per un risultato che unisce qualità e naturalezza.",
  },
  {
    icon: Heart,
    title: "Benessere",
    desc: "Un'esperienza premium gluten free dove il gusto incontra la sensazione di leggerezza.",
  },
];

export default function TeraSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="tera" ref={ref} className="relative overflow-hidden py-24 md:py-40">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 24% 12%, rgba(255,255,255,0.13), transparent 32%), radial-gradient(circle at 78% 72%, rgba(0,0,0,0.24), transparent 36%), linear-gradient(135deg, #748470 0%, #5f6f5c 50%, #2f352d 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      />
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <span className="text-white/66 text-xs tracking-[0.34em] uppercase font-medium block mb-5">
              Progetto senza glutine
            </span>
            <div className="mb-8 w-[min(88vw,32rem)]">
              <TeraWordmark compact />
            </div>
            <h2 className="text-4xl md:text-6xl font-light leading-tight tracking-[0.04em] text-white mb-6">
              Una ricerca diventata identità.
            </h2>
            <p className="text-white/72 text-lg font-light leading-relaxed mb-4">
              TERA è il progetto gluten free di TIMILIA: anni di prove, studio e sacrifici per trasformare il senza glutine in un&apos;esperienza di altissimo livello.
            </p>
            <p className="text-white/58 text-base font-light leading-relaxed mb-8">
              Non una semplice alternativa, ma un mondo dedicato: impasto, metodo, natura e tecnica si incontrano per cambiare la percezione della pizza gluten free.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-9">
              {features.map((feature, i) => (
                <FeatureCard key={feature.title} feature={feature} i={i} isInView={isInView} />
              ))}
            </div>

            <motion.a
              href="/tera"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
              className="inline-flex items-center gap-3 rounded-full border border-white/35 bg-white/[0.06] px-7 py-3.5 text-white text-xs tracking-[0.22em] uppercase font-medium backdrop-blur-md hover:bg-white hover:text-[#748470] transition-all duration-500 group"
            >
              Entra nel mondo TERA
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative overflow-hidden rounded-[2rem] border border-white/12 bg-black/30 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.34)] transition-transform duration-700 hover:scale-[1.015]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-black/40">
              <Image
                src="/images/tera-experience.png"
                alt="Progetto TERA senza glutine"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-[#748470]/18" />
            </div>
            <div className="mt-4 rounded-2xl border border-white/12 bg-black/20 p-5 backdrop-blur-md">
              <p className="text-white/86 text-sm md:text-base font-light leading-relaxed">
                Farina, ricerca, tecnica: il mondo TERA nasce dalla materia prima e diventa esperienza Timilia.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Premium Feature Card ---------- */
function FeatureCard({
  feature,
  i,
  isInView,
}: {
  feature: { icon: typeof Heart; title: string; desc: string };
  i: number;
  isInView: boolean;
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
    spot.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.14), transparent 160px)`;
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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: "easeOut" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative cursor-default overflow-hidden rounded-[1.6rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.035))] p-5 backdrop-blur-md transition-all duration-500 hover:border-white/28 hover:shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
        style={{ willChange: "transform", transformStyle: "preserve-3d" }}
      >
        <div ref={spotlightRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300" />
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.07] blur-2xl transition-transform duration-700 group-hover:scale-150" />
        <div className="absolute inset-0 translate-y-full bg-gradient-to-t from-white/[0.08] to-transparent transition-transform duration-500 group-hover:translate-y-0" />
        <div className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
        <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/10 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110" style={{ transform: "translateZ(30px)" }}>
          <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 blur-md transition-colors duration-500" />
          <feature.icon className="relative w-5 h-5 text-white/78 stroke-1 transition-transform duration-500 group-hover:scale-110" />
        </div>
        <h3 className="relative text-white text-sm tracking-[0.12em] uppercase font-medium mb-2 transition-colors duration-500 group-hover:text-white" style={{ transform: "translateZ(20px)" }}>
          {feature.title}
        </h3>
        <p className="relative text-white/55 text-sm font-light leading-relaxed transition-colors duration-500 group-hover:text-white/72" style={{ transform: "translateZ(10px)" }}>
          {feature.desc}
        </p>
      </div>
    </motion.div>
  );
}
