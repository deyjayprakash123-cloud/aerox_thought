"use client";

import { motion } from "framer-motion";
import { MessageSquareText, Cpu, Network } from "lucide-react";

const steps = [
  {
    icon: MessageSquareText,
    step: "01",
    title: "Input Thoughts",
    description:
      "Type anything on your mind — goals, problems, worries, ideas. No structure needed. Just write.",
    color: "#00f0ff",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Structures Them",
    description:
      "Our logic engine reads your words, detects intent, and categorises each thought automatically.",
    color: "#7a00ff",
  },
  {
    icon: Network,
    step: "03",
    title: "Visual Graph Appears",
    description:
      "Watch your mental map come alive — nodes expand outward, edges draw, connections reveal themselves.",
    color: "#ff00c8",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#7a00ff]">
          Simple Process
        </p>
        <h2 className="text-4xl font-black md:text-5xl">
          How It{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #7a00ff, #00f0ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Works
          </span>
        </h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${step.color}22 0%, transparent 70%)`,
                boxShadow: `0 0 40px ${step.color}33`,
              }}
            />
            <div
              className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
              style={{
                background: `${step.color}15`,
                border: `1px solid ${step.color}40`,
                color: step.color,
              }}
            >
              <step.icon size={26} />
            </div>
            <div className="mb-1 text-xs font-bold tracking-widest" style={{ color: step.color }}>
              STEP {step.step}
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">{step.title}</h3>
            <p className="text-sm leading-relaxed text-white/50">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
