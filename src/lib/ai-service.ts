import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface AITriageResult {
  urgencyScore: number;
  category: string;
  sentiment: string;
  suggestedResponse: string;
}

export async function triageTicket(title: string, description: string): Promise<AITriageResult> {
  if (!ai) {
    console.warn("No GEMINI_API_KEY found. Falling back to mocked AI triage.");
    return mockTriage(title, description);
  }

  const prompt = `
You are an expert customer support AI for a B2B SaaS platform called ResolveAI.
Analyze the following support ticket and return a structured JSON evaluation.

Ticket Title: ${title}
Ticket Description: ${description}

Respond ONLY with a valid JSON object matching this schema:
{
  "urgencyScore": <number between 0 and 100>,
  "category": "<One of: Bug Report, Feature Request, Billing & Account, Outage, Onboarding, Other>",
  "sentiment": "<One of: Positive, Neutral, Frustrated, Panic>",
  "suggestedResponse": "<A professional, empathetic 1-2 paragraph email response draft>"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty AI response");

    const parsed = JSON.parse(resultText) as AITriageResult;
    return parsed;
  } catch (err) {
    console.error("AI Generation failed:", err);
    return mockTriage(title, description); // Fallback on failure
  }
}

function mockTriage(title: string, description: string): AITriageResult {
  // Simple heuristic mock for safety
  const isUrgent = title.toLowerCase().includes('down') || description.toLowerCase().includes('asap');
  return {
    urgencyScore: isUrgent ? 95 : 30,
    category: isUrgent ? 'Outage' : 'Other',
    sentiment: isUrgent ? 'Frustrated' : 'Neutral',
    suggestedResponse: 'Hello,\n\nThank you for reaching out. Our team has received your ticket and is reviewing it now.\n\nBest,\nSupport Team'
  };
}
