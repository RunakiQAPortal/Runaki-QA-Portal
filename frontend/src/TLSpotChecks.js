import React, { useState } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const av = n => n?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?';

const TYPES = ['Communication','INDRA Calculator','Hold-Unhold','New Levels','HungUp Audit'];
const TYPE_COLORS = {
  'Communication':'#60A5FA','INDRA Calculator':'#A78BFA',
  'Hold-Unhold':'#FBBF24','New Levels':'#34D399','HungUp Audit':'#F87171',
};
const QAS = ['Miran','Sizar','Brwa','Mohammed'];

// Full agent DB — coordinator auto-fills from here
const AGENT_DB = {
  'Abdullrahman Ali Mahdi':   { queue:'Sorani', coordinator:'Miran' },
  'Aran Eimad Qadir':         { queue:'Sorani', coordinator:'Miran' },
  'Awdang Saman':             { queue:'Sorani', coordinator:'Miran' },
  'Azad Brifkani':            { queue:'Sorani', coordinator:'Miran' },
  'Barham Qasim Ahmed':       { queue:'Arabic', coordinator:'Miran' },
  'Didar Pirbal':             { queue:'Badini', coordinator:'Miran' },
  'Haryad Shakr Abdulla':     { queue:'Sorani', coordinator:'Miran' },
  'Hawrin Amir Ahmed':        { queue:'Arabic', coordinator:'Miran' },
  'Kaiwan Pshtiwan Mustafa':  { queue:'Sorani', coordinator:'Miran' },
  'Muhammad Ali Osman':       { queue:'Badini', coordinator:'Miran' },
  'Muhammed Abdulbari Majid': { queue:'Arabic', coordinator:'Miran' },
  'Omer Tasim Omer':          { queue:'Sorani', coordinator:'Miran' },
  'Rayan Jaafar':             { queue:'Sorani', coordinator:'Miran' },
  'Ronar Rasul':              { queue:'Sorani', coordinator:'Miran' },
  'Safar Mikeail Ismail':     { queue:'Badini', coordinator:'Miran' },
  'Salih Sangar':             { queue:'Arabic', coordinator:'Miran' },
  'Sazgar Hassan':            { queue:'Sorani', coordinator:'Miran' },
  'Suzan Sarmad':             { queue:'Sorani', coordinator:'Miran' },
  'Abdulqadir Salam':         { queue:'Arabic', coordinator:'Sizar' },
  'Ahmed Khafut Xdr':         { queue:'Arabic', coordinator:'Sizar' },
  'Ali Khalid':               { queue:'Sorani', coordinator:'Sizar' },
  'Ammar Mamnd Salih':        { queue:'Sorani', coordinator:'Sizar' },
  'Aya Edris':                { queue:'Arabic', coordinator:'Sizar' },
  'Bahaa Shamsadeen Sulaiman':{ queue:'Arabic', coordinator:'Sizar' },
  'Darbin Omer Abubakr':      { queue:'Sorani', coordinator:'Sizar' },
  'Esra Sabah Salim':         { queue:'Arabic', coordinator:'Sizar' },
  'Govand Wali':              { queue:'Sorani', coordinator:'Sizar' },
  'Israa Peshkawt':           { queue:'Arabic', coordinator:'Sizar' },
  'Muhammed Fairq Hadu':      { queue:'Sorani', coordinator:'Sizar' },
  'Muhammed Jalal Majid':     { queue:'Arabic', coordinator:'Sizar' },
  'Mustafa Khudhur Ali':      { queue:'Sorani', coordinator:'Sizar' },
  'Rasul Najmadeen':          { queue:'Sorani', coordinator:'Sizar' },
  'Safeen Jahfar':            { queue:'Sorani', coordinator:'Sizar' },
  'Yasser Ameen':             { queue:'Arabic', coordinator:'Sizar' },
  'Ahmed Jasim Rashid':       { queue:'Sorani', coordinator:'Brwa'  },
  'Ahmed Saman':              { queue:'Sorani', coordinator:'Brwa'  },
  'Bawar Fazl Muhammad':      { queue:'Badini', coordinator:'Brwa'  },
  'Daryan Bakr Kakamand':     { queue:'Sorani', coordinator:'Brwa'  },
  'Dlovan Maraan Ibrahim':    { queue:'Badini', coordinator:'Brwa'  },
  'Gailan Xalid':             { queue:'Sorani', coordinator:'Brwa'  },
  'Halland Hemn':             { queue:'Arabic', coordinator:'Brwa'  },
  'Haryad Muhsin':            { queue:'Sorani', coordinator:'Brwa'  },
  'Karwan Wali':              { queue:'Sorani', coordinator:'Brwa'  },
  'Lawin Kosrat Saadi':       { queue:'Sorani', coordinator:'Brwa'  },
  'Malik Rashid':             { queue:'Arabic', coordinator:'Brwa'  },
  'Mohammed Soran Hassan':    { queue:'Badini', coordinator:'Brwa'  },
  'Neamat Anwar Kareem':      { queue:'Sorani', coordinator:'Brwa'  },
  'Salm Khairulla Saeed':     { queue:'Sorani', coordinator:'Brwa'  },
  'Shaida Faizan Kawiz':      { queue:'Arabic', coordinator:'Brwa'  },
  'Sozhin Karim':             { queue:'Sorani', coordinator:'Brwa'  },
  'Zhiya Najmadin':           { queue:'Sorani', coordinator:'Brwa'  },
};

const ALL_AGENTS = Object.keys(AGENT_DB).sort();

// Returns agent list based on role
// TL → all agents | QA Officer → only their assigned agents
const getAgentList = (user) => {
  if (!user) return ALL_AGENTS;
  if (user.role === 'teamlead') return ALL_AGENTS;
  // QA Officer: only agents where coordinator === their name
  return ALL_AGENTS.filter(a => AGENT_DB[a]?.coordinator === user.name);
};

const DEMO = [
  { id:1, date:'2026-03-11', agent:'Govand Wali',       callerNum:'0750-123-4567', qa:'Sizar', coordinator:'Sizar', type:'Communication',   result:'Pass', note:'Good tone and empathy throughout the call.' },
  { id:2, date:'2026-03-11', agent:'Halland Hemn',       callerNum:'0770-987-6543', qa:'Brwa',  coordinator:'Brwa',  type:'Hold-Unhold',      result:'Fail', note:'Agent placed caller on hold without informing them.' },
  { id:3, date:'2026-03-10', agent:'Aya Edris',          callerNum:'0750-321-0987', qa:'Sizar', coordinator:'Sizar', type:'INDRA Calculator', result:'Pass', note:'All calculations were accurate and quick.' },
  { id:4, date:'2026-03-10', agent:'Rayan Jaafar',       callerNum:'0771-456-7890', qa:'Miran', coordinator:'Miran', type:'HungUp Audit',     result:'Fail', note:'Call dropped before issue was fully resolved.' },
  { id:5, date:'2026-03-09', agent:'Barham Qasim Ahmed', callerNum:'0750-654-3210', qa:'Miran', coordinator:'Miran', type:'New Levels',        result:'Pass', note:'Escalation handled correctly per procedure.' },
  { id:6, date:'2026-03-09', agent:'Ali Khalid',         callerNum:'0770-111-2222', qa:'Sizar', coordinator:'Sizar', type:'Communication',   result:'Pass', note:'Professional tone, handled complaint well.' },
  { id:7, date:'2026-03-08', agent:'Halland Hemn',       callerNum:'0750-888-9999', qa:'Brwa',  coordinator:'Brwa',  type:'Hold-Unhold',      result:'Fail', note:'Hold procedure not announced, hold music missing.' },
  { id:8, date:'2026-03-07', agent:'Lawin Kosrat Saadi', callerNum:'0771-333-4444', qa:'Brwa',  coordinator:'Brwa',  type:'INDRA Calculator', result:'Pass', note:'Correct calculation on high bill query.' },
];

const BLANK = (user) => ({
  date:        new Date().toISOString().split('T')[0],
  agent:       '',
  callerNum:   '',
  qa:          user?.name || 'Miran',
  coordinator: '',
  type:        'Communication',
  result:      'Pass',
  note:        '',
});

export default function TLSpotChecks({ user }) {
  const [checks, setChecks]             = useState(DEMO);
  const [filterQA, setFilterQA]         = useState('All');
  const [filterType, setFilterType]     = useState('All');
  const [filterResult, setFilterResult] = useState('All');
  const [expanded, setExpanded]         = useState(null);
  const [showCreate, setShowCreate]     = useState(false);
  const [form, setForm]                 = useState(BLANK(user));
  const [errors, setErrors]             = useState({});

  const agentList = getAgentList(user);

  const inp = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  // When agent changes → auto-fill coordinator
  const pickAgent = (name) => {
    const info = AGENT_DB[name] || { coordinator: '' };
    setForm(f => ({ ...f, agent: name, coordinator: info.coordinator }));
    setErrors(e => ({ ...e, agent: undefined }));
  };

  const ERR = k => errors[k]
    ? { border:'1px solid rgba(248,113,113,0.7)', boxShadow:'0 0 0 3px rgba(248,113,113,0.1)' }
    : {};

  const filtered = checks.filter(c => {
    if (filterQA     !== 'All' && c.qa     !== filterQA)     return false;
    if (filterType   !== 'All' && c.type   !== filterType)   return false;
    if (filterResult !== 'All' && c.result !== filterResult) return false;
    return true;
  });

  const passCount = filtered.filter(c => c.result === 'Pass').length;
  const failCount = filtered.filter(c => c.result === 'Fail').length;
  const passRate  = filtered.length ? Math.round(passCount / filtered.length * 100) : 0;

  const handleSave = async () => {
    const e = {};
    if (!form.agent)          e.agent     = true;
    if (!form.callerNum.trim()) e.callerNum = true;
    if (Object.keys(e).length) { setErrors(e); return; }
    const body = { ...form };
    try {
      await fetch('http://localhost:8080/api/spot-checks', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
    } catch {}
    setChecks(c => [{ id: Date.now(), ...body }, ...c]);
    setShowCreate(false);
    setForm(BLANK(user));
    setErrors({});
  };

  const exportCSV = () => {
    const rows = [
      ['Date','Agent','Caller Number','QA Officer','Coordinator','Type','Result','Notes'],
      ...filtered.map(c => [c.date, c.agent, c.callerNum, c.qa, c.coordinator, c.type, c.result, c.note]),
    ];
    const csv = rows.map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'spot-checks.csv'; a.click();
  };

  const INP = { width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 14px', fontSize:13, outline:'none', boxSizing:'border-box', ...F };
  const SEL = { ...INP, cursor:'pointer' };
  const RO  = { ...INP, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', color:'#8FA3C4', cursor:'default' };

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`
        select option { background:#131626!important; color:#FFF!important; }
        select { color-scheme:dark; }
        .sc-row:hover { background:rgba(255,255,255,0.04)!important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#60A5FA', marginBottom:5 }}>QA TEAM LEAD</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:'#FFF' }}>
            Spot <span style={{ background:'linear-gradient(90deg,#60A5FA,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Checks</span>
          </h1>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={exportCSV} style={{ padding:'10px 18px', borderRadius:12, background:'rgba(96,165,250,0.12)', border:'1px solid rgba(96,165,250,0.3)', color:'#60A5FA', fontSize:13, fontWeight:700, cursor:'pointer', ...F }}>↓ Export CSV</button>
            <button onClick={() => { setShowCreate(true); setForm(BLANK(user)); setErrors({}); }} style={{ padding:'10px 20px', borderRadius:12, background:'linear-gradient(135deg,#60A5FA,#3B82F6)', border:'none', color:'#FFF', fontSize:13, fontWeight:700, cursor:'pointer', ...F }}>+ Log Spot Check</button>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Checks', value:filtered.length, color:'#60A5FA', sub:'this period' },
          { label:'Pass',         value:passCount,        color:'#4ADE80', sub:'calls passed' },
          { label:'Fail',         value:failCount,        color:'#F87171', sub:'need attention' },
          { label:'Pass Rate',    value:`${passRate}%`,   color:passRate>=75?'#4ADE80':'#FBBF24', sub:passRate>=75?'on target':'needs improvement' },
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

      {/* ── Filters ── */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <select value={filterQA} onChange={e => setFilterQA(e.target.value)} style={{ ...SEL, width:'auto' }}>
          {['All','Miran','Sizar','Brwa','Mohammed'].map(q => <option key={q} value={q}>{q==='All'?'All QA Officers':q}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...SEL, width:'auto' }}>
          <option value="All">All Types</option>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filterResult} onChange={e => setFilterResult(e.target.value)} style={{ ...SEL, width:'auto' }}>
          <option value="All">All Results</option>
          <option value="Pass">Pass</option>
          <option value="Fail">Fail</option>
        </select>
        <div style={{ padding:'9px 14px', borderRadius:10, background:'rgba(255,255,255,0.04)', fontSize:13, color:'#8FA3C4', border:'1px solid rgba(255,255,255,0.08)', marginLeft:'auto' }}>
          {filtered.length} records
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'100px 1fr 130px 90px 110px 160px 82px 44px', padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)', alignItems:'center' }}>
          {['Date','Agent','Caller #','QA Officer','Coordinator','Type','Result',''].map((h,i) => (
            <div key={i} style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', color:'#4A5A78', textTransform:'uppercase', textAlign:i===7?'center':'left' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding:'48px', textAlign:'center', color:'#4A5A78', fontSize:14 }}>No records found</div>
        )}

        {filtered.map(c => (
          <React.Fragment key={c.id}>
            <div
              className="sc-row"
              onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              style={{ display:'grid', gridTemplateColumns:'100px 1fr 130px 90px 110px 160px 82px 44px', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:'transparent', transition:'background 0.15s', cursor:'pointer', alignItems:'center' }}
            >
              <span style={{ fontSize:12, color:'#4A5A78' }}>{c.date}</span>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:`${ac(c.agent)}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:ac(c.agent), flexShrink:0 }}>{av(c.agent)}</div>
                <span style={{ fontSize:13, fontWeight:600, color:'#FFF' }}>{c.agent}</span>
              </div>
              <span style={{ fontSize:12, color:'#8FA3C4', fontFamily:'monospace', letterSpacing:'0.3px' }}>{c.callerNum}</span>
              <span style={{ fontSize:12, color:'#C8D8EC', fontWeight:600 }}>{c.qa}</span>
              <span style={{ fontSize:12, color:'#8FA3C4' }}>{c.coordinator}</span>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:TYPE_COLORS[c.type]||'#8FA3C4', flexShrink:0, boxShadow:`0 0 6px ${TYPE_COLORS[c.type]||'#8FA3C4'}` }}/>
                <span style={{ fontSize:12, color:'#C8D8EC' }}>{c.type}</span>
              </div>
              <span style={{ padding:'4px 0', borderRadius:20, fontSize:11, fontWeight:700, background:c.result==='Pass'?'rgba(74,222,128,0.12)':'rgba(248,113,113,0.12)', color:c.result==='Pass'?'#4ADE80':'#F87171', display:'block', textAlign:'center' }}>
                {c.result==='Pass'?'✓ Pass':'✗ Fail'}
              </span>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', color:'#4A5A78', fontSize:13 }}>
                {expanded===c.id?'▲':'▼'}
              </div>
            </div>

            {expanded===c.id && (
              <div style={{ padding:'14px 20px 16px', paddingLeft:76, borderBottom:'1px solid rgba(255,255,255,0.04)', background:'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', color:'#4A5A78', textTransform:'uppercase', marginBottom:6 }}>Notes</div>
                <div style={{ fontSize:13, color:'#C8D8EC', lineHeight:1.6 }}>{c.note || '—'}</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Modal ── */}
      {showCreate && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:24 }}>
          <div style={{ background:'#131626', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24, width:'100%', maxWidth:560, padding:'32px', ...F, maxHeight:'90vh', overflowY:'auto' }}>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:'#FFF' }}>Log Spot Check</h2>
              <button onClick={() => setShowCreate(false)} style={{ background:'none', border:'none', color:'#8FA3C4', fontSize:22, cursor:'pointer' }}>✕</button>
            </div>

            {/* Date + Type */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.8px' }}>Date</div>
                <input type="date" value={form.date} onChange={e => inp('date', e.target.value)} style={INP}/>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.8px' }}>Check Type</div>
                <select value={form.type} onChange={e => inp('type', e.target.value)} style={SEL}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Agent (dropdown) + Caller # */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.8px' }}>
                  Agent Name
                  {user?.role === 'teamlead' && <span style={{ marginLeft:6, fontSize:10, color:'#4A5A78', fontWeight:400, textTransform:'none', letterSpacing:0 }}>({agentList.length} agents)</span>}
                </div>
                <select value={form.agent} onChange={e => pickAgent(e.target.value)} style={{ ...SEL, ...ERR('agent') }}>
                  <option value="">Select agent...</option>
                  {agentList.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.8px' }}>Caller Number</div>
                <input type="text" value={form.callerNum} onChange={e => inp('callerNum', e.target.value)} placeholder="e.g. 0750-123-4567" style={{ ...INP, ...ERR('callerNum'), fontFamily:'monospace' }}/>
              </div>
            </div>

            {/* QA Officer + Coordinator (auto) */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.8px' }}>QA Officer</div>
                <select value={form.qa} onChange={e => inp('qa', e.target.value)} style={SEL}>
                  {QAS.map(q => <option key={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.8px' }}>
                  Coordinator
                  <span style={{ marginLeft:6, fontSize:10, color:'#4ADE80', fontWeight:600, textTransform:'none', letterSpacing:0 }}>auto</span>
                </div>
                <div style={{ ...RO, display:'flex', alignItems:'center' }}>
                  {form.coordinator || <span style={{ color:'#2E3A55' }}>Select agent first</span>}
                </div>
              </div>
            </div>

            {/* Result Toggle */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.8px' }}>Result</div>
              <div style={{ display:'flex', gap:10 }}>
                {['Pass','Fail'].map(r => {
                  const active = form.result === r;
                  const clr    = r==='Pass' ? '#4ADE80' : '#F87171';
                  return (
                    <button key={r} onClick={() => inp('result', r)} style={{ flex:1, padding:'12px', borderRadius:12, border:`1px solid ${active ? clr+'60' : 'rgba(255,255,255,0.1)'}`, background:active ? `${clr}18` : 'rgba(255,255,255,0.04)', color:active ? clr : '#4A5A78', fontSize:14, fontWeight:800, cursor:'pointer', transition:'all 0.15s', ...F }}>
                      {r==='Pass' ? '✓ Pass' : '✗ Fail'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.8px' }}>Notes</div>
              <textarea value={form.note} onChange={e => inp('note', e.target.value)} rows={3} placeholder="Describe what was observed during this spot check..." style={{ ...INP, resize:'vertical' }}/>
            </div>

            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button onClick={() => setShowCreate(false)} style={{ padding:'11px 22px', borderRadius:12, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#8FA3C4', fontSize:13, fontWeight:600, cursor:'pointer', ...F }}>Cancel</button>
              <button onClick={handleSave} style={{ padding:'11px 28px', borderRadius:12, background:'linear-gradient(135deg,#60A5FA,#3B82F6)', border:'none', color:'#FFF', fontSize:13, fontWeight:700, cursor:'pointer', ...F }}>Save Spot Check</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}