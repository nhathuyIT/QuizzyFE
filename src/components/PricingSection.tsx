"use client";

import { useEffect } from "react";

const plans = [
  {
    badge: "Free",
    price: "$0",
    period: "forever, no credit card",
    features: [
      { text: "Up to 50 flashcard decks", included: true },
      { text: "Basic quiz modes", included: true },
      { text: "3 AI generations/day", included: true },
      { text: "Progress tracking", included: true },
      { text: "Group study rooms", included: false },
      { text: "Offline mode", included: false },
    ],
    cta: "Get started free",
    style: "pc-light",
  },
  {
    badge: "Pro",
    price: "$9",
    period: "per month, billed monthly",
    features: [
      { text: "Unlimited flashcard decks", included: true },
      { text: "All quiz modes + speed rounds", included: true },
      { text: "Unlimited AI generations", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Group study rooms", included: true },
      { text: "Offline mode", included: true },
    ],
    cta: "Start 7-day free trial",
    style: "pc-dark",
  },
  {
    badge: "Teams",
    price: "$29",
    period: "per month, up to 10 users",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Team admin dashboard", included: true },
      { text: "Custom branding", included: true },
      { text: "Priority support", included: true },
      { text: "API access", included: true },
      { text: "SSO / LMS integration", included: true },
    ],
    cta: "Contact sales",
    style: "pc-blue",
  },
];

export function PricingSection() {
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
    <section className="pricing-section">
      <div className="section-tag fade-up">Pricing</div>
      <h2 className="section-heading fade-up">
        Simple,<br />transparent pricing.
      </h2>

      <div className="pricing-grid">
        {plans.map((plan, i) => (
          <div key={i} className={`price-card ${plan.style} fade-up`}>
            <div className="price-badge">{plan.badge}</div>
            <div className="price-val">{plan.price}</div>
            <div className="price-period">{plan.period}</div>
            <ul className="price-features">
              {plan.features.map((f, j) => (
                <li key={j} style={{ opacity: f.included ? 0.75 : 0.3 }}>
                  <span className="check">{f.included ? "✓" : "✗"}</span>
                  {f.text}
                </li>
              ))}
            </ul>
            <button className="price-cta">{plan.cta}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
