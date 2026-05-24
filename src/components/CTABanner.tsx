"use client";

import { useEffect } from "react";

export function CTABanner() {
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
    <div className="cta-banner fade-up">
      <h2>
        Start learning<br />smarter today.
      </h2>
      <div className="cta-banner-right">
        <div className="input-row">
          <input type="email" placeholder="Enter your email address" />
          <button>Get started →</button>
        </div>
        <p className="cta-note">
          Free forever • No credit card required • Cancel anytime
        </p>
      </div>
    </div>
  );
}
