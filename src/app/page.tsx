import {
  Navigation,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  QuizDemoSection,
  SubjectsSection,
  TestimonialsSection,
  PricingSection,
  CTABanner,
  Footer,
} from "@/features/landing";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <QuizDemoSection />
        <SubjectsSection />
        <TestimonialsSection />
        <PricingSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
