"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Animated gradient background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(122,0,255,0.18) 0%, rgba(0,240,255,0.06) 50%, transparent 100%)",
        }}
      />
      <ParticleBackground />

      {/* Glowing orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -left-40 top-1/4 h-96 w-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #7a00ff 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #00f0ff 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-md"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#00f0ff]" />
          <span className="text-white/70">AI-Powered Thought Mapping</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-7xl lg:text-8xl"
        >
          <span
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #a0a0ff 50%, #00f0ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Neural
          </span>{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #7a00ff 0%, #ff00c8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Thought
          </span>
          <br />
          <span className="text-white">Space</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="max-w-xl text-lg text-white/60 md:text-xl"
        >
          Transform your thoughts into a living visual network. See
          connections, resolve contradictions, think clearer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link href="/space">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-full px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #7a00ff 0%, #00f0ff 100%)",
                boxShadow: "0 0 30px rgba(122,0,255,0.5), 0 0 60px rgba(0,240,255,0.2)",
              }}
            >
              <span className="relative z-10">Enter Thought Space →</span>
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(135deg, #ff00c8 0%, #7a00ff 100%)",
                }}
              />
            </motion.button>
          </Link>

          <a href="#how-it-works">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white/80 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/10"
            >
              See How It Works
            </motion.button>
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex gap-10 text-center"
        >
          {[
            { label: "Thoughts Mapped", value: "10K+" },
            { label: "Clarity Boost", value: "94%" },
            { label: "Avg. Graph Nodes", value: "~12" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-2xl font-black text-[#00f0ff]">{s.value}</span>
              <span className="text-xs text-white/40">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-xs text-white/30">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="h-8 w-5 rounded-full border border-white/20 p-1"
        >
          <div className="h-2 w-full rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
