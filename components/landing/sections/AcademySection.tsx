import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AcademySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const crestRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(crestRef.current,
          { y: '60vh', scale: 0.85, rotation: -2, opacity: 0 },
          { y: 0, scale: 1, rotation: 0, opacity: 0.22, ease: 'none' },
          0
        )
        .fromTo(leftCardRef.current,
          { x: '-40vw', rotation: -2, opacity: 0 },
          { x: 0, rotation: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(rightCardRef.current,
          { x: '40vw', rotation: 2, opacity: 0 },
          { x: 0, rotation: 0, opacity: 1, ease: 'none' },
          0.02
        )
        .fromTo(taglineRef.current,
          { y: '12vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.05
        );

      // SETTLE (30% - 70%) - elements hold position

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(crestRef.current,
          { y: 0, scale: 1, opacity: 0.22 },
          { y: '-35vh', scale: 0.92, opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(leftCardRef.current,
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(rightCardRef.current,
          { x: 0, opacity: 1 },
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(taglineRef.current,
          { y: 0, opacity: 1 },
          { y: '-8vh', opacity: 0, ease: 'power2.in' },
          0.75
        );

    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="academy"
      className="section-pinned z-20"
      style={{ backgroundColor: '#F4EFE6' }}
    >
      {/* Background vignette */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.06) 100%)',
        }}
      />

      {/* Large gold crest (center stage) */}
      <div
        ref={crestRef}
        className="absolute z-0 crest-rotate"
        style={{
          left: '50%',
          top: '54%',
          transform: 'translate(-50%, -50%)',
          width: 'min(56vw, 72vh)',
          height: 'min(56vw, 72vh)',
        }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="100" cy="100" r="95" stroke="#D4A24F" strokeWidth="1" fill="none" opacity="0.3" />
          <circle cx="100" cy="100" r="80" stroke="#D4A24F" strokeWidth="0.6" fill="none" opacity="0.2" />
          <circle cx="100" cy="100" r="65" stroke="#D4A24F" strokeWidth="0.4" fill="none" opacity="0.15" />
          {/* Ornate patterns */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 88 * Math.cos(rad);
            const y1 = 100 + 88 * Math.sin(rad);
            const x2 = 100 + 95 * Math.cos(rad);
            const y2 = 100 + 95 * Math.sin(rad);
            return (
              <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4A24F" strokeWidth="1.5" opacity="0.4" />
            );
          })}
          {/* Center dragon emblem */}
          <path
            d="M100 55 C97 55, 94 57, 93 60 C92 63, 92 66, 93 69 C90 68, 87 68, 85 70 C83 72, 83 75, 85 78 C82 77, 79 78, 77 81 C76 84, 77 87, 80 89 C78 90, 78 93, 80 96 C82 99, 85 100, 88 99 C88 102, 90 105, 93 107 C95 108, 98 108, 100 106 C102 108, 105 108, 107 107 C110 105, 112 102, 112 99 C115 100, 118 99, 120 96 C122 93, 122 90, 120 89 C123 87, 124 84, 123 81 C121 78, 118 77, 115 78 C117 75, 117 72, 115 70 C113 68, 110 68, 107 69 C108 66, 108 63, 107 60 C106 57, 103 55, 100 55Z"
            fill="#D4A24F"
            opacity="0.12"
            stroke="#D4A24F"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      {/* Left info card */}
      <div
        ref={leftCardRef}
        className="absolute z-10 parchment-card rounded-2xl p-8 shadow-card"
        style={{
          left: '7vw',
          top: '18vh',
          width: 'clamp(280px, 28vw, 420px)',
        }}
      >
        <h2
          className="font-display font-bold text-text-primary mb-4"
          style={{
            fontSize: 'clamp(24px, 2.5vw, 40px)',
            lineHeight: 1.1,
            letterSpacing: '0.02em',
          }}
        >
          Unlock a world of mythic storytelling
        </h2>
        <p className="font-body text-text-secondary" style={{ fontSize: 'clamp(13px, 1vw, 16px)', lineHeight: 1.6 }}>
          Dragon Academy blends illustration, lore, and generative craft—so you can design creatures, worlds, and scenes with coherence.
        </p>
      </div>

      {/* Right sign-up card */}
      <div
        ref={rightCardRef}
        className="absolute z-10 parchment-card rounded-2xl p-8 shadow-card"
        style={{
          right: '7vw',
          top: '22vh',
          width: 'clamp(260px, 26vw, 380px)',
        }}
      >
        <h3
          className="font-display font-semibold text-text-primary mb-2"
          style={{ fontSize: 'clamp(20px, 1.8vw, 28px)' }}
        >
          Get early access
        </h3>
        <p className="font-body text-text-secondary mb-6" style={{ fontSize: 'clamp(12px, 0.9vw, 14px)', lineHeight: 1.6 }}>
          Join the waitlist for the full academy experience.
        </p>

        {submitted ? (
          <div className="text-center py-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-2 text-gold">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
              <path d="M10 16L14 20L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-body text-text-primary text-sm">You're on the list!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 font-body text-sm px-4 py-3 rounded-lg bg-white/60 border border-black/8 text-text-primary placeholder:text-text-secondary/60"
              required
            />
            <button
              type="submit"
              className="btn-lift font-body text-sm font-medium px-5 py-3 rounded-lg"
              style={{ backgroundColor: '#D4A24F', color: '#14171B' }}
            >
              Join
            </button>
          </form>
        )}
      </div>

      {/* Bottom tagline */}
      <div
        ref={taglineRef}
        className="absolute z-10 text-center"
        style={{ left: '50%', top: '84%', transform: 'translateX(-50%)' }}
      >
        <p
          className="font-display font-bold text-text-primary uppercase"
          style={{
            fontSize: 'clamp(28px, 3.5vw, 56px)',
            letterSpacing: '0.06em',
            lineHeight: 1,
            textShadow: '0 2px 20px rgba(244, 239, 230, 0.8)',
          }}
        >
          Learn to Train Dragons
        </p>
      </div>
    </section>
  );
};

export default AcademySection;
