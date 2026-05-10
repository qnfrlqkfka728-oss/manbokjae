'use client';
import { useState, useRouter } from 'react';
import { useRouter as useNextRouter } from 'next/navigation';

const inputStyle = {
  width: '100%', padding: '14px 16px',
  background: 'rgba(201,168,76,0.05)',
  border: '1px solid rgba(201,168,76,0.25)',
  borderRadius: '6px', color: '#e8d5a3',
  fontSize: '16px', fontFamily: 'inherit',
  outline: 'none', transition: 'border 0.2s',
};

const labelStyle = {
  display: 'block', fontSize: '13px',
  color: 'rgba(201,168,76,0.8)',
  marginBottom: '8px', letterSpacing: '0.05em',
};

const HOURS = [
  { value: '0', label: '모름 / 기억 안남' },
  { value: '23', label: '자시 (23:00~00:59)' },
  { value: '1', label: '축시 (01:00~02:59)' },
  { value: '3', label: '인시 (03:00~04:59)' },
  { value: '5', label: '묘시 (05:00~06:59)' },
  { value: '7', label: '진시 (07:00~08:59)' },
  { value: '9', label: '사시 (09:00~10:59)' },
  { value: '11', label: '오시 (11:00~12:59)' },
  { value: '13', label: '미시 (13:00~14:59)' },
  { value: '15', label: '신시 (15:00~16:59)' },
  { value: '17', label: '유시 (17:00~18:59)' },
  { value: '19', label: '술시 (19:00~20:59)' },
  { value: '21', label: '해시 (21:00~22:59)' },
];

export default function SajuPage() {
  const router = useNextRouter();
  const [form, setForm] = useState({ name:'', gender:'', year:'', month:'', day:'', hour:'0' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.gender || !form.year || !form.month || !form.day) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    const params = new URLSearchParams(form);
    router.push(`/result?${params.toString()}`);
  };

  return (
    <main style={{ minHeight:'100vh', background:'#0a0705', color:'#e8d5a3', fontFamily:"'Noto Serif KR', serif", display:'flex', flexDirection:'column', alignItems:'center', padding:'40px 24px 80px' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>
        <a href="/" style={{ color:'rgba(201,168,76,0.6)', fontSize:'13px', textDecoration:'none', display:'block', marginBottom:'32px' }}>← 만복재로 돌아가기</a>

        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{ fontSize:'40px', marginBottom:'16px' }}>☯</div>
          <h1 style={{ fontSize:'22px', fontWeight:'700', color:'#c9a84c', marginBottom:'8px' }}>생년월일을 알려주시오</h1>
          <p style={{ fontSize:'13px', color:'rgba(232,213,163,0.5)', lineHeight:'1.7' }}>
            만복 선생이 하늘의 기운을 읽어<br/>당신의 팔자를 풀어드리겠소.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          <div>
            <label style={labelStyle}>이름</label>
            <input style={inputStyle} placeholder="성함을 알려주시오" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
          </div>

          <div>
            <label style={labelStyle}>성별</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              {[{val:'M', label:'남자'}, {val:'F', label:'여자'}].map(g => (
                <button key={g.val} type="button" onClick={() => setForm({...form, gender:g.val})}
                  style={{ padding:'14px', borderRadius:'6px', fontSize:'15px', fontFamily:'inherit', cursor:'pointer', transition:'all 0.2s', border: form.gender===g.val ? '1px solid #c9a84c' : '1px solid rgba(201,168,76,0.25)', background: form.gender===g.val ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.05)', color: form.gender===g.val ? '#c9a84c' : 'rgba(232,213,163,0.6)' }}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>생년월일</label>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:'8px' }}>
              <input style={inputStyle} type="number" placeholder="년도 (예: 1995)" min="1900" max="2020" value={form.year} onChange={e => setForm({...form, year:e.target.value})} />
              <input style={inputStyle} type="number" placeholder="월" min="1" max="12" value={form.month} onChange={e => setForm({...form, month:e.target.value})} />
              <input style={inputStyle} type="number" placeholder="일" min="1" max="31" value={form.day} onChange={e => setForm({...form, day:e.target.value})} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>태어난 시간 <span style={{ color:'rgba(232,213,163,0.4)' }}>(모르면 '모름' 선택)</span></label>
            <select style={{...inputStyle, cursor:'pointer'}} value={form.hour} onChange={e => setForm({...form, hour:e.target.value})}>
              {HOURS.map(h => <option key={h.value} value={h.value} style={{ background:'#1a1208' }}>{h.label}</option>)}
            </select>
          </div>

          {error && <p style={{ color:'#e88c6a', fontSize:'13px', textAlign:'center' }}>{error}</p>}

          <div style={{ marginTop:'8px', padding:'16px', background:'rgba(201,168,76,0.05)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:'6px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'14px', color:'rgba(232,213,163,0.7)' }}>만복재 통합 사주 분석</span>
              <span style={{ fontSize:'14px', color:'#c9a84c', fontWeight:'700' }}>13,900원</span>
            </div>
            <div style={{ fontSize:'12px', color:'rgba(232,213,163,0.4)', lineHeight:'1.6' }}>
              10개 챕터 · 완전 개인화 · 즉시 분석
            </div>
          </div>

          <button type="submit" style={{ padding:'18px', background:'linear-gradient(135deg, #c9a84c, #a07830)', color:'#0a0705', border:'none', borderRadius:'6px', fontSize:'17px', fontWeight:'700', fontFamily:'inherit', cursor:'pointer', letterSpacing:'0.05em', boxShadow:'0 4px 24px rgba(201,168,76,0.25)' }}>
            결제하고 사주 보기
          </button>

          <p style={{ textAlign:'center', fontSize:'12px', color:'rgba(232,213,163,0.3)' }}>
            토스페이 · 카카오페이 · 신용카드 결제 가능
          </p>
        </form>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:#0a0705;} input::placeholder{color:rgba(232,213,163,0.3);} input:focus,select:focus{border-color:rgba(201,168,76,0.6)!important;}`}</style>
    </main>
  );
}
