import ConstructionScene from "@/components/ConstructionScene";
import styles from "./page.module.css";

const HERO_SIGNALS = [
  "Information management",
  "Design coordination",
  "Construction readiness",
  "Operational handover",
];

const HERO_FACTS = [
  {
    value: "Design",
    label: "Structured information for issue, review, and release.",
  },
  {
    value: "Delivery",
    label: "Current project information aligned with package status and site needs.",
  },
  {
    value: "Handover",
    label: "Records prepared for owner use before project closeout.",
  },
];

const STRIP_ITEMS = [
  {
    title: "Design information",
    text: "Issued information stays tied to package status, discipline ownership, and review history.",
  },
  {
    title: "Project controls",
    text: "Commercial, technical, and delivery teams can work from the same project picture.",
  },
  {
    title: "Site readiness",
    text: "Outstanding constraints stay visible before the work front is opened to construction.",
  },
];

const CAPABILITIES = [
  {
    index: "01",
    title: "Digital delivery strategy",
    text: "We define the project operating model for how information should be named, reviewed, approved, issued, and governed across design, delivery, and turnover.",
    bullets: [
      "Information management framework and governance structure",
      "Common data environment logic, approvals, and role mapping",
      "Package architecture aligned to project milestones and decision gates",
    ],
  },
  {
    index: "02",
    title: "Coordination across engineering and construction",
    text: "We connect models, documents, interfaces, issues, and site feedback into a delivery structure that helps teams act earlier and with better clarity.",
    bullets: [
      "Model and document coordination across disciplines",
      "Issue and interface management linked to package status",
      "Construction-facing views that support current delivery decisions",
    ],
  },
  {
    index: "03",
    title: "Structured handover planning",
    text: "We help teams build turnover requirements into delivery from the start so asset records, tagged information, and closeout evidence are prepared progressively.",
    bullets: [
      "Asset information requirements and handover planning",
      "Verification routes for records, metadata, and closeout evidence",
      "Owner-ready turnover information shaped before the end phase",
    ],
  },
];

const PROCESS = [
  {
    number: "01",
    title: "Define the project information model",
    text: "We start with project structure: packages, roles, review routes, issue paths, and turnover requirements. The digital layer has to follow the delivery logic, not sit beside it.",
  },
  {
    number: "02",
    title: "Connect the active delivery information",
    text: "Design outputs, coordination issues, approvals, and site-facing information are organized so teams can understand what is current, what is blocked, and what is ready.",
  },
  {
    number: "03",
    title: "Support decisions during execution",
    text: "The system should help teams see consequences early. That means clearer visibility into package maturity, interface risk, constraints, and downstream owner impact.",
  },
  {
    number: "04",
    title: "Prepare handover as part of delivery",
    text: "Turnover data is shaped progressively rather than collected at the end. The outcome is a cleaner closeout process and a more usable record for operations.",
  },
];

const OUTCOMES = [
  {
    label: "Project clarity",
    title: "A more readable delivery picture for engineering, construction, and owner teams.",
    text: "Information is structured around the way the project is delivered, which improves visibility into status, accountability, and outstanding actions.",
  },
  {
    label: "Earlier intervention",
    title: "Delivery issues become visible before they become field problems.",
    text: "Package readiness, review status, and unresolved interfaces can be understood in time for teams to change course with less disruption.",
  },
  {
    label: "Better closeout",
    title: "Handover requirements are built into the job instead of left to the end.",
    text: "Owner-facing records, tagged data, and delivery evidence are prepared through the life of the project, not assembled after the fact.",
  },
];

const SECTORS = [
  {
    title: "Major buildings and campus programmes",
    text: "For projects where coordination quality and clean information flow have direct programme impact.",
  },
  {
    title: "Infrastructure and transportation",
    text: "For multi-stakeholder projects that need stronger delivery control across owners, designers, and contractors.",
  },
  {
    title: "Industrial and process facilities",
    text: "For programmes where engineering packages, field execution, and operational readiness need to stay connected.",
  },
];

export default function Home() {
  return (
    <main className={styles.page} id="top">
      <ConstructionScene />

      <section className={styles.hero}>
        <div className={styles.heroSurface} />
        <div className={styles.shell}>
          <p className={styles.kicker}>
            Engineering Information Management / Digital Delivery
          </p>

          <div className={styles.heroGrid}>
            <div>
              <h1 className={styles.heroTitle}>
                Digital delivery for construction projects that need clarity,
                structure, and control.
              </h1>
            </div>

            <div className={styles.heroPanel}>
              <p className={styles.heroLead}>
                We help engineering, construction, and owner teams structure
                information across design, coordination, delivery, and handover
                so the project can move with fewer blind spots.
              </p>

              <div className={styles.heroActions}>
                <a href="#platform" className={styles.primaryButton}>
                  Explore capabilities
                </a>
                <a href="#contact" className={styles.secondaryButton}>
                  Start a conversation
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
          </div>

          <div className={styles.heroFacts}>
            {HERO_FACTS.map((fact) => (
              <article key={fact.value} className={styles.heroFact}>
                <p className={styles.factValue}>{fact.value}</p>
                <p className={styles.factLabel}>{fact.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.whiteSection}`} id="platform">
        <div className={styles.shell}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>What We Do</span>
              <h2 className={styles.sectionTitle}>
                A digital delivery approach built for real project work.
              </h2>
            </div>
            <p className={styles.sectionIntro}>
              This is an explanation-led offer. We help clients structure
              information, coordination, and delivery control across the life of
              the project so teams can work from a clearer and more consistent
              operating picture.
            </p>
          </div>

          <div className={styles.statement}>
            <p className={styles.statementText}>
              The objective is straightforward: better-issued information, clearer
              accountability, stronger delivery visibility, and a more reliable
              path from design through construction to owner handover.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.wideSection}`}>
        <div className={styles.wideShell}>
          <div className={styles.explanationStrip}>
            <article className={styles.stripLead}>
              <span className={styles.sectionLabel}>Wide View</span>
              <h2 className={styles.stripLeadTitle}>
                One readable thread across design, delivery, and closeout.
              </h2>
              <p className={styles.stripLeadText}>
                The wider section is intentional. It lets the site feel more like
                an engineering and programme overview than a conventional
                marketing page.
              </p>
            </article>

            {STRIP_ITEMS.map((item) => (
              <article key={item.title} className={styles.stripCard}>
                <h3 className={styles.stripCardTitle}>{item.title}</h3>
                <p className={styles.stripCardText}>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.whiteSection}`}>
        <div className={styles.shell}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Capabilities</span>
              <h2 className={styles.sectionTitle}>
                Clear service lines for complex engineering and construction work.
              </h2>
            </div>
            <p className={styles.sectionIntro}>
              We focus on delivery structure, coordination logic, and handover
              readiness. The work is not about adding noise to the project. It is
              about creating a cleaner delivery environment around it.
            </p>
          </div>

          <div className={styles.serviceRows}>
            {CAPABILITIES.map((capability) => (
              <article key={capability.title} className={styles.serviceRow}>
                <p className={styles.serviceNumber}>{capability.index}</p>
                <div>
                  <h3 className={styles.serviceTitle}>{capability.title}</h3>
                </div>
                <div>
                  <p className={styles.serviceText}>{capability.text}</p>
                  <ul className={styles.serviceList}>
                    {capability.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.darkBand} id="workflow">
        <div className={styles.darkBandShell}>
          <div className={styles.darkBandHeader}>
            <div>
              <span className={styles.darkLabel}>Approach</span>
              <h2 className={styles.darkTitle}>
                Structure first. Visibility second. Better decisions after that.
              </h2>
            </div>
            <p className={styles.darkIntro}>
              Digital delivery works when the project structure is clear:
              package logic, review routes, information ownership, and turnover
              requirements. Once that is in place, the project becomes easier to
              read and easier to manage.
            </p>
          </div>

          <div className={styles.darkMetrics}>
            <article className={styles.darkMetric}>
              <p className={styles.darkMetricTitle}>Design to delivery</p>
              <p className={styles.darkMetricText}>
                Current information can be read against the work it supports.
              </p>
            </article>
            <article className={styles.darkMetric}>
              <p className={styles.darkMetricTitle}>Commercial to technical</p>
              <p className={styles.darkMetricText}>
                Project controls and technical teams can work from the same
                delivery picture.
              </p>
            </article>
            <article className={styles.darkMetric}>
              <p className={styles.darkMetricTitle}>Execution to handover</p>
              <p className={styles.darkMetricText}>
                Owner-facing records are shaped during delivery, not only at the end.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.whiteSection}`}>
        <div className={styles.shell}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>How We Work</span>
              <h2 className={styles.sectionTitle}>
                A straightforward process from framework to handover.
              </h2>
            </div>
            <p className={styles.sectionIntro}>
              The process is meant to be clear to read. Each step builds on the
              one before it so the project gains structure, then visibility, then
              stronger execution support.
            </p>
          </div>

          <div className={styles.processRows}>
            {PROCESS.map((step) => (
              <article key={step.title} className={styles.processRow}>
                <p className={styles.processNumber}>{step.number}</p>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={styles.processText}>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.whiteSection}`} id="outcomes">
        <div className={styles.shell}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Outcomes</span>
              <h2 className={styles.sectionTitle}>
                Stronger delivery information where the project actually needs it.
              </h2>
            </div>
            <p className={styles.sectionIntro}>
              The result is a more usable delivery environment for project teams
              and a cleaner handover position for owners.
            </p>
          </div>

          <div className={styles.outcomeColumns}>
            <div className={styles.outcomeList}>
              {OUTCOMES.map((outcome) => (
                <article key={outcome.title} className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>{outcome.label}</span>
                  <h3 className={styles.outcomeTitle}>{outcome.title}</h3>
                  <p className={styles.outcomeText}>{outcome.text}</p>
                </article>
              ))}
            </div>

            <div className={styles.sectorList}>
              {SECTORS.map((sector) => (
                <article key={sector.title} className={styles.sectorItem}>
                  <span className={styles.outcomeLabel}>Project Type</span>
                  <h3 className={styles.sectorTitle}>{sector.title}</h3>
                  <p className={styles.sectorText}>{sector.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contactSection} id="contact">
        <div className={styles.shell}>
          <div className={styles.contactPanel}>
            <div>
              <span className={styles.sectionLabel}>Contact</span>
              <h2 className={styles.contactTitle}>
                Bring digital delivery into the project early enough for it to matter.
              </h2>
              <p className={styles.contactText}>
                We work with clients who want clearer information structure,
                better coordination logic, and a more reliable handover path
                across complex construction programmes.
              </p>
            </div>

            <div className={styles.contactActions}>
              <a href="#top" className={styles.primaryButton}>
                Return to top
              </a>
              <a href="#platform" className={styles.secondaryButton}>
                Review capabilities
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
