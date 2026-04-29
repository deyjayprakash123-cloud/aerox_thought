"use client";

import { NodeType } from "./CustomNode";
import type { Node, Edge } from "@xyflow/react";

// ─── Keyword → node type mapping ─────────────────────────────────────────────
const GOAL_WORDS = ["want", "goal", "wish", "achieve", "need", "desire", "hope", "plan", "aim"];
const PROBLEM_WORDS = ["problem", "issue", "block", "hard", "difficult", "bad", "hate", "stuck", "fail", "fear", "can't", "cannot", "struggle"];
const CONFUSION_WORDS = ["maybe", "confused", "unsure", "don't know", "not sure", "lost", "what if", "unclear", "wondering"];

export function classifyThought(text: string): NodeType {
  const lower = text.toLowerCase();
  if (PROBLEM_WORDS.some((w) => lower.includes(w))) return "problem";
  if (GOAL_WORDS.some((w) => lower.includes(w))) return "goal";
  if (CONFUSION_WORDS.some((w) => lower.includes(w))) return "confusion";
  return "normal";
}

// ─── Contradiction check ───────────────────────────────────────────────────
export function isContradiction(aType: NodeType, bType: NodeType): boolean {
  return (
    (aType === "goal" && bType === "problem") ||
    (aType === "problem" && bType === "goal")
  );
}

// ─── Auto-connection logic ────────────────────────────────────────────────────
export function buildAutoEdge(
  newNode: Node,
  existingNodes: Node[],
): Edge | null {
  if (existingNodes.length === 0) return null;

  const newType = (newNode.data as { nodeType: NodeType }).nodeType;

  // goal → connect from most recent problem (blocks)
  if (newType === "goal") {
    const lastProblem = [...existingNodes].reverse().find(
      (n) => (n.data as { nodeType: NodeType }).nodeType === "problem",
    );
    if (lastProblem) {
      return {
        id: `e-${lastProblem.id}-${newNode.id}`,
        source: lastProblem.id,
        target: newNode.id,
        type: "custom",
        data: { isContradiction: true, label: "blocks" },
        markerEnd: { type: "arrowclosed" as const, color: "#ff3366" },
      };
    }
  }

  // problem → connect to most recent goal (blocks)
  if (newType === "problem") {
    const lastGoal = [...existingNodes].reverse().find(
      (n) => (n.data as { nodeType: NodeType }).nodeType === "goal",
    );
    if (lastGoal) {
      return {
        id: `e-${newNode.id}-${lastGoal.id}`,
        source: newNode.id,
        target: lastGoal.id,
        type: "custom",
        data: { isContradiction: true, label: "blocks" },
        markerEnd: { type: "arrowclosed" as const, color: "#ff3366" },
      };
    }
  }

  // default: connect from last node
  const last = existingNodes[existingNodes.length - 1];
  const lastType = (last.data as { nodeType: NodeType }).nodeType;
  return {
    id: `e-${last.id}-${newNode.id}`,
    source: last.id,
    target: newNode.id,
    type: "custom",
    data: {
      isContradiction: isContradiction(lastType, newType),
      label: isContradiction(lastType, newType) ? "conflicts" : undefined,
    },
    markerEnd: { type: "arrowclosed" as const, color: "#7a00ff" },
  };
}

// ─── Default demo graph ────────────────────────────────────────────────────
export const DEMO_NODES: Node[] = [
  {
    id: "demo-1",
    type: "custom",
    position: { x: 260, y: 80 },
    data: { nodeType: "goal", label: "Learn Coding" },
  },
  {
    id: "demo-2",
    type: "custom",
    position: { x: 60, y: 280 },
    data: { nodeType: "problem", label: "Procrastination" },
  },
  {
    id: "demo-3",
    type: "custom",
    position: { x: 460, y: 280 },
    data: { nodeType: "problem", label: "Phone Usage" },
  },
  {
    id: "demo-4",
    type: "custom",
    position: { x: 260, y: 460 },
    data: { nodeType: "confusion", label: "Where do I start?" },
  },
];

export const DEMO_EDGES: Edge[] = [
  {
    id: "de-2-1",
    source: "demo-2",
    target: "demo-1",
    type: "custom",
    data: { isContradiction: true, label: "blocks" },
    markerEnd: { type: "arrowclosed" as const, color: "#ff3366" },
  },
  {
    id: "de-3-2",
    source: "demo-3",
    target: "demo-2",
    type: "custom",
    data: { isContradiction: false, label: "causes" },
    markerEnd: { type: "arrowclosed" as const, color: "#7a00ff" },
  },
  {
    id: "de-4-2",
    source: "demo-4",
    target: "demo-2",
    type: "custom",
    data: { isContradiction: false, label: "triggers" },
    markerEnd: { type: "arrowclosed" as const, color: "#7a00ff" },
  },
];
