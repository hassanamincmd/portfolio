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
            <div className="figma-exp-row__head">
              <div className="figma-exp-row__logo">
                <img src={row.logo} alt="" width={80} height={80} loading="lazy" />
              </div>
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
            </div>
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
          </article>
        );
      })}
    </section>
  );
}

export function FigmaContactSection() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState<null | "email" | "linkedin" | "resume">(null);

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

  const hoverProps = (id: "email" | "linkedin" | "resume") => ({
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered((h) => (h === id ? null : h)),
    onFocus: () => setHovered(id),
    onBlur: () => setHovered((h) => (h === id ? null : h)),
  });

  const cardMotion = {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" as const },
    /* y-only lift: scale + backdrop-filter causes Chromium glass seams on siblings */
    whileHover: { y: -5 },
    whileTap: { scale: 0.985 },
  };

  return (
    <section className="figma-section figma-contact" id="contact" aria-labelledby="figma-contact-title">
      <div
        className="figma-contact__theme"
        style={{ backgroundImage: `url(${FIGMA.aboutTheme})` }}
        aria-hidden="true"
      />
      <div className="figma-contact__scrim" aria-hidden="true" />

      <div className="figma-contact__content">
        <h2 className="figma-section__title figma-contact__title" id="figma-contact-title">
          Let&apos;s Talk
        </h2>

        <div className="figma-contact__blocks" role="group" aria-label="Contact actions">
          <motion.button
            type="button"
            className={`figma-contact-block figma-contact-block--email${hovered === "email" || copied ? " is-hovered" : ""}${copied ? " is-done" : ""}`}
            onClick={copyEmail}
            aria-label={copied ? "Email address copied" : `Copy email ${CONTACT_EMAIL}`}
            aria-live="polite"
            {...hoverProps("email")}
            {...cardMotion}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          >
            <span className="figma-contact-block__icon" aria-hidden="true">
              <img src={FIGMA.contact.email} alt="" width={62} height={62} />
            </span>
            <span className="figma-contact-block__footer">
              <span className="figma-contact-block__label">{copied ? "Copied" : "Copy Email"}</span>
              <img
                className="figma-contact-block__action"
                src={FIGMA.contact.copy}
                alt=""
                width={26}
                height={26}
                aria-hidden="true"
              />
            </span>
          </motion.button>

          <motion.button
            type="button"
            className={`figma-contact-block figma-contact-block--resume${hovered === "resume" ? " is-hovered" : ""}`}
            onClick={() => setResumeOpen(true)}
            aria-label="View CV / Resume PDF"
            {...hoverProps("resume")}
            {...cardMotion}
            transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.05 }}
          >
            <span className="figma-contact-block__icon" aria-hidden="true">
              <img src={FIGMA.contact.paperclip} alt="" width={60} height={60} />
            </span>
            <span className="figma-contact-block__footer">
              <span className="figma-contact-block__label">CV / Resume</span>
              <img
                className="figma-contact-block__action"
                src={FIGMA.contact.eye}
                alt=""
                width={26}
                height={26}
                aria-hidden="true"
              />
            </span>
          </motion.button>

          <motion.a
            className={`figma-contact-block figma-contact-block--linkedin${hovered === "linkedin" ? " is-hovered" : ""}`}
            href="https://www.linkedin.com/in/hassan-mo-amin/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open LinkedIn profile"
            {...hoverProps("linkedin")}
            {...cardMotion}
            transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.1 }}
          >
            <span className="figma-contact-block__icon" aria-hidden="true">
              <img src={FIGMA.contact.linkedin} alt="" width={48} height={48} />
            </span>
            <span className="figma-contact-block__footer">
              <span className="figma-contact-block__label">LinkedIn</span>
              <img
                className="figma-contact-block__action"
                src={FIGMA.contact.arrowUpRight}
                alt=""
                width={26}
                height={26}
                aria-hidden="true"
              />
            </span>
          </motion.a>
        </div>
      </div>

      <ResumeModal open={resumeOpen} onClose={closeResume} />
    </section>
  );
}
