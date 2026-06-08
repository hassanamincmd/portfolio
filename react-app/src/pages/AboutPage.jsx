import { NitroButton } from "../components/nitro/NitroButton";
import { NitroCta } from "../components/nitro/NitroCta";
import { TaglineRow } from "../components/nitro/TaglineRow";
import { ToolsList } from "../components/nitro/work/ToolsList";
import { site } from "../data/site";

export function AboutPage() {
  return (
    <>
      <div className="container page-hero">
        <TaglineRow>.about</TaglineRow>
        <h1 className="page-title">about me</h1>
      </div>

      <section className="nitro-section container about-home">
        <div className="about-home__grid">
          <div className="about-home__copy">
            <h3>{site.about.pageIntro}</h3>
            {site.about.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <NitroButton to="/contact">get in touch</NitroButton>
          </div>
          <div className="about-home__image">
            <img src={site.about.image} alt={site.about.imageAlt} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="nitro-section container">
        <TaglineRow>.tools</TaglineRow>
        <ToolsList tools={site.about.tools} />
      </section>

      <NitroCta />
    </>
  );
}
