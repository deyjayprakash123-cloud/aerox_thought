"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  ReactFlowProvider,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, Send, Brain, Info, X, AlertTriangle, Sparkles } from "lucide-react";
import Link from "next/link";
import CustomNode, { type NodeType } from "./CustomNode";
import CustomEdge from "./CustomEdge";
import ModeToggle, { type AppMode } from "./ModeToggle";
import { classifyThought, buildAutoEdge, DEMO_NODES, DEMO_EDGES } from "./graphLogic";
import ParticleBackground from "@/components/ParticleBackground";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AINode {
  id: string;
  label: string;
  type: "goal" | "problem" | "cause" | "confusion";
}

interface AIEdge {
  source: string;
  target: string;
  relation: string;
}

interface AIGraph {
  nodes: AINode[];
  edges: AIEdge[];
  _fallback?: boolean;
  _reason?: string;
}

// ─── Map AI type → NodeType ───────────────────────────────────────────────────

function aiTypeToNodeType(t: string): NodeType {
  if (t === "problem" || t === "cause") return "problem";
  if (t === "goal") return "goal";
  if (t === "confusion") return "confusion";
  return "normal";
}

// ─── Map AI relation → edge label ────────────────────────────────────────────

function relationLabel(rel: string): string {
  const map: Record<string, string> = {
    causes: "causes",
    blocks: "blocks",
    leads_to: "leads to",
  };
  return map[rel] ?? rel;
}

// ─── Convert AI graph → React Flow nodes/edges ───────────────────────────────

function buildRFGraph(
  graph: AIGraph,
  onDelete: (id: string) => void,
): { rfNodes: Node[]; rfEdges: Edge[] } {
  const count = graph.nodes.length;
  const cx = 450;
  const cy = 300;

  const rfNodes: Node[] = graph.nodes.map((n, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    const radius = count <= 3 ? 140 : 200;
    return {
      id: n.id,
      type: "custom",
      position: {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      },
      data: {
        label: n.label,
        nodeType: aiTypeToNodeType(n.type),
        onDelete,
      },
    };
  });

  const rfEdges: Edge[] = graph.edges.map((e, i) => {
    const srcNode = rfNodes.find((n) => n.id === e.source);
    const tgtNode = rfNodes.find((n) => n.id === e.target);
    const srcType = (srcNode?.data as { nodeType: NodeType })?.nodeType;
    const tgtType = (tgtNode?.data as { nodeType: NodeType })?.nodeType;
    const contradiction =
      (srcType === "goal" && tgtType === "problem") ||
      (srcType === "problem" && tgtType === "goal");

    return {
      id: `ai-e-${i}-${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      type: "custom",
      data: {
        isContradiction: contradiction || e.relation === "blocks",
        label: relationLabel(e.relation),
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color:
          contradiction || e.relation === "blocks" ? "#ff3366" : "#7a00ff",
      },
    };
  });

  return { rfNodes, rfEdges };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };
let nodeCounter = 100;
function genId() { return `n-${++nodeCounter}-${Date.now()}`; }
function placeNode(i: number) {
  const angle = i * 2.4;
  const radius = 120 + i * 50;
  return { x: 400 + radius * Math.cos(angle), y: 300 + radius * Math.sin(angle) };
}

// ─── Loading overlay ──────────────────────────────────────────────────────────

function LoadingOverlay({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center"
      style={{ backdropFilter: "blur(4px)", background: "rgba(10,10,10,0.6)" }}
    >
      {/* Spinning ring */}
      <div className="relative mb-6 h-20 w-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            border: "3px solid transparent",
            borderTopColor: "#00f0ff",
            borderRightColor: "#7a00ff",
          }}
        />
        <div
          className="absolute inset-3 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(122,0,255,0.2), transparent)" }}
        />
        <Sparkles
          size={22}
          className="absolute inset-0 m-auto text-[#7a00ff]"
        />
      </div>

      <p className="text-lg font-bold text-white">{text}</p>

      {/* Animated dots */}
      <div className="mt-3 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#7a00ff]"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Error / fallback banner ──────────────────────────────────────────────────

function ErrorBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="absolute inset-x-0 top-20 z-25 mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-[#ff3366]/30 bg-black/80 px-5 py-3 text-sm backdrop-blur-md"
      style={{ left: "50%", transform: "translateX(-50%)", width: "max-content" }}
    >
      <AlertTriangle size={15} className="shrink-0 text-[#ff3366]" />
      <span className="text-white/70">
        Using demo mode due to API issue
      </span>
      <button onClick={onDismiss} className="ml-2 text-white/30 hover:text-white">
        <X size={12} />
      </button>
    </motion.div>
  );
}

// ─── Main canvas ─────────────────────────────────────────────────────────────

function SpaceCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Processing…");
  const [showTip, setShowTip] = useState(true);
  const [showError, setShowError] = useState(false);
  const [mode, setMode] = useState<AppMode>("demo");
  const inputRef = useRef<HTMLInputElement>(null);
  const nodesAddedRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Delete handler ──────────────────────────────────────────────────────────
  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    },
    [setNodes, setEdges],
  );

  // ── Load demo graph (runs on mount + mode switch to demo) ──────────────────
  const loadDemoGraph = useCallback(() => {
    const withDelete = DEMO_NODES.map((n) => ({
      ...n,
      data: { ...n.data, onDelete: handleDeleteNode },
    }));
    setNodes(withDelete);
    setEdges(DEMO_EDGES);
    nodesAddedRef.current = DEMO_NODES.length;
  }, [handleDeleteNode, setNodes, setEdges]);

  useEffect(() => {
    loadDemoGraph();
  }, [loadDemoGraph]);

  // ── Mode switch ─────────────────────────────────────────────────────────────
  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setShowError(false);
    setInputText("");
    if (newMode === "demo") {
      loadDemoGraph();
    }
  };

  // ── Manual connections ──────────────────────────────────────────────────────
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const srcType = (nodes.find((n) => n.id === params.source)?.data as { nodeType: NodeType })?.nodeType;
      const tgtType = (nodes.find((n) => n.id === params.target)?.data as { nodeType: NodeType })?.nodeType;
      const contradiction =
        (srcType === "goal" && tgtType === "problem") ||
        (srcType === "problem" && tgtType === "goal");
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "custom",
            data: { isContradiction: contradiction, label: contradiction ? "conflicts" : undefined },
            markerEnd: { type: MarkerType.ArrowClosed, color: contradiction ? "#ff3366" : "#7a00ff" },
          },
          eds,
        ),
      );
    },
    [nodes, setEdges],
  );

  // ── AI submit ───────────────────────────────────────────────────────────────
  const handleRealSubmit = useCallback(async (text: string) => {
    setIsLoading(true);
    setLoadingMsg("Analyzing thoughts…");
    setShowError(false);

    try {
      // Fake "reading" pause for UX feel
      await new Promise((r) => setTimeout(r, 400));
      setLoadingMsg("Building neural graph…");

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const graph = await res.json() as AIGraph;

      if (graph._fallback) setShowError(true);

      const { rfNodes, rfEdges } = buildRFGraph(graph, handleDeleteNode);
      setNodes(rfNodes);
      setEdges(rfEdges);
      nodesAddedRef.current = rfNodes.length;
    } catch {
      setShowError(true);
      loadDemoGraph();
    } finally {
      setIsLoading(false);
    }
  }, [handleDeleteNode, loadDemoGraph, setNodes, setEdges]);

  // ── Demo submit (adds single node) ─────────────────────────────────────────
  const handleDemoSubmit = useCallback(async (text: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 200));

    const type = classifyThought(text);
    const id = genId();
    const pos = placeNode(nodesAddedRef.current);
    const newNode: Node = {
      id,
      type: "custom",
      position: pos,
      data: { label: text, nodeType: type, onDelete: handleDeleteNode },
    };

    setNodes((nds) => {
      const autoEdge = buildAutoEdge(newNode, nds);
      if (autoEdge) setEdges((eds) => [...eds, autoEdge]);
      return [...nds, newNode];
    });
    nodesAddedRef.current += 1;
    setIsLoading(false);
    inputRef.current?.focus();
  }, [handleDeleteNode, setNodes, setEdges]);

  // ── Form submit ─────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const text = inputText.trim();
      if (!text || isLoading) return;
      setInputText("");

      if (mode === "real") {
        await handleRealSubmit(text);
      } else {
        await handleDemoSubmit(text);
      }
    },
    [inputText, isLoading, mode, handleRealSubmit, handleDemoSubmit],
  );

  // ── Debounce for optional "type to analyse" in real mode ───────────────────
  const handleInputChange = (val: string) => {
    setInputText(val);
    if (mode !== "real" || val.length < 20) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // (Commented out - uncomment to enable auto-analyse on typing)
    // debounceRef.current = setTimeout(() => handleRealSubmit(val), 1800);
  };

  // ── Reset ───────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setShowError(false);
    setInputText("");
    loadDemoGraph();
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="relative h-screen w-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #0d0020 60%, #000d1a 100%)" }}
    >
      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <ParticleBackground />

      {/* ── Loading overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {isLoading && <LoadingOverlay text={loadingMsg} />}
      </AnimatePresence>

      {/* ── Error banner ────────────────────────────────────────── */}
      <AnimatePresence>
        {showError && <ErrorBanner onDismiss={() => setShowError(false)} />}
      </AnimatePresence>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
        style={{
          background: "linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, transparent 100%)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60 hover:border-white/20 hover:text-white"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Home</span>
            </motion.button>
          </Link>

          <div className="flex items-center gap-2">
            <Brain size={18} className="text-[#7a00ff]" />
            <span
              className="hidden text-sm font-black sm:block"
              style={{
                background: "linear-gradient(90deg, #00f0ff, #7a00ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Neural Thought Space
            </span>
          </div>
        </div>

        {/* Center: Mode toggle */}
        <ModeToggle mode={mode} onChange={handleModeChange} disabled={isLoading} />

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/40">
              {nodes.length} nodes
            </span>
          </div>

          <motion.button
            onClick={handleReset}
            disabled={isLoading}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95, rotate: 180 }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60 hover:border-[#ff00c8]/40 hover:text-[#ff00c8] disabled:opacity-40"
          >
            <RefreshCw size={15} />
            <span className="hidden sm:inline">Reset</span>
          </motion.button>
        </div>
      </div>

      {/* ── React Flow canvas ────────────────────────────────────── */}
      <div className="absolute inset-0 z-10">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.15}
          maxZoom={4}
          defaultEdgeOptions={{
            type: "custom",
            data: {},
            markerEnd: { type: MarkerType.ArrowClosed, color: "#7a00ff" },
          }}
        >
          <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255,0.04)" gap={28} size={1} />
          <Controls style={{ bottom: 110 }} />
          <MiniMap
            style={{
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
            }}
            nodeColor={(n) => {
              const t = (n.data as { nodeType: NodeType })?.nodeType;
              if (t === "goal") return "#00ff88";
              if (t === "problem") return "#ff3366";
              if (t === "confusion") return "#ffcc00";
              return "#00f0ff";
            }}
            maskColor="rgba(0,0,0,0.4)"
          />
        </ReactFlow>
      </div>

      {/* ── Legend ───────────────────────────────────────────────── */}
      <div className="absolute bottom-6 left-4 z-20 hidden flex-col gap-2 rounded-2xl border border-white/10 bg-black/60 p-3 text-xs backdrop-blur-md sm:flex">
        {[
          { color: "#00ff88", label: "Goal" },
          { color: "#ff3366", label: "Problem" },
          { color: "#ffcc00", label: "Confusion" },
          { color: "#00f0ff", label: "Thought" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2 text-white/50">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: l.color, boxShadow: `0 0 5px ${l.color}` }}
            />
            {l.label}
          </div>
        ))}
      </div>

      {/* ── Tip toast ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="absolute bottom-28 left-1/2 z-20 flex w-max max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-black/70 px-4 py-2.5 text-xs text-white/60 backdrop-blur-md"
          >
            <Info size={13} className="shrink-0 text-[#00f0ff]" />
            {mode === "demo"
              ? "Demo mode: type to add nodes. Switch to AI Mode for smart analysis."
              : "AI Mode: type a full thought and press Enter for instant graph generation."}
            <button onClick={() => setShowTip(false)} className="ml-1 text-white/30 hover:text-white">
              <X size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating input ───────────────────────────────────────── */}
      <div className="absolute bottom-5 left-1/2 z-20 w-full max-w-2xl -translate-x-1/2 px-4">
        <form onSubmit={handleSubmit}>
          <div
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/80 p-2.5 backdrop-blur-xl transition-all duration-300 focus-within:border-[#7a00ff]/60 focus-within:shadow-[0_0_30px_rgba(122,0,255,0.25)]"
          >
            {/* Mode indicator dot */}
            <div
              className="ml-1 h-2 w-2 shrink-0 rounded-full"
              style={{
                background: mode === "demo" ? "#00f0ff" : "#ff00c8",
                boxShadow: `0 0 8px ${mode === "demo" ? "#00f0ff" : "#ff00c8"}`,
              }}
            />

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={
                mode === "demo"
                  ? "Type your thoughts… (e.g. 'I want to learn coding')"
                  : "Describe your situation in detail… AI will build your graph"
              }
              className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
              disabled={isLoading}
            />

            <motion.button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl disabled:opacity-40 transition-all duration-200"
              style={{
                background:
                  mode === "demo"
                    ? "linear-gradient(135deg, #00f0ff, #7a00ff)"
                    : "linear-gradient(135deg, #7a00ff, #ff00c8)",
                boxShadow: inputText.trim()
                  ? `0 0 18px ${mode === "demo" ? "rgba(0,240,255,0.4)" : "rgba(255,0,200,0.4)"}`
                  : "none",
              }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white"
                />
              ) : (
                <Send size={14} className="text-white" />
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Provider wrapper ─────────────────────────────────────────────────────────

export default function SpaceClient() {
  return (
    <ReactFlowProvider>
      <SpaceCanvas />
    </ReactFlowProvider>
  );
}
