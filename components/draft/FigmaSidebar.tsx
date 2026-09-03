"use client";

import { FIGMA } from "@/components/draft/figma-assets";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About Me" },
  { href: "#contact", label: "Let's Talk" },
] as const;

/** Stack keywords from the live-site hero marquee */
const STACK_KEYWORDS = [
  "Prototyping",
  "Figma",
  "Claude",
  "Cursor",
  "NotebookLM",
  "Framer",
  "No-code Builders",
  "Jira",
  "Trello",
  "Notion",
  "FigJam",
  "Atlassian",
  "Wireframing",
  "Interaction Design",
  "Information Architecture",
  "Design Systems",
  "Accessibility",
  "UX Writing",
  "Prompt Engineering",
  "AI Integration",
  "WCAG",
  "User Research",
  "Usability Testing",
  "Data-Driven Design",
  "Agile / Scrum",
  "Design Thinking",
] as const;

const LONGEST_KEYWORD = STACK_KEYWORDS.reduce((longest, word) =>
  word.length > longest.length ? word : longest,
);

/** 4×3 — all 12 client marks */
const CLIENT_LOGOS = [
  FIGMA.logos.deloitte,
  FIGMA.logos.eu,
  FIGMA.logos.qualitas,
  FIGMA.logos.novartis,
  FIGMA.logos.procore,
  FIGMA.logos.investview,
  FIGMA.logos.cma,
  FIGMA.logos.petronas,
  FIGMA.logos.malaysia,
  FIGMA.logos.vodafone,
  FIGMA.logos.busybees,
  FIGMA.logos.images1,
] as const;

function StackTypewriter() {
  const [text, setText] = useState<string>(STACK_KEYWORDS[0]);
  const [showCaret, setShowCaret] = useState(true);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduceMotionRef.current = mq.matches;
      setShowCaret(!mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let wordIndex = 0;
    let charIndex = STACK_KEYWORDS[0].length;
    let deleting = false;
    let timeoutId = 0;

    const TYPE_MS = 70;
    const DELETE_MS = 40;
    const HOLD_MS = 1600;
    const GAP_MS = 320;

    const schedule = (fn: () => void, ms: number) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    const tick = () => {
      if (cancelled) return;

      const current = STACK_KEYWORDS[wordIndex];

      if (!deleting && charIndex >= current.length) {
        schedule(() => {
          deleting = true;
          tick();
        }, HOLD_MS);
        return;
      }

      if (deleting && charIndex <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % STACK_KEYWORDS.length;
        schedule(tick, GAP_MS);
        return;
      }

      charIndex += deleting ? -1 : 1;
      setText(STACK_KEYWORDS[wordIndex].slice(0, Math.max(0, charIndex)));
      schedule(tick, deleting ? DELETE_MS : TYPE_MS);
    };

    // Hold first word, then delete → retype cycle
    schedule(() => {
      deleting = true;
      tick();
    }, HOLD_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <span
      className="figma-sidebar__typewriter"
      aria-live="polite"
      style={{ minWidth: `${LONGEST_KEYWORD.length}ch` }}
    >
      {text}
      {showCaret ? (
        <span className="figma-sidebar__typewriter-caret" aria-hidden="true" />
      ) : null}
    </span>
  );
}

export function FigmaSidebar() {
  const [active, setActive] = useState("#work");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    type SectionRef = { href: (typeof NAV)[number]["href"]; el: Element };

    const sections = NAV.map(({ href }) => ({
      href,
      el: document.querySelector(href),
    })).filter((s): s is SectionRef => s.el instanceof Element);

    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;

      if (nearBottom) {
        setActive("#contact");
        return;
      }

      let current = sections[0]?.href ?? "#work";
      for (const section of sections) {
        if (section.el.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          current = section.href;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.body.classList.add("figma-nav-open");
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("figma-nav-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <aside className="figma-sidebar" aria-label="Site navigation">
      <div className="figma-sidebar__top">
        <div className="figma-sidebar__hero">
          <img src={FIGMA.sidebarHero} alt="" width={612} height={302} />
        </div>

        <div className="figma-sidebar__identity">
          <div className="figma-sidebar__identity-text">
            <h1 className="figma-sidebar__title">Hassan Amin</h1>
            <p className="figma-sidebar__tagline">
              A product and UI/UX Designer with 5 years of experience in <StackTypewriter />
            </p>
          </div>

          <button
            type="button"
            className={`figma-sidebar__burger${menuOpen ? " is-open" : ""}`}
            aria-expanded={menuOpen}
            aria-controls="figma-mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="figma-sidebar__mid">
        <nav className="figma-sidebar__nav figma-sidebar__nav--desktop" aria-label="Primary">
          {NAV.map(({ href, label }) => {
            const isActive = active === href;
            return (
              <Link
                key={href}
                href={href}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="figma-sidebar__nav-marker" aria-hidden="true">
                  {isActive ? ">" : ""}
                </span>
                <span className="figma-sidebar__nav-label">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="figma-sidebar__logos" aria-label="Clients">
          {CLIENT_LOGOS.map((src, i) => (
            <div key={`${src}-${i}`} className="figma-sidebar__logo">
              <img src={src} alt="" width={36} height={36} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <footer className="figma-sidebar__footer">
        <span>hassanamin.net © 2026</span>
        <div className="figma-sidebar__social">
          <a
            href="https://www.linkedin.com/in/hassan-mo-amin/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <img src={FIGMA.iconLinkedIn} alt="" width={18} height={18} />
          </a>
          <a href="mailto:contact.hassan.amin@gmail.com" aria-label="Email">
            <img src={FIGMA.iconEmail} alt="" width={18} height={18} />
          </a>
        </div>
      </footer>

      <div
        className={`figma-sidebar__drawer${menuOpen ? " is-open" : ""}`}
        id="figma-mobile-nav"
        hidden={!menuOpen}
      >
        <button
          type="button"
          className="figma-sidebar__drawer-backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
        <nav className="figma-sidebar__drawer-panel" aria-label="Mobile">
          {NAV.map(({ href, label }) => {
            const isActive = active === href;
            return (
              <Link
                key={href}
                href={href}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "true" : undefined}
                onClick={closeMenu}
              >
                <span className="figma-sidebar__nav-marker" aria-hidden="true">
                  {isActive ? ">" : ""}
                </span>
                <span className="figma-sidebar__nav-label">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
