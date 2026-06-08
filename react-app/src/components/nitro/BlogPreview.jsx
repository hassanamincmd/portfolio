import { Link } from "react-router-dom";

export function BlogPreview({ slug, title, date, image }) {
  return (
    <Link className="blog-preview" to={`/blog/${slug}`}>
      <div className="blog-preview__image">
        {image ? (
          <img src={image} alt="" loading="lazy" />
        ) : (
          <div className="blog-preview__placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="blog-preview__body">
        <h3 className="blog-preview__title">{title}</h3>
        <time className="blog-preview__date" dateTime={date}>
          {date}
        </time>
      </div>
    </Link>
  );
}
