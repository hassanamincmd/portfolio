"use client";

import { useCallback, useEffect, useState } from "react";

const SLIDE_COUNT = 5;

const BRANDS = [
  { src: "/assets/logo-novartis.png", label: "Novartis" },
  { src: "/assets/logo-petronas.png", label: "Petronas" },
  { src: "/assets/logo-vodafone.png", label: "Vodafone" },
  { src: "/assets/logo-procore.png", label: "Procore" },
  { src: "/assets/logo-cma.png", label: "Capital Market Authority" },
  { src: "/assets/logo-investview.png", label: "Investview" },
  { src: "/assets/logo-malaysia.png", label: "Ministry of Digital" },
  { src: "/assets/logo-deloitte.svg", label: "Deloitte" },
] as const;

function AboutCarousel() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const goTo = useCallback((next: number) => {
    setIndex((next + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  return (
    <div
      className="about-carousel"
      tabIndex={0}
      aria-label="Personal photo gallery"
      aria-roledescription="carousel"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goTo(index + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goTo(index - 1);
        }
      }}
    >
      <div className="about-carousel__viewport">
        <div
          className="about-carousel__track"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: reducedMotion
              ? "none"
              : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {Array.from({ length: SLIDE_COUNT }, (_, slideIndex) => (
            <figure
              key={slideIndex}
              className={`about-carousel__slide${slideIndex === index ? " is-active" : ""}`}
            >
              <span className="about-carousel__placeholder" aria-hidden="true" />
            </figure>
          ))}
        </div>
      </div>
      <div className="about-carousel__dots" role="tablist" aria-label="Choose photo">
        {Array.from({ length: SLIDE_COUNT }, (_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            className={`about-carousel__dot${dotIndex === index ? " is-active" : ""}`}
            role="tab"
            aria-selected={dotIndex === index}
            aria-label={`Photo ${dotIndex + 1}`}
            onClick={() => goTo(dotIndex)}
          />
        ))}
      </div>
    </div>
  );
}

function BrandsMarquee() {
  return (
    <div className="about-brands" aria-label="Companies I've worked with">
      <div className="brands-marquee">
        <div className="brands-marquee__track">
          {[0, 1].map((setIndex) => (
            <div
              key={setIndex}
              className="brands-marquee__set"
              aria-hidden={setIndex === 1 ? true : undefined}
            >
              {BRANDS.map((brand) => (
                <figure key={`${setIndex}-${brand.label}`} className="brands-marquee__item">
                  <div className="brands-marquee__logo">
                    <img src={brand.src} alt="" width={120} height={40} loading="lazy" decoding="async" />
                  </div>
                  <figcaption className="brands-marquee__label">{brand.label}</figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section className="section" id="about" aria-labelledby="section-title-about">
      <div className="container">
        <header className="section-title" id="section-title-about">
          <span className="section-title__index" aria-hidden="true">
            02
          </span>
          <div className="section-title__body">
            <h2 className="section-title__heading">About Me</h2>
          </div>
        </header>
        <div className="about-grid">
          <AboutCarousel />
          <div className="about__copy">
            <p className="about__intro" id="about-intro">
              A tinkerer at heart, now taking apart pixels and workflows.
            </p>
            <div className="about__body">
              <p>
                I married my best friend, and we travel together as often as we can. We are
                always trying something new: a city, a food spot, or an idea we have never done
                before.
              </p>
              <p>
                Over the last five years, I have worked with enterprises, small startups, and
                software houses around the world. That mix taught me how to move fast when it
                matters and stay thoughtful when the stakes are high.
              </p>
              <p>
                I love matcha. I even have the whisk and the whole setup. When I am not making
                tea with more care than strictly necessary, I am usually reading.
              </p>
              <p>
                I love picking up new hobbies from time to time. Right now that means soccer,
                paddle, and video games, but the list keeps growing.
              </p>
            </div>
          </div>
        </div>
      </div>
      <BrandsMarquee />
    </section>
  );
}
