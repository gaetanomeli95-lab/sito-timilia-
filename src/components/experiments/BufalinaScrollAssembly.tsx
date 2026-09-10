"use client";

import { useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore - Three.js typings are intentionally omitted on this experimental branch.
import * as THREE from "three";
// @ts-ignore - Three.js example loader typings are intentionally omitted here.
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const MODEL_URL =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_3J5bcdAgqMsyUqzT0zx6yGprNjK/d203f48f-f580-495f-8e01-afe60a4bb75e.glb";

const STAGES = [
  {
    from: 0.00,
    to: 0.15,
    step: "01",
    label: "Salsa di pomodorino siccagno NP",
    detail: "Il pomodoro, scelto prima del forno",
  },
  {
    from: 0.15,
    to: 0.31,
    step: "02",
    label: "Pomodorino confit",
    detail: "La concentrazione",
  },
  {
    from: 0.31,
    to: 0.47,
    step: "03",
    label: "Bufala DOP",
    detail: "La mozzarella, senza compromessi",
  },
  {
    from: 0.47,
    to: 0.63,
    step: "04",
    label: "Basilico",
    detail: "Il finale, semplice",
  },
  {
    from: 0.63,
    to: 0.77,
    step: "05",
    label: "Olio EVO",
    detail: "Il gesto finale",
  },
  {
    from: 0.77,
    to: 0.89,
    step: "06",
    label: "Impasto",
    detail: "La struttura che tiene tutto insieme",
  },
  {
    from: 0.89,
    to: 1.01,
    step: "07",
    label: "A Bufalina",
    detail: "Quella vera. Intera.",
  },
] as const;

const GROUP_RANGES: Record<string, [number, number]> = {
  sauce: [0.04, 0.20],
  tomatoes: [0.19, 0.36],
  bufala: [0.34, 0.52],
  basil: [0.50, 0.68],
  oil: [0.65, 0.80],
  dough: [0.77, 0.89],
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const x = clamp(v);
  return x * x * (3 - 2 * x);
};

function objectGroup(name: string) {
  const n = name.toLowerCase();
  if (n.includes("salsa")) return "sauce";
  if (n.includes("pomodorino")) return "tomatoes";
  if (n.includes("bufala")) return "bufala";
  if (n.includes("basilico")) return "basil";
  if (n.includes("olio")) return "oil";
  if (n.includes("impasto") || n.includes("cornicione") || n.includes("bruciatura")) return "dough";
  return null;
}

type Pose = {
  position: any;
  quaternion: any;
  scale: any;
};

type AnimatedPart = {
  object: any;
  group: string;
  exploded: Pose;
  assembled: Pose;
  phase: number;
};

function capturePose(object: any): Pose {
  return {
    position: object.position.clone(),
    quaternion: object.quaternion.clone(),
    scale: object.scale.clone(),
  };
}

export default function BufalinaScrollAssembly() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const host = canvasHostRef.current;
    if (!section || !host) return;

    let disposed = false;
    let renderer: any = null;
    let scene: any = null;
    let camera: any = null;
    let root: any = null;
    let frameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let scrollTrigger: any = null;
    let parts: AnimatedPart[] = [];
    let startBox: any = null;
    let finalBox: any = null;
    let startSpan = 6;
    let finalSpan = 4;
    let finalCenter = new THREE.Vector3();
    let topFocus = 4;

    const init = async () => {
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.18;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        renderer.domElement.style.pointerEvents = "none";
        host.replaceChildren(renderer.domElement);

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050302, 0.018);

        const hemi = new THREE.HemisphereLight(0xffe4c2, 0x110805, 1.55);
        scene.add(hemi);

        const key = new THREE.SpotLight(0xffc888, 115, 35, Math.PI / 5.8, 0.48, 1.2);
        key.position.set(4.8, 8.5, 7.4);
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        scene.add(key);

        const rim = new THREE.PointLight(0xff6a22, 42, 24, 1.4);
        rim.position.set(-5.5, 4.4, -3.8);
        scene.add(rim);

        const soft = new THREE.PointLight(0xffe8d4, 22, 18, 1.5);
        soft.position.set(2.5, 1.0, 5.5);
        scene.add(soft);

        const gltf = await new GLTFLoader().loadAsync(MODEL_URL);
        if (disposed) return;

        root = gltf.scene;
        scene.add(root);

        root.traverse((object: any) => {
          if (/^CALL_OUT/i.test(object.name || "")) object.visible = false;
          if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
            if (object.material) {
              const materials = Array.isArray(object.material) ? object.material : [object.material];
              materials.forEach((material: any) => {
                if ("envMapIntensity" in material) material.envMapIntensity = 1.2;
                material.needsUpdate = true;
              });
            }
          }
        });

        // Play every Blender clip at once only to sample the two real poses.
        // After sampling, Three.js owns the choreography directly.
        const mixer = new THREE.AnimationMixer(root);
        const actions = gltf.animations.map((clip: any) => {
          const action = mixer.clipAction(clip);
          action.enabled = true;
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
          return action;
        });
        const maxDuration = Math.max(0.001, ...gltf.animations.map((clip: any) => clip.duration || 0));

        mixer.setTime(0);
        mixer.update(0);

        const recognised: Array<{ object: any; group: string; exploded: Pose; phase: number }> = [];
        let phaseIndex = 0;
        root.traverse((object: any) => {
          const group = objectGroup(object.name || "");
          if (!group || !object.position || !object.quaternion || !object.scale) return;
          recognised.push({
            object,
            group,
            exploded: capturePose(object),
            phase: phaseIndex++ * 0.73,
          });
        });

        startBox = new THREE.Box3().setFromObject(root);
        const startSize = startBox.getSize(new THREE.Vector3());
        startSpan = Math.max(startSize.x, startSize.y, startSize.z, 1);
        topFocus = startBox.max.y - startSize.y * 0.16;

        mixer.setTime(maxDuration);
        mixer.update(0);

        const assembledByUuid = new Map<string, Pose>();
        recognised.forEach((item) => assembledByUuid.set(item.object.uuid, capturePose(item.object)));
        finalBox = new THREE.Box3().setFromObject(root);
        const finalSize = finalBox.getSize(new THREE.Vector3());
        finalSpan = Math.max(finalSize.x, finalSize.y, finalSize.z, 1);
        finalCenter = finalBox.getCenter(new THREE.Vector3());

        mixer.stopAllAction();
        actions.forEach((action: any) => action.stop());

        parts = recognised.map((item) => ({
          object: item.object,
          group: item.group,
          exploded: item.exploded,
          assembled: assembledByUuid.get(item.object.uuid) || item.exploded,
          phase: item.phase,
        }));

        // Restore the true exploded pose after Blender sampling.
        parts.forEach((part) => {
          part.object.position.copy(part.exploded.position);
          part.object.quaternion.copy(part.exploded.quaternion);
          part.object.scale.copy(part.exploded.scale);
        });

        camera = new THREE.PerspectiveCamera(32, 1, 0.01, 300);

        const updateScene = (timeMs = 0) => {
          const p = progressRef.current;

          for (const part of parts) {
            const range = GROUP_RANGES[part.group];
            if (!range) continue;
            const local = smooth((p - range[0]) / Math.max(0.001, range[1] - range[0]));

            part.object.position.lerpVectors(part.exploded.position, part.assembled.position, local);
            part.object.quaternion.slerpQuaternions(
              part.exploded.quaternion,
              part.assembled.quaternion,
              local,
            );
            part.object.scale.lerpVectors(part.exploded.scale, part.assembled.scale, local);

            // Tiny living movement while the ingredient is still suspended.
            const active = 1 - Math.min(1, Math.abs(local - 0.48) * 2.2);
            if (active > 0) {
              part.object.position.y += Math.sin(timeMs * 0.00115 + part.phase) * 0.025 * active;
              part.object.rotation.y += Math.sin(timeMs * 0.00072 + part.phase) * 0.0015 * active;
            }
          }

          // The camera travels through the vertical exploded composition instead of orbiting it.
          const travel = smooth(clamp(p / 0.88));
          const focusY = THREE.MathUtils.lerp(topFocus, finalCenter.y + finalSpan * 0.08, travel);
          const distance = THREE.MathUtils.lerp(
            Math.max(startSpan * 1.38, 7.5),
            Math.max(finalSpan * 1.45, 6.0),
            travel,
          );
          const cinematicX = Math.sin(p * Math.PI * 1.28) * finalSpan * 0.055;
          const cinematicLift = Math.sin(p * Math.PI) * finalSpan * 0.045;

          camera.position.set(
            finalCenter.x + cinematicX,
            focusY + finalSpan * 0.12 + cinematicLift,
            finalCenter.z + distance,
          );
          camera.lookAt(finalCenter.x, focusY, finalCenter.z);
        };

        const resize = () => {
          if (!renderer || !camera) return;
          const width = Math.max(1, host.clientWidth);
          const height = Math.max(1, host.clientHeight);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };

        scrollTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          invalidateOnRefresh: true,
          onUpdate: (self: any) => {
            const next = clamp(self.progress);
            progressRef.current = next;
            setProgress(next);
          },
        });

        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        resize();
        updateScene(0);
        setLoaded(true);
        ScrollTrigger.refresh();

        const render = (timeMs: number) => {
          if (disposed) return;
          updateScene(timeMs);
          renderer.render(scene, camera);
          frameId = requestAnimationFrame(render);
        };
        frameId = requestAnimationFrame(render);
      } catch (reason) {
        console.error("Bufalina cinematic 3D failed", reason);
        if (!disposed) setError(true);
      }
    };

    init();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      scrollTrigger?.kill?.();
      resizeObserver?.disconnect();
      if (root) {
        root.traverse((object: any) => {
          object.geometry?.dispose?.();
          if (object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material: any) => material.dispose?.());
          }
        });
      }
      renderer?.dispose?.();
      renderer?.domElement?.remove?.();
    };
  }, []);

  const stage = useMemo(
    () => STAGES.find((item) => progress >= item.from && progress < item.to) ?? STAGES[STAGES.length - 1],
    [progress],
  );

  const reveal = smooth((progress - 0.895) / 0.105);
  const flare = Math.sin(clamp((progress - 0.855) / 0.10) * Math.PI) * (progress < 0.955 ? 1 : 0);

  return (
    <section ref={sectionRef} className="relative h-[620vh] bg-[#030201] text-[#f4eee5]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#030201]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 67% 46%,rgba(158,76,24,.18),transparent 28%), radial-gradient(circle at 54% 100%,rgba(83,37,13,.18),transparent 35%), linear-gradient(180deg,#020101 0%,#080402 55%,#020101 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-20 mix-blend-screen"
          style={{
            opacity: flare * 0.34,
            background: "radial-gradient(circle at 68% 53%,rgba(255,182,101,.95),transparent 19%)",
          }}
        />

        <div className="relative mx-auto h-full max-w-[1680px]">
          <div
            ref={canvasHostRef}
            className="pointer-events-none absolute inset-0 lg:left-[31%]"
            style={{
              opacity: error ? 0 : 1 - reveal,
              transform: `scale(${1 - reveal * 0.035})`,
              transformOrigin: "62% 55%",
            }}
          />

          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/78 via-black/18 to-transparent lg:w-[60%]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[22vh] bg-gradient-to-t from-[#030201] to-transparent" />

          <aside className="absolute inset-y-0 left-0 z-30 flex w-full flex-col justify-between px-5 pb-8 pt-24 md:px-9 lg:w-[38%] lg:px-14 lg:pb-12 lg:pt-28">
            <div>
              <div className="flex items-center gap-3 text-[9px] uppercase tracking-[.34em] text-[#d2aa72] md:text-[10px]">
                <span className="h-px w-9 bg-[#d2aa72]/70" />
                La materia prima, senza nascondigli
              </div>

              <h2 className="mt-5 max-w-[620px] font-serif text-[clamp(3.6rem,7.1vw,8.4rem)] font-light leading-[.82] tracking-[-.058em]">
                A Bufalina
              </h2>

              <p className="mt-6 max-w-[360px] font-serif text-[clamp(1.25rem,2vw,2rem)] leading-tight text-white/84">
                Pochi elementi.<br />Tutti decisivi.
              </p>
            </div>

            <div className="mb-[12vh] max-w-[390px] lg:mb-[5vh]">
              <div className="mb-4 flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-[.25em] text-[#d2aa72]">{stage.step}</span>
                <span className="h-px flex-1 bg-gradient-to-r from-[#d2aa72]/60 to-transparent" />
              </div>
              <div key={stage.step} className="animate-[fadeIn_.35s_ease-out]">
                <div className="text-[11px] uppercase leading-relaxed tracking-[.19em] text-white/92 md:text-[13px]">
                  {stage.label}
                </div>
                <p className="mt-2 font-serif text-lg italic leading-relaxed text-white/58 md:text-xl">
                  {stage.detail}
                </p>
              </div>

              <div className="mt-7 flex items-center gap-3">
                <div className="h-px w-28 overflow-hidden bg-white/10 md:w-36">
                  <div
                    className="h-full origin-left bg-[#d2aa72]"
                    style={{ transform: `scaleX(${progress})` }}
                  />
                </div>
                <span className="font-mono text-[9px] tracking-[.14em] text-white/30">
                  {String(Math.round(progress * 100)).padStart(2, "0")}%
                </span>
              </div>
              <div className="mt-4 text-[8px] uppercase tracking-[.3em] text-white/27 md:text-[9px]">
                Scorri · la camera attraversa la materia
              </div>
            </div>
          </aside>

          <div
            className="pointer-events-none absolute inset-0 z-25 flex items-center justify-center px-4 pt-16 lg:left-[30%]"
            style={{
              opacity: reveal,
              transform: `scale(${0.90 + reveal * 0.10}) translateY(${(1 - reveal) * 18}px)`,
            }}
          >
            <div className="relative w-full max-w-[1040px]">
              <div
                className="absolute inset-[4%] rounded-full blur-3xl"
                style={{
                  background: "radial-gradient(circle,rgba(220,102,31,.28),transparent 64%)",
                  opacity: 0.45 + reveal * 0.55,
                }}
              />
              <img
                src="/images/menu-story/bufalina.png"
                alt="Pizza A Bufalina di Timilia: salsa di pomodorino siccagno NP, bufala DOP, pomodorino confit, olio EVO e basilico"
                className="relative z-10 mx-auto block max-h-[86vh] w-full object-contain drop-shadow-[0_55px_65px_rgba(0,0,0,.78)]"
              />
              <div
                className="absolute -bottom-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-center"
                style={{ opacity: smooth((reveal - 0.42) / 0.58) }}
              >
                <div className="text-[9px] uppercase tracking-[.34em] text-[#d2aa72]">Timilia · Palermo</div>
                <div className="mt-2 font-serif text-lg italic text-white/66">A Bufalina</div>
              </div>
            </div>
          </div>

          {!loaded && !error && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#030201] text-[9px] uppercase tracking-[.3em] text-white/35">
              Prepariamo la materia…
            </div>
          )}

          {error && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-end px-5 pb-24 md:px-10 lg:px-16">
              <img
                src="/images/menu-story/bufalina.png"
                alt="A Bufalina"
                className="max-h-[70vh] max-w-[70vw] object-contain opacity-85"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
