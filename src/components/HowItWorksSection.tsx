"use client";

import { useEffect } from "react";

const steps = [
  {
    num: "01",
    title: "Upload your material",
    desc: "Drop in PDFs, paste notes, or link a URL. Quizzy reads it all.",
  },
  {
    num: "02",
    title: "AI generates quizzes",
    desc: "Within seconds, hundreds of flashcards and questions are created automatically.",
  },
  {
    num: "03",
    title: "Study & get graded",
    desc: "Answer questions, get instant feedback, and build streaks that keep you motivated.",
  },
  {
    num: "04",
    title: "Track your growth",
    desc: "Review analytics, revisit weak areas, and see your mastery score rise over time.",
  },
];

export function HowItWorksSection() {
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
    <section className="how-section">
      <div className="section-tag">Process</div>
      <h2 className="section-heading">
        Four steps<br />to mastery.
      </h2>
      <div className="steps-grid">
        {steps.map((step, i) => (
          <div key={i} className="step-card fade-up">
            <div className="step-num">{step.num}</div>
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
