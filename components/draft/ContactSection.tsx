export function ContactSection() {
  return (
    <div className="page-closer">
      <div className="page-closer__art" aria-hidden="true">
        <img
          src="/assets/footer-pixel.png"
          alt=""
          width={6060}
          height={2202}
          loading="lazy"
          decoding="async"
        />
      </div>

      <section className="lets-talk" id="contact" aria-labelledby="section-title-contact">
        <div className="container">
          <header className="section-title section-title--on-dark" id="section-title-contact">
          <span className="section-title__index" aria-hidden="true">
            04
          </span>
            <div className="section-title__body">
              <h2 className="section-title__heading">Let&apos;s Talk</h2>
            </div>
          </header>
          <div className="lets-talk__inner">
            <div className="lets-talk__copy">
              <p className="lets-talk__headline" id="contact-headline">
                Got a product challenge? Let&apos;s figure it out together.
              </p>
              <p className="lets-talk__lede">
                Open to full-time roles and freelance partnerships. Whether you need a design
                lead, a product designer for a critical flow, or just want to compare notes, I
                am easy to reach.
              </p>
            </div>
            <div className="lets-talk__actions">
              <a className="lets-talk__primary" href="mailto:contact.hassan.amin@gmail.com">
                <span>
                  <span className="lets-talk__primary-label">Email</span>
                  <span className="lets-talk__primary-value">contact.hassan.amin@gmail.com</span>
                </span>
                <svg
                  className="lets-talk__arrow"
                  width="20"
                  height="20"
                  viewBox="0 0 22 22"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 17L17 5M17 5H7M17 5V15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                className="lets-talk__link"
                href="https://www.linkedin.com/in/hassan-mo-amin/"
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <span className="lets-talk__link-label">LinkedIn</span>
                  linkedin.com/in/hassan-mo-amin
                </span>
                <svg
                  className="lets-talk__arrow"
                  width="18"
                  height="18"
                  viewBox="0 0 22 22"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 17L17 5M17 5H7M17 5V15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__content">
          <div className="footer__grid">
            <div>
              <span className="footer__brand">hassanamin.net</span>
              <p className="footer__copy">&copy; 2026 Hassan Amin</p>
            </div>
            <nav className="footer__nav" aria-label="Footer">
              <a href="#work">Work</a>
              <a href="#about">About</a>
              <a href="#contact">Let&apos;s Talk</a>
            </nav>
            <div className="footer__social">
              <a
                href="https://www.linkedin.com/in/hassan-mo-amin/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a href="mailto:contact.hassan.amin@gmail.com">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
