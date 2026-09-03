"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type NavSection = {
  id: string;
  href: string;
  label: string;
};

const NAV_SECTIONS: NavSection[] = [
  { id: "work", href: "#work", label: "Work" },
  { id: "about", href: "#about", label: "About Me" },
  { id: "contact", href: "#contact", label: "Let's Talk" },
];

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function sectionFocus(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const bandTop = vh * 0.12;
  const bandBottom = vh * 0.58;
  const overlap = Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop);
  if (overlap <= 0) return 0;
  return clamp01(overlap / (bandBottom - bandTop));
}

export function SiteHeader() {
  const barRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const lastSectionRef = useRef(-1);
  const [progress, setProgress] = useState(0);
  const [linkProgress, setLinkProgress] = useState<number[]>(() =>
    NAV_SECTIONS.map(() => 0),
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);

  const updateNav = useCallback(() => {
    const sections = NAV_SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];

    let best = -1;
    let bestP = 0;
    const scores = sections.map((el, index) => {
      const p = sectionFocus(el);
      if (p > bestP) {
        bestP = p;
        best = index;
      }
      return p;
    });

    setLinkProgress(scores.map((p, index) => (index === best ? p : p * 0.35)));
    setActiveIndex(bestP > 0.35 ? best : -1);

    const indicator = indicatorRef.current;
    const bar = barRef.current;
    const activeLink = best >= 0 ? linkRefs.current[best] : null;

    if (indicator && bar && activeLink && bestP > 0.35) {
      const barRect = bar.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      indicator.style.left = `${linkRect.left - barRect.left}px`;
      indicator.style.width = `${linkRect.width}px`;
      indicator.style.opacity = "1";
    } else if (indicator) {
      indicator.style.opacity = "0";
    }

    if (best !== lastSectionRef.current && lastSectionRef.current !== -1 && best >= 0) {
      setPulseIndex(best);
      window.setTimeout(() => setPulseIndex(null), 550);
    }
    lastSectionRef.current = best;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      setProgress(maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0);
      updateNav();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updateNav]);

  return (
    <>
      <div className="progress-track" aria-hidden="true">
        <span id="progress" style={{ width: `${progress}%` }} />
      </div>

      <header className="header">
        <div className="header__bar" ref={barRef}>
          <span className="header__nav-indicator" ref={indicatorRef} aria-hidden="true" />
          <Link className="header__brand" href="/">
            h.
          </Link>
          <nav className="header__nav" aria-label="Primary">
            {NAV_SECTIONS.map(({ href, label }, index) => (
              <Link
                key={href}
                href={href}
                ref={(node) => {
                  linkRefs.current[index] = node;
                }}
                style={{ ["--nav-p" as string]: linkProgress[index]?.toFixed(3) ?? "0" }}
                className={[
                  activeIndex === index ? "is-section-active" : "",
                  pulseIndex === index ? "is-section-changed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="header__actions" />
        </div>
      </header>
    </>
  );
}
