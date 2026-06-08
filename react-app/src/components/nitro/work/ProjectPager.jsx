import { Link } from "react-router-dom";

export function ProjectPager({ prev, next }) {
  if (!prev && !next) return null;

  return (
    <nav className="project-pager" aria-label="Project navigation">
      {prev ? (
        <Link className="project-pager__link" to={`/work/${prev.slug}`}>
          <span className="project-pager__label">← previous</span>
          <span className="project-pager__title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="project-pager__link project-pager__link--next" to={`/work/${next.slug}`}>
          <span className="project-pager__label">next →</span>
          <span className="project-pager__title">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
