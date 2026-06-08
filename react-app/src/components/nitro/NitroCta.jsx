import { site } from "../../data/site";
import { NitroButton } from "./NitroButton";
import { TaglineRow } from "./TaglineRow";

export function NitroCta({ label = site.cta.label, headline = site.cta.headline }) {
  return (
    <section className="nitro-cta nitro-container">
      <TaglineRow>{label}</TaglineRow>
      <h2 className="nitro-cta__headline">{headline}</h2>
      <div className="nitro-cta__actions">
        <NitroButton href={`mailto:${site.email}`}>contact me</NitroButton>
        <NitroButton href={site.social.linkedin} external>
          linkedin
        </NitroButton>
      </div>
    </section>
  );
}
