import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const av = n => n?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?';

const DEMO_SESSIONS = [
  { id:1, title:'CRM System Training',   date:'2026-03-12', duration:90,  status:'upcoming',  attendees:['Abdullrahman Ali','Govand Wali','Halland Hemn','Aya Edris','Rayan Jaafar'] },
  { id:2, title:'High Bill Handling',    date:'2026-03-08', duration:60,  status:'completed', attendees:['Barham Qasim','Ali Khalid','Daryan Bakr','Rzgar Ali'] },
  { id:3, title:'Communication Skills',  date:'2026-03-05', duration:120, status:'completed', attendees:['Abdullrahman Ali','Ahmed Saman','Lawin Kosrat','Neamat Anwar','Sozhin Karim','Salm Khairulla'] },
  { id:4, title:'INDRA Calculator Deep Dive', date:'2026-02-28', duration:90, status:'completed', attendees:['Govand Wali','Haryad Muhsin','Karwan Wali','Mohammed Soran'] },
];

const DEMO_VIVA = [
  { id:1, agentName:'Abdullrahman Ali', vivaName:'High Bill VIVA',      qaOfficer:'Miran', date:'10 Mar 2026', score:4, totalQ:4, pct:100 },
  { id:2, agentName:'Govand Wali',      vivaName:'CRM Navigation VIVA', qaOfficer:'Sizar', date:'09 Mar 2026', score:2, totalQ:3, pct:67  },
  { id:3, agentName:'Halland Hemn',     vivaName:'High Bill VIVA',      qaOfficer:'Brwa',  date:'09 Mar 2026', score:3, totalQ:4, pct:75  },
  { id:4, agentName:'Aya Edris',        vivaName:'CRM Navigation VIVA', qaOfficer:'Sizar', date:'08 Mar 2026', score:1, totalQ:3, pct:33  },
  { id:5, agentName:'Rayan Jaafar',     vivaName:'High Bill VIVA',      qaOfficer:'Miran', date:'07 Mar 2026', score:4, totalQ:4, pct:100 },
];

export default function TrainerDashboard({ user }) {
  const [sessions, setSessions] = useState([]);
  const [vivas, setVivas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/sessions').catch(()=>null),
      fetch('http://localhost:8080/api/viva').catch(()=>null),
    ]).then(async ([sr, vr]) => {
      try {
        const s = sr ? await sr.json() : [];
        const v = vr ? await vr.json() : [];
        setSessions(Array.isArray(s)&&s.length>0 ? s : DEMO_SESSIONS);
        setVivas(Array.isArray(v)&&v.length>0 ? v : DEMO_VIVA);
      } catch { setSessions(DEMO_SESSIONS); setVivas(DEMO_VIVA); }
      setLoading(false);
    });
  }, []);

  const completed = sessions.filter(s=>s.status==='completed').length;
  const upcoming  = sessions.filter(s=>s.status==='upcoming').length;
  const totalMins = sessions.filter(s=>s.status==='completed').reduce((sum,s)=>sum+(s.duration||0),0);
  const totalAttendees = sessions.reduce((sum,s)=>{
    const a = Array.isArray(s.attendees)?s.attendees:[];
    return sum + a.length;
  }, 0);
  const vivaPass = vivas.filter(v=>(v.pct||0)>=60).length;
  const vivaPassRate = vivas.length ? Math.round(vivaPass/vivas.length*100) : 0;

  const hour = new Date().getHours();
  const greet = hour<12?'Good Morning':hour<17?'Good Afternoon':'Good Evening';

  const nextSession = [...sessions].filter(s=>s.status==='upcoming')
    .sort((a,b)=>new Date(a.date)-new Date(b.date))[0];

  const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
  const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';

  const KPI_CARDS = [
    { label:'Total Sessions',   value: sessions.length,             color:'#60A5FA' },
    { label:'Completed',        value: completed,                   color:'#4ADE80' },
    { label:'Upcoming',         value: upcoming,                    color:'#FBBF24' },
    { label:'Training Hours',   value:`${Math.floor(totalMins/60)}h ${totalMins%60}m`, color:'#A78BFA' },
    { label:'Total Attendees',  value: totalAttendees,              color:'#FF6B35' },
    { label:'VIVA Pass Rate',   value:`${vivaPassRate}%`,           color: sc(vivaPassRate) },
  ];

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`.tr-row:hover{background:rgba(255,255,255,0.04)!important} .tr-card{transition:transform 0.2s,box-shadow 0.2s} .tr-card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.3)!important}`}</style>

      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#A78BFA', marginBottom:6 }}>TRAINER PORTAL</div>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ margin:0, fontSize:30, fontWeight:800, color:'#FFFFFF', lineHeight:1.1 }}>
              {greet}, <span style={{ background:'linear-gradient(135deg,#A78BFA,#60A5FA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{user?.name||'Trainer'}</span>
            </h1>
            <p style={{ margin:'6px 0 0', fontSize:14, color:'#4A5A78' }}>Your training sessions and VIVA results overview</p>
          </div>
          <div style={{ padding:'8px 16px', borderRadius:20, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', fontSize:12, color:'#8FA3C4' }}>
            {new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:14, marginBottom:28 }}>
        {KPI_CARDS.map((k,i)=>(
          <div key={i} className="tr-card" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'18px 16px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 16px 16px' }}/>
            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>
            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#4A5A78', marginBottom:8 }}>{k.label}</div>
            <div style={{ fontSize:26, fontWeight:800, color:'#FFFFFF' }}>{loading?'—':k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, marginBottom:20 }}>

        {/* Sessions List */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#60A5FA', marginBottom:3 }}>SESSIONS</div>
              <div style={{ fontSize:16, fontWeight:800, color:'#FFFFFF' }}>All Training Sessions</div>
            </div>
            <span style={{ fontSize:12, color:'#4A5A78' }}>{sessions.length} total</span>
          </div>
          <div>
            {sessions.length===0 ? (
              <div style={{ padding:'40px', textAlign:'center', color:'#4A5A78' }}>No sessions yet</div>
            ) : [...sessions].sort((a,b)=>new Date(b.date)-new Date(a.date)).map((s,i)=>{
              const attList = Array.isArray(s.attendees)?s.attendees:[];
              return (
                <div key={i} className="tr-row" style={{ padding:'16px 24px', borderBottom:i<sessions.length-1?'1px solid rgba(255,255,255,0.04)':'none', background:'transparent', transition:'background 0.15s' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:attList.length>0?10:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:38, height:38, borderRadius:11, background:s.status==='completed'?'rgba(74,222,128,0.12)':'rgba(251,191,36,0.12)', border:`1px solid ${s.status==='completed'?'rgba(74,222,128,0.25)':'rgba(251,191,36,0.25)'}`, display:'flex', alignItems:'center', justifyContent:'center', color:s.status==='completed'?'#4ADE80':'#FBBF24', flexShrink:0 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:'#FFFFFF' }}>{s.title}</div>
                        <div style={{ fontSize:11, color:'#4A5A78', marginTop:2 }}>{s.duration} min · {attList.length} attendees</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                      <span style={{ fontSize:12, color:'#4A5A78' }}>{s.date?new Date(s.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):s.date}</span>
                      <span style={{ padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:s.status==='completed'?'rgba(74,222,128,0.1)':'rgba(251,191,36,0.12)', color:s.status==='completed'?'#4ADE80':'#FBBF24' }}>
                        {s.status==='completed'?'✓ Done':'⏳ Upcoming'}
                      </span>
                    </div>
                  </div>
                  {attList.length>0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, paddingLeft:50 }}>
                      {attList.slice(0,4).map((a,j)=>(
                        <span key={j} style={{ padding:'2px 10px', borderRadius:20, background:`${ac(a)}18`, border:`1px solid ${ac(a)}30`, fontSize:11, fontWeight:600, color:ac(a) }}>{a.split(' ')[0]}</span>
                      ))}
                      {attList.length>4 && <span style={{ padding:'2px 10px', borderRadius:20, background:'rgba(255,255,255,0.06)', fontSize:11, color:'#8FA3C4' }}>+{attList.length-4} more</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Next Session */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'20px 22px' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#FBBF24', marginBottom:4 }}>NEXT UP</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#FFFFFF', marginBottom:14 }}>Upcoming Session</div>
            {!nextSession ? (
              <div style={{ fontSize:13, color:'#4A5A78' }}>No upcoming sessions scheduled</div>
            ) : (
              <>
                <div style={{ fontSize:14, fontWeight:700, color:'#FFFFFF', marginBottom:6 }}>{nextSession.title}</div>
                <div style={{ fontSize:12, color:'#8FA3C4', marginBottom:10 }}>
                  {nextSession.date?new Date(nextSession.date).toLocaleDateString('en-GB',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}):nextSession.date}
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <span style={{ padding:'4px 12px', borderRadius:20, background:'rgba(251,191,36,0.12)', fontSize:12, fontWeight:700, color:'#FBBF24' }}>{nextSession.duration} min</span>
                  <span style={{ padding:'4px 12px', borderRadius:20, background:'rgba(96,165,250,0.12)', fontSize:12, fontWeight:700, color:'#60A5FA' }}>
                    {Array.isArray(nextSession.attendees)?nextSession.attendees.length:0} agents
                  </span>
                </div>
              </>
            )}
          </div>

          {/* VIVA Results Summary */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'20px 22px', flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#34D399', marginBottom:4 }}>VIVA</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#FFFFFF', marginBottom:14 }}>Recent VIVA Results</div>
            {vivas.length===0 ? (
              <div style={{ fontSize:13, color:'#4A5A78' }}>No VIVA results yet</div>
            ) : (
              <>
                {/* Pass rate bar */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:12, color:'#8FA3C4' }}>Pass Rate</span>
                    <span style={{ fontSize:13, fontWeight:700, color:sc(vivaPassRate) }}>{vivaPassRate}%</span>
                  </div>
                  <div style={{ height:8, background:'rgba(255,255,255,0.07)', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${vivaPassRate}%`, background:`linear-gradient(90deg,#34D399,#10B981)`, borderRadius:4 }}/>
                  </div>
                </div>
                {/* Last 4 results */}
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {vivas.slice(0,4).map((v,i)=>(
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 10px', background:'rgba(255,255,255,0.04)', borderRadius:10 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:28, height:28, borderRadius:7, background:`${ac(v.agentName)}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:ac(v.agentName), flexShrink:0 }}>
                          {av(v.agentName)}
                        </div>
                        <span style={{ fontSize:12, fontWeight:600, color:'#C8D8EC' }}>{v.agentName?.split(' ')[0]}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:11, color:'#4A5A78' }}>{v.score}/{v.totalQ}</span>
                        <span style={{ padding:'2px 8px', borderRadius:20, background:sbg(v.pct||0), fontSize:11, fontWeight:700, color:sc(v.pct||0) }}>{v.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          {
            label:'Most Attended Session',
            value: sessions.length>0 ? [...sessions].sort((a,b)=>(Array.isArray(b.attendees)?b.attendees.length:0)-(Array.isArray(a.attendees)?a.attendees.length:0))[0]?.title || '—' : '—',
            sub: sessions.length>0 ? `${Math.max(...sessions.map(s=>Array.isArray(s.attendees)?s.attendees.length:0))} agents` : '',
            color:'#FF6B35'
          },
          {
            label:'Total Training Time',
            value:`${Math.floor(totalMins/60)}h ${totalMins%60}m`,
            sub: `across ${completed} completed sessions`,
            color:'#A78BFA'
          },
          {
            label:'VIVA Conducted',
            value: vivas.length,
            sub:`${vivaPass} passed · ${vivas.length-vivaPass} failed`,
            color:'#34D399'
          },
        ].map((s,i)=>(
          <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'20px 22px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-20, right:-20, width:70, height:70, borderRadius:'50%', background:s.color, opacity:0.08, filter:'blur(20px)' }}/>
            <div style={{ position:'absolute', top:14, right:14, width:6, height:6, borderRadius:'50%', background:s.color, boxShadow:`0 0 8px ${s.color}` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#4A5A78', marginBottom:6 }}>{s.label}</div>
            <div style={{ fontSize:20, fontWeight:800, color:'#FFFFFF', marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:11, color:s.color, fontWeight:600 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}