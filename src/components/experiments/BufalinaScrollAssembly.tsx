"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const VIDEO_URL =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_3J5bcdAgqMsyUqzT0zx6yGprNjK/7de60764-4523-43e7-9610-d28f135247d4.mp4";

const STAGES = [
  {
    from: 0,
    to: 0.22,
    label: "Salsa di pomodorino siccagno NP",
    detail: "il pomodoro, scelto prima del forno",
  },
  {
    from: 0.22,
    to: 0.44,
    label: "Pomodorino confit",
    detail: "la concentrazione",
  },
  {
    from: 0.44,
    to: 0.64,
    label: "Bufala DOP",
    detail: "la mozzarella, senza compromessi",
  },
  {
    from: 0.64,
    to: 0.84,
    label: "Olio EVO · basilico",
    detail: "il finale, semplice",
  },
  {
    from: 0.84,
    to: 1.01,
    label: "A Bufalina",
    detail: "la pizza reale",
  },
] as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};

export default function BufalinaScrollAssembly() {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const scrubRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(8);
  const progressRef = useRef(0);

  useEffect(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
    const bufalinaImage = images.find((image) =>
      image.alt.toLowerCase().includes("pizza a bufalina di timilia"),
    );

    if (!bufalinaImage) return;

    const storyGrid = bufalinaImage.closest("div.grid") as HTMLElement | null;
    const mediaColumn = storyGrid?.children?.[0] as HTMLElement | undefined;
    const copyColumn = storyGrid?.children?.[1] as HTMLElement | undefined;
    const originalVisual = mediaColumn?.firstElementChild as HTMLElement | null;

    if (!storyGrid || !mediaColumn || !copyColumn || !originalVisual) return;

    const previous = {
      gridAlignItems: storyGrid.style.alignItems,
      mediaAlignSelf: mediaColumn.style.alignSelf,
      copyPosition: copyColumn.style.position,
      copyTop: copyColumn.style.top,
      copyAlignSelf: copyColumn.style.alignSelf,
      visualDisplay: originalVisual.style.display,
    };

    storyGrid.style.alignItems = "start";
    mediaColumn.style.alignSelf = "stretch";
    originalVisual.style.display = "none";

    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (desktop) {
      copyColumn.style.position = "sticky";
      copyColumn.style.top = "18vh";
      copyColumn.style.alignSelf = "start";
    }

    setMountNode(mediaColumn);

    return () => {
      storyGrid.style.alignItems = previous.gridAlignItems;
      mediaColumn.style.alignSelf = previous.mediaAlignSelf;
      copyColumn.style.position = previous.copyPosition;
      copyColumn.style.top = previous.copyTop;
      copyColumn.style.alignSelf = previous.copyAlignSelf;
      originalVisual.style.display = previous.visualDisplay;
    };
  }, []);

  useEffect(() => {
    if (!mountNode || !scrubRef.current || !videoRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = scrubRef.current;
    const video = videoRef.current;
    let seekRaf = 0;

    const seek = (nextProgress: number) => {
      progressRef.current = clamp(nextProgress);
      cancelAnimationFrame(seekRaf);
      seekRaf = requestAnimationFrame(() => {
        if (!Number.isFinite(durationRef.current) || durationRef.current <= 0) return;
        const target = Math.max(
          0.01,
          Math.min(durationRef.current - 0.035, durationRef.current * progressRef.current),
        );
        if (Math.abs(video.currentTime - target) > 0.012) {
          try {
            video.currentTime = target;
          } catch {
            // Safari can briefly reject seeking before metadata is fully available.
          }
        }
      });
    };

    const onMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
      video.pause();
      seek(progressRef.current);
      setReady(true);
    };

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("canplay", onMetadata, { once: true });
    video.load();

    const scrollTrigger = ScrollTrigger.create({
      trigger,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.18,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const next = clamp(self.progress);
        seek(next);
        setProgress(next);
      },
    });

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);

    return () => {
      window.clearTimeout(refreshTimer);
      cancelAnimationFrame(seekRaf);
      video.removeEventListener("loadedmetadata", onMetadata);
      scrollTrigger.kill();
    };
  }, [mountNode]);

  const stage = useMemo(
    () => STAGES.find((item) => progress >= item.from && progress < item.to) ?? STAGES[STAGES.length - 1],
    [progress],
  );

  const reveal = smooth((progress - 0.885) / 0.115);

  if (!mountNode) return null;

  return createPortal(
    <div ref={scrubRef} className="relative h-[240vh] w-full lg:h-[360vh]">
      <div className="sticky top-[7svh] flex h-[86svh] w-full items-center justify-center lg:top-[8svh] lg:h-[84svh]">
        <div className="relative flex h-full w-full max-w-[34rem] items-center justify-center overflow-hidden bg-black shadow-[0_35px_90px_rgba(30,14,4,.22)] lg:ml-auto">
          <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_42%,transparent_35%,rgba(0,0,0,.22)_72%,rgba(0,0,0,.52)_100%)]" />

          <video
            ref={videoRef}
            src={VIDEO_URL}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-contain"
            style={{ opacity: failed ? 0 : 1 - reveal }}
            aria-label="Ingredienti della A Bufalina che si assemblano durante lo scroll"
          />

          <img
            src="/images/menu-story/bufalina.png"
            alt="Pizza A Bufalina di Timilia: salsa di pomodorino siccagno, bufala DOP, pomodorino confit, olio EVO e basilico"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
            style={{
              opacity: failed ? 1 : reveal,
              transform: `scale(${0.965 + reveal * 0.035})`,
            }}
          />

          {!ready && !failed && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/55">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/45">
                Preparazione A Bufalina…
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-black/78 via-black/35 to-transparent px-5 pb-5 pt-16 md:px-7 md:pb-7">
            <div className="flex items-end justify-between gap-5">
              <div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-[#d9b47c]">
                  {stage.label}
                </div>
                <div className="mt-1 font-serif text-sm italic text-white/70 md:text-base">
                  {stage.detail}
                </div>
              </div>
              <span className="font-mono text-[9px] tracking-[0.12em] text-white/38">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div className="mt-4 h-px w-full bg-white/12">
              <div
                className="h-px bg-[#d9b47c]"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>,
    mountNode,
  );
}
