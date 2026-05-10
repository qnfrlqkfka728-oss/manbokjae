import { GoogleGenAI } from '@google/genai';
import { calculateSaju } from '@/lib/saju_engine';
import { SYSTEM_PROMPT, ILJU_DATA, CHAPTER_TITLES } from '@/lib/saju_data';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const { year, month, day, hour, gender } = body;

    const sajuData = calculateSaju(
      parseInt(year), parseInt(month), parseInt(day),
      parseInt(hour ?? 12), gender
    );

    const { pillars, ilju, ilgan, ohaengCount, maxOh, minOh, shinGang } = sajuData;
    const iljuInfo = ILJU_DATA[ilju] || {};

    const prompt = `${SYSTEM_PROMPT}

[사주 데이터]
- 년주: ${pillars.년주.cg}${pillars.년주.jj}
- 월주: ${pillars.월주.cg}${pillars.월주.jj}
- 일주: ${pillars.일주.cg}${pillars.일주.jj} (나 자신)
- 시주: ${pillars.시주.cg}${pillars.시주.jj}
- 일간: ${ilgan} / 일주 특징: ${iljuInfo.본바탕 || ''}
- ${shinGang ? '신강(에너지 강함)' : '신약(에너지 약함)'}
- 오행 강한 것: ${maxOh} / 부족한 것: ${minOh}
- 키워드: ${(iljuInfo.키워드 || []).join(', ')}

위 사주를 바탕으로 아래 10개 챕터를 모두 작성해주세요.
각 챕터는 반드시 [1장], [2장] 형식으로 시작해야 합니다.

[1장] 하늘이 새긴 여덟 글자 (200자)
이 팔자의 전체 기운, 오행 특징, 독특한 포인트

[2장] 당신의 본바탕 (400자)
타고난 성격, 남들이 보는 나 vs 진짜 내면, 스트레스 반응

[3장] 감춰진 나와 드러난 나 (400자)
세상에 내보이는 모습, 혼자일 때의 진짜 나, 숨겨진 강점

[4장] 복이 드나드는 길 (400자)
재물 그릇, 돈 버는 방식, 소비 패턴, 재물운 높이는 법

[5장] 인연의 온도 (400자)
연애 매력, 스타일, 운명의 짝 특징, 결혼운

[6장] 밥벌이의 결 (400자)
타고난 재능, 적합한 직업, 직장 강점/약점, 사업 가능성

[7장] 몸이 보내는 신호 (350자)
타고난 체질, 주의 부위(오행 기준), 맞는 운동/식습관

[8장] 인생의 물결 (400자)
초년/청년/중년/말년기 흐름

[9장] 앞으로의 5년 (400자)
2025~2029년 연도별 운세 흐름

[10장] 만복 선생의 당부 (300자)
빛나는 장점, 주의할 점, 따뜻한 마지막 당부`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const text = response.text;

    // 챕터별로 분리
    const chapters = {};
    const chapterKeys = ['1장','2장','3장','4장','5장','6장','7장','8장','9장','10장'];
    
    chapterKeys.forEach((key, i) => {
      const startMarker = `[${key}]`;
      const nextMarker = i < chapterKeys.length - 1 ? `[${chapterKeys[i+1]}]` : null;
      
      const startIdx = text.indexOf(startMarker);
      if (startIdx === -1) { chapters[key] = ''; return; }
      
      const contentStart = startIdx + startMarker.length;
      const endIdx = nextMarker ? text.indexOf(nextMarker) : text.length;
      
      chapters[key] = text.slice(contentStart, endIdx !== -1 ? endIdx : text.length).trim();
    });

    return Response.json({
      chapters,
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
