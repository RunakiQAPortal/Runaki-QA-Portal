import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api';
const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const av = n => { if(!n)return'?'; const w=n.trim().split(' '); return(w[0][0]+(w[1]?w[1][0]:'')).toUpperCase(); };
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];

const INP = { padding:'9px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFF', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box', fontFamily:"'Inter','Segoe UI',sans-serif" };
const SEL = { ...INP, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238FA3C4' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundSize:'12px', paddingRight:32, cursor:'pointer', appearance:'none', WebkitAppearance:'none', backgroundColor:'rgba(255,255,255,0.05)' };
const LBL = { fontSize:11, fontWeight:700, color:'#4A5A78', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 };

const AGENT_DB = {
  'Miran':['Abdullrahman Ali Mahdi','Aran Eimad Qadir','Awdang Saman','Azad Brifkani','Barham Qasim Ahmed','Didar Pirbal','Haryad Shakr Abdulla','Hawrin Amir Ahmed','Kaiwan Pshtiwan Mustafa','Muhammad Ali Osman','Muhammed Abdulbari Majid','Omer Tasim Omer','Rayan Jaafar','Ronar Rasul','Safar Mikeail Ismail','Salih Sangar','Sazgar Hassan','Suzan Sarmad'],
  'Sizar':['Adbulqadir Salam','Ahmed Khafut Xdr','Ali Khalid','Ammar Mamnd Salih','Aya Edris','Bahaa Shamsadeen Sulaiman','Darbin Omer Abubakr','Esra Sabah Salim','Govand Wali','Israa Peshkawt','Muhammed Fairq Hadu','Muhammed Jalal Majid','Mustafa Khudhur Ali','Rasul Najmadeen','Ruya Yaqub','Rzgar Ali Ismail','Safeen Jahfar','Yasser Ameen','Yousif Hussen Bahram'],
  'Brwa':['Ahmed Jasim Rashid','Ahmed Saman','Bawar Fazl Muhammad','Daryan Bakr Kakamand','Dlovan Maraan Ibrahim','Gailan Xalid','Halland Hemn','Haryad Muhsin','Karwan Wali','Lawin Kosrat Saadi','Malik Rashid','Mohammed Soran Hassan','Neamat Anwar Kareem','Salm Khairulla Saeed','Shaida Faizan Kawiz','Sozhin Karim','Zhiya Najmadin'],
  'Mohammed':[],
};
// All agents across all QAs for sessions
const ALL_AGENTS = [
  ...new Set([
    'Abdullrahman Ali Mahdi','Aran Eimad Qadir','Awdang Saman','Azad Brifkani','Barham Qasim Ahmed','Didar Pirbal','Haryad Shakr Abdulla','Hawrin Amir Ahmed','Kaiwan Pshtiwan Mustafa','Muhammad Ali Osman','Muhammed Abdulbari Majid','Omer Tasim Omer','Rayan Jaafar','Ronar Rasul','Safar Mikeail Ismail','Salih Sangar','Sazgar Hassan','Suzan Sarmad',
    'Adbulqadir Salam','Ahmed Khafut Xdr','Ali Khalid','Ammar Mamnd Salih','Aya Edris','Bahaa Shamsadeen Sulaiman','Darbin Omer Abubakr','Esra Sabah Salim','Govand Wali','Israa Peshkawt','Muhammed Fairq Hadu','Muhammed Jalal Majid','Mustafa Khudhur Ali','Rasul Najmadeen','Ruya Yaqub','Rzgar Ali Ismail','Safeen Jahfar','Yasser Ameen','Yousif Hussen Bahram',
    'Ahmed Jasim Rashid','Ahmed Saman','Bawar Fazl Muhammad','Daryan Bakr Kakamand','Dlovan Maraan Ibrahim','Gailan Xalid','Halland Hemn','Haryad Muhsin','Karwan Wali','Lawin Kosrat Saadi','Malik Rashid','Mohammed Soran Hassan','Neamat Anwar Kareem','Salm Khairulla Saeed','Shaida Faizan Kawiz','Sozhin Karim','Zhiya Najmadin',
  ])
].sort();

const DEMO_SESSIONS = [
  { id:1, title:'CRM System Training',       date:'10 Mar 2026', trainer:'Kak Arsalan', duration:'90 min',  status:'Completed',
    attendees:['Demo Agent A','Demo Agent B','Demo Agent C'],
    attendance:{ 'Demo Agent A':'Done', 'Demo Agent B':'Done', 'Demo Agent C':'Pending' } },
  { id:2, title:'Billing Procedures Update', date:'08 Mar 2026', trainer:'Kak Arsalan', duration:'60 min',  status:'Completed',
    attendees:['Demo Agent A','Demo Agent C'],
    attendance:{ 'Demo Agent A':'Done', 'Demo Agent C':'Done' } },
  { id:3, title:'Communication Skills',      date:'15 Mar 2026', trainer:'Kak Arsalan', duration:'120 min', status:'Upcoming',
    attendees:[],
    attendance:{} },
];

const BLANK_FORM = () => ({ title:'', date:'', duration:'', status:'Upcoming', topic:'', trainer:'' });

export default function QASessions({ user }) {
  const qaName   = user?.name || '';
  const myAgents = ALL_AGENTS;

  const [sessions, setSessions]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState('all');
  const [expanded, setExpanded]     = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(BLANK_FORM());
  const [fAttendees, setFAttendees] = useState([]);
  const [saving, setSaving]         = useState(false);
  const [errors, setErrors]         = useState({});

  // attendance state per session: { [sessionId]: { [agentName]: 'Done'|'Pending' } }
  const [attendance, setAttendance] = useState({});

  const load = () => {
    axios.get(`${API}/sessions`)
      .then(r => {
        const d = Array.isArray(r.data) ? r.data : [];
        setSessions(d);
        // init attendance from saved data
        const init = {};
        d.forEach(s => { if (s.attendance) init[s.id] = s.attendance; });
        setAttendance(init);
      })
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const demoMode = sessions.length === 0 && !loading;
  const data     = demoMode ? DEMO_SESSIONS : sessions;

  // getAtt must be defined FIRST before anything uses it
  const getAtt = (s) => {
    if (demoMode) return s.attendance || {};
    return attendance[s.id] || {};
  };

  const getStatus = (s) => {
    const am = getAtt(s);
    const done = myAgents.filter(a => am[a] === 'Done').length;
    if (done === 0) return 'upcoming';
    if (done === myAgents.length) return 'completed';
    return 'in progress';
  };
  const filtered   = tab === 'all' ? data : data.filter(s => getStatus(s) === tab);
  const completed  = data.filter(s => { const am = getAtt(s); return myAgents.length > 0 && myAgents.filter(a=>am[a]==='Done').length === myAgents.length; }).length;
  const upcoming   = data.filter(s => { const am = getAtt(s); return myAgents.filter(a=>am[a]==='Done').length === 0; }).length;

  // Toggle single agent attendance
  const toggleAtt = (sessionId, agentName) => {
    setAttendance(prev => {
      const cur = prev[sessionId] || {};
      const newVal = cur[agentName] === 'Done' ? 'Pending' : 'Done';
      const updated = { ...prev, [sessionId]: { ...cur, [agentName]: newVal } };
      // Save to backend + auto-update status
      if (!demoMode) {
        const allDone = myAgents.every(a => updated[sessionId][a] === 'Done');
        const noneDone = myAgents.every(a => updated[sessionId][a] !== 'Done');
        const autoStatus = allDone ? 'Completed' : noneDone ? 'Upcoming' : 'In Progress';
        axios.patch(`${API}/sessions/${sessionId}`, { attendance: updated[sessionId], status: autoStatus }).catch(()=>{});
      }
      return updated;
    });
  };

  // Mark all done / all pending
  const markAll = (sessionId, attList, val) => {
    setAttendance(prev => {
      const newAtt = {};
      attList.forEach(a => { newAtt[a] = val; });
      const updated = { ...prev, [sessionId]: newAtt };
      if (!demoMode) {
        axios.patch(`${API}/sessions/${sessionId}`, { attendance: newAtt }).catch(()=>{});
      }
      return updated;
    });
  };

  const inp = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:undefined})); };
  const toggleAttendee = name => setFAttendees(p => p.includes(name) ? p.filter(x=>x!==name) : [...p, name]);

  const submit = async () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.date)         e.date  = 'Required';
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    // Auto-populate ALL of this QA's agents with Pending status
    const initAtt = {};
    myAgents.forEach(a => { initAtt[a] = 'Pending'; });
    try {
      const res = await axios.post(`${API}/sessions`, {
        title:       form.title,
        date:        form.date,
        duration:    form.duration,
        status:      form.status,
        topic:       form.topic,
        attendees:   myAgents,
        createdBy:   qaName,
        attendance:  initAtt,
        trainer:     form.trainer || qaName,
      });
      if (res.status === 200 || res.status === 201) {
        setForm(BLANK_FORM()); setErrors({}); setShowForm(false); load();
      }
    } catch(err) {
      alert('Failed to create session: ' + (err?.response?.data?.message || err.message || 'Unknown error'));
    }
    setSaving(false);
  };

  // Auto-derive status from attendance
  const deriveStatus = (s, attList, attMap) => {
    if (!attList || attList.length === 0) return s?.status || 'Upcoming';
    const doneCount = attList.filter(a => attMap[a] === 'Done').length;
    if (doneCount === 0) return 'Upcoming';
    if (doneCount === attList.length) return 'Completed';
    return 'In Progress';
  };

  const sc = s => {
    const v = (s||'').toLowerCase();
    if (v==='completed')   return { bg:'rgba(74,222,128,0.1)',  bd:'rgba(74,222,128,0.25)',  cl:'#4ADE80' };
    if (v==='in progress') return { bg:'rgba(96,165,250,0.1)',  bd:'rgba(96,165,250,0.25)',  cl:'#60A5FA' };
    return                        { bg:'rgba(251,191,36,0.1)',  bd:'rgba(251,191,36,0.25)',  cl:'#FBBF24' };
  };

  return (
    <div style={{ ...F, background:'#0D0F1E', minHeight:'100vh', padding:'28px 32px 60px', color:'#FFF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        select option { background:#131626; color:#fff; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(0.4); }
        .att-tog:hover { opacity:0.85; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:'#34D399', letterSpacing:'2.5px', textTransform:'uppercase', marginBottom:6 }}>QA OFFICER · {qaName}</div>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900 }}>
            Training <span style={{ background:'linear-gradient(90deg,#34D399,#60A5FA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Sessions</span>
          </h1>
          {demoMode && <div style={{ marginTop:8, display:'inline-flex', padding:'4px 12px', borderRadius:20, background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.25)', fontSize:11, fontWeight:700, color:'#34D399' }}>⚡ Demo data</div>}
        </div>
        <button onClick={()=>{ setShowForm(v=>!v); setForm(BLANK_FORM()); setFAttendees([]); setErrors({}); }}
          style={{ padding:'10px 20px', borderRadius:12, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, background:showForm?'rgba(255,255,255,0.07)':'linear-gradient(135deg,#34D399,#60A5FA)', color:'#fff', boxShadow:showForm?'none':'0 4px 14px rgba(52,211,153,0.3)', transition:'all 0.2s', ...F }}>
          {showForm ? '✕  Cancel' : '+ New Session'}
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Sessions', val:data.length,  color:'#60A5FA', sub:'all time' },
          { label:'Completed',      val:completed,     color:'#4ADE80', sub:'sessions done' },
          { label:'Upcoming',       val:upcoming,      color:'#FBBF24', sub:'scheduled' },
        ].map(k => (
          <div key={k.label} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'20px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 18px 18px' }}/>
            <div style={{ position:'absolute', top:-20, right:-20, width:90, height:90, borderRadius:'50%', background:k.color, opacity:0.08, filter:'blur(28px)' }}/>
            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#4A5A78', marginBottom:8 }}>{k.label}</div>
            <div style={{ fontSize:32, fontWeight:800, color:'#FFF', marginBottom:4 }}>{k.val}</div>
            <div style={{ fontSize:11, color:k.color, fontWeight:600 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:16, overflow:'hidden', marginBottom:24 }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(52,211,153,0.05)', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:4, height:18, background:'linear-gradient(180deg,#34D399,#34D39955)', borderRadius:4 }}/>
            <span style={{ fontSize:13, fontWeight:800, color:'#FFF' }}>Create New Session</span>
          </div>
          <div style={{ padding:'20px 24px' }}>

            {/* Title */}
            <div style={{ marginBottom:16 }}>
              <div style={LBL}>Session Title *</div>
              <input value={form.title} onChange={e=>inp('title',e.target.value)} placeholder="e.g. CRM System Training" style={{ ...INP, border:`1.5px solid ${errors.title?'rgba(248,113,113,0.5)':'rgba(255,255,255,0.1)'}` }}/>
              {errors.title && <div style={{ fontSize:11, color:'#F87171', marginTop:4 }}>{errors.title}</div>}
            </div>

            {/* Date / Duration / Status */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:14, marginBottom:16 }}>
              <div>
                <div style={LBL}>Date *</div>
                <input type="date" value={form.date} onChange={e=>inp('date',e.target.value)} style={{ ...INP, colorScheme:'dark', border:`1.5px solid ${errors.date?'rgba(248,113,113,0.5)':'rgba(255,255,255,0.1)'}` }}/>
                {errors.date && <div style={{ fontSize:11, color:'#F87171', marginTop:4 }}>{errors.date}</div>}
              </div>
              <div>
                <div style={LBL}>Trainer</div>
                <input value={form.trainer} onChange={e=>inp('trainer',e.target.value)} placeholder="e.g. Kak Arsalan" style={INP}/>
              </div>
              <div>
                <div style={LBL}>Duration</div>
                <input value={form.duration} onChange={e=>inp('duration',e.target.value)} placeholder="e.g. 60 min" style={INP}/>
              </div>
              <div>
                <div style={LBL}>Status</div>
                <select value={form.status} onChange={e=>inp('status',e.target.value)} style={SEL}>
                  <option value="Upcoming">Upcoming</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Topic */}
            <div style={{ marginBottom:16 }}>
              <div style={LBL}>Topic / Description</div>
              <textarea value={form.topic} onChange={e=>inp('topic',e.target.value)} placeholder="Brief description of what will be covered..." rows={2} style={{ ...INP, resize:'vertical', lineHeight:1.6 }}/>
            </div>

            {/* Info: agents auto-added */}
            {myAgents.length > 0 && (
              <div style={{ padding:'10px 14px', background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:10, marginBottom:20, display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ color:'#34D399', fontSize:13 }}>✓</span>
                <span style={{ fontSize:12, color:'#34D399', fontWeight:600 }}>{myAgents.length} agents (all teams) will be added to this session automatically</span>
              </div>
            )}

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={submit} disabled={saving} style={{ padding:'10px 24px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#34D399,#60A5FA)', color:'#fff', opacity:saving?0.6:1, ...F }}>
                {saving ? 'Saving...' : 'Create Session'}
              </button>
              <button onClick={()=>setShowForm(false)} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontSize:13, fontWeight:600, background:'transparent', color:'#8FA3C4', ...F }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[['all','All'],['upcoming','Upcoming'],['in progress','In Progress'],['completed','Completed']].map(([k,l]) => (
          <button key={k} onClick={()=>setTab(k)} style={{ padding:'8px 18px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, transition:'all 0.15s', background:tab===k?'linear-gradient(135deg,#34D399,#60A5FA)':'rgba(255,255,255,0.04)', color:tab===k?'#fff':'#8FA3C4', boxShadow:tab===k?'0 4px 12px rgba(52,211,153,0.25)':'none', ...F }}>
            {l}
          </button>
        ))}
      </div>

      {/* Session Cards */}
      {loading && <div style={{ textAlign:'center', padding:'40px', color:'#4A5A78' }}>Loading…</div>}
      {!loading && filtered.length===0 && (
        <div style={{ textAlign:'center', padding:'60px', background:'rgba(255,255,255,0.02)', borderRadius:16, border:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize:36, marginBottom:12 }}>📅</div>
          <div style={{ fontSize:14, fontWeight:700, color:'#4A5A78' }}>No sessions found</div>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {filtered.map((s, i) => {
          const attMap  = getAtt(s);
          const derivedStatus = deriveStatus(s, myAgents, attMap);
          const scc     = sc(derivedStatus);
          const isOpen  = expanded === (s.id || i);
          const attList = myAgents.length > 0 ? myAgents : (Array.isArray(s.attendees) ? s.attendees : []);
          const doneCount    = attList.filter(a => attMap[a] === 'Done').length;
          const pendingCount = attList.filter(a => attMap[a] !== 'Done').length;
          const sid = s.id || i;

          return (
            <div key={sid} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${isOpen?'rgba(52,211,153,0.3)':'rgba(255,255,255,0.07)'}`, borderRadius:16, overflow:'hidden', transition:'border-color 0.2s' }}>

              {/* Card Header */}
              <div onClick={()=>setExpanded(isOpen?null:sid)} style={{ padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:'linear-gradient(135deg,rgba(52,211,153,0.15),rgba(96,165,250,0.15))', border:'1px solid rgba(52,211,153,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="3" stroke="#34D399" strokeWidth="1.8"/><line x1="3" y1="9" x2="21" y2="9" stroke="#34D399" strokeWidth="1.8"/><line x1="8" y1="2" x2="8" y2="6" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:'#FFF', marginBottom:4 }}>{s.title || '—'}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
                    <span style={{ fontSize:12, color:'#8FA3C4' }}>📅 {s.date || '—'}</span>
                    {s.trainer && <span style={{ fontSize:12, color:'#8FA3C4' }}>👤 {s.trainer}</span>}
                    {s.duration && <span style={{ fontSize:12, color:'#8FA3C4' }}>⏱ {s.duration}</span>}
                    <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:scc.bg, border:`1px solid ${scc.bd}`, color:scc.cl }}>{derivedStatus}</span>
                    {attList.length > 0 && (
                      <span style={{ fontSize:11, color:'#4A5A78' }}>
                        <span style={{ color:'#4ADE80', fontWeight:700 }}>{doneCount} done</span>
                        {' · '}
                        <span style={{ color:'#FBBF24', fontWeight:700 }}>{pendingCount} pending</span>
                        {' of '}{attList.length}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ fontSize:11, color:'#4A5A78', transform:isOpen?'rotate(180deg)':'none', transition:'transform 0.2s' }}>▼</div>
              </div>

              {/* ── Expanded: Attendance Sheet ── */}
              {isOpen && (
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', background:'rgba(0,0,0,0.15)', padding:'20px 24px' }}>

                  {/* Session meta + trainer */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
                    {[
                      { label:'Trainer',  val: s.trainer  || '—' },
                      { label:'Date',     val: s.date     || '—' },
                      { label:'Duration', val: s.duration || '—' },
                      { label:'Status',   val: derivedStatus },
                    ].map(f => (
                      <div key={f.label} style={{ padding:'10px 14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:'#4A5A78', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:4 }}>{f.label}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:'#C8D8EC' }}>{f.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Topic */}
                  {s.topic && (
                    <div style={{ padding:'10px 14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, marginBottom:20, fontSize:13, color:'#C8D8EC', lineHeight:1.6 }}>
                      {s.topic}
                    </div>
                  )}

                  {/* Attendance Sheet */}
                  {attList.length > 0 ? (
                    <div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#34D399', textTransform:'uppercase' }}>
                          ATTENDANCE SHEET — {doneCount}/{attList.length} done
                        </div>
                        <div style={{ display:'flex', gap:8 }}>
                          <button onClick={()=>markAll(sid, attList, 'Done')} style={{ padding:'4px 12px', borderRadius:8, border:'1px solid rgba(74,222,128,0.3)', cursor:'pointer', fontSize:11, fontWeight:700, background:'rgba(74,222,128,0.08)', color:'#4ADE80', ...F }}>✓ Mark All Done</button>
                          <button onClick={()=>markAll(sid, attList, 'Pending')} style={{ padding:'4px 12px', borderRadius:8, border:'1px solid rgba(251,191,36,0.3)', cursor:'pointer', fontSize:11, fontWeight:700, background:'rgba(251,191,36,0.08)', color:'#FBBF24', ...F }}>Reset All</button>
                        </div>
                      </div>

                      {/* Agent list */}
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
                        {attList.map((a, j) => {
                          const isDone = attMap[a] === 'Done';
                          return (
                            <div key={j} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:12, background: isDone ? 'rgba(74,222,128,0.06)' : 'rgba(251,191,36,0.05)', border:`1px solid ${isDone ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.15)'}`, transition:'all 0.15s' }}>
                              {/* Agent info */}
                              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <div style={{ width:30, height:30, borderRadius:8, background:`${ac(a)}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:ac(a), flexShrink:0 }}>{av(a)}</div>
                                <span style={{ fontSize:13, fontWeight:600, color:'#FFF' }}>{a}</span>
                              </div>
                              {/* Toggle button */}
                              <button
                                className="att-tog"
                                onClick={()=>!demoMode && toggleAtt(sid, a)}
                                title={demoMode ? 'Demo mode' : 'Click to toggle'}
                                style={{ padding:'5px 14px', borderRadius:8, border:'none', cursor:demoMode?'default':'pointer', fontSize:11, fontWeight:800, transition:'all 0.15s', ...F,
                                  background: isDone ? 'rgba(74,222,128,0.2)'  : 'rgba(251,191,36,0.15)',
                                  color:      isDone ? '#4ADE80'                : '#FBBF24',
                                }}
                              >
                                {isDone ? '✓ Done' : '⏳ Pending'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding:'20px', textAlign:'center', color:'#4A5A78', fontSize:13, background:'rgba(255,255,255,0.02)', borderRadius:10, border:'1px solid rgba(255,255,255,0.05)' }}>
                      {myAgents.length > 0 ? 'Open after creating a session to see the attendance sheet' : 'No agents assigned to your account'}
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