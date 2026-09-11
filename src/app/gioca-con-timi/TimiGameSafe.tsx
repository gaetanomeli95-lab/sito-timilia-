"use client";

import Link from "next/link";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type Stage = "intro" | "dough" | "ingredients" | "oven" | "result";
type Ingredient = "pomodoro" | "bufala" | "basilico" | "olio";

const TARGET_STRETCH = 78;
const OVEN_TARGET = 4.4;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function TimiGameSafe() {
  const [stage, setStage] = useState<Stage>("intro");
  const [stretch, setStretch] = useState(18);
  const [doughScore, setDoughScore] = useState(0);
  const [ingredients, setIngredients] = useState<Record<Ingredient, number>>({
    pomodoro: 0,
    bufala: 0,
    basilico: 0,
    olio: 0,
  });
  const [ingredientScore, setIngredientScore] = useState(0);
  const [cooking, setCooking] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [ovenScore, setOvenScore] = useState(0);
  const dragStart = useRef<{ x: number; y: number; stretch: number } | null>(null);
  const timerStart = useRef<number | null>(null);

  const totalIngredients = Object.values(ingredients).reduce((sum, value) => sum + value, 0);

  useEffect(() => {
    if (!cooking || stage !== "oven") return;

    let frame = 0;
    const tick = (now: number) => {
      if (timerStart.current === null) timerStart.current = now;
      const seconds = (now - timerStart.current) / 1000;
      setElapsed(Math.min(seconds, 7));
      if (seconds >= 7) {
        setCooking(false);
        const score = Math.round(clamp(100 - Math.abs(7 - OVEN_TARGET) * 28, 0, 100));
        setOvenScore(score);
        setStage("result");
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [cooking, stage]);

  const finalScore = Math.round(doughScore * 0.35 + ingredientScore * 0.35 + ovenScore * 0.3);

  const verdict = useMemo(() => {
    if (finalScore >= 90) return ["Pizzaiolo per passione", "Materia, equilibrio e tempo. Timì approva."];
    if (finalScore >= 75) return ["Il preciso", "Ci siamo. Hai capito che ogni elemento deve avere il suo spazio."];
    if (finalScore >= 58) return ["L’essenziale", "Buona mano. Togli un po’ di rumore e lascia parlare la materia."];
    return ["Di nuovo al banco", "La pizza sembra semplice. È proprio lì che comincia la ricerca."];
  }, [finalScore]);

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY, stretch };
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const distance = Math.hypot(event.clientX - dragStart.current.x, event.clientY - dragStart.current.y);
    setStretch(clamp(dragStart.current.stretch + distance * 0.32, 18, 100));
  };

  const stopDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragStart.current = null;
  };

  const finishDough = () => {
    setDoughScore(Math.round(clamp(100 - Math.abs(stretch - TARGET_STRETCH) * 2.4, 0, 100)));
    setStage("ingredients");
  };

  const changeIngredient = (id: Ingredient, delta: number) => {
    const limits: Record<Ingredient, number> = { pomodoro: 2, bufala: 6, basilico: 6, olio: 2 };
    setIngredients((current) => ({ ...current, [id]: clamp(current[id] + delta, 0, limits[id]) }));
  };

  const finishIngredients = () => {
    const ideal: Record<Ingredient, number> = { pomodoro: 1, bufala: 3, basilico: 3, olio: 1 };
    let penalty = 0;
    (Object.keys(ideal) as Ingredient[]).forEach((id) => {
      penalty += Math.abs(ingredients[id] - ideal[id]) * (id === "pomodoro" || id === "olio" ? 18 : 9);
    });
    penalty += Math.max(0, totalIngredients - 9) * 5;
    setIngredientScore(Math.round(clamp(100 - penalty, 0, 100)));
    setStage("oven");
  };

  const startOven = () => {
    timerStart.current = null;
    setElapsed(0);
    setCooking(true);
  };

  const finishOven = () => {
    if (!cooking) return;
    setCooking(false);
    setOvenScore(Math.round(clamp(100 - Math.abs(elapsed - OVEN_TARGET) * 28, 0, 100)));
    setStage("result");
  };

  const restart = () => {
    setStage("intro");
    setStretch(18);
    setDoughScore(0);
    setIngredients({ pomodoro: 0, bufala: 0, basilico: 0, olio: 0 });
    setIngredientScore(0);
    setCooking(false);
    setElapsed(0);
    setOvenScore(0);
    timerStart.current = null;
  };

  const step = stage === "dough" ? 1 : stage === "ingredients" ? 2 : stage === "oven" ? 3 : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-[#f5f0e8]">
      <header className="fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between border-b border-white/10 bg-black/70 px-5 backdrop-blur-xl md:px-10">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.24em]">
          <span className="relative block h-8 w-8 rounded-full border border-[#e6d7bd] bg-[#e6d7bd]">
            <i className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" />
          </span>
          TIMILIA
        </Link>
        {step > 0 && (
          <div className="flex gap-2" aria-label={`Fase ${step} di 3`}>
            {[1, 2, 3].map((item) => <span key={item} className={`h-1.5 w-7 rounded-full ${item <= step ? "bg-[#c8a97e]" : "bg-white/15"}`} />)}
          </div>
        )}
        <Link href="/" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-xl text-white/70">×</Link>
      </header>

      {stage === "intro" && (
        <section className="relative flex min-h-screen items-end pt-20 md:items-center">
          <img src="/images/timi-game-hero.webp" alt="Timì, mascotte di TIMILIA" className="absolute inset-0 h-full w-full object-cover object-[66%_center]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20 md:bg-gradient-to-r md:from-black md:via-black/65 md:to-black/10" />
          <div className="relative z-10 max-w-2xl px-6 pb-16 md:px-16 md:pb-0">
            <p className="mb-4 text-[10px] uppercase tracking-[0.34em] text-[#c8a97e]">La sfida di Timì</p>
            <h1 className="text-5xl font-light leading-[0.94] tracking-[-0.045em] md:text-7xl">La pizza sembra semplice.<br /><span className="text-[#ddc6a5]">Vediamo.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/60">Tre prove. Materia, equilibrio e tempo. Timì guarda tutto.</p>
            <button onClick={() => setStage("dough")} className="mt-8 rounded-full bg-[#ddc6a5] px-7 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-black">Impasta con Timì →</button>
          </div>
        </section>
      )}

      {stage === "dough" && (
        <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-5 pb-10 pt-28 md:px-10">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#c8a97e]">01 · Impasto</p>
          <h2 className="mt-3 text-4xl font-light md:text-6xl">Dagli forma.</h2>
          <p className="mt-4 max-w-xl text-white/55">Trascina l’impasto. Cerca di allargarlo senza esagerare.</p>
          <div className="mt-10 grid place-items-center rounded-[36px] border border-white/10 bg-[#0c0a08] py-12 shadow-2xl">
            <div
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={stopDrag}
              onPointerCancel={() => { dragStart.current = null; }}
              className="touch-none select-none rounded-[48%_52%_50%_46%] border border-[#f6e9ce]/30 bg-[radial-gradient(circle_at_35%_30%,#f6e9ce,#d3b58d_70%,#a98259)] shadow-[0_30px_70px_rgba(0,0,0,0.55)] transition-[width,height] duration-75"
              style={{ width: `${150 + stretch * 1.7}px`, height: `${150 + stretch * 1.45}px`, maxWidth: "82vw", maxHeight: "46vh" }}
              role="button"
              aria-label="Impasto da allargare trascinando"
            />
            <div className="mt-8 w-64">
              <div className="h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[#c8a97e]" style={{ width: `${stretch}%` }} /></div>
              <p className="mt-3 text-center text-xs text-white/40">Timì: “Piano. Niente mattarello.”</p>
            </div>
          </div>
          <button onClick={finishDough} className="mt-8 self-end rounded-full bg-[#ddc6a5] px-7 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-black">Ci siamo →</button>
        </section>
      )}

      {stage === "ingredients" && (
        <section className="mx-auto min-h-screen max-w-6xl px-5 pb-10 pt-28 md:px-10">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#c8a97e]">02 · Equilibrio</p>
          <h2 className="mt-3 text-4xl font-light md:text-6xl">Pochi elementi. Tutti decisivi.</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="grid min-h-[360px] place-items-center rounded-[36px] border border-white/10 bg-[#0b0907]">
              <div className="relative aspect-square w-[72%] max-w-[370px] rounded-full bg-[#c89b67] shadow-[0_25px_70px_rgba(0,0,0,0.5)]">
                <div className={`absolute inset-[8%] rounded-full ${ingredients.pomodoro ? "bg-[#9e2d21]" : "bg-[#e6c79d]"}`} />
                {Array.from({ length: ingredients.bufala }).map((_, i) => <span key={`b-${i}`} className="absolute h-10 w-10 rounded-full bg-[#fff4db]" style={{ left: `${28 + (i * 17) % 48}%`, top: `${25 + (i * 23) % 50}%` }} />)}
                {Array.from({ length: ingredients.basilico }).map((_, i) => <span key={`ba-${i}`} className="absolute h-8 w-4 rotate-[-25deg] rounded-[100%_0_100%_0] bg-[#39633a]" style={{ left: `${23 + (i * 19) % 55}%`, top: `${30 + (i * 29) % 44}%` }} />)}
                {ingredients.olio > 0 && <span className="absolute inset-[15%] rounded-full border-2 border-[#d9b45f]/50" />}
              </div>
            </div>
            <div className="space-y-3">
              {([
                ["pomodoro", "Pomodoro"], ["bufala", "Bufala"], ["basilico", "Basilico"], ["olio", "Olio EVO"],
              ] as Array<[Ingredient, string]>).map(([id, label]) => (
                <div key={id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
                  <span>{label}</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => changeIngredient(id, -1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15">−</button>
                    <b className="w-5 text-center font-medium">{ingredients[id]}</b>
                    <button onClick={() => changeIngredient(id, 1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15">+</button>
                  </div>
                </div>
              ))}
              <p className="pt-3 text-sm text-white/45">{totalIngredients > 10 ? "Timì sta alzando un sopracciglio…" : totalIngredients >= 7 ? "Adesso guarda l’equilibrio." : "Serve davvero aggiungere altro?"}</p>
            </div>
          </div>
          <button disabled={totalIngredients < 4} onClick={finishIngredients} className="mt-8 float-right rounded-full bg-[#ddc6a5] px-7 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-black disabled:cursor-not-allowed disabled:opacity-30">Al forno →</button>
        </section>
      )}

      {stage === "oven" && (
        <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-5 pb-10 pt-28 md:px-10">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#c8a97e]">03 · Tempo</p>
          <h2 className="mt-3 text-4xl font-light md:text-6xl">Il tempo è un ingrediente.</h2>
          <p className="mt-4 text-white/55">Forno professionale elettrico. Sforna quando pensi sia il momento giusto.</p>
          <div className="mt-10 rounded-[30px] border border-white/15 bg-[#111] p-4 shadow-2xl md:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[10px] uppercase tracking-[0.18em] text-white/45"><span>Forno elettrico professionale</span><span>{cooking ? "In cottura" : "Pronto"}</span></div>
            <div className="relative mt-5 h-52 overflow-hidden rounded-2xl border border-white/10 bg-black md:h-72">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(222,154,82,0.28),transparent_45%)]" />
              <div className={`absolute bottom-10 left-1/2 h-16 w-40 -translate-x-1/2 rounded-[50%] border-[10px] border-[#b77845] bg-[#9c2d20] transition-all duration-1000 ${cooking ? "scale-105 brightness-125" : ""}`} />
            </div>
            <div className="mt-5 flex items-end justify-between"><span className="text-xs uppercase tracking-[0.18em] text-white/35">Tempo</span><strong className="text-4xl font-light tabular-nums">{elapsed.toFixed(1)} s</strong></div>
            <div className="relative mt-5 h-1 rounded-full bg-white/10"><span className="absolute left-[56%] h-1 w-[14%] rounded-full bg-[#c8a97e]/35" /><span className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-[#f5f0e8]" style={{ left: `${clamp((elapsed / 7) * 100, 0, 100)}%` }} /></div>
          </div>
          {!cooking && elapsed === 0 ? <button onClick={startOven} className="mt-8 self-end rounded-full bg-[#ddc6a5] px-7 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-black">Inizia la cottura</button> : <button disabled={!cooking} onClick={finishOven} className="mt-8 self-end rounded-full bg-[#ddc6a5] px-7 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-black disabled:opacity-30">Sforna adesso</button>}
        </section>
      )}

      {stage === "result" && (
        <section className="relative grid min-h-screen items-center gap-8 px-5 pb-10 pt-28 md:grid-cols-2 md:px-12">
          <div className="relative min-h-[420px] overflow-hidden rounded-[32px] border border-white/10 md:min-h-[650px]"><img src="/images/timi-game-hero.webp" alt="Timì" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /></div>
          <div className="max-w-xl">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#c8a97e]">Verdetto di Timì</p>
            <div className="mt-5 text-7xl font-light tracking-[-0.06em]">{finalScore}<span className="text-2xl text-white/35">/100</span></div>
            <h2 className="mt-6 text-4xl font-light">{verdict[0]}</h2>
            <p className="mt-4 text-lg leading-8 text-white/55">{verdict[1]}</p>
            <div className="mt-8 grid grid-cols-3 gap-3">{[["Impasto", doughScore], ["Equilibrio", ingredientScore], ["Tempo", ovenScore]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><span className="block text-[10px] uppercase tracking-[0.12em] text-white/35">{label}</span><b className="mt-2 block text-2xl font-light">{value}</b></div>)}</div>
            <div className="mt-8 border-l border-[#c8a97e]/40 pl-5"><span className="block text-sm text-white/40">Bella virtuale.</span><strong className="mt-1 block text-2xl font-light">Adesso assaggia quella vera.</strong></div>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/menu" className="rounded-full bg-[#ddc6a5] px-7 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-black">Scopri le pizze →</Link><button onClick={restart} className="rounded-full border border-white/15 px-7 py-4 text-xs uppercase tracking-[0.13em] text-white/65">Rigioca</button></div>
          </div>
        </section>
      )}
    </main>
  );
}
