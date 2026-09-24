// ============================================================
// EvaluationsOverview.js
// ============================================================
import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';

const DEMO_EVALS = [
  { id:1, agent_name:'Abdullrahman Ali Mahdi', qa_name:'Miran',    overall_score_percentage:90, coaching_completed:true,  evaluation_date:'2026-03-10', level1:'Billing complaints' },
  { id:2, agent_name:'Govand Wali',            qa_name:'Sizar',    overall_score_percentage:70, coaching_completed:false, evaluation_date:'2026-03-10', level1:'Inquiries'          },
  { id:3, agent_name:'Halland Hemn',           qa_name:'Brwa',     overall_score_percentage:100,coaching_completed:true,  evaluation_date:'2026-03-09', level1:'General complaints' },
  { id:4, agent_name:'Aya Edris',              qa_name:'Sizar',    overall_score_percentage:50, coaching_completed:false, evaluation_date:'2026-03-09', level1:'Service requests'   },
  { id:5, agent_name:'Rayan Jaafar',           qa_name:'Miran',    overall_score_percentage:80, coaching_completed:true,  evaluation_date:'2026-03-08', level1:'Feedback & others'  },
  { id:6, agent_name:'Daryan Bakr Kakamand',   qa_name:'Brwa',     overall_score_percentage:60, coaching_completed:false, evaluation_date:'2026-03-08', level1:'Billing complaints' },
  { id:7, agent_name:'Barham Qasim Ahmed',     qa_name:'Miran',    overall_score_percentage:80, coaching_completed:true,  evaluation_date:'2026-03-07', level1:'Inquiries'          },
  { id:8, agent_name:'Ali Khalid',             qa_name:'Sizar',    overall_score_percentage:40, coaching_completed:false, evaluation_date:'2026-03-07', level1:'General complaints' },
];

export default function EvaluationsOverview() {
  const [evals, setEvals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterQA, setFilterQA] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/evaluations').then(r=>r.json()).then(data => {
      setEvals(Array.isArray(data)&&data.length>0 ? data : DEMO_EVALS);
      setLoading(false);
    }).catch(()=>{ setEvals(DEMO_EVALS); setLoading(false); });
  }, []);

  const inp = { padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFFFFF', fontSize:13, outline:'none', fontFamily:"'Inter','Segoe UI',sans-serif" };
  const sel = { ...inp, appearance:'none', WebkitAppearance:'none', cursor:'pointer', paddingRight:32, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238FA3C4' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundColor:'rgba(255,255,255,0.05)' };

  const filtered = evals.filter(e => {
    if (search && !e.agent_name?.toLowerCase().includes(search.toLowerCase()) && !e.qa_name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterQA !== 'all' && e.qa_name !== filterQA) return false;
    if (filterTier === 'excellent' && (e.overall_score_percentage ?? 0) < 80) return false;
    if (filterTier === 'average' && ((e.overall_score_percentage ?? 0) < 60 || (e.overall_score_percentage ?? 0) >= 80)) return false;
    if (filterTier === 'needs-work' && (e.overall_score_percentage ?? 0) >= 60) return false;
    return true;
  }).sort((a,b) => new Date(b.evaluation_date||0) - new Date(a.evaluation_date||0));

  const avgScore = filtered.length ? Math.round(filtered.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/filtered.length) : 0;

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`.eo-row:hover{background:rgba(255,255,255,0.04)!important} select option{background:#131626!important;color:#FFFFFF!important} select{color-scheme:dark}`}</style>

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#FF6B35', marginBottom:6 }}>SUPERVISOR VIEW</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:'#FFFFFF' }}>Evaluations Overview</h1>
          <div style={{ padding:'7px 16px', borderRadius:20, background:'rgba(255,107,53,0.1)', border:'1px solid rgba(255,107,53,0.2)', fontSize:13, fontWeight:600, color:'#FF6B35' }}>{filtered.length} records</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'Total Evals', value:evals.length, color:'#FF6B35' },
          { label:'Filtered', value:filtered.length, color:'#60A5FA' },
          { label:'Avg Score', value:`${avgScore}%`, color:sc(avgScore) },
          { label:'Pending Coaching', value:filtered.filter(e=>!e.coaching_completed).length, color:'#FBBF24' },
        ].map((k,i)=>(
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 14px 14px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#4A5A78', marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:26, fontWeight:800, color:'#FFFFFF' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:10, marginBottom:18 }}>
        <input placeholder="🔍  Search agent or QA..." value={search} onChange={e=>setSearch(e.target.value)} style={{ ...inp, width:'100%', boxSizing:'border-box' }}/>
        <select value={filterQA} onChange={e=>setFilterQA(e.target.value)} style={{ ...sel, width:'100%', boxSizing:'border-box' }}>
          <option value="all">All QA Officers</option>
          {['Miran','Sizar','Brwa','Mohammed'].map(q=><option key={q} value={q}>{q}</option>)}
        </select>
        <select value={filterTier} onChange={e=>setFilterTier(e.target.value)} style={{ ...sel, width:'100%', boxSizing:'border-box' }}>
          <option value="all">All Scores</option>
          <option value="excellent">Excellent ≥80%</option>
          <option value="average">Average 60–79%</option>
          <option value="needs-work">Needs Work &lt;60%</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 130px 90px 120px 120px 80px', padding:'13px 24px', background:'rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          {['Agent','QA Officer','Score','Category','Coaching','Date'].map((c,i)=>(
            <div key={i} style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#FF6B35' }}>{c}</div>
          ))}
        </div>
        <div style={{ maxHeight:520, overflowY:'auto' }}>
          {loading ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>Loading...</div>
          : filtered.length === 0 ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>No evaluations match filters</div>
          : filtered.map((e,i)=>(
            <div key={i} className="eo-row" style={{ display:'grid', gridTemplateColumns:'1fr 130px 90px 120px 120px 80px', padding:'13px 24px', borderBottom:i<filtered.length-1?'1px solid rgba(255,255,255,0.04)':'none', alignItems:'center', background:'transparent', transition:'background 0.15s', cursor:'pointer' }}
              onClick={()=>setSelected(selected?.id===e.id?null:e)}>
              <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:`${ac(e.agent_name)}22`, border:`1px solid ${ac(e.agent_name)}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:ac(e.agent_name), flexShrink:0 }}>
                  {e.agent_name?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:'#E2E8F0' }}>{e.agent_name||'—'}</span>
              </div>
              <div style={{ fontSize:13, color:'#8FA3C4', fontWeight:600 }}>{e.qa_name||'—'}</div>
              <div><span style={{ padding:'4px 12px', borderRadius:20, background:sbg(e.overall_score_percentage||0), fontSize:12, fontWeight:700, color:sc(e.overall_score_percentage||0) }}>{e.overall_score_percentage??'—'}%</span></div>
              <div style={{ fontSize:12, color:'#8FA3C4' }}>{e.level1||'—'}</div>
              <div><span style={{ padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:e.coaching_completed?'rgba(74,222,128,0.1)':'rgba(251,191,36,0.12)', color:e.coaching_completed?'#4ADE80':'#FBBF24' }}>{e.coaching_completed?'✓ Done':'⏳ Pending'}</span></div>
              <div style={{ fontSize:12, color:'#4A5A78' }}>{e.evaluation_date?new Date(e.evaluation_date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}):'—'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ marginTop:16, background:'rgba(255,255,255,0.03)', border:`1px solid ${ac(selected.agent_name)}30`, borderRadius:18, padding:'24px 28px' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#8FA3C4', marginBottom:12 }}>EVALUATION DETAILS — {selected.agent_name}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {[
              {l:'Agent',         v:selected.agent_name},
              {l:'QA Officer',    v:selected.qa_name},
              {l:'Score',         v:`${selected.overall_score_percentage??'—'}%`},
              {l:'Coaching',      v:selected.coaching_completed?'✓ Done':'⏳ Pending'},
              {l:'Category',      v:selected.level1||'—'},
              {l:'Date',          v:selected.evaluation_date?new Date(selected.evaluation_date).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'}):'—'},
              {l:'Improvement',   v:selected.improvement_area||'—'},
              {l:'Feedback',      v:selected.feedback||'—'},
            ].map((f,i)=>(
              <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'14px' }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#FF6B35', marginBottom:5 }}>{f.l}</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#E2E8F0' }}>{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}