import React, { useState } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const av = n => n?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?';
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';
const slb= p => p>=80?'Excellent':p>=60?'Average':'Needs Work';

const QUEUES = ['All Queues','Sorani','Arabic','Badini'];
const QA_NAMES = ['Miran','Sizar','Brwa','Mohammed'];
const SCORES  = ['All Scores','≥80% Excellent','60–79% Average','<60% Needs Work'];

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

// Agent → { queue, coordinator }
const AGENT_DB = {
  'Abdullrahman Ali Mahdi':   { queue:'Sorani', coordinator:'Miran', email:'' },
  'Aran Eimad Qadir':         { queue:'Sorani', coordinator:'Miran', email:'' },
  'Awdang Saman':             { queue:'Sorani', coordinator:'Miran', email:'' },
  'Azad Brifkani':            { queue:'Sorani', coordinator:'Miran', email:'' },
  'Barham Qasim Ahmed':       { queue:'Arabic', coordinator:'Miran', email:'' },
  'Didar Pirbal':             { queue:'Badini', coordinator:'Miran', email:'' },
  'Haryad Shakr Abdulla':     { queue:'Sorani', coordinator:'Miran', email:'' },
  'Hawrin Amir Ahmed':        { queue:'Arabic', coordinator:'Miran', email:'' },
  'Kaiwan Pshtiwan Mustafa':  { queue:'Sorani', coordinator:'Miran', email:'' },
  'Muhammad Ali Osman':       { queue:'Badini', coordinator:'Miran', email:'' },
  'Muhammed Abdulbari Majid': { queue:'Arabic', coordinator:'Miran', email:'' },
  'Omer Tasim Omer':          { queue:'Sorani', coordinator:'Miran', email:'' },
  'Rayan Jaafar':             { queue:'Sorani', coordinator:'Miran', email:'' },
  'Ronar Rasul':              { queue:'Sorani', coordinator:'Miran', email:'' },
  'Safar Mikeail Ismail':     { queue:'Badini', coordinator:'Miran', email:'' },
  'Salih Sangar':             { queue:'Arabic', coordinator:'Miran', email:'' },
  'Sazgar Hassan':            { queue:'Sorani', coordinator:'Miran', email:'' },
  'Suzan Sarmad':             { queue:'Sorani', coordinator:'Miran', email:'' },
  'Abdulqadir Salam':         { queue:'Arabic', coordinator:'Sizar', email:'' },
  'Ahmed Khafut Xdr':         { queue:'Arabic', coordinator:'Sizar', email:'' },
  'Ali Khalid':               { queue:'Sorani', coordinator:'Sizar', email:'' },
  'Ammar Mamnd Salih':        { queue:'Sorani', coordinator:'Sizar', email:'' },
  'Aya Edris':                { queue:'Arabic', coordinator:'Sizar', email:'' },
  'Bahaa Shamsadeen Sulaiman':{ queue:'Arabic', coordinator:'Sizar', email:'' },
  'Darbin Omer Abubakr':      { queue:'Sorani', coordinator:'Sizar', email:'' },
  'Esra Sabah Salim':         { queue:'Arabic', coordinator:'Sizar', email:'' },
  'Govand Wali':              { queue:'Sorani', coordinator:'Sizar', email:'' },
  'Israa Peshkawt':           { queue:'Arabic', coordinator:'Sizar', email:'' },
  'Muhammed Fairq Hadu':      { queue:'Sorani', coordinator:'Sizar', email:'' },
  'Muhammed Jalal Majid':     { queue:'Arabic', coordinator:'Sizar', email:'' },
  'Mustafa Khudhur Ali':      { queue:'Sorani', coordinator:'Sizar', email:'' },
  'Rasul Najmadeen':          { queue:'Sorani', coordinator:'Sizar', email:'' },
  'Safeen Jahfar':            { queue:'Sorani', coordinator:'Sizar', email:'' },
  'Yasser Ameen':             { queue:'Arabic', coordinator:'Sizar', email:'' },
  'Ahmed Jasim Rashid':       { queue:'Sorani', coordinator:'Brwa',  email:'' },
  'Ahmed Saman':              { queue:'Sorani', coordinator:'Brwa',  email:'' },
  'Bawar Fazl Muhammad':      { queue:'Badini', coordinator:'Brwa',  email:'' },
  'Daryan Bakr Kakamand':     { queue:'Sorani', coordinator:'Brwa',  email:'' },
  'Dlovan Maraan Ibrahim':    { queue:'Badini', coordinator:'Brwa',  email:'' },
  'Gailan Xalid':             { queue:'Sorani', coordinator:'Brwa',  email:'' },
  'Halland Hemn':             { queue:'Arabic', coordinator:'Brwa',  email:'' },
  'Haryad Muhsin':            { queue:'Sorani', coordinator:'Brwa',  email:'' },
  'Karwan Wali':              { queue:'Sorani', coordinator:'Brwa',  email:'' },
  'Lawin Kosrat Saadi':       { queue:'Sorani', coordinator:'Brwa',  email:'' },
  'Malik Rashid':             { queue:'Arabic', coordinator:'Brwa',  email:'' },
  'Mohammed Soran Hassan':    { queue:'Badini', coordinator:'Brwa',  email:'' },
  'Neamat Anwar Kareem':      { queue:'Sorani', coordinator:'Brwa',  email:'' },
  'Salm Khairulla Saeed':     { queue:'Sorani', coordinator:'Brwa',  email:'' },
  'Shaida Faizan Kawiz':      { queue:'Arabic', coordinator:'Brwa',  email:'' },
  'Sozhin Karim':             { queue:'Sorani', coordinator:'Brwa',  email:'' },
  'Zhiya Najmadin':           { queue:'Sorani', coordinator:'Brwa',  email:'' },
};

const ALL_AGENTS = Object.keys(AGENT_DB).sort();

const DEMO_EVALS = [
  { id:1,  agent:'Abdullrahman Ali Mahdi', qa:'Miran', queue:'Sorani', date:'2026-03-11', duration:'4:32', waitTime:'0:45', score:90, coaching:'No Issue',         scores:[1,1,1,1,1,1,1,1,1,0], goodComment:'Clear greeting, handled billing well.',       badComment:'' },
  { id:2,  agent:'Govand Wali',            qa:'Sizar', queue:'Sorani', date:'2026-03-11', duration:'6:10', waitTime:'1:02', score:70, coaching:'Pending Coaching', scores:[1,1,1,0,1,1,1,0,1,0], goodComment:'Good empathy shown.',                          badComment:'Did not follow hold procedure correctly.' },
  { id:3,  agent:'Halland Hemn',           qa:'Brwa',  queue:'Arabic', date:'2026-03-10', duration:'3:58', waitTime:'0:30', score:60, coaching:'Pending Coaching', scores:[1,1,0,1,0,1,1,0,0,1], goodComment:'Professional tone throughout.',               badComment:'FAQ alignment and hang up issues.' },
  { id:4,  agent:'Aya Edris',              qa:'Sizar', queue:'Arabic', date:'2026-03-10', duration:'5:20', waitTime:'0:50', score:90, coaching:'No Issue',         scores:[1,1,1,1,1,1,1,1,1,0], goodComment:'Excellent across all criteria.',              badComment:'' },
  { id:5,  agent:'Rayan Jaafar',           qa:'Miran', queue:'Sorani', date:'2026-03-10', duration:'7:00', waitTime:'1:15', score:70, coaching:'Pending Coaching', scores:[1,1,1,0,1,1,0,1,1,0], goodComment:'Good call control.',                          badComment:'Tagging and tone of voice need work.' },
  { id:6,  agent:'Barham Qasim Ahmed',     qa:'Miran', queue:'Arabic', date:'2026-03-09', duration:'4:45', waitTime:'0:40', score:80, coaching:'No Issue',         scores:[1,1,1,1,0,1,1,1,0,1], goodComment:'Well-structured call.',                      badComment:'Communication and hang up issues.' },
  { id:7,  agent:'Ali Khalid',             qa:'Sizar', queue:'Sorani', date:'2026-03-09', duration:'5:50', waitTime:'0:55', score:80, coaching:'Pending Coaching', scores:[1,1,1,1,0,1,0,1,1,1], goodComment:'Good ending and active listening.',           badComment:'Communication/problem solving needs work.' },
  { id:8,  agent:'Daryan Bakr Kakamand',   qa:'Brwa',  queue:'Sorani', date:'2026-03-08', duration:'3:30', waitTime:'0:25', score:90, coaching:'No Issue',         scores:[1,1,1,1,1,1,1,1,1,0], goodComment:'Outstanding performance.',                   badComment:'' },
  { id:9,  agent:'Gailan Xalid',           qa:'Brwa',  queue:'Sorani', date:'2026-03-08', duration:'8:15', waitTime:'2:00', score:50, coaching:'Pending Coaching', scores:[1,0,1,0,1,0,0,1,0,1], goodComment:'',                                           badComment:'Multiple issues across criteria.' },
  { id:10, agent:'Lawin Kosrat Saadi',     qa:'Miran', queue:'Sorani', date:'2026-03-07', duration:'5:05', waitTime:'0:48', score:80, coaching:'Coached',          scores:[1,1,1,1,1,1,0,1,0,1], goodComment:'Improved significantly after coaching.',     badComment:'Hang up and ending still need work.' },
];

const BLANK_FORM = () => ({
  agent:'', qa:'Miran', queue:'', coordinator:'', email:'',
  date: new Date().toISOString().split('T')[0],
  duration:'', waitTime:'',
  ticketId:'',
  scores: Array(10).fill(0),
  holdUnhold:'Correct', coaching:'No Issue',
  improvementArea:'',
  goodComment:'', badComment:'',
  feedback:'',
});

export default function TLEvaluations({ user }) {
  const [evals,       setEvals]       = useState(DEMO_EVALS);
  const [expanded,    setExpanded]    = useState(null);
  const [filterQA,    setFilterQA]    = useState('All QA');
  const [filterQ,     setFilterQ]     = useState('All Queues');
  const [filterScore, setFilterScore] = useState('All Scores');
  const [search,      setSearch]      = useState('');
  const [showCreate,  setShowCreate]  = useState(false);
  const [form,        setForm]        = useState(BLANK_FORM());
  const [saving,      setSaving]      = useState(false);
  const [errors,      setErrors]      = useState({});

  const validate = () => {
    const e = {};
    if (!form.agent)           e.agent         = 'Required';
    if (!form.duration)        e.duration      = 'Required';
    if (!form.waitTime)        e.waitTime      = 'Required';
    if (!form.ticketId)        e.ticketId      = 'Required';
    if (!form.improvementArea) e.improvementArea = 'Required';
    if (!form.goodComment)     e.goodComment   = 'Required';
    if (!form.badComment)      e.badComment    = 'Required';
    if (!form.feedback)        e.feedback      = 'Required';
    return e;
  };

  const inp = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:undefined})); };

  const toggleScore = (i) => setForm(f=>{
    const s=[...f.scores]; s[i]=s[i]===1?0:1; return {...f,scores:s};
  });

  const onAgentChange = (agent) => {
    const info = AGENT_DB[agent] || { queue:'', coordinator:'', email:'' };
    setForm(f=>({...f, agent, queue:info.queue, coordinator:info.coordinator, email:info.email}));
    setErrors(e=>({...e, agent:undefined}));
  };

  const total  = form.scores.reduce((a,b)=>a+b,0);
  const passed = form.scores.filter(s=>s===1).length;
  const failed = form.scores.filter(s=>s===0).length;
  const pct    = form.scores.length > 0 ? Math.round((passed / form.scores.length) * 100) : 0;

  const filtered = evals.filter(e => {
    if (filterQA!=='All QA' && e.qa!==filterQA) return false;
    if (filterQ!=='All Queues' && e.queue!==filterQ) return false;
    if (filterScore==='≥80% Excellent' && e.score<80) return false;
    if (filterScore==='60–79% Average' && (e.score<60||e.score>=80)) return false;
    if (filterScore==='<60% Needs Work' && e.score>=60) return false;
    if (search && !e.agent.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setSaving(true);
    const body = {
      agentName:form.agent, agentEmail:form.email, qaOfficer:form.qa, queue:form.queue,
      date:form.date, duration:form.duration, waitTime:form.waitTime,
      ticketId:form.ticketId,
      scores:form.scores, holdUnhold:form.holdUnhold,
      coachingStatus:form.coaching,
      improvementArea:form.improvementArea,
      goodComment:form.goodComment, badComment:form.badComment,
      feedback:form.feedback,
    };
    try {
      await fetch('http://localhost:8080/api/evaluations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    } catch(_){}
    setEvals(ev=>[{id:Date.now(),agent:form.agent,agentEmail:form.email,qa:form.qa,queue:form.queue,date:form.date,duration:form.duration,waitTime:form.waitTime,ticketId:form.ticketId,score:pct,coaching:form.coaching,scores:form.scores,holdUnhold:form.holdUnhold,improvementArea:form.improvementArea,goodComment:form.goodComment,badComment:form.badComment,feedback:form.feedback},...ev]);
    setSaving(false);
    setShowCreate(false);
    setForm(BLANK_FORM());
  };

  const exportCSV = () => {
    const rows=[['Agent','QA Officer','Queue','Date','Duration','Wait Time','Score%','Coaching'],...filtered.map(e=>[e.agent,e.qa,e.queue,e.date,e.duration||'',e.waitTime||'',e.score,e.coaching])];
    const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(rows.map(r=>r.join(',')).join('\n'));a.download='evaluations.csv';a.click();
  };

  const SEL = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 14px', fontSize:13, cursor:'pointer', outline:'none', ...F, boxSizing:'border-box', width:'100%', colorScheme:'dark' };
  const INP = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 14px', fontSize:13, outline:'none', ...F, boxSizing:'border-box', width:'100%' };
  const LBL = { fontSize:10, fontWeight:700, color:'#8FA3C4', letterSpacing:'1.2px', textTransform:'uppercase', marginBottom:7, display:'block' };
  const ERR = (k) => errors[k] ? { border:'1px solid rgba(248,113,113,0.7)', boxShadow:'0 0 0 3px rgba(248,113,113,0.1)' } : {};

  return (
    <div style={{...F, padding:'28px 32px', background:'#0D0F1E', minHeight:'100vh', color:'#FFF'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .tl-row:hover{background:rgba(255,255,255,0.03)!important}
        select option{background:#131626!important;color:#FFF!important}
        select{color-scheme:dark}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:#1E2840;border-radius:4px}
        .crit-btn{transition:all .15s;cursor:pointer;user-select:none}
        .crit-btn:hover{transform:scale(1.04)}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.5)}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{marginBottom:24}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:'3px',color:'#60A5FA',marginBottom:5}}>QA TEAM LEAD</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
          <h1 style={{margin:0,fontSize:26,fontWeight:900}}>All <span style={{background:'linear-gradient(90deg,#60A5FA,#A78BFA)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Evaluations</span></h1>
          <div style={{display:'flex',gap:10}}>
            <button onClick={exportCSV} style={{padding:'9px 18px',borderRadius:11,background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.25)',color:'#60A5FA',fontSize:12,fontWeight:700,cursor:'pointer',...F,display:'flex',alignItems:'center',gap:6}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </button>
            <button onClick={()=>setShowCreate(true)} style={{padding:'9px 20px',borderRadius:11,background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',color:'#FFF',fontSize:12,fontWeight:700,cursor:'pointer',...F,display:'flex',alignItems:'center',gap:6,boxShadow:'0 4px 16px rgba(255,107,53,0.3)'}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create Evaluation
            </button>
          </div>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
        <input placeholder="Search agent..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{...INP,width:200,padding:'8px 14px',fontSize:12}}/>
        {[['filterQA',['All QA',...QA_NAMES],filterQA,setFilterQA],
          ['filterQ',QUEUES,filterQ,setFilterQ],
          ['filterScore',SCORES,filterScore,setFilterScore]
        ].map(([k,opts,val,set])=>(
          <select key={k} value={val} onChange={e=>set(e.target.value)} style={{...SEL,width:'auto',padding:'8px 14px',fontSize:12}}>
            {opts.map(o=><option key={o}>{o}</option>)}
          </select>
        ))}
        <div style={{marginLeft:'auto',fontSize:12,color:'#4A5A78',fontWeight:600}}>{filtered.length} results</div>
      </div>

      {/* ── TABLE ── */}
      <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,overflow:'hidden'}}>
        {/* thead */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 110px 90px 110px 90px 140px 48px',gap:0,padding:'10px 20px',borderBottom:'1px solid rgba(255,255,255,0.08)',background:'rgba(255,255,255,0.03)'}}>
          {['Agent','QA Officer','Queue','Date','Score','Coaching',''].map((h,i)=>(
            <div key={i} style={{fontSize:9,fontWeight:700,letterSpacing:'1.5px',color:'#2E3A55',textTransform:'uppercase',...(i===0?{}:{textAlign:'center'})}}>{h}</div>
          ))}
        </div>
        {filtered.length===0 && <div style={{padding:'40px',textAlign:'center',color:'#2E3A55',fontSize:13}}>No evaluations match your filters</div>}
        {filtered.map(e=>(
          <React.Fragment key={e.id}>
            <div className="tl-row" onClick={()=>setExpanded(expanded===e.id?null:e.id)}
              style={{display:'grid',gridTemplateColumns:'1fr 110px 90px 110px 90px 140px 48px',gap:0,padding:'13px 20px',borderBottom:'1px solid rgba(255,255,255,0.04)',cursor:'pointer',alignItems:'center',transition:'background .12s'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:34,height:34,borderRadius:'50%',background:ac(e.agent),display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff',flexShrink:0}}>{av(e.agent)}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:'#FFF'}}>{e.agent}</div>
                  <div style={{fontSize:11,color:'#4A5A78',marginTop:1}}>{e.date}</div>
                </div>
              </div>
              <div style={{fontSize:12,color:'#C8D8EC',textAlign:'center',fontWeight:600}}>{e.qa}</div>
              <div style={{fontSize:12,color:'#8FA3C4',textAlign:'center'}}>{e.queue}</div>
              <div style={{fontSize:11,color:'#4A5A78',textAlign:'center',fontFamily:'monospace'}}>{e.date}</div>
              <div style={{textAlign:'center'}}>
                <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',padding:'4px 10px',borderRadius:8,background:sbg(e.score),fontSize:12,fontWeight:800,color:sc(e.score)}}>{e.score}%</span>
              </div>
              <div style={{textAlign:'center'}}>
                <span style={{fontSize:10,fontWeight:700,color:e.coaching==='No Issue'?'#4ADE80':e.coaching==='Coached'?'#60A5FA':'#FBBF24',background:e.coaching==='No Issue'?'rgba(74,222,128,0.1)':e.coaching==='Coached'?'rgba(96,165,250,0.1)':'rgba(251,191,36,0.1)',padding:'3px 8px',borderRadius:6,whiteSpace:'nowrap'}}>{e.coaching}</span>
              </div>
              <div style={{textAlign:'center',color:'#2E3A55',fontSize:13}}>{expanded===e.id?'▲':'▼'}</div>
            </div>
            {expanded===e.id && (
              <div style={{padding:'20px 24px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(0,0,0,0.15)'}}>

                {/* ── Meta info row ── */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,marginBottom:16}}>
                  {[
                    ['Ticket ID',    e.ticketId||'—',     '#A78BFA'],
                    ['Duration',     e.duration||'—',     '#60A5FA'],
                    ['Wait Time',    e.waitTime||'—',     '#60A5FA'],
                    ['Hold-UnHold',  e.holdUnhold||'—',   e.holdUnhold==='Correct'?'#4ADE80':'#F87171'],
                    ['Agent Email',  e.agentEmail||'—',   '#8FA3C4'],
                  ].map(([lbl,val,clr])=>(
                    <div key={lbl} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'10px 12px'}}>
                      <div style={{fontSize:9,fontWeight:700,color:'#4A5A78',letterSpacing:'1px',textTransform:'uppercase',marginBottom:4}}>{lbl}</div>
                      <div style={{fontSize:12,fontWeight:700,color:clr,wordBreak:'break-all'}}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* ── Score breakdown ── */}
                <div style={{fontSize:9,fontWeight:700,letterSpacing:'1.5px',color:'#8FA3C4',marginBottom:10,textTransform:'uppercase'}}>Score Breakdown</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,marginBottom:16}}>
                  {CRITERIA.map((c,j)=>(
                    <div key={j} style={{background:'rgba(255,255,255,0.04)',borderRadius:10,padding:'10px 12px',display:'flex',flexDirection:'column',gap:4}}>
                      <div style={{fontSize:9,color:'#4A5A78',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',lineHeight:1.3}}>{c}</div>
                      <div style={{fontSize:20,fontWeight:900,color:e.scores&&e.scores[j]===1?'#4ADE80':'#F87171'}}>{e.scores?e.scores[j]:0}</div>
                    </div>
                  ))}
                </div>

                {/* ── Improvement Area ── */}
                {e.improvementArea && (
                  <div style={{background:'rgba(251,191,36,0.05)',border:'1px solid rgba(251,191,36,0.15)',borderRadius:10,padding:'12px 14px',marginBottom:12}}>
                    <div style={{fontSize:9,fontWeight:700,color:'#FBBF24',letterSpacing:'1px',marginBottom:5,textTransform:'uppercase'}}>↗ IMPROVEMENT AREA</div>
                    <div style={{fontSize:12,color:'#C8D8EC',lineHeight:1.6}}>{e.improvementArea}</div>
                  </div>
                )}

                {/* ── Good / Bad Comments ── */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  {e.goodComment && (
                    <div style={{background:'rgba(74,222,128,0.06)',border:'1px solid rgba(74,222,128,0.15)',borderRadius:10,padding:'12px 14px'}}>
                      <div style={{fontSize:9,fontWeight:700,color:'#4ADE80',letterSpacing:'1px',marginBottom:5}}>✓ GOOD COMMENT</div>
                      <div style={{fontSize:12,color:'#C8D8EC',lineHeight:1.6}}>{e.goodComment}</div>
                    </div>
                  )}
                  {e.badComment && (
                    <div style={{background:'rgba(248,113,113,0.06)',border:'1px solid rgba(248,113,113,0.15)',borderRadius:10,padding:'12px 14px'}}>
                      <div style={{fontSize:9,fontWeight:700,color:'#F87171',letterSpacing:'1px',marginBottom:5}}>✗ BAD COMMENT</div>
                      <div style={{fontSize:12,color:'#C8D8EC',lineHeight:1.6}}>{e.badComment}</div>
                    </div>
                  )}
                </div>

                {/* ── Agent Feedback ── */}
                {e.feedback && (
                  <div style={{background:'rgba(96,165,250,0.05)',border:'1px solid rgba(96,165,250,0.15)',borderRadius:10,padding:'12px 14px'}}>
                    <div style={{fontSize:9,fontWeight:700,color:'#60A5FA',letterSpacing:'1px',marginBottom:5,textTransform:'uppercase'}}>💬 AGENT FEEDBACK</div>
                    <div style={{fontSize:12,color:'#C8D8EC',lineHeight:1.6}}>{e.feedback}</div>
                  </div>
                )}

              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          CREATE EVALUATION MODAL
      ══════════════════════════════════════════ */}
      {showCreate && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
          <div style={{background:'#0E1220',border:'1px solid rgba(255,255,255,0.1)',borderRadius:24,width:'100%',maxWidth:820,maxHeight:'92vh',overflowY:'auto',...F}}>

            {/* Modal Header */}
            <div style={{padding:'24px 28px 0',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:'3px',color:'#FF6B35',marginBottom:5}}>QA TEAM LEAD</div>
                <h2 style={{margin:0,fontSize:20,fontWeight:900,color:'#FFF'}}>Create Evaluation</h2>
              </div>
              <button onClick={()=>{setShowCreate(false);setForm(BLANK_FORM());setErrors({});}}
                style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'#8FA3C4',fontSize:18,cursor:'pointer',width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>✕</button>
            </div>

            <div style={{padding:'20px 28px 28px',display:'flex',flexDirection:'column',gap:22}}>

              {/* ── SECTION 1: Basic Info ── */}
              <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'18px 20px'}}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:'2px',color:'#60A5FA',marginBottom:14}}>CALL INFORMATION</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>

                  {/* Agent Name */}
                  <div>
                    <label style={LBL}>Agent Name</label>
                    <select value={form.agent} onChange={e=>onAgentChange(e.target.value)} style={{...SEL,...ERR('agent')}}>
                      <option value="">Select agent...</option>
                      {ALL_AGENTS.map(a=><option key={a}>{a}</option>)}
                    </select>
                  </div>

                  {/* QA Officer — dropdown for TL */}
                  <div>
                    <label style={LBL}>QA Officer</label>
                    <select value={form.qa} onChange={e=>inp('qa',e.target.value)} style={SEL}>
                      {QA_NAMES.map(q=><option key={q}>{q}</option>)}
                    </select>
                  </div>

                  {/* Queue — auto-filled */}
                  <div>
                    <label style={LBL}>Queue <span style={{color:'#FF6B35',fontSize:9}}>(auto)</span></label>
                    <div style={{...INP,color:form.queue?'#FFF':'#2E3A55',background:'rgba(255,255,255,0.03)',borderColor:'rgba(255,255,255,0.06)',cursor:'default'}}>
                      {form.queue||'Auto-filled from agent'}
                    </div>
                  </div>

                  {/* Team Coordinator — auto-filled */}
                  <div>
                    <label style={LBL}>Team Coordinator <span style={{color:'#FF6B35',fontSize:9}}>(auto)</span></label>
                    <div style={{...INP,color:form.coordinator?'#FFF':'#2E3A55',background:'rgba(255,255,255,0.03)',borderColor:'rgba(255,255,255,0.06)',cursor:'default'}}>
                      {form.coordinator||'Auto-filled from agent'}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label style={LBL}>Evaluation Date</label>
                    <input type="date" value={form.date} onChange={e=>inp('date',e.target.value)} style={{...INP,colorScheme:'dark'}}/>
                  </div>

                  {/* Duration + Wait Time */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    <div>
                      <label style={LBL}>Duration <span style={{color:'#FF6B35',fontSize:9}}>(auto)</span></label>
                      <input value={form.duration} onChange={e=>inp('duration',e.target.value)} placeholder="e.g. 4:32" style={{...INP,...ERR('duration')}}/>
                    </div>
                    <div>
                      <label style={LBL}>Wait Time <span style={{color:'#FF6B35',fontSize:9}}>(auto)</span></label>
                      <input value={form.waitTime} onChange={e=>inp('waitTime',e.target.value)} placeholder="e.g. 0:45" style={{...INP,...ERR('waitTime')}}/>
                    </div>
                  </div>

                  {/* Agent Email — auto-filled */}
                  <div>
                    <label style={LBL}>Agent Email <span style={{color:'#FF6B35',fontSize:9}}>(auto)</span></label>
                    <div style={{...INP,color:form.email?'#FFF':'#2E3A55',background:'rgba(255,255,255,0.03)',borderColor:'rgba(255,255,255,0.06)',cursor:'default',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {form.email||'Auto-filled from agent'}
                    </div>
                  </div>

                  {/* Ticket ID — free text */}
                  <div>
                    <label style={LBL}>Ticket ID</label>
                    <input value={form.ticketId} onChange={e=>inp('ticketId',e.target.value)} placeholder="e.g. 1143" style={{...INP,...ERR('ticketId')}}/>
                  </div>

                </div>
              </div>

              {/* ── SECTION 2: Criteria 0/1 ── */}
              <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'18px 20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:'2px',color:'#A78BFA'}}>EVALUATION CRITERIA</div>
                  {/* Live Score Bar */}
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{display:'flex',gap:6}}>
                      <span style={{fontSize:11,fontWeight:700,color:'#4ADE80',background:'rgba(74,222,128,0.1)',padding:'3px 10px',borderRadius:6}}>{passed} / {CRITERIA.length} Pass</span>
                      {failed>0 && <span style={{fontSize:11,fontWeight:700,color:'#F87171',background:'rgba(248,113,113,0.1)',padding:'3px 10px',borderRadius:6}}>{failed} Fail</span>}
                    </div>
                    <div style={{fontSize:22,fontWeight:900,color:sc(pct),minWidth:60,textAlign:'right'}}>{pct}%</div>
                    <div style={{fontSize:10,fontWeight:700,color:sc(pct),background:sbg(pct),padding:'3px 10px',borderRadius:6}}>{slb(pct)}</div>
                  </div>
                </div>

                {/* Score progress bar */}
                <div style={{height:4,background:'rgba(255,255,255,0.06)',borderRadius:4,marginBottom:18,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${sc(pct)},${sc(pct)}88)`,borderRadius:4,transition:'width .3s ease'}}/>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  {CRITERIA.map((c,i)=>{
                    const is1 = form.scores[i]===1;
                    return (
                      <div key={i} className="crit-btn" onClick={()=>toggleScore(i)}
                        style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',borderRadius:12,
                          background:is1?'rgba(74,222,128,0.07)':'rgba(248,113,113,0.05)',
                          border:`1px solid ${is1?'rgba(74,222,128,0.25)':'rgba(248,113,113,0.2)'}`,
                          transition:'all .15s'}}>
                        <span style={{fontSize:13,fontWeight:600,color:is1?'#E2F9EE':'#C8D8EC'}}>{c}</span>
                        {/* Toggle pill */}
                        <div style={{display:'flex',gap:0,borderRadius:8,overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)',flexShrink:0,marginLeft:12}}>
                          <div style={{padding:'5px 14px',fontSize:12,fontWeight:800,background:!is1?'rgba(248,113,113,0.25)':'rgba(255,255,255,0.04)',color:!is1?'#F87171':'#2E3A55',transition:'all .15s',cursor:'pointer'}} onClick={e=>{e.stopPropagation();if(is1)toggleScore(i);}}>0</div>
                          <div style={{width:1,background:'rgba(255,255,255,0.08)'}}/>
                          <div style={{padding:'5px 14px',fontSize:12,fontWeight:800,background:is1?'rgba(74,222,128,0.25)':'rgba(255,255,255,0.04)',color:is1?'#4ADE80':'#2E3A55',transition:'all .15s',cursor:'pointer'}} onClick={e=>{e.stopPropagation();if(!is1)toggleScore(i);}}>1</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── SECTION 3: Hold / Coaching ── */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'16px 18px'}}>
                  <label style={{...LBL,color:'#FBBF24'}}>Hold-UnHold</label>
                  <div style={{display:'flex',gap:8}}>
                    {['Correct','Incorrect'].map(v=>(
                      <button key={v} onClick={()=>inp('holdUnhold',v)}
                        style={{flex:1,padding:'9px',borderRadius:10,border:`1px solid ${form.holdUnhold===v?(v==='Correct'?'rgba(74,222,128,0.4)':'rgba(248,113,113,0.4)'):'rgba(255,255,255,0.08)'}`,
                          background:form.holdUnhold===v?(v==='Correct'?'rgba(74,222,128,0.12)':'rgba(248,113,113,0.12)'):'transparent',
                          color:form.holdUnhold===v?(v==='Correct'?'#4ADE80':'#F87171'):'#4A5A78',
                          fontSize:12,fontWeight:700,cursor:'pointer',...F,transition:'all .15s'}}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'16px 18px'}}>
                  <label style={{...LBL,color:'#60A5FA'}}>Coaching Status</label>
                  <div style={{display:'flex',gap:8}}>
                    {[['No Issue','#4ADE80','rgba(74,222,128,0.4)','rgba(74,222,128,0.12)'],
                      ['Pending Coaching','#FBBF24','rgba(251,191,36,0.4)','rgba(251,191,36,0.12)'],
                      ['Coached','#60A5FA','rgba(96,165,250,0.4)','rgba(96,165,250,0.12)']
                    ].map(([v,clr,brd,bg])=>(
                      <button key={v} onClick={()=>inp('coaching',v)}
                        style={{flex:1,padding:'8px 4px',borderRadius:10,border:`1px solid ${form.coaching===v?brd:'rgba(255,255,255,0.08)'}`,
                          background:form.coaching===v?bg:'transparent',
                          color:form.coaching===v?clr:'#4A5A78',
                          fontSize:11,fontWeight:700,cursor:'pointer',...F,transition:'all .15s',lineHeight:1.3,textAlign:'center'}}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── SECTION 4: Improvement Area ── */}
              <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'16px 18px'}}>
                <label style={{...LBL,color:'#FBBF24'}}>Improvement Area</label>
                <textarea value={form.improvementArea} onChange={e=>inp('improvementArea',e.target.value)}
                  placeholder="What specific areas need improvement in this agent's performance?"
                  rows={2} style={{...INP,resize:'vertical',lineHeight:1.6,...ERR('improvementArea')}}/>
              </div>

              {/* ── SECTION 5: Comments ── */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div style={{background:'rgba(74,222,128,0.04)',border:'1px solid rgba(74,222,128,0.12)',borderRadius:16,padding:'16px 18px'}}>
                  <label style={{...LBL,color:'#4ADE80'}}>✓ Good Comment</label>
                  <textarea value={form.goodComment} onChange={e=>inp('goodComment',e.target.value)}
                    placeholder="What did the agent do well?"
                    rows={3} style={{...INP,resize:'vertical',lineHeight:1.6,background:'rgba(74,222,128,0.04)',borderColor:'rgba(74,222,128,0.15)',...ERR('goodComment')}}/>
                </div>
                <div style={{background:'rgba(248,113,113,0.04)',border:'1px solid rgba(248,113,113,0.12)',borderRadius:16,padding:'16px 18px'}}>
                  <label style={{...LBL,color:'#F87171'}}>✗ Bad Comment</label>
                  <textarea value={form.badComment} onChange={e=>inp('badComment',e.target.value)}
                    placeholder="What needs improvement?"
                    rows={3} style={{...INP,resize:'vertical',lineHeight:1.6,background:'rgba(248,113,113,0.04)',borderColor:'rgba(248,113,113,0.15)',...ERR('badComment')}}/>
                </div>
              </div>

              {/* ── SECTION 6: Agent Feedback ── */}
              <div style={{background:'rgba(96,165,250,0.04)',border:'1px solid rgba(96,165,250,0.12)',borderRadius:16,padding:'16px 18px'}}>
                <label style={{...LBL,color:'#60A5FA'}}>Agent Feedback</label>
                <textarea value={form.feedback} onChange={e=>inp('feedback',e.target.value)}
                  placeholder="Feedback to share directly with the agent after evaluation..."
                  rows={2} style={{...INP,resize:'vertical',lineHeight:1.6,background:'rgba(96,165,250,0.04)',borderColor:'rgba(96,165,250,0.15)',...ERR('feedback')}}/>
              </div>

              {/* ── ACTION BUTTONS ── */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:4}}>
                <div>
                  {Object.keys(errors).length > 0 && (
                    <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 14px',borderRadius:10,background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.25)'}}>
                      <span style={{fontSize:16}}>⚠</span>
                      <span style={{fontSize:12,fontWeight:700,color:'#F87171'}}>
                        {Object.keys(errors).length} field{Object.keys(errors).length>1?'s':''} missing — please fill all required fields
                      </span>
                    </div>
                  )}
                </div>
                <div style={{display:'flex',gap:10}}>
                  <button onClick={()=>{setShowCreate(false);setForm(BLANK_FORM());setErrors({});}}
                    style={{padding:'11px 22px',borderRadius:12,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#8FA3C4',fontSize:13,fontWeight:600,cursor:'pointer',...F}}>Cancel</button>
                  <button onClick={handleSave} disabled={saving}
                    style={{padding:'11px 28px',borderRadius:12,background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',color:'#FFF',fontSize:13,fontWeight:700,cursor:'pointer',...F,boxShadow:'0 4px 16px rgba(255,107,53,0.3)',opacity:saving?0.6:1,transition:'all .2s'}}>
                    {saving?'Saving…':'Save Evaluation'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}