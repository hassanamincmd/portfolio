import { Link, useParams } from "react-router-dom";
import { NitroCta } from "../components/nitro/NitroCta";
import { TaglineRow } from "../components/nitro/TaglineRow";
import { CaseData } from "../components/nitro/work/CaseData";
import { ProcessSteps } from "../components/nitro/work/ProcessSteps";
import { ProjectPager } from "../components/nitro/work/ProjectPager";
import { ToolsList } from "../components/nitro/work/ToolsList";
import { WorkGallery } from "../components/nitro/work/WorkGallery";
import { getProject, getProjectNeighbors } from "../data/projects";

export function WorkPage() {
  const { slug } = useParams();
  const project = getProject(slug);
  const { prev, next } = getProjectNeighbors(slug);

  if (!project) {
    return (
      <div className="container page-hero">
        <TaglineRow>.404</TaglineRow>
        <h1 className="page-title">project not found</h1>
        <Link className="nitro-button" to="/projects">
          back to projects
        </Link>
      </div>
    );
  }

  return (
    <article className="work-page">
      <header
        className="work-hero"
        style={{ "--work-bg": project.bg, "--work-fg": project.fg }}
      >
        <div className="work-hero__media">
          <img src={project.image} alt="" />
        </div>
        <div className="container work-hero__content">
          <TaglineRow>.work</TaglineRow>
          <h1 className="work-hero__title">{project.title}</h1>
          <p className="work-hero__type">
            {project.projectType} · {project.year}
          </p>
        </div>
      </header>

      <div className="container work-body">
        <section className="work-section">
          <CaseData
            client={project.client}
            year={project.year}
            role={project.role}
            services={project.services}
          />
        </section>

        <section className="work-section">
          <TaglineRow>.overview</TaglineRow>
          <p className="work-intro">{project.intro}</p>
        </section>

        <section className="work-section">
          <TaglineRow>.gallery</TaglineRow>
          <WorkGallery images={project.gallery} />
        </section>

        <section className="work-section">
          <TaglineRow>.process</TaglineRow>
          <ProcessSteps steps={project.process} />
        </section>

        <section className="work-section">
          <TaglineRow>.tools</TaglineRow>
          <ToolsList tools={project.tools} />
        </section>

        <ProjectPager prev={prev} next={next} />
      </div>

      <NitroCta />
    </article>
  );
}
