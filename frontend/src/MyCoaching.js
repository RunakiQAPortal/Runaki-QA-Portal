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

export default function MyCoaching({ user }) {
  const [pending, setPending] = useState([]);
  const [done, setDone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

  useEffect(()=>{
    fetch('http://localhost:8080/api/evaluations').then(r=>r.json()).then(data=>{
      const mine = Array.isArray(data) ? data.filter(e=>e.agent_name===user?.name) : [];
      const src = mine.length>0 ? mine : DEMO_EVALS;
      setPending(src.filter(e=>!e.coaching_completed).sort((a,b)=>new Date(b.evaluation_date)-new Date(a.evaluation_date)));
      setDone(src.filter(e=>e.coaching_completed).sort((a,b)=>new Date(b.evaluation_date)-new Date(a.evaluation_date)));
      setLoading(false);
    }).catch(()=>{
      setPending(DEMO_EVALS.filter(e=>!e.coaching_completed));
      setDone(DEMO_EVALS.filter(e=>e.coaching_completed));
      setLoading(false);
    });
  },[user]);

  const list = tab==='pending' ? pending : done;

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`select option{background:#131626!important;color:#FFFFFF!important} select{color-scheme:dark}`}</style>

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#FBBF24', marginBottom:6 }}>MY ACCOUNT</div>
        <h1 style={{ margin:0, fontSize:28, fontWeight:800, color:'#FFFFFF' }}>My Coaching</h1>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Pending Coaching', value:pending.length, color:'#FBBF24', bg:'rgba(251,191,36,0.08)' },
          { label:'Coaching Done',    value:done.length,    color:'#4ADE80', bg:'rgba(74,222,128,0.08)' },
          { label:'Completion Rate',  value:done.length+pending.length>0?`${Math.round(done.length/(done.length+pending.length)*100)}%`:'—', color:'#60A5FA', bg:'rgba(96,165,250,0.08)' },
        ].map((k,i)=>(
          <div key={i} style={{ background:k.bg, border:`1px solid ${k.color}25`, borderRadius:16, padding:'22px', textAlign:'center' }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:k.color, marginBottom:8, opacity:0.8 }}>{k.label}</div>
            <div style={{ fontSize:36, fontWeight:800, color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:18 }}>
        {[['pending',`Pending (${pending.length})`],['done',`Completed (${done.length})`]].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{ padding:'9px 20px', borderRadius:20, border:'1px solid', cursor:'pointer', fontSize:13, fontWeight:700, transition:'all 0.15s', borderColor:tab===v?'#FBBF24':'rgba(255,255,255,0.1)', background:tab===v?'rgba(251,191,36,0.15)':'transparent', color:tab===v?'#FBBF24':'#8FA3C4' }}>{l}</button>
        ))}
      </div>

      {/* Cards */}
      {loading ? <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>Loading...</div>
      : list.length===0 ? (
        <div style={{ padding:'60px', textAlign:'center' }}>
          <div style={{ fontSize:36, marginBottom:10, opacity:0.4 }}>{tab==='pending'?'🎉':'📋'}</div>
          <div style={{ fontSize:15, fontWeight:700, color:tab==='pending'?'#4ADE80':'#4A5A78' }}>
            {tab==='pending'?'No pending coaching — great job!':'No completed coaching yet'}
          </div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
          {list.map((e,i)=>(
            <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${tab==='pending'?'rgba(251,191,36,0.2)':'rgba(74,222,128,0.15)'}`, borderRadius:18, padding:'22px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:tab==='pending'?'linear-gradient(90deg,#FBBF24,#F59E0B)':'linear-gradient(90deg,#4ADE80,#22C55E)', borderRadius:'0 0 18px 18px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:tab==='pending'?'#FBBF24':'#4ADE80', opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:tab==='pending'?'#FBBF24':'#4ADE80', boxShadow:tab==='pending'?'0 0 8px #FBBF24,0 0 14px #FBBF2488':'0 0 8px #4ADE80,0 0 14px #4ADE8088' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:12, color:'#8FA3C4', marginBottom:3 }}>by {e.qa_name||'QA Officer'}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#FFFFFF' }}>{e.level1||'—'}</div>
                </div>
                <span style={{ padding:'5px 14px', borderRadius:20, background:sbg(e.overall_score_percentage||0), fontSize:14, fontWeight:800, color:sc(e.overall_score_percentage||0) }}>{e.overall_score_percentage}%</span>
              </div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#4A5A78', marginBottom:4 }}>Area to Improve</div>
              <div style={{ fontSize:13, color:'#C8D8EC', marginBottom:10 }}>{e.improvement_area||'—'}</div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#4A5A78', marginBottom:4 }}>Feedback</div>
              <div style={{ fontSize:13, color:'#C8D8EC', marginBottom:10 }}>{e.feedback||'—'}</div>
              <div style={{ fontSize:11, color:'#4A5A78', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:10, marginTop:4 }}>
                {e.evaluation_date?new Date(e.evaluation_date).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'}):'—'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}