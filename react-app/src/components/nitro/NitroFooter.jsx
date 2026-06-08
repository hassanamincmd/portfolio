import { NavLink } from "react-router-dom";
import { site } from "../../data/site";

export function NitroFooter() {
  return (
    <footer className="nitro-footer">
      <div className="nitro-container nitro-footer__grid">
        <div className="nitro-footer__brand">
          <span className="nitro-brand">{site.domain}</span>
          <p className="nitro-footer__copy">
            © {new Date().getFullYear()} {site.name} Amin
          </p>
        </div>

        <nav className="nitro-footer__nav" aria-label="Footer">
          {site.nav.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nitro-footer__social">
          <a href={site.social.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
          <a href={site.social.behance} target="_blank" rel="noreferrer">
            behance
          </a>
          <a href={`mailto:${site.email}`}>email</a>
        </div>
      </div>
    </footer>
  );
}
