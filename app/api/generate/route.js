import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateSaju } from '@/lib/saju_engine';
import { buildPrompt, SYSTEM_PROMPT } from '@/lib/saju_data';

export async function POST(request) {
  try {
    const body = await request.json();
    const { year, month, day, hour, gender, chapter } = body;

    if (!year || !month || !day || !gender || !chapter) {
      return Response.json({ error: '필수 값 누락' }, { status: 400 });
    }

    const sajuData = calculateSaju(
      parseInt(year), parseInt(month), parseInt(day),
      parseInt(hour ?? 12), gender
    );

    const prompt = buildPrompt(chapter, sajuData);
    const fullPrompt = SYSTEM_PROMPT + '\n\n' + prompt;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    return Response.json({
      content: text,
      sajuData: {
        pillars: sajuData.pillars,
        ilju: sajuData.ilju,
        summary: sajuData.summary,
        ohaengCount: sajuData.ohaengCount,
      }
    });

  } catch (error) {
    console.error('Generate error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
