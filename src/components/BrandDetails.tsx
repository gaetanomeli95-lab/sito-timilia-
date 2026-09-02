"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function BrandDetails() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="brand" ref={ref} className="relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="relative aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden edge-fade-wide image-glow"
      >
        <Image
          src="/images/brand-details.png"
          alt="Brand TIMILIA"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </motion.div>
    </section>
  );
}
