"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import HomeMatterVisual from "./HomeMatterVisual";
import styles from "./AmbientVisual.module.css";

type Visual = { image: string; imageAlt: string; imagePosition: string; imageRatio: number; visualLabel: string; title: string };
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

function Photo({ chapter, index, progress, reduce }: { chapter: Visual; index: number; progress: MotionValue<number>; reduce: boolean | null }) {
  const [decoded, setDecoded] = useState(index === 0);
  // Keep the outgoing photograph opaque underneath the incoming photograph.
  // Mounted layers make reversing midway through a dissolve exactly reversible.
  const opacity = useTransform(progress, (p) => index === 0 ? 1 : reduce ? (p >= index - 0.5 ? 1 : 0) : smooth((p - index + 0.78) / 0.56));
  return (
    <motion.div className={styles.photo} style={{ opacity }} data-ambient-photo={index}>
      <motion.div className="absolute inset-0" initial={false} animate={{ opacity: decoded ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.45 }} data-photo-decoded={decoded}>
        <Image src={chapter.image} alt={chapter.imageAlt} fill loading="lazy"
          sizes={`max(42vw, calc(${chapter.imageRatio * 100}svh - ${chapter.imageRatio * 8}rem))`}
          style={{ objectPosition: chapter.imagePosition }} className="object-cover"
          onLoad={async (event) => {
            const image = event.currentTarget;
            try { await image.decode(); } catch { /* A completed image can still be painted. */ }
            if (image.naturalWidth > 0) setDecoded(true);
          }} />
      </motion.div>
    </motion.div>
  );
}

export default function AmbientVisual({ chapters, progress, active, matterProgress }: {
  chapters: Visual[];
  progress: MotionValue<number>;
  active: number;
  matterProgress: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "600px 0px" });
  const reduce = useReducedMotion();
  const materialVisibility = useTransform(progress, (p) => smooth((p - 0.22) / 0.56) * (1 - smooth((p - 1.22) / 0.56)));

  return (
    <div ref={ref} className="hidden lg:sticky lg:top-24 lg:block lg:h-[calc(100svh-8rem)] lg:self-start">
      <div className={`${styles.frame} relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#17130e] shadow-[0_40px_120px_rgba(0,0,0,0.42)]`} data-ambient-visual data-active-chapter={active}>
        {chapters.map((chapter, index) => index === 0 || near ? <Photo key={chapter.title} chapter={chapter} index={index} progress={progress} reduce={reduce} /> : null)}
        <HomeMatterVisual progress={matterProgress} visibility={materialVisibility} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(5,5,5,0.14)_48%,rgba(5,5,5,0.82)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-8">
          <div className="relative min-h-8">
            {chapters.map((chapter, index) => <motion.span key={chapter.title} initial={false}
              animate={{ opacity: active === index ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.25 }}
              aria-hidden={active !== index} className="absolute inset-x-0 bottom-0 text-[10px] uppercase leading-relaxed tracking-[0.3em] text-gold/78">{chapter.visualLabel}</motion.span>)}
          </div>
          <div className="mt-4 flex gap-1.5" aria-hidden="true">
            {chapters.map((chapter, index) => <span key={chapter.title} className={`h-px transition-[width,background-color] duration-300 ${index === active ? "w-10 bg-gold" : "w-4 bg-white/24"}`} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
