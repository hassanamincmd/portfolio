const EXPERIENCE = [
  {
    logo: "/assets/logo-procore.png",
    role: "Product Designer, Procore Technologies",
    dates: "2025 – 2026",
  },
  {
    logo: "/assets/logo-cma.png",
    role: "Senior UI/UX Designer, Caspian Digital Solutions",
    dates: "2022 – 2025",
  },
  {
    logo: "/assets/logo-investview.png",
    role: "UI/UX Designer, Spiritude LTD",
    dates: "2021 – 2022",
  },
] as const;

export function ExperienceSection() {
  return (
    <section className="experience-section" id="experience" aria-labelledby="section-title-experience">
      <div className="container">
        <header className="section-title" id="section-title-experience">
          <span className="section-title__index" aria-hidden="true">
            03
          </span>
          <div className="section-title__body">
            <h2 className="section-title__heading">Experience</h2>
          </div>
        </header>

        <div className="experience-list">
          {EXPERIENCE.map((item) => (
            <article key={item.role} className="experience-row">
              <div className="experience-row__logo">
                <img src={item.logo} alt="" width={56} height={56} loading="lazy" decoding="async" />
              </div>
              <div>
                <h3 className="experience-row__role">{item.role}</h3>
                <p className="experience-row__dates">{item.dates}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
