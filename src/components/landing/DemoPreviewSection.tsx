"use client";

import { motion } from "framer-motion";
import { ReactFlow, Background, useNodesState, useEdgesState, BackgroundVariant } from "@xyflow/react";
import { useEffect, useState } from "react";

const demoNodes = [
  { id: "1", position: { x: 300, y: 120 }, data: { label: "🎯 Learn Coding" }, type: "default" },
  { id: "2", position: { x: 80, y: 280 }, data: { label: "😤 Procrastination" }, type: "default" },
  { id: "3", position: { x: 520, y: 280 }, data: { label: "📱 Phone Usage" }, type: "default" },
  { id: "4", position: { x: 300, y: 420 }, data: { label: "🔥 Lack of Focus" }, type: "default" },
];

const demoEdges = [
  { id: "e1-2", source: "2", target: "1", label: "blocks", type: "smoothstep" },
  { id: "e3-2", source: "3", target: "2", label: "causes", type: "smoothstep" },
  { id: "e4-2", source: "4", target: "2", label: "triggers", type: "smoothstep" },
];

export default function DemoPreviewSection() {
  const [nodes, , onNodesChange] = useNodesState(demoNodes);
  const [edges, , onEdgesChange] = useEdgesState(demoEdges);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#ff00c8]">
          Live Preview
        </p>
        <h2 className="text-4xl font-black md:text-5xl">
          See It{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #ff00c8, #7a00ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            In Action
          </span>
        </h2>
        <p className="mt-4 text-white/50">
          A real React Flow graph — this is exactly what your Thought Space looks like.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative overflow-hidden rounded-3xl border border-white/10"
        style={{
          height: "480px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 80px rgba(122,0,255,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* corner label */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs backdrop-blur-md">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#00f0ff]" />
          <span className="text-white/60">Demo Graph — Interactive</span>
        </div>

        {mounted && (
          <ReactFlow
            nodes={nodes.map((n) => ({
              ...n,
              style: {
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(122,0,255,0.5)",
                borderRadius: 12,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                padding: "10px 16px",
                boxShadow: "0 0 20px rgba(122,0,255,0.3)",
                backdropFilter: "blur(10px)",
              },
            }))}
            edges={edges.map((e) => ({
              ...e,
              style: {
                stroke: "#7a00ff",
                strokeWidth: 2,
                filter: "drop-shadow(0 0 6px #7a00ff)",
              },
              labelStyle: { fill: "#fff", fontSize: 11, fontWeight: 600 },
              labelBgStyle: { fill: "rgba(0,0,0,0.6)", borderRadius: 4 },
            }))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            nodesDraggable={false}
            elementsSelectable={false}
          >
            <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255,0.06)" gap={24} size={1} />
          </ReactFlow>
        )}

        {/* Edge glow overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(122,0,255,0.08) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </section>
  );
}
