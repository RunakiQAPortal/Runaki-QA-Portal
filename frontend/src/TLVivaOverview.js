// TLVivaOverview.js
import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const av = n => n?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?';

const DEMO = [
  { id:1,  agent:'Abdullrahman Ali', vivaName:'High Bill VIVA',      qa:'Miran', date:'2026-03-11', score:4, total:4, pct:100, pass:true },
  { id:2,  agent:'Govand Wali',      vivaName:'CRM Navigation',      qa:'Sizar', date:'2026-03-11', score:2, total:3, pct:67,  pass:true },
  { id:3,  agent:'Halland Hemn',     vivaName:'High Bill VIVA',      qa:'Brwa',  date:'2026-03-10', score:3, total:4, pct:75,  pass:true },
  { id:4,  agent:'Aya Edris',        vivaName:'CRM Navigation',      qa:'Sizar', date:'2026-03-10', score:1, total:3, pct:33,  pass:false },
  { id:5,  agent:'Rayan Jaafar',     vivaName:'High Bill VIVA',      qa:'Miran', date:'2026-03-09', score:4, total:4, pct:100, pass:true },
  { id:6,  agent:'Barham Qasim',     vivaName:'Hold-Unhold VIVA',    qa:'Brwa',  date:'2026-03-09', score:2, total:3, pct:67,  pass:true },
  { id:7,  agent:'Ali Khalid',       vivaName:'CRM Navigation',      qa:'Sizar', date:'2026-03-08', score:1, total:3, pct:33,  pass:false },
  { id:8,  agent:'Daryan Bakr',      vivaName:'High Bill VIVA',      qa:'Miran', date:'2026-03-07', score:4, total:4, pct:100, pass:true },
  { id:9,  agent:'Lawin Kosrat',     vivaName:'Hold-Unhold VIVA',    qa:'Brwa',  date:'2026-03-06', score:3, total:3, pct:100, pass:true },
  { id:10, agent:'Neamat Anwar',     vivaName:'High Bill VIVA',      qa:'Miran', date:'2026-03-05', score:2, total:4, pct:50,  pass:false },
];

const AGENTS_ALL = ['Abdullrahman Ali','Ahmed Saman','Ali Khalid','Aya Edris','Barham Qasim','Baran Omer','Daryan Bakr','Dilshad Karim','Govand Wali','Halland Hemn','Haryad Muhsin','Karwan Wali','Lawin Kosrat','Mohammed Soran','Neamat Anwar','Rayan Jaafar','Rzgar Ali','Sakar Ahmed','Salm Khairulla','Shelan Fraidoon','Sozhin Karim','Tara Omer','Wrya Hasan','Yad Jalal','Zana Kareem'];

export default function TLVivaOverview({ user }) {
  const [vivas, setVivas] = useState(DEMO);
  const [filterQA, setFilterQA] = useState('All');
  const [filterResult, setFilterResult] = useState('All');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ agent:'', vivaName:'', qa:user?.name||'Miran', date:new Date().toISOString().split('T')[0], score:'', total:'', });
  const [saving, setSaving] = useState(false);

  const inp = (k,v) => setForm(f=>({...f,[k]:v}));
  const pct = form.score && form.total ? Math.round(Number(form.score)/Number(form.total)*100) : 0;

  useEffect(() => {
    fetch('http://localhost:8080/api/viva').then(r=>r.json()).then(d=>{ if(Array.isArray(d)&&d.length>0) setVivas(d); }).catch(()=>{});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const newViva = { id:Date.now(), agent:form.agent, vivaName:form.vivaName, qa:form.qa, date:form.date, score:Number(form.score), total:Number(form.total), pct, pass:pct>=60 };
    try { await fetch('http://localhost:8080/api/viva', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newViva) }); } catch {}
    setVivas(v=>[newViva,...v]);
    setSaving(false);
    setShowCreate(false);
    setForm({ agent:'', vivaName:'', qa:user?.name||'Miran', date:new Date().toISOString().split('T')[0], score:'', total:'' });
  };

  const filtered = vivas.filter(v=>{
    if (filterQA!=='All' && v.qa!==filterQA) return false;
    if (filterResult==='Pass' && !v.pass) return false;
    if (filterResult==='Fail' && v.pass) return false;
    if (search && !v.agent.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const passCount = filtered.filter(v=>v.pass).length;
  const passRate  = filtered.length ? Math.round(passCount/filtered.length*100) : 0;
  const sel = { background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 14px', fontSize:13, cursor:'pointer', ...F };

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`select option{background:#131626!important;color:#FFF!important} select{color-scheme:dark} .tl-row:hover{background:rgba(255,255,255,0.04)!important}`}</style>

      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#A78BFA', marginBottom:5 }}>QA TEAM LEAD</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:'#FFF' }}>VIVA <span style={{ background:'linear-gradient(90deg,#A78BFA,#7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Overview</span></h1>
          <button onClick={()=>setShowCreate(true)} style={{ padding:'10px 20px', borderRadius:12, background:'linear-gradient(135deg,#A78BFA,#7C3AED)', border:'none', color:'#FFF', fontSize:13, fontWeight:700, cursor:'pointer', ...F }}>+ Create VIVA Result</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total VIVA Sessions', value:filtered.length,           color:'#A78BFA', sub:'this period' },
          { label:'Passed',              value:passCount,                  color:'#4ADE80', sub:'agents' },
          { label:'Failed',              value:filtered.length-passCount,  color:'#F87171', sub:'agents' },
          { label:'Pass Rate',           value:`${passRate}%`,             color:passRate>=70?'#4ADE80':'#FBBF24', sub:'≥60% threshold' },
        ].map((k,i)=>(
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

      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search agent..." style={{ ...sel, flex:1, minWidth:180, outline:'none' }}/>
        <select value={filterQA} onChange={e=>setFilterQA(e.target.value)} style={sel}>{['All','Miran','Sizar','Brwa','Mohammed'].map(q=><option key={q}>{q==='All'?'All QA':q}</option>)}</select>
        <select value={filterResult} onChange={e=>setFilterResult(e.target.value)} style={sel}>{['All','Pass','Fail'].map(r=><option key={r}>{r}</option>)}</select>
      </div>

      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 160px 90px 110px 90px 90px', padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)' }}>
          {['Agent','VIVA Name','QA Officer','Date','Score','Result'].map((h,i)=>(
            <div key={i} style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', color:'#4A5A78', textTransform:'uppercase' }}>{h}</div>
          ))}
        </div>
        {filtered.length===0&&<div style={{ padding:'40px', textAlign:'center', color:'#4A5A78' }}>No VIVA records found</div>}
        {filtered.map((v,i)=>(
          <div key={v.id} className="tl-row" style={{ display:'grid', gridTemplateColumns:'1fr 160px 90px 110px 90px 90px', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:'transparent', transition:'background 0.15s', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:`${ac(v.agent)}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:ac(v.agent), flexShrink:0 }}>{av(v.agent)}</div>
              <span style={{ fontSize:13, fontWeight:600, color:'#FFF' }}>{v.agent}</span>
            </div>
            <span style={{ fontSize:12, color:'#C8D8EC' }}>{v.vivaName}</span>
            <span style={{ fontSize:12, color:'#8FA3C4' }}>{v.qa}</span>
            <span style={{ fontSize:12, color:'#4A5A78' }}>{v.date}</span>
            <span style={{ fontSize:13, fontWeight:700, color:'#FFF' }}>{v.score}/{v.total}</span>
            <span style={{ padding:'4px 12px', borderRadius:20, background:v.pass?'rgba(74,222,128,0.12)':'rgba(248,113,113,0.12)', fontSize:12, fontWeight:700, color:v.pass?'#4ADE80':'#F87171', display:'inline-block' }}>{v.pass?'✓ Pass':'✗ Fail'}</span>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:24 }}>
          <div style={{ background:'#131626', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24, width:'100%', maxWidth:480, padding:'32px', ...F }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:'#FFF' }}>Create VIVA Result</h2>
              <button onClick={()=>setShowCreate(false)} style={{ background:'none', border:'none', color:'#8FA3C4', fontSize:22, cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
              {[['Agent','agent','select-agent'],['VIVA Name','vivaName','text'],['QA Officer','qa','select-qa'],['Date','date','date'],['Score (correct answers)','score','number'],['Total Questions','total','number']].map(([lbl,key,type])=>(
                <div key={key}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.8px' }}>{lbl}</div>
                  {type==='select-agent' ? (
                    <select value={form[key]} onChange={e=>inp(key,e.target.value)} style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 12px', fontSize:13, ...F, boxSizing:'border-box' }}>
                      <option value="">Select agent...</option>
                      {AGENTS_ALL.map(a=><option key={a}>{a}</option>)}
                    </select>
                  ) : type==='select-qa' ? (
                    <select value={form[key]} onChange={e=>inp(key,e.target.value)} style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 12px', fontSize:13, ...F, boxSizing:'border-box' }}>
                      {['Miran','Sizar','Brwa','Mohammed'].map(q=><option key={q}>{q}</option>)}
                    </select>
                  ) : (
                    <input type={type==='text'?'text':type} value={form[key]} onChange={e=>inp(key,e.target.value)} style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 12px', fontSize:13, outline:'none', boxSizing:'border-box', ...F }}/>
                  )}
                </div>
              ))}
            </div>
            {form.score && form.total && (
              <div style={{ padding:'12px 16px', background:pct>=60?'rgba(74,222,128,0.08)':'rgba(248,113,113,0.08)', border:`1px solid ${pct>=60?'rgba(74,222,128,0.2)':'rgba(248,113,113,0.2)'}`, borderRadius:12, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'#8FA3C4' }}>Result</span>
                <span style={{ fontSize:16, fontWeight:800, color:pct>=60?'#4ADE80':'#F87171' }}>{pct}% — {pct>=60?'✓ Pass':'✗ Fail'}</span>
              </div>
            )}
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button onClick={()=>setShowCreate(false)} style={{ padding:'11px 22px', borderRadius:12, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#8FA3C4', fontSize:13, fontWeight:600, cursor:'pointer', ...F }}>Cancel</button>
              <button onClick={handleSave} disabled={saving||!form.agent||!form.vivaName||!form.score||!form.total} style={{ padding:'11px 28px', borderRadius:12, background:'linear-gradient(135deg,#A78BFA,#7C3AED)', border:'none', color:'#FFF', fontSize:13, fontWeight:700, cursor:'pointer', opacity:saving||!form.agent||!form.vivaName||!form.score||!form.total?0.5:1, ...F }}>
                {saving?'Saving…':'Save Result'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}