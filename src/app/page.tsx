import Hero from "@/components/Hero";
import Statement from "@/components/Statement";

export default function Home() {
  return (
    <main>
      {/* S1 — Hero + Video */}
      <Hero />

      {/* S2 — Statement */}
      <Statement />

      {/* S3 — 3D Bridge (placeholder dark zone) */}
      <section className="section-dark" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="page-container" style={{ textAlign: "center" }}>
          <p className="text-mono-label" style={{ color: "var(--blue)", marginBottom: "var(--space-24)" }}>
            Interactive Experience
          </p>
          <h2 className="text-h1">
            3D Bridge<br />Digital Twin
          </h2>
          <p className="text-body" style={{ marginTop: "var(--space-16)", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
            Every component. Every connection. One digital thread.
          </p>
        </div>
      </section>

      {/* S4 — Solutions */}
      <section className="section-light">
        <div className="page-container">
          <p className="text-mono-label" style={{ marginBottom: "var(--space-16)" }}>What We Deliver</p>
          <h2 className="text-h1">Three Layers of<br />Digital Control.</h2>
        </div>
      </section>

      {/* S5 — Process */}
      <section className="section-off-white">
        <div className="page-container">
          <p className="text-mono-label" style={{ marginBottom: "var(--space-16)" }}>How We Work</p>
          <h2 className="text-h1">Structured Delivery<br />Framework.</h2>
        </div>
      </section>

      {/* S6 — Credentials */}
      <section className="section-dark">
        <div className="page-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px" }}>
            {[
              { val: "$50B+", label: "Assets Delivered" },
              { val: "55+", label: "Years Combined" },
              { val: "3", label: "Countries" },
              { val: "100%", label: "ISO 19650" },
            ].map((s) => (
              <div key={s.label} style={{ padding: "var(--space-24)", borderLeft: "2px solid var(--blue)" }}>
                <p style={{ fontWeight: 900, fontSize: "2rem", lineHeight: 1, color: "var(--blue)" }}>{s.val}</p>
                <p className="text-mono-label" style={{ marginTop: "var(--space-8)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S7 — Industries */}
      <section className="section-light">
        <div className="page-container">
          <p className="text-mono-label" style={{ marginBottom: "var(--space-16)" }}>Sectors</p>
          <h2 className="text-h1">Industries We Serve.</h2>
        </div>
      </section>

      {/* S8 — Tech Ecosystem */}
      <section className="section-light">
        <div className="page-container">
          <p className="text-mono-label" style={{ marginBottom: "var(--space-16)" }}>Ecosystem</p>
          <h2 className="text-h2">Your Tools, Our Structure.</h2>
        </div>
      </section>

      {/* S9 — CTA */}
      <section className="section-light">
        <div className="page-container" style={{ textAlign: "center" }}>
          <h2 className="text-h1">Ready to Bring Structure<br />to Your Next Programme?</h2>
          <div style={{ display: "flex", gap: "var(--space-16)", justifyContent: "center", marginTop: "var(--space-32)" }}>
            <a className="btn btn-primary" href="/contact">Schedule a Discovery Call →</a>
            <a className="btn btn-outline" href="/solutions">View Solutions</a>
          </div>
        </div>
      </section>

      {/* S10 — Footer */}
      <footer className="section-dark">
        <div className="page-container">
          <p style={{ fontWeight: 900, fontSize: "var(--text-h2)", color: "var(--text-dark-heading)", letterSpacing: "-0.02em" }}>
            Infraforma
          </p>
          <p className="text-body" style={{ marginTop: "var(--space-16)" }}>
            Infrastructure, Thought Through.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-48)", paddingTop: "var(--space-24)", borderTop: "1px solid rgba(207,217,224,0.1)" }}>
            <p className="text-mono-label">46.8123°N / 71.2145°W · Quebec City</p>
            <p className="text-mono-label">© 2026 Infraforma Inc.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
