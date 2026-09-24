import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';
const slb= p => p>=80?'Excellent':p>=60?'Average':'Needs Work';

const DEMO_EVALS = [
  { overall_score_percentage:90, evaluation_date:'2026-03-10', coaching_completed:true,  level1:'Billing complaints', improvement_area:'None',         feedback:'Great call handling',       phone:'07501234567', ticket_id:'TK-001', qa_name:'Miran' },
  { overall_score_percentage:70, evaluation_date:'2026-03-07', coaching_completed:false, level1:'Inquiries',          improvement_area:'FAQ alignment', feedback:'Review FAQ guidelines',      phone:'07501234568', ticket_id:'TK-002', qa_name:'Miran' },
  { overall_score_percentage:80, evaluation_date:'2026-03-03', coaching_completed:true,  level1:'General complaints', improvement_area:'Tone of voice', feedback:'Good improvement noted',     phone:'07501234569', ticket_id:'TK-003', qa_name:'Miran' },
  { overall_score_percentage:60, evaluation_date:'2026-02-28', coaching_completed:true,  level1:'Service requests',   improvement_area:'CRM tagging',  feedback:'Tag correctly next time',    phone:'07501234570', ticket_id:'TK-004', qa_name:'Miran' },
  { overall_score_percentage:100,evaluation_date:'2026-02-22', coaching_completed:true,  level1:'Inquiries',          improvement_area:'None',         feedback:'Perfect score — well done!', phone:'07501234571', ticket_id:'TK-005', qa_name:'Miran' },
];

const DEMO_SESSIONS = [
  { title:'CRM System Training',   date:'2026-03-12', status:'upcoming',  duration:90,  trainer:'Kak Arsalan', attendees:['Abdullrahman Ali','Govand Wali','Halland Hemn'] },
  { title:'High Bill Handling',    date:'2026-03-08', status:'completed', duration:60,  trainer:'Kak Arsalan', attendees:['Barham Qasim','Ali Khalid'] },
  { title:'Communication Skills',  date:'2026-03-05', status:'completed', duration:120, trainer:'Kak Arsalan', attendees:['Abdullrahman Ali','Lawin Kosrat'] },
];

export default function MyPerformance({ user }) {
  const [evals, setEvals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('all');

  useEffect(()=>{
    fetch('http://localhost:8080/api/evaluations').then(r=>r.json()).then(data=>{
      const mine = Array.isArray(data) ? data.filter(e=>e.agent_name===user?.name) : [];
      setEvals(mine.length>0 ? mine : DEMO_EVALS);
      setLoading(false);
    }).catch(()=>{ setEvals(DEMO_EVALS); setLoading(false); });
  },[user]);

  const now = new Date();
  const filtered = evals.filter(e=>{
    if (range==='all') return true;
    const d = new Date(e.evaluation_date);
    if (range==='30d') return (now-d)<=30*24*3600*1000;
    if (range==='7d')  return (now-d)<=7*24*3600*1000;
    return true;
  });

  const avgScore = filtered.length ? Math.round(filtered.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/filtered.length) : 0;
  const excellent = filtered.filter(e=>(e.overall_score_percentage||0)>=80).length;
  const average   = filtered.filter(e=>(e.overall_score_percentage||0)>=60&&(e.overall_score_percentage||0)<80).length;
  const needsWork = filtered.filter(e=>(e.overall_score_percentage||0)<60).length;

  // Category breakdown
  const cats = {};
  filtered.forEach(e=>{ if(e.level1){ cats[e.level1]=(cats[e.level1]||0)+1; } });
  const catArr = Object.entries(cats).sort((a,b)=>b[1]-a[1]);
  const maxCat = catArr.length ? catArr[0][1] : 1;

  // Sorted evals for chart
  const chartEvals = [...filtered].sort((a,b)=>new Date(a.evaluation_date)-new Date(b.evaluation_date));

  const btnBase = { padding:'9px 18px', borderRadius:20, border:'1px solid', cursor:'pointer', fontSize:12, fontWeight:700, transition:'all 0.15s', fontFamily:"'Inter','Segoe UI',sans-serif" };

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#A78BFA', marginBottom:6 }}>MY ACCOUNT</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:'#FFFFFF' }}>My Performance</h1>
          <div style={{ display:'flex', gap:8 }}>
            {[['all','All Time'],['30d','30 Days'],['7d','7 Days']].map(([v,l])=>(
              <button key={v} onClick={()=>setRange(v)} style={{ ...btnBase, borderColor:range===v?'#A78BFA':'rgba(255,255,255,0.1)', background:range===v?'rgba(167,139,250,0.15)':'transparent', color:range===v?'#A78BFA':'#8FA3C4' }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Avg Score Hero */}
      <div style={{ background:'linear-gradient(135deg,rgba(167,139,250,0.12),rgba(255,107,53,0.08))', border:'1px solid rgba(167,139,250,0.2)', borderRadius:20, padding:'28px 32px', marginBottom:22, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#A78BFA', marginBottom:8 }}>YOUR AVERAGE SCORE</div>
          <div style={{ fontSize:60, fontWeight:900, color:sc(avgScore), lineHeight:1 }}>{avgScore}%</div>
          <div style={{ fontSize:14, color:sc(avgScore), fontWeight:700, marginTop:6 }}>{slb(avgScore)}</div>
        </div>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          {[
            { label:'Excellent', value:excellent, color:'#4ADE80', pct:filtered.length?Math.round(excellent/filtered.length*100):0 },
            { label:'Average',   value:average,   color:'#FBBF24', pct:filtered.length?Math.round(average/filtered.length*100):0 },
            { label:'Needs Work',value:needsWork,  color:'#F87171', pct:filtered.length?Math.round(needsWork/filtered.length*100):0 },
          ].map((t,i)=>(
            <div key={i} style={{ textAlign:'center', background:'rgba(255,255,255,0.06)', border:`1px solid ${t.color}25`, borderRadius:14, padding:'16px 20px', minWidth:90 }}>
              <div style={{ fontSize:28, fontWeight:800, color:t.color }}>{t.value}</div>
              <div style={{ fontSize:11, color:t.color, fontWeight:700, opacity:0.8, marginTop:3 }}>{t.label}</div>
              <div style={{ fontSize:11, color:'#4A5A78', marginTop:2 }}>{t.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Score Timeline */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'22px 24px' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#A78BFA', marginBottom:4 }}>TIMELINE</div>
          <div style={{ fontSize:16, fontWeight:800, color:'#FFFFFF', marginBottom:20 }}>Score Over Time</div>
          {chartEvals.length===0 ? (
            <div style={{ color:'#4A5A78', fontSize:13, textAlign:'center', padding:'30px 0' }}>No data in range</div>
          ) : (
            <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:90 }}>
              {chartEvals.map((e,i)=>{
                const h = Math.max(8, Math.round((e.overall_score_percentage/100)*80));
                const clr = sc(e.overall_score_percentage);
                return (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:clr }}>{e.overall_score_percentage}%</div>
                    <div style={{ width:'100%', height:h, background:`linear-gradient(180deg,${clr},${clr}77)`, borderRadius:'3px 3px 0 0' }}/>
                    <div style={{ fontSize:9, color:'#4A5A78', textAlign:'center', whiteSpace:'nowrap' }}>
                      {e.evaluation_date?new Date(e.evaluation_date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}):'—'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'22px 24px' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#FF6B35', marginBottom:4 }}>CATEGORIES</div>
          <div style={{ fontSize:16, fontWeight:800, color:'#FFFFFF', marginBottom:20 }}>Call Category Breakdown</div>
          {catArr.length===0 ? (
            <div style={{ color:'#4A5A78', fontSize:13, textAlign:'center', padding:'30px 0' }}>No data in range</div>
          ) : catArr.map(([cat,count],i)=>{
            const clrs=['#FF6B35','#A78BFA','#60A5FA','#34D399','#FBBF24'];
            return (
              <div key={i} style={{ marginBottom:i<catArr.length-1?14:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'#E2E8F0' }}>{cat}</span>
                  <span style={{ fontSize:12, color:'#8FA3C4' }}>{count}</span>
                </div>
                <div style={{ height:8, background:'rgba(255,255,255,0.07)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${(count/maxCat)*100}%`, background:clrs[i%clrs.length], borderRadius:4, transition:'width 0.5s ease' }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}