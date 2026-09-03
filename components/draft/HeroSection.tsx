import { HERO_MARQUEE_ITEMS } from "@/components/draft/marquee-items";

function MarqueeSet() {
  return (
    <div className="hero__marquee-set">
      {HERO_MARQUEE_ITEMS.map((item) => (
        <span key={item} className="hero__marquee-item">
          {item}
        </span>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__inner">
        <h1 className="hero__title">Hassan Amin</h1>

        <div className="hero__marquee" aria-hidden="true">
          <div className="hero__marquee-track">
            <MarqueeSet />
            <MarqueeSet />
          </div>
        </div>

        <div className="hero__portrait" aria-hidden="true">
          <img
            src="/assets/hero-portrait-figma5224.png"
            alt=""
            width={1579}
            height={996}
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="hero__forest" aria-hidden="true">
          <img
            src="/assets/hero-forest-figma5224.png"
            alt=""
            width={1024}
            height={1024}
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
