import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';
const slb= p => p>=80?'Excellent':p>=60?'Average':'Needs Work';

const ALL_AGENTS = [
  // Miran
  {name:'Abdullrahman Ali Mahdi',qa:'Miran',queue:'Sorani'},{name:'Aran Eimad Qadir',qa:'Miran',queue:'Sorani'},{name:'Awdang Saman',qa:'Miran',queue:'Sorani'},{name:'Azad Brifkani',qa:'Miran',queue:'Badini'},{name:'Barham Qasim Ahmed',qa:'Miran',queue:'Sorani'},{name:'Didar Pirbal',qa:'Miran',queue:'Sorani'},{name:'Haryad Shakr Abdulla',qa:'Miran',queue:'Sorani'},{name:'Hawrin Amir Ahmed',qa:'Miran',queue:'Sorani'},{name:'Kaiwan Pshtiwan Mustafa',qa:'Miran',queue:'Sorani'},{name:'Muhammad Ali Osman',qa:'Miran',queue:'Sorani'},{name:'Muhammed Abdulbari Majid',qa:'Miran',queue:'Arabic'},{name:'Omer Tasim Omer',qa:'Miran',queue:'Arabic'},{name:'Rayan Jaafar',qa:'Miran',queue:'Sorani'},{name:'Ronar Rasul',qa:'Miran',queue:'Sorani'},{name:'Safar Mikeail Ismail',qa:'Miran',queue:'Sorani'},{name:'Salih Sangar',qa:'Miran',queue:'Sorani'},{name:'Sazgar Hassan',qa:'Miran',queue:'Sorani'},{name:'Suzan Sarmad',qa:'Miran',queue:'Sorani'},
  // Sizar
  {name:'Adbulqadir Salam',qa:'Sizar',queue:'Arabic'},{name:'Ahmed Khafut Xdr',qa:'Sizar',queue:'Sorani'},{name:'Ali Khalid',qa:'Sizar',queue:'Arabic'},{name:'Ammar Mamnd Salih',qa:'Sizar',queue:'Sorani'},{name:'Aya Edris',qa:'Sizar',queue:'Arabic'},{name:'Bahaa Shamsadeen Sulaiman',qa:'Sizar',queue:'Arabic'},{name:'Darbin Omer Abubakr',qa:'Sizar',queue:'Arabic'},{name:'Esra Sabah Salim',qa:'Sizar',queue:'Sorani'},{name:'Govand Wali',qa:'Sizar',queue:'Sorani'},{name:'Israa Peshkawt',qa:'Sizar',queue:'Sorani'},{name:'Muhammed Fairq Hadu',qa:'Sizar',queue:'Sorani'},{name:'Muhammed Jalal Majid',qa:'Sizar',queue:'Sorani'},{name:'Mustafa Khudhur Ali',qa:'Sizar',queue:'Arabic'},{name:'Rasul Najmadeen',qa:'Sizar',queue:'Sorani'},{name:'Ruya Yaqub',qa:'Sizar',queue:'Arabic'},{name:'Rzgar Ali Ismail',qa:'Sizar',queue:'Sorani'},{name:'Safeen Jahfar',qa:'Sizar',queue:'Sorani'},{name:'Yasser Ameen',qa:'Sizar',queue:'Sorani'},{name:'Yousif Hussen Bahram',qa:'Sizar',queue:'Sorani'},
  // Brwa
  {name:'Ahmed Jasim Rashid',qa:'Brwa',queue:'Sorani'},{name:'Ahmed Saman',qa:'Brwa',queue:'Sorani'},{name:'Bawar Fazl Muhammad',qa:'Brwa',queue:'Badini'},{name:'Daryan Bakr Kakamand',qa:'Brwa',queue:'Arabic'},{name:'Dlovan Maraan Ibrahim',qa:'Brwa',queue:'Sorani'},{name:'Gailan Xalid',qa:'Brwa',queue:'Badini'},{name:'Halland Hemn',qa:'Brwa',queue:'Badini'},{name:'Haryad Muhsin',qa:'Brwa',queue:'Sorani'},{name:'Karwan Wali',qa:'Brwa',queue:'Sorani'},{name:'Lawin Kosrat Saadi',qa:'Brwa',queue:'Sorani'},{name:'Malik Rashid',qa:'Brwa',queue:'Badini'},{name:'Mohammed Soran Hassan',qa:'Brwa',queue:'Sorani'},{name:'Neamat Anwar Kareem',qa:'Brwa',queue:'Sorani'},{name:'Salm Khairulla Saeed',qa:'Brwa',queue:'Arabic'},{name:'Shaida Faizan Kawiz',qa:'Brwa',queue:'Badini'},{name:'Sozhin Karim',qa:'Brwa',queue:'Sorani'},{name:'Zhiya Najmadin',qa:'Brwa',queue:'Badini'},
];

export default function TeamPerformance() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterQA, setFilterQA] = useState('all');
  const [filterQueue, setFilterQueue] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [sortBy, setSortBy] = useState('score_desc');

  useEffect(() => {
    fetch('http://localhost:8080/api/evaluations').then(r=>r.json()).then(evals => {
      if (!Array.isArray(evals) || evals.length === 0) { buildDemo(); return; }
      const agentMap = {};
      evals.forEach(e => {
        if (!e.agent_name) return;
        if (!agentMap[e.agent_name]) agentMap[e.agent_name] = { evals:[], qa: e.qa_name };
        agentMap[e.agent_name].evals.push(e);
      });
      const built = ALL_AGENTS.map(a => {
        const d = agentMap[a.name];
        if (!d || d.evals.length === 0) return { ...a, totalEvals:0, avgScore:null, lastEval:'—', pending:0 };
        const avg = Math.round(d.evals.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/d.evals.length);
        const pending = d.evals.filter(e=>!e.coaching_completed).length;
        const last = d.evals.reduce((a,b)=>new Date(a.evaluation_date)>new Date(b.evaluation_date)?a:b);
        return { ...a, totalEvals:d.evals.length, avgScore:avg, lastEval: last.evaluation_date ? new Date(last.evaluation_date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : '—', pending };
      });
      setAgents(built);
      setLoading(false);
    }).catch(() => { buildDemo(); });
  }, []);

  const buildDemo = () => {
    const scores = [90,80,70,60,100,80,70,50,90,80,70,60,100,80,70,50,90,80,70,60,100,80,70,50,90,80,70,60,100,80,70,50,90,80,70,60,100,80,70,50,90,80,70,60,100,80,70,50,90,80,70,60,100,80];
    setAgents(ALL_AGENTS.map((a,i) => ({ ...a, totalEvals:i%5===0?0:Math.floor(Math.random()*5)+1, avgScore:i%5===0?null:scores[i%scores.length], lastEval:i%5===0?'—':'09 Mar', pending:i%3===0?1:0 })));
    setLoading(false);
  };

  const inp = { padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFFFFF', fontSize:13, outline:'none', fontFamily:"'Inter','Segoe UI',sans-serif" };
  const sel = { ...inp, appearance:'none', WebkitAppearance:'none', cursor:'pointer', paddingRight:32, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238FA3C4' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundColor:'rgba(255,255,255,0.05)' };

  const filtered = agents
    .filter(a => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterQA !== 'all' && a.qa !== filterQA) return false;
      if (filterQueue !== 'all' && a.queue !== filterQueue) return false;
      if (filterTier !== 'all') {
        if (filterTier === 'excellent' && (a.avgScore === null || a.avgScore < 80)) return false;
        if (filterTier === 'average' && (a.avgScore === null || a.avgScore < 60 || a.avgScore >= 80)) return false;
        if (filterTier === 'needs-work' && (a.avgScore === null || a.avgScore >= 60)) return false;
        if (filterTier === 'not-evaluated' && a.avgScore !== null) return false;
      }
      return true;
    })
    .sort((a,b) => {
      if (sortBy === 'score_desc') return (b.avgScore??-1)-(a.avgScore??-1);
      if (sortBy === 'score_asc') return (a.avgScore??101)-(b.avgScore??101);
      if (sortBy === 'evals_desc') return b.totalEvals-a.totalEvals;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const evalCount = agents.filter(a=>a.avgScore!==null).length;
  const avgAll = evalCount > 0 ? Math.round(agents.filter(a=>a.avgScore!==null).reduce((s,a)=>s+(a.avgScore||0),0)/evalCount) : 0;
  const excellent = agents.filter(a=>a.avgScore!==null&&a.avgScore>=80).length;
  const needsWork = agents.filter(a=>a.avgScore!==null&&a.avgScore<60).length;

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`.tp-row:hover{background:rgba(255,255,255,0.04)!important} select option{background:#131626!important;color:#FFFFFF!important} select{color-scheme:dark}`}</style>

      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#60A5FA', marginBottom:6 }}>SUPERVISOR VIEW</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:'#FFFFFF' }}>Team Performance</h1>
          <div style={{ padding:'7px 16px', borderRadius:20, background:'rgba(96,165,250,0.1)', border:'1px solid rgba(96,165,250,0.2)', fontSize:13, fontWeight:600, color:'#60A5FA' }}>
            {filtered.length} / {agents.length} agents
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Agents', value:agents.length, color:'#60A5FA' },
          { label:'Evaluated', value:`${evalCount} / ${agents.length}`, color:'#FF6B35' },
          { label:'Overall Avg', value:`${avgAll}%`, color:sc(avgAll) },
          { label:'Needs Attention', value:needsWork, color:'#F87171' },
        ].map((k,i) => (
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'18px 20px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 16px 16px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#4A5A78', marginBottom:6 }}>{k.label}</div>
            <div style={{ fontSize:28, fontWeight:800, color:'#FFFFFF' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:20 }}>
        <input placeholder="🔍  Search agent..." value={search} onChange={e=>setSearch(e.target.value)} style={{ ...inp, width:'100%', boxSizing:'border-box' }}/>
        <select value={filterQA} onChange={e=>setFilterQA(e.target.value)} style={{ ...sel, width:'100%', boxSizing:'border-box' }}>
          <option value="all">All QA Officers</option>
          {['Miran','Sizar','Brwa','Mohammed'].map(q=><option key={q} value={q}>{q}</option>)}
        </select>
        <select value={filterQueue} onChange={e=>setFilterQueue(e.target.value)} style={{ ...sel, width:'100%', boxSizing:'border-box' }}>
          <option value="all">All Queues</option>
          {['Sorani','Arabic','Badini'].map(q=><option key={q} value={q}>{q}</option>)}
        </select>
        <select value={filterTier} onChange={e=>setFilterTier(e.target.value)} style={{ ...sel, width:'100%', boxSizing:'border-box' }}>
          <option value="all">All Tiers</option>
          <option value="excellent">Excellent ≥80%</option>
          <option value="average">Average 60–79%</option>
          <option value="needs-work">Needs Work &lt;60%</option>
          <option value="not-evaluated">Not Evaluated</option>
        </select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ ...sel, width:'100%', boxSizing:'border-box' }}>
          <option value="score_desc">Score ↓</option>
          <option value="score_asc">Score ↑</option>
          <option value="evals_desc">Most Evals</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px 120px 100px 110px', padding:'14px 24px', background:'rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          {['Agent','Queue','QA Officer','Evaluations','Avg Score','Coaching'].map((c,i) => (
            <div key={i} style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#FF6B35' }}>{c}</div>
          ))}
        </div>
        <div style={{ maxHeight:560, overflowY:'auto' }}>
          {loading ? (
            <div style={{ padding:'60px', textAlign:'center', color:'#4A5A78' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding:'60px', textAlign:'center', color:'#4A5A78' }}>No agents match filters</div>
          ) : filtered.map((a,i) => (
            <div key={i} className="tp-row" style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px 120px 100px 110px', padding:'14px 24px', borderBottom:i<filtered.length-1?'1px solid rgba(255,255,255,0.04)':'none', alignItems:'center', background:'transparent', transition:'background 0.15s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:`${ac(a.name)}22`, border:`1px solid ${ac(a.name)}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:ac(a.name), flexShrink:0 }}>
                  {a.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:'#E2E8F0' }}>{a.name}</span>
              </div>
              <div>
                <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:a.queue==='Sorani'?'rgba(251,191,36,0.12)':a.queue==='Arabic'?'rgba(96,165,250,0.12)':'rgba(52,211,153,0.12)', color:a.queue==='Sorani'?'#FBBF24':a.queue==='Arabic'?'#60A5FA':'#34D399' }}>{a.queue}</span>
              </div>
              <div style={{ fontSize:13, color:'#8FA3C4', fontWeight:600 }}>{a.qa}</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#60A5FA' }}>{a.totalEvals}</div>
              <div>
                {a.avgScore !== null
                  ? <span style={{ padding:'4px 12px', borderRadius:20, background:sbg(a.avgScore), fontSize:12, fontWeight:700, color:sc(a.avgScore) }}>{a.avgScore}%</span>
                  : <span style={{ fontSize:12, color:'#4A5A78' }}>Not yet</span>
                }
              </div>
              <div>
                {a.pending > 0
                  ? <span style={{ padding:'4px 10px', borderRadius:20, background:'rgba(251,191,36,0.12)', fontSize:12, fontWeight:700, color:'#FBBF24' }}>{a.pending} pending</span>
                  : <span style={{ padding:'4px 10px', borderRadius:20, background:'rgba(74,222,128,0.1)', fontSize:12, fontWeight:700, color:a.totalEvals>0?'#4ADE80':'#4A5A78' }}>{a.totalEvals>0?'✓ Clear':'—'}</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}