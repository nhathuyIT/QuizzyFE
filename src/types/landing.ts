export interface Question {
  q: string;
  opts: string[];
  correct: number;
}

export interface Subject {
  icon: string;
  name: string;
  count: string;
  bg: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarBg: string;
}

export interface PricingPlan {
  badge: string;
  price: string;
  period: string;
  features: { text: string; included: boolean }[];
  cta: string;
  style: string;
}

export interface Feature {
  bg: string;
  icon: string;
  title: string;
  desc: string;
}

export interface Step {
  num: string;
  title: string;
  desc: string;
}
