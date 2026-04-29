"use client";

import { useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

export default function ThoughtSpace() {
  const [input, setInput] = useState("");
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);

      // clear previous graph
      setNodes([]);
      setEdges([]);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      // 🔥 generate unique nodes
      const uniqueNodes = data.nodes.map((node: any, i: number) => ({
        id: `${Date.now()}-${i}`,
        data: { label: node.label },
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
        style: {
          padding: 10,
          borderRadius: "10px",
          color: "#fff",
          background:
            node.type === "goal"
              ? "#00ff88"
              : node.type === "problem"
              ? "#ff4d4d"
              : node.type === "solution"
              ? "#4da6ff"
              : "#999",
        },
      }));

      // 🔥 simple edge mapping
      const uniqueEdges = data.edges.map((edge: any, i: number) => ({
        id: `${Date.now()}-e-${i}`,
        source: uniqueNodes[i % uniqueNodes.length].id,
        target: uniqueNodes[(i + 1) % uniqueNodes.length].id,
        animated: true,
      }));

      // force re-render
      setTimeout(() => {
        setNodes(uniqueNodes);
        setEdges(uniqueEdges);
      }, 100);
    } catch (err) {
      console.error(err);
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
      {/* TOP BAR */}
      <div
        style={{
          padding: "10px",
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
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />

        <button
          onClick={handleAnalyze}
          style={{
            padding: "10px 20px",
            background: "#7a00ff",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* GRAPH */}
      <div style={{ flex: 1 }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
