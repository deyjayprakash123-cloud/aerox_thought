import { NextRequest } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AINode {
  id: string;
  label: string;
  type: "goal" | "problem" | "cause" | "confusion";
}

interface AIEdge {
  source: string;
  target: string;
  relation: "causes" | "blocks" | "leads_to" | string;
}

interface AIGraph {
  nodes: AINode[];
  edges: AIEdge[];
}

// ─── Fallback graph (shown when AI fails or key is missing) ───────────────────

const FALLBACK: AIGraph = {
  nodes: [
    { id: "1", label: "Your Goal", type: "goal" },
    { id: "2", label: "The Problem", type: "problem" },
    { id: "3", label: "Root Cause", type: "cause" },
  ],
  edges: [
    { source: "3", target: "2", relation: "causes" },
    { source: "2", target: "1", relation: "blocks" },
  ],
};

// ─── Strict JSON extractor (handles markdown code fences from AI) ─────────────

function extractJSON(raw: string): AIGraph {
  // Strip ```json ... ``` fences if present
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const parsed = JSON.parse(stripped) as AIGraph;

  // Validate shape
  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
    throw new Error("Invalid graph shape");
  }

  // Ensure every node has id + label + type
  parsed.nodes = parsed.nodes.map((n, i) => ({
    id: n.id ?? String(i + 1),
    label: n.label ?? "Thought",
    type: n.type ?? "goal",
  }));

  return parsed;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { text?: string };
    const text = body?.text?.trim();

    if (!text) {
      return Response.json({ error: "No input" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    // If key is not configured, return fallback immediately
    if (!apiKey || apiKey === "your_openrouter_api_key_here") {
      return Response.json(
        { ...FALLBACK, _fallback: true, _reason: "API key not configured" },
        { status: 200 },
      );
    }

    const openRouterRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://neural-thought-space.vercel.app",
          "X-Title": "Neural Thought Space",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content: `You are a system that converts human thoughts into structured graph data.
Return ONLY valid JSON with this exact structure — no explanation, no code fences:
{
  "nodes": [
    { "id": "1", "label": "short text", "type": "goal|problem|cause|confusion" }
  ],
  "edges": [
    { "source": "1", "target": "2", "relation": "causes|blocks|leads_to" }
  ]
}
Rules:
- Extract 3-7 key ideas from the user's text
- Classify each idea correctly (goal=something they want, problem=obstacle, cause=root reason, confusion=uncertainty)
- Create logical directed relationships between nodes
- Keep labels concise (max 5 words)
- Return strict JSON only — nothing else`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      },
    );

    if (!openRouterRes.ok) {
      throw new Error(`OpenRouter ${openRouterRes.status}: ${await openRouterRes.text()}`);
    }

    const data = await openRouterRes.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const rawContent = data?.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("Empty AI response");

    const graph = extractJSON(rawContent);
    return Response.json(graph, { status: 200 });

  } catch (err) {
    console.error("[/api/analyze] Error:", err);
    // Always return a valid graph — never a blank screen
    return Response.json(
      { ...FALLBACK, _fallback: true, _reason: String(err) },
      { status: 200 },
    );
  }
}
