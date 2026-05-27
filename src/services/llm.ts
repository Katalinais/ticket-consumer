import Groq from 'groq-sdk';

let groq: Groq | null = null;

function getGroq(): Groq {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
}

export async function translate(text: string, targetLanguage: string = 'español'): Promise<string> {
  const chat = await getGroq().chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `You are an assistant that receives technical error messages and converts them into friendly messages for end users in ${targetLanguage}.
Rules:
- Remove technical jargon, error codes, and stack traces
- Use an empathetic and clear tone
- Suggest a concrete action if possible
- Maximum 2 sentences
- Reply only with the final message, no explanations or quotes`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.4,
  });

  return chat.choices[0].message.content?.trim() ?? '';
}
