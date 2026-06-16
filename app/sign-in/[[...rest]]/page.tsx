"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import EmberParticles from "../../../components/landing/components/EmberParticles";

export default function SignInPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#0F1113] relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 z-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(212, 162, 79, 0.08) 0%, transparent 70%)"
        }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <EmberParticles />
      </div>

      {/* Left side: Premium Branding (hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-12 z-10 border-r border-[#D4A24F]/10">
        {/* Background Image with heavy vignette */}
        <div
          className="absolute inset-0 z-0 opacity-55"
          style={{
            backgroundImage: 'url(/hero_dragon.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1113]/90 via-[#0F1113]/80 to-[#0F1113]" />
          <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 30%, #0F1113 100%)" />
        </div>

        {/* Top brand header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full border border-[#D4A24F]/35 overflow-hidden flex items-center justify-center bg-[#14171B] isolate">
            <img src="/hero_dragon.jpg" alt="Dragon GPT" className="w-full h-full object-cover scale-[1.15] object-center relative z-10" />
          </div>
          <span className="text-xl font-extrabold text-[#D4A24F] tracking-widest uppercase font-display">
            Dragon GPT
          </span>
        </div>

        {/* Central visual statement */}
        <div className="relative z-10 max-w-lg my-auto">
          <h1 className="font-display font-bold text-4xl xl:text-5xl text-[#F4EFE6] leading-tight mb-6 uppercase tracking-wide">
            Forge stories & <br />
            <span className="text-[#D4A24F]">train creatures</span>
          </h1>
          <p className="font-body text-sm sm:text-base text-[#A3A69A] leading-relaxed mb-8">
            A generative academy where myth meets craft—train creatures, forge stories, and bring worlds to life.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#D4A24F] shadow-[0_0_8px_#D4A24F]" />
              <span className="text-xs text-[#F4EFE6]/80 font-medium">Glassmorphic Cinematic Interfaces</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#D4A24F] shadow-[0_0_8px_#D4A24F]" />
              <span className="text-xs text-[#F4EFE6]/80 font-medium">Groq & Gemini Inference Speed</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#D4A24F] shadow-[0_0_8px_#D4A24F]" />
              <span className="text-xs text-[#F4EFE6]/80 font-medium">Persistent Multi-Agent Context Memory</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright/indicator */}
        <div className="relative z-10 text-xs text-[#A3A69A]/50 font-body">
          &copy; 2026 Dragon GPT Academy. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Card */}
      <div className="flex lg:col-span-5 flex-col items-center justify-center p-6 sm:p-12 z-10">
        {/* Mobile-only branding header */}
        <div className="flex lg:hidden items-center gap-2.5 mb-8">
          <div className="relative w-8 h-8 rounded-full border border-[#D4A24F]/35 overflow-hidden flex items-center justify-center bg-[#14171B] isolate">
            <img src="/hero_dragon.jpg" alt="Dragon GPT" className="w-full h-full object-cover scale-[1.15] object-center relative z-10" />
          </div>
          <span className="text-lg font-extrabold text-[#D4A24F] tracking-widest uppercase font-display">
            Dragon GPT
          </span>
        </div>

        <div className="w-full max-w-[400px]">
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                card: 'bg-[#14171B]/90 border border-[#D4A24F]/20 rounded-2xl shadow-2xl backdrop-blur-md p-6 sm:p-8 w-full',
                headerTitle: 'text-[#D4A24F] text-2xl font-bold tracking-wide font-display uppercase text-center w-full',
                headerSubtitle: 'text-[#A3A69A]/80 text-sm font-body text-center w-full mt-1.5',
                formButtonPrimary: 'bg-[#D4A24F] hover:bg-[#D4A24F]/85 active:scale-98 text-[#14171B] font-bold rounded-xl transition-all uppercase tracking-wider text-xs shadow-lg shadow-[#D4A24F]/10 border-0 py-3 w-full cursor-pointer',
                socialButtonsBlockButton: 'bg-[#0F1113] hover:bg-white/5 text-[#F4EFE6] border border-white/5 rounded-xl transition-all py-2.5 w-full cursor-pointer',
                socialButtonsBlockButtonText: 'text-[#F4EFE6] font-medium font-body text-sm',
                formFieldLabel: 'text-[#F4EFE6]/80 text-xs font-semibold uppercase tracking-wider mb-1.5 font-body',
                formFieldInput: 'bg-[#0F1113] border border-white/5 text-[#F4EFE6] rounded-xl focus:border-[#D4A24F]/40 focus:ring-1 focus:ring-[#D4A24F]/40 transition-all py-2.5 px-4 w-full',
                footerActionLink: 'text-[#D4A24F] hover:text-[#D4A24F]/80 transition-all font-semibold font-body text-sm',
                footerActionText: 'text-[#A3A69A]/80 font-body text-sm',
                logoBox: 'hidden',
                dividerLine: 'bg-white/5',
                dividerText: 'text-[#A3A69A]/40 text-xs font-body uppercase tracking-wider',
                identityPreviewText: 'text-[#F4EFE6] font-body',
                identityPreviewEditButtonIcon: 'text-[#D4A24F]',
                formResendCodeLink: 'text-[#D4A24F] hover:text-[#D4A24F]/80 font-body font-semibold',
              },
              variables: {
                colorPrimary: '#D4A24F',
                colorBackground: '#14171B',
                colorText: '#F4EFE6',
                colorInputBackground: '#0F1113',
                colorInputText: '#F4EFE6',
                colorBorder: '#D4A24F',
              },
            }}
          />
        </div>

        {/* Back to Home Link */}
        <Link 
          href="/" 
          className="mt-8 text-xs text-[#A3A69A]/60 hover:text-[#D4A24F] transition-all font-body tracking-wider uppercase flex items-center gap-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M5 12l7-7m-7 7l7 7" />
          </svg>
          Back to portal
        </Link>
      </div>
    </div>
  );
}

