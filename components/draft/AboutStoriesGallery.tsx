"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

/** Story duration — progress bar + auto-advance stay in sync */
const STORY_MS = 3000;

const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    alt: "Scenic travel road through mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    alt: "Minimal workspace with laptop and coffee",
  },
  {
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    alt: "Portrait placeholder with soft natural lighting",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    alt: "Collaborative team session around a table",
  },
  {
    src: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80",
    alt: "Matcha setup and reading corner",
  },
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    alt: "Landscape lake view at golden hour",
  },
  {
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
    alt: "Busy city street with cafes and pedestrians",
  },
] as const;

export function AboutStoriesGallery() {
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [cycle, setCycle] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  const count = PHOTOS.length;
  const playing = inView && pageVisible && !reduceMotion;

  indexRef.current = index;

  const goTo = useCallback((next: number) => {
    const wrapped = ((next % count) + count) % count;
    setCycle((c) => c + 1);
    setIndex(wrapped);
  }, [count]);

  const goNext = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const sync = () => setPageVisible(document.visibilityState === "visible");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: [0, 0.01, 0.1], rootMargin: "120px 0px 120px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => goNext(), STORY_MS);
    return () => window.clearTimeout(id);
  }, [playing, goNext, index, cycle]);

  const onTap = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    if (x < rect.width * 0.35) goPrev();
    else goNext();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  return (
    <div
      ref={rootRef}
      className={`figma-stories${playing ? "" : " is-paused"}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="About photo stories"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="figma-stories__progress" aria-hidden="true">
        {PHOTOS.map((_, i) => {
          let state: "done" | "active" | "pending" = "pending";
          if (i < index) state = "done";
          else if (i === index) state = "active";

          return (
            <div key={i} className={`figma-stories__bar figma-stories__bar--${state}`}>
              <span
                key={state === "active" ? `active-${cycle}-${index}` : `${state}-${i}`}
                className="figma-stories__bar-fill"
                style={
                  state === "active" && !reduceMotion
                    ? { animationDuration: `${STORY_MS}ms` }
                    : undefined
                }
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="figma-stories__hit"
        onClick={onTap}
        aria-label={`Photo ${index + 1} of ${count}. Click left for previous, right for next.`}
      >
        <img
          key={PHOTOS[index].src}
          src={PHOTOS[index].src}
          alt={PHOTOS[index].alt}
          className="figma-stories__image"
          draggable={false}
        />
      </button>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Showing photo {index + 1} of {count}
      </p>
    </div>
  );
}
