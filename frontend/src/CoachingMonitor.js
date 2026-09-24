import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';

const DEMO = [
  { id:1, agent_name:'Govand Wali',          qa_name:'Sizar',    overall_score_percentage:70, evaluation_date:'2026-03-10', improvement_area:'FAQ alignment', level1:'Inquiries'          },
  { id:2, agent_name:'Aya Edris',            qa_name:'Sizar',    overall_score_percentage:50, evaluation_date:'2026-03-09', improvement_area:'Communication',  level1:'Billing complaints' },
  { id:3, agent_name:'Daryan Bakr Kakamand', qa_name:'Brwa',     overall_score_percentage:60, evaluation_date:'2026-03-08', improvement_area:'Tone of voice',  level1:'Service requests'  },
  { id:4, agent_name:'Ali Khalid',           qa_name:'Sizar',    overall_score_percentage:40, evaluation_date:'2026-03-07', improvement_area:'Greeting script', level1:'General complaints'},
  { id:5, agent_name:'Barham Qasim Ahmed',   qa_name:'Miran',    overall_score_percentage:60, evaluation_date:'2026-03-07', improvement_area:'Active listening','level1':'Inquiries'        },
  { id:6, agent_name:'Rzgar Ali Ismail',     qa_name:'Sizar',    overall_score_percentage:70, evaluation_date:'2026-03-06', improvement_area:'CRM tagging',     level1:'Billing complaints'},
  { id:7, agent_name:'Neamat Anwar Kareem',  qa_name:'Brwa',     overall_score_percentage:50, evaluation_date:'2026-03-06', improvement_area:'Ending script',   level1:'Service requests'  },
  { id:8, agent_name:'Haryad Muhsin',        qa_name:'Brwa',     overall_score_percentage:70, evaluation_date:'2026-03-05', improvement_area:'Hold procedure',  level1:'Inquiries'         },
];

export default function CoachingMonitor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQA, setFilterQA] = useState('all');
  const [filterScore, setFilterScore] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/evaluations').then(r=>r.json()).then(data => {
      const pending = Array.isArray(data) ? data.filter(e=>!e.coaching_completed) : [];
      setItems(pending.length > 0 ? pending : DEMO);
      setLoading(false);
    }).catch(()=>{ setItems(DEMO); setLoading(false); });
  }, []);

  const inp = { padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFFFFF', fontSize:13, outline:'none', fontFamily:"'Inter','Segoe UI',sans-serif" };
  const sel = { ...inp, appearance:'none', WebkitAppearance:'none', cursor:'pointer', paddingRight:32, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238FA3C4' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundColor:'rgba(255,255,255,0.05)' };

  const filtered = items.filter(e => {
    if (search && !e.agent_name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterQA !== 'all' && e.qa_name !== filterQA) return false;
    if (filterScore === 'critical' && (e.overall_score_percentage ?? 100) >= 60) return false;
    if (filterScore === 'average' && ((e.overall_score_percentage ?? 0) < 60 || (e.overall_score_percentage ?? 0) >= 80)) return false;
    return true;
  });

  // Group by QA for the summary
  const byQA = ['Miran','Sizar','Brwa','Mohammed'].map(qa => ({
    name: qa, count: items.filter(e=>e.qa_name===qa).length
  }));

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`.cm-row:hover{background:rgba(255,255,255,0.04)!important} select option{background:#131626!important;color:#FFFFFF!important} select{color-scheme:dark}`}</style>

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#FBBF24', marginBottom:6 }}>SUPERVISOR VIEW</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:'#FFFFFF' }}>Coaching Monitor</h1>
          <div style={{ padding:'7px 16px', borderRadius:20, background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)', fontSize:13, fontWeight:600, color:'#FBBF24' }}>
            {items.length} pending
          </div>
        </div>
      </div>

      {/* QA breakdown */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {byQA.map((qa,i) => (
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${ac(qa.name)}25`, borderRadius:16, padding:'18px 20px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${ac(qa.name)},${ac(qa.name)}44)`, borderRadius:'0 0 16px 16px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:ac(qa.name), opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:ac(qa.name), boxShadow:`0 0 8px ${ac(qa.name)},0 0 14px ${ac(qa.name)}88` }}/>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:`${ac(qa.name)}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:ac(qa.name) }}>{qa.name[0]}</div>
              <span style={{ fontSize:14, fontWeight:700, color:'#FFFFFF' }}>{qa.name}</span>
            </div>
            <div style={{ fontSize:28, fontWeight:800, color: qa.count===0?'#4ADE80':'#FBBF24' }}>{qa.count}</div>
            <div style={{ fontSize:11, color:'#4A5A78', marginTop:2 }}>{qa.count===0?'all clear':'pending'}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:10, marginBottom:18 }}>
        <input placeholder="🔍  Search agent..." value={search} onChange={e=>setSearch(e.target.value)} style={{ ...inp, width:'100%', boxSizing:'border-box' }}/>
        <select value={filterQA} onChange={e=>setFilterQA(e.target.value)} style={{ ...sel, width:'100%', boxSizing:'border-box' }}>
          <option value="all">All QA Officers</option>
          {['Miran','Sizar','Brwa','Mohammed'].map(q=><option key={q} value={q}>{q}</option>)}
        </select>
        <select value={filterScore} onChange={e=>setFilterScore(e.target.value)} style={{ ...sel, width:'100%', boxSizing:'border-box' }}>
          <option value="all">All Scores</option>
          <option value="critical">Critical &lt;60%</option>
          <option value="average">Average 60–79%</option>
        </select>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div style={{ padding:'60px', textAlign:'center', color:'#4A5A78' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding:'60px', textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:12, opacity:0.4 }}>🎉</div>
          <div style={{ fontSize:16, fontWeight:700, color:'#4ADE80' }}>All coaching completed!</div>
          <div style={{ fontSize:13, color:'#4A5A78', marginTop:6 }}>No pending items match your filters</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {filtered.map((e,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'20px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#FBBF24,#F59E0B)', borderRadius:'0 0 16px 16px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:'#FBBF24', opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:'#FBBF24', boxShadow:'0 0 8px #FBBF24,0 0 14px #FBBF2488' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:`${ac(e.agent_name)}22`, border:`1px solid ${ac(e.agent_name)}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:ac(e.agent_name), flexShrink:0 }}>
                    {e.agent_name?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#FFFFFF', lineHeight:1.2 }}>{e.agent_name}</div>
                    <div style={{ fontSize:11, color:'#4A5A78', marginTop:2 }}>by {e.qa_name}</div>
                  </div>
                </div>
                <span style={{ padding:'4px 10px', borderRadius:20, background:sbg(e.overall_score_percentage||0), fontSize:12, fontWeight:700, color:sc(e.overall_score_percentage||0), flexShrink:0 }}>
                  {e.overall_score_percentage??'—'}%
                </span>
              </div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#4A5A78', marginBottom:4 }}>Improvement Area</div>
              <div style={{ fontSize:13, color:'#C8D8EC', marginBottom:10 }}>{e.improvement_area||'—'}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:11, color:'#4A5A78' }}>{e.level1||'—'}</span>
                <span style={{ fontSize:11, color:'#4A5A78' }}>
                  {e.evaluation_date?new Date(e.evaluation_date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}):'—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}