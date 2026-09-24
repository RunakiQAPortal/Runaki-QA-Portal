// ================================================================
// MyEvaluations.js
// ================================================================
import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';

const DEMO = [
  { overall_score_percentage:90, evaluation_date:'2026-03-10', coaching_completed:true,  level1:'Billing complaints', improvement_area:'None',         feedback:'Great call handling',       phone:'07501234567', ticket_id:'TK-001' },
  { overall_score_percentage:70, evaluation_date:'2026-03-07', coaching_completed:false, level1:'Inquiries',          improvement_area:'FAQ alignment', feedback:'Review FAQ guidelines',      phone:'07501234568', ticket_id:'TK-002' },
  { overall_score_percentage:80, evaluation_date:'2026-03-03', coaching_completed:true,  level1:'General complaints', improvement_area:'Tone of voice', feedback:'Good improvement noted',     phone:'07501234569', ticket_id:'TK-003' },
  { overall_score_percentage:60, evaluation_date:'2026-02-28', coaching_completed:true,  level1:'Service requests',   improvement_area:'CRM tagging',  feedback:'Tag correctly next time',    phone:'07501234570', ticket_id:'TK-004' },
  { overall_score_percentage:100,evaluation_date:'2026-02-22', coaching_completed:true,  level1:'Inquiries',          improvement_area:'None',         feedback:'Perfect score — well done!', phone:'07501234571', ticket_id:'TK-005' },
];

export default function MyEvaluations({ user }) {
  const [evals, setEvals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterScore, setFilterScore] = useState('all');
  const [filterCoach, setFilterCoach] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(()=>{
    fetch('http://localhost:8080/api/evaluations').then(r=>r.json()).then(data=>{
      const mine = Array.isArray(data) ? data.filter(e=>e.agent_name===user?.name) : [];
      setEvals(mine.length>0 ? mine : DEMO);
      setLoading(false);
    }).catch(()=>{ setEvals(DEMO); setLoading(false); });
  },[user]);

  const sel = { padding:'9px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFFFFF', fontSize:13, outline:'none', fontFamily:"'Inter','Segoe UI',sans-serif", appearance:'none', WebkitAppearance:'none', cursor:'pointer', paddingRight:32, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238FA3C4' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundColor:'rgba(255,255,255,0.05)' };

  const filtered = [...evals]
    .filter(e=>{
      if (filterScore==='excellent' && (e.overall_score_percentage||0)<80) return false;
      if (filterScore==='average'   && ((e.overall_score_percentage||0)<60||(e.overall_score_percentage||0)>=80)) return false;
      if (filterScore==='needs-work'&& (e.overall_score_percentage||0)>=60) return false;
      if (filterCoach==='pending' && e.coaching_completed) return false;
      if (filterCoach==='done'    && !e.coaching_completed) return false;
      return true;
    })
    .sort((a,b)=>new Date(b.evaluation_date)-new Date(a.evaluation_date));

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`.me-row:hover{background:rgba(255,255,255,0.03)!important} select option{background:#131626!important;color:#FFFFFF!important} select{color-scheme:dark}`}</style>

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#FF6B35', marginBottom:6 }}>MY ACCOUNT</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:'#FFFFFF' }}>My Evaluations</h1>
          <div style={{ padding:'7px 16px', borderRadius:20, background:'rgba(255,107,53,0.1)', border:'1px solid rgba(255,107,53,0.2)', fontSize:13, fontWeight:600, color:'#FF6B35' }}>{filtered.length} records</div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'Total', value:evals.length, color:'#FF6B35' },
          { label:'Avg Score', value:evals.length?`${Math.round(evals.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/evals.length)}%`:'—', color:sc(evals.length?Math.round(evals.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/evals.length):0) },
          { label:'Pending Coaching', value:evals.filter(e=>!e.coaching_completed).length, color:'#FBBF24' },
          { label:'Coached', value:evals.filter(e=>e.coaching_completed).length, color:'#4ADE80' },
        ].map((k,i)=>(
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 14px 14px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#4A5A78', marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:26, fontWeight:800, color:'#FFFFFF' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:18 }}>
        <select value={filterScore} onChange={e=>setFilterScore(e.target.value)} style={{ ...sel }}>
          <option value="all">All Scores</option>
          <option value="excellent">Excellent ≥80%</option>
          <option value="average">Average 60–79%</option>
          <option value="needs-work">Needs Work &lt;60%</option>
        </select>
        <select value={filterCoach} onChange={e=>setFilterCoach(e.target.value)} style={{ ...sel }}>
          <option value="all">All Coaching</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* List */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {loading ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>Loading...</div>
        : filtered.length===0 ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>No evaluations match filters</div>
        : filtered.map((e,i)=>{
          const isOpen = expanded===i;
          return (
            <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
              <div className="me-row" style={{ display:'grid', gridTemplateColumns:'90px 1fr 140px 100px 32px', padding:'16px 20px', alignItems:'center', gap:12, cursor:'pointer', background:'transparent', transition:'background 0.15s' }} onClick={()=>setExpanded(isOpen?null:i)}>
                <span style={{ padding:'6px 14px', borderRadius:20, background:sbg(e.overall_score_percentage||0), fontSize:14, fontWeight:800, color:sc(e.overall_score_percentage||0), textAlign:'center' }}>{e.overall_score_percentage??'—'}%</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#E2E8F0' }}>{e.level1||'—'}</div>
                  {e.improvement_area&&e.improvement_area!=='None'&&<div style={{ fontSize:11, color:'#4A5A78', marginTop:2 }}>Improve: {e.improvement_area}</div>}
                </div>
                <span style={{ padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700, background:e.coaching_completed?'rgba(74,222,128,0.1)':'rgba(251,191,36,0.12)', color:e.coaching_completed?'#4ADE80':'#FBBF24', textAlign:'center' }}>
                  {e.coaching_completed?'✓ Coached':'⏳ Pending'}
                </span>
                <div style={{ fontSize:12, color:'#4A5A78', textAlign:'right' }}>{e.evaluation_date?new Date(e.evaluation_date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}):'—'}</div>
                <div style={{ color:'#4A5A78', fontSize:11, transition:'transform 0.2s', transform:isOpen?'rotate(180deg)':'none', textAlign:'center' }}>▼</div>
              </div>
              {isOpen && (
                <div style={{ padding:'0 20px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:14 }}>
                    {[
                      { l:'Phone',          v:e.phone||'—' },
                      { l:'Ticket ID',      v:e.ticket_id||'—' },
                      { l:'Feedback',       v:e.feedback||'—' },
                      { l:'Improvement',    v:e.improvement_area||'—' },
                      { l:'Positive Notes', v:e.positive_comments||'—' },
                      { l:'Bad Notes',      v:e.bad_comments||'—' },
                    ].map((f,j)=>(
                      <div key={j} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'12px' }}>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#FF6B35', marginBottom:4 }}>{f.l}</div>
                        <div style={{ fontSize:13, color:'#C8D8EC' }}>{f.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}