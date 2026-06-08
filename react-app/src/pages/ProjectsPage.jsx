import { StickyProjectStack } from "../components/nitro/StickyProjectStack";
import { TaglineRow } from "../components/nitro/TaglineRow";
import { projects } from "../data/projects";

export function ProjectsPage() {
  return (
    <>
      <div className="container page-hero">
        <TaglineRow>.projects</TaglineRow>
        <h1 className="page-title">selected work</h1>
        <p className="page-lead">Case studies, brand work, and product design explorations.</p>
      </div>

      <StickyProjectStack projects={projects} />
    </>
  );
}
