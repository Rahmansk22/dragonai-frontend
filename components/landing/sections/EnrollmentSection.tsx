import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EmbercrestEmblem from '../components/EmbercrestEmblem';
import EmberParticles from '../components/EmberParticles';

gsap.registerPlugin(ScrollTrigger);

const curriculumItems = [
  'Creature Anatomy & Motion',
  'Scene Composition & Lighting',
  'Lore Systems & Worldbuilding',
];

const EnrollmentSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
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
        .fromTo(headlineRef.current,
          { y: '40vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(bodyRef.current,
          { y: '20vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.05
        )
        .fromTo(cardRef.current,
          { x: '45vw', rotation: 2, opacity: 0 },
          { x: 0, rotation: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(emblemRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'none' },
          0.12
        )
        .fromTo(taglineRef.current,
          { opacity: 0 },
          { opacity: 1, ease: 'none' },
          0.15
        );

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(headlineRef.current,
          { y: 0, opacity: 1 },
          { y: '-18vh', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(bodyRef.current,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.72
        )
        .fromTo(cardRef.current,
          { x: 0, opacity: 1 },
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(emblemRef.current,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.75
        )
        .fromTo(taglineRef.current,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.78
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
      id="enrollment"
      className="section-pinned z-50 night-theme"
    >
      {/* Ember particles */}
      <EmberParticles />

      {/* Background texture */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(212, 162, 79, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Left headline */}
      <h2
        ref={headlineRef}
        className="absolute z-10 font-display font-bold uppercase"
        style={{
          left: '4vw',
          top: '18vh',
          width: 'clamp(300px, 40vw, 560px)',
          fontSize: 'clamp(32px, 4.5vw, 72px)',
          letterSpacing: '0.04em',
          lineHeight: 1,
          color: '#F4EFE6',
        }}
      >
        Begin Your Journey Today
      </h2>

      {/* Left body */}
      <p
        ref={bodyRef}
        className="absolute z-10 font-body"
        style={{
          left: '4vw',
          top: '44vh',
          width: 'clamp(260px, 34vw, 420px)',
          fontSize: 'clamp(13px, 1vw, 16px)',
          lineHeight: 1.6,
          color: 'rgba(244, 239, 230, 0.7)',
        }}
      >
        Get the newsletter: prompts, creature studies, and scene breakdowns—delivered weekly.
      </p>

      {/* Newsletter form below body */}
      <div
        className="absolute z-10"
        style={{ left: '4vw', top: '54vh', width: 'clamp(260px, 34vw, 420px)' }}
      >
        {submitted ? (
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gold">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-body text-sm" style={{ color: '#F4EFE6' }}>Welcome to Dragon Academy!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 font-body text-sm px-4 py-3 rounded-lg text-parchment placeholder:text-parchment/40"
              style={{
                background: 'rgba(244, 239, 230, 0.08)',
                border: '1px solid rgba(244, 239, 230, 0.12)',
              }}
              required
            />
            <button
              type="submit"
              className="btn-lift font-body text-sm font-medium px-5 py-3 rounded-lg"
              style={{ backgroundColor: '#D4A24F', color: '#14171B' }}
            >
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* Right curriculum card */}
      <div
        ref={cardRef}
        className="absolute z-10 glass-card rounded-2xl p-8"
        style={{
          right: '5vw',
          top: '22vh',
          width: 'clamp(260px, 28vw, 360px)',
        }}
      >
        <h3
          className="font-display font-semibold mb-6"
          style={{
            fontSize: 'clamp(18px, 1.6vw, 26px)',
            color: '#F4EFE6',
          }}
        >
          Curriculum Highlights
        </h3>
        <ul className="space-y-4">
          {curriculumItems.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: '#D4A24F' }}
              />
              <span
                className="font-body"
                style={{
                  fontSize: 'clamp(12px, 0.9vw, 15px)',
                  color: 'rgba(244, 239, 230, 0.8)',
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
        <button
          className="mt-6 font-body text-sm flex items-center gap-2 transition-colors hover:text-gold"
          style={{ color: 'rgba(244, 239, 230, 0.6)' }}
          onClick={() => alert('Full syllabus coming soon!')}
        >
          View full syllabus
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Bottom-left emblem */}
      <div
        ref={emblemRef}
        className="absolute z-10"
        style={{ left: '4vw', bottom: '8vh' }}
      >
        <EmbercrestEmblem size={40} />
      </div>

      {/* Bottom-center tagline */}
      <div
        ref={taglineRef}
        className="absolute z-10 text-center"
        style={{ left: '50%', top: '84%', transform: 'translateX(-50%)' }}
      >
        <p
          className="font-display font-semibold uppercase"
          style={{
            fontSize: 'clamp(20px, 2.5vw, 40px)',
            letterSpacing: '0.08em',
            color: '#F4EFE6',
          }}
        >
          Dragon Academy
        </p>
      </div>
    </section>
  );
};

export default EnrollmentSection;
