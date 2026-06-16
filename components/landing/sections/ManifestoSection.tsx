import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ManifestoSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invited, setInvited] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Manifesto block scroll animation
      gsap.fromTo(manifestoRef.current,
        { y: '8vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 0.5,
          },
        }
      );

      // Wordmark + links
      gsap.fromTo([wordmarkRef.current, linksRef.current],
        { y: '4vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'top 30%',
            scrub: 0.5,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      setInvited(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section-flowing night-theme"
      style={{ minHeight: '60vh', paddingTop: '12vh', paddingBottom: '8vh' }}
    >
      {/* Center manifesto block */}
      <div
        ref={manifestoRef}
        className="max-w-2xl mx-auto text-center px-6"
      >
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-px bg-gold/40" />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gold">
            <path d="M8 2L9.5 6.5H14L10.5 9.5L12 14L8 11L4 14L5.5 9.5L2 6.5H6.5L8 2Z" fill="currentColor" opacity="0.6" />
          </svg>
          <div className="w-12 h-px bg-gold/40" />
        </div>

        <p
          className="font-display font-medium mb-8"
          style={{
            fontSize: 'clamp(18px, 1.8vw, 26px)',
            lineHeight: 1.5,
            color: 'rgba(244, 239, 230, 0.85)',
          }}
        >
          We're building a new kind of craft school—where myth becomes method, and every student becomes a worldbuilder.
        </p>

        {showInviteForm ? (
          invited ? (
            <div className="flex items-center justify-center gap-2 text-gold">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-body text-sm">Invitation requested!</span>
            </div>
          ) : (
            <form onSubmit={handleInviteSubmit} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Your email"
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
                Request
              </button>
            </form>
          )
        ) : (
          <button
            onClick={() => setShowInviteForm(true)}
            className="font-body text-sm tracking-wider uppercase transition-colors hover:text-gold"
            style={{ color: 'rgba(244, 239, 230, 0.6)' }}
          >
            Request an invite
          </button>
        )}
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-[4vw] pb-[4vh]"
      >
        {/* Wordmark */}
        <div ref={wordmarkRef} className="flex items-center gap-3">
          <span
            className="font-display font-semibold tracking-wider"
            style={{ color: 'rgba(244, 239, 230, 0.5)', fontSize: '16px' }}
          >
            Dragon GPT
          </span>
        </div>

        {/* Links */}
        <div ref={linksRef} className="flex items-center gap-6">
          {['Contact', 'Instagram', 'Behance'].map((link) => (
            <a
              key={link}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`${link} - Coming soon!`);
              }}
              className="font-body text-sm transition-colors hover:text-gold"
              style={{ color: 'rgba(244, 239, 230, 0.5)' }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
