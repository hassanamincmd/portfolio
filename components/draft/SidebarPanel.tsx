"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SIDEBAR_MARQUEE = ["UI/UX", "Prototyping", "Hassan Amin"] as const;

const SIDEBAR_LOGOS = [
  "/assets/logo-deloitte.svg",
  "/assets/logo-vodafone.png",
  "/assets/logo-cma.png",
  "/assets/logo-novartis.png",
  "/assets/logo-procore.png",
  "/assets/logo-investview.png",
  "/assets/logo-petronas.png",
  "/assets/logo-malaysia.png",
  "/assets/logo-deloitte.svg",
  "/assets/logo-procore.png",
] as const;

const NAV = [
  { href: "#work", label: ">Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About Me" },
  { href: "#contact", label: "Let's Talk" },
] as const;

export function SidebarPanel() {
  const [activeHref, setActiveHref] = useState("#work");

  useEffect(() => {
    type SectionRef = { href: (typeof NAV)[number]["href"]; el: Element };

    const sections = NAV.map(({ href }) => ({
      href,
      el: document.querySelector(href),
    })).filter((item): item is SectionRef => item.el instanceof Element);

    const onScroll = () => {
      let current = sections[0]?.href ?? "#work";
      for (const section of sections) {
        const rect = section.el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.35) {
          current = section.href;
        }
      }
      setActiveHref(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside className="figma-sidebar" aria-label="Site navigation">
      <div className="figma-sidebar__scene">
        <div className="figma-sidebar__portrait">
          <img
            src="/assets/hero-portrait-figma5224.png"
            alt=""
            width={329}
            height={300}
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="figma-sidebar__forest" aria-hidden="true">
          <img src="/assets/hero-forest-figma5224.png" alt="" width={612} height={177} decoding="async" />
        </div>
      </div>

      <h1 className="figma-sidebar__title">Hassan Amin</h1>
      <p className="figma-sidebar__tagline">
        A product and UI/UX designer with 5 years of experience across enterprises, startups, and
        software houses around the globe.
      </p>

      <nav className="figma-sidebar__nav" aria-label="Primary">
        {NAV.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={activeHref === href ? "is-active" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="figma-sidebar__marquee" aria-hidden="true">
        <div className="figma-sidebar__marquee-track">
          {[0, 1].map((setIndex) => (
            <div key={setIndex} className="figma-sidebar__marquee-set">
              {SIDEBAR_MARQUEE.map((item) => (
                <span key={`${setIndex}-${item}`} className="figma-sidebar__marquee-item">
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="figma-sidebar__logos" aria-label="Companies">
        {SIDEBAR_LOGOS.map((src, index) => (
          <div key={`${src}-${index}`} className="figma-sidebar__logo">
            <img src={src} alt="" width={48} height={48} loading="lazy" decoding="async" />
          </div>
        ))}
      </div>

      <footer className="figma-sidebar__footer">
        <span>hassanamin.net © 2026</span>
        <div className="figma-sidebar__social">
          <a href="https://www.linkedin.com/in/hassan-mo-amin/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="mailto:contact.hassan.amin@gmail.com">Email</a>
        </div>
      </footer>
    </aside>
  );
}
