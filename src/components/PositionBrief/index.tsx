import styles from "./PositionBrief.module.css";

const blocks = [
  {
    label: "Approach",
    phrase: "Structure the project from the start",
    body: "We define how information is organized, exchanged, reviewed, approved, and delivered. From CDE workflows to model data, document control, requirements, and asset information, we build the framework that keeps project information usable.",
    href: "#layers",
  },
  {
    label: "Delivery",
    phrase: "Give teams a clearer view",
    body: "We connect the information sitting across design, construction, coordination, controls, and handover. The result is a clearer view of what is being developed, reviewed, delayed, approved, and delivered.",
    href: "#howwework",
  },
  {
    label: "Outcome",
    phrase: "Turn information into control",
    body: "Infraforma gives project teams the structure needed to manage complexity, track obligations, support decisions, and carry clean information from execution into operations.",
    href: "#close",
  },
];

export default function PositionBrief() {
  return (
    <section
      id="position"
      data-section
      data-tone="light"
      className={styles.section}
      aria-labelledby="position-brief-title"
    >
      <div className={styles.grid}>
        <figure className={styles.photoPane}>
          <img
            src="https://images.pexels.com/photos/15450239/pexels-photo-15450239.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt="Aerial view of a multi-level highway interchange"
            loading="lazy"
          />
          <p className={styles.coords}>
            <span>X: 1250</span>
            <span>Y: 1285</span>
          </p>
          <span className={styles.cornerMark} aria-hidden="true" />
        </figure>

        <div className={styles.contentPane}>
          <div className={styles.statement}>
            <h2 id="position-brief-title">
              We connect the people, the data, and the decisions behind
              critical infrastructure projects.
            </h2>
          </div>

          <div className={styles.cells}>
            {blocks.map((b) => (
              <article key={b.label}>
                <div className={styles.cellHead}>
                  <span>{b.label}</span>
                  <i aria-hidden="true" />
                </div>
                <h3 className={styles.cellPhrase}>{b.phrase}</h3>
                <p>{b.body}</p>
                <a className={styles.cellCta} href={b.href}>
                  <span>Learn more</span>
                  <span aria-hidden="true" className={styles.cellArr}>
                    &rarr;
                  </span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
