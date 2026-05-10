import { GoogleGenAI } from '@google/genai';
import { calculateSaju } from '@/lib/saju_engine';
import { buildPrompt, SYSTEM_PROMPT } from '@/lib/saju_data';

export async function POST(request) {
  try {
    const body = await request.json();
    const { year, month, day, hour, gender, chapter } = body;

    const sajuData = calculateSaju(
      parseInt(year), parseInt(month), parseInt(day),
      parseInt(hour ?? 12), gender
    );

    const prompt = buildPrompt(chapter, sajuData);
    const fullPrompt = SYSTEM_PROMPT + '\n\n' + prompt;

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key exists:', !!apiKey);

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: fullPrompt,
    });

    return Response.json({
      content: response.text,
      sajuData: {
        pillars: sajuData.pillars,
        ilju: sajuData.ilju,
        summary: sajuData.summary,
        ohaengCount: sajuData.ohaengCount,
      }
    });

  } catch (error) {
    console.error('Generate error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
