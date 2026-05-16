import styles from "./PositionBrief.module.css";

const parties = [
  { label: "owners", className: styles.owners },
  { label: "designers", className: styles.designers },
  { label: "contractors", className: styles.contractors },
  { label: "operators", className: styles.operators },
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
      <div className={styles.frame}>
        <div className={styles.topbar}>
          <p>
            <span>S2</span>
            <span>Position</span>
          </p>
          <p>45.5017 N / 73.5673 W</p>
        </div>

        <div className={styles.board}>
          <div className={styles.mapPane} aria-label="Project parties around Infraforma">
            <div className={styles.surveyBox} aria-hidden="true">
              <div className={styles.axisX} />
              <div className={styles.axisY} />
              <div className={styles.center}>
                <span />
              </div>
              {parties.map((party) => (
                <span key={party.label} className={`${styles.party} ${party.className}`}>
                  {party.label}
                </span>
              ))}
            </div>

            <p className={styles.coordinates}>
              <span>X: 0512</span>
              <span>Y: 0760</span>
            </p>
          </div>

          <div className={styles.statementPane}>
            <div className={styles.statement}>
              <h2 id="position-brief-title">
                We connect the people, the data, and the decisions behind
                critical infrastructure projects.
              </h2>
            </div>
          </div>
        </div>

        <div className={styles.cells}>
          <article>
            <div className={styles.cellHead}>
              <span>Approach</span>
              <i aria-hidden="true" />
            </div>
            <h3 className={styles.cellPhrase}>
              Structure the project from the start
            </h3>
            <p>
              We define how information is organized, exchanged, reviewed,
              approved, and delivered. From CDE workflows to model data,
              document control, requirements, and asset information, we build
              the framework that keeps project information usable.
            </p>
          </article>

          <article>
            <div className={styles.cellHead}>
              <span>Delivery</span>
              <i aria-hidden="true" />
            </div>
            <h3 className={styles.cellPhrase}>
              Give teams a clearer view
            </h3>
            <p>
              We connect the information sitting across design, construction,
              coordination, controls, and handover. The result is a clearer
              view of what is being developed, reviewed, delayed, approved,
              and delivered.
            </p>
          </article>

          <article>
            <div className={styles.cellHead}>
              <span>Outcome</span>
              <i aria-hidden="true" />
            </div>
            <h3 className={styles.cellPhrase}>
              Turn information into control
            </h3>
            <p>
              Infraforma gives project teams the structure needed to manage
              complexity, track obligations, support decisions, and carry
              clean information from execution into operations.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
