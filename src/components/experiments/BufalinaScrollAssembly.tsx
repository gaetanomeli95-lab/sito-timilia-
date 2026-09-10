"use client";

import { useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore - Three.js types are intentionally omitted on this experimental branch.
import * as THREE from "three";
// @ts-ignore - Three.js example loader ships without local type declarations here.
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const MODEL_URL =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_3J5bcdAgqMsyUqzT0zx6yGprNjK/d203f48f-f580-495f-8e01-afe60a4bb75e.glb";

const STAGES = [
  { from: 0.00, to: 0.18, label: "Salsa di pomodorino siccagno NP", detail: "Il pomodoro, scelto prima del forno" },
  { from: 0.18, to: 0.34, label: "Pomodorino confit", detail: "La concentrazione" },
  { from: 0.34, to: 0.50, label: "Bufala DOP", detail: "La mozzarella, senza compromessi" },
  { from: 0.50, to: 0.66, label: "Basilico", detail: "Il finale, semplice" },
  { from: 0.66, to: 0.80, label: "Olio EVO", detail: "Il gesto finale" },
  { from: 0.80, to: 0.90, label: "Impasto", detail: "La base prende forma" },
  { from: 0.90, to: 1.01, label: "A Bufalina", detail: "La pizza reale" },
];

const GROUP_RANGES: Record<string, [number, number]> = {
  sauce: [0.00, 0.18],
  tomatoes: [0.18, 0.34],
  bufala: [0.34, 0.50],
  basil: [0.50, 0.66],
  oil: [0.66, 0.80],
  dough: [0.80, 0.90],
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));

function clipGroup(name: string) {
  const n = name.toLowerCase();
  if (n.includes("salsa")) return "sauce";
  if (n.includes("pomodorino")) return "tomatoes";
  if (n.includes("bufala")) return "bufala";
  if (n.includes("basilico")) return "basil";
  if (n.includes("olio")) return "oil";
  if (n.includes("impasto") || n.includes("cornicione") || n.includes("bruciatura")) return "dough";
  return null;
}

export default function BufalinaScrollAssembly() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let disposed = false;
    let renderer: any;
    let scene: any;
    let camera: any;
    let mixer: any;
    let actions: Array<{ action: any; clip: any; group: string | null }> = [];
    let renderFrame = 0;
    let resizeObserver: ResizeObserver | null = null;

    const init = async () => {
      try {
        if (disposed || !canvasHostRef.current) return;
        const host = canvasHostRef.current;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        host.replaceChildren(renderer.domElement);

        scene = new THREE.Scene();
        scene.add(new THREE.HemisphereLight(0xffe2bd, 0x160b05, 2.0));
        const key = new THREE.DirectionalLight(0xffd19a, 4.2);
        key.position.set(4, 7, 6);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xff7d2e, 2.4);
        rim.position.set(-5, 3, -4);
        scene.add(rim);

        const gltf = await new GLTFLoader().loadAsync(MODEL_URL);
        if (disposed) return;
        scene.add(gltf.scene);

        const embeddedCamera = gltf.cameras?.[0];
        if (embeddedCamera?.isPerspectiveCamera) {
          camera = embeddedCamera;
          camera.near = 0.01;
          camera.far = 200;
        } else {
          camera = new THREE.PerspectiveCamera(34, 1, 0.01, 200);
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const span = Math.max(size.x, size.y, size.z);
          camera.position.set(center.x, center.y + span * 0.06, center.z + span * 1.8);
          camera.lookAt(center);
        }

        mixer = new THREE.AnimationMixer(gltf.scene);
        actions = gltf.animations.map((clip: any) => {
          const action = mixer.clipAction(clip);
          action.enabled = true;
          action.clampWhenFinished = true;
          action.setLoop(THREE.LoopOnce, 1);
          action.play();
          return { action, clip, group: clipGroup(clip.name) };
        });

        const sample = () => {
          const p = progressRef.current;
          for (const item of actions) {
            if (!item.group || !GROUP_RANGES[item.group]) continue;
            const [from, to] = GROUP_RANGES[item.group];
            const local = clamp((p - from) / Math.max(0.001, to - from));
            item.action.enabled = true;
            item.action.paused = false;
            item.action.timeScale = 0;
            item.action.time = item.clip.duration * local;
          }
          mixer.update(0);
        };

        const resize = () => {
          if (!renderer || !camera) return;
          const w = Math.max(1, host.clientWidth);
          const h = Math.max(1, host.clientHeight);
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix?.();
        };

        const render = () => {
          if (disposed) return;
          sample();
          renderer.render(scene, camera);
          renderFrame = requestAnimationFrame(render);
        };

        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        resize();
        setLoaded(true);
        render();
      } catch (e) {
        console.error("Bufalina Three.js scene failed", e);
        setError(true);
      }
    };

    init();

    return () => {
      disposed = true;
      cancelAnimationFrame(renderFrame);
      resizeObserver?.disconnect();
      if (renderer) {
        renderer.dispose?.();
        renderer.domElement?.remove?.();
      }
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const p = clamp(-rect.top / total);
      progressRef.current = p;
      setProgress(p);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const stage = useMemo(
    () => STAGES.find((s) => progress >= s.from && progress < s.to) ?? STAGES[STAGES.length - 1],
    [progress],
  );
  const reveal = clamp((progress - 0.90) / 0.10);

  return (
    <section ref={sectionRef} className="relative h-[700vh] bg-[#030201] text-[#f4eee5]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[radial-gradient(circle_at_62%_45%,rgba(151,77,24,.20),transparent_29%),linear-gradient(180deg,#030201,#080402_68%,#020101)]">
        <div className="mx-auto grid h-full max-w-[1600px] grid-cols-1 lg:grid-cols-[.70fr_1.30fr]">
          <div className="relative z-30 flex flex-col justify-center px-6 pt-24 lg:px-14 lg:pt-16">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[.34em] text-[#d2aa72]">
              <span className="h-px w-10 bg-[#d2aa72]/70" />
              La materia prima, senza nascondigli
            </div>
            <h1 className="mt-6 font-serif text-[clamp(4rem,7vw,8rem)] font-light leading-[.85] tracking-[-.05em]">A Bufalina</h1>
            <p className="mt-7 font-serif text-2xl text-white/88 md:text-3xl">Pochi elementi.<br />Tutti decisivi.</p>

            <div className="mt-10 max-w-[380px] border-l border-[#d2aa72]/40 pl-5">
              <div className="text-[10px] uppercase tracking-[.26em] text-[#d2aa72]">{stage.label}</div>
              <p className="mt-2 font-serif text-xl italic text-white/68">{stage.detail}</p>
            </div>

            <div className="mt-9 flex items-center gap-3">
              <div className="h-px w-28 overflow-hidden bg-white/10">
                <div className="h-full bg-[#d2aa72]" style={{ width: `${progress * 100}%` }} />
              </div>
              <span className="font-mono text-[9px] tracking-[.16em] text-white/35">{Math.round(progress * 100)}%</span>
            </div>
            <div className="mt-5 text-[9px] uppercase tracking-[.28em] text-white/35">Scroll · assemblaggio 3D reale</div>
          </div>

          <div className="relative min-h-0">
            <div
              ref={canvasHostRef}
              className="absolute inset-0"
              style={{ opacity: 1 - reveal, transition: "opacity 70ms linear" }}
            />

            {!loaded && !error && (
              <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[.26em] text-white/35">
                Caricamento scena 3D…
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-sm text-white/45">
                La scena 3D non è disponibile su questo browser.
              </div>
            )}

            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 pt-16"
              style={{
                opacity: reveal,
                transform: `scale(${0.94 + reveal * 0.06})`,
                transition: "opacity 70ms linear",
              }}
            >
              <div className="relative w-full max-w-[980px]">
                <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(219,104,29,.2),transparent_64%)] blur-3xl" />
                <img
                  src="/images/menu-story/bufalina.png"
                  alt="Pizza A Bufalina di Timilia: salsa di pomodorino siccagno, bufala DOP, pomodorino confit, olio EVO e basilico"
                  className="relative z-10 mx-auto block max-h-[82vh] w-full object-contain drop-shadow-[0_55px_55px_rgba(0,0,0,.7)]"
                />
              </div>
            </div>

            <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 lg:block">
              <div className="flex items-center gap-3">
                <span className="h-px w-14 bg-[#d2aa72]/50" />
                <div>
                  <div className="text-[11px] uppercase tracking-[.2em] text-white/90">{stage.label}</div>
                  <div className="mt-1 font-serif text-sm italic text-white/52">{stage.detail}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
