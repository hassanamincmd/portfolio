"use client";

import { FIGMA } from "@/components/draft/figma-assets";
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

const spring = { type: "spring" as const, stiffness: 320, damping: 24 };

function ComingSoonBadge() {
  return (
    <span className="figma-card-sm__badge" aria-hidden="true">
      Coming Soon
    </span>
  );
}

function CaseStudyCta() {
  return (
    <span className="figma-case-card__cta" aria-hidden="true">
      <svg
        className="figma-case-card__cta-icon"
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
      Case Study
    </span>
  );
}

/** Large cards → published case studies */
const LARGE = [
  {
    id: "safety",
    href: "/preview/procore-case-study/",
    studyLabel: "Procore Safety Hub case study",
    variant: "figma-case-card--safety",
    brand: (
      <div className="figma-case-card__brand figma-case-card__brand--procore">
        <img src={FIGMA.procoreWordmark} alt="Procore" width={117} height={15} />
      </div>
    ),
    title: "Safety Hub",
    lede: "How I helped shape the future of construction tech.",
    tags: ["Construction Tech", "Cross Platform", "Research", "AI"],
    mockup: FIGMA.mockupSafety,
    mockupW: 326,
    mockupH: 704,
  },
  {
    id: "meridian",
    href: "/preview/meridian-case-study/",
    studyLabel: "Meridian Super App case study",
    variant: "figma-case-card--meridian",
    brand: (
      <p className="figma-case-card__brand">
        <span className="figma-case-card__brand-m">M</span>eridian
      </p>
    ),
    title: "Super App",
    lede: "I led design for Meridian, focusing on calendar organization and smart booking.",
    tags: ["Events", "Calendar", "SaaS", "Team Leadership"],
    mockup: FIGMA.mockupMeridian,
    mockupW: 569,
    mockupH: 516,
  },
  {
    id: "icancare",
    href: "/preview/icancare-case-study/",
    studyLabel: "ICan Care case study",
    variant: "figma-case-card--icancare",
    brand: (
      <div className="figma-case-card__brand figma-case-card__brand--novartis">
        <img src={FIGMA.novartisWordmark} alt="Novartis" width={168} height={20} />
      </div>
    ),
    title: "Icancare",
    lede:
      "Articles, reminders, and provider listings for patients and caregivers, with secure feedback for analytics.",
    tags: ["Healthcare", "A11y", "Research", "Medical"],
    mockup: FIGMA.mockupIcancare,
    mockupW: 326,
    mockupH: 704,
  },
] as const;

type HoverCardProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  "aria-label"?: string;
  "data-case-card"?: boolean;
};

/** Controlled hover so scroll-away clears lift (Framer whileHover sticks otherwise). */
function HoverCard({ children, className, href, ...rest }: HoverCardProps) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const clear = () => setHovered(false);
    window.addEventListener("scroll", clear, { passive: true });
    return () => window.removeEventListener("scroll", clear);
  }, []);

  const shared = {
    className,
    initial: { opacity: 0, y: 20, scale: 1 },
    animate: {
      opacity: 1,
      y: hovered ? -5 : 0,
      scale: hovered ? 1.03 : 1,
    },
    transition: spring,
    onHoverStart: () => setHovered(true),
    onHoverEnd: () => setHovered(false),
    onBlur: () => setHovered(false),
  };

  if (href) {
    return (
      <motion.a href={href} {...shared} {...rest}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div {...shared} {...rest}>
      {children}
    </motion.div>
  );
}

export function FigmaWorkCards() {
  useEffect(() => {
    let timer = 0;
    const onScroll = () => {
      document.documentElement.classList.add("is-scrolling");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 140);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      document.documentElement.classList.remove("is-scrolling");
    };
  }, []);

  return (
    <section id="work" className="figma-work" aria-label="Work">
      {LARGE.map((item) => (
        <HoverCard
          key={item.id}
          href={item.href}
          className={`figma-case-card group ${item.variant}`}
          data-case-card
          aria-label={item.studyLabel}
        >
          <div className="figma-case-card__copy">
            {item.brand}
            <h2 className="figma-case-card__title">{item.title}</h2>
            <p className="figma-case-card__lede">{item.lede}</p>
            <div className="figma-case-card__tags">
              {item.tags.map((tag) => (
                <span key={tag} className="figma-case-card__tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="figma-case-card__media">
            <img
              src={item.mockup}
              alt=""
              width={item.mockupW}
              height={item.mockupH}
              loading="lazy"
            />
          </div>
          <CaseStudyCta />
        </HoverCard>
      ))}

      <div className="figma-work-row-sm" aria-label="Featured work">
        <HoverCard className="figma-card-sm figma-card-sm--rings group">
          <div className="figma-card-sm__inner">
            <img
              className="figma-card-sm__rings"
              src={FIGMA.cardRings}
              alt=""
              width={388}
              height={388}
            />
            <div className="figma-card-sm__dots" aria-hidden="true">
              {FIGMA.dots.map((src) => (
                <img key={src} src={src} alt="" width={20} height={20} />
              ))}
            </div>
          </div>
          <ComingSoonBadge />
        </HoverCard>

        <HoverCard className="figma-card-sm figma-card-sm--cover group">
          <img
            src={FIGMA.cardMalaysia}
            alt="Malaysia coat of arms"
            className="figma-card-sm__cover-img"
          />
          <ComingSoonBadge />
        </HoverCard>

        <HoverCard className="figma-card-sm figma-card-sm--cover group">
          <img
            src={FIGMA.cardComingSoon}
            alt="Coming soon"
            className="figma-card-sm__cover-img"
          />
          <ComingSoonBadge />
        </HoverCard>
      </div>
    </section>
  );
}
