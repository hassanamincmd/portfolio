import { Link } from "react-router-dom";

export function NitroButton({ children, to, href, external = false }) {
  const className = "nitro-button";

  if (to) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        className={className}
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return <span className={className}>{children}</span>;
}
