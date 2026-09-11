"use client";

import Image from "next/image";
import Link from "next/link";
import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "./TimiGame.module.css";

type Stage = "intro" | "dough" | "ingredients" | "oven" | "result";
type IngredientId = "pomodoro" | "mozzarella" | "basilico" | "olio";
type IngredientCounts = Record<IngredientId, number>;

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
}> = [
  { id: "pomodoro", label: "Pomodoro", micro: "base", ideal: 1, max: 3 },
  { id: "mozzarella", label: "Bufala", micro: "equilibrio", ideal: 3, max: 6 },
  { id: "basilico", label: "Basilico", micro: "profumo", ideal: 3, max: 6 },
  { id: "olio", label: "Olio EVO", micro: "finale", ideal: 1, max: 3 },
];

const toppingPositions = [
  [50, 23, -8], [31, 34, 12], [68, 36, -14], [43, 49, 5], [62, 55, 18], [27, 59, -18],
  [75, 62, 7], [48, 70, -5], [35, 76, 15], [63, 79, -11], [20, 45, 8], [80, 44, -6],
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
  if (score >= 90) {
    return {
      title: "Pizzaiolo per passione",
      copy: "Materia, equilibrio e tempo. Timì approva.",
    };
  }
  if (score >= 75) {
    return {
      title: "Il preciso",
      copy: "Ci siamo quasi. Hai capito che ogni elemento deve avere il suo spazio.",
    };
  }
  if (score >= 58) {
    return {
      title: "L'essenziale",
      copy: "Buona mano. Adesso prova a togliere rumore e lascia parlare la materia.",
    };
  }
  return {
    title: "Timì ti rimette al banco",
    copy: "La pizza sembra semplice. È proprio lì che comincia la ricerca.",
  };
}

export default function TimiGame() {
  const [stage, setStage] = useState<Stage>("intro");
  const [radii, setRadii] = useState<number[]>(() => Array(DOUGH_POINTS).fill(DOUGH_START_RADIUS));
  const [touched, setTouched] = useState<boolean[]>(() => Array(DOUGH_POINTS).fill(false));
  const [stretching, setStretching] = useState(false);
  const [doughScore, setDoughScore] = useState(0);
  const [ingredients, setIngredients] = useState<IngredientCounts>({
    pomodoro: 0,
    mozzarella: 0,
    basilico: 0,
    olio: 0,
  });
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
        const autoScore = Math.round(clamp(100 - Math.abs(7 - OVEN_TARGET_SECONDS) * 28, 0, 100));
        setOvenScore(autoScore);
        setOvenStarted(false);
        window.setTimeout(() => setStage("result"), 450);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ovenStarted, stage]);

  const doughPolygon = useMemo(() => {
    return radii
      .map((radius, index) => {
        const angle = (index / DOUGH_POINTS) * Math.PI * 2 - Math.PI / 2;
        const x = 150 + Math.cos(angle) * radius;
        const y = 150 + Math.sin(angle) * radius;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [radii]);

  const ingredientTotal = Object.values(ingredients).reduce((sum, value) => sum + value, 0);
  const finalScore = Math.round(doughScore * 0.35 + ingredientScore * 0.35 + ovenScore * 0.3);
  const finalCopy = resultCopy(finalScore);

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
      for (let offset = -2; offset <= 2; offset += 1) {
        next[(centerIndex + offset + DOUGH_POINTS) % DOUGH_POINTS] = true;
      }
      return next;
    });
  };

  const finishDough = () => {
    setDoughScore(scoreDough(radii, touched));
    setStage("ingredients");
  };

  const changeIngredient = (id: IngredientId, delta: number) => {
    const max = ingredientMeta.find((item) => item.id === id)?.max ?? 6;
    setIngredients((current) => ({
      ...current,
      [id]: clamp(current[id] + delta, 0, max),
    }));
  };

  const finishIngredients = () => {
    setIngredientScore(scoreIngredients(ingredients));
    setStage("oven");
  };

  const startOven = () => {
    ovenStartRef.current = null;
    setOvenElapsed(0);
    setOvenStarted(true);
  };

  const finishOven = () => {
    if (!ovenStarted) return;
    const score = Math.round(clamp(100 - Math.abs(ovenElapsed - OVEN_TARGET_SECONDS) * 28, 0, 100));
    setOvenScore(score);
    setOvenStarted(false);
    window.setTimeout(() => setStage("result"), 380);
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

  const stepNumber = stage === "dough" ? 1 : stage === "ingredients" ? 2 : stage === "oven" ? 3 : 0;

  return (
    <main className={styles.shell}>
      <div className={styles.grain} aria-hidden="true" />
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="Torna a TIMILIA">
          <span className={styles.brandMark} aria-hidden="true"><i /></span>
          <span>TIMILIA</span>
        </Link>
        {stepNumber > 0 && (
          <div className={styles.progress} aria-label={`Fase ${stepNumber} di 3`}>
            {[1, 2, 3].map((item) => (
              <span key={item} className={item <= stepNumber ? styles.progressOn : undefined} />
            ))}
          </div>
        )}
        <Link className={styles.close} href="/" aria-label="Chiudi il gioco">×</Link>
      </header>

      {stage === "intro" && (
        <section className={styles.intro}>
          <div className={styles.introBackdrop} aria-hidden="true">
            <Image
              src="/images/timi-game-hero.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className={styles.introImage}
            />
          </div>
          <div className={styles.introShade} aria-hidden="true" />
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}>La sfida di Timì</p>
            <h1>La pizza sembra semplice.<br /><em>Vediamo.</em></h1>
            <p className={styles.lead}>Tre prove. Materia, equilibrio e tempo. Timì guarda tutto.</p>
            <button className={styles.primaryButton} onClick={() => setStage("dough")}>
              Impasta con Timì <span>→</span>
            </button>
            <p className={styles.micro}>20–30 secondi · pensato per smartphone</p>
          </div>
        </section>
      )}

      {stage === "dough" && (
        <section className={styles.gameStage}>
          <div className={styles.stageCopy}>
            <p className={styles.eyebrow}>01 · Impasto</p>
            <h2>Dagli forma.</h2>
            <p>Trascina l’impasto verso l’esterno. Cerca una forma ampia, regolare, senza tirare troppo.</p>
          </div>

          <div className={styles.workbench}>
            <div className={styles.flourDust} aria-hidden="true" />
            <svg
              ref={doughRef}
              className={styles.doughSvg}
              viewBox="0 0 300 300"
              role="img"
              aria-label="Impasto interattivo da allargare"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setStretching(true);
              }}
              onPointerMove={moveDough}
              onPointerUp={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
                setStretching(false);
              }}
              onPointerCancel={() => setStretching(false)}
            >
              <defs>
                <radialGradient id="doughFill" cx="42%" cy="34%" r="70%">
                  <stop offset="0%" stopColor="#f6e9ce" />
                  <stop offset="72%" stopColor="#dec6a3" />
                  <stop offset="100%" stopColor="#b99569" />
                </radialGradient>
                <filter id="doughShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000" floodOpacity="0.42" />
                </filter>
              </defs>
              <circle cx="150" cy="150" r={DOUGH_TARGET_RADIUS} className={styles.targetRing} />
              <polygon points={doughPolygon} fill="url(#doughFill)" filter="url(#doughShadow)" className={styles.doughShape} />
              <circle cx="126" cy="118" r="6" className={styles.doughBubble} />
              <circle cx="182" cy="169" r="4" className={styles.doughBubble} />
              <circle cx="165" cy="102" r="3" className={styles.doughBubble} />
            </svg>
            <p className={styles.hint}>{stretching ? "Così. Piano." : "Tocca e trascina il bordo"}</p>
          </div>

          <div className={styles.stageFooter}>
            <span className={styles.timiNote}>Timì: “Niente mattarello.”</span>
            <button className={styles.primaryButton} onClick={finishDough}>Ci siamo <span>→</span></button>
          </div>
        </section>
      )}

      {stage === "ingredients" && (
        <section className={styles.gameStage}>
          <div className={styles.stageCopy}>
            <p className={styles.eyebrow}>02 · Equilibrio</p>
            <h2>Pochi elementi.<br />Tutti decisivi.</h2>
            <p>Aggiungi gli ingredienti. Qui “di più” non significa automaticamente “meglio”.</p>
          </div>

          <div className={styles.ingredientsLayout}>
            <div className={styles.pizzaBoard}>
              <div className={`${styles.pizza} ${ingredients.pomodoro > 0 ? styles.pizzaSauced : ""}`}>
                <div className={styles.crust} />
                {ingredientMeta.flatMap((ingredient, ingredientIndex) =>
                  Array.from({ length: ingredients[ingredient.id] }).map((_, index) => {
                    const position = toppingPositions[(index + ingredientIndex * 3) % toppingPositions.length];
                    return (
                      <span
                        key={`${ingredient.id}-${index}`}
                        className={`${styles.topping} ${styles[`topping_${ingredient.id}`]}`}
                        style={{
                          left: `${position[0]}%`,
                          top: `${position[1]}%`,
                          transform: `translate(-50%, -50%) rotate(${position[2]}deg)`,
                        }}
                      />
                    );
                  })
                )}
              </div>
              <p className={styles.balanceMessage}>
                {ingredientTotal === 0
                  ? "Comincia dalla materia."
                  : ingredientTotal > 10
                    ? "Timì sta alzando un sopracciglio…"
                    : ingredientTotal >= 7
                      ? "Adesso guarda l’equilibrio."
                      : "C’è ancora spazio. Ma serve davvero?"}
              </p>
            </div>

            <div className={styles.ingredientControls}>
              {ingredientMeta.map((ingredient) => (
                <div className={styles.ingredientRow} key={ingredient.id}>
                  <div>
                    <strong>{ingredient.label}</strong>
                    <span>{ingredient.micro}</span>
                  </div>
                  <div className={styles.counter}>
                    <button onClick={() => changeIngredient(ingredient.id, -1)} aria-label={`Togli ${ingredient.label}`}>−</button>
                    <b>{ingredients[ingredient.id]}</b>
                    <button onClick={() => changeIngredient(ingredient.id, 1)} aria-label={`Aggiungi ${ingredient.label}`}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.stageFooter}>
            <span className={styles.timiNote}>Timì: “Non coprire la pizza. Costruiscila.”</span>
            <button className={styles.primaryButton} disabled={ingredientTotal < 4} onClick={finishIngredients}>
              Al forno <span>→</span>
            </button>
          </div>
        </section>
      )}

      {stage === "oven" && (
        <section className={styles.gameStage}>
          <div className={styles.stageCopy}>
            <p className={styles.eyebrow}>03 · Tempo</p>
            <h2>Il tempo è un ingrediente.</h2>
            <p>Il forno è elettrico. Il momento giusto, invece, dipende da te.</p>
          </div>

          <div className={styles.ovenWrap}>
            <div className={styles.electricOven}>
              <div className={styles.ovenTopline}>
                <span>FORNO ELETTRICO PROFESSIONALE</span>
                <span className={styles.statusDot}>{ovenStarted ? "IN COTTURA" : "PRONTO"}</span>
              </div>
              <div className={styles.ovenChamber}>
                <div className={`${styles.ovenPizza} ${ovenStarted ? styles.ovenPizzaCooking : ""}`} />
                <div className={styles.heatGlow} aria-hidden="true" />
              </div>
              <div className={styles.ovenDisplay}>
                <span>TEMPO</span>
                <strong>{ovenElapsed.toFixed(1)} s</strong>
              </div>
            </div>

            <div className={styles.timingTrack} aria-label="Indicatore del tempo di cottura">
              <span className={styles.sweetSpot} />
              <span className={styles.timerNeedle} style={{ left: `${clamp((ovenElapsed / 7) * 100, 0, 100)}%` }} />
            </div>
            <div className={styles.timingLabels}><span>troppo presto</span><span>momento giusto</span><span>troppo tardi</span></div>

            {!ovenStarted && ovenElapsed === 0 ? (
              <button className={styles.primaryButton} onClick={startOven}>Inizia la cottura</button>
            ) : (
              <button className={`${styles.primaryButton} ${styles.ovenButton}`} onClick={finishOven} disabled={!ovenStarted}>
                Sforna adesso
              </button>
            )}
          </div>
        </section>
      )}

      {stage === "result" && (
        <section className={styles.result}>
          <div className={styles.resultImage}>
            <Image
              src="/images/timi-game-hero.webp"
              alt="Timì, mascotte di TIMILIA"
              fill
              sizes="(max-width: 800px) 100vw, 48vw"
              className={styles.resultPhoto}
            />
            <div className={styles.resultImageShade} />
          </div>

          <div className={styles.resultCopy}>
            <p className={styles.eyebrow}>Verdetto di Timì</p>
            <div className={styles.score}>{finalScore}<span>/100</span></div>
            <h2>{finalCopy.title}</h2>
            <p>{finalCopy.copy}</p>

            <div className={styles.scoreBreakdown}>
              <div><span>Impasto</span><b>{doughScore}</b></div>
              <div><span>Equilibrio</span><b>{ingredientScore}</b></div>
              <div><span>Tempo</span><b>{ovenScore}</b></div>
            </div>

            <div className={styles.realPizza}>
              <span>Bella virtuale.</span>
              <strong>Adesso assaggia quella vera.</strong>
            </div>

            <div className={styles.resultActions}>
              <Link className={styles.primaryButton} href="/menu">Scopri le pizze <span>→</span></Link>
              <button className={styles.secondaryButton} onClick={restart}>Rigioca</button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
