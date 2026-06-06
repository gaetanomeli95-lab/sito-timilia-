"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const images = [
  { src: "/images/sfondi/1.png", alt: "Preparazione impasto TERA senza glutine" },
  { src: "/images/sfondi/2.png", alt: "Dettaglio ingredienti" },
  { src: "/images/sfondi/3.png", alt: "Pizza gourmet" },
  { src: "/images/sfondi/4.png", alt: "Logo Timilia" },
  { src: "/images/sfondi/5.png", alt: "Esterno locale serale" },
];

const overlayStyle: React.CSSProperties = {
  background:
    "linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.25) 25%, rgba(10,10,10,0.25) 75%, rgba(10,10,10,0.95) 100%)",
};

function StoryFrame({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <div ref={ref} className="relative w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative h-[50vh] lg:h-[70vh] w-full"
      >
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 pointer-events-none" style={overlayStyle} />
      </motion.div>
    </div>
  );
}

export default function VisualStorySection() {
  return (
    <section className="relative bg-background">
      {images.map((img) => (
        <StoryFrame key={img.src} src={img.src} alt={img.alt} />
      ))}
    </section>
  );
}
