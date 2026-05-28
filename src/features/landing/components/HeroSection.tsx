"use client";

export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-cell hero-cell-1">
        <div className="hero-eyebrow">AI-powered learning</div>
        <h1>
          Quiz
          <br />
          smarter,
          <br />
          not
          <br />
          harder.
        </h1>
      </div>

      <div className="hero-cell hero-cell-2">
        <div className="blob">
          <div className="blob-inner"></div>
        </div>
      </div>

      <div className="hero-cell hero-cell-3">
        <div>
          <div className="stat-pill">
            <span className="stat-dot"></span>
            Live learners
          </div>
        </div>
        <div>
          <div className="stat-label">Total flashcards</div>
          <div className="stat-number">2.4M</div>
          <div className="stat-sub">generated this month</div>
        </div>
        <div>
          <div className="stat-label">Average score boost</div>
          <div className="stat-number">+38%</div>
          <div className="stat-sub">within 2 weeks</div>
        </div>
      </div>

      <div className="hero-row2">
        <div className="hero-cell-r2-a">
          <span className="big-letter">Q</span>
        </div>

        <div className="hero-cell-r2-b">
          <div className="glyph-grid">
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i}>q</span>
            ))}
          </div>
        </div>

        <div className="hero-cell-r2-c">
          <h2>
            Adaptive
            <br />
            Quizzing
          </h2>
        </div>
      </div>
    </section>
  );
}
