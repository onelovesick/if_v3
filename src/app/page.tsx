import ConstructionScene from "@/components/ConstructionScene";
import styles from "./page.module.css";

const HERO_SIGNALS = [
  "Common data environment",
  "Model coordination",
  "Field reporting",
  "Asset-ready handover",
];

const HERO_STATS = [
  {
    value: "01",
    label: "connected delivery thread across engineering, construction, and owner teams",
  },
  {
    value: "3D",
    label: "project context layered with models, documents, and live delivery signals",
  },
  {
    value: "ISO 19650",
    label: "information structure that keeps control, traceability, and accountability visible",
  },
];

const SERVICES = [
  {
    index: "01",
    title: "Digital delivery strategy for capital projects",
    text: "We define how information should move from design to site to handover so the digital setup supports delivery instead of slowing it down.",
    bullets: [
      "Delivery operating model and information governance",
      "CDE structure, naming logic, approval flows, and role mapping",
      "Package sequencing aligned with real project milestones",
    ],
  },
  {
    index: "02",
    title: "Engineering and construction coordination systems",
    text: "We connect models, drawings, RFIs, technical queries, constraints, and field feedback into a single readable layer for the teams making decisions.",
    bullets: [
      "Federated model and document coordination",
      "Issue management connected to package status and constraints",
      "Dashboards that show what is blocked, exposed, and ready",
    ],
  },
  {
    index: "03",
    title: "Structured handover and asset information delivery",
    text: "We help teams leave the project with usable operational data, not a last-minute scramble of disconnected files and spreadsheets.",
    bullets: [
      "Asset data templates and information requirements",
      "Progressive verification before turnover",
      "Owner-ready digital records and closeout packs",
    ],
  },
];

const PHASES = [
  {
    number: "01",
    title: "Frame the delivery logic",
    meta: "Mobilization",
    text: "We map packages, decision gates, review loops, and responsibility boundaries so every digital workflow reflects how the project will actually be delivered.",
    bullets: [
      "Baseline delivery architecture",
      "Governance, reviews, and approval workflows",
      "Priority use cases for engineers, contractors, and owner teams",
    ],
  },
  {
    number: "02",
    title: "Connect the live project signals",
    meta: "Active delivery",
    text: "Models, drawings, constraints, field observations, and commercial priorities become a shared operating picture instead of separate status trackers.",
    bullets: [
      "Model and document coordination",
      "Site-to-office reporting loops",
      "Issue, risk, and status visibility by package",
    ],
  },
  {
    number: "03",
    title: "Control readiness and change",
    meta: "Execution control",
    text: "We make package maturity, scope movement, and delivery readiness visible early enough for the team to act before the consequences hit site.",
    bullets: [
      "Readiness checks linked to constraints",
      "Change traceability across disciplines",
      "Decision support for leaders running complex work fronts",
    ],
  },
  {
    number: "04",
    title: "Deliver clean handover data",
    meta: "Turnover",
    text: "The same delivery thread that supports execution also supports closeout, so handover becomes a controlled outcome rather than a rescue effort.",
    bullets: [
      "Progressive asset information validation",
      "Structured digital turnover packages",
      "Owner-facing documentation with traceable provenance",
    ],
  },
];

const OUTCOMES = [
  {
    metric: "Design to field",
    title: "Clearer package readiness before work reaches site",
    text: "Engineering intent, outstanding constraints, and latest approvals stay visible where delivery teams need them, reducing last-minute interpretation and rework.",
  },
  {
    metric: "Commercial to technical",
    title: "Better decisions because the project context is connected",
    text: "Programme controls, technical teams, and construction leaders can see the same delivery picture and understand how one decision shifts downstream risk.",
  },
  {
    metric: "Turnover",
    title: "Handover prepared during delivery, not after it",
    text: "Asset information, tagged records, and closeout evidence are captured progressively so operational handover becomes more predictable and less manual.",
  },
];

const SECTORS = [
  {
    title: "Industrial and process facilities",
    text: "For projects where engineering packages, construction sequencing, and operational requirements all need to stay aligned.",
  },
  {
    title: "Infrastructure and transportation",
    text: "For multi-stakeholder programmes that require traceable information flow across designers, contractors, and owners.",
  },
  {
    title: "Owner-side digital transformation",
    text: "For organizations that want stronger delivery control without introducing another disconnected technology stack.",
  },
];

export default function Home() {
  return (
    <main className={styles.page} id="top">
      <ConstructionScene />

      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.shell}>
          <div className={styles.heroInner}>
            <div>
              <p className={styles.eyebrow}>Engineering + Construction Digital Delivery</p>
              <h1 className={styles.title}>
                We build the digital delivery layer behind complex construction
                programs.
              </h1>
              <p className={styles.lead}>
                From design coordination to field execution and asset-ready
                handover, we connect models, documents, decisions, and site
                reality into one controlled delivery system.
              </p>

              <div className={styles.heroActions}>
                <a href="#platform" className={styles.primaryButton}>
                  Explore the platform
                </a>
                <a href="#contact" className={styles.secondaryButton}>
                  Start a delivery conversation
                </a>
              </div>

              <div className={styles.signalRow}>
                {HERO_SIGNALS.map((signal) => (
                  <span key={signal} className={styles.signalChip}>
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.heroAside}>
              <article className={styles.hudCard}>
                <span className={styles.hudLabel}>Live Delivery View</span>
                <h2 className={styles.hudTitle}>
                  Construction context rendered as one readable operating layer.
                </h2>
                <p className={styles.hudBody}>
                  The experience is designed to feel like a digital twin of the
                  delivery workflow itself: structural, connected, and always in
                  motion.
                </p>
                <ul className={styles.hudList}>
                  <li>
                    <strong>Inputs</strong>
                    <span>Models, drawings, field signals, approvals</span>
                  </li>
                  <li>
                    <strong>Control</strong>
                    <span>Reviews, readiness, traceability, governance</span>
                  </li>
                  <li>
                    <strong>Outcome</strong>
                    <span>Faster coordination and cleaner turnover</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>

          <div className={styles.heroStats}>
            {HERO_STATS.map((stat) => (
              <article key={stat.label} className={styles.heroStat}>
                <p className={styles.statValue}>{stat.value}</p>
                <span className={styles.statLabel}>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="platform">
        <div className={styles.shell}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>What We Deliver</span>
              <h2 className={styles.sectionTitle}>
                Digital delivery built for engineering and construction teams.
              </h2>
            </div>
            <p className={styles.sectionIntro}>
              This is not another generic dashboard layer. It is a project-wide
              delivery system that gives teams a clearer view of package status,
              decision history, field impact, and handover readiness.
            </p>
          </div>

          <div className={styles.serviceGrid}>
            {SERVICES.map((service) => (
              <article key={service.title} className={styles.serviceCard}>
                <span className={styles.cardIndex}>{service.index}</span>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardText}>{service.text}</p>
                <ul className={styles.cardList}>
                  {service.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="workflow">
        <div className={styles.shell}>
          <div className={styles.workflowGrid}>
            <aside className={styles.workflowLead}>
              <span className={styles.sectionLabel}>How It Works</span>
              <h2 className={styles.workflowLeadTitle}>
                A delivery workflow that stays useful from mobilization to handover.
              </h2>
              <p className={styles.workflowLeadText}>
                We structure the system around the real lifecycle of the job,
                so project teams are not asked to adopt one tool for design,
                another for execution, and a third for turnover.
              </p>
              <div className={styles.workflowBadges}>
                <span className={styles.workflowBadge}>Design Management</span>
                <span className={styles.workflowBadge}>Construction Control</span>
                <span className={styles.workflowBadge}>Operational Readiness</span>
              </div>
            </aside>

            <div className={styles.phaseList}>
              {PHASES.map((phase) => (
                <article key={phase.title} className={styles.phaseCard}>
                  <div className={styles.phaseHeader}>
                    <div>
                      <span className={styles.cardIndex}>{phase.number}</span>
                      <h3 className={styles.phaseTitle}>{phase.title}</h3>
                    </div>
                    <span className={styles.phaseMeta}>{phase.meta}</span>
                  </div>
                  <p className={styles.phaseText}>{phase.text}</p>
                  <ul className={styles.phaseListItems}>
                    {phase.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="outcomes">
        <div className={styles.shell}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Why Teams Buy In</span>
              <h2 className={styles.sectionTitle}>
                The digital layer is only valuable if the project can act on it.
              </h2>
            </div>
            <p className={styles.sectionIntro}>
              The goal is not more reporting. The goal is a stronger delivery
              signal: what is ready, what is exposed, what changed, and what
              needs attention before the next work front moves.
            </p>
          </div>

          <div className={styles.outcomeGrid}>
            <div className={styles.outcomeStack}>
              {OUTCOMES.map((outcome) => (
                <article key={outcome.title} className={styles.outcomeCard}>
                  <span className={styles.outcomeMetric}>{outcome.metric}</span>
                  <h3 className={styles.outcomeTitle}>{outcome.title}</h3>
                  <p className={styles.outcomeText}>{outcome.text}</p>
                </article>
              ))}
            </div>

            <div className={styles.sectorStack}>
              {SECTORS.map((sector) => (
                <article key={sector.title} className={styles.sectorCard}>
                  <span className={styles.contactMeta}>Ideal Fit</span>
                  <h3 className={styles.sectorTitle}>{sector.title}</h3>
                  <p className={styles.sectorText}>{sector.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.contactSection}`} id="contact">
        <div className={styles.shell}>
          <div className={styles.contactPanel}>
            <div>
              <span className={styles.contactMeta}>Next Step</span>
              <h2 className={styles.contactTitle}>
                Bring digital delivery in when the project still has room to move.
              </h2>
              <p className={styles.contactText}>
                We help engineering and construction teams shape the delivery
                system early enough that it can actually influence package flow,
                site readiness, and turnover quality.
              </p>
              <div className={styles.contactActions}>
                <a href="#top" className={styles.primaryButton}>
                  Return to the live view
                </a>
                <a href="#platform" className={styles.secondaryButton}>
                  Review our delivery scope
                </a>
              </div>
            </div>

            <div>
              <span className={styles.contactMeta}>Typical Engagements</span>
              <ul className={styles.contactList}>
                <li>Project mobilization and delivery framework definition</li>
                <li>Model, document, and field workflow integration</li>
                <li>Digital handover planning for owners and operators</li>
                <li>Recovery support when delivery signals are fragmented</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
