
"use client";
export const dynamic = "force-dynamic";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Image } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "../lib/clerk";

export default function Page() {
  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-20 bg-[#0a0e17]/90 border-b-0 border-transparent backdrop-blur flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shadow-lg bg-white">
            <img src="/hero.jpg" alt="Hero Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">Dragon AI</span>
        </div>
        {/* Removed Playground, Integrations, and Community links from navbar */}
        <div className="hidden md:flex items-center gap-8"></div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in" className="text-[#b3b8c5] hover:text-white transition text-base font-medium">Sign In</Link>
            <Link href="/sign-up" className="px-5 py-2 rounded-full bg-gradient-to-tr from-[#3b82f6] via-[#6366f1] to-[#a78bfa] text-white font-semibold shadow-lg hover:from-[#2563eb] hover:to-[#a78bfa] transition">Sign Up</Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
          </SignedIn>
        </div>
      </nav>
      <motion.section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 bg-[#0a0e17]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "50px 50px"
        }}
      />
      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3b82f6]/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a78bfa]/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      <motion.div
        className="container mx-auto px-6 relative z-10"
        animate={{ y: [0, -10, 0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="max-w-4xl mx-auto text-center"
          animate={{ x: [0, 10, 0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#151a23] border border-[#2a3140] mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-sm text-[#b3b8c5]">Powered by Advanced Dragon AI</span>
          </motion.div>
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Dragaon AI
            <span className="bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent"> Text & Image</span>
            <br />AI Generation
          </motion.h1>
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-[#b3b8c5] mb-10 max-w-2xl mx-auto"
          >
            Experience the next generation of AI-powered creativity. Generate stunning images 
            and engaging content with our intelligent chatbot in seconds.
          </motion.p>
          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/chat"
              className="px-8 py-3 rounded-full bg-gradient-to-tr from-[#3b82f6] via-[#6366f1] to-[#a78bfa] text-white font-bold text-lg shadow-lg hover:from-[#2563eb] hover:to-[#a78bfa] transition flex items-center gap-2"
            >
              <span>Start Chat</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
        {/* Floating elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute left-10 top-1/3 hidden lg:block"
        >
          <div className="bg-[#151a23] border border-[#2a3140] rounded-2xl p-4 animate-float">
            <MessageSquare className="w-8 h-8 text-[#3b82f6]" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute right-10 top-1/2 hidden lg:block"
        >
          <div className="bg-[#151a23] border border-[#2a3140] rounded-2xl p-4 animate-float-delayed">
            <Image className="w-8 h-8 text-[#a78bfa]" />
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
    </>
  );
}
