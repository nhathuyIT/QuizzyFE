"use client";

import { useFadeUp } from "@/hooks/useFadeUp";
import type { Subject } from "@/types/landing";

const subjects: Subject[] = [
  { icon: "🔬", name: "Biology", count: "14,200 decks", bg: "#e8e3ff" },
  { icon: "⚗️", name: "Chemistry", count: "9,800 decks", bg: "#ffd6e8" },
  { icon: "🧮", name: "Math", count: "21,000 decks", bg: "#cff2f2" },
  { icon: "🏛️", name: "History", count: "8,400 decks", bg: "#fff5c0" },
  { icon: "🌍", name: "Geography", count: "6,200 decks", bg: "#ffd9c0" },
  { icon: "💻", name: "CS & Code", count: "18,700 decks", bg: "#dce8ff" },
];

export function SubjectsSection() {
  useFadeUp();

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
