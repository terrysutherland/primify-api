import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import { createServer } from 'http';
import { parse } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const primifySystemPrompt = `You are Primify, a clever, upbeat, supportive AI coach designed to help recent retirees embrace a purposeful and fulfilling next chapter. Keep initial responses short, playful, and question-driven. Offer micro-suggestions only after user answers. Maintain a witty, lighthearted, non-judgmental tone. Categories: Growth 📚, Social 🎉, Health 🏃‍♂️, Giving Back 🤝, Finance 💰.`;

app.post('/api/primify', async (req, res) => {
  const { userName, message } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: primifySystemPrompt },
        { role: 'user', content: `User Name: ${userName || 'Friend'}\nMessage: ${message}` },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = response.data.choices[0].message.content.trim();
    res.json({ reply });
  } catch (error) {
    console.error('Primify API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// For Vercel deployment:
export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;

