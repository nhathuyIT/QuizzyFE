"use client";

import { useFadeUp } from "@/hooks/useFadeUp";
import type { Testimonial } from "@/types/landing";

const testimonials: Testimonial[] = [
  {
    quote:
      '"Quizzy completely changed how I study for exams. The adaptive engine is scary good at finding exactly what I don\'t know."',
    name: "Maya R.",
    role: "Medical student, UCL",
    avatarBg: "var(--purple)",
  },
  {
    quote:
      '"I went from a C to an A in Organic Chemistry in one semester. The AI flashcard generator saves me hours every week."',
    name: "James K.",
    role: "Undergrad, MIT",
    avatarBg: "var(--teal)",
  },
  {
    quote:
      '"The group study rooms make revision actually fun. My whole friend group uses Quizzy before every test now."',
    name: "Sofia L.",
    role: "High school senior, Barcelona",
    avatarBg: "var(--yellow)",
  },
];

export function TestimonialsSection() {
  useFadeUp();

  return (
    <section className="testimonials">
      <div className="section-tag">Testimonials</div>
      <h2 className="section-heading">
        Students love<br />Quizzy.
      </h2>
      <div className="testi-grid">
        {testimonials.map((t, i) => (
          <div key={i} className="testi-card fade-up">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-quote">{t.quote}</p>
            <div className="testi-author">
              <div
                className="testi-avatar"
                style={{ background: t.avatarBg }}
              >
                {t.name[0]}
              </div>
              <div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
