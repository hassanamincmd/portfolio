import {
  FigmaAboutSection,
  FigmaContactSection,
  FigmaExperienceSection,
} from "@/components/draft/FigmaSections";
import { CaseStudyCursor } from "@/components/draft/CaseStudyCursor";
import { FigmaSidebar } from "@/components/draft/FigmaSidebar";
import { FigmaWorkCards } from "@/components/draft/FigmaWorkCards";

export function DraftHeaderPreview() {
  return (
    <div className="figma-page">
      <CaseStudyCursor />
      <FigmaSidebar />
      <main className="figma-main">
        <div className="figma-stack">
          <FigmaWorkCards />
          <hr className="figma-divider" />
          <FigmaExperienceSection />
          <hr className="figma-divider" />
          <FigmaAboutSection />
          <hr className="figma-divider" />
          <FigmaContactSection />
        </div>
      </main>
    </div>
  );
}
