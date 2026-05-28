"use client";

import { useFadeUp } from "@/hooks/useFadeUp";

export function CTABanner() {
  useFadeUp();

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
