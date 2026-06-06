"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
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
    <section id="tera" ref={ref} className="relative py-24 md:py-40 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium block mb-4">
              Progetto
            </span>
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.05em] text-foreground mb-6">
              TERA
            </h2>
            <p className="text-foreground/60 text-lg font-light leading-relaxed mb-4">
              TERA è il progetto senza glutine di TIMILIA.
            </p>
            <p className="text-foreground/50 text-base font-light leading-relaxed mb-8">
              Un&apos;esperienza che nasce dalla ricerca, dalla leggerezza e dall&apos;innovazione. Un impasto studiato per chi cerca il benessere senza compromessi, dove ogni ingrediente selezionato contribuisce a un&apos;esperienza premium gluten free.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                  className="group"
                >
                  <feature.icon className="w-5 h-5 text-gold mb-3 stroke-1" />
                  <h3 className="text-foreground text-sm tracking-[0.1em] uppercase font-medium mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/50 text-sm font-light leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2 relative aspect-[16/9] md:aspect-[3/2] lg:aspect-[4/3] overflow-hidden"
          >
            <Image
              src="/images/tera-experience.png"
              alt="Progetto TERA"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
