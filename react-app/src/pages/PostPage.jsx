import { Link, useParams } from "react-router-dom";
import { NitroCta } from "../components/nitro/NitroCta";
import { TaglineRow } from "../components/nitro/TaglineRow";
import { getPost } from "../data/posts";

export function PostPage() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="container page-hero">
        <TaglineRow>.404</TaglineRow>
        <h1 className="page-title">post not found</h1>
        <Link className="nitro-button" to="/blog">
          back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="post-page">
      <header className="post-hero container">
        <TaglineRow>.blog</TaglineRow>
        <h1 className="page-title">{post.title}</h1>
        <time className="post-hero__date" dateTime={post.date}>
          {post.date}
        </time>
        {post.image ? (
          <div className="post-hero__image">
            <img src={post.image} alt="" />
          </div>
        ) : null}
      </header>

      <div className="container post-body">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <Link className="nitro-button" to="/blog">
          ← all posts
        </Link>
      </div>

      <NitroCta />
    </article>
  );
}
