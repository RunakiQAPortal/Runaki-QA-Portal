import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api';
const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const av = n => { if(!n)return'?'; const w=n.trim().split(' '); return(w[0][0]+(w[1]?w[1][0]:'')).toUpperCase(); };
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';
const sbd= p => p>=80?'rgba(74,222,128,0.3)':p>=60?'rgba(251,191,36,0.3)':'rgba(248,113,113,0.3)';

const AGENT_DB = {
  'Miran': ['Abdullrahman Ali Mahdi','Aran Eimad Qadir','Awdang Saman','Azad Brifkani','Barham Qasim Ahmed','Didar Pirbal','Haryad Shakr Abdulla','Hawrin Amir Ahmed','Kaiwan Pshtiwan Mustafa','Muhammad Ali Osman','Muhammed Abdulbari Majid','Omer Tasim Omer','Rayan Jaafar','Ronar Rasul','Safar Mikeail Ismail','Salih Sangar','Sazgar Hassan','Suzan Sarmad'],
  'Sizar': ['Adbulqadir Salam','Ahmed Khafut Xdr','Ali Khalid','Ammar Mamnd Salih','Aya Edris','Bahaa Shamsadeen Sulaiman','Darbin Omer Abubakr','Esra Sabah Salim','Govand Wali','Israa Peshkawt','Muhammed Fairq Hadu','Muhammed Jalal Majid','Mustafa Khudhur Ali','Rasul Najmadeen','Ruya Yaqub','Rzgar Ali Ismail','Safeen Jahfar','Yasser Ameen','Yousif Hussen Bahram'],
  'Brwa': ['Ahmed Jasim Rashid','Ahmed Saman','Bawar Fazl Muhammad','Daryan Bakr Kakamand','Dlovan Maraan Ibrahim','Gailan Xalid','Halland Hemn','Haryad Muhsin','Karwan Wali','Lawin Kosrat Saadi','Malik Rashid','Mohammed Soran Hassan','Neamat Anwar Kareem','Salm Khairulla Saeed','Shaida Faizan Kawiz','Sozhin Karim','Zhiya Najmadin'],
  'Mohammed': [],
};
const ALL_AGENTS_VIVA = [
  'Abdullrahman Ali Mahdi','Aran Eimad Qadir','Awdang Saman','Azad Brifkani','Barham Qasim Ahmed','Didar Pirbal','Haryad Shakr Abdulla','Hawrin Amir Ahmed','Kaiwan Pshtiwan Mustafa','Muhammad Ali Osman','Muhammed Abdulbari Majid','Omer Tasim Omer','Rayan Jaafar','Ronar Rasul','Safar Mikeail Ismail','Salih Sangar','Sazgar Hassan','Suzan Sarmad',
  'Adbulqadir Salam','Ahmed Khafut Xdr','Ali Khalid','Ammar Mamnd Salih','Aya Edris','Bahaa Shamsadeen Sulaiman','Darbin Omer Abubakr','Esra Sabah Salim','Govand Wali','Israa Peshkawt','Muhammed Fairq Hadu','Muhammed Jalal Majid','Mustafa Khudhur Ali','Rasul Najmadeen','Ruya Yaqub','Rzgar Ali Ismail','Safeen Jahfar','Yasser Ameen','Yousif Hussen Bahram',
  'Ahmed Jasim Rashid','Ahmed Saman','Bawar Fazl Muhammad','Daryan Bakr Kakamand','Dlovan Maraan Ibrahim','Gailan Xalid','Halland Hemn','Haryad Muhsin','Karwan Wali','Lawin Kosrat Saadi','Malik Rashid','Mohammed Soran Hassan','Neamat Anwar Kareem','Salm Khairulla Saeed','Shaida Faizan Kawiz','Sozhin Karim','Zhiya Najmadin',
].sort();

const DEMO_TEMPLATES = [
  { id:'t1', name:'High Bill VIVA', questions:['What causes a high bill?','How do you explain consumption to the customer?','What are the bill payment options?','What is the dunning process?'] },
  { id:'t2', name:'CRM Navigation VIVA', questions:['How do you open a ticket in CRM?','How do you transfer a call?','How do you check account history?'] },
];
const DEMO_RESULTS = [
  { id:1, agentName:'Demo Agent A', vivaName:'High Bill VIVA', date:'09 Mar 2026', totalQ:4, score:3, pct:75, notes:'Good on billing, weak on dunning' },
  { id:2, agentName:'Demo Agent B', vivaName:'CRM Navigation VIVA', date:'08 Mar 2026', totalQ:3, score:3, pct:100, notes:'Excellent' },
  { id:3, agentName:'Demo Agent C', vivaName:'High Bill VIVA', date:'07 Mar 2026', totalQ:4, score:2, pct:50, notes:'Needs re-training on consumption explanation' },
];

const inputSt = { padding:'9px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFFFFF', fontSize:13, outline:'none', fontFamily:"'Inter','Segoe UI',sans-serif", width:'100%', boxSizing:'border-box' };
const selSt = { ...inputSt, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238FA3C4' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundSize:'12px', paddingRight:32, cursor:'pointer', appearance:'none', WebkitAppearance:'none', backgroundColor:'rgba(255,255,255,0.05)' };

function Lbl({ children, required }) {
  return <div style={{ fontSize:11, fontWeight:700, color:'#4A5A78', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 }}>
    {children}{required&&<span style={{ color:'#F87171', marginLeft:3 }}>*</span>}
  </div>;
}

export default function QAViva({ user }) {
  const qaName = user?.name || '';
  const myAgents = AGENT_DB[qaName] || [];
  const [tab, setTab] = useState('results'); // results | templates | create-template | conduct
  const [templates, setTemplates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // create template state
  const [tplName, setTplName] = useState('');
  const [questions, setQuestions] = useState(['','','']);
  const [savingTpl, setSavingTpl] = useState(false);

  // conduct VIVA state
  const [conductTpl, setConductTpl] = useState('');
  const [conductAgent, setConductAgent] = useState('');
  const [conductDate, setConductDate] = useState('');
  const [answers, setAnswers] = useState({}); // {0: true/false/null}
  const [conductNotes, setConductNotes] = useState('');
  const [savingConduct, setSavingConduct] = useState(false);

  // filter
  const [filterTab, setFilterTab] = useState('all');

  const load = () => {
    // Load templates from localStorage (always works)
    try {
      const stored = localStorage.getItem('viva_templates');
      if (stored) setTemplates(JSON.parse(stored));
    } catch {}
    // Try API templates too, merge if available
    axios.get(`${API}/viva/templates`)
      .then(r => { if (Array.isArray(r.data) && r.data.length > 0) {
        setTemplates(r.data);
        localStorage.setItem('viva_templates', JSON.stringify(r.data));
      }})
      .catch(() => {});
    // Load VIVA results — merge local + API
    const localRes = JSON.parse(localStorage.getItem('viva_results') || '[]')
      .filter(v => (v.qaOfficer||v.qa||'').toLowerCase() === qaName.toLowerCase());
    if (localRes.length > 0) setResults(localRes);
    axios.get(`${API}/viva`)
      .then(r => {
        const apiRes = (Array.isArray(r.data)?r.data:[]).filter(v=>(v.qaOfficer||v.qa||'').toLowerCase()===qaName.toLowerCase());
        if (apiRes.length > 0) setResults(apiRes);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, [qaName]);

  const demoMode = templates.length===0 && results.length===0 && !loading && !localStorage.getItem('viva_templates') && !localStorage.getItem('viva_results');
  const displayTemplates = demoMode ? DEMO_TEMPLATES : templates;
  const displayResults   = demoMode ? DEMO_RESULTS   : results;

  const filteredResults = filterTab==='all' ? displayResults
    : filterTab==='pass' ? displayResults.filter(r=>(r.pct||0)>=60)
    : displayResults.filter(r=>(r.pct||0)<60);

  const selectedTpl = displayTemplates.find(t=>t.id===conductTpl||t.name===conductTpl);
  const tplQuestions = selectedTpl?.questions||[];

  // save template — always saves locally, tries API too
  const saveTemplate = async () => {
    const qs = questions.filter(q=>q.trim());
    if (!tplName.trim() || qs.length===0) return;
    setSavingTpl(true);
    const newTpl = { id: 'tpl_' + Date.now(), name: tplName, questions: qs, qaOfficer: qaName };
    // Save locally first — always works
    const updated = [...templates, newTpl];
    setTemplates(updated);
    try { localStorage.setItem('viva_templates', JSON.stringify(updated)); } catch {}
    // Try API too
    try { await axios.post(`${API}/viva/templates`, newTpl); } catch {}
    setTplName(''); setQuestions(['','','']);
    setSavingTpl(false);
    setTab('templates');
  };

  // conduct VIVA submit
  const submitViva = async () => {
    if (!conductTpl||!conductAgent||!conductDate) return;
    const qs = tplQuestions;
    const answered = qs.map((_,i)=>answers[i]===true||answers[i]===false);
    if (answered.includes(false)) return;
    const score = qs.filter((_,i)=>answers[i]===true).length;
    const pct = Math.round((score/qs.length)*100);
    setSavingConduct(true);
    // Build the result object matching backend schema
    const vivaResult = {
      agent:      conductAgent,
      agentName:  conductAgent,
      vivaName:   conductTpl,
      qa:         qaName,
      qaOfficer:  qaName,
      date:       conductDate,
      score:      score,
      total:      qs.length,
      totalQ:     qs.length,
      pct:        pct,
      pass:       pct >= 60,
      notes:      conductNotes,
    };
    // Save locally first so it always shows up
    const localResults = JSON.parse(localStorage.getItem('viva_results') || '[]');
    localResults.unshift({ id: Date.now(), ...vivaResult });
    localStorage.setItem('viva_results', JSON.stringify(localResults));
    setResults(prev => [{ id: Date.now(), ...vivaResult }, ...prev]);
    // Try backend
    try {
      await axios.post(`${API}/viva`, vivaResult);
    } catch(err) {
      console.warn('Backend save failed, using local:', err?.response?.data || err.message);
    }
    setConductTpl(''); setConductAgent(''); setConductDate('');
    setAnswers({}); setConductNotes('');
    setSavingConduct(false);
    setTab('results');
  };

  const passCount = displayResults.filter(r=>(r.pct||0)>=60).length;
  const failCount = displayResults.filter(r=>(r.pct||0)<60).length;
  const avgPct = displayResults.length ? Math.round(displayResults.reduce((a,r)=>a+(r.pct||0),0)/displayResults.length) : 0;

  return (
    <div style={{ ...F, background:'#0D0F1E', minHeight:'100vh', padding:'28px 32px 60px', color:'#FFFFFF' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); select option{background:#131626;color:#fff;} input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.4);}`}</style>

      {/* header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:'#A78BFA', letterSpacing:'2.5px', textTransform:'uppercase', marginBottom:6 }}>QA OFFICER · {qaName}</div>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900 }}>
            VIVA <span style={{ background:'linear-gradient(90deg,#A78BFA,#60A5FA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Management</span>
          </h1>
          {demoMode && <div style={{ marginTop:8, display:'inline-flex', padding:'4px 12px', borderRadius:20, background:'rgba(167,139,250,0.1)', border:'1px solid rgba(167,139,250,0.25)', fontSize:11, fontWeight:700, color:'#A78BFA' }}>⚡ Demo data</div>}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={()=>setTab('create-template')} style={{ padding:'10px 18px', borderRadius:12, border:'1px solid rgba(167,139,250,0.3)', cursor:'pointer', fontSize:13, fontWeight:700, background:'rgba(167,139,250,0.1)', color:'#A78BFA' }}>
            + New VIVA Template
          </button>
          <button onClick={()=>setTab('conduct')} style={{ padding:'10px 18px', borderRadius:12, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#A78BFA,#60A5FA)', color:'#fff', boxShadow:'0 4px 14px rgba(167,139,250,0.35)' }}>
            ▶ Conduct VIVA
          </button>
        </div>
      </div>

      {/* stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Templates', val:displayTemplates.length, color:'#A78BFA' },
          { label:'Total VIVAs', val:displayResults.length, color:'#60A5FA' },
          { label:'Passed', val:passCount, color:'#4ADE80' },
          { label:'Failed', val:failCount, color:'#F87171' },
        ].map((k,i) => (
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'20px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 18px 18px' }}/>
            <div style={{ position:'absolute', top:-20, right:-20, width:90, height:90, borderRadius:'50%', background:k.color, opacity:0.08, filter:'blur(28px)' }}/>
            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#4A5A78', marginBottom:8 }}>{k.label}</div>
            <div style={{ fontSize:32, fontWeight:800, color:'#FFF', marginBottom:4 }}>{k.val}</div>
            <div style={{ fontSize:11, color:k.color, fontWeight:600 }}>{k.label === 'Templates' ? 'created' : k.label === 'Total VIVAs' ? 'conducted' : k.label === 'Passed' ? '≥60%' : '<60%'}</div>
          </div>
        ))}
      </div>

      {/* ══ CREATE TEMPLATE ══ */}
      {tab==='create-template' && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(167,139,250,0.2)', borderRadius:16, overflow:'hidden', marginBottom:20 }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(167,139,250,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:4, height:18, background:'linear-gradient(180deg,#A78BFA,#A78BFA55)', borderRadius:4 }}/>
              <span style={{ fontSize:13, fontWeight:800, color:'#FFFFFF' }}>Create New VIVA Template</span>
            </div>
            <button onClick={()=>setTab('results')} style={{ padding:'5px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontSize:12, fontWeight:600, background:'transparent', color:'#8FA3C4' }}>✕ Cancel</button>
          </div>
          <div style={{ padding:'20px 24px' }}>
            <div style={{ marginBottom:16 }}>
              <Lbl required>VIVA Name</Lbl>
              <input value={tplName} onChange={e=>setTplName(e.target.value)} placeholder='e.g. High Bill VIVA, CRM Navigation VIVA...' style={inputSt} />
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <Lbl>Questions</Lbl>
                <button onClick={()=>setQuestions(q=>[...q,''])} style={{ padding:'4px 12px', borderRadius:8, border:'1px solid rgba(167,139,250,0.3)', cursor:'pointer', fontSize:11, fontWeight:700, background:'rgba(167,139,250,0.1)', color:'#A78BFA' }}>+ Add Question</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {questions.map((q,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:24, height:24, borderRadius:8, background:'rgba(167,139,250,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#A78BFA', flexShrink:0 }}>{i+1}</div>
                    <input value={q} onChange={e=>{ const n=[...questions]; n[i]=e.target.value; setQuestions(n); }} placeholder={`Question ${i+1}...`} style={{ ...inputSt, flex:1 }} />
                    {questions.length>1 && <button onClick={()=>setQuestions(q=>q.filter((_,j)=>j!==i))} style={{ width:28, height:28, borderRadius:8, border:'1px solid rgba(248,113,113,0.3)', cursor:'pointer', background:'rgba(248,113,113,0.1)', color:'#F87171', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={saveTemplate} disabled={savingTpl||!tplName.trim()||questions.filter(q=>q.trim()).length===0}
                style={{ padding:'10px 24px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#A78BFA,#60A5FA)', color:'#fff', opacity:(!tplName.trim()||questions.filter(q=>q.trim()).length===0)?0.5:1 }}>
                {savingTpl?'Saving...':'Save VIVA Template'}
              </button>
              <button onClick={()=>setTab('results')} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontSize:13, fontWeight:600, background:'transparent', color:'#8FA3C4' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ CONDUCT VIVA ══ */}
      {tab==='conduct' && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(96,165,250,0.2)', borderRadius:16, overflow:'hidden', marginBottom:20 }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(96,165,250,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:4, height:18, background:'linear-gradient(180deg,#60A5FA,#60A5FA55)', borderRadius:4 }}/>
              <span style={{ fontSize:13, fontWeight:800, color:'#FFFFFF' }}>Conduct a VIVA</span>
            </div>
            <button onClick={()=>setTab('results')} style={{ padding:'5px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontSize:12, fontWeight:600, background:'transparent', color:'#8FA3C4' }}>✕ Cancel</button>
          </div>
          <div style={{ padding:'20px 24px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:16, minWidth:0 }}>
              <div style={{minWidth:0}}>
                <Lbl required>VIVA Template</Lbl>
                <select value={conductTpl} onChange={e=>{setConductTpl(e.target.value);setAnswers({});}} style={selSt}>
                  <option value="">— Select VIVA —</option>
                  {displayTemplates.map(t=><option key={t.id||t.name} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div style={{minWidth:0}}>
                <Lbl required>Agent</Lbl>
                <select value={conductAgent} onChange={e=>setConductAgent(e.target.value)} style={selSt}>
                  <option value="">— Select agent —</option>
                  {ALL_AGENTS_VIVA.map(a=><option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div style={{minWidth:0}}>
                <Lbl required>Date</Lbl>
                <input type="date" value={conductDate} onChange={e=>setConductDate(e.target.value)} style={{ ...inputSt, colorScheme:'dark' }} />
              </div>
            </div>

            {/* questions */}
            {tplQuestions.length>0 && (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#4A5A78', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:12 }}>Questions — Mark each as Correct or Incorrect</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {tplQuestions.map((q,i)=>(
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:12, background:answers[i]===true?'rgba(74,222,128,0.06)':answers[i]===false?'rgba(248,113,113,0.06)':'rgba(255,255,255,0.03)', border:`1px solid ${answers[i]===true?'rgba(74,222,128,0.25)':answers[i]===false?'rgba(248,113,113,0.25)':'rgba(255,255,255,0.08)'}` }}>
                      <div style={{ width:26, height:26, borderRadius:8, background:'rgba(167,139,250,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#A78BFA', flexShrink:0 }}>{i+1}</div>
                      <div style={{ flex:1, fontSize:13, fontWeight:600, color:'#C8D8EC' }}>{q}</div>
                      <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                        <button onClick={()=>setAnswers(a=>({...a,[i]:true}))} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${answers[i]===true?'rgba(74,222,128,0.5)':'rgba(74,222,128,0.2)'}`, cursor:'pointer', fontSize:12, fontWeight:700, background:answers[i]===true?'rgba(74,222,128,0.2)':'transparent', color:'#4ADE80' }}>✓ Correct</button>
                        <button onClick={()=>setAnswers(a=>({...a,[i]:false}))} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${answers[i]===false?'rgba(248,113,113,0.5)':'rgba(248,113,113,0.2)'}`, cursor:'pointer', fontSize:12, fontWeight:700, background:answers[i]===false?'rgba(248,113,113,0.2)':'transparent', color:'#F87171' }}>✗ Incorrect</button>
                      </div>
                    </div>
                  ))}
                </div>
                {tplQuestions.length>0 && (
                  <div style={{ marginTop:12, padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:12, color:'#8FA3C4' }}>Score preview</span>
                    <span style={{ fontSize:14, fontWeight:800, color:'#A78BFA' }}>{tplQuestions.filter((_,i)=>answers[i]===true).length} / {tplQuestions.length}</span>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom:16 }}>
              <Lbl>Notes</Lbl>
              <textarea value={conductNotes} onChange={e=>setConductNotes(e.target.value)} placeholder="Optional notes about this VIVA session..." rows={3}
                style={{ ...inputSt, resize:'vertical', lineHeight:1.6 }} />
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={submitViva} disabled={savingConduct||!conductTpl||!conductAgent||!conductDate||tplQuestions.some((_,i)=>answers[i]===undefined)}
                style={{ padding:'10px 24px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#A78BFA,#60A5FA)', color:'#fff',
                  opacity:(!conductTpl||!conductAgent||!conductDate||tplQuestions.some((_,i)=>answers[i]===undefined))?0.5:1 }}>
                {savingConduct?'Saving...':'Submit VIVA'}
              </button>
              <button onClick={()=>setTab('results')} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontSize:13, fontWeight:600, background:'transparent', color:'#8FA3C4' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TABS ══ */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[['results','VIVA Results'],['templates','Templates']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{ padding:'8px 18px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, transition:'all 0.15s',
            background:(tab===k||(!['create-template','conduct'].includes(tab)&&k==='results'&&tab==='results'))?'linear-gradient(135deg,#A78BFA,#60A5FA)':'rgba(255,255,255,0.04)',
            color:(tab===k)?'#fff':'#8FA3C4', boxShadow:tab===k?'0 4px 12px rgba(167,139,250,0.3)':'none' }}>
            {l}
          </button>
        ))}
      </div>

      {/* TEMPLATES list */}
      {tab==='templates' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
          {displayTemplates.map((t,i)=>(
            <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
              <div style={{ height:3, background:'linear-gradient(90deg,#A78BFA,transparent)' }}/>
              <div style={{ padding:'16px 18px' }}>
                <div style={{ fontSize:14, fontWeight:800, color:'#FFFFFF', marginBottom:12 }}>{t.name}</div>
                <div style={{ fontSize:11, fontWeight:700, color:'#4A5A78', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:8 }}>{t.questions?.length||0} Questions</div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {(t.questions||[]).map((q,j)=>(
                    <div key={j} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'7px 10px', borderRadius:8, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ width:18, height:18, borderRadius:6, background:'rgba(167,139,250,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:'#A78BFA', flexShrink:0, marginTop:1 }}>{j+1}</div>
                      <span style={{ fontSize:12, color:'#C8D8EC', lineHeight:1.5 }}>{q}</span>
                    </div>
                  ))}
                </div>
                <button onClick={()=>{setConductTpl(t.name);setAnswers({});setTab('conduct');}} style={{ marginTop:14, width:'100%', padding:'9px', borderRadius:10, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, background:'rgba(167,139,250,0.12)', color:'#A78BFA', border:'1px solid rgba(167,139,250,0.25)' }}>
                  ▶ Use This Template
                </button>
              </div>
            </div>
          ))}
          {displayTemplates.length===0&&<div style={{ gridColumn:'1/-1', textAlign:'center', padding:'40px', fontSize:13, color:'#4A5A78' }}>No templates yet — create one above</div>}
        </div>
      )}

      {/* RESULTS table */}
      {tab==='results' && (
        <div>
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {[['all','All'],['pass','Passed'],['fail','Failed']].map(([k,l])=>(
              <button key={k} onClick={()=>setFilterTab(k)} style={{ padding:'6px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
                background:filterTab===k?'rgba(167,139,250,0.2)':'rgba(255,255,255,0.04)',
                color:filterTab===k?'#A78BFA':'#8FA3C4',
                border:`1px solid ${filterTab===k?'rgba(167,139,250,0.35)':'transparent'}` }}>{l}</button>
            ))}
          </div>
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr 2fr', padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)' }}>
              {['Agent','VIVA Name','Date','Score','Result','Notes'].map(h=>(
                <div key={h} style={{ fontSize:10.5, fontWeight:800, color:'#4A5A78', letterSpacing:'1px', textTransform:'uppercase' }}>{h}</div>
              ))}
            </div>
            {filteredResults.map((v,i)=>{
              const p = Number(v.pct||0);
              return (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr 2fr', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:'50%', background:ac(v.agentName), display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff' }}>{av(v.agentName)}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#FFFFFF', minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.agentName||'—'}</div>
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color:'#C8D8EC', minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.vivaName||'—'}</div>
                  <div style={{ fontSize:12, color:'#8FA3C4' }}>{v.date||'—'}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#C8D8EC' }}>{v.score}/{v.totalQ}</div>
                  <div>
                    <div style={{ display:'inline-flex', padding:'4px 10px', borderRadius:8, fontSize:12, fontWeight:800, background:sbg(p), border:`1px solid ${sbd(p)}`, color:sc(p) }}>{p}%</div>
                  </div>
                  <div style={{ fontSize:12, color:'#8FA3C4', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.notes||'—'}</div>
                </div>
              );
            })}
            {filteredResults.length===0&&<div style={{ padding:'40px', textAlign:'center', fontSize:13, color:'#4A5A78' }}>No VIVA results yet</div>}
          </div>
        </div>
      )}
    </div>
  );
}