import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api';
const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };

// 10-criteria scoring system
const sc  = p => p===100?'#4ADE80':p>0?'#FBBF24':'#F87171';
const sbg = p => p===100?'rgba(74,222,128,0.12)':p>0?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';
const sbd = p => p===100?'rgba(74,222,128,0.3)':p>0?'rgba(251,191,36,0.3)':'rgba(248,113,113,0.3)';

const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const av = n => { if(!n)return'?'; const w=n.trim().split(' '); return(w[0][0]+(w[1]?w[1][0]:'')).toUpperCase(); };
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];

const CRITERIA = [
  'Greeting & Script',
  'Ask about Customer Name & Info',
  'FAQ Alignment',
  'Correcting Tagging Topic',
  'Communication / Problem Solving',
  'Tone of Voice',
  'Ending',
  'Rude & Behaviour',
  'Hang Up',
  'Active Listening',
];

const DEMO_EVALS = [
  {
    id:1, agent:'Demo Agent A', qa:'QA Officer 1', queue:'Sorani', coordinator:'Miran',
    date:'10 Mar 2026', duration:'4:32', waitTime:'0:45', ticketId:'1143',
    agentEmail:'', score:90, coaching:'Coached',
    scores:[1,1,1,1,1,1,1,1,1,0], holdUnhold:'Correct',
    improvementArea:'Active listening needs slight improvement on complex calls.',
    goodComment:'Clear greeting, handled billing well. Great tone throughout.',
    badComment:'Missed last criterion on active listening.',
    feedback:'Overall strong performance. Keep it up.',
  },
  {
    id:2, agent:'Demo Agent B', qa:'QA Officer 1', queue:'Arabic', coordinator:'Sizar',
    date:'09 Mar 2026', duration:'6:10', waitTime:'1:02', ticketId:'1144',
    agentEmail:'', score:70, coaching:'Pending Coaching',
    scores:[1,1,1,0,1,1,1,0,1,0], holdUnhold:'Correct',
    improvementArea:'Tagging topic not corrected. Active listening and hold procedure need work.',
    goodComment:'Good empathy shown during the call.',
    badComment:'Did not follow hold procedure correctly. Tagging was wrong.',
    feedback:'Needs coaching session on hold procedure and tagging.',
  },
  {
    id:3, agent:'Demo Agent C', qa:'QA Officer 1', queue:'Arabic', coordinator:'Sizar',
    date:'08 Mar 2026', duration:'5:20', waitTime:'0:50', ticketId:'1145',
    agentEmail:'', score:50, coaching:'Pending Coaching',
    scores:[1,0,1,0,1,0,0,1,0,1], holdUnhold:'Incorrect',
    improvementArea:'Multiple areas need improvement: FAQ, tagging, tone, ending.',
    goodComment:'Agent was polite with the customer.',
    badComment:'FAQ alignment failed. Tone of voice inconsistent. Ending not done properly.',
    feedback:'Urgent coaching required. Multiple criteria failed.',
  },
  {
    id:4, agent:'Demo Agent A', qa:'QA Officer 1', queue:'Sorani', coordinator:'Miran',
    date:'07 Mar 2026', duration:'3:58', waitTime:'0:30', ticketId:'1140',
    agentEmail:'', score:80, coaching:'Coached',
    scores:[1,1,1,1,0,1,1,1,0,1], holdUnhold:'Correct',
    improvementArea:'Communication/problem solving and hang up criteria failed.',
    goodComment:'Well-structured call with good information gathering.',
    badComment:'Communication and hang up issues observed.',
    feedback:'Good progress. Focus on problem solving and call closure.',
  },
];

export default function QAMyEvaluations({ user }) {
  const qaName = user?.name || '';
  const [evals, setEvals]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterScore, setFilterScore] = useState('all');
  const [filterCoach, setFilterCoach] = useState('all');
  const [expanded, setExpanded]   = useState(null);

  useEffect(() => {
    axios.get(`${API}/evaluations`)
      .then(r => {
        const all = Array.isArray(r.data) ? r.data : [];
        setEvals(all.filter(e => (e.qaOfficer||e.qa_name||'').toLowerCase() === qaName.toLowerCase()));
      })
      .catch(() => setEvals([]))
      .finally(() => setLoading(false));
  }, [qaName]);

  const data = (evals.length === 0 && !loading) ? DEMO_EVALS : evals;

  const filtered = data.filter(e => {
    const s  = Number(e.score || 0);
    const nm = (e.agentName || e.agent_name || e.agent || '').toLowerCase();
    if (search && !nm.includes(search.toLowerCase())) return false;
    if (filterScore === 'perfect'  && s !== 100)          return false;
    if (filterScore === 'partial'  && (s < 10 || s > 90)) return false;
    if (filterScore === 'zero'     && s !== 0)             return false;
    if (filterCoach === 'pending'  && !(e.coaching||e.coachStatus||'').toLowerCase().includes('pending')) return false;
    if (filterCoach === 'coached'  && !(e.coaching||e.coachStatus||'').toLowerCase().includes('coached')) return false;
    if (filterCoach === 'noissue'  && !(e.coaching||e.coachStatus||'').toLowerCase().includes('no issue')) return false;
    return true;
  });

  // KPI calculations
  const totalEvals   = data.length;
  const perfectScore = data.filter(e => Number(e.score||0) === 100).length;
  const pendingCount = data.filter(e => (e.coaching||e.coachStatus||'').toLowerCase().includes('pending')).length;
  const coachedCount = data.filter(e => (e.coaching||e.coachStatus||'').toLowerCase().includes('coached') && !((e.coaching||e.coachStatus||'').toLowerCase().includes('pending'))).length;
  const noIssueCount = data.filter(e => (e.coaching||e.coachStatus||'').toLowerCase().includes('no issue')).length;
  const scores       = data.map(e => Number(e.score||0)).filter(s => s > 0);
  const avgScore     = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length/10) : 0;

  const inputSt = { padding:'9px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFFFFF', fontSize:13, outline:'none', ...F };
  const selSt = { ...inputSt, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238FA3C4' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundSize:'12px', paddingRight:32, cursor:'pointer', appearance:'none', WebkitAppearance:'none', backgroundColor:'rgba(255,255,255,0.05)' };

  const coachColor = (s) => {
    const v = (s||'').toLowerCase();
    if (v.includes('pending')) return { bg:'rgba(251,191,36,0.12)', bd:'rgba(251,191,36,0.3)', cl:'#FBBF24' };
    if (v.includes('coached'))  return { bg:'rgba(74,222,128,0.12)', bd:'rgba(74,222,128,0.3)',  cl:'#4ADE80' };
    return { bg:'rgba(96,165,250,0.12)', bd:'rgba(96,165,250,0.3)', cl:'#60A5FA' };
  };

  return (
    <div style={{ ...F, background:'#0D0F1E', minHeight:'100vh', padding:'28px 32px 60px', color:'#FFFFFF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        select option { background:#131626; color:#fff; }
        .eval-row:hover { background:rgba(255,255,255,0.025)!important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#FF8C5A', letterSpacing:'2.5px', textTransform:'uppercase', marginBottom:6 }}>QA OFFICER · {qaName}</div>
        <h1 style={{ margin:0, fontSize:26, fontWeight:900, letterSpacing:'-0.6px' }}>
          My <span style={{ background:'linear-gradient(90deg,#FF6B35,#FBBF24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Evaluations</span>
        </h1>
        <p style={{ margin:'6px 0 0', fontSize:13, color:'#4A5A78' }}>
          {loading ? 'Loading...' : `${data.length} evaluations · showing ${filtered.length}`}
        </p>
        {evals.length===0 && !loading && (
          <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:20, background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)', fontSize:11, fontWeight:700, color:'#FBBF24' }}>⚡ Demo data</div>
        )}
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Evaluations', value:totalEvals,              color:'#FF6B35', sub:'by you this period' },
          { label:'Avg Score',         value:avgScore>0?`${avgScore}/10`:'—', color:avgScore===10?'#4ADE80':avgScore>=6?'#FBBF24':'#F87171', sub:'across all calls' },
          { label:'Pending Coaching',  value:pendingCount,             color:'#FBBF24', sub:'need follow-up' },
          { label:'Coached',           value:coachedCount,             color:'#4ADE80', sub:'completed' },
        ].map((k,i) => (
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'20px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 18px 18px' }}/>
            <div style={{ position:'absolute', top:-20, right:-20, width:90, height:90, borderRadius:'50%', background:k.color, opacity:0.08, filter:'blur(28px)' }}/>
            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#4A5A78', marginBottom:8 }}>{k.label}</div>
            <div style={{ fontSize:32, fontWeight:800, color:'#FFF', marginBottom:4 }}>{k.value}</div>
            <div style={{ fontSize:11, color:k.color, fontWeight:600 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <input placeholder="Search agent name..." value={search} onChange={e=>setSearch(e.target.value)} style={{ ...inputSt, flex:1, minWidth:200 }}/>
        <select value={filterScore} onChange={e=>setFilterScore(e.target.value)} style={selSt}>
          <option value="all">All Scores</option>
          <option value="perfect">10 / 10</option>
          <option value="partial">1–9 / 10</option>
          <option value="zero">0 / 10</option>
        </select>
        <select value={filterCoach} onChange={e=>setFilterCoach(e.target.value)} style={selSt}>
          <option value="all">All Coaching</option>
          <option value="pending">Pending Coaching</option>
          <option value="coached">Coached</option>
          <option value="noissue">No Issue</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
        {/* Header */}
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 100px 1fr 1.4fr 80px 110px 110px', padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)' }}>
          {['Agent','Coordinator','Date','Category','Score','Hold–Unhold','Coaching'].map(h => (
            <div key={h} style={{ fontSize:10.5, fontWeight:800, color:'#4A5A78', letterSpacing:'1px', textTransform:'uppercase' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding:'40px', textAlign:'center', fontSize:13, color:'#4A5A78' }}>No evaluations match the filters</div>
        )}

        {filtered.map((e, i) => {
          const s      = Number(e.score || 0);
          const isOpen = expanded === i;
          const scores = Array.isArray(e.scores) ? e.scores : [];
          const passed = scores.filter(x => x === 1).length;
          const cc     = coachColor(e.coaching || e.coachStatus);
          const agentN = e.agentName || e.agent_name || e.agent || '—';
          const coachL = (e.coaching || e.coachStatus || '—').replace('Pending Coaching','Pending');

          return (
            <div key={i}>
              {/* Row */}
              <div
                className="eval-row"
                onClick={() => setExpanded(isOpen ? null : i)}
                style={{ display:'grid', gridTemplateColumns:'1.6fr 100px 1fr 1.4fr 80px 110px 110px', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer', transition:'background 0.15s', background: isOpen ? 'rgba(255,107,53,0.05)' : 'transparent', alignItems:'center' }}
              >
                {/* Agent */}
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:'50%', background:ac(agentN), display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>{av(agentN)}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#FFFFFF' }}>{agentN}</div>
                  </div>
                </div>
                {/* Coordinator */}
                <div style={{ fontSize:12, color:'#8FA3C4', fontWeight:500 }}>{e.coordinator || '—'}</div>
                {/* Date */}
                <div style={{ fontSize:12, color:'#8FA3C4' }}>{e.date || e.evalDate || '—'}</div>
                {/* Category */}
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC' }}>{e.level1 || '—'}</div>
                  <div style={{ fontSize:10, color:'#4A5A78' }}>{e.level2 || ''}</div>
                </div>
                {/* Score */}
                <div>
                  {s > 0
                    ? <div style={{ padding:'4px 10px', borderRadius:8, background:sbg(s), border:`1px solid ${sbd(s)}`, fontSize:12, fontWeight:800, color:sc(s), display:'inline-block' }}>{passed}/10</div>
                    : <div style={{ padding:'4px 10px', borderRadius:8, background:'rgba(248,113,113,0.12)', border:'1px solid rgba(248,113,113,0.3)', fontSize:12, fontWeight:800, color:'#F87171', display:'inline-block' }}>0/10</div>
                  }
                </div>
                {/* Hold-Unhold */}
                <div>
                  <div style={{ padding:'3px 10px', borderRadius:8, fontSize:11, fontWeight:700, display:'inline-block',
                    background:(e.holdUnhold||'').includes('Correct') ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                    border:`1px solid ${(e.holdUnhold||'').includes('Correct') ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                    color:(e.holdUnhold||'').includes('Correct') ? '#4ADE80' : '#F87171',
                  }}>{e.holdUnhold || '—'}</div>
                </div>
                {/* Coaching */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ padding:'3px 10px', borderRadius:8, fontSize:11, fontWeight:700, display:'inline-block', background:cc.bg, border:`1px solid ${cc.bd}`, color:cc.cl }}>
                    {coachL}
                  </div>
                  <span style={{ color:'#4A5A78', fontSize:12, marginLeft:8 }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* ── Expanded Panel ── */}
              {isOpen && (
                <div style={{ background:'rgba(255,107,53,0.03)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'20px 24px 24px' }}>

                  {/* Section: Call Info */}
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#FF6B35', textTransform:'uppercase', marginBottom:12 }}>CALL INFORMATION</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:20 }}>
                    {[
                      { label:'Queue',         val: e.queue || '—' },
                      { label:'Duration',      val: e.duration || '—' },
                      { label:'Wait Time',     val: e.waitTime || '—' },
                      { label:'Ticket ID',     val: e.ticketId || e.ticket_id || '—' },
                      { label:'Agent Email',   val: e.agentEmail || e.email || '—' },
                    ].map(f => (
                      <div key={f.label} style={{ padding:'10px 14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:'#4A5A78', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:4 }}>{f.label}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:'#C8D8EC' }}>{f.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Section: 10 Criteria */}
                  {scores.length > 0 && (
                    <>
                      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#A78BFA', textTransform:'uppercase', marginBottom:12 }}>
                        EVALUATION CRITERIA — {passed} / 10 passed
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:20 }}>
                        {CRITERIA.map((c, j) => {
                          const pass = scores[j] === 1;
                          return (
                            <div key={j} style={{ padding:'10px 12px', borderRadius:10, background: pass ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)', border:`1px solid ${pass ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.2)'}`, display:'flex', alignItems:'center', gap:8 }}>
                              <div style={{ width:18, height:18, borderRadius:'50%', background: pass ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                <span style={{ fontSize:10, fontWeight:900, color: pass ? '#4ADE80' : '#F87171' }}>{pass ? '✓' : '✗'}</span>
                              </div>
                              <span style={{ fontSize:11, fontWeight:600, color: pass ? '#4ADE80' : '#F87171', lineHeight:1.3 }}>{c}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Section: Improvement Area */}
                  {e.improvementArea && (
                    <div style={{ marginBottom:14 }}>
                      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#FBBF24', textTransform:'uppercase', marginBottom:8 }}>IMPROVEMENT AREA</div>
                      <div style={{ padding:'12px 16px', background:'rgba(251,191,36,0.07)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:10, fontSize:13, color:'#FDE68A', lineHeight:1.6 }}>
                        {e.improvementArea}
                      </div>
                    </div>
                  )}

                  {/* Section: Good + Bad Comments */}
                  {(e.goodComment || e.badComment) && (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                      {e.goodComment && (
                        <div style={{ padding:'12px 16px', background:'rgba(74,222,128,0.07)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:10 }}>
                          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#4ADE80', textTransform:'uppercase', marginBottom:8 }}>✓ GOOD COMMENT</div>
                          <div style={{ fontSize:13, color:'#BBF7D0', lineHeight:1.6 }}>{e.goodComment}</div>
                        </div>
                      )}
                      {e.badComment && (
                        <div style={{ padding:'12px 16px', background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10 }}>
                          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#F87171', textTransform:'uppercase', marginBottom:8 }}>✗ BAD COMMENT</div>
                          <div style={{ fontSize:13, color:'#FECACA', lineHeight:1.6 }}>{e.badComment}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Section: Agent Feedback */}
                  {e.feedback && (
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#60A5FA', textTransform:'uppercase', marginBottom:8 }}>AGENT FEEDBACK</div>
                      <div style={{ padding:'12px 16px', background:'rgba(96,165,250,0.07)', border:'1px solid rgba(96,165,250,0.2)', borderRadius:10, fontSize:13, color:'#BFDBFE', lineHeight:1.6 }}>
                        {e.feedback}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}