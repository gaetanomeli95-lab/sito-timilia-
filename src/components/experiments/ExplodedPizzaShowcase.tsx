"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

export type ExplodedPizzaShowcaseProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  tone?: "dark" | "tera";
  notes: Array<{ label: string; detail: string }>;
};

const slices = [
  { top: 0, bottom: 76, y: -68, z: 90, rotate: -1.5 },
  { top: 22, bottom: 56, y: -30, z: 55, rotate: 1.2 },
  { top: 42, bottom: 34, y: 8, z: 25, rotate: -0.8 },
  { top: 61, bottom: 16, y: 46, z: 5, rotate: 0.9 },
  { top: 78, bottom: 0, y: 82, z: -20, rotate: -0.5 },
];

export default function ExplodedPizzaShowcase({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  tone = "dark",
  notes,
}: ExplodedPizzaShowcaseProps) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotY = useSpring(useTransform(pointerX, [-1, 1], [-7, 7]), { stiffness: 80, damping: 18 });
  const rotX = useSpring(useTransform(pointerY, [-1, 1], [5, -5]), { stiffness: 80, damping: 18 });
  const isTera = tone === "tera";

  return (
    <section
      className={`relative isolate overflow-hidden ${isTera ? "bg-[#ece8df] text-[#252a24]" : "bg-[#060504] text-white"}`}
      onPointerMove={(event) => {
        if (reduceMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1);
        pointerY.set(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div className={`absolute inset-0 -z-20 ${isTera ? "opacity-30" : "opacity-20"}`}>
        <Image src={image} alt="" fill className="object-cover blur-3xl scale-110" sizes="100vw" />
      </div>
      <div className={`absolute inset-0 -z-10 ${isTera ? "bg-[#ece8df]/90" : "bg-[#060504]/90"}`} />
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 opacity-40 ${
          isTera
            ? "bg-[radial-gradient(circle_at_50%_48%,rgba(90,105,87,0.18),transparent_31%),radial-gradient(circle_at_12%_20%,rgba(176,153,112,0.13),transparent_28%)]"
            : "bg-[radial-gradient(circle_at_50%_48%,rgba(198,144,72,0.20),transparent_31%),radial-gradient(circle_at_12%_20%,rgba(94,47,19,0.18),transparent_28%)]"
        }`}
      />

      <div className="mx-auto grid min-h-[92svh] max-w-[1500px] items-center gap-14 px-6 py-24 md:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:px-14 xl:px-20">
        <div className="relative z-20 max-w-xl">
          <div className="flex items-center gap-3">
            <span className={`h-px w-10 ${isTera ? "bg-[#5a6957]/70" : "bg-gold/80"}`} />
            <span className={`text-[10px] font-medium uppercase tracking-[0.36em] md:text-xs ${isTera ? "text-[#5a6957]" : "text-gold"}`}>
              {eyebrow}
            </span>
          </div>

          <h2 className="mt-7 text-[clamp(3rem,6.6vw,7rem)] font-light leading-[0.88] tracking-[-0.05em]">
            {title}
          </h2>
          <p className={`mt-7 max-w-lg text-base font-light leading-[1.85] md:text-lg ${isTera ? "text-[#252a24]/62" : "text-white/58"}`}>
            {subtitle}
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {notes.slice(0, 4).map((note, index) => (
              <motion.div
                key={note.label}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : index * 0.08 }}
                className={`border-t pt-4 ${isTera ? "border-[#5a6957]/22" : "border-white/12"}`}
              >
                <span className={`text-[10px] uppercase tracking-[0.24em] ${isTera ? "text-[#5a6957]" : "text-gold/80"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-sm font-medium uppercase tracking-[0.12em]">{note.label}</h3>
                <p className={`mt-1 text-sm font-light leading-relaxed ${isTera ? "text-[#252a24]/54" : "text-white/44"}`}>{note.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[34rem] md:min-h-[44rem] lg:min-h-[50rem]" style={{ perspective: "1500px" }}>
          <motion.div
            className="absolute inset-0"
            style={reduceMotion ? undefined : { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
          >
            <div className="absolute left-1/2 top-1/2 h-[18%] w-[70%] -translate-x-1/2 translate-y-[150%] rounded-[50%] bg-black/45 blur-3xl" />

            <motion.div
              className="absolute left-1/2 top-1/2 aspect-square w-[76%] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full opacity-18 blur-[1px]"
              animate={reduceMotion ? undefined : { scale: [0.96, 1.02, 0.96] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src={image} alt="" fill className="object-cover" sizes="60vw" />
            </motion.div>

            {slices.map((slice, index) => (
              <motion.div
                key={`${slice.top}-${slice.bottom}`}
                className="absolute left-1/2 top-1/2 aspect-square w-[76%] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full drop-shadow-[0_24px_28px_rgba(0,0,0,0.34)]"
                style={{
                  clipPath: `inset(${slice.top}% 0 ${slice.bottom}% 0)`,
                  transformStyle: "preserve-3d",
                }}
                initial={false}
                whileInView={reduceMotion ? undefined : { y: slice.y, z: slice.z, rotateZ: slice.rotate }}
                viewport={{ once: false, amount: 0.45 }}
                transition={{ duration: 1.05, delay: 0.08 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={image}
                  alt={index === 2 ? imageAlt : ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 75vw, 52vw"
                  priority={index === 2}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {notes.slice(0, 4).map((note, index) => {
              const right = index % 2 === 0;
              const top = 20 + index * 18;
              return (
                <motion.div
                  key={`callout-${note.label}`}
                  initial={{ opacity: 0, x: right ? 18 : -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, delay: 0.35 + index * 0.1 }}
                  className={`absolute ${right ? "right-0" : "left-0"}`}
                  style={{ top: `${top}%` }}
                >
                  <div className={`flex items-center gap-3 ${right ? "flex-row" : "flex-row-reverse"}`}>
                    <span className={`h-px w-16 ${isTera ? "bg-[#5a6957]/38" : "bg-gold/38"}`} />
                    <span className={`max-w-[10rem] text-[9px] font-medium uppercase tracking-[0.19em] ${isTera ? "text-[#252a24]/64" : "text-white/58"}`}>
                      {note.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
