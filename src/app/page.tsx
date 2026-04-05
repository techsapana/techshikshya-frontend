"use client";

import { useEffect } from "react";
import HeroSection from "@/src/app/components/HeroSection";
import Partners from "@/src/app/components/Partners";
import Team from "@/src/app/components/Team";
import BottomSection from "@/src/app/components/BottomSection";
import Faqs from "@/src/app/components/Faqs";

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const scrollToSection = () => {
        const element = document.querySelector(hash);
        if (element) {
          const navbarHeight = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      };

      const timer = setTimeout(scrollToSection, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="home-sky-section relative min-h-screen overflow-hidden">
      <div className="home-sky-glow pointer-events-none absolute inset-0" />
      <div className="relative">
        <HeroSection />
        <Partners />
        <BottomSection />
        <Faqs />
        <Team />
      </div>
    </div>
  );
}
