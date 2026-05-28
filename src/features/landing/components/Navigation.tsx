"use client";

export function Navigation() {
  return (
    <nav>
      <div className="nav-logo">
        <span>Q</span>
        Quizzy
      </div>
      <div className="nav-links">
        <a href="#">Features</a>
        <a href="#">Subjects</a>
        <a href="#">Pricing</a>
        <a href="#">About</a>
        <a href="#">Log in</a>
        <a href="#" className="nav-cta">
          Get started →
        </a>
      </div>
    </nav>
  );
}
