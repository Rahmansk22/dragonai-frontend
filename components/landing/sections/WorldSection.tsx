import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EmbercrestEmblem from '../components/EmbercrestEmblem';

gsap.registerPlugin(ScrollTrigger);

interface Location {
  id: number;
  name: string;
  description: string;
}

const locations: Location[] = [
  { id: 1, name: 'The Ember Reach', description: 'coastlines of first flame' },
  { id: 2, name: 'Sunken Archives', description: 'ruins that remember' },
  { id: 3, name: 'Starwind Crags', description: 'peaks where dragons roost' },
];

const WorldSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const [activeLocation, setActiveLocation] = useState<number | null>(null);

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
        .fromTo(collageRef.current,
          { x: '70vw', scale: 0.96, opacity: 0 },
          { x: 0, scale: 1, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(titleRef.current,
          { x: '-30vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        );

      // List items staggered entrance
      const listItems = listRef.current?.children;
      if (listItems) {
        Array.from(listItems).forEach((item, i) => {
          scrollTl.fromTo(item,
            { x: '-12vw', opacity: 0 },
            { x: 0, opacity: 1, ease: 'none' },
            0.05 + i * 0.04
          );
        });
      }

      scrollTl
        .fromTo(emblemRef.current,
          { y: '10vh', scale: 0.85, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, ease: 'none' },
          0.1
        )
        .fromTo(taglineRef.current,
          { y: '6vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.15
        );

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(collageRef.current,
          { x: 0, opacity: 1 },
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(titleRef.current,
          { y: 0, opacity: 1 },
          { y: '-10vh', opacity: 0, ease: 'power2.in' },
          0.7
        );

      if (listItems) {
        Array.from(listItems).forEach((item) => {
          scrollTl.fromTo(item,
            { x: 0, opacity: 1 },
            { x: '-8vw', opacity: 0, ease: 'power2.in' },
            0.72
          );
        });
      }

      scrollTl
        .fromTo(emblemRef.current,
          { y: 0, scale: 1, opacity: 1 },
          { y: '10vh', scale: 0.9, opacity: 0, ease: 'power2.in' },
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

  return (
    <section
      ref={sectionRef}
      id="world"
      className="section-pinned z-30"
      style={{ backgroundColor: '#F4EFE6' }}
    >
      {/* Subtle map texture background */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A24F' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Right collage frame (map panels) */}
      <div
        ref={collageRef}
        className="absolute z-10 right-0 top-0 h-full overflow-hidden"
        style={{ width: '62vw' }}
      >
        <div className="relative w-full h-full">
          {/* Panel 1 - top, offset */}
          <div
            className="absolute rounded-2xl overflow-hidden shadow-card"
            style={{
              width: '55%',
              height: '45%',
              right: '5%',
              top: '5%',
            }}
          >
            <img
              src="/map_panel_1.jpg"
              alt="The Ember Reach"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Panel 2 - middle, offset left */}
          <div
            className="absolute rounded-2xl overflow-hidden shadow-card"
            style={{
              width: '50%',
              height: '40%',
              left: '3%',
              top: '30%',
            }}
          >
            <img
              src="/map_panel_2.jpg"
              alt="Sunken Archives"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Panel 3 - bottom, offset right */}
          <div
            className="absolute rounded-2xl overflow-hidden shadow-card"
            style={{
              width: '52%',
              height: '42%',
              right: '8%',
              bottom: '5%',
            }}
          >
            <img
              src="/map_panel_3.jpg"
              alt="Starwind Crags"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Left vertical label + title */}
      <div
        ref={titleRef}
        className="absolute z-20"
        style={{ left: '3.2vw', top: '14vh' }}
      >
        <span
          className="font-body tracking-widest-custom uppercase text-text-secondary block mb-2"
          style={{ fontSize: '12px' }}
        >
          Explore
        </span>
        <h2
          className="font-display font-bold text-text-primary uppercase"
          style={{
            fontSize: 'clamp(40px, 5vw, 80px)',
            letterSpacing: '0.06em',
            lineHeight: 0.95,
          }}
        >
          The World
        </h2>
      </div>

      {/* Left chapter list */}
      <div
        ref={listRef}
        className="absolute z-20"
        style={{ left: '3.2vw', top: '34vh', width: '28vw' }}
      >
        {locations.map((loc) => (
          <button
            key={loc.id}
            onMouseEnter={() => setActiveLocation(loc.id)}
            onMouseLeave={() => setActiveLocation(null)}
            className="block w-full text-left py-4 border-b transition-all duration-300 group"
            style={{
              borderColor: 'rgba(20, 23, 27, 0.08)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: activeLocation === loc.id ? '#D4A24F' : 'rgba(20, 23, 27, 0.2)',
                  transform: activeLocation === loc.id ? 'scale(1.5)' : 'scale(1)',
                }}
              />
              <span
                className="font-display font-semibold transition-colors duration-300"
                style={{
                  fontSize: 'clamp(16px, 1.4vw, 22px)',
                  color: activeLocation === loc.id ? '#D4A24F' : '#14171B',
                }}
              >
                {loc.name}
              </span>
            </div>
            <p
              className="font-body text-text-secondary mt-1 ml-5 transition-all duration-300"
              style={{
                fontSize: 'clamp(11px, 0.85vw, 14px)',
                opacity: activeLocation === loc.id ? 1 : 0.7,
                transform: activeLocation === loc.id ? 'translateX(4px)' : 'translateX(0)',
              }}
            >
              {loc.description}
            </p>
          </button>
        ))}
      </div>

      {/* Bottom-left emblem */}
      <div
        ref={emblemRef}
        className="absolute z-20"
        style={{ left: '3.2vw', bottom: '6vh' }}
      >
        <EmbercrestEmblem size={44} />
      </div>

      {/* Bottom-right tagline */}
      <div
        ref={taglineRef}
        className="absolute z-20"
        style={{ right: '4vw', bottom: '7vh' }}
      >
        <p
          className="font-display font-semibold text-text-primary uppercase"
          style={{
            fontSize: 'clamp(18px, 2vw, 32px)',
            letterSpacing: '0.04em',
          }}
        >
          Train with Legends
        </p>
      </div>
    </section>
  );
};

export default WorldSection;
