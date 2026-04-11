import Pillars from "@/components/Pillars";
import TopScene from "@/components/TopScene";

const DELIVERY_STAGES = [
  {
    step: "01",
    title: "Capture every signal",
    text: "Create one intake layer for design, schedule, field, and commercial information so the programme stops losing context between tools.",
  },
  {
    step: "02",
    title: "Connect decisions to structure",
    text: "Map information to shared naming, ownership, and control rules so teams can act from the same operating picture.",
  },
  {
    step: "03",
    title: "Deliver from a trusted thread",
    text: "Move from reactive coordination to controlled execution, where teams can see what changed, what matters, and what to do next.",
  },
];

const PROOF_POINTS = [
  { value: "1", label: "shared delivery thread" },
  { value: "3", label: "layers: capture, connect, control" },
  { value: "24/7", label: "visibility into live delivery context" },
  { value: "ISO 19650", label: "aligned thinking baked into the structure" },
];

const SECTORS = [
  {
    title: "Major infrastructure",
    text: "Programmes where delivery depends on multiple disciplines, legacy systems, and a long chain of accountability.",
  },
  {
    title: "Industrial capital projects",
    text: "Environments where engineering, construction, operations, and commercial teams all need a common operating picture.",
  },
  {
    title: "Owner-side transformation",
    text: "Teams modernizing delivery without turning the rollout into another disconnected technology initiative.",
  },
];

export default function Home() {
  return (
    <main>
      <TopScene />

      <section id="delivery-environment" className="section-light">
        <div className="page-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "40px",
              alignItems: "end",
            }}
          >
            <div>
              <p className="text-mono-label" style={{ marginBottom: "var(--space-16)" }}>
                Delivery Environment
              </p>
              <h2 className="text-h1" style={{ maxWidth: "11ch" }}>
                Turn fragmented project data into a controlled operating layer.
              </h2>
            </div>

            <p className="text-body-lg" style={{ maxWidth: "34rem" }}>
              Infraforma gives delivery teams a dependable line of sight from
              intake to execution, so information does not lose meaning every
              time it crosses a discipline, package, or approval gate.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
              marginTop: "var(--space-48)",
            }}
          >
            {DELIVERY_STAGES.map((stage) => (
              <article
                key={stage.step}
                style={{
                  padding: "28px",
                  borderRadius: "24px",
                  border: "1px solid rgba(8, 18, 37, 0.08)",
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(239, 245, 250, 0.78))",
                  boxShadow: "0 24px 60px rgba(8, 18, 37, 0.05)",
                }}
              >
                <p
                  className="text-mono-label"
                  style={{ color: "var(--blue-deep)", marginBottom: "var(--space-16)" }}
                >
                  {stage.step}
                </p>
                <h3 className="text-h3" style={{ marginBottom: "var(--space-12)" }}>
                  {stage.title}
                </h3>
                <p className="text-body">{stage.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Pillars />

      <section id="proof" className="section-dark">
        <div className="page-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "40px",
              alignItems: "start",
            }}
          >
            <div>
              <p
                className="text-mono-label"
                style={{ color: "var(--blue)", marginBottom: "var(--space-16)" }}
              >
                Why It Feels Different
              </p>
              <h2 className="text-h1" style={{ maxWidth: "11ch" }}>
                Built so delivery teams can actually act on the information.
              </h2>
            </div>

            <p
              className="text-body-lg"
              style={{ color: "var(--text-dark-body)", maxWidth: "34rem" }}
            >
              The difference is not another dashboard. It is a structured layer
              that preserves ownership, timing, and decision context as work
              moves from design through delivery and governance.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1px",
              marginTop: "var(--space-48)",
              background: "rgba(207, 217, 224, 0.12)",
              border: "1px solid rgba(207, 217, 224, 0.12)",
            }}
          >
            {PROOF_POINTS.map((point) => (
              <div
                key={point.label}
                style={{
                  padding: "28px",
                  background: "rgba(8, 18, 37, 0.88)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    lineHeight: 1,
                    color: "var(--blue)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {point.value}
                </p>
                <p className="text-mono-label" style={{ marginTop: "var(--space-12)" }}>
                  {point.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-off-white">
        <div className="page-container">
          <p className="text-mono-label" style={{ marginBottom: "var(--space-16)" }}>
            Where It Matters
          </p>
          <h2 className="text-h1" style={{ maxWidth: "13ch" }}>
            Best for programmes with too many moving parts for manual coordination.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
              marginTop: "40px",
            }}
          >
            {SECTORS.map((sector) => (
              <article
                key={sector.title}
                style={{
                  padding: "24px",
                  borderTop: "1px solid rgba(8, 18, 37, 0.14)",
                }}
              >
                <h3 className="text-h3" style={{ marginBottom: "var(--space-12)" }}>
                  {sector.title}
                </h3>
                <p className="text-body">{sector.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="page-container" style={{ textAlign: "center" }}>
          <p className="text-mono-label" style={{ marginBottom: "var(--space-16)" }}>
            Next Step
          </p>
          <h2 className="text-h1" style={{ maxWidth: "12ch", margin: "0 auto" }}>
            Ready to turn fragmented flow into controlled delivery?
          </h2>
          <p
            className="text-body-lg"
            style={{
              margin: "var(--space-24) auto 0",
              maxWidth: "34rem",
            }}
          >
            We work with organisations that need cleaner coordination, clearer
            accountability, and a more reliable operating picture across the
            entire delivery chain.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-16)",
              justifyContent: "center",
              marginTop: "var(--space-32)",
            }}
          >
            <a className="btn btn-primary" href="/contact">
              Schedule a discovery call
            </a>
            <a className="btn btn-outline" href="/solutions">
              View solutions
            </a>
          </div>
        </div>
      </section>

      <footer className="section-dark">
        <div className="page-container">
          <p
            style={{
              fontWeight: 900,
              fontSize: "var(--text-h2)",
              color: "var(--text-dark-heading)",
              letterSpacing: "-0.02em",
            }}
          >
            Infraforma
          </p>
          <p className="text-body" style={{ marginTop: "var(--space-16)" }}>
            Infrastructure, Thought Through.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "var(--space-16)",
              marginTop: "var(--space-48)",
              paddingTop: "var(--space-24)",
              borderTop: "1px solid rgba(207, 217, 224, 0.1)",
            }}
          >
            <p className="text-mono-label">46.8123N / 71.2145W / Quebec City</p>
            <p className="text-mono-label">Copyright 2026 Infraforma Inc.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
