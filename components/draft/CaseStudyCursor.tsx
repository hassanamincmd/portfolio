"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating “Case Study” pill with eye icon — follows pointer over [data-case-card].
 * Mirrors the live-site cursor.js behavior for the Figma draft preview.
 */
export function CaseStudyCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const pos = useRef({ x: 0, y: 0, on: false, active: false });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-figma-site-cursor");

    let raf = 0;
    const tick = () => {
      const el = cursorRef.current;
      if (el) {
        const { x, y, on, active } = pos.current;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.classList.toggle("is-on", on);
        el.classList.toggle("is-read-more", active);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      pos.current.on = true;
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      pos.current.active = Boolean(hit?.closest("[data-case-card]"));
    };

    const onLeave = () => {
      pos.current.on = false;
      pos.current.active = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-figma-site-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={cursorRef} className="figma-site-cursor" aria-hidden="true">
      <svg
        className="figma-site-cursor__eye"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span className="figma-site-cursor__label">Case Study</span>
    </div>
  );
}
