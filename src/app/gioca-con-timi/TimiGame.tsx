"use client";

import Link from "next/link";
import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "./TimiGame.module.css";

type Stage = "intro" | "dough" | "ingredients" | "oven" | "result";
type IngredientId = "pomodoro" | "mozzarella" | "basilico" | "olio";
type IngredientCounts = Record<IngredientId, number>;
type Pose = "welcome" | "dough" | "ingredients" | "oven" | "result" | "cta";

const DOUGH_POINTS = 24;
const DOUGH_START_RADIUS = 82;
const DOUGH_TARGET_RADIUS = 112;
const MAX_DOUGH_RADIUS = 132;
const OVEN_TARGET_SECONDS = 4.4;

const ingredientMeta: Array<{
  id: IngredientId;
  label: string;
  micro: string;
  ideal: number;
  max: number;
  assetClass: string;
}> = [
  { id: "pomodoro", label: "Pomodoro", micro: "San Marzano", ideal: 1, max: 3, assetClass: "foodPomodoro" },
  { id: "mozzarella", label: "Mozzarella", micro: "fior di latte", ideal: 3, max: 6, assetClass: "foodMozzarella" },
  { id: "basilico", label: "Basilico", micro: "fresco", ideal: 3, max: 6, assetClass: "foodBasilico" },
  { id: "olio", label: "Olio EVO", micro: "siciliano", ideal: 1, max: 3, assetClass: "foodOlio" },
];

const toppingPositions = [
  [50, 28, -8], [35, 38, 12], [67, 39, -14], [43, 53, 5], [61, 58, 18], [30, 61, -18],
  [72, 64, 7], [49, 72, -5], [38, 76, 15], [63, 79, -11], [24, 48, 8], [78, 47, -6],
] as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function scoreDough(radii: number[], touched: boolean[]) {
  const avg = radii.reduce((sum, value) => sum + value, 0) / radii.length;
  const variance = radii.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / radii.length;
  const touchedRatio = touched.filter(Boolean).length / touched.length;
  const sizePenalty = Math.abs(avg - DOUGH_TARGET_RADIUS) * 1.65;
  const shapePenalty = Math.sqrt(variance) * 2.1;
  const coveragePenalty = (1 - touchedRatio) * 26;
  return Math.round(clamp(100 - sizePenalty - shapePenalty - coveragePenalty, 0, 100));
}

function scoreIngredients(counts: IngredientCounts) {
  const penalties = ingredientMeta.reduce((sum, item) => {
    const weight = item.id === "pomodoro" || item.id === "olio" ? 20 : 9;
    return sum + Math.abs(counts[item.id] - item.ideal) * weight;
  }, 0);
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const overloadPenalty = Math.max(0, total - 9) * 4;
  return Math.round(clamp(100 - penalties - overloadPenalty, 0, 100));
}

function resultCopy(score: number) {
  if (score >= 90) return { title: "Pizzaiolo per passione", copy: "Materia, equilibrio e tempo. Timì approva." };
  if (score >= 75) return { title: "Il preciso", copy: "Hai capito che ogni elemento deve avere il suo spazio." };
  if (score >= 58) return { title: "L'essenziale", copy: "Buona mano. Togli rumore e lascia parlare la materia." };
  return { title: "Di nuovo al banco", copy: "La pizza sembra semplice. È proprio lì che comincia la ricerca." };
}

function TimiPose({ pose, className = "" }: { pose: Pose; className?: string }) {
  return <span className={`${styles.timiPose} ${styles[`pose_${pose}`]} ${className}`} aria-hidden="true" />;
}

function FoodAsset({ className }: { className: string }) {
  return <span className={`${styles.foodAsset} ${styles[className]}`} aria-hidden="true" />;
}

function OfficialBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${styles.officialBrand} ${compact ? styles.officialBrandCompact : ""}`}>
      <img src="/images/timi-v2/logo-official.webp" alt="TIMILIA — Pizzaioli per passione" />
    </div>
  );
}

export default function TimiGame() {
  const [stage, setStage] = useState<Stage>("intro");
  const [radii, setRadii] = useState<number[]>(() => Array(DOUGH_POINTS).fill(DOUGH_START_RADIUS));
  const [touched, setTouched] = useState<boolean[]>(() => Array(DOUGH_POINTS).fill(false));
  const [stretching, setStretching] = useState(false);
  const [doughScore, setDoughScore] = useState(0);
  const [ingredients, setIngredients] = useState<IngredientCounts>({ pomodoro: 0, mozzarella: 0, basilico: 0, olio: 0 });
  const [ingredientScore, setIngredientScore] = useState(0);
  const [ovenStarted, setOvenStarted] = useState(false);
  const [ovenElapsed, setOvenElapsed] = useState(0);
  const [ovenScore, setOvenScore] = useState(0);
  const doughRef = useRef<SVGSVGElement | null>(null);
  const ovenStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ovenStarted || stage !== "oven") return;
    let frame = 0;
    const tick = (now: number) => {
      if (ovenStartRef.current === null) ovenStartRef.current = now;
      const elapsed = (now - ovenStartRef.current) / 1000;
      setOvenElapsed(Math.min(elapsed, 7));
      if (elapsed >= 7) {
        setOvenScore(Math.round(clamp(100 - Math.abs(7 - OVEN_TARGET_SECONDS) * 28, 0, 100)));
        setOvenStarted(false);
        window.setTimeout(() => setStage("result"), 420);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ovenStarted, stage]);

  const doughPolygon = useMemo(() => radii.map((radius, index) => {
    const angle = (index / DOUGH_POINTS) * Math.PI * 2 - Math.PI / 2;
    return `${(150 + Math.cos(angle) * radius).toFixed(1)},${(150 + Math.sin(angle) * radius).toFixed(1)}`;
  }).join(" "), [radii]);

  const ingredientTotal = Object.values(ingredients).reduce((sum, value) => sum + value, 0);
  const finalScore = Math.round(doughScore * 0.35 + ingredientScore * 0.35 + ovenScore * 0.3);
  const finalCopy = resultCopy(finalScore);
  const stepNumber = stage === "dough" ? 1 : stage === "ingredients" ? 2 : stage === "oven" ? 3 : stage === "result" ? 4 : 0;

  const moveDough = (event: PointerEvent<SVGSVGElement>) => {
    if (!stretching || !doughRef.current) return;
    const rect = doughRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 300;
    const y = ((event.clientY - rect.top) / rect.height) * 300;
    const dx = x - 150;
    const dy = y - 150;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
    const centerIndex = Math.round((angle / (Math.PI * 2)) * DOUGH_POINTS) % DOUGH_POINTS;
    const target = clamp(distance, DOUGH_START_RADIUS, MAX_DOUGH_RADIUS);
    setRadii((current) => {
      const next = [...current];
      for (let offset = -2; offset <= 2; offset += 1) {
        const index = (centerIndex + offset + DOUGH_POINTS) % DOUGH_POINTS;
        const falloff = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.72 : 0.38;
        next[index] = clamp(next[index] + (target - next[index]) * falloff, DOUGH_START_RADIUS, MAX_DOUGH_RADIUS);
      }
      return next;
    });
    setTouched((current) => {
      const next = [...current];
      for (let offset = -2; offset <= 2; offset += 1) next[(centerIndex + offset + DOUGH_POINTS) % DOUGH_POINTS] = true;
      return next;
    });
  };

  const finishDough = () => { setDoughScore(scoreDough(radii, touched)); setStage("ingredients"); };
  const changeIngredient = (id: IngredientId, delta: number) => {
    const max = ingredientMeta.find((item) => item.id === id)?.max ?? 6;
    setIngredients((current) => ({ ...current, [id]: clamp(current[id] + delta, 0, max) }));
  };
  const finishIngredients = () => { setIngredientScore(scoreIngredients(ingredients)); setStage("oven"); };
  const startOven = () => { ovenStartRef.current = null; setOvenElapsed(0); setOvenStarted(true); };
  const finishOven = () => {
    if (!ovenStarted) return;
    setOvenScore(Math.round(clamp(100 - Math.abs(ovenElapsed - OVEN_TARGET_SECONDS) * 28, 0, 100)));
    setOvenStarted(false);
    window.setTimeout(() => setStage("result"), 360);
  };
  const restart = () => {
    setStage("intro");
    setRadii(Array(DOUGH_POINTS).fill(DOUGH_START_RADIUS));
    setTouched(Array(DOUGH_POINTS).fill(false));
    setStretching(false);
    setDoughScore(0);
    setIngredients({ pomodoro: 0, mozzarella: 0, basilico: 0, olio: 0 });
    setIngredientScore(0);
    setOvenStarted(false);
    setOvenElapsed(0);
    setOvenScore(0);
    ovenStartRef.current = null;
  };

  return (
    <main className={styles.shell}>
      <div className={styles.ambient} aria-hidden="true" />
      <header className={styles.topbar}>
        <Link href="/" className={styles.brandLink} aria-label="Torna a TIMILIA"><OfficialBrand compact /></Link>
        {stepNumber > 0 && (
          <div className={styles.progressWrap}>
            <span>{stepNumber}/4</span>
            <div className={styles.progress}>{[1,2,3,4].map((item) => <i key={item} className={item <= stepNumber ? styles.progressOn : ""} />)}</div>
          </div>
        )}
        <Link href="/" className={styles.close} aria-label="Chiudi">×</Link>
      </header>

      {stage === "intro" && (
        <section className={`${styles.screen} ${styles.introScreen}`}>
          <div className={`${styles.sceneSprite} ${styles.sceneKitchen}`} aria-hidden="true" />
          <div className={styles.introVeil} />
          <div className={styles.introGrid}>
            <div className={styles.introCopy}>
              <OfficialBrand />
              <p className={styles.scriptLine}>La pizza sembra semplice. <em>Vediamo.</em></p>
              <h1>La sfida di Timì</h1>
              <p className={styles.lead}>Tre prove. Materia, equilibrio e tempo. Hai la mano da pizzaiolo?</p>
              <button className={styles.primaryButton} onClick={() => setStage("dough")}>INIZIA <span>→</span></button>
              <div className={styles.introSteps}><span>01 Impasta</span><span>02 Aggiungi</span><span>03 Inforna</span><span>04 Scopri</span></div>
            </div>
            <div className={styles.heroMascot}><TimiPose pose="welcome" /></div>
          </div>
        </section>
      )}

      {stage === "dough" && (
        <section className={styles.screen}>
          <div className={styles.stageHeader}><p>01 · L&apos;impasto</p><h2>Dagli forma con il dito.</h2><span>Allarga l&apos;impasto fino a ottenere una forma regolare.</span></div>
          <div className={styles.stageGrid}>
            <aside className={styles.coachCard}><TimiPose pose="dough" /><div className={styles.speech}><b>Timì</b><span>{stretching ? "Così. Piano… sentilo." : "Niente mattarello. Tocca il bordo."}</span></div></aside>
            <div className={styles.workbench}>
              <div className={`${styles.sceneSprite} ${styles.sceneKitchen} ${styles.workbenchBackdrop}`} />
              <svg ref={doughRef} className={styles.doughSvg} viewBox="0 0 300 300" role="img" aria-label="Impasto interattivo"
                onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setStretching(true); }}
                onPointerMove={moveDough}
                onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); setStretching(false); }}
                onPointerCancel={() => setStretching(false)}>
                <defs><radialGradient id="doughFill" cx="42%" cy="34%" r="70%"><stop offset="0%" stopColor="#f7e7c8"/><stop offset="72%" stopColor="#dec39b"/><stop offset="100%" stopColor="#ae865b"/></radialGradient><filter id="doughShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000" floodOpacity="0.45"/></filter></defs>
                <circle cx="150" cy="150" r={DOUGH_TARGET_RADIUS} className={styles.targetRing}/>
                <polygon points={doughPolygon} fill="url(#doughFill)" filter="url(#doughShadow)" className={styles.doughShape}/>
                <circle cx="126" cy="118" r="6" className={styles.doughBubble}/><circle cx="182" cy="169" r="4" className={styles.doughBubble}/><circle cx="165" cy="102" r="3" className={styles.doughBubble}/>
              </svg>
              <span className={styles.dragHint}>{stretching ? "Piano…" : "Trascina verso l'esterno"}</span>
            </div>
          </div>
          <div className={styles.actionBar}><span>Materia · mano · equilibrio</span><button className={styles.primaryButton} onClick={finishDough}>CI SIAMO <span>→</span></button></div>
        </section>
      )}

      {stage === "ingredients" && (
        <section className={styles.screen}>
          <div className={styles.stageHeader}><p>02 · Gli ingredienti</p><h2>Pochi elementi. Tutti decisivi.</h2><span>Qui “di più” non significa automaticamente “meglio”.</span></div>
          <div className={styles.stageGrid}>
            <aside className={styles.coachCard}><TimiPose pose="ingredients" /><div className={styles.speech}><b>Timì</b><span>{ingredientTotal > 10 ? "Troppo. La pizza deve respirare." : ingredientTotal >= 7 ? "Adesso guarda l'equilibrio." : "È nelle scelte che nasce una grande pizza."}</span></div></aside>
            <div className={styles.ingredientsPanel}>
              <div className={styles.pizzaStage}>
                <FoodAsset className="foodBase" />
                {ingredients.pomodoro > 0 && <span className={styles.sauceLayer} />}
                {ingredientMeta.filter((item) => item.id !== "pomodoro" && item.id !== "olio").flatMap((ingredient, ingredientIndex) =>
                  Array.from({length: ingredients[ingredient.id]}).map((_, index) => {
                    const position = toppingPositions[(index + ingredientIndex * 4) % toppingPositions.length];
                    return <span key={`${ingredient.id}-${index}`} className={styles.placedIngredient} style={{left:`${position[0]}%`, top:`${position[1]}%`, transform:`translate(-50%,-50%) rotate(${position[2]}deg)`}}><FoodAsset className={ingredient.assetClass}/></span>;
                  })
                )}
                {ingredients.olio > 0 && <span className={styles.oilSheen} />}
              </div>
              <div className={styles.ingredientDeck}>
                {ingredientMeta.map((ingredient) => (
                  <div className={styles.ingredientCard} key={ingredient.id}>
                    <button className={styles.ingredientMain} onClick={() => changeIngredient(ingredient.id, 1)} aria-label={`Aggiungi ${ingredient.label}`}>
                      <FoodAsset className={ingredient.assetClass}/><span><b>{ingredient.label}</b><small>{ingredient.micro}</small></span>
                    </button>
                    <div className={styles.counter}><button onClick={() => changeIngredient(ingredient.id, -1)} aria-label={`Togli ${ingredient.label}`}>−</button><b>{ingredients[ingredient.id]}</b><button onClick={() => changeIngredient(ingredient.id, 1)} aria-label={`Aggiungi ${ingredient.label}`}>+</button></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.actionBar}><span>{ingredientTotal < 4 ? "Costruisci la tua pizza" : ingredientTotal > 10 ? "Timì non è convinto…" : "Equilibrio prima di tutto"}</span><button className={styles.primaryButton} disabled={ingredientTotal < 4} onClick={finishIngredients}>AL FORNO <span>→</span></button></div>
        </section>
      )}

      {stage === "oven" && (
        <section className={styles.screen}>
          <div className={styles.stageHeader}><p>03 · Il forno</p><h2>Il tempo è un ingrediente.</h2><span>Forno professionale elettrico. Il momento giusto dipende da te.</span></div>
          <div className={styles.stageGrid}>
            <aside className={styles.coachCard}><TimiPose pose="oven" /><div className={styles.speech}><b>Timì</b><span>{ovenStarted ? "Guarda. Non avere fretta." : "Quando sei pronto, inizia la cottura."}</span></div></aside>
            <div className={styles.ovenPanel}>
              <div className={`${styles.sceneSprite} ${styles.sceneOven}`} aria-label="Forno elettrico professionale" />
              <div className={styles.ovenGlass}><span>FORNO ELETTRICO</span><strong>{ovenElapsed.toFixed(1)} s</strong><i>{ovenStarted ? "IN COTTURA" : "PRONTO"}</i></div>
              <div className={styles.timingTrack}><span className={styles.sweetSpot}/><span className={styles.timerNeedle} style={{left:`${clamp((ovenElapsed/7)*100,0,100)}%`}}/></div>
              <div className={styles.timingLabels}><span>troppo presto</span><b>perfetto</b><span>troppo tardi</span></div>
              {!ovenStarted && ovenElapsed === 0 ? <button className={styles.primaryButton} onClick={startOven}>INIZIA LA COTTURA</button> : <button className={`${styles.primaryButton} ${styles.ovenButton}`} onClick={finishOven} disabled={!ovenStarted}>SFORNA ORA</button>}
            </div>
          </div>
        </section>
      )}

      {stage === "result" && (
        <section className={`${styles.screen} ${styles.resultScreen}`}>
          <div className={styles.resultGrid}>
            <div className={styles.resultVisual}>
              <div className={`${styles.sceneSprite} ${styles.scenePizza}`} />
              <TimiPose pose="result" className={styles.resultTimi}/>
            </div>
            <div className={styles.resultCopy}>
              <p className={styles.eyebrow}>Il verdetto di Timì</p>
              <div className={styles.score}>{finalScore}<span>/100</span></div>
              <h2>{finalCopy.title}</h2><p>{finalCopy.copy}</p>
              <div className={styles.scoreBreakdown}><div><span>Impasto</span><b>{doughScore}</b></div><div><span>Ingredienti</span><b>{ingredientScore}</b></div><div><span>Cottura</span><b>{ovenScore}</b></div></div>
              <div className={styles.realPizza}><span>Bella virtuale.</span><strong>Adesso assaggia quella vera.</strong></div>
              <div className={styles.resultActions}><Link className={styles.primaryButton} href="/menu">SCOPRI IL MENU <span>→</span></Link><button className={styles.secondaryButton} onClick={restart}>GIOCA ANCORA</button></div>
              <div className={styles.ctaTimi}><TimiPose pose="cta"/><span>“Non si diventa pizzaioli in un giorno. Ma oggi hai cominciato.”</span></div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
