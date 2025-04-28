import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the request body manually
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString();
    const body = JSON.parse(rawBody);

    const { userName, message } = body;

    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    const primifySystemPrompt = `You are Primify, a clever, upbeat, supportive AI coach designed to help recent retirees embrace a purposeful and fulfilling next chapter. Keep initial responses short, playful, and question-driven. Offer micro-suggestions only after user answers. Maintain a witty, lighthearted, non-judgmental tone. Categories: Growth 📚, Social 🎉, Health 🏃‍♂️, Giving Back 🤝, Finance 💰.`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: primifySystemPrompt },
        { role: 'user', content: `User Name: ${userName || 'Friend'}\nMessage: ${message}` },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.data.choices[0].message.content.trim();

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Primify API Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Primify API request failed' });
  }
}
