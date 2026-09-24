import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';

const TARGETS = [
  { id:1, label:'Monthly Evaluations per QA',    target:40,  current:34, unit:'evals',   color:'#FF6B35' },
  { id:2, label:'Team Average Score',             target:80,  current:76, unit:'%',        color:'#4ADE80' },
  { id:3, label:'Coaching Completion Rate',       target:90,  current:72, unit:'%',        color:'#A78BFA' },
  { id:4, label:'Spot Checks per QA (Monthly)',   target:20,  current:15, unit:'checks',  color:'#60A5FA' },
  { id:5, label:'VIVA Sessions (Monthly)',        target:10,  current:7,  unit:'sessions', color:'#FBBF24' },
  { id:6, label:'Agent Pass Rate',                target:85,  current:78, unit:'%',        color:'#34D399' },
];

export default function TargetsGoals() {
  const [targets] = useState(TARGETS);

  const achieved = targets.filter(t=>(t.current/t.target)>=1).length;
  const onTrack = targets.filter(t=>{const p=t.current/t.target; return p>=0.75&&p<1;}).length;
  const atRisk = targets.filter(t=>(t.current/t.target)<0.75).length;

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#FBBF24', marginBottom:6 }}>SUPERVISOR VIEW</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:'#FFFFFF' }}>Targets & Goals</h1>
          <div style={{ padding:'7px 16px', borderRadius:20, background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.2)', fontSize:13, fontWeight:600, color:'#FBBF24' }}>March 2026</div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:28 }}>
        {[
          { label:'Achieved',  value:achieved, color:'#4ADE80', bg:'rgba(74,222,128,0.1)',   bd:'rgba(74,222,128,0.2)',   icon:'✓' },
          { label:'On Track',  value:onTrack,  color:'#FBBF24', bg:'rgba(251,191,36,0.1)',  bd:'rgba(251,191,36,0.2)',   icon:'◎' },
          { label:'At Risk',   value:atRisk,   color:'#F87171', bg:'rgba(248,113,113,0.1)', bd:'rgba(248,113,113,0.2)',  icon:'⚠' },
        ].map((s,i)=>(
          <div key={i} style={{ background:s.bg, border:`1px solid ${s.bd}`, borderRadius:16, padding:'22px 24px', textAlign:'center' }}>
            <div style={{ fontSize:32, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontSize:36, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:s.color, marginTop:4, opacity:0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Target Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
        {targets.map((t,i)=>{
          const pct = Math.min(Math.round((t.current/t.target)*100), 100);
          const status = pct >= 100 ? 'achieved' : pct >= 75 ? 'on-track' : 'at-risk';
          const statusClr = status==='achieved'?'#4ADE80':status==='on-track'?'#FBBF24':'#F87171';
          const statusBg  = status==='achieved'?'rgba(74,222,128,0.1)':status==='on-track'?'rgba(251,191,36,0.1)':'rgba(248,113,113,0.1)';
          const statusLbl = status==='achieved'?'✓ Achieved':status==='on-track'?'◎ On Track':'⚠ At Risk';
          return (
            <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${t.color}25`, borderRadius:18, padding:'24px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${t.color},${t.color}55)`, borderRadius:'0 0 18px 18px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:t.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:t.color, boxShadow:`0 0 8px ${t.color},0 0 14px ${t.color}88` }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#E2E8F0', maxWidth:'70%' }}>{t.label}</div>
                <span style={{ padding:'4px 12px', borderRadius:20, background:statusBg, fontSize:11, fontWeight:700, color:statusClr, flexShrink:0 }}>{statusLbl}</span>
              </div>
              <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:14 }}>
                <span style={{ fontSize:36, fontWeight:800, color:t.color }}>{t.current}</span>
                <span style={{ fontSize:18, color:'#4A5A78' }}>/ {t.target}</span>
                <span style={{ fontSize:13, color:'#4A5A78' }}>{t.unit}</span>
              </div>
              <div style={{ height:10, background:'rgba(255,255,255,0.07)', borderRadius:5, overflow:'hidden', marginBottom:8 }}>
                <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${t.color},${t.color}aa)`, borderRadius:5, transition:'width 0.6s ease' }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:11, color:'#4A5A78' }}>Progress</span>
                <span style={{ fontSize:13, fontWeight:700, color:t.color }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop:24, padding:'16px 20px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14 }}>
        <div style={{ fontSize:12, color:'#4A5A78' }}>
          ⓘ Targets are set for March 2026. Data updates automatically as QA officers submit evaluations, spot checks, and VIVA sessions.
        </div>
      </div>
    </div>
  );
}