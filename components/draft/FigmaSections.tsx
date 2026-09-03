"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AboutStoriesGallery } from "@/components/draft/AboutStoriesGallery";
import { FIGMA } from "@/components/draft/figma-assets";
import { ResumeModal } from "@/components/draft/ResumeModal";

const CONTACT_EMAIL = "contact.hassan.amin@gmail.com";

const EXPERIENCE = [
  {
    id: "procore",
    logo: FIGMA.expProcore,
    role: "Product Designer, Procore Technologies",
    dates: "2025 - 2026",
    detail:
      "Designing Safety Hub experiences for construction teams — research, AI-assisted flows, and cross-platform patterns that keep workers safer on site.",
  },
  {
    id: "caspian",
    logo: FIGMA.expCaspian,
    role: "Senior UI/UX Designer, Caspian Digital Solutions",
    dates: "2022 - 2025",
    detail:
      "Led end-to-end product design for enterprise and startup clients — from discovery workshops through high-fidelity systems and handoff.",
  },
  {
    id: "spiritude",
    logo: FIGMA.expSpiritude,
    role: "UI/UX Designer, Spiritude LTD",
    dates: "2021 - 2022",
    detail:
      "Shipped web and mobile interfaces across healthcare and B2B products, pairing tight iteration cycles with clear design documentation.",
  },
] as const;

const STORIES = [
  {
    title: "Married my best friend, and we keep exploring",
    body: "I married my best friend, and we travel together as often as we can. We're always trying something new: a city, a food spot, or an idea we've never done before.",
  },
  {
    title: "Five years designing across the globe",
    body: "Over the last five years, I've worked with enterprises, small startups, and software houses around the world. That mix taught me how to move fast when it matters and stay thoughtful when the stakes are high.",
  },
  {
    title: "Matcha obsessive, book in hand",
    body: "I love matcha, I even have the whisk and the whole setup. When I'm not making tea with more care than strictly necessary, I'm usually reading.",
  },
  {
    title: "Soccer, paddle, games, and whatever's next",
    body: "I love picking up new hobbies from time to time. Right now that means soccer, paddle, and video games, but the list keeps growing.",
  },
] as const;

export function FigmaAboutSection() {
  return (
    <section className="figma-section" id="about" aria-labelledby="figma-about-title">
      <h2 className="figma-section__title" id="figma-about-title">
        About Me
      </h2>
      <div className="figma-about-grid">
        <motion.div
          className="figma-about-media"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <AboutStoriesGallery />
        </motion.div>

        <div className="figma-about-stories">
          {STORIES.map((story, index) => (
            <motion.article
              key={story.title}
              className="figma-about-story"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
            >
              <h3>{story.title}</h3>
              <p>{story.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FigmaExperienceSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="figma-section" id="experience" aria-labelledby="figma-exp-title">
      <h2 className="figma-section__title" id="figma-exp-title">
        Experience
      </h2>
      {EXPERIENCE.map((row) => {
        const open = openId === row.id;
        return (
          <article key={row.id} className={`figma-exp-row${open ? " is-open" : ""}`}>
            <div className="figma-exp-row__logo">
              <img src={row.logo} alt="" width={80} height={80} loading="lazy" />
            </div>
            <div className="figma-exp-row__body">
              <button
                type="button"
                className="figma-exp-row__toggle"
                aria-expanded={open}
                aria-controls={`exp-detail-${row.id}`}
                onClick={() => setOpenId(open ? null : row.id)}
              >
                <span className="figma-exp-row__copy">
                  <h3 className="figma-exp-row__role">{row.role}</h3>
                  <p className="figma-exp-row__dates">{row.dates}</p>
                </span>
                <span className="figma-exp-row__icon" aria-hidden="true">
                  {open ? "−" : "+"}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    id={`exp-detail-${row.id}`}
                    className="figma-exp-row__detail"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <p>{row.detail}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export function FigmaContactSection() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const closeResume = useCallback(() => setResumeOpen(false), []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy email address:", CONTACT_EMAIL);
    }
  }, []);

  return (
    <section className="figma-section figma-contact" id="contact" aria-labelledby="figma-contact-title">
      <h2 className="figma-section__title" id="figma-contact-title">
        Let&apos;s Talk
      </h2>

      <div className="figma-contact__panel">
        <div className="figma-contact__intro">
          <p className="figma-contact__headline">
            Got a product challenge? Let&apos;s figure it out together.
          </p>
          <p className="figma-contact__lede">
            Open to full-time roles and select freelance work. Design leadership, critical flows,
            or a quick compare-notes chat — I&apos;m easy to reach.
          </p>
          <ul className="figma-contact__points">
            <li>Product design &amp; design systems</li>
            <li>Research-backed UX for complex flows</li>
            <li>Remote-friendly, async-first collaboration</li>
          </ul>
        </div>

        <div className="figma-contact__actions">
          <button
            type="button"
            className="figma-contact__primary"
            onClick={copyEmail}
            aria-live="polite"
          >
            <span className="figma-contact__primary-meta">
              <span className="figma-contact__primary-label">
                {copied ? "Copied!" : "Copy Email"}
              </span>
              <span className="figma-contact__primary-value">{CONTACT_EMAIL}</span>
            </span>
            <span className="figma-contact__arrow" aria-hidden="true">
              {copied ? "✓" : "↗"}
            </span>
          </button>

          <a
            className="figma-contact__link"
            href="https://www.linkedin.com/in/hassan-mo-amin/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="figma-contact__link-label">LinkedIn</span>
            <span className="figma-contact__link-value">/hassan-mo-amin</span>
            <span className="figma-contact__arrow" aria-hidden="true">
              ↗
            </span>
          </a>

          <button
            type="button"
            className="figma-contact__link"
            onClick={() => setResumeOpen(true)}
          >
            <span className="figma-contact__link-label">CV / Resume</span>
            <span className="figma-contact__link-value">View resume</span>
            <span className="figma-contact__arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        </div>
      </div>

      <ResumeModal open={resumeOpen} onClose={closeResume} />
    </section>
  );
}
