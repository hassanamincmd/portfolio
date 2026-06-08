import { BlogPreview } from "../components/nitro/BlogPreview";
import { TaglineRow } from "../components/nitro/TaglineRow";
import { posts } from "../data/posts";

export function BlogPage() {
  return (
    <div className="container page-hero">
      <TaglineRow>.blog</TaglineRow>
      <h1 className="page-title">notes & thinking</h1>
      <p className="page-lead">Short essays on craft, process, and building for the web.</p>

      <section className="nitro-section" style={{ paddingTop: "2.5rem", paddingBottom: 0 }}>
        <div className="blog-preview-list">
          {posts.map((post) => (
            <BlogPreview key={post.slug} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
}
