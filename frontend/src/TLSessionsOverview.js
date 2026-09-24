import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];

const DEMO = [
  { id:1, title:'CRM System Training',        trainer:'Soza',  date:'2026-03-12', duration:90,  status:'upcoming',  attendees:['Abdullrahman Ali','Govand Wali','Halland Hemn','Aya Edris','Rayan Jaafar'] },
  { id:2, title:'High Bill Handling',          trainer:'Soza',  date:'2026-03-08', duration:60,  status:'completed', attendees:['Barham Qasim','Ali Khalid','Daryan Bakr','Rzgar Ali'] },
  { id:3, title:'Communication Skills',        trainer:'Soza',  date:'2026-03-05', duration:120, status:'completed', attendees:['Abdullrahman Ali','Ahmed Saman','Lawin Kosrat','Neamat Anwar','Sozhin Karim','Salm Khairulla'] },
  { id:4, title:'INDRA Calculator Deep Dive',  trainer:'Soza',  date:'2026-02-28', duration:90,  status:'completed', attendees:['Govand Wali','Haryad Muhsin','Karwan Wali','Mohammed Soran'] },
  { id:5, title:'Escalation Procedures',       trainer:'Soza',  date:'2026-02-21', duration:60,  status:'completed', attendees:['Baran Omer','Dilshad Karim','Sakar Ahmed','Tara Omer','Wrya Hasan'] },
];

export default function TLSessionsOverview({ user }) {
  const [sessions, setSessions] = useState(DEMO);
  const [filterStatus, setFilterStatus] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title:'', trainer:'Soza', date:new Date().toISOString().split('T')[0], duration:'', status:'upcoming', attendees:'' });
  const [saving, setSaving] = useState(false);

  const inp = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffect(() => {
    fetch('http://localhost:8080/api/sessions').then(r=>r.json()).then(d=>{ if(Array.isArray(d)&&d.length>0) setSessions(d); }).catch(()=>{});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const attList = form.attendees.split('\n').map(a=>a.trim()).filter(Boolean);
    const newSession = { id:Date.now(), title:form.title, trainer:form.trainer, date:form.date, duration:Number(form.duration), status:form.status, attendees:attList };
    try { await fetch('http://localhost:8080/api/sessions', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newSession) }); } catch {}
    setSessions(s=>[newSession,...s]);
    setSaving(false);
    setShowCreate(false);
    setForm({ title:'', trainer:'Soza', date:new Date().toISOString().split('T')[0], duration:'', status:'upcoming', attendees:'' });
  };

  const filtered = sessions.filter(s=>filterStatus==='All'||(filterStatus==='Upcoming'&&s.status==='upcoming')||(filterStatus==='Completed'&&s.status==='completed'));
  const completed   = sessions.filter(s=>s.status==='completed').length;
  const upcoming    = sessions.filter(s=>s.status==='upcoming').length;
  const totalMins   = sessions.filter(s=>s.status==='completed').reduce((sum,s)=>sum+(s.duration||0),0);
  const totalAtt    = sessions.reduce((sum,s)=>sum+(Array.isArray(s.attendees)?s.attendees.length:0),0);

  const sel = { background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 14px', fontSize:13, cursor:'pointer', ...F };

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`select option{background:#131626!important;color:#FFF!important} select{color-scheme:dark} .tl-row:hover{background:rgba(255,255,255,0.04)!important}`}</style>

      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#A78BFA', marginBottom:5 }}>QA TEAM LEAD</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:'#FFF' }}>Sessions <span style={{ background:'linear-gradient(90deg,#A78BFA,#7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Overview</span></h1>
          <button onClick={()=>setShowCreate(true)} style={{ padding:'10px 20px', borderRadius:12, background:'linear-gradient(135deg,#A78BFA,#7C3AED)', border:'none', color:'#FFF', fontSize:13, fontWeight:700, cursor:'pointer', ...F }}>+ Create Session</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Sessions',  value:sessions.length,                                         color:'#A78BFA', sub:'all time' },
          { label:'Completed',       value:completed,                                               color:'#4ADE80', sub:'sessions' },
          { label:'Upcoming',        value:upcoming,                                                color:'#FBBF24', sub:'scheduled' },
          { label:'Training Hours',  value:`${Math.floor(totalMins/60)}h ${totalMins%60}m`,        color:'#60A5FA', sub:'logged' },
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

      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={sel}>
          {['All','Upcoming','Completed'].map(s=><option key={s}>{s}</option>)}
        </select>
        <div style={{ padding:'9px 14px', borderRadius:10, background:'rgba(255,255,255,0.04)', fontSize:13, color:'#8FA3C4', border:'1px solid rgba(255,255,255,0.08)' }}>{filtered.length} sessions · {totalAtt} total attendees</div>
      </div>

      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
        {filtered.map((s,i)=>{
          const att = Array.isArray(s.attendees)?s.attendees:[];
          return (
            <React.Fragment key={s.id}>
              <div className="tl-row" onClick={()=>setExpanded(expanded===s.id?null:s.id)} style={{ padding:'16px 24px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:'transparent', transition:'background 0.15s', cursor:'pointer' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:att.length>0?10:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:s.status==='completed'?'rgba(74,222,128,0.12)':'rgba(251,191,36,0.12)', border:`1px solid ${s.status==='completed'?'rgba(74,222,128,0.25)':'rgba(251,191,36,0.25)'}`, display:'flex', alignItems:'center', justifyContent:'center', color:s.status==='completed'?'#4ADE80':'#FBBF24', flexShrink:0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:'#FFF' }}>{s.title}</div>
                      <div style={{ fontSize:11, color:'#4A5A78', marginTop:2 }}>Trainer: {s.trainer||'Soza'} · {s.duration} min · {att.length} attendees</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                    <span style={{ fontSize:12, color:'#4A5A78' }}>{s.date}</span>
                    <span style={{ padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, background:s.status==='completed'?'rgba(74,222,128,0.1)':'rgba(251,191,36,0.12)', color:s.status==='completed'?'#4ADE80':'#FBBF24' }}>
                      {s.status==='completed'?'✓ Done':'⏳ Upcoming'}
                    </span>
                    <span style={{ color:'#4A5A78', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', width:24 }}>{expanded===s.id?'▲':'▼'}</span>
                  </div>
                </div>
                {att.length>0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, paddingLeft:52 }}>
                    {att.slice(0,5).map((a,j)=>(
                      <span key={j} style={{ padding:'2px 10px', borderRadius:20, background:`${ac(a)}18`, border:`1px solid ${ac(a)}30`, fontSize:11, fontWeight:600, color:ac(a) }}>{a.split(' ')[0]}</span>
                    ))}
                    {att.length>5&&<span style={{ padding:'2px 10px', borderRadius:20, background:'rgba(255,255,255,0.06)', fontSize:11, color:'#8FA3C4' }}>+{att.length-5} more</span>}
                  </div>
                )}
              </div>
              {expanded===s.id && att.length>0 && (
                <div style={{ padding:'14px 24px 18px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:'rgba(255,255,255,0.02)', paddingLeft:76 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.8px' }}>All Attendees ({att.length})</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {att.map((a,j)=>(
                      <span key={j} style={{ padding:'4px 14px', borderRadius:20, background:`${ac(a)}18`, border:`1px solid ${ac(a)}30`, fontSize:12, fontWeight:600, color:ac(a) }}>{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:24 }}>
          <div style={{ background:'#131626', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24, width:'100%', maxWidth:520, padding:'32px', ...F }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:'#FFF' }}>Create Session</h2>
              <button onClick={()=>setShowCreate(false)} style={{ background:'none', border:'none', color:'#8FA3C4', fontSize:22, cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
              {[['Session Title','title','text'],['Trainer','trainer','select-trainer'],['Date','date','date'],['Duration (minutes)','duration','number'],['Status','status','select-status']].map(([lbl,key,type])=>(
                <div key={key} style={{ gridColumn:key==='title'?'1 / -1':'auto' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.8px' }}>{lbl}</div>
                  {type==='select-trainer' ? (
                    <select value={form[key]} onChange={e=>inp(key,e.target.value)} style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 12px', fontSize:13, ...F, boxSizing:'border-box' }}>
                      {['Soza','Miran','Other'].map(t=><option key={t}>{t}</option>)}
                    </select>
                  ) : type==='select-status' ? (
                    <select value={form[key]} onChange={e=>inp(key,e.target.value)} style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 12px', fontSize:13, ...F, boxSizing:'border-box' }}>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <input type={type} value={form[key]} onChange={e=>inp(key,e.target.value)} style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 12px', fontSize:13, outline:'none', boxSizing:'border-box', ...F }}/>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.8px' }}>Attendees <span style={{ color:'#4A5A78', fontWeight:400, textTransform:'none', letterSpacing:0 }}>(one name per line)</span></div>
              <textarea value={form.attendees} onChange={e=>inp('attendees',e.target.value)} rows={5} placeholder={'Abdullrahman Ali\nGovand Wali\nHalland Hemn'} style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'10px 12px', fontSize:13, resize:'vertical', outline:'none', boxSizing:'border-box', ...F }}/>
              <div style={{ fontSize:11, color:'#4A5A78', marginTop:4 }}>{form.attendees.split('\n').filter(a=>a.trim()).length} agents listed</div>
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button onClick={()=>setShowCreate(false)} style={{ padding:'11px 22px', borderRadius:12, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#8FA3C4', fontSize:13, fontWeight:600, cursor:'pointer', ...F }}>Cancel</button>
              <button onClick={handleSave} disabled={saving||!form.title||!form.duration} style={{ padding:'11px 28px', borderRadius:12, background:'linear-gradient(135deg,#A78BFA,#7C3AED)', border:'none', color:'#FFF', fontSize:13, fontWeight:700, cursor:'pointer', opacity:saving||!form.title||!form.duration?0.5:1, ...F }}>
                {saving?'Saving…':'Save Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}