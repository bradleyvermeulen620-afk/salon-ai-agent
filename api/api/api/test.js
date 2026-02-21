export default async function handler(req, res) {
  const response = await fetch("https://salon-ai-agent-cof1.vercel.app/api/agent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Hi, can I book a haircut tomorrow at 2pm?"
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
