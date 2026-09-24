import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';

const inp = { padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#FFFFFF', fontSize:13, outline:'none', fontFamily:"'Inter','Segoe UI',sans-serif" };
const sel = { ...inp, appearance:'none', WebkitAppearance:'none', cursor:'pointer', paddingRight:32, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238FA3C4' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundColor:'rgba(255,255,255,0.05)' };

const DEMO_SESSIONS = [
  { id:1, title:'CRM System Training',         date:'2026-03-12', duration:90,  trainer:'Kak Arsalan', status:'upcoming',  attendees:['Abdullrahman Ali','Govand Wali','Halland Hemn','Aya Edris','Rayan Jaafar'] },
  { id:2, title:'High Bill Handling',           date:'2026-03-08', duration:60,  trainer:'Kak Arsalan', status:'completed', attendees:['Barham Qasim','Ali Khalid','Daryan Bakr','Rzgar Ali'] },
  { id:3, title:'Communication Skills',         date:'2026-03-05', duration:120, trainer:'Kak Arsalan', status:'completed', attendees:['Abdullrahman Ali','Ahmed Saman','Lawin Kosrat','Neamat Anwar','Sozhin Karim','Salm Khairulla'] },
];

export default function SessionsOverview() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(()=>{
    fetch('http://localhost:8080/api/sessions').then(r=>r.json()).then(data=>{
      setSessions(Array.isArray(data)&&data.length>0?data:DEMO_SESSIONS);
      setLoading(false);
    }).catch(()=>{ setSessions(DEMO_SESSIONS); setLoading(false); });
  },[]);

  const filtered = sessions.filter(s=> filterStatus==='all' || s.status===filterStatus);
  const completed = sessions.filter(s=>s.status==='completed').length;
  const upcoming = sessions.filter(s=>s.status==='upcoming').length;

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`select option{background:#131626!important;color:#FFFFFF!important} select{color-scheme:dark}`}</style>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#60A5FA', marginBottom:6 }}>SUPERVISOR VIEW</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:'#FFFFFF' }}>Sessions Overview</h1>
          <div style={{ padding:'7px 16px', borderRadius:20, background:'rgba(96,165,250,0.1)', border:'1px solid rgba(96,165,250,0.2)', fontSize:13, fontWeight:600, color:'#60A5FA' }}>{sessions.length} total</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'Total Sessions', value:sessions.length, color:'#60A5FA' },
          { label:'Completed', value:completed, color:'#4ADE80' },
          { label:'Upcoming', value:upcoming, color:'#FBBF24' },
        ].map((k,i)=>(
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 14px 14px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#4A5A78', marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:26, fontWeight:800, color:'#FFFFFF' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:18 }}>
        {['all','completed','upcoming'].map(s=>(
          <button key={s} onClick={()=>setFilterStatus(s)} style={{ padding:'8px 18px', borderRadius:20, border:'1px solid', cursor:'pointer', fontSize:12, fontWeight:700, transition:'all 0.15s', borderColor:filterStatus===s?'#60A5FA':'rgba(255,255,255,0.1)', background:filterStatus===s?'rgba(96,165,250,0.15)':'transparent', color:filterStatus===s?'#60A5FA':'#8FA3C4' }}>
            {s==='all'?'All':s.charAt(0).toUpperCase()+s.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {loading ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>Loading...</div>
        : filtered.length===0 ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>No sessions found</div>
        : filtered.map((s,i)=>{
          const isOpen = expanded===s.id;
          const attList = Array.isArray(s.attendees)?s.attendees:[];
          return (
            <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', cursor:'pointer' }} onClick={()=>setExpanded(isOpen?null:s.id)}>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:'rgba(96,165,250,0.15)', border:'1px solid rgba(96,165,250,0.25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#60A5FA' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#FFFFFF' }}>{s.title}</div>
                    <div style={{ fontSize:12, color:'#4A5A78', marginTop:2 }}>{s.trainer} · {s.duration} min · {attList.length} attendees</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:12, color:'#4A5A78' }}>{s.date?new Date(s.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):s.date}</span>
                  <span style={{ padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700, background:s.status==='completed'?'rgba(74,222,128,0.1)':'rgba(251,191,36,0.12)', color:s.status==='completed'?'#4ADE80':'#FBBF24' }}>
                    {s.status==='completed'?'✓ Completed':'⏳ Upcoming'}
                  </span>
                  <div style={{ color:'#4A5A78', fontSize:12, transition:'transform 0.2s', transform:isOpen?'rotate(180deg)':'none' }}>▼</div>
                </div>
              </div>
              {isOpen && (
                <div style={{ padding:'0 22px 18px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#4A5A78', margin:'14px 0 10px' }}>Attendees ({attList.length})</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {attList.map((a,j)=>(
                      <span key={j} style={{ padding:'4px 12px', borderRadius:20, background:`${ac(a)}18`, border:`1px solid ${ac(a)}30`, fontSize:12, fontWeight:600, color:ac(a) }}>{a}</span>
                    ))}
                    {attList.length===0&&<span style={{ fontSize:13, color:'#4A5A78' }}>No attendees recorded</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}