import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Creature {
  id: number;
  name: string;
  image: string;
  position: { top: string; left: string; width: string; height: string };
  entranceTransform: { x: string; y: string; rotate: number };
}

const creatures: Creature[] = [
  {
    id: 1,
    name: 'Emberwing',
    image: '/creature_emberwing.jpg',
    position: { top: '8%', left: '5%', width: '48%', height: '38%' },
    entranceTransform: { x: '40vw', y: '-30vh', rotate: 3 },
  },
  {
    id: 2,
    name: 'Forest Drake',
    image: '/creature_forest_drake.jpg',
    position: { top: '5%', left: '56%', width: '40%', height: '35%' },
    entranceTransform: { x: '55vw', y: '-10vh', rotate: -2 },
  },
  {
    id: 3,
    name: 'Crystal Wyvern',
    image: '/crystal_wyvern.jpg',
    position: { top: '52%', left: '8%', width: '42%', height: '40%' },
    entranceTransform: { x: '35vw', y: '35vh', rotate: 2 },
  },
  {
    id: 4,
    name: 'Ice Serpent',
    image: '/ice_serpent.jpg',
    position: { top: '48%', left: '53%', width: '44%', height: '42%' },
    entranceTransform: { x: '50vw', y: '25vh', rotate: -3 },
  },
];

const CreaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredCreature, setHoveredCreature] = useState<number | null>(null);

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
          { x: '-40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(captionRef.current,
          { y: '10vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.08
        );

      // Collage tiles staggered entrance
      tileRefs.current.forEach((tile, i) => {
        if (tile) {
          const creature = creatures[i];
          scrollTl.fromTo(tile,
            {
              x: creature.entranceTransform.x,
              y: creature.entranceTransform.y,
              rotation: creature.entranceTransform.rotate,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              opacity: 1,
              ease: 'none',
            },
            0.02 + i * 0.03
          );
        }
      });

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(headlineRef.current,
          { x: 0, opacity: 1 },
          { x: '-14vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(captionRef.current,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.72
        );

      tileRefs.current.forEach((tile) => {
        if (tile) {
          scrollTl.fromTo(tile,
            { x: 0, opacity: 1 },
            { x: '-10vw', opacity: 0, ease: 'power2.in' },
            0.75
          );
        }
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="creatures"
      className="section-pinned z-40"
      style={{ backgroundColor: '#F4EFE6' }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 30% 70%, rgba(212, 162, 79, 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Left headline block */}
      <div
        ref={headlineRef}
        className="absolute z-20"
        style={{ left: '4vw', top: '22vh', width: 'clamp(280px, 32vw, 450px)' }}
      >
        <h2
          className="font-display font-bold text-text-primary uppercase mb-4"
          style={{
            fontSize: 'clamp(32px, 4vw, 64px)',
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}
        >
          Discover Legendary Creatures
        </h2>
        <p
          className="font-body text-text-secondary"
          style={{ fontSize: 'clamp(13px, 1vw, 16px)', lineHeight: 1.6, maxWidth: '38ch' }}
        >
          From hatchling sketches to fully rendered guardians—build a bestiary with style, anatomy, and story.
        </p>
      </div>

      {/* Bottom-left caption */}
      <div
        ref={captionRef}
        className="absolute z-20"
        style={{ left: '4vw', bottom: '10vh', width: 'clamp(240px, 30vw, 380px)' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-gold" />
          <span className="font-body text-xs tracking-widest-custom uppercase text-text-secondary">
            Featured
          </span>
        </div>
        <p
          className="font-display font-semibold text-text-primary"
          style={{ fontSize: 'clamp(16px, 1.4vw, 22px)' }}
        >
          Meet the Emberwing — swift, loyal, and fierce.
        </p>
      </div>

      {/* Collage container (right 60%) */}
      <div
        ref={collageRef}
        className="absolute z-10 right-0 top-0 h-full"
        style={{ width: '60vw' }}
      >
        <div className="relative w-full h-full">
          {creatures.map((creature, i) => (
            <div
              key={creature.id}
              ref={(el) => { tileRefs.current[i] = el; }}
              className="absolute rounded-2xl overflow-hidden shadow-card cursor-pointer transition-transform duration-300"
              style={{
                ...creature.position,
                transform: hoveredCreature === creature.id ? 'scale(1.03)' : 'scale(1)',
                zIndex: hoveredCreature === creature.id ? 10 : 1,
              }}
              onMouseEnter={() => setHoveredCreature(creature.id)}
              onMouseLeave={() => setHoveredCreature(null)}
            >
              <img
                src={creature.image}
                alt={creature.name}
                className="w-full h-full object-cover transition-transform duration-500"
                style={{
                  transform: hoveredCreature === creature.id ? 'scale(1.08)' : 'scale(1)',
                }}
              />
              {/* Hover overlay with name */}
              <div
                className="absolute inset-0 flex items-end p-4 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(to top, rgba(15, 17, 19, 0.7) 0%, transparent 50%)',
                  opacity: hoveredCreature === creature.id ? 1 : 0,
                }}
              >
                <span
                  className="font-display font-semibold text-parchment uppercase tracking-wider"
                  style={{ fontSize: 'clamp(14px, 1.2vw, 20px)' }}
                >
                  {creature.name}
                </span>
              </div>
            </div>
          ))}

          {/* Vertical text tile */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              right: '2%',
              top: '42%',
              width: '6%',
              height: '16%',
            }}
          >
            <span
              className="font-display font-bold text-gold uppercase whitespace-nowrap"
              style={{
                fontSize: 'clamp(10px, 0.8vw, 14px)',
                letterSpacing: '0.2em',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                opacity: 0.6,
              }}
            >
              Bestiary
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreaturesSection;
