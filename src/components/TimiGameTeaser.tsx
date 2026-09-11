import Image from "next/image";
import Link from "next/link";

export default function TimiGameTeaser() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#080706]">
      <div className="mx-auto grid max-w-7xl gap-0 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-24">
        <div className="relative z-10 flex flex-col justify-center py-6 md:pr-12">
          <p className="mb-4 text-[10px] uppercase tracking-[0.34em] text-[#c8a97e]">La sfida di Timì</p>
          <h2 className="max-w-[8ch] text-5xl font-light leading-[0.95] tracking-[-0.045em] text-[#f5f0e8] md:text-7xl">
            La pizza sembra semplice. <span className="text-[#ddc6a5]">Vediamo.</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/55">
            Impasto, equilibrio, tempo. Tre prove veloci per scoprire se hai la mano da pizzaiolo.
          </p>
          <Link
            href="/gioca-con-timi"
            className="mt-8 inline-flex w-fit items-center gap-4 rounded-full bg-[#ddc6a5] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#090806] transition-transform hover:-translate-y-0.5"
          >
            Impasta con Timì <span className="text-base">→</span>
          </Link>
        </div>

        <Link
          href="/gioca-con-timi"
          aria-label="Apri la sfida di Timì"
          className="group relative mt-8 min-h-[380px] overflow-hidden rounded-[28px] border border-white/10 md:mt-0 md:min-h-[520px]"
        >
          <Image
            src="/images/timi-game-hero.webp"
            alt="Timì, la mascotte di TIMILIA"
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover object-[66%_center] transition duration-700 group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.28em] text-[#ddc6a5]">20–30 secondi</span>
              <strong className="mt-2 block text-2xl font-light text-white">Timì guarda tutto.</strong>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/25 bg-black/30 text-xl text-white backdrop-blur">→</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
