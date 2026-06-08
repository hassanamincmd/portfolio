import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CardArrow } from "./CardArrow";

export function StickyProjectCard({
  slug,
  title,
  projectType,
  year,
  bg,
  fg,
  image,
  index,
  scale = 1
}) {
  return (
    <motion.article
      className="nitro-card"
      style={{
        "--card-bg": bg,
        "--card-fg": fg,
        scale
      }}
    >
      <Link className="nitro-card__link" to={`/work/${slug}`}>
        <header className="nitro-card__header">
          <span className="nitro-card__year">{year}</span>
          <span className="nitro-card__type">{projectType}</span>
        </header>

        <span className="nitro-card__rule" aria-hidden="true" />

        <div className="nitro-card__title-row">
          <h2 className="nitro-card__title">{title}</h2>
          <CardArrow />
        </div>

        <div className="nitro-card__media" aria-hidden="true">
          {image ? <img src={image} alt="" loading={index === 0 ? "eager" : "lazy"} /> : null}
        </div>
      </Link>
    </motion.article>
  );
}
