import Image from "next/image";
import DigitalTwin from "./components/digital-twin";

const highlights = [
  { value: "650K+", label: "users supported through Auth0 flows" },
  { value: "7", label: "tenant organizations secured" },
  { value: "1000+", label: "hours of immersive engineering work" },
  { value: "PhD", label: "electrochemistry research background" }
];

const skills = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Auth0",
  "MFA",
  "REST APIs",
  "Docker",
  "CI/CD",
  "Jest",
  "Cypress",
  "AI-assisted development"
];

const timeline = [
  {
    period: "2010 - 2016",
    role: "Ph.D. in Electrochemistry",
    org: "University of Southern California",
    detail:
      "Built the analytical discipline behind the engineering mindset: research, experimentation, durable documentation, and high-stakes problem solving."
  },
  {
    period: "2016 - 2018",
    role: "Battery Engineer",
    org: "Staq Energy",
    detail:
      "Designed and tested high-efficiency battery electrode materials, analyzed performance data, and translated complex findings for technical teams."
  },
  {
    period: "2021",
    role: "Advanced Software Engineering Immersive",
    org: "Hack Reactor",
    detail:
      "Completed a 13-week, 1000+ hour full-stack program spanning JavaScript, React, Express, PostgreSQL, MongoDB, MySQL, and Agile delivery."
  },
  {
    period: "2022 - 2025",
    role: "Full-Stack Software Engineer",
    org: "Remine",
    detail:
      "Owned authentication, MFA, password rotation, customizable dashboards, themes, automated tests, and production fixes across a multi-tenant SaaS platform."
  }
];

const proof = [
  {
    title: "Enterprise Authentication",
    kicker: "Security systems",
    detail:
      "Auth0-based login flows, MFA, password rotation, and multi-tenant controls that strengthened reliability and compliance."
  },
  {
    title: "Adaptive Product UX",
    kicker: "Frontend systems",
    detail:
      "Custom dashboards, light and dark themes, accessible interface behavior, and collaboration with product, design, and QA."
  },
  {
    title: "Scalable Backend Work",
    kicker: "Systems thinking",
    detail:
      "REST APIs, query tuning from seconds to milliseconds, ETL work across 10M+ records, Docker, AWS EC2, and stress testing."
  }
];

const portfolio = [
  {
    title: "Security Case Study",
    status: "Coming soon",
    detail:
      "A future deep dive into authentication design, MFA rollout, tenant boundaries, and production reliability."
  },
  {
    title: "SaaS Dashboard System",
    status: "Coming soon",
    detail:
      "A future product story covering theming, personalization, accessibility, and fast team delivery."
  },
  {
    title: "Research To Engineering",
    status: "Coming soon",
    detail:
      "A future narrative connecting electrochemistry, experimental rigor, and software architecture."
  }
];

export default function Home() {
  return (
    <main>
      <nav className="nav-shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Phong Trinh home">
          PT
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#journey">Journey</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#twin">Digital Twin</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section id="top" className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="signal" />
            Denver Metropolitan Area
          </div>
          <h1>Phong Trinh</h1>
          <p className="title-line">
            Full-stack software engineer building secure SaaS systems with
            front-end polish, backend discipline, and research-grade rigor.
          </p>
          <p className="hero-text">
            I came to software through electrochemistry, where unreliable tools
            made the cost of poor software painfully clear. Today I build the
            opposite: secure, scalable, human-centered products with React,
            TypeScript, Node.js, and a bias for production reliability.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#portfolio">
              View portfolio
            </a>
          </div>
        </div>

        <div className="portrait-zone" aria-label="Phong Trinh portrait">
          <div className="portrait-frame">
            <Image
              src="/phong-trinh.jpeg"
              alt="Phong Trinh"
              width={1280}
              height={911}
              priority
            />
          </div>
          <div className="credential-strip">
            <span>React</span>
            <span>Auth0</span>
            <span>Node</span>
            <span>SaaS</span>
          </div>
        </div>
      </section>

      <section className="metrics-band" aria-label="Career highlights">
        {highlights.map((item) => (
          <div className="metric" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section id="about" className="section split">
        <div>
          <p className="section-label">About</p>
          <h2>Engineering with the patience of a scientist and the edge of a product builder.</h2>
        </div>
        <div className="prose">
          <p>
            My path is nontraditional in the best way. Before software, I worked
            with lab instruments, energy storage systems, experiments, and data.
            That taught me how to isolate variables, communicate clearly, and
            keep going when the first answer is wrong.
          </p>
          <p>
            At Remine, I brought that mindset into full-stack engineering:
            authentication, security features, tenant-aware workflows,
            customizable dashboards, automated testing, and production debugging
            across remote Agile teams.
          </p>
        </div>
      </section>

      <section className="section proof-grid" aria-label="Selected strengths">
        {proof.map((item) => (
          <article className="proof-card" key={item.title}>
            <p>{item.kicker}</p>
            <h3>{item.title}</h3>
            <span>{item.detail}</span>
          </article>
        ))}
      </section>

      <section id="twin" className="section twin-section">
        <div className="twin-intro">
          <p className="section-label">Digital Twin</p>
          <h2>Ask about the work behind the resume.</h2>
          <p>
            Explore Phong&apos;s engineering background, systems work, career
            journey, and approach to building secure product experiences.
          </p>
          <div className="twin-notes" aria-label="Digital Twin focus areas">
            <span>Career journey</span>
            <span>Technical depth</span>
            <span>Product mindset</span>
          </div>
        </div>
        <DigitalTwin />
      </section>

      <section id="journey" className="section">
        <div className="section-heading">
          <p className="section-label">Career Journey</p>
          <h2>From electrochemical systems to production software systems.</h2>
        </div>
        <div className="timeline">
          {timeline.map((item) => (
            <article className="timeline-item" key={`${item.period}-${item.role}`}>
              <time>{item.period}</time>
              <div>
                <h3>{item.role}</h3>
                <p className="org">{item.org}</p>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section stack-section">
        <div className="section-heading">
          <p className="section-label">Toolbox</p>
          <h2>Modern full-stack range, with a security-first center of gravity.</h2>
        </div>
        <div className="skill-cloud" aria-label="Technical skills">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section id="portfolio" className="section portfolio-section">
        <div className="section-heading">
          <p className="section-label">Portfolio</p>
          <h2>Prepared for future case studies.</h2>
        </div>
        <div className="portfolio-grid">
          {portfolio.map((item) => (
            <article className="portfolio-card" key={item.title}>
              <div>
                <span>{item.status}</span>
                <h3>{item.title}</h3>
              </div>
              <p>{item.detail}</p>
              <a href="#contact" aria-label={`Discuss ${item.title}`}>
                Discuss this work
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div>
          <p className="section-label">Contact</p>
          <h2>Ready for secure, polished, production-minded product work.</h2>
        </div>
        <div className="contact-actions">
          <a href="mailto:thanhphongus@gmail.com">thanhphongus@gmail.com</a>
          <a href="https://www.linkedin.com/in/phongtrinh/">LinkedIn</a>
          <a href="https://github.com/ThanhPhongUSC">GitHub</a>
        </div>
      </section>
    </main>
  );
}
