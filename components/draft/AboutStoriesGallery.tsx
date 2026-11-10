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
    src: "/about/01-wedding.jpg",
    alt: "Hassan and his wife on their wedding day, walking hand in hand outdoors",
  },
  {
    src: "/about/02-reflection.jpg",
    alt: "Hassan and his wife reflected in glass during a day out together",
  },
  {
    src: "/about/03-waterfront.jpg",
    alt: "Hassan by the waterfront with sailboats in the background",
  },
  {
    src: "/about/04-snorkeling.jpg",
    alt: "Hassan snorkeling and giving a thumbs up in clear blue water",
  },
  {
    src: "/about/05-beach-gazebo.jpg",
    alt: "Red-roofed beach gazebo on the sand by the sea",
  },
  {
    src: "/about/06-desert-grill.jpg",
    alt: "Hassan grilling over a fire pit in the desert",
  },
] as const;

export function AboutStoriesGallery() {
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [cycle, setCycle] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);
  const playingRef = useRef(true);

  const count = PHOTOS.length;
  const playing = inView && pageVisible;
  playingRef.current = playing;

  indexRef.current = index;

  const goTo = useCallback((next: number) => {
    const wrapped = ((next % count) + count) % count;
    setCycle((c) => c + 1);
    setIndex(wrapped);
  }, [count]);

  const goNext = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

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
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio > 0);
      },
      { threshold: [0, 0.01, 0.05, 0.1, 0.25], rootMargin: "80px 0px 80px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* JS-driven fill — survives prefers-reduced-motion CSS overrides */
  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    let raf = 0;
    let start = performance.now();
    let elapsed = 0;

    fill.style.transform = "scaleX(0)";

    const tick = (now: number) => {
      if (!playingRef.current) {
        start = now - elapsed;
        raf = requestAnimationFrame(tick);
        return;
      }

      elapsed = now - start;
      const t = Math.min(1, elapsed / STORY_MS);
      fill.style.transform = `scaleX(${t})`;

      if (t >= 1) {
        goNext();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [goNext, index, cycle]);

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
                ref={state === "active" ? fillRef : undefined}
                className="figma-stories__bar-fill"
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
