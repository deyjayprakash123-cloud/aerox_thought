export async function POST(req: Request) {
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
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: `
You are an intelligent system that converts human thoughts into a structured graph.

GOAL:
Expand the user's thought into multiple meaningful ideas.

RULES:
- Generate 4 to 8 nodes
- Include different types:
  goal, problem, cause, solution, opportunity
- Think deeply:
  - Add methods
  - Add obstacles
  - Add actions

- Create meaningful relationships:
  causes, blocks, leads_to, enables

OUTPUT FORMAT (STRICT JSON ONLY):

{
  "nodes": [
    { "id": "1", "label": "text", "type": "goal|problem|cause|solution|opportunity" }
  ],
  "edges": [
    { "source": "1", "target": "2", "relation": "causes|blocks|leads_to|enables" }
  ]
}

IMPORTANT:
- Minimum 4 nodes
- Maximum 8 nodes
- Always include at least one solution
- NO explanation
- NO markdown
- ONLY JSON
`
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await response.json();

    const raw = data?.choices?.[0]?.message?.content;

    if (!raw) {
      throw new Error("Empty response");
    }

    // 🔥 CLEAN RESPONSE (fix JSON errors)
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);

  } catch (error) {
    console.error("API ERROR:", error);

    // ✅ fallback so UI never breaks
    return Response.json({
      nodes: [
        { id: "1", label: "Earn Money", type: "goal" },
        { id: "2", label: "Learn Skills", type: "solution" },
        { id: "3", label: "Freelancing", type: "opportunity" },
        { id: "4", label: "Lack of Skills", type: "problem" }
      ],
      edges: [
        { source: "2", target: "3", relation: "enables" },
        { source: "3", target: "1", relation: "leads_to" },
        { source: "4", target: "1", relation: "blocks" }
      ]
    });
  }
}
