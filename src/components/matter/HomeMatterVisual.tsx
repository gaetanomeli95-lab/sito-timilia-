"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useMatterTimeline } from "./useMatterTimeline";

const MatterCanvas = dynamic(() => import("./MatterCanvas"), { ssr: false });

export default function HomeMatterVisual({ progress: target, visibility }: { progress: MotionValue<number>; visibility?: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const progress = useMatterTimeline(target);
  // A short version of the TERA movement: flour gathers and yields to the hands.
  const opacity = useTransform(progress, [0, 0.18, 0.66, 1], [0.4, 1, 0.7, 0]);
  if (reduce) return null;
  return (
    <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]" style={visibility ? { opacity: visibility } : undefined}>
      <motion.div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_10%,black_60%,transparent_95%)]" style={{ opacity }}>
        <MatterCanvas progress={progress} tone="warm" className="h-full w-full" />
      </motion.div>
    </motion.div>
  );
}
