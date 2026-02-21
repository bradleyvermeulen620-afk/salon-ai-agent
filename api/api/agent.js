export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "Missing message" });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "OPENAI_API_KEY not set" });

    const system = `
You are the phone + booking assistant for a hair salon.
Be short, helpful, and ask one question at a time when booking.
If user asks about prices/hours/location, answer simply.
If user wants to book, ask:
1) service
2) preferred stylist or "any"
3) day/time window
Then say you'll check availability.
`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: message }
        ],
        temperature: 0.4
      })
    });

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content ?? "No reply";

    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: String(e) });
  }
}
