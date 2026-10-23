"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useMatterTimeline } from "@/components/matter/useMatterTimeline";
import { arrival, blend, heroImages, matter, research, type TeraPhoto } from "@/data/teraStoryData";
import styles from "./TeraMatterJourney.module.css";

const MatterCanvas = dynamic(() => import("@/components/matter/MatterCanvas"), { ssr: false });
const photographs: TeraPhoto[] = [
  { ...heroImages.hands, ratio: 16 / 9 },
  research.photos[0],
  blend.photo,
  arrival.hero,
];
const chapterNames = [matter.title, research.title, blend.title, arrival.title];
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

function JourneyPhoto({ photo, index, progress }: { photo: TeraPhoto; index: number; progress: MotionValue<number> }) {
  // The outgoing image stays opaque beneath the incoming image. The transition
  // therefore never fades through an empty/dark frame between chapters.
  const opacity = useTransform(progress, (p) => index === 0 ? 1 : smooth((p * 3 - index + 0.68) / 0.36));
  const visibility = useTransform(progress, (p) => p * 3 > index + 0.70 || p * 3 < index - 0.70 ? "hidden" : "visible");
  const scale = useTransform(progress, [0, 1], [1.035, 1]);
  return (
    <motion.div className={`${styles.photograph} ${index === 3 ? styles.finalPhoto : ""}`} style={{ opacity, scale, visibility }}>
      <Image src={photo.src} alt="" fill loading="lazy" sizes="(max-width: 767px) 100vw, 56vw" quality={82} className={styles.image} />
    </motion.div>
  );
}

function JourneyCaption({ index, active }: { index: number; active: number }) {
  return <motion.div className={styles.caption} initial={false}
    animate={{ opacity: active === index ? 1 : 0, y: index === active ? 0 : index < active ? -18 : 18 }}
    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
    <span className={styles.captionNumber}>0{index + 2}</span>
    <span>{chapterNames[index]}</span>
  </motion.div>;
}

/** A single surface crosses four semantic chapters. Native scroll remains native. */
export default function TeraMatterJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  const targetProgress = useMotionValue(0);
  const progress = useMatterTimeline(targetProgress);
  const reduce = useReducedMotion();
  const [canvasReady, setCanvasReady] = useState(false);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const onCanvasReady = useCallback(() => setCanvasReady(true), []);
  const enhanced = canvasReady && reduce === false;
  const materialOpacity = useTransform(progress, [0, 0.23, 0.46, 0.70, 0.88, 1], [1, 0.95, 0.85, 0.70, 0.3, 0]);
  const lineScale = useTransform(progress, [0, 1], [0.04, 1]);

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.min(3, Math.max(0, Math.round(value * 3)));
    // React only renders at a chapter boundary, never on every scroll frame.
    if (next !== activeRef.current) { activeRef.current = next; setActive(next); }
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enhanced) return;
    let anchors: number[] = [];
    let frame = 0;
    let disposed = false;
    const update = () => {
      frame = 0;
      if (anchors.length !== 4) return;
      const y = window.scrollY;
      let value = 0;
      if (y >= anchors[3]) value = 1;
      else {
        for (let i = 0; i < 3; i++) {
          if (y >= anchors[i] && y < anchors[i + 1]) {
            value = (i + (y - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i])) / 3;
            break;
          }
        }
      }
      targetProgress.set(value);
    };
    const measure = () => {
      if (disposed) return;
      // Measure only on layout changes, never on every scroll frame.
      anchors = Array.from(root.querySelectorAll<HTMLElement>("[data-matter-step]")).map((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height * 0.38 - window.innerHeight * 0.38;
      });
      update();
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", measure);
    document.fonts.ready.then(measure);
    measure();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", measure);
    };
  }, [enhanced, targetProgress]);

  return (
    <div ref={rootRef} className={styles.journey} data-motion={enhanced ? "ready" : "static"}>
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.visual}>
          <div className={styles.photoField}>
            {photographs.map((photo, index) => <JourneyPhoto key={photo.src} photo={photo} index={index} progress={progress} />)}
          </div>
          <motion.div className={styles.material} style={{ opacity: materialOpacity }}>
            <MatterCanvas progress={progress} onReady={onCanvasReady} className={styles.canvas} />
          </motion.div>
          <div className={styles.visualCaption}>
            {chapterNames.map((name, index) => <JourneyCaption key={name} index={index} active={active} />)}
          </div>
          <div className={styles.progressTrack}><motion.span style={{ scaleX: lineScale }} /></div>
        </div>
      </div>

      <div className={styles.content}>
        <section id={matter.id} data-matter-step className={styles.chapter}>
          <ChapterLabel number={matter.number} title={matter.title} />
          <h2>{matter.headline[0]} <em>{matter.headline[1]}</em></h2>
          <div className={styles.prose}>{matter.paragraphs.map((p) => <p key={p}>{p}</p>)}</div>
          <div className={styles.words}>{matter.words.map((word) => <span key={word}>{word}</span>)}</div>
          <StaticPhoto photo={photographs[0]} />
        </section>

        <section id={research.id} data-matter-step className={styles.chapter}>
          <ChapterLabel number={research.number} title={research.title} />
          <blockquote className={styles.quote}>
            {research.bigQuote[0].join(" ")}<br /><span>{research.bigQuote[1].join(" ")}</span>
          </blockquote>
          <h2>{research.headline[0]} <em>{research.headline[1]}</em></h2>
          <div className={styles.prose}>{research.paragraphs.map((p) => <p key={p}>{p}</p>)}</div>
          <ol className={styles.ledger}>
            {research.ledger.map((row, i) => <li key={row.verb}><span>0{i + 1}</span><div><strong>{row.verb}</strong><p>{row.note}</p></div></li>)}
          </ol>
          <StaticPhoto photo={photographs[1]} />
          <figure className={styles.proof}>
            <div><Image src={research.photos[1].src} alt={research.photos[1].alt} fill sizes="(max-width: 767px) 80vw, 350px" quality={76} /></div>
            <figcaption>{research.photosCaption}</figcaption>
          </figure>
        </section>

        <section id={blend.id} data-matter-step className={styles.chapter}>
          <ChapterLabel number={blend.number} title={blend.title} />
          <h2>{blend.headline[0]} <em>{blend.headline[1]}</em></h2>
          <div className={styles.prose}>{blend.paragraphs.map((p) => <p key={p}>{p}</p>)}</div>
          <div className={`${styles.words} ${styles.blendWords}`}>{blend.words.map((word, i) => <span key={word}><small>0{i + 1}</small>{word}</span>)}</div>
          <StaticPhoto photo={photographs[2]} />
        </section>

        <section id={arrival.id} data-matter-step className={`${styles.chapter} ${styles.arrival}`}>
          <ChapterLabel number={arrival.number} title={arrival.title} />
          <h2>{arrival.headline[0]} <em>{arrival.headline[1]}</em></h2>
          <p className={styles.arrivalQuote}>{arrival.quote[0]} <span>{arrival.quote[1]}</span></p>
          <div className={styles.prose}>{arrival.paragraphs.map((p) => <p key={p}>{p}</p>)}</div>
          <StaticPhoto photo={photographs[3]} />
          <figure className={styles.proof}>
            <div><Image src={arrival.detail.src} alt={arrival.detail.alt} fill sizes="(max-width: 767px) 80vw, 350px" quality={76} /></div>
          </figure>
        </section>
      </div>
    </div>
  );
}

function ChapterLabel({ number, title }: { number: string; title: string }) {
  return <p className={styles.label}><span>{number}</span><span className={styles.labelRule} aria-hidden="true" />{title}</p>;
}

function StaticPhoto({ photo }: { photo: TeraPhoto }) {
  return <>
    <figure className={styles.staticPhoto} style={{ aspectRatio: photo.ratio }}>
      <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 767px) 100vw, 56vw" quality={82} />
    </figure>
    <p className="sr-only">{photo.alt}</p>
  </>;
}
