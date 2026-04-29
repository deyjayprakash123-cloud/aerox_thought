import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return Response.json({ error: "No input" }, { status: 400 });
    }

    const completion = await openrouter.chat.send({
      model: "anthropic/claude-haiku-4.5", // 🔥 better than nemotron for structure
      messages: [
        {
          role: "system",
          content: `
You are a high-level reasoning engine.

Convert user thoughts into a rich structured graph.

STRICT RULES:
- Generate 5–8 nodes
- Include:
  goal, problem, cause, solution, opportunity
- Think practically and deeply

EXAMPLE:
Input: "how to earn money"
→ include freelancing, skills, jobs, problems, actions

OUTPUT (STRICT JSON ONLY):
{
  "nodes": [
    { "id": "1", "label": "", "type": "goal|problem|cause|solution|opportunity" }
  ],
  "edges": [
    { "source": "1", "target": "2", "relation": "causes|blocks|leads_to|enables" }
  ]
}

NO explanation
NO markdown
ONLY JSON
`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.5
    });

    const raw = completion.choices?.[0]?.message?.content;

    if (!raw) throw new Error("Empty response");

    // 🔥 CLEAN OUTPUT
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);

  } catch (error) {
    console.error("API ERROR:", error);

    // ✅ fallback (never break UI)
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
