import React from 'react';
import { BookOpen, Code, Image as ImageIcon, Sparkles, Zap, Bot } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-[#D4A24F]" />,
      title: "Forge Stories & Lore",
      description: "Craft deep, cohesive worlds, fantasy characters, and detailed mythologies. Dragon GPT possesses rich contextual memory for long-form narrative structure."
    },
    {
      icon: <Code className="w-6 h-6 text-[#D4A24F]" />,
      title: "Write Intelligent Code",
      description: "Generative assistance designed for developers. Ask for custom algorithms, write templates, and debug with standard-compliant syntax highlighting."
    },
    {
      icon: <ImageIcon className="w-6 h-6 text-[#D4A24F]" />,
      title: "Create Art & Concepts",
      description: "Synthesize high-fidelity concept art, character models, and fantasy landscapes directly in chat using state-of-the-art image models."
    }
  ];

  const specs = [
    {
      icon: <Zap className="w-5 h-5 text-[#D4A24F]" />,
      title: "Groq Speed Inference",
      detail: "Near-instant response generation powered by high-speed Groq Llama and Gemini models."
    },
    {
      icon: <Bot className="w-5 h-5 text-[#D4A24F]" />,
      title: "Custom Companions",
      detail: "Create and train your own custom bots with specialized personas and tailored knowledge bases."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#D4A24F]" />,
      title: "Premium Aesthetics",
      detail: "Sleek glassmorphic components, cinematic ember animations, and high-fidelity layout styling."
    }
  ];

  return (
    <section className="relative bg-[#0F1113] text-[#F4EFE6] py-20 px-[6vw] border-t border-white/5 overflow-hidden">
      {/* Background radial gradient glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20 z-0"
        style={{
          background: "radial-gradient(circle, rgba(212, 162, 79, 0.1) 0%, transparent 70%)"
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#D4A24F] uppercase tracking-wider mb-4">
            Myth Meets Logic
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#A3A69A] max-w-xl mx-auto leading-relaxed">
            Dragon GPT unites mythic storytelling with intelligent computing. Explore the three pillars of generative craft.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl bg-[#14171B]/40 border border-white/5 premium-glass hover:border-[#D4A24F]/35 transition-all duration-300 group hover:scale-[1.02] shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-[#D4A24F]/10 border border-[#D4A24F]/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-[#F4EFE6] tracking-wide mb-2">
                {f.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#A3A69A] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>

        {/* Tech Specs Header */}
        <div className="border-t border-white/5 pt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="p-2.5 rounded-lg bg-[#D4A24F]/10 border border-[#D4A24F]/20 flex items-center justify-center flex-shrink-0">
                {s.icon}
              </div>
              <div>
                <h4 className="font-body font-bold text-sm text-[#F4EFE6] mb-1 tracking-wide">
                  {s.title}
                </h4>
                <p className="font-body text-xs text-[#A3A69A] leading-relaxed">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
