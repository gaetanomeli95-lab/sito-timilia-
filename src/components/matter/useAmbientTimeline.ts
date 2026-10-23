"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useMatterTimeline } from "./useMatterTimeline";

/** One position-based timeline works in either direction. The measured articles
 * stay still; reveals animate only their contents, never the scroll targets. */
export function useAmbientTimeline(rootRef: RefObject<HTMLDivElement>, count: number) {
  const target = useMotionValue(0);
  const smoothed = useMatterTimeline(target);
  const reduce = useReducedMotion();
  const progress = reduce ? target : smoothed;
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.max(0, Math.min(count - 1, Math.round(value)));
    if (next !== activeRef.current) { activeRef.current = next; setActive(next); }
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const articles = Array.from(root.querySelectorAll<HTMLElement>("[data-ambient-chapter]"));
    let anchors: number[] = [];
    let frame = 0;
    let disposed = false;
    const update = () => {
      frame = 0;
      if (!anchors.length) return;
      const y = window.scrollY;
      let value = y >= anchors[anchors.length - 1] ? count - 1 : 0;
      for (let i = 0; i < anchors.length - 1; i++) {
        if (y >= anchors[i] && y < anchors[i + 1]) {
          value = i + (y - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i]);
          break;
        }
      }
      target.set(value);
    };
    const measure = () => {
      if (disposed) return;
      anchors = articles.map((article) => {
        const rect = article.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2;
      });
      update();
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    articles.forEach((article) => observer.observe(article));
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
  }, [count, rootRef, target]);

  return { progress, active };
}
