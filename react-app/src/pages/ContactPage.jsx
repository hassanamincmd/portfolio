import { NitroButton } from "../components/nitro/NitroButton";
import { NitroCta } from "../components/nitro/NitroCta";
import { TaglineRow } from "../components/nitro/TaglineRow";
import { site } from "../data/site";

export function ContactPage() {
  return (
    <>
      <div className="container page-hero">
        <TaglineRow>.contact</TaglineRow>
        <h1 className="page-title">contact</h1>
      </div>

      <NitroCta />

      <section className="nitro-section container">
        <div className="nitro-cta__actions">
          <NitroButton href={`mailto:${site.email}`}>email me</NitroButton>
          <NitroButton href={site.social.linkedin} external>
            linkedin
          </NitroButton>
          <NitroButton href={site.social.behance} external>
            behance
          </NitroButton>
          <NitroButton href={site.social.resume} external>
            resume/cv
          </NitroButton>
        </div>
      </section>
    </>
  );
}
