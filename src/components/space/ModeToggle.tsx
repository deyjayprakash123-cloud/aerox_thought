"use client";

import { motion } from "framer-motion";
import { Cpu, FlaskConical } from "lucide-react";

export type AppMode = "demo" | "real";

interface ModeToggleProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
  disabled?: boolean;
}

export default function ModeToggle({ mode, onChange, disabled }: ModeToggleProps) {
  return (
    <div
      className="relative flex items-center rounded-2xl border border-white/10 bg-black/50 p-1 backdrop-blur-md"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}
    >
      {/* Sliding pill indicator */}
      <motion.div
        className="absolute inset-y-1 rounded-xl"
        animate={{ left: mode === "demo" ? 4 : "50%", right: mode === "demo" ? "50%" : 4 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        style={{
          background:
            mode === "demo"
              ? "linear-gradient(135deg, rgba(0,240,255,0.2), rgba(122,0,255,0.2))"
              : "linear-gradient(135deg, rgba(122,0,255,0.3), rgba(255,0,200,0.3))",
          border: `1px solid ${mode === "demo" ? "rgba(0,240,255,0.35)" : "rgba(122,0,255,0.5)"}`,
        }}
      />

      {/* Demo button */}
      <button
        onClick={() => !disabled && onChange("demo")}
        disabled={disabled}
        className="relative z-10 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors duration-200 disabled:cursor-not-allowed"
        style={{ color: mode === "demo" ? "#00f0ff" : "rgba(255,255,255,0.4)" }}
      >
        <FlaskConical size={12} />
        Demo
      </button>

      {/* Real button */}
      <button
        onClick={() => !disabled && onChange("real")}
        disabled={disabled}
        className="relative z-10 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors duration-200 disabled:cursor-not-allowed"
        style={{ color: mode === "real" ? "#ff00c8" : "rgba(255,255,255,0.4)" }}
      >
        <Cpu size={12} />
        AI Mode
        {mode === "real" && (
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ background: "#ff00c8" }}
          />
        )}
      </button>
    </div>
  );
}
