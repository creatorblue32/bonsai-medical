import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Create OpenRouter client (OpenAI-compatible)
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, model = 'google/gemini-2.5-flash' } = await req.json();
    
    console.log('Prompt:', prompt);
    console.log('Model:', model);

    const result = streamText({
      model: openrouter.chat(model),
      prompt: prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
