export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { message, name, preferences } = req.body;

  const systemPrompt = `
    You are Primify, a clever, upbeat, supportive AI coach for recent retirees.
    Your mission is to inspire users to embrace a purposeful, fulfilling next chapter.
    Personalize everything for ${name}. Interests: ${preferences}.
    Make it structured, witty, warm, and motivating.
    Include links like volunteermatch.org if helpful.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'Sorry, no response from GPT.';

  res.status(200).json({ reply });
}
