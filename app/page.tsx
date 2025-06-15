"use client"
import Hero from "@/components/hero-02/hero-02";
import { NavbarComp } from "@/components/navbar";
import Timeline from "@/components/timeline-05/timeline-05";
import Feature from "@/components/features-01/features-01";
import UseCase from "@/components/timeline-06/timeline-06";
import { CTASection } from "@/components/blocks/cta-with-rectangle"
import { pageLinks } from "@/constant/page-links";

export default function HomePage() {

  return (
    <>
      <NavbarComp />
      <Hero />
      <Timeline />
      <Feature />
      <UseCase />
      <CTASection
        badge={{
          text: "AI Meets Security"
        }}
        title="Protect What Matters with Image-Based Encryption"
        description="Leverage the power of AI to encrypt sensitive data inside images — share securely, decrypt intelligently, and safeguard privacy at every step."
        action={{
          text: "Experience Secure Intelligence",
          href: pageLinks.sign_up,
          variant: "default"
        }}
      />

    </>
  );
}
