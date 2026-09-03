function CaseStudyCta() {
  return (
    <span className="case-card__cta" aria-hidden="true">
      <svg
        className="case-card__cta-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      Case Study
    </span>
  );
}

export function WorkSection() {
  return (
    <section className="cards-section work-section" id="work" aria-labelledby="section-title-work">
      <div id="projects" className="work-anchor" aria-hidden="true" />
      <div className="container">
        <header className="section-title" id="section-title-work">
          <span className="section-title__index" aria-hidden="true">
            01
          </span>
          <div className="section-title__body">
            <h2 className="section-title__heading">Work</h2>
          </div>
        </header>

        <div className="work-block">
          <div className="work-block__group">
            <p className="work-block__label">Case studies</p>
            <div className="case-cards">
              <a
                className="case-card case-card--safety"
                href="/preview/procore-case-study/"
                data-case-card
                aria-label="Safety Hub case study — Case Study"
              >
                <img
                  className="case-card__mark"
                  src="/assets/procore-mark-figma5082.svg"
                  alt=""
                  width={245}
                  height={240}
                  decoding="async"
                />
                <div className="case-card__default" aria-hidden="true">
                  <div className="case-card__default-bg" />
                </div>
                <div className="case-card__reveal">
                  <div className="case-card__reveal-viewport">
                    <div className="case-card__reveal-inner">
                      <div className="case-card__copy">
                        <div className="case-card__wordmark-wrap">
                          <img
                            className="case-card__wordmark"
                            src="/assets/procore-wordmark-figma5248.svg"
                            alt="Procore"
                            width={117}
                            height={15}
                            decoding="async"
                          />
                        </div>
                        <h2 className="case-card__title">Safety Hub</h2>
                        <p className="case-card__lede">
                          How I helped shape the future of construction tech.
                        </p>
                        <div className="case-card__tags">
                          <span className="case-card__tag">Construction Tech</span>
                          <span className="case-card__tag">Cross Platform</span>
                          <span className="case-card__tag">Research</span>
                          <span className="case-card__tag">AI</span>
                        </div>
                      </div>
                      <div className="case-card__media">
                        <img
                          src="/assets/case-card-safety-mockup.svg"
                          alt=""
                          width={295}
                          height={640}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <CaseStudyCta />
                    </div>
                  </div>
                </div>
              </a>

              <a
                className="case-card case-card--meridian"
                href="/preview/meridian-case-study/"
                data-case-card
                aria-label="Meridian case study — Case Study"
              >
                <span className="case-card__mark">M</span>
                <div className="case-card__default" aria-hidden="true">
                  <div className="case-card__default-bg" />
                </div>
                <div className="case-card__reveal">
                  <div className="case-card__reveal-viewport">
                    <div className="case-card__reveal-inner">
                      <div className="case-card__copy">
                        <div className="case-card__wordmark-wrap">
                          <span className="case-card__wordmark-m" aria-hidden="true">
                            M
                          </span>
                          <span>eridian</span>
                        </div>
                        <h2 className="case-card__title">Super App</h2>
                        <p className="case-card__lede">
                          A multi-user, cross-platform app, calendar organization, event hosting,
                          and a lot more.
                        </p>
                        <div className="case-card__tags">
                          <span className="case-card__tag">Events</span>
                          <span className="case-card__tag">Calendar</span>
                          <span className="case-card__tag">SaaS</span>
                          <span className="case-card__tag">Team Leadership</span>
                        </div>
                      </div>
                      <div className="case-card__media">
                        <img
                          src="/assets/case-card-meridian-mockup.svg"
                          alt=""
                          width={584}
                          height={586}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <CaseStudyCta />
                    </div>
                  </div>
                </div>
              </a>

              <a
                className="case-card case-card--icancare"
                href="/preview/icancare-case-study/"
                data-case-card
                aria-label="ICan Care case study — Case Study"
              >
                <img
                  className="case-card__mark"
                  src="/assets/icancare-mark-figma5139.svg"
                  alt=""
                  width={174}
                  height={197}
                  decoding="async"
                />
                <div className="case-card__default" aria-hidden="true">
                  <div className="case-card__default-bg" />
                </div>
                <div className="case-card__reveal">
                  <div className="case-card__reveal-viewport">
                    <div className="case-card__reveal-inner">
                      <div className="case-card__copy">
                        <div className="case-card__wordmark-wrap">
                          <img
                            className="case-card__wordmark"
                            src="/assets/novartis-wordmark-figma5248.svg"
                            alt="Novartis"
                            width={168}
                            height={20}
                            decoding="async"
                          />
                        </div>
                        <h2 className="case-card__title">Icancare</h2>
                        <p className="case-card__lede">
                          An empathetic medical and care companion for cancer patients.
                        </p>
                        <div className="case-card__tags">
                          <span className="case-card__tag">Healthcare</span>
                          <span className="case-card__tag">A11y</span>
                          <span className="case-card__tag">Research</span>
                          <span className="case-card__tag">Medical</span>
                        </div>
                      </div>
                      <div className="case-card__media">
                        <img
                          src="/assets/case-card-icancare-mockup.svg"
                          alt=""
                          width={296}
                          height={640}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <CaseStudyCta />
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="work-block__group">
            <p className="work-block__label">UI work</p>
            <div className="work-ui-grid">
              <article className="work-ui-card">
                <div className="work-ui-card__thumb">
                  <img
                    src="/assets/safety-hub-p2-mobile-guess-free.webp"
                    alt="Safety Hub mobile quiz interface"
                    width={390}
                    height={844}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="work-ui-card__body">
                  <h3 className="work-ui-card__title">Safety Hub · Mobile</h3>
                  <p className="work-ui-card__meta">AI-assisted quiz flow for field crews</p>
                </div>
              </article>
              <article className="work-ui-card">
                <div className="work-ui-card__thumb">
                  <img
                    src="/assets/safety-hub-p2-web-guess-free.webp"
                    alt="Safety Hub web dashboard interface"
                    width={1440}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="work-ui-card__body">
                  <h3 className="work-ui-card__title">Safety Hub · Web</h3>
                  <p className="work-ui-card__meta">Inspection hub and drill-down patterns</p>
                </div>
              </article>
              <article className="work-ui-card">
                <div className="work-ui-card__thumb">
                  <img
                    src="/assets/meridian-card-tablet.png?v=figma5027"
                    alt="Meridian tablet scheduling interface"
                    width={745}
                    height={748}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="work-ui-card__body">
                  <h3 className="work-ui-card__title">Meridian · Tablet</h3>
                  <p className="work-ui-card__meta">Calendar views for independent pros</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
