'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <main style={{
      minHeight: '100vh', background: '#0a0705', color: '#e8d5a3',
      fontFamily: "'Noto Serif KR', serif", position: 'relative',
    }}>
      <div style={{ position:'fixed', inset:0, zIndex:0, background:'radial-gradient(ellipse at 50% 0%, rgba(180,130,50,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />

      <header style={{ position:'relative', zIndex:10, padding:'24px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontSize:'20px' }}>☯</span>
          <span style={{ fontSize:'18px', fontWeight:'700', color:'#c9a84c', letterSpacing:'0.08em' }}>만복재</span>
        </div>
        <span style={{ fontSize:'12px', color:'rgba(232,213,163,0.4)', letterSpacing:'0.1em' }}>萬福齋</span>
      </header>

      <section style={{ position:'relative', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 24px 60px', textAlign:'center', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(20px)', transition:'all 0.8s ease' }}>
        <div style={{ width:'160px', height:'160px', borderRadius:'50%', border:'2px solid rgba(201,168,76,0.4)', background:'radial-gradient(circle, rgba(201,168,76,0.15), rgba(10,7,5,0.9))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'72px', marginBottom:'36px', boxShadow:'0 0 60px rgba(201,168,76,0.15)', position:'relative' }}>
          <img src="/manbokjae.png.png" alt="만복 선생" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
          <div style={{ position:'absolute', bottom:'-8px', background:'#c9a84c', color:'#0a0705', fontSize:'11px', fontWeight:'700', padding:'3px 14px', borderRadius:'20px' }}>만복 선생</div>
        </div>

        <p style={{ fontSize:'13px', letterSpacing:'0.25em', color:'rgba(201,168,76,0.7)', marginBottom:'16px' }}>AI 사주 분석</p>
        <h1 style={{ fontSize:'clamp(32px, 8vw, 52px)', fontWeight:'700', lineHeight:'1.2', background:'linear-gradient(180deg, #e8d5a3 0%, #c9a84c 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:'6px' }}>하늘이 새긴</h1>
        <h1 style={{ fontSize:'clamp(32px, 8vw, 52px)', fontWeight:'700', lineHeight:'1.2', background:'linear-gradient(180deg, #e8d5a3 0%, #c9a84c 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:'28px' }}>당신의 팔자</h1>

        <p style={{ fontSize:'15px', color:'rgba(232,213,163,0.65)', lineHeight:'1.8', maxWidth:'320px', marginBottom:'12px' }}>
          태어난 순간 하늘이 새겨 넣은<br/>당신만의 여덟 글자를 풀어드리오.
        </p>
        <p style={{ fontSize:'13px', color:'rgba(201,168,76,0.6)', marginBottom:'44px' }}>— 만복재 통합 사주 분석 13,900원 —</p>

        <Link href="/saju" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'linear-gradient(135deg, #c9a84c, #a07830)', color:'#0a0705', padding:'16px 40px', borderRadius:'4px', fontSize:'16px', fontWeight:'700', textDecoration:'none', letterSpacing:'0.05em', boxShadow:'0 4px 24px rgba(201,168,76,0.3)' }}>
          내 사주 확인하기 →
        </Link>
        <p style={{ marginTop:'16px', fontSize:'12px', color:'rgba(232,213,163,0.35)' }}>결제 후 즉시 분석 · 평균 소요 3분</p>
      </section>

      <section style={{ position:'relative', zIndex:10, padding:'0 24px 60px', maxWidth:'480px', margin:'0 auto' }}>
        <div style={{ border:'1px solid rgba(201,168,76,0.15)', borderRadius:'8px', padding:'28px 24px', background:'rgba(201,168,76,0.03)' }}>
          {[
            { icon:'📜', title:'10가지 심층 분석', desc:'본바탕부터 5년 운세까지' },
            { icon:'🎯', title:'당신만을 위한 풀이', desc:'생년월일시 기반 완전 개인화' },
            { icon:'⚡', title:'3분 즉시 확인', desc:'결제 후 바로 분석 시작' },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'16px', padding:'16px 0', borderBottom:i<2?'1px solid rgba(201,168,76,0.08)':'none' }}>
              <span style={{ fontSize:'24px', flexShrink:0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize:'14px', fontWeight:'700', color:'#e8d5a3', marginBottom:'4px' }}>{item.title}</div>
                <div style={{ fontSize:'13px', color:'rgba(232,213,163,0.5)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ position:'relative', zIndex:10, textAlign:'center', padding:'0 24px 80px' }}>
        <p style={{ fontSize:'14px', color:'rgba(232,213,163,0.5)', marginBottom:'24px' }}>지금 바로 당신의 팔자를 확인하시오</p>
        <Link href="/saju" style={{ display:'inline-flex', alignItems:'center', gap:'8px', border:'1px solid rgba(201,168,76,0.4)', color:'#c9a84c', padding:'14px 36px', borderRadius:'4px', fontSize:'15px', fontWeight:'600', textDecoration:'none' }}>
          사주 풀이 시작하기
        </Link>
      </section>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:#0a0705;}`}</style>
    </main>
  );
}
