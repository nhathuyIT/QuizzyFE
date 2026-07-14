"use client";

import { useFadeUp } from "@/hooks/useFadeUp";
import type { Feature } from "@/types/landing";

const features: Feature[] = [
  {
    bg: "fc-purple",
    icon: "🧠",
    title: "AI Flashcard Generation",
    desc: "Paste any notes or textbook content and Quizzy instantly creates smart, spaced-repetition flashcards tailored to how you learn.",
  },
  {
    bg: "fc-pink",
    icon: "🎯",
    title: "Adaptive Quiz Engine",
    desc: "Our algorithm pinpoints your weak spots and drills them harder, so every minute of study counts.",
  },
  {
    bg: "fc-dark",
    icon: "📊",
    title: "Progress Dashboard",
    desc: "Track streaks, accuracy, and mastery levels across every subject. Watch your knowledge grow in real time.",
  },
  {
    bg: "fc-teal",
    icon: "⚡",
    title: "Speed Rounds",
    desc: "Race the clock with timed quiz modes that sharpen recall under pressure — perfect for exam prep.",
  },
  {
    bg: "fc-blue",
    icon: "📱",
    title: "Offline Mode",
    desc: "Download your decks and quiz anywhere — no connection required. Your study plan never pauses.",
  },
];

export function FeaturesSection() {
  useFadeUp();

  return (
    <>
      <section className="section fade-up">
        <div className="section-tag">Features</div>
        <h2 className="section-heading">
          Everything you
          <br />
          need to ace it.
        </h2>
      </section>

      <div className="features-grid">
        {features.map((feat, i) => (
          <div key={i} className={`feat-card ${feat.bg} fade-up`}>
            <div>
              <div
                className="feat-icon"
                style={{ background: "rgba(0,0,0,0.1)" }}
              >
                {feat.icon}
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
            <div className="feat-arrow">
              <div className="arrow-btn">→</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
