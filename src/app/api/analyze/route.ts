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
        model: "anthropic/claude-haiku-4.5",
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content: `
You are an intelligent system that expands user thoughts.

RULES:
- Generate 5 to 8 nodes
- Include:
  goal, problem, cause, solution, opportunity
- Think deeply and practically

OUTPUT (STRICT JSON ONLY):

{
  "nodes": [
    { "id": "1", "label": "text", "type": "goal|problem|cause|solution|opportunity" }
  ],
  "edges": [
    { "source": "1", "target": "2", "relation": "causes|blocks|leads_to|enables" }
  ]
}

NO explanation
ONLY JSON
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

    if (!raw) throw new Error("Empty response");

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);

  } catch (error) {
    console.error(error);

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
