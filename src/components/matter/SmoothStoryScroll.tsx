"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

/** Smooth wheel steps on story pages; touch and reduced-motion stay native. */
export default function SmoothStoryScroll() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | undefined;
    let generation = 0;
    const syncLock = () => {
      if (!instance) return;
      if (document.body.style.overflow === "hidden") instance.stop();
      else instance.start();
    };
    const configure = async () => {
      const current = ++generation;
      instance?.destroy();
      instance = undefined;
      if (preference.matches) return;
      const { default: Lenis } = await import("lenis");
      if (generation !== current || preference.matches) return;
      instance = new Lenis({
        autoRaf: true,
        smoothWheel: true,
        syncTouch: false,
        lerp: 0.095,
        anchors: { offset: -90 },
        stopInertiaOnNavigate: true,
        prevent: (node) => node.hasAttribute("data-lenis-prevent") || node.getAttribute("role") === "dialog",
      });
      syncLock();
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    preference.addEventListener("change", configure);
    void configure();
    return () => {
      generation++;
      instance?.destroy();
      observer.disconnect();
      preference.removeEventListener("change", configure);
    };
  }, []);
  return null;
}
