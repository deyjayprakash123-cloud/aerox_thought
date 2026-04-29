"use client";

import { motion } from "framer-motion";
import { Network, Zap, AlertTriangle, MousePointerClick } from "lucide-react";

const features = [
  {
    icon: Network,
    title: "Visual Graph",
    description:
      "Every thought becomes a glowing node in an interactive 2D canvas you can drag, zoom, and explore freely.",
    color: "#00f0ff",
    delay: 0,
  },
  {
    icon: Zap,
    title: "Smart Connections",
    description:
      "Problems are automatically linked to goals. Related ideas cluster together to reveal hidden patterns.",
    color: "#7a00ff",
    delay: 0.1,
  },
  {
    icon: AlertTriangle,
    title: "Contradiction Detection",
    description:
      "Conflicting thoughts highlight in red instantly, so you can address them before they derail you.",
    color: "#ff00c8",
    delay: 0.2,
  },
  {
    icon: MousePointerClick,
    title: "Interactive UI",
    description:
      "Touch-friendly, mobile-ready. Drag nodes, create connections, delete thoughts — all with satisfying animations.",
    color: "#00f0ff",
    delay: 0.3,
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-28">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#00f0ff]">
          What You Get
        </p>
        <h2 className="text-4xl font-black md:text-5xl">
          Powerful{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #00f0ff, #ff00c8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Features
          </span>
        </h2>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
        {features.map((feat, i) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: feat.delay }}
            whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
            className="group relative flex gap-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
          >
            {/* Glow on hover */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl"
              style={{
                background: `radial-gradient(circle at 30% 50%, ${feat.color}18 0%, transparent 70%)`,
              }}
            />

            {/* Left border accent */}
            <div
              className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
              style={{ background: `linear-gradient(to bottom, ${feat.color}88, transparent)` }}
            />

            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
              style={{
                background: `${feat.color}15`,
                border: `1px solid ${feat.color}40`,
                color: feat.color,
              }}
            >
              <feat.icon size={26} />
            </div>

            <div>
              <h3 className="mb-2 text-xl font-bold text-white">{feat.title}</h3>
              <p className="text-sm leading-relaxed text-white/50">{feat.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
