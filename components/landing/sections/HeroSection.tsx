import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EmbercrestEmblem from '../components/EmbercrestEmblem';
import { SignedIn, SignedOut, UserButton, useUser } from "../../../lib/clerk";
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const HeroSection: React.FC = () => {
  const { isSignedIn } = useUser();
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const microcopyRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Auto-play entrance animation on mount
      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      entranceTl
        .fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
        .fromTo(wordmarkRef.current, { y: -12, scale: 0.98, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.6 }, 0.1)
        .fromTo(navRef.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.2)
        .fromTo(ctaRef.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.25)
        .fromTo(headlineRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.35)
        .fromTo(microcopyRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.5)
        .fromTo(scrollHintRef.current, { opacity: 0 }, { opacity: 0.7, duration: 0.4 }, 0.7);

      // Scroll-driven EXIT animation (70%-100%)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
            gsap.set([headlineRef.current, microcopyRef.current, wordmarkRef.current, navRef.current, ctaRef.current, scrollHintRef.current], {
              opacity: 1, x: 0, y: 0,
            });
          },
        },
      });

      // EXIT phase (70% - 100%)
      scrollTl
        .fromTo(headlineRef.current, { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(microcopyRef.current, { x: 0, opacity: 1 }, { x: '-12vw', opacity: 0, ease: 'power2.in' }, 0.72)
        .fromTo(ctaRef.current, { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0, ease: 'power2.in' }, 0.75)
        .fromTo(navRef.current, { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0, ease: 'power2.in' }, 0.75)
        .fromTo(wordmarkRef.current, { y: 0, opacity: 1 }, { y: '-8vh', opacity: 0, ease: 'power2.in' }, 0.78)
        .fromTo(scrollHintRef.current, { opacity: 0.7 }, { opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(bgRef.current, { opacity: 1 }, { opacity: 0.3, ease: 'power2.in' }, 0.8);

    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned z-10"
      style={{ backgroundColor: '#F4EFE6' }}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/hero_dragon.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(244, 239, 230, 0.5) 100%)',
          }}
        />
      </div>

      {/* Wordmark (top-left) - Empty placeholder to satisfy GSAP reference */}
      <div
        ref={wordmarkRef}
        className="absolute z-20"
        style={{ left: '4vw', top: '4vh' }}
      />

      {/* Nav (top-right) */}
      <nav
        ref={navRef}
        className="absolute z-20 flex items-center gap-8"
        style={{ right: '4vw', top: '4.2vh' }}
      >
        <SignedIn>
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{ 
              elements: { 
                avatarBox: "w-9 h-9 border border-[#D4A24F]/35 rounded-full hover:scale-105 transition-all shadow-md shadow-[#D4A24F]/10",
                userButtonPopoverCard: "bg-[#14171B] border border-[#D4A24F]/20 rounded-xl shadow-2xl text-[#F4EFE6] p-1",
                userButtonPopoverActions: "bg-[#14171B]",
                userButtonPopoverActionButton: "hover:bg-white/5 text-[#F4EFE6] transition-all py-2.5 px-3 rounded-lg",
                userButtonPopoverActionButtonText: "text-[#F4EFE6] font-medium font-body text-sm",
                userButtonPopoverActionButtonIcon: "text-[#D4A24F]",
                userButtonPopoverFooter: "hidden",
                userPreviewSecondaryIdentifier: "text-[#A3A69A]/80 font-body text-xs",
                userPreviewMainIdentifier: "text-[#F4EFE6] font-bold font-body text-sm",
              } 
            }} 
          />
        </SignedIn>
      </nav>

      {/* Central content container */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
        style={{ paddingBottom: '4vh' }}
      >
        <div className="flex flex-col items-center justify-center gap-6 max-w-[70vw] text-center pointer-events-auto">
          {/* Headline */}
          <h1
            ref={headlineRef}
            className="font-display font-bold text-text-primary leading-hero"
            style={{
              fontSize: 'clamp(36px, 6vw, 96px)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textShadow: '0 2px 30px rgba(244, 239, 230, 0.8)',
            }}
          >
            dragon gpt
          </h1>

          {/* Microcopy */}
          <p
            ref={microcopyRef}
            className="font-body text-text-secondary max-w-[52ch] mb-4"
            style={{
              fontSize: 'clamp(14px, 1.2vw, 18px)',
              lineHeight: 1.6,
              textShadow: '0 1px 10px rgba(244, 239, 230, 0.9)',
            }}
          >
            A generative academy where myth meets craft—train creatures, forge stories, and bring worlds to life.
          </p>

          {/* CTA (Centered below microcopy) */}
          <Link
            href={isSignedIn ? "/chat" : "/sign-in"}
            ref={ctaRef as any}
            className="btn-lift font-body text-sm font-bold tracking-wider px-8 py-3.5 rounded-full flex items-center justify-center transition-all z-20 shadow-lg shadow-[#D4A24F]/10 border border-[#D4A24F]/20 hover:scale-105 active:scale-95 animate-pulse"
            style={{
              backgroundColor: '#D4A24F',
              color: '#14171B',
            }}
          >
            {isSignedIn ? "Enter Chat" : "Sign In"}
          </Link>
        </div>
      </div>

      {/* Scroll hint (bottom-center) */}
      <div
        ref={scrollHintRef}
        className="absolute z-20 flex flex-col items-center gap-2 scroll-hint-animate"
        style={{ left: '50%', top: '88%', transform: 'translateX(-50%)' }}
      >
        <span className="font-body text-xs tracking-widest text-text-secondary uppercase">
          Scroll
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-secondary">
          <path d="M8 3L8 13M8 13L3 8M8 13L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
