import { Link } from "react-router-dom";
import { BlogPreview } from "../components/nitro/BlogPreview";
import { HeadingCycler } from "../components/nitro/HeadingCycler";
import { NitroButton } from "../components/nitro/NitroButton";
import { NitroCta } from "../components/nitro/NitroCta";
import { StickyProjectStack } from "../components/nitro/StickyProjectStack";
import { TaglineRow } from "../components/nitro/TaglineRow";
import { posts } from "../data/posts";
import { projects } from "../data/projects";
import { site } from "../data/site";

export function HomePage() {
  return (
    <>
      <section className="nitro-hero">
        <div className="nitro-container nitro-hero__inner">
          <div className="nitro-hero__meta">
            <p className="nitro-hero__greeting">{site.hero.greeting}</p>
            <span className="nitro-hero__dot" aria-hidden="true">
              <span className="nitro-hero__dot-core" />
            </span>
            <p className="nitro-hero__availability">{site.availability}</p>
          </div>

          <HeadingCycler
            prefix={site.hero.prefix}
            words={site.hero.words}
            interval={site.hero.interval}
            animationDuration={site.hero.animationDuration}
          />
        </div>
      </section>

      <StickyProjectStack projects={projects} />

      <section className="nitro-section">
        <div className="nitro-container about-home">
          <div className="about-home__grid">
            <div className="about-home__copy">
              <TaglineRow>.about</TaglineRow>
              <h3>{site.about.homeTagline}</h3>
              <NitroButton to="/about">about me</NitroButton>
            </div>
            <div className="about-home__image">
              <img src={site.about.image} alt={site.about.imageAlt} loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="nitro-section">
        <div className="nitro-container">
          <div className="nitro-section__head">
            <TaglineRow>.three latest notes</TaglineRow>
            <Link className="link-arrow" to="/blog">
              visit blog →
            </Link>
          </div>
          <div className="blog-preview-list">
            {posts.slice(0, 3).map((post) => (
              <BlogPreview key={post.slug} {...post} />
            ))}
          </div>
        </div>
      </section>

      <NitroCta />
    </>
  );
}
