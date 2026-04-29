"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export type NodeType = "goal" | "problem" | "confusion" | "normal";

const typeConfig: Record<NodeType, { border: string; glow: string; bg: string; label: string; emoji: string }> = {
  goal: {
    border: "#00ff88",
    glow: "rgba(0,255,136,0.4)",
    bg: "rgba(0,255,136,0.08)",
    label: "Goal",
    emoji: "🎯",
  },
  problem: {
    border: "#ff3366",
    glow: "rgba(255,51,102,0.4)",
    bg: "rgba(255,51,102,0.08)",
    label: "Problem",
    emoji: "⚠️",
  },
  confusion: {
    border: "#ffcc00",
    glow: "rgba(255,204,0,0.4)",
    bg: "rgba(255,204,0,0.08)",
    label: "Confusion",
    emoji: "❓",
  },
  normal: {
    border: "#00f0ff",
    glow: "rgba(0,240,255,0.3)",
    bg: "rgba(0,240,255,0.06)",
    label: "Thought",
    emoji: "💭",
  },
};

type CustomNodeData = {
  label: string;
  nodeType: NodeType;
  onDelete?: (id: string) => void;
};

function CustomNode({ id, data }: NodeProps) {
  const nodeData = data as CustomNodeData;
  const cfg = typeConfig[nodeData.nodeType ?? "normal"];

  return (
    <motion.div
      initial={{ scale: 0.3, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative"
      style={{ minWidth: 160, maxWidth: 260 }}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div
        className="relative rounded-2xl px-4 py-3 backdrop-blur-md"
        style={{
          background: cfg.bg,
          border: `1.5px solid ${cfg.border}`,
          boxShadow: `0 0 18px ${cfg.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            `0 0 35px ${cfg.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`;
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.04)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            `0 0 18px ${cfg.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`;
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        }}
      >
        {/* Type badge */}
        <div
          className="mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
          style={{ background: `${cfg.border}22`, color: cfg.border }}
        >
          <span>{cfg.emoji}</span>
          <span>{cfg.label}</span>
        </div>

        {/* Label */}
        <div className="text-sm font-semibold leading-snug text-white">
          {nodeData.label}
        </div>

        {/* Delete button */}
        {nodeData.onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nodeData.onDelete!(id);
            }}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white/40 opacity-0 transition-opacity duration-200 hover:text-white group-hover:opacity-100"
          >
            <X size={11} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default memo(CustomNode);
