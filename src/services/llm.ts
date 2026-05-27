import Groq from 'groq-sdk';

let groq: Groq | null = null;

function getGroq(): Groq {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
}

const SYSTEM_PROMPTS: Record<'error' | 'success', (lang: string) => string> = {
  error: (lang) =>
    `You are an assistant that receives technical error messages and converts them into friendly messages for end users in ${lang}.
Rules:
- Remove technical jargon, error codes, and stack traces
- Use an empathetic and clear tone
- Suggest a concrete action if possible
- Maximum 2 sentences
- Reply only with the final message, no explanations or quotes`,

  success: (lang) =>
    `You are an assistant that receives technical success messages and converts them into warm, friendly messages for end users in ${lang}.
Rules:
- Remove technical jargon and internal identifiers
- Use a positive and encouraging tone
- Be concise and celebratory
- Maximum 2 sentences
- Reply only with the final message, no explanations or quotes`,
};

export async function humanize(
  text: string,
  type: 'error' | 'success',
  language: string = 'español',
): Promise<string> {
  const chat = await getGroq().chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPTS[type](language) },
      { role: 'user',   content: text },
    ],
    temperature: 0.4,
  });

  return chat.choices[0].message.content?.trim() ?? '';
}
