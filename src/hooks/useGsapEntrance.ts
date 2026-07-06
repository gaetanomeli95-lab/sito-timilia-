"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useGsapEntrance<T extends HTMLElement = HTMLDivElement>(
  deps: unknown[] = []
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const items = containerRef.current!.querySelectorAll<HTMLElement>(
        "[data-entrance]"
      );

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 24,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.05,
        }
      );
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
