import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api';
const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const av = n => { if(!n)return'?'; const w=n.trim().split(' '); return(w[0][0]+(w[1]?w[1][0]:'')).toUpperCase(); };
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];

const SPOT_TYPES = ['Communication','INDRA Calculator','Hold-Unhold','New Levels','HungUp Audit'];
const TYPE_COLORS = {
  'Communication':'#60A5FA','INDRA Calculator':'#A78BFA',
  'Hold-Unhold':'#FBBF24','New Levels':'#34D399','HungUp Audit':'#F87171',
};

// Agent DB with coordinator
const AGENT_DB = {
  'Miran': [
    {name:'Abdullrahman Ali Mahdi', coordinator:'Miran'},
    {name:'Aran Eimad Qadir',       coordinator:'Miran'},
    {name:'Awdang Saman',           coordinator:'Miran'},
    {name:'Azad Brifkani',          coordinator:'Miran'},
    {name:'Barham Qasim Ahmed',     coordinator:'Miran'},
    {name:'Didar Pirbal',           coordinator:'Miran'},
    {name:'Haryad Shakr Abdulla',   coordinator:'Miran'},
    {name:'Hawrin Amir Ahmed',      coordinator:'Miran'},
    {name:'Kaiwan Pshtiwan Mustafa',coordinator:'Miran'},
    {name:'Muhammad Ali Osman',     coordinator:'Miran'},
    {name:'Muhammed Abdulbari Majid',coordinator:'Miran'},
    {name:'Omer Tasim Omer',        coordinator:'Miran'},
    {name:'Rayan Jaafar',           coordinator:'Miran'},
    {name:'Ronar Rasul',            coordinator:'Miran'},
    {name:'Safar Mikeail Ismail',   coordinator:'Miran'},
    {name:'Salih Sangar',           coordinator:'Miran'},
    {name:'Sazgar Hassan',          coordinator:'Miran'},
    {name:'Suzan Sarmad',           coordinator:'Miran'},
  ],
  'Sizar': [
    {name:'Adbulqadir Salam',          coordinator:'Sizar'},
    {name:'Ahmed Khafut Xdr',          coordinator:'Sizar'},
    {name:'Ali Khalid',                coordinator:'Sizar'},
    {name:'Ammar Mamnd Salih',         coordinator:'Sizar'},
    {name:'Aya Edris',                 coordinator:'Sizar'},
    {name:'Bahaa Shamsadeen Sulaiman', coordinator:'Sizar'},
    {name:'Darbin Omer Abubakr',       coordinator:'Sizar'},
    {name:'Esra Sabah Salim',          coordinator:'Sizar'},
    {name:'Govand Wali',               coordinator:'Sizar'},
    {name:'Israa Peshkawt',            coordinator:'Sizar'},
    {name:'Muhammed Fairq Hadu',       coordinator:'Sizar'},
    {name:'Muhammed Jalal Majid',      coordinator:'Sizar'},
    {name:'Mustafa Khudhur Ali',       coordinator:'Sizar'},
    {name:'Rasul Najmadeen',           coordinator:'Sizar'},
    {name:'Ruya Yaqub',                coordinator:'Sizar'},
    {name:'Rzgar Ali Ismail',          coordinator:'Sizar'},
    {name:'Safeen Jahfar',             coordinator:'Sizar'},
    {name:'Yasser Ameen',              coordinator:'Sizar'},
    {name:'Yousif Hussen Bahram',      coordinator:'Sizar'},
  ],
  'Brwa': [
    {name:'Ahmed Jasim Rashid',   coordinator:'Brwa'},
    {name:'Ahmed Saman',          coordinator:'Brwa'},
    {name:'Bawar Fazl Muhammad',  coordinator:'Brwa'},
    {name:'Daryan Bakr Kakamand', coordinator:'Brwa'},
    {name:'Dlovan Maraan Ibrahim',coordinator:'Brwa'},
    {name:'Gailan Xalid',         coordinator:'Brwa'},
    {name:'Halland Hemn',         coordinator:'Brwa'},
    {name:'Haryad Muhsin',        coordinator:'Brwa'},
    {name:'Karwan Wali',          coordinator:'Brwa'},
    {name:'Lawin Kosrat Saadi',   coordinator:'Brwa'},
    {name:'Malik Rashid',         coordinator:'Brwa'},
    {name:'Mohammed Soran Hassan',coordinator:'Brwa'},
    {name:'Neamat Anwar Kareem',  coordinator:'Brwa'},
    {name:'Salm Khairulla Saeed', coordinator:'Brwa'},
    {name:'Shaida Faizan Kawiz',  coordinator:'Brwa'},
    {name:'Sozhin Karim',         coordinator:'Brwa'},
    {name:'Zhiya Najmadin',       coordinator:'Brwa'},
  ],
  'Mohammed': [],
};

const DEMO_DATA = [
  { id:1, agentName:'Demo Agent A', callerNum:'0750-111-2233', coordinator:'Miran', type:'Communication',   date:'10 Mar 2026', result:'Correct',   notes:'Agent communicated clearly and professionally' },
  { id:2, agentName:'Demo Agent B', callerNum:'0770-444-5566', coordinator:'Sizar', type:'HungUp Audit',    date:'09 Mar 2026', result:'Incorrect', notes:'Agent disconnected without resolution' },
  { id:3, agentName:'Demo Agent C', callerNum:'0750-777-8899', coordinator:'Brwa',  type:'Hold-Unhold',     date:'08 Mar 2026', result:'Correct',   notes:'Proper hold procedure followed' },
  { id:4, agentName:'Demo Agent A', callerNum:'0771-222-3344', coordinator:'Miran', type:'New Levels',      date:'07 Mar 2026', result:'Incorrect', notes:'Wrong level selected in CRM' },
];

// All agents across all QAs
const ALL_AGENTS_SC = [
  'Abdullrahman Ali Mahdi','Aran Eimad Qadir','Awdang Saman','Azad Brifkani','Barham Qasim Ahmed','Didar Pirbal','Haryad Shakr Abdulla','Hawrin Amir Ahmed','Kaiwan Pshtiwan Mustafa','Muhammad Ali Osman','Muhammed Abdulbari Majid','Omer Tasim Omer','Rayan Jaafar','Ronar Rasul','Safar Mikeail Ismail','Salih Sangar','Sazgar Hassan','Suzan Sarmad',
  'Adbulqadir Salam','Ahmed Khafut Xdr','Ali Khalid','Ammar Mamnd Salih','Aya Edris','Bahaa Shamsadeen Sulaiman','Darbin Omer Abubakr','Esra Sabah Salim','Govand Wali','Israa Peshkawt','Muhammed Fairq Hadu','Muhammed Jalal Majid','Mustafa Khudhur Ali','Rasul Najmadeen','Ruya Yaqub','Rzgar Ali Ismail','Safeen Jahfar','Yasser Ameen','Yousif Hussen Bahram',
  'Ahmed Jasim Rashid','Ahmed Saman','Bawar Fazl Muhammad','Daryan Bakr Kakamand','Dlovan Maraan Ibrahim','Gailan Xalid','Halland Hemn','Haryad Muhsin','Karwan Wali','Lawin Kosrat Saadi','Malik Rashid','Mohammed Soran Hassan','Neamat Anwar Kareem','Salm Khairulla Saeed','Shaida Faizan Kawiz','Sozhin Karim','Zhiya Najmadin',
].sort();

// Coordinator lookup from AGENT_DB for auto-fill
const COORD_LOOKUP = {};
Object.entries(AGENT_DB).forEach(([qa, agents]) => {
  agents.forEach(a => { COORD_LOOKUP[a.name] = a.coordinator; });
});

const BLANK = () => ({ agentName:'', coordinator:'', callerNum:'', type:'Communication', date:new Date().toISOString().split('T')[0], result:'Pass', notes:'' });

export default function QASpotChecks({ user }) {
  const qaName   = user?.name || '';
  const myAgents = (AGENT_DB[qaName] || []).slice().sort((a,b)=>a.name.localeCompare(b.name));

  const [checks, setChecks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(BLANK());
  const [saving, setSaving]     = useState(false);
  const [errors, setErrors]     = useState({});

  const load = () => {
    // Load local first
    try {
      const local = JSON.parse(localStorage.getItem('spot_checks') || '[]')
        .filter(c => (c.qaOfficer||'').toLowerCase() === qaName.toLowerCase());
      if (local.length > 0) setChecks(local);
    } catch {}
    // Try API
    axios.get(`${API}/spot-checks`)
      .then(r => {
        const api = (Array.isArray(r.data)?r.data:[]).filter(c=>(c.qaOfficer||'').toLowerCase()===qaName.toLowerCase());
        if (api.length > 0) setChecks(api);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, [qaName]);

  const isDemo = checks.length === 0 && !loading && !localStorage.getItem('spot_checks');
  const data   = isDemo ? DEMO_DATA : checks;

  // KPI calculations
  const totalChecks  = data.length;
  const passCount    = data.filter(c => (c.result||'').toLowerCase().includes('pass') || (c.result||'').toLowerCase()==='correct').length;
  const failCount    = data.filter(c => (c.result||'').toLowerCase().includes('fail') || (c.result||'').toLowerCase()==='incorrect').length;
  const passRate     = totalChecks ? Math.round(passCount / totalChecks * 100) : 0;

  // Agent autocomplete
  const inp = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:undefined})); };
  const ERR = k => errors[k] ? { border:'1.5px solid rgba(248,113,113,0.7)', boxShadow:'0 0 0 3px rgba(248,113,113,0.1)' } : {};

  const submit = async () => {
    const e = {};
    if (!form.agentName) e.agentName = true;
    if (!form.callerNum.trim()) e.callerNum = true;
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    const newCheck = { id: Date.now(), ...form, qaOfficer: qaName };
    // Save locally
    try {
      const existing = JSON.parse(localStorage.getItem('spot_checks') || '[]');
      existing.unshift(newCheck);
      localStorage.setItem('spot_checks', JSON.stringify(existing));
    } catch {}
    // Update UI immediately — force out of demo mode
    setChecks(prev => [newCheck, ...prev]);
    setLoading(false);
    setShowForm(false);
    setForm(BLANK());
    setSaving(false);
    // Try API silently
    axios.post(`${API}/spot-checks`, newCheck).catch(() => {});
  };

  const INP = { padding:'9px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFF', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box', ...F };
  const SEL = { ...INP, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238FA3C4' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundSize:'12px', paddingRight:32, cursor:'pointer', appearance:'none', WebkitAppearance:'none', backgroundColor:'rgba(255,255,255,0.05)' };
  const RO  = { ...INP, background:'rgba(255,255,255,0.02)', border:'1.5px solid rgba(255,255,255,0.06)', color:'#8FA3C4', cursor:'default' };
  const LBL = { fontSize:11, fontWeight:700, color:'#C8D8EC', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:7 };

  return (
    <div style={{ ...F, background:'#0D0F1E', minHeight:'100vh', padding:'28px 32px 60px', color:'#FFF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        select option { background:#131626; color:#fff; }
        .sc-row:hover { background:rgba(255,255,255,0.025)!important; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:'#60A5FA', letterSpacing:'2.5px', textTransform:'uppercase', marginBottom:6 }}>QA OFFICER · {qaName}</div>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900 }}>
            Spot <span style={{ background:'linear-gradient(90deg,#60A5FA,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Checks</span>
          </h1>
          <p style={{ margin:'6px 0 0', fontSize:13, color:'#4A5A78' }}>{data.length} checks logged</p>
          {isDemo && <div style={{ marginTop:8, display:'inline-flex', padding:'4px 12px', borderRadius:20, background:'rgba(96,165,250,0.1)', border:'1px solid rgba(96,165,250,0.25)', fontSize:11, fontWeight:700, color:'#60A5FA' }}>⚡ Demo data</div>}
        </div>
        <button onClick={()=>{ setShowForm(!showForm); setForm(BLANK());  }} style={{ padding:'10px 20px', borderRadius:12, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#60A5FA,#3B82F6)', color:'#fff', boxShadow:'0 4px 14px rgba(96,165,250,0.3)', ...F }}>
          + New Spot Check
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Checks',  value:totalChecks, color:'#60A5FA', sub:'this period' },
          { label:'Pass',          value:passCount,   color:'#4ADE80', sub:'calls passed' },
          { label:'Fail',          value:failCount,   color:'#F87171', sub:'need attention' },
          { label:'Pass Rate',     value:`${passRate}%`, color:passRate>=75?'#4ADE80':'#FBBF24', sub:passRate>=75?'on target':'needs improvement' },
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

      {/* Log Form */}
      {showForm && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:16, padding:'20px 24px 24px', marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:800, color:'#FFF', marginBottom:18 }}>Log New Spot Check</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:14 }}>

            {/* Agent — dropdown all agents */}
            <div>
              <div style={LBL}>Agent Name *</div>
              <select
                value={form.agentName}
                onChange={e => {
                  const name = e.target.value;
                  const coord = COORD_LOOKUP[name] || '';
                  setForm(f => ({ ...f, agentName: name, coordinator: coord }));
                  setErrors(err => ({ ...err, agentName: undefined }));
                }}
                style={{ ...SEL, ...ERR('agentName') }}
              >
                <option value="">— Select agent —</option>
                {ALL_AGENTS_SC.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Coordinator — auto */}
            <div>
              <div style={LBL}>Coordinator <span style={{ color:'#4ADE80', fontWeight:600, textTransform:'none', letterSpacing:0, fontSize:10 }}>auto</span></div>
              <div style={{ ...RO, display:'flex', alignItems:'center', height:40 }}>
                {form.coordinator || <span style={{ color:'#2E3A55' }}>Auto from agent</span>}
              </div>
            </div>

            {/* Caller Number */}
            <div>
              <div style={LBL}>Caller Number *</div>
              <input value={form.callerNum} onChange={e=>inp('callerNum',e.target.value)} placeholder="e.g. 0750-123-4567" style={{ ...INP, ...ERR('callerNum'), fontFamily:'monospace' }}/>
            </div>

            {/* Type */}
            <div>
              <div style={LBL}>Check Type</div>
              <select value={form.type} onChange={e=>inp('type',e.target.value)} style={SEL}>
                {SPOT_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Date */}
            <div>
              <div style={LBL}>Date</div>
              <input type="date" value={form.date} onChange={e=>inp('date',e.target.value)} style={{ ...INP, colorScheme:'dark' }}/>
            </div>

            {/* Result */}
            <div>
              <div style={LBL}>Result</div>
              <div style={{ display:'flex', gap:8 }}>
                {['Pass','Fail'].map(r => {
                  const active = form.result === r;
                  const clr    = r==='Pass' ? '#4ADE80' : '#F87171';
                  return (
                    <button key={r} onClick={()=>inp('result',r)} style={{ flex:1, padding:'9px', borderRadius:10, border:`1px solid ${active?clr+'60':'rgba(255,255,255,0.1)'}`, background:active?`${clr}18`:'rgba(255,255,255,0.04)', color:active?clr:'#4A5A78', fontSize:13, fontWeight:800, cursor:'pointer', transition:'all 0.15s', ...F }}>
                      {r==='Pass'?'✓ Pass':'✗ Fail'}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Notes full width */}
          <div style={{ marginBottom:16 }}>
            <div style={LBL}>Notes</div>
            <input value={form.notes} onChange={e=>inp('notes',e.target.value)} placeholder="Optional notes about this spot check..." style={INP}/>
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button onClick={submit} disabled={saving} style={{ padding:'10px 24px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#60A5FA,#3B82F6)', color:'#fff', ...F }}>
              {saving ? 'Saving...' : 'Save Spot Check'}
            </button>
            <button onClick={()=>setShowForm(false)} style={{ padding:'10px 20px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontSize:13, fontWeight:600, background:'transparent', color:'#8FA3C4', ...F }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 100px 110px 1fr 130px 80px 1.5fr', padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)', alignItems:'center' }}>
          {['Agent','Date','Coordinator','Caller #','Type','Result','Notes'].map((h,i) => (
            <div key={h} style={{ fontSize:10.5, fontWeight:800, color:'#4A5A78', letterSpacing:'1px', textTransform:'uppercase' }}>{h}</div>
          ))}
        </div>

        {data.length === 0 && <div style={{ padding:'40px', textAlign:'center', fontSize:13, color:'#4A5A78' }}>No spot checks yet</div>}

        {data.map((c, i) => (
          <div key={i} className="sc-row" style={{ display:'grid', gridTemplateColumns:'1.5fr 100px 110px 1fr 130px 80px 1.5fr', padding:'13px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center', background:'transparent', transition:'background 0.15s' }}>
            {/* Agent */}
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:ac(c.agentName), display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>{av(c.agentName)}</div>
              <span style={{ fontSize:13, fontWeight:700, color:'#FFF' }}>{c.agentName || '—'}</span>
            </div>
            {/* Date */}
            <div style={{ fontSize:12, color:'#4A5A78' }}>{c.date || '—'}</div>
            {/* Coordinator */}
            <div style={{ fontSize:12, color:'#8FA3C4' }}>{c.coordinator || '—'}</div>
            {/* Caller # */}
            <div style={{ fontSize:12, color:'#8FA3C4', fontFamily:'monospace' }}>{c.callerNum || '—'}</div>
            {/* Type */}
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:TYPE_COLORS[c.type]||'#8FA3C4', flexShrink:0, boxShadow:`0 0 5px ${TYPE_COLORS[c.type]||'#8FA3C4'}` }}/>
              <span style={{ fontSize:12, color:'#C8D8EC' }}>{c.type || '—'}</span>
            </div>
            {/* Result */}
            <div>
              <div style={{ display:'inline-flex', padding:'3px 10px', borderRadius:8, fontSize:11, fontWeight:700,
                background:(c.result||'').toLowerCase().includes('pass')||(c.result||'').toLowerCase()==='correct' ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                border:`1px solid ${(c.result||'').toLowerCase().includes('pass')||(c.result||'').toLowerCase()==='correct' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                color:(c.result||'').toLowerCase().includes('pass')||(c.result||'').toLowerCase()==='correct' ? '#4ADE80' : '#F87171',
              }}>
                {c.result === 'Pass' || c.result === 'Correct' ? '✓ Pass' : '✗ Fail'}
              </div>
            </div>
            {/* Notes */}
            <div style={{ fontSize:12, color:'#8FA3C4', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.notes || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}