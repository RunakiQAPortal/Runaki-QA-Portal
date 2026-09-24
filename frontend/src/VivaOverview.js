import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';

const inp = { padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFFFFF', fontSize:13, outline:'none', fontFamily:"'Inter','Segoe UI',sans-serif" };
const sel = { ...inp, appearance:'none', WebkitAppearance:'none', cursor:'pointer', paddingRight:32, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238FA3C4' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundColor:'rgba(255,255,255,0.05)' };

const DEMO_VIVA = [
  { id:1, agentName:'Abdullrahman Ali', vivaName:'High Bill VIVA',     qaOfficer:'Miran', date:'10 Mar 2026', totalQ:4, score:4, pct:100 },
  { id:2, agentName:'Govand Wali',      vivaName:'CRM Navigation VIVA',qaOfficer:'Sizar', date:'09 Mar 2026', totalQ:3, score:2, pct:67  },
  { id:3, agentName:'Halland Hemn',     vivaName:'High Bill VIVA',     qaOfficer:'Brwa',  date:'09 Mar 2026', totalQ:4, score:3, pct:75  },
  { id:4, agentName:'Aya Edris',        vivaName:'CRM Navigation VIVA',qaOfficer:'Sizar', date:'08 Mar 2026', totalQ:3, score:1, pct:33  },
  { id:5, agentName:'Rayan Jaafar',     vivaName:'High Bill VIVA',     qaOfficer:'Miran', date:'07 Mar 2026', totalQ:4, score:4, pct:100 },
];

export default function VivaOverview() {
  const [vivas, setVivas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQA, setFilterQA] = useState('all');
  const [filterResult, setFilterResult] = useState('all');

  useEffect(()=>{
    fetch('http://localhost:8080/api/viva').then(r=>r.json()).then(data=>{
      setVivas(Array.isArray(data)&&data.length>0?data:DEMO_VIVA);
      setLoading(false);
    }).catch(()=>{ setVivas(DEMO_VIVA); setLoading(false); });
  },[]);

  const filtered = vivas.filter(v=>{
    if (filterQA !== 'all' && v.qaOfficer !== filterQA) return false;
    if (filterResult === 'pass' && (v.pct||0) < 60) return false;
    if (filterResult === 'fail' && (v.pct||0) >= 60) return false;
    return true;
  });

  const pass = vivas.filter(v=>(v.pct||0)>=60).length;
  const avgPct = vivas.length ? Math.round(vivas.reduce((s,v)=>s+(v.pct||0),0)/vivas.length) : 0;

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`.vo-row:hover{background:rgba(255,255,255,0.04)!important} select option{background:#131626!important;color:#FFFFFF!important} select{color-scheme:dark}`}</style>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#34D399', marginBottom:6 }}>SUPERVISOR VIEW</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:'#FFFFFF' }}>VIVA Overview</h1>
          <div style={{ padding:'7px 16px', borderRadius:20, background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.2)', fontSize:13, fontWeight:600, color:'#34D399' }}>{filtered.length} records</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'Total VIVAs', value:vivas.length, color:'#34D399' },
          { label:'Passed', value:pass, color:'#4ADE80' },
          { label:'Failed', value:vivas.length-pass, color:'#F87171' },
          { label:'Avg Score', value:`${avgPct}%`, color:sc(avgPct) },
        ].map((k,i)=>(
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 14px 14px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#4A5A78', marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:26, fontWeight:800, color:'#FFFFFF' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:18 }}>
        <select value={filterQA} onChange={e=>setFilterQA(e.target.value)} style={{ ...sel, minWidth:180 }}>
          <option value="all">All QA Officers</option>
          {['Miran','Sizar','Brwa','Mohammed'].map(q=><option key={q} value={q}>{q}</option>)}
        </select>
        <select value={filterResult} onChange={e=>setFilterResult(e.target.value)} style={{ ...sel, minWidth:150 }}>
          <option value="all">All Results</option>
          <option value="pass">Passed ≥60%</option>
          <option value="fail">Failed &lt;60%</option>
        </select>
      </div>

      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 160px 100px 90px 90px 80px', padding:'13px 24px', background:'rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          {['Agent','VIVA Name','QA Officer','Questions','Score','Date'].map((c,i)=>(
            <div key={i} style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#34D399' }}>{c}</div>
          ))}
        </div>
        <div style={{ maxHeight:480, overflowY:'auto' }}>
          {loading ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>Loading...</div>
          : filtered.length===0 ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>No VIVA records found</div>
          : filtered.map((v,i)=>(
            <div key={i} className="vo-row" style={{ display:'grid', gridTemplateColumns:'1fr 160px 100px 90px 90px 80px', padding:'13px 24px', borderBottom:i<filtered.length-1?'1px solid rgba(255,255,255,0.04)':'none', alignItems:'center', background:'transparent', transition:'background 0.15s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:`${ac(v.agentName)}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:ac(v.agentName), flexShrink:0 }}>
                  {v.agentName?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:'#E2E8F0' }}>{v.agentName}</span>
              </div>
              <div style={{ fontSize:12, color:'#C8D8EC', fontWeight:600 }}>{v.vivaName}</div>
              <div style={{ fontSize:12, color:'#8FA3C4' }}>{v.qaOfficer}</div>
              <div style={{ fontSize:13, color:'#60A5FA', fontWeight:700 }}>{v.score}/{v.totalQ}</div>
              <div><span style={{ padding:'4px 10px', borderRadius:20, background:sbg(v.pct||0), fontSize:12, fontWeight:700, color:sc(v.pct||0) }}>{v.pct}%</span></div>
              <div style={{ fontSize:12, color:'#4A5A78' }}>{v.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}