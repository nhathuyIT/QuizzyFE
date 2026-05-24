import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { QuizDemoSection } from "@/components/QuizDemoSection";
import { SubjectsSection } from "@/components/SubjectsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { CTABanner } from "@/components/CTABanner";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <QuizDemoSection />
      <SubjectsSection />
      <TestimonialsSection />
      <PricingSection />
      <CTABanner />
      <Footer />
    </>
  );
}
