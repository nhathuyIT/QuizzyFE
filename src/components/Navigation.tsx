"use client";

import { useEffect } from "react";

export function Navigation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 80);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
