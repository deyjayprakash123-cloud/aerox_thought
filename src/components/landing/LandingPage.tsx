"use client";

import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import FeaturesSection from "./FeaturesSection";
import DemoPreviewSection from "./DemoPreviewSection";
import WhySection from "./WhySection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #0d0020 50%, #000d1a 100%)",
      }}
    >
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <DemoPreviewSection />
      <WhySection />
      <Footer />
    </div>
  );
}
