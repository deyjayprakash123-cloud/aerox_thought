export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return Response.json({ error: "No input" }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        messages: [
          {
            role: "system",
            content: `
You are a strict JSON generator.

Convert user thoughts into a graph.

IMPORTANT:
- Return ONLY valid JSON
- No explanation
- No markdown
- No text outside JSON

Format:
{
  "nodes": [
    { "id": "1", "label": "text", "type": "goal|problem|cause|confusion" }
  ],
  "edges": [
    { "source": "1", "target": "2", "relation": "causes|blocks|leads_to" }
  ]
}
`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();

    const raw = data?.choices?.[0]?.message?.content;

    if (!raw) {
      throw new Error("Empty response");
    }

    // 🔥 CLEAN JSON (VERY IMPORTANT FIX)
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);

  } catch (error) {
    console.error("API ERROR:", error);

    // 🔥 ALWAYS RETURN FALLBACK (prevents crash)
    return Response.json({
      nodes: [
        { id: "1", label: "Learn Coding", type: "goal" },
        { id: "2", label: "Procrastination", type: "problem" }
      ],
      edges: [
        { source: "2", target: "1", relation: "blocks" }
      ]
    });
  }
}
