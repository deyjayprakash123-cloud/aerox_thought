"use client";

import { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

export default function ThoughtSpace() {
  const [input, setInput] = useState("");
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);

      // Clear previous graph
      setNodes([]);
      setEdges([]);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      // 🔥 Create nodes with unique IDs + better layout
      const uniqueNodes = data.nodes.map((node: any, i: number) => ({
        id: `${Date.now()}-${i}`,
        data: { label: node.label },
        position: {
          x: 200 * (i % 3),
          y: 150 * Math.floor(i / 3),
        },
        style: {
          padding: "10px 15px",
          borderRadius: "12px",
          color: "#fff",
          fontWeight: "500",
          border: "1px solid rgba(255,255,255,0.1)",
          background:
            node.type === "goal"
              ? "linear-gradient(135deg, #00ff88, #00994d)"
              : node.type === "problem"
              ? "linear-gradient(135deg, #ff4d4d, #990000)"
              : node.type === "solution"
              ? "linear-gradient(135deg, #4da6ff, #003366)"
              : node.type === "opportunity"
              ? "linear-gradient(135deg, #ffcc00, #996600)"
              : "#333",
        },
      }));

      // 🔥 Create edges correctly (connect sequentially)
      const uniqueEdges = data.edges.map((edge: any, i: number) => ({
        id: `${Date.now()}-e-${i}`,
        source: uniqueNodes[i % uniqueNodes.length]?.id,
        target: uniqueNodes[(i + 1) % uniqueNodes.length]?.id,
        animated: true,
        style: { stroke: "#7a00ff" },
      }));

      // Force re-render
      setTimeout(() => {
        setNodes(uniqueNodes);
        setEdges(uniqueEdges);
      }, 100);
    } catch (err) {
      console.error("Frontend Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 🔝 TOP BAR */}
      <div
        style={{
          padding: "12px",
          display: "flex",
          gap: "10px",
          borderBottom: "1px solid #222",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your thoughts..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            background: "#111",
            color: "#fff",
          }}
        />

        <button
          onClick={handleAnalyze}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #7a00ff, #ff00c8)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* 🧠 GRAPH AREA */}
      <div style={{ flex: 1 }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap />
          <Controls />
          <Background gap={20} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
