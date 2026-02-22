import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function chatWithGemini(message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
  const model = "gemini-3.1-pro-preview";
  
  const chat = ai.chats.create({
    model: model,
    history: history,
    config: {
      temperature: 0.7,
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
}

export async function getQuickTip(topic: string) {
  const model = "gemini-flash-lite-latest"; // Using the lite model as requested
  
  const response = await ai.models.generateContent({
    model: model,
    contents: `Give me one short, punchy, aggressive SEO tip about ${topic} for a blogger. Max 20 words.`,
  });

  return response.text;
}
