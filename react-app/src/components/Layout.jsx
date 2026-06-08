import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { NitroFooter } from "./nitro/NitroFooter";
import { site } from "../data/site";

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="nitro-shell">
      <header className="nitro-header">
        <div className="nitro-header__bar">
          <NavLink className="nitro-brand" to="/" onClick={() => setMenuOpen(false)}>
            {site.brand}
          </NavLink>

          <nav className="nitro-header__nav" aria-label="Primary">
            {site.nav.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? "is-active" : undefined)}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <a className="nitro-header__cta" href={site.headerCta.href}>
            {site.headerCta.label}
          </a>

          <button
            type="button"
            className="nitro-header__menu"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            menu
          </button>
        </div>

        {menuOpen ? (
          <div className="nitro-header__mobile">
            {site.nav.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="nitro-header__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <a className="nitro-header__mobile-link" href={site.headerCta.href}>
              {site.headerCta.label}
            </a>
          </div>
        ) : null}
      </header>

      <main>
        <Outlet />
      </main>

      <NitroFooter />
    </div>
  );
}
