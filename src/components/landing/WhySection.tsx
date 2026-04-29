"use client";

import { motion } from "framer-motion";
import { Eye, TrendingUp, Brain } from "lucide-react";

const benefits = [
  {
    icon: Eye,
    title: "Crystal Clarity",
    description:
      "When you can see your thoughts mapped out, confusion dissolves. The path forward becomes immediately obvious.",
    color: "#00f0ff",
  },
  {
    icon: TrendingUp,
    title: "Better Decisions",
    description:
      "Understand the chain of cause and effect. Spot which problems are blocking your goals and tackle them first.",
    color: "#7a00ff",
  },
  {
    icon: Brain,
    title: "Visual Thinking",
    description:
      "70% of people are visual thinkers. This is the tool that matches how your brain actually works.",
    color: "#ff00c8",
  },
];

export default function WhySection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-28">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-12 backdrop-blur-lg md:p-16"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 80px rgba(0,240,255,0.05)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#7a00ff]">
            The Benefits
          </p>
          <h2 className="text-4xl font-black md:text-5xl">
            Why Use{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #7a00ff, #ff00c8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              This?
            </span>
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  background: `${b.color}15`,
                  border: `1px solid ${b.color}40`,
                  color: b.color,
                  boxShadow: `0 0 20px ${b.color}22`,
                }}
              >
                <b.icon size={30} />
              </div>
              <h3 className="text-xl font-bold text-white">{b.title}</h3>
              <p className="text-sm leading-relaxed text-white/50">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
