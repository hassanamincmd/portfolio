export function TaglineRow({ children }) {
  return (
    <div className="tagline-row">
      <span className="tagline-row__label">{children}</span>
      <span className="tagline-row__line" aria-hidden="true" />
    </div>
  );
}
