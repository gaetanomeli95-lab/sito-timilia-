"use client";

import { useSpring, type MotionValue } from "framer-motion";

/** One damped clock drives photographs, material, captions and progress. */
export function useMatterTimeline(target: MotionValue<number>) {
  return useSpring(target, {
    stiffness: 160,
    damping: 26,
    mass: 0.6,
    restDelta: 0.00001,
    restSpeed: 0.0001,
  });
}
