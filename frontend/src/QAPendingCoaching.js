import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api';
const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const av = n => { if(!n)return'?'; const w=n.trim().split(' '); return(w[0][0]+(w[1]?w[1][0]:'')).toUpperCase(); };
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const sc  = p => p===100?'#4ADE80':p>0?'#FBBF24':'#F87171';
const sbg = p => p===100?'rgba(74,222,128,0.12)':p>0?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';
const sbd = p => p===100?'rgba(74,222,128,0.3)':p>0?'rgba(251,191,36,0.3)':'rgba(248,113,113,0.3)';

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

const DEMO = [
  {
    id:1, agentName:'Demo Agent A', date:'08 Mar 2026', score:50,
    level1:'General complaints', level2:'Outage (cutoff)', ticketId:'1143',
    duration:'5:22', waitTime:'1:10', holdUnhold:'Incorrect',
    scores:[1,1,0,1,0,0,1,1,0,0],
    improvementArea:'Tone of voice and FAQ alignment need significant work.',
    goodComment:'Agent was polite and greeted correctly.',
    badComment:'FAQ not followed. Hold procedure was incorrect.',
    feedback:'Needs coaching session focused on FAQ and hold procedure.',
    coachStatus:'Pending Coaching',
  },
  {
    id:2, agentName:'Demo Agent B', date:'07 Mar 2026', score:60,
    level1:'Billing complaints', level2:'High Bill/ High Debt', ticketId:'1144',
    duration:'6:45', waitTime:'0:55', holdUnhold:'Correct',
    scores:[1,1,1,0,1,1,0,1,0,0],
    improvementArea:'Communication skills and call ending need improvement.',
    goodComment:'Good tone and empathy throughout.',
    badComment:'Ending not done properly. Active listening was weak.',
    feedback:'Focus on closing the call correctly and active listening.',
    coachStatus:'Pending Coaching',
  },
  {
    id:3, agentName:'Demo Agent C', date:'06 Mar 2026', score:40,
    level1:'Service requests', level2:'Smart meter', ticketId:'1145',
    duration:'4:10', waitTime:'0:40', holdUnhold:'Incorrect',
    scores:[0,1,0,1,0,1,0,1,0,1],
    improvementArea:'Active listening and greeting script need major improvement.',
    goodComment:'Agent tried to resolve the issue.',
    badComment:'Greeting was wrong. Active listening was very poor.',
    feedback:'Urgent coaching needed on greeting and listening skills.',
    coachStatus:'Pending Coaching',
  },
  { id:4, agentName:'Demo Agent D', date:'05 Mar 2026', score:50,
    level1:'Billing complaints', level2:'Zero bill', ticketId:'1146',
    duration:'3:55', waitTime:'0:30', holdUnhold:'Correct',
    scores:[1,0,1,0,1,0,1,0,1,0],
    improvementArea:'Customer name not asked. FAQ and active listening need work.',
    goodComment:'Agent maintained a professional tone throughout.',
    badComment:'Did not ask for customer name. FAQ alignment failed.',
    feedback:'Must follow the opening script and FAQ guidelines consistently.',
    coachStatus:'Pending Coaching',
  },
  { id:5, agentName:'Demo Agent E', date:'04 Mar 2026', score:60,
    level1:'Inquiries', level2:'Billing Inquiries', ticketId:'1147',
    duration:'5:40', waitTime:'1:00', holdUnhold:'Incorrect',
    scores:[1,1,0,1,1,0,1,0,1,0],
    improvementArea:'Hold procedure incorrect. Ending and active listening weak.',
    goodComment:'Good problem solving and tagging on this call.',
    badComment:'Hold music missing. Ending was abrupt.',
    feedback:'Coaching needed on hold procedure and proper call closure.',
    coachStatus:'Pending Coaching',
  },
  { id:6, agentName:'Demo Agent F', date:'03 Mar 2026', score:30,
    level1:'General complaints', level2:'Fraud', ticketId:'1148',
    duration:'7:12', waitTime:'2:05', holdUnhold:'Incorrect',
    scores:[0,1,0,0,1,0,0,1,0,0],
    improvementArea:'Multiple critical failures — greeting, FAQ, tagging, tone, ending, active listening.',
    goodComment:'Agent stayed calm under pressure.',
    badComment:'Greeting, FAQ, tagging, tone and ending all failed.',
    feedback:'Immediate coaching session required across multiple criteria.',
    coachStatus:'Pending Coaching',
  },
];

export default function QAPendingCoaching({ user }) {
  const qaName = user?.name || '';
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [marking, setMarking] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    axios.get(`${API}/evaluations`)
      .then(r => {
        const all = Array.isArray(r.data) ? r.data : [];
        setItems(all.filter(e =>
          (e.qaOfficer||e.qa_name||'').toLowerCase() === qaName.toLowerCase() &&
          (e.coachStatus||'').toLowerCase().includes('pending')
        ));
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, [qaName]);

  const isDemo  = items.length === 0 && !loading;
  const data    = isDemo ? DEMO : items;
  const filtered = data.filter(e =>
    (e.agentName||e.agent_name||'').toLowerCase().includes(search.toLowerCase())
  );

  const markCoached = async (e) => {
    if (isDemo) return;
    setMarking(e.id);
    try { await axios.patch(`${API}/evaluations/${e.id}`, { coachStatus:'Coached' }); load(); } catch {}
    setMarking(null);
  };

  const toggle = (id) => setExpanded(p => p === id ? null : id);

  // KPI calculations
  const totalPending = data.length;
  const today        = new Date();
  const overdueCount = data.filter(e => {
    const d = new Date(e.date || e.evalDate || '');
    return !isNaN(d) && Math.floor((today - d) / 86400000) > 5;
  }).length;
  const thisWeek = data.filter(e => {
    const d = new Date(e.date || e.evalDate || '');
    return !isNaN(d) && Math.floor((today - d) / 86400000) <= 7;
  }).length;
  const scores2   = data.map(e => Number(e.score||0)).filter(s => s > 0);
  const avgScore2 = scores2.length ? Math.round(scores2.reduce((a,b)=>a+b,0)/scores2.length/10) : 0;

  const inputSt = { padding:'9px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFFFFF', fontSize:13, outline:'none', ...F };

  return (
    <div style={{ ...F, background:'#0D0F1E', minHeight:'100vh', padding:'28px 32px 60px', color:'#FFFFFF' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#FBBF24', letterSpacing:'2.5px', textTransform:'uppercase', marginBottom:6 }}>QA OFFICER · {qaName}</div>
        <h1 style={{ margin:0, fontSize:26, fontWeight:900 }}>
          Pending <span style={{ background:'linear-gradient(90deg,#FBBF24,#FF6B35)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Coaching</span>
        </h1>
        <p style={{ margin:'6px 0 0', fontSize:13, color:'#4A5A78' }}>
          {loading ? 'Loading...' : `${data.length} agents need coaching · showing ${filtered.length}`}
        </p>
        {isDemo && <div style={{ marginTop:8, display:'inline-flex', padding:'4px 12px', borderRadius:20, background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)', fontSize:11, fontWeight:700, color:'#FBBF24' }}>⚡ Demo data</div>}
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Pending Coaching', value:totalPending, color:'#FBBF24', sub:'need follow-up' },
          { label:'Overdue (5+ days)', value:overdueCount, color:'#F87171', sub:'require urgent action' },
          { label:'Added This Week',  value:thisWeek,      color:'#60A5FA', sub:'recent additions' },
          { label:'Avg Score',        value:avgScore2>0?`${avgScore2}/10`:'—', color:avgScore2>=8?'#4ADE80':avgScore2>=5?'#FBBF24':'#F87171', sub:'across pending calls' },
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

      <div style={{ marginBottom:20 }}>
        <input placeholder="Search agent" value={search} onChange={e=>setSearch(e.target.value)} style={{ ...inputSt, width:280 }}/>
      </div>

      {/* Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, alignItems:'start' }}>
        {filtered.map((e, i) => {
          const s       = Number(e.score || 0);
          const isOpen  = expanded === (e.id || i);
          const scores  = Array.isArray(e.scores) ? e.scores : [];
          const passed  = scores.filter(x => x === 1).length;
          const agentN  = e.agentName || e.agent_name || '—';

          return (
            <div key={e.id || i} style={{ background:'rgba(255,255,255,0.04)', border:`1.5px solid ${isOpen ? 'rgba(251,191,36,0.45)' : 'rgba(255,255,255,0.13)'}`, borderRadius:16, overflow:'hidden', transition:'all 0.2s', boxShadow: isOpen ? '0 0 0 1px rgba(251,191,36,0.15), 0 8px 32px rgba(0,0,0,0.35)' : '0 2px 12px rgba(0,0,0,0.25)' }}>

              {/* Score top bar */}
              <div style={{ height:4, background:`linear-gradient(90deg,${sc(s)},${sc(s)}33)`, boxShadow:`0 0 8px ${sc(s)}66` }}/>

              {/* ── Collapsed Header ── */}
              <div style={{ padding:'16px 18px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', background:ac(agentN), display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#fff', flexShrink:0 }}>
                    {av(agentN)}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:'#FFFFFF' }}>{agentN}</div>
                    <div style={{ fontSize:11, color:'#4A5A78', marginTop:2 }}>{e.date || e.evalDate || '—'}</div>
                  </div>
                  <div style={{ padding:'5px 12px', borderRadius:10, background:sbg(s), border:`1px solid ${sbd(s)}`, fontSize:13, fontWeight:900, color:sc(s) }}>
                    {scores.length > 0 ? `${passed}/10` : `${s}%`}
                  </div>
                </div>

                {/* Category + Ticket */}
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:12 }}>
                  <div style={{ padding:'9px 12px', background:'rgba(255,255,255,0.03)', borderRadius:10, border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#4A5A78', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:3 }}>Category</div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#C8D8EC' }}>{e.level1 || '—'}</div>
                    <div style={{ fontSize:11, color:'#4A5A78' }}>{e.level2 || ''}</div>
                  </div>
                  <div style={{ padding:'9px 12px', background:'rgba(255,255,255,0.03)', borderRadius:10, border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#4A5A78', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:3 }}>Ticket</div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#C8D8EC' }}>{e.ticketId || e.ticket_id || '—'}</div>
                  </div>
                </div>

                {/* Improvement Area — always visible */}
                {(e.improvementArea || e.improvement) && (
                  <div style={{ padding:'10px 12px', background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.18)', borderRadius:10, marginBottom:14 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#FBBF24', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:4 }}>📋 Areas to Improve</div>
                    <div style={{ fontSize:12, color:'#C8D8EC', lineHeight:1.6 }}>{e.improvementArea || e.improvement}</div>
                  </div>
                )}

                {/* Expand / Collapse toggle */}
                <button
                  onClick={() => toggle(e.id || i)}
                  style={{ width:'100%', padding:'9px', borderRadius:10, border:`1px solid ${isOpen ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)'}`, background:isOpen ? 'rgba(251,191,36,0.08)' : 'rgba(255,255,255,0.04)', color:isOpen ? '#FBBF24' : '#8FA3C4', fontSize:12, fontWeight:700, cursor:'pointer', marginBottom:10, transition:'all 0.2s', ...F }}
                >
                  {isOpen ? '▲ Hide Details' : '▼ View Full Evaluation'}
                </button>

                {/* Mark as Coached */}
                <button
                  onClick={() => markCoached(e)}
                  disabled={marking === e.id || isDemo}
                  style={{ width:'100%', padding:'10px', borderRadius:10, border:'none', cursor:isDemo ? 'default' : 'pointer', fontSize:13, fontWeight:700, transition:'all 0.2s', ...F,
                    background: isDemo ? 'rgba(255,255,255,0.05)' : 'rgba(74,222,128,0.12)',
                    color:      isDemo ? '#4A5A78' : '#4ADE80',
                    border:     isDemo ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(74,222,128,0.3)',
                  }}
                >
                  {marking === e.id ? '✓ Saving...' : isDemo ? 'Mark as Coached (Demo)' : '✓ Mark as Coached'}
                </button>
              </div>

              {isOpen && (
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.25)', padding:'16px 18px 20px', marginTop:0 }}>

                  {/* Call Info row */}
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:'1.5px', color:'#60A5FA', textTransform:'uppercase', marginBottom:8 }}>CALL INFORMATION</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
                    {[
                      { label:'Duration',    val: e.duration    || '—' },
                      { label:'Wait Time',   val: e.waitTime    || '—' },
                      { label:'Hold–Unhold', val: e.holdUnhold  || '—' },
                      { label:'QA Officer',  val: e.qaOfficer   || qaName || '—' },
                    ].map(f => (
                      <div key={f.label} style={{ padding:'9px 12px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:'#4A5A78', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:3 }}>{f.label}</div>
                        <div style={{ fontSize:12, fontWeight:600, color: f.label==='Hold–Unhold' ? (f.val==='Correct'?'#4ADE80':'#F87171') : '#C8D8EC' }}>{f.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* 10 Criteria */}
                  {scores.length > 0 && (
                    <>
                      <div style={{ fontSize:9, fontWeight:700, letterSpacing:'1.5px', color:'#A78BFA', textTransform:'uppercase', marginBottom:8 }}>
                        EVALUATION CRITERIA — {passed} / 10 passed
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:16 }}>
                        {CRITERIA.map((c, j) => {
                          const pass = scores[j] === 1;
                          return (
                            <div key={j} style={{ padding:'8px 12px', borderRadius:10, background: pass ? 'rgba(74,222,128,0.07)' : 'rgba(248,113,113,0.07)', border:`1px solid ${pass ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`, display:'flex', alignItems:'center', gap:8 }}>
                              <span style={{ fontSize:11, fontWeight:900, color: pass ? '#4ADE80' : '#F87171', flexShrink:0 }}>{pass ? '✓' : '✗'}</span>
                              <span style={{ fontSize:11, fontWeight:600, color: pass ? '#4ADE80' : '#F87171', lineHeight:1.3 }}>{c}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Good + Bad Comments */}
                  {(e.goodComment || e.badComment || e.positiveComments || e.badComments) && (
                    <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:12 }}>
                      {(e.goodComment || e.positiveComments) && (
                        <div style={{ padding:'10px 14px', background:'rgba(74,222,128,0.07)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:10 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:'#4ADE80', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 }}>✓ Good Comment</div>
                          <div style={{ fontSize:12, color:'#BBF7D0', lineHeight:1.6 }}>{e.goodComment || e.positiveComments}</div>
                        </div>
                      )}
                      {(e.badComment || e.badComments) && (
                        <div style={{ padding:'10px 14px', background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:'#F87171', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 }}>✗ Bad Comment</div>
                          <div style={{ fontSize:12, color:'#FECACA', lineHeight:1.6 }}>{e.badComment || e.badComments}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback */}
                  {e.feedback && (
                    <div style={{ padding:'10px 14px', background:'rgba(96,165,250,0.07)', border:'1px solid rgba(96,165,250,0.2)', borderRadius:10 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:'#60A5FA', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 }}>Agent Feedback</div>
                      <div style={{ fontSize:12, color:'#BFDBFE', lineHeight:1.6 }}>{e.feedback}</div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && !loading && (<div style={{gridColumn:'1/-1'}}>
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🎉</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#4ADE80', marginBottom:6 }}>All caught up!</div>
            <div style={{ fontSize:13, color:'#4A5A78' }}>No pending coaching sessions</div>
          </div></div>
        )}
      </div>
    </div>
  );
}