import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const av = n => n?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?';

const DEMO = [
  { id:1,  agent:'Govand Wali',   qa:'Sizar', queue:'Arabic', date:'2026-03-11', score:71, area:'Hold procedure not followed',    daysAgo:0, status:'Pending Coaching' },
  { id:2,  agent:'Halland Hemn',  qa:'Brwa',  queue:'Badini', date:'2026-03-10', score:58, area:'Communication tone needs work',  daysAgo:1, status:'Pending Coaching' },
  { id:3,  agent:'Rayan Jaafar',  qa:'Miran', queue:'Sorani', date:'2026-03-10', score:67, area:'CRM navigation slow',            daysAgo:1, status:'Pending Coaching' },
  { id:4,  agent:'Ali Khalid',    qa:'Sizar', queue:'Arabic', date:'2026-03-09', score:73, area:'Closing not done properly',      daysAgo:2, status:'Pending Coaching' },
  { id:5,  agent:'Rzgar Ali',     qa:'Brwa',  queue:'Arabic', date:'2026-03-08', score:55, area:'Problem identification weak',    daysAgo:3, status:'Pending Coaching' },
  { id:6,  agent:'Sakar Ahmed',   qa:'Miran', queue:'Sorani', date:'2026-03-07', score:62, area:'Empathy score low',              daysAgo:4, status:'Pending Coaching' },
  { id:7,  agent:'Baran Omer',    qa:'Sizar', queue:'Arabic', date:'2026-03-05', score:60, area:'CRM accuracy issues',            daysAgo:6, status:'Pending Coaching' },
  { id:8,  agent:'Dilshad Karim', qa:'Brwa',  queue:'Badini', date:'2026-03-04', score:57, area:'Hold procedure + tone',          daysAgo:7, status:'Pending Coaching' },
  { id:9,  agent:'Lawin Kosrat',  qa:'Miran', queue:'Sorani', date:'2026-03-07', score:78, area:'Solution accuracy improved',     daysAgo:4, status:'Coached' },
  { id:10, agent:'Yad Jalal',     qa:'Sizar', queue:'Arabic', date:'2026-03-06', score:69, area:'Communication clarity',         daysAgo:5, status:'Coached' },
  { id:11, agent:'Neamat Anwar',  qa:'Brwa',  queue:'Sorani', date:'2026-03-05', score:74, area:'CRM navigation',                daysAgo:6, status:'Coached' },
];

export default function TLCoachingMonitor({ user }) {
  const [items, setItems] = useState(DEMO);
  const [tab, setTab] = useState('pending');
  const [filterQA, setFilterQA] = useState('All');
  const [marking, setMarking] = useState(null);

  const markDone = async (id) => {
    setMarking(id);
    try { await fetch(`http://localhost:8080/api/coaching/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status:'Coached' }) }); } catch {}
    setItems(it=>it.map(i=>i.id===id?{...i,status:'Coached'}:i));
    setMarking(null);
  };

  const pending = items.filter(i=>i.status==='Pending Coaching' && (filterQA==='All'||i.qa===filterQA));
  const done    = items.filter(i=>i.status==='Coached' && (filterQA==='All'||i.qa===filterQA));
  const overdue = pending.filter(i=>i.daysAgo>5);
  const list    = tab==='pending' ? pending : done;

  const sel = { background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 14px', fontSize:13, cursor:'pointer', ...F };

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`select option{background:#131626!important;color:#FFF!important} select{color-scheme:dark}`}</style>

      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'3px', color:'#60A5FA', marginBottom:5 }}>QA TEAM LEAD</div>
        <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:'#FFF' }}>Coaching <span style={{ background:'linear-gradient(90deg,#60A5FA,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', WebkitTextFillColor:'transparent' }}>Monitor</span></h1>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Pending Coaching',   value:pending.length,                                                          color:'#FBBF24', sub:'need follow-up' },
          { label:'Overdue (5+ Days)',   value:overdue.length,                                                          color:'#F87171', sub:'require urgent action' },
          { label:'Coached This Period', value:done.length,                                                             color:'#4ADE80', sub:'completed' },
          { label:'Completion Rate',     value:`${items.length?Math.round(done.length/items.length*100):0}%`,           color:'#60A5FA', sub:'overall rate' },
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

      {/* Tabs + Filter */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.04)', borderRadius:12, padding:4 }}>
          {[['pending','⏳ Pending',pending.length],['done','✓ Coached',done.length]].map(([k,lbl,cnt])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ padding:'8px 18px', borderRadius:9, border:'none', background:tab===k?'rgba(255,255,255,0.1)':'transparent', color:tab===k?'#FFF':'#4A5A78', fontSize:13, fontWeight:700, cursor:'pointer', ...F }}>
              {lbl} <span style={{ fontSize:11, marginLeft:4, opacity:0.7 }}>({cnt})</span>
            </button>
          ))}
        </div>
        <select value={filterQA} onChange={e=>setFilterQA(e.target.value)} style={sel}>
          {['All','Miran','Sizar','Brwa','Mohammed'].map(q=><option key={q}>{q}</option>)}
        </select>
      </div>

      {/* Cards */}
      {list.length===0 && <div style={{ textAlign:'center', padding:'60px', color:'#4A5A78', fontSize:14 }}>No {tab==='pending'?'pending coaching':'coached agents'} found</div>}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:16 }}>
        {list.map(item=>(
          <div key={item.id} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${item.daysAgo>5&&tab==='pending'?'rgba(248,113,113,0.3)':'rgba(255,255,255,0.08)'}`, borderRadius:18, padding:'20px', position:'relative', overflow:'hidden' }}>
            {item.daysAgo>5&&tab==='pending'&&<div style={{ position:'absolute', top:12, right:12, padding:'3px 10px', background:'rgba(248,113,113,0.15)', borderRadius:20, fontSize:11, fontWeight:700, color:'#F87171' }}>Overdue</div>}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${ac(item.agent)}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:ac(item.agent), flexShrink:0 }}>{av(item.agent)}</div>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:'#FFF' }}>{item.agent}</div>
                <div style={{ fontSize:12, color:'#4A5A78', marginTop:2 }}>by {item.qa} · {item.queue}</div>
              </div>
            </div>
            <div style={{ padding:'10px 14px', background:'rgba(255,255,255,0.04)', borderRadius:10, marginBottom:12 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1px', color:'#4A5A78', marginBottom:4, textTransform:'uppercase' }}>Improvement Area</div>
              <div style={{ fontSize:13, color:'#C8D8EC' }}>{item.area}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: tab==='pending'?14:0 }}>
              <span style={{ fontSize:12, color:'#4A5A78' }}>{item.date} · {item.daysAgo===0?'Today':item.daysAgo===1?'Yesterday':`${item.daysAgo} days ago`}</span>
              <span style={{ fontSize:16, fontWeight:800, color:item.score>=80?'#4ADE80':item.score>=60?'#FBBF24':'#F87171' }}>{item.score}%</span>
            </div>
            {tab==='pending' && (
              <button onClick={()=>markDone(item.id)} disabled={marking===item.id} style={{ width:'100%', padding:'10px', borderRadius:10, background:'linear-gradient(135deg,#4ADE80,#10B981)', border:'none', color:'#0D0F1E', fontSize:13, fontWeight:700, cursor:'pointer', opacity:marking===item.id?0.6:1, ...F }}>
                {marking===item.id?'Marking…':'✓ Mark as Coached'}
              </button>
            )}
            {tab==='done' && (
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#4ADE80' }}/>
                <span style={{ fontSize:12, color:'#4ADE80', fontWeight:600 }}>Coaching Completed</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}