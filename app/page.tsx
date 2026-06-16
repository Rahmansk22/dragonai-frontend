"use client";

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GrainOverlay from '../components/landing/components/GrainOverlay';
import HeroSection from '../components/landing/sections/HeroSection';
import FeaturesSection from '../components/landing/sections/FeaturesSection';
import FooterSection from '../components/landing/sections/FooterSection';
import { useUser } from '../lib/clerk';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Cleanup all ScrollTriggers on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Automatically enter chat on scroll down if signed in
  useEffect(() => {
    if (!isSignedIn) return;

    let touchStartY = 0;
    let hasRedirected = false;

    const handleWheel = (e: WheelEvent) => {
      if (hasRedirected) return;
      if (e.deltaY > 10) {
        hasRedirected = true;
        router.push("/chat");
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (hasRedirected) return;
      const touchEndY = e.touches[0].clientY;
      const diffY = touchStartY - touchEndY;
      if (diffY > 20) { // user swiped up (scrolling down)
        hasRedirected = true;
        router.push("/chat");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasRedirected) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        hasRedirected = true;
        router.push("/chat");
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSignedIn, router]);

  return (
    <main className="relative bg-[#0F1113]">
      {/* Grain overlay - persistent */}
      <GrainOverlay />

      {/* Landing page sections */}
      <HeroSection />
      
      {!isSignedIn && (
        <>
          <FeaturesSection />
          <FooterSection />
        </>
      )}
    </main>
  );
}
