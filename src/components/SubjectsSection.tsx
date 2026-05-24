"use client";

import { useEffect } from "react";

const subjects = [
  { icon: "🔬", name: "Biology", count: "14,200 decks", bg: "#e8e3ff" },
  { icon: "⚗️", name: "Chemistry", count: "9,800 decks", bg: "#ffd6e8" },
  { icon: "🧮", name: "Math", count: "21,000 decks", bg: "#cff2f2" },
  { icon: "🏛️", name: "History", count: "8,400 decks", bg: "#fff5c0" },
  { icon: "🌍", name: "Geography", count: "6,200 decks", bg: "#ffd9c0" },
  { icon: "💻", name: "CS & Code", count: "18,700 decks", bg: "#dce8ff" },
];

export function SubjectsSection() {
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
    <section className="subjects-section">
      <div className="section-tag fade-up">Explore</div>
      <h2 className="section-heading fade-up">
        Every subject,<br />covered.
      </h2>
      <div className="subjects-scroll">
        {subjects.map((subj, i) => (
          <div
            key={i}
            className="subj-card fade-up"
            style={{ background: subj.bg }}
          >
            <span className="subj-icon">{subj.icon}</span>
            <div className="subj-name">{subj.name}</div>
            <div className="subj-count">{subj.count}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
