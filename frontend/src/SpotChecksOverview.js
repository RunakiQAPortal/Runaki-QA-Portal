import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';

const inp = { padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFFFFF', fontSize:13, outline:'none', fontFamily:"'Inter','Segoe UI',sans-serif" };
const sel = { ...inp, appearance:'none', WebkitAppearance:'none', cursor:'pointer', paddingRight:32, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238FA3C4' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundColor:'rgba(255,255,255,0.05)' };

const SPOT_TYPES = ['Communication','INDRA Calculator','Hold-Unhold','New Levels','HungUp Audit'];
const DEMO_SPOTS = [
  { id:1, agentName:'Abdullrahman Ali',  qaOfficer:'Miran', type:'Communication',     date:'10 Mar 2026', result:'Correct',   notes:'Clear and professional communication' },
  { id:2, agentName:'Govand Wali',       qaOfficer:'Sizar', type:'HungUp Audit',      date:'10 Mar 2026', result:'Incorrect', notes:'Call disconnected before resolution' },
  { id:3, agentName:'Halland Hemn',      qaOfficer:'Brwa',  type:'Hold-Unhold',       date:'09 Mar 2026', result:'Correct',   notes:'Proper hold process followed' },
  { id:4, agentName:'Aya Edris',         qaOfficer:'Sizar', type:'New Levels',        date:'09 Mar 2026', result:'Incorrect', notes:'Wrong level selected' },
  { id:5, agentName:'Rayan Jaafar',      qaOfficer:'Miran', type:'INDRA Calculator',  date:'08 Mar 2026', result:'Correct',   notes:'Calculation correct' },
  { id:6, agentName:'Daryan Bakr',       qaOfficer:'Brwa',  type:'Communication',     date:'08 Mar 2026', result:'Incorrect', notes:'Needs improvement on tone' },
];

export default function SpotChecksOverview() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterResult, setFilterResult] = useState('all');
  const [filterQA, setFilterQA] = useState('all');

  useEffect(() => {
    fetch('http://localhost:8080/api/spot-checks').then(r=>r.json()).then(data=>{
      setSpots(Array.isArray(data)&&data.length>0?data:DEMO_SPOTS);
      setLoading(false);
    }).catch(()=>{ setSpots(DEMO_SPOTS); setLoading(false); });
  }, []);

  const filtered = spots.filter(s => {
    if (search && !s.agentName?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== 'all' && s.type !== filterType) return false;
    if (filterResult !== 'all' && s.result !== filterResult) return false;
    if (filterQA !== 'all' && s.qaOfficer !== filterQA) return false;
    return true;
  });

  const correct = filtered.filter(s=>s.result==='Correct').length;
  const incorrect = filtered.filter(s=>s.result==='Incorrect').length;

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`.sc-row:hover{background:rgba(255,255,255,0.04)!important} select option{background:#131626!important;color:#FFFFFF!important} select{color-scheme:dark}`}</style>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#A78BFA', marginBottom:6 }}>SUPERVISOR VIEW</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:'#FFFFFF' }}>Spot Checks Overview</h1>
          <div style={{ padding:'7px 16px', borderRadius:20, background:'rgba(167,139,250,0.1)', border:'1px solid rgba(167,139,250,0.2)', fontSize:13, fontWeight:600, color:'#A78BFA' }}>{filtered.length} records</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'Total Checks', value:spots.length, color:'#A78BFA' },
          { label:'Correct', value:spots.filter(s=>s.result==='Correct').length, color:'#4ADE80' },
          { label:'Incorrect', value:spots.filter(s=>s.result==='Incorrect').length, color:'#F87171' },
          { label:'Pass Rate', value:spots.length?`${Math.round(spots.filter(s=>s.result==='Correct').length/spots.length*100)}%`:'—', color:'#60A5FA' },
        ].map((k,i)=>(
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 14px 14px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#4A5A78', marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:26, fontWeight:800, color:'#FFFFFF' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:10, marginBottom:18 }}>
        <input placeholder="🔍  Search agent..." value={search} onChange={e=>setSearch(e.target.value)} style={{ ...inp, width:'100%', boxSizing:'border-box' }}/>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ ...sel, width:'100%', boxSizing:'border-box' }}>
          <option value="all">All Types</option>
          {SPOT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterResult} onChange={e=>setFilterResult(e.target.value)} style={{ ...sel, width:'100%', boxSizing:'border-box' }}>
          <option value="all">All Results</option>
          <option value="Correct">Correct</option>
          <option value="Incorrect">Incorrect</option>
        </select>
        <select value={filterQA} onChange={e=>setFilterQA(e.target.value)} style={{ ...sel, width:'100%', boxSizing:'border-box' }}>
          <option value="all">All QA Officers</option>
          {['Miran','Sizar','Brwa','Mohammed'].map(q=><option key={q} value={q}>{q}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 140px 120px 100px 1fr', padding:'13px 24px', background:'rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          {['Agent','QA Officer','Type','Date','Result','Notes'].map((c,i)=>(
            <div key={i} style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#A78BFA' }}>{c}</div>
          ))}
        </div>
        <div style={{ maxHeight:480, overflowY:'auto' }}>
          {loading ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>Loading...</div>
          : filtered.length===0 ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>No spot checks found</div>
          : filtered.map((s,i)=>(
            <div key={i} className="sc-row" style={{ display:'grid', gridTemplateColumns:'1fr 100px 140px 120px 100px 1fr', padding:'13px 24px', borderBottom:i<filtered.length-1?'1px solid rgba(255,255,255,0.04)':'none', alignItems:'center', background:'transparent', transition:'background 0.15s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:`${ac(s.agentName)}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:ac(s.agentName), flexShrink:0 }}>
                  {s.agentName?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:'#E2E8F0' }}>{s.agentName||'—'}</span>
              </div>
              <div style={{ fontSize:12, color:'#8FA3C4' }}>{s.qaOfficer||'—'}</div>
              <div><span style={{ padding:'3px 10px', borderRadius:20, background:'rgba(167,139,250,0.12)', fontSize:11, fontWeight:700, color:'#A78BFA' }}>{s.type}</span></div>
              <div style={{ fontSize:12, color:'#4A5A78' }}>{s.date}</div>
              <div><span style={{ padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:700, background:s.result==='Correct'?'rgba(74,222,128,0.1)':'rgba(248,113,113,0.12)', color:s.result==='Correct'?'#4ADE80':'#F87171' }}>{s.result==='Correct'?'✓ Correct':'✗ Incorrect'}</span></div>
              <div style={{ fontSize:12, color:'#8FA3C4', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.notes||'—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}