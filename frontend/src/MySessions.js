import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';
const slb= p => p>=80?'Excellent':p>=60?'Average':'Needs Work';

const DEMO_EVALS = [
  { overall_score_percentage:90, evaluation_date:'2026-03-10', coaching_completed:true,  level1:'Billing complaints', improvement_area:'None',         feedback:'Great call handling',       phone:'07501234567', ticket_id:'TK-001', qa_name:'Miran' },
  { overall_score_percentage:70, evaluation_date:'2026-03-07', coaching_completed:false, level1:'Inquiries',          improvement_area:'FAQ alignment', feedback:'Review FAQ guidelines',      phone:'07501234568', ticket_id:'TK-002', qa_name:'Miran' },
  { overall_score_percentage:80, evaluation_date:'2026-03-03', coaching_completed:true,  level1:'General complaints', improvement_area:'Tone of voice', feedback:'Good improvement noted',     phone:'07501234569', ticket_id:'TK-003', qa_name:'Miran' },
  { overall_score_percentage:60, evaluation_date:'2026-02-28', coaching_completed:true,  level1:'Service requests',   improvement_area:'CRM tagging',  feedback:'Tag correctly next time',    phone:'07501234570', ticket_id:'TK-004', qa_name:'Miran' },
  { overall_score_percentage:100,evaluation_date:'2026-02-22', coaching_completed:true,  level1:'Inquiries',          improvement_area:'None',         feedback:'Perfect score — well done!', phone:'07501234571', ticket_id:'TK-005', qa_name:'Miran' },
];

const DEMO_SESSIONS = [
  { title:'CRM System Training',   date:'2026-03-12', status:'upcoming',  duration:90,  trainer:'Kak Arsalan', attendees:['Abdullrahman Ali','Govand Wali','Halland Hemn'] },
  { title:'High Bill Handling',    date:'2026-03-08', status:'completed', duration:60,  trainer:'Kak Arsalan', attendees:['Barham Qasim','Ali Khalid'] },
  { title:'Communication Skills',  date:'2026-03-05', status:'completed', duration:120, trainer:'Kak Arsalan', attendees:['Abdullrahman Ali','Lawin Kosrat'] },
];

export default function MySessions({ user }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(()=>{
    fetch('http://localhost:8080/api/sessions').then(r=>r.json()).then(data=>{
      // Filter sessions where this agent is an attendee
      const mine = Array.isArray(data) ? data.filter(s=>{
        if (!user?.name) return true;
        const att = Array.isArray(s.attendees) ? s.attendees : [];
        return att.includes(user.name);
      }) : [];
      setSessions(mine.length>0 ? mine : DEMO_SESSIONS);
      setLoading(false);
    }).catch(()=>{ setSessions(DEMO_SESSIONS); setLoading(false); });
  },[user]);

  const filtered = sessions.filter(s=> tab==='all' || s.status===tab);
  const completed = sessions.filter(s=>s.status==='completed').length;
  const upcoming = sessions.filter(s=>s.status==='upcoming').length;
  const totalMins = sessions.filter(s=>s.status==='completed').reduce((sum,s)=>sum+(s.duration||0),0);

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#60A5FA', marginBottom:6 }}>MY ACCOUNT</div>
        <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:'#FFFFFF' }}>My Sessions</h1>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Sessions', value:sessions.length, color:'#60A5FA' },
          { label:'Completed',      value:completed,       color:'#4ADE80' },
          { label:'Upcoming',       value:upcoming,        color:'#FBBF24' },
          { label:'Training Hours', value:`${Math.floor(totalMins/60)}h ${totalMins%60}m`, color:'#A78BFA' },
        ].map((k,i)=>(
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 14px 14px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#4A5A78', marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:24, fontWeight:800, color:'#FFFFFF' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:18 }}>
        {[['all','All'],['completed','Completed'],['upcoming','Upcoming']].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{ padding:'9px 20px', borderRadius:20, border:'1px solid', cursor:'pointer', fontSize:13, fontWeight:700, transition:'all 0.15s', borderColor:tab===v?'#60A5FA':'rgba(255,255,255,0.1)', background:tab===v?'rgba(96,165,250,0.15)':'transparent', color:tab===v?'#60A5FA':'#8FA3C4' }}>{l}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {loading ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>Loading...</div>
        : filtered.length===0 ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>No sessions found</div>
        : filtered.map((s,i)=>(
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'20px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:s.status==='completed'?'rgba(74,222,128,0.12)':'rgba(251,191,36,0.12)', border:`1px solid ${s.status==='completed'?'rgba(74,222,128,0.25)':'rgba(251,191,36,0.25)'}`, display:'flex', alignItems:'center', justifyContent:'center', color:s.status==='completed'?'#4ADE80':'#FBBF24', flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'#FFFFFF' }}>{s.title}</div>
                <div style={{ fontSize:12, color:'#4A5A78', marginTop:3 }}>{s.trainer} · {s.duration} min</div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:12, color:'#4A5A78' }}>{s.date?new Date(s.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):s.date}</span>
              <span style={{ padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:700, background:s.status==='completed'?'rgba(74,222,128,0.1)':'rgba(251,191,36,0.12)', color:s.status==='completed'?'#4ADE80':'#FBBF24' }}>
                {s.status==='completed'?'✓ Completed':'⏳ Upcoming'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}