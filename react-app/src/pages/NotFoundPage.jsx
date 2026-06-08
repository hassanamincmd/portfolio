import { Link } from "react-router-dom";
import { TaglineRow } from "../components/nitro/TaglineRow";

export function NotFoundPage() {
  return (
    <div className="container page-hero">
      <TaglineRow>.404</TaglineRow>
      <h1 className="page-title">page not found</h1>
      <p className="page-lead">The page you're looking for doesn't exist or has moved.</p>
      <Link className="nitro-button" to="/">
        back home
      </Link>
    </div>
  );
}
