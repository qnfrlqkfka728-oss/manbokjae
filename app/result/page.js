'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CHAPTER_TITLES } from '@/lib/saju_data';

const CHAPTERS = Object.keys(CHAPTER_TITLES);

function PillarBox({ label, cg, jj, cgHan, jjHan, isMe }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
      <div style={{ fontSize:'11px', color:'rgba(201,168,76,0.5)', marginBottom:'4px' }}>{label}</div>
      <div style={{ width:'60px', height:'72px', border:`1px solid ${isMe?'#c9a84c':'rgba(201,168,76,0.3)'}`, borderRadius:'4px', background: isMe?'rgba(201,168,76,0.1)':'rgba(201,168,76,0.03)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2px' }}>
        <span style={{ fontSize:'22px', color: isMe?'#c9a84c':'#e8d5a3' }}>{cgHan}</span>
        <span style={{ fontSize:'18px', color:'rgba(232,213,163,0.6)' }}>{jjHan}</span>
      </div>
      <div style={{ fontSize:'10px', color:'rgba(201,168,76,0.4)' }}>{cg}{jj}</div>
    </div>
  );
}

function ChapterSection({ chapter, title, content, loading }) {
  return (
    <div style={{ padding:'32px 0', borderBottom:'1px solid rgba(201,168,76,0.08)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
        <span style={{ fontSize:'11px', color:'rgba(201,168,76,0.5)', letterSpacing:'0.1em' }}>{chapter}</span>
        <h2 style={{ fontSize:'18px', fontWeight:'700', color:'#c9a84c' }}>{title}</h2>
      </div>
      {loading ? (
        <div style={{ display:'flex', alignItems:'center', gap:'10px', color:'rgba(232,213,163,0.4)' }}>
          <span style={{ animation:'spin 1s linear infinite', display:'inline-block' }}>☯</span>
          <span style={{ fontSize:'14px' }}>만복 선생이 살펴보는 중...</span>
        </div>
      ) : (
        <div style={{ fontSize:'15px', lineHeight:'1.9', color:'rgba(232,213,163,0.85)', whiteSpace:'pre-wrap' }}>
          {content}
        </div>
      )}
    </div>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState({});
  const [sajuData, setSajuData] = useState(null);
  const [loadingChapters, setLoadingChapters] = useState(new Set(CHAPTERS));
  const [currentChapter, setCurrentChapter] = useState(0);

  const params = {
    name: searchParams.get('name'),
    year: searchParams.get('year'),
    month: searchParams.get('month'),
    day: searchParams.get('day'),
    hour: searchParams.get('hour') || '12',
    gender: searchParams.get('gender'),
  };

  useEffect(() => {
    if (!params.year) return;
    generateAllChapters();
  }, []);

  const generateAllChapters = async () => {
    for (const chapter of CHAPTERS) {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...params, chapter }),
        });
        const data = await res.json();
        if (data.content) {
          setResults(prev => ({ ...prev, [chapter]: data.content }));
          if (!sajuData && data.sajuData) setSajuData(data.sajuData);
        }
      } catch (err) {
        setResults(prev => ({ ...prev, [chapter]: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }));
      }
      setLoadingChapters(prev => { const next = new Set(prev); next.delete(chapter); return next; });
    }
  };

  return (
    <main style={{ minHeight:'100vh', background:'#0a0705', color:'#e8d5a3', fontFamily:"'Noto Serif KR', serif" }}>
      {/* 헤더 */}
      <header style={{ padding:'20px 24px', borderBottom:'1px solid rgba(201,168,76,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'rgba(10,7,5,0.95)', backdropFilter:'blur(10px)', zIndex:100 }}>
        <span style={{ fontSize:'16px', fontWeight:'700', color:'#c9a84c' }}>☯ 만복재</span>
        <span style={{ fontSize:'13px', color:'rgba(232,213,163,0.5)' }}>{params.name}님의 사주</span>
      </header>

      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'0 24px' }}>
        {/* 사주팔자 시각화 */}
        {sajuData && (
          <div style={{ padding:'40px 0 32px', textAlign:'center' }}>
            <p style={{ fontSize:'12px', color:'rgba(201,168,76,0.5)', letterSpacing:'0.2em', marginBottom:'24px' }}>하늘이 새긴 여덟 글자</p>
            <div style={{ display:'flex', justifyContent:'center', gap:'12px', marginBottom:'16px' }}>
              {['년주','월주','일주','시주'].map((key, i) => (
                <PillarBox key={key} label={key} isMe={key==='일주'} {...sajuData.pillars[key]} />
              ))}
            </div>
            <p style={{ fontSize:'13px', color:'rgba(201,168,76,0.6)', marginTop:'12px' }}>{sajuData.summary}</p>
          </div>
        )}

        {/* 챕터들 */}
        {CHAPTERS.map(ch => (
          <ChapterSection
            key={ch}
            chapter={ch}
            title={CHAPTER_TITLES[ch]}
            content={results[ch]}
            loading={loadingChapters.has(ch)}
          />
        ))}

        {/* 하단 */}
        <div style={{ padding:'48px 0', textAlign:'center' }}>
          <div style={{ fontSize:'28px', color:'rgba(201,168,76,0.3)', marginBottom:'16px' }}>☯</div>
          <p style={{ fontSize:'14px', color:'rgba(232,213,163,0.4)', lineHeight:'1.8', marginBottom:'24px' }}>
            만복 선생의 풀이가 도움이 되셨소?<br/>
            지인에게도 알려주시면 고맙겠소.
          </p>
          <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:'8px', border:'1px solid rgba(201,168,76,0.3)', color:'#c9a84c', padding:'12px 28px', borderRadius:'4px', fontSize:'14px', textDecoration:'none' }}>
            다시 사주 보기
          </a>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#0a0705; }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      `}</style>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div style={{ background:'#0a0705', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#c9a84c', fontSize:'20px' }}>☯ 불러오는 중...</div>}>
      <ResultContent />
    </Suspense>
  );
}
