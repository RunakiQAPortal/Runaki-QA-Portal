import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';

const DEMO_EVALS = [
  { agent_name:'Abdullrahman Ali Mahdi', qa_name:'Miran',    overall_score_percentage:90, coaching_completed:true,  evaluation_date:'2026-03-10', level1:'Billing complaints' },
  { agent_name:'Govand Wali',            qa_name:'Sizar',    overall_score_percentage:70, coaching_completed:false, evaluation_date:'2026-03-10', level1:'Inquiries'          },
  { agent_name:'Halland Hemn',           qa_name:'Brwa',     overall_score_percentage:100,coaching_completed:true,  evaluation_date:'2026-03-09', level1:'General complaints' },
  { agent_name:'Aya Edris',              qa_name:'Sizar',    overall_score_percentage:50, coaching_completed:false, evaluation_date:'2026-03-09', level1:'Service requests'   },
  { agent_name:'Rayan Jaafar',           qa_name:'Miran',    overall_score_percentage:80, coaching_completed:true,  evaluation_date:'2026-03-08', level1:'Billing complaints' },
  { agent_name:'Daryan Bakr Kakamand',   qa_name:'Brwa',     overall_score_percentage:60, coaching_completed:false, evaluation_date:'2026-03-08', level1:'Inquiries'          },
  { agent_name:'Barham Qasim Ahmed',     qa_name:'Miran',    overall_score_percentage:80, coaching_completed:true,  evaluation_date:'2026-03-07', level1:'General complaints' },
  { agent_name:'Ali Khalid',             qa_name:'Sizar',    overall_score_percentage:40, coaching_completed:false, evaluation_date:'2026-03-07', level1:'Service requests'   },
];

export default function ReportsCenter() {
  const [evals, setEvals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('all');

  useEffect(()=>{
    fetch('http://localhost:8080/api/evaluations').then(r=>r.json()).then(data=>{
      setEvals(Array.isArray(data)&&data.length>0?data:DEMO_EVALS);
      setLoading(false);
    }).catch(()=>{ setEvals(DEMO_EVALS); setLoading(false); });
  },[]);

  const now = new Date();
  const filtered = evals.filter(e=>{
    if (range === 'all') return true;
    const d = new Date(e.evaluation_date);
    if (range === '7d') return (now-d) <= 7*24*3600*1000;
    if (range === '30d') return (now-d) <= 30*24*3600*1000;
    return true;
  });

  const avgScore = filtered.length ? Math.round(filtered.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/filtered.length) : 0;
  const excellent = filtered.filter(e=>(e.overall_score_percentage||0)>=80).length;
  const needsWork = filtered.filter(e=>(e.overall_score_percentage||0)<60).length;
  const coached = filtered.filter(e=>e.coaching_completed).length;

  // QA breakdown
  const qaStats = ['Miran','Sizar','Brwa','Mohammed'].map(qa=>{
    const qe = filtered.filter(e=>e.qa_name===qa);
    const avg = qe.length ? Math.round(qe.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/qe.length) : 0;
    return { name:qa, count:qe.length, avg, pending:qe.filter(e=>!e.coaching_completed).length };
  });

  // Category breakdown
  const cats = {};
  filtered.forEach(e=>{ if(e.level1){ cats[e.level1]=(cats[e.level1]||0)+1; } });
  const catArr = Object.entries(cats).sort((a,b)=>b[1]-a[1]);
  const maxCat = catArr.length ? catArr[0][1] : 1;

  const exportCSV = () => {
    const rows = [['Agent','QA Officer','Score','Coaching','Date','Category'],...filtered.map(e=>[e.agent_name,e.qa_name,`${e.overall_score_percentage||0}%`,e.coaching_completed?'Done':'Pending',e.evaluation_date||'',e.level1||''])];
    const csv = rows.map(r=>r.join(',')).join('\n');
    const a = document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download=`QA_Report_${new Date().toISOString().slice(0,10)}.csv`; a.click();
  };

  const btnBase = { padding:'9px 18px', borderRadius:10, border:'1px solid', cursor:'pointer', fontSize:13, fontWeight:700, transition:'all 0.15s' };

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`select option{background:#131626!important;color:#FFFFFF!important} select{color-scheme:dark}`}</style>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#FF6B35', marginBottom:6 }}>SUPERVISOR VIEW</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:'#FFFFFF' }}>Reports Center</h1>
          <button onClick={exportCSV} style={{ ...btnBase, borderColor:'rgba(74,222,128,0.4)', background:'rgba(74,222,128,0.1)', color:'#4ADE80' }}>
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {/* Range filter */}
      <div style={{ display:'flex', gap:8, marginBottom:22 }}>
        {[['all','All Time'],['30d','Last 30 Days'],['7d','Last 7 Days']].map(([v,l])=>(
          <button key={v} onClick={()=>setRange(v)} style={{ ...btnBase, borderColor:range===v?'#FF6B35':'rgba(255,255,255,0.1)', background:range===v?'rgba(255,107,53,0.15)':'transparent', color:range===v?'#FF6B35':'#8FA3C4' }}>{l}</button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:13, color:'#4A5A78', alignSelf:'center' }}>{filtered.length} evaluations in range</span>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Evaluations', value:filtered.length, color:'#FF6B35' },
          { label:'Avg Score',   value:`${avgScore}%`,  color:sc(avgScore) },
          { label:'Excellent',   value:excellent,        color:'#4ADE80' },
          { label:'Needs Work',  value:needsWork,        color:'#F87171' },
          { label:'Coached',     value:`${coached}/${filtered.length}`, color:'#A78BFA' },
        ].map((k,i)=>(
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 14px 14px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#4A5A78', marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:24, fontWeight:800, color:'#FFFFFF' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* QA Officer Breakdown */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'22px 24px' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#FF6B35', marginBottom:4 }}>BREAKDOWN</div>
          <div style={{ fontSize:16, fontWeight:800, color:'#FFFFFF', marginBottom:18 }}>QA Officer Summary</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 60px 60px 80px', gap:0, marginBottom:10 }}>
            {['Officer','Evals','Avg','Pending'].map((h,i)=><div key={i} style={{ fontSize:10, fontWeight:700, color:'#4A5A78', letterSpacing:'1.5px', textTransform:'uppercase', paddingBottom:10, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</div>)}
          </div>
          {qaStats.map((qa,i)=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 60px 60px 80px', alignItems:'center', padding:'10px 0', borderBottom:i<qaStats.length-1?'1px solid rgba(255,255,255,0.04)':'none' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#E2E8F0' }}>{qa.name}</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#60A5FA' }}>{qa.count}</div>
              <div><span style={{ padding:'3px 8px', borderRadius:20, background:sbg(qa.avg), fontSize:11, fontWeight:700, color:sc(qa.avg) }}>{qa.avg}%</span></div>
              <div><span style={{ padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:700, background:qa.pending>0?'rgba(251,191,36,0.12)':'rgba(74,222,128,0.1)', color:qa.pending>0?'#FBBF24':'#4ADE80' }}>{qa.pending>0?`${qa.pending} pend.`:'✓ Clear'}</span></div>
            </div>
          ))}
        </div>

        {/* Category Breakdown */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'22px 24px' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#A78BFA', marginBottom:4 }}>CATEGORIES</div>
          <div style={{ fontSize:16, fontWeight:800, color:'#FFFFFF', marginBottom:18 }}>Call Category Breakdown</div>
          {catArr.length === 0
            ? <div style={{ color:'#4A5A78', fontSize:13 }}>No data available</div>
            : catArr.map(([cat,count],i)=>{
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
            })
          }
        </div>
      </div>
    </div>
  );
}