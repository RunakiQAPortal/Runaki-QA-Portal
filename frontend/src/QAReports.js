import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api';
const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const sc  = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg = p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';
const sbd = p => p>=80?'rgba(74,222,128,0.3)':p>=60?'rgba(251,191,36,0.3)':'rgba(248,113,113,0.3)';
const slb = p => p>=80?'Excellent':p>=60?'Average':'Needs Work';
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const av = n => { if(!n)return'?'; const w=n.trim().split(' '); return(w[0][0]+(w[1]?w[1][0]:'')).toUpperCase(); };
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];

const DEMO_EVALS = [
  { agentName:'Demo Agent A', date:'10 Mar 2026', score:91, coachStatus:'Coached',          holdUnhold:'Correct',   level1:'Inquiries'          },
  { agentName:'Demo Agent B', date:'09 Mar 2026', score:74, coachStatus:'Pending Coaching', holdUnhold:'Correct',   level1:'Billing complaints' },
  { agentName:'Demo Agent C', date:'08 Mar 2026', score:55, coachStatus:'Pending Coaching', holdUnhold:'Incorrect', level1:'General complaints' },
  { agentName:'Demo Agent A', date:'07 Mar 2026', score:80, coachStatus:'Coached',          holdUnhold:'Correct',   level1:'Service requests'   },
  { agentName:'Demo Agent B', date:'06 Mar 2026', score:66, coachStatus:'Coached',          holdUnhold:'Correct',   level1:'Feedback & others'  },
  { agentName:'Demo Agent C', date:'05 Mar 2026', score:40, coachStatus:'Pending Coaching', holdUnhold:'Incorrect', level1:'General complaints' },
];

export default function QAReports({ user }) {
  const qaName = user?.name || '';
  const [evals, setEvals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('all');

  useEffect(() => {
    axios.get(`${API}/evaluations`)
      .then(r => setEvals((Array.isArray(r.data)?r.data:[]).filter(e=>(e.qaOfficer||e.qa_name||'').toLowerCase()===qaName.toLowerCase())))
      .catch(()=>setEvals([]))
      .finally(()=>setLoading(false));
  }, [qaName]);

  const data = (evals.length===0&&!loading) ? DEMO_EVALS : evals;

  // time filter
  const now = new Date();
  const filtered = data.filter(e => {
    if (range==='all') return true;
    const d = new Date(e.date||e.evalDate||0);
    if (range==='week') { const w=new Date(now); w.setDate(w.getDate()-7); return d>=w; }
    if (range==='month') { const m=new Date(now); m.setMonth(m.getMonth()-1); return d>=m; }
    return true;
  });

  const scores = filtered.map(e=>Number(e.score||e.overallScore||0)).filter(s=>s>0);
  const avgScore = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
  const excellent = filtered.filter(e=>Number(e.score||0)>=80).length;
  const average   = filtered.filter(e=>{ const s=Number(e.score||0); return s>=60&&s<80; }).length;
  const poor      = filtered.filter(e=>Number(e.score||0)<60&&Number(e.score||0)>0).length;
  const pending   = filtered.filter(e=>(e.coachStatus||'').toLowerCase().includes('pending')).length;
  const holdOk    = filtered.filter(e=>(e.holdUnhold||'').includes('Correct')).length;

  // per-agent summary
  const agentMap = {};
  filtered.forEach(e => {
    const n = e.agentName||e.agent_name||'Unknown';
    if (!agentMap[n]) agentMap[n] = { scores:[], pending:0, evals:0 };
    const s = Number(e.score||0);
    if (s>0) agentMap[n].scores.push(s);
    agentMap[n].evals++;
    if ((e.coachStatus||'').toLowerCase().includes('pending')) agentMap[n].pending++;
  });
  const agentSummary = Object.entries(agentMap).map(([name,d])=>({
    name,
    avg: d.scores.length ? Math.round(d.scores.reduce((a,b)=>a+b,0)/d.scores.length) : 0,
    evals: d.evals,
    pending: d.pending,
  })).sort((a,b)=>b.avg-a.avg);

  // category breakdown
  const catMap = {};
  filtered.forEach(e => {
    const cat = e.level1||'Unknown';
    catMap[cat] = (catMap[cat]||0)+1;
  });
  const catList = Object.entries(catMap).sort((a,b)=>b[1]-a[1]);
  const catMax = catList[0]?.[1]||1;

  const selSt = { padding:'8px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFFFFF', fontSize:13, outline:'none', fontFamily:"'Inter','Segoe UI',sans-serif", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238FA3C4' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundSize:'12px', paddingRight:32, cursor:'pointer', appearance:'none', WebkitAppearance:'none', backgroundColor:'rgba(255,255,255,0.05)' };

  return (
    <div style={{ ...F, background:'#0D0F1E', minHeight:'100vh', padding:'28px 32px 60px', color:'#FFFFFF' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); select option{background:#131626;color:#fff;}`}</style>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:'#34D399', letterSpacing:'2.5px', textTransform:'uppercase', marginBottom:6 }}>QA OFFICER · {qaName}</div>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900 }}>
            My <span style={{ background:'linear-gradient(90deg,#34D399,#60A5FA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Reports</span>
          </h1>
          <p style={{ margin:'6px 0 0', fontSize:13, color:'#4A5A78' }}>{filtered.length} evaluations in view</p>
          {evals.length===0&&!loading && <div style={{ marginTop:8, display:'inline-flex', padding:'4px 12px', borderRadius:20, background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.25)', fontSize:11, fontWeight:700, color:'#34D399' }}>⚡ Demo data</div>}
        </div>
        <select value={range} onChange={e=>setRange(e.target.value)} style={selSt}>
          <option value="all">All Time</option>
          <option value="month">Last 30 Days</option>
          <option value="week">Last 7 Days</option>
        </select>
      </div>

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Evaluations', val:filtered.length, color:'#FF6B35' },
          { label:'Avg Score', val:avgScore?`${avgScore}%`:'—', color:avgScore?sc(avgScore):'#4A5A78' },
          { label:'Excellent', val:excellent, color:'#4ADE80' },
          { label:'Pending Coach', val:pending, color:'#FBBF24' },
          { label:'Hold OK Rate', val:filtered.length?`${Math.round((holdOk/filtered.length)*100)}%`:'—', color:'#60A5FA' },
        ].map(k=>(
          <div key={k.label} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'16px 18px', position:'relative', overflow:'hidden' }}><div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 14px 14px' }}/><div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/><div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:24, fontWeight:900, color:k.color }}>{k.val}</div>
            <div style={{ fontSize:11, fontWeight:600, color:'#4A5A78', marginTop:4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        {/* agent summary */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:4, height:18, background:'linear-gradient(180deg,#FF6B35,#FF6B3555)', borderRadius:4, boxShadow:'0 0 8px #FF6B3566' }}/>
            <span style={{ fontSize:12, fontWeight:800, color:'#FFFFFF', textTransform:'uppercase', letterSpacing:'0.5px' }}>Agent Summary</span>
          </div>
          <div style={{ padding:'12px 20px' }}>
            {agentSummary.map((a,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:i<agentSummary.length-1?'1px solid rgba(255,255,255,0.04)':'' }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:ac(a.name), display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>{av(a.name)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#FFFFFF', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.name}</div>
                  <div style={{ fontSize:10, color:'#4A5A78' }}>{a.evals} eval{a.evals!==1?'s':''} {a.pending>0 && <span style={{ color:'#FBBF24' }}>· {a.pending} pending</span>}</div>
                </div>
                <div style={{ padding:'3px 10px', borderRadius:8, background:sbg(a.avg), border:`1px solid ${sbd(a.avg)}`, fontSize:12, fontWeight:800, color:sc(a.avg) }}>{a.avg}%</div>
              </div>
            ))}
            {agentSummary.length===0&&<div style={{ padding:'20px 0', textAlign:'center', fontSize:13, color:'#4A5A78' }}>No data</div>}
          </div>
        </div>

        {/* category breakdown */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:4, height:18, background:'linear-gradient(180deg,#A78BFA,#A78BFA55)', borderRadius:4, boxShadow:'0 0 8px #A78BFA66' }}/>
            <span style={{ fontSize:12, fontWeight:800, color:'#FFFFFF', textTransform:'uppercase', letterSpacing:'0.5px' }}>Call Categories</span>
          </div>
          <div style={{ padding:'16px 20px' }}>
            {catList.map(([cat,count],i)=>(
              <div key={cat} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:12, fontWeight:600, color:'#C8D8EC' }}>{cat}</span>
                  <span style={{ fontSize:12, fontWeight:800, color:ACLR[i%ACLR.length] }}>{count}</span>
                </div>
                <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:6, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.round((count/catMax)*100)}%`, background:ACLR[i%ACLR.length], borderRadius:6, transition:'width 0.6s ease', boxShadow:`0 0 8px ${ACLR[i%ACLR.length]}44` }}/>
                </div>
              </div>
            ))}
            {catList.length===0&&<div style={{ textAlign:'center', fontSize:13, color:'#4A5A78', padding:'20px 0' }}>No data</div>}
          </div>
        </div>
      </div>

      {/* score distribution detailed */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:4, height:18, background:'linear-gradient(180deg,#FBBF24,#FBBF2455)', borderRadius:4, boxShadow:'0 0 8px #FBBF2466' }}/>
          <span style={{ fontSize:12, fontWeight:800, color:'#FFFFFF', textTransform:'uppercase', letterSpacing:'0.5px' }}>Score Distribution</span>
        </div>
        <div style={{ padding:'20px', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[
            { label:'Excellent', sublabel:'≥ 80%', val:excellent, total:filtered.length, color:'#4ADE80' },
            { label:'Average',   sublabel:'60 – 79%', val:average,   total:filtered.length, color:'#FBBF24' },
            { label:'Needs Work',sublabel:'< 60%',  val:poor,     total:filtered.length, color:'#F87171' },
          ].map(d=>{
            const pct = d.total ? Math.round((d.val/d.total)*100) : 0;
            return (
              <div key={d.label} style={{ padding:'16px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:'#FFFFFF' }}>{d.label}</div>
                    <div style={{ fontSize:11, color:'#4A5A78' }}>{d.sublabel}</div>
                  </div>
                  <div style={{ fontSize:28, fontWeight:900, color:d.color }}>{d.val}</div>
                </div>
                <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:6, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:d.color, borderRadius:6, boxShadow:`0 0 8px ${d.color}44` }}/>
                </div>
                <div style={{ fontSize:11, color:d.color, fontWeight:700, marginTop:6 }}>{pct}% of evaluations</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}