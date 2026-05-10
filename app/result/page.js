'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CHAPTER_TITLES } from '@/lib/saju_data';

const CHAPTERS = Object.keys(CHAPTER_TITLES);

function PillarBox({ label, cg, jj, cgHan, jjHan, isMe }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
      <div style={{ fontSize:'11px', color:'rgba(201,168,76,0.5)', marginBottom:'4px' }}>{label}</div>
      <div style={{ width:'60px', height:'72px', border:`1px solid ${isMe?'#c9a84c':'rgba(201,168,76,0.3)'}`, borderRadius:'4px', background:isMe?'rgba(201,168,76,0.1)':'rgba(201,168,76,0.03)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2px' }}>
        <span style={{ fontSize:'22px', color:isMe?'#c9a84c':'#e8d5a3' }}>{cgHan}</span>
        <span style={{ fontSize:'18px', color:'rgba(232,213,163,0.6)' }}>{jjHan}</span>
      </div>
      <div style={{ fontSize:'10px', color:'rgba(201,168,76,0.4)' }}>{cg}{jj}</div>
    </div>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const [chapters, setChapters] = useState({});
  const [sajuData, setSajuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    generateReport();
  }, []);

  const generateReport = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.chapters) {
        setChapters(data.chapters);
        if (data.sajuData) setSajuData(data.sajuData);
      } else {
        setError(data.error || '오류가 발생했습니다.');
      }
    } catch (err) {
      setError('연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight:'100vh', background:'#0a0705', color:'#e8d5a3', fontFamily:"'Noto Serif KR', serif" }}>
      <header style={{ padding:'20px 24px', borderBottom:'1px solid rgba(201,168,76,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'rgba(10,7,5,0.95)', backdropFilter:'blur(10px)', zIndex:100 }}>
        <span style={{ fontSize:'16px', fontWeight:'700', color:'#c9a84c' }}>☯ 만복재</span>
        <span style={{ fontSize:'13px', color:'rgba(232,213,163,0.5)' }}>{params.name}님의 사주</span>
      </header>

      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'0 24px' }}>
        {sajuData && (
          <div style={{ padding:'40px 0 32px', textAlign:'center' }}>
            <p style={{ fontSize:'12px', color:'rgba(201,168,76,0.5)', letterSpacing:'0.2em', marginBottom:'24px' }}>하늘이 새긴 여덟 글자</p>
            <div style={{ display:'flex', justifyContent:'center', gap:'12px', marginBottom:'16px' }}>
              {['년주','월주','일주','시주'].map((key) => (
                <PillarBox key={key} label={key} isMe={key==='일주'} {...sajuData.pillars[key]} />
              ))}
            </div>
            <p style={{ fontSize:'13px', color:'rgba(201,168,76,0.6)', marginTop:'12px' }}>{sajuData.summary}</p>
          </div>
        )}

        {loading && (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ fontSize:'40px', marginBottom:'24px', animation:'spin 2s linear infinite', display:'inline-block' }}>☯</div>
            <p style={{ fontSize:'15px', color:'rgba(232,213,163,0.6)', lineHeight:'1.8' }}>
              만복 선생이 당신의 팔자를<br/>살펴보고 있소...
            </p>
            <p style={{ fontSize:'12px', color:'rgba(232,213,163,0.3)', marginTop:'12px' }}>약 10~20초 소요됩니다</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <p style={{ color:'#e88c6a', fontSize:'14px', marginBottom:'16px' }}>{error}</p>
            <button onClick={generateReport} style={{ padding:'12px 28px', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'#c9a84c', borderRadius:'4px', cursor:'pointer', fontSize:'14px', fontFamily:'inherit' }}>
              다시 시도하기
            </button>
          </div>
        )}

        {!loading && CHAPTERS.map(ch => (
          chapters[ch] ? (
            <div key={ch} style={{ padding:'32px 0', borderBottom:'1px solid rgba(201,168,76,0.08)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
                <span style={{ fontSize:'11px', color:'rgba(201,168,76,0.5)', letterSpacing:'0.1em' }}>{ch}</span>
                <h2 style={{ fontSize:'18px', fontWeight:'700', color:'#c9a84c' }}>{CHAPTER_TITLES[ch]}</h2>
              </div>
              <div style={{ fontSize:'15px', lineHeight:'1.9', color:'rgba(232,213,163,0.85)', whiteSpace:'pre-wrap' }}>
                {chapters[ch]}
              </div>
            </div>
          ) : null
        ))}

        {!loading && !error && (
          <div style={{ padding:'48px 0', textAlign:'center' }}>
            <div style={{ fontSize:'28px', color:'rgba(201,168,76,0.3)', marginBottom:'16px' }}>☯</div>
            <p style={{ fontSize:'14px', color:'rgba(232,213,163,0.4)', lineHeight:'1.8', marginBottom:'24px' }}>
              만복 선생의 풀이가 도움이 되셨소?<br/>지인에게도 알려주시면 고맙겠소.
            </p>
            <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:'8px', border:'1px solid rgba(201,168,76,0.3)', color:'#c9a84c', padding:'12px 28px', borderRadius:'4px', fontSize:'14px', textDecoration:'none' }}>
              다시 사주 보기
            </a>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#0a0705; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
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
