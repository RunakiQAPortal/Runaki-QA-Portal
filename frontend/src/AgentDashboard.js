import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, ReferenceLine, ReferenceArea, Tooltip, ResponsiveContainer, Dot } from 'recharts';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';
const slb= p => p>=80?'Excellent':p>=60?'Average':'Needs Work';

const DEMO = {
  evals: [
    { overall_score_percentage:90, evaluation_date:'2026-03-10', coaching_completed:true,  level1:'Billing complaints', improvement_area:'None', feedback:'Great call handling' },
    { overall_score_percentage:70, evaluation_date:'2026-03-07', coaching_completed:false, level1:'Inquiries',          improvement_area:'FAQ alignment', feedback:'Review FAQ guidelines' },
    { overall_score_percentage:80, evaluation_date:'2026-03-03', coaching_completed:true,  level1:'General complaints', improvement_area:'Tone of voice', feedback:'Good improvement' },
    { overall_score_percentage:60, evaluation_date:'2026-02-28', coaching_completed:true,  level1:'Service requests',   improvement_area:'CRM tagging',  feedback:'Tag correctly next time' },
    { overall_score_percentage:100,evaluation_date:'2026-02-22', coaching_completed:true,  level1:'Inquiries',          improvement_area:'None', feedback:'Perfect score!' },
  ],
  sessions: [
    { title:'CRM System Training',   date:'2026-03-12', status:'upcoming',  duration:90  },
    { title:'High Bill Handling',    date:'2026-03-08', status:'completed', duration:60  },
    { title:'Communication Skills',  date:'2026-03-05', status:'completed', duration:120 },
  ],
};

export default function AgentDashboard({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tip, setTip] = useState('Always confirm the customer\'s name and account before diving into the issue. It shows professionalism and saves time.');
  const [allEvals, setAllEvals] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/tips/active').then(r=>r.json()).then(d=>{ if(d?.content) setTip(d.content); }).catch(()=>{});
    fetch('http://localhost:8080/api/evaluations').then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setAllEvals(d); }).catch(()=>{});
    Promise.all([
      fetch('http://localhost:8080/api/evaluations').catch(()=>null),
      fetch('http://localhost:8080/api/sessions').catch(()=>null),
    ]).then(async ([er, sr]) => {
      try {
        const rawEvals = er ? await er.json() : [];
        const allSessions = sr ? await sr.json() : [];
        const myEvals = Array.isArray(rawEvals) ? rawEvals.filter(e => e.agent_name === user?.name) : [];
        setData({
          evals: myEvals.length > 0 ? myEvals : DEMO.evals,
          sessions: Array.isArray(allSessions) && allSessions.length > 0 ? allSessions : DEMO.sessions,
        });
      } catch { setData(DEMO); }
      setLoading(false);
    });
  }, [user]);

  const d = data || DEMO;
  const evals = d.evals || [];
  const sessions = d.sessions || [];
  const avgScore = evals.length ? Math.round(evals.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/evals.length) : 0;
  const pending = evals.filter(e=>!e.coaching_completed).length;
  const latest = evals.length ? [...evals].sort((a,b)=>new Date(b.evaluation_date)-new Date(a.evaluation_date))[0] : null;
  const trend = evals.length >= 2 ? evals.slice(-2) : null;
  const trendDir = trend ? (trend[1].overall_score_percentage - trend[0].overall_score_percentage) : 0;

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Score history for mini chart (last 5)
  const chartEvals = [...evals].sort((a,b)=>new Date(a.evaluation_date)-new Date(b.evaluation_date)).slice(-5);
  const maxH = 60;

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`select option{background:#131626!important;color:#FFFFFF!important} select{color-scheme:dark} .ag-card{transition:transform 0.2s,box-shadow 0.2s} .ag-card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.3)!important}`}</style>

      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#FF6B35', marginBottom:6 }}>AGENT PORTAL</div>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ margin:0, fontSize:30, fontWeight:800, color:'#FFFFFF', lineHeight:1.1 }}>
              {greet}, <span style={{ background:'linear-gradient(135deg,#FF6B35,#FBBF24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{user?.name || 'Agent'}</span>
            </h1>
            <p style={{ margin:'6px 0 0', fontSize:14, color:'#4A5A78' }}>Here's a summary of your QA performance</p>
          </div>
          <div style={{ padding:'8px 16px', borderRadius:20, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', fontSize:12, color:'#8FA3C4' }}>
            {new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
        {[
          { label:'Total Evaluations', value:evals.length, color:'#FF6B35',
            icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg> },
          { label:'My Average Score',  value:`${avgScore}%`, color:sc(avgScore),
            icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
          { label:'Pending Coaching',  value:pending, color:pending>0?'#FBBF24':'#4ADE80',
            icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
          { label:'Sessions Attended', value:sessions.filter(s=>s.status==='completed').length, color:'#60A5FA',
            icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
        ].map((k,i)=>(
          <div key={i} className="ag-card" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'22px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 18px 18px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ width:38, height:38, borderRadius:11, background:`${k.color}18`, border:`1px solid ${k.color}30`, display:'flex', alignItems:'center', justifyContent:'center', color:k.color, marginBottom:14 }}>{k.icon}</div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#4A5A78', marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:30, fontWeight:800, color:'#FFFFFF' }}>{loading?'—':k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:20, marginBottom:20 }}>

        {/* Score History — visual card timeline */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px', position:'relative', overflow:'hidden' }}>
          {/* subtle bg glow */}
          <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'#FF6B35', opacity:0.04, filter:'blur(60px)', pointerEvents:'none' }}/>

          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2.5px', color:'#FF6B35', marginBottom:5 }}>YOUR JOURNEY</div>
              <div style={{ fontSize:16, fontWeight:800, color:'#FFF' }}>Score History</div>
            </div>
            {trendDir !== 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:20, background:trendDir>0?'rgba(74,222,128,0.08)':'rgba(248,113,113,0.08)', border:`1px solid ${trendDir>0?'rgba(74,222,128,0.2)':'rgba(248,113,113,0.2)'}` }}>
                <span style={{ fontSize:16 }}>{trendDir>0?'📈':'📉'}</span>
                <span style={{ fontSize:13, fontWeight:800, color:trendDir>0?'#4ADE80':'#F87171' }}>{trendDir>0?'+':''}{trendDir}%</span>
                <span style={{ fontSize:11, color:'#8FA3C4' }}>vs last eval</span>
              </div>
            )}
          </div>

          {chartEvals.length === 0 ? (
            <div style={{ color:'#4A5A78', fontSize:13, textAlign:'center', padding:'40px 0' }}>No evaluations yet — your history will show here</div>
          ) : (()=>{
            const chartData = chartEvals.map(e => ({
              date: e.evaluation_date ? new Date(e.evaluation_date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : '—',
              score: e.overall_score_percentage,
            }));
            const CustomDot = (props) => {
              const { cx, cy, payload, index } = props;
              const isLast = index === chartData.length - 1;
              const clr = sc(payload.score);
              return (
                <g key={index}>
                  {/* glow ring */}
                  <circle cx={cx} cy={cy} r={isLast?18:14} fill={clr} fillOpacity={isLast?0.12:0.07}/>
                  {/* dot border */}
                  <circle cx={cx} cy={cy} r={isLast?13:11} fill="#0D0F1E" stroke={clr} strokeWidth={isLast?2.5:1.5}/>
                  {/* score text */}
                  <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle" fill={clr} fontSize={isLast?11:9} fontWeight="900" fontFamily="Inter,sans-serif">{payload.score}</text>
                  {isLast && <circle cx={cx} cy={cy} r={17} fill="none" stroke={clr} strokeWidth={1} strokeDasharray="3 2" opacity={0.5}/>}
                </g>
              );
            };
            const CTooltip = ({ active, payload, label }) => {
              if (!active||!payload?.length) return null;
              const s = payload[0].value;
              return (
                <div style={{ background:'#131626', border:`1px solid ${sc(s)}44`, borderRadius:12, padding:'10px 16px', fontFamily:"'Inter',sans-serif" }}>
                  <div style={{ fontSize:11, color:'#4A5A78', marginBottom:4 }}>{label}</div>
                  <div style={{ fontSize:20, fontWeight:900, color:sc(s), lineHeight:1 }}>{s}%</div>
                  <div style={{ fontSize:10, fontWeight:700, color:sc(s), marginTop:4, letterSpacing:'1px' }}>{slb(s)}</div>
                </div>
              );
            };
            return (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData} margin={{ top:22, right:24, bottom:0, left:24 }}>
                    {/* zone bands */}
                    <ReferenceArea y1={0}  y2={60} fill="#F87171" fillOpacity={0.04}/>
                    <ReferenceArea y1={60} y2={80} fill="#FBBF24" fillOpacity={0.06}/>
                    <ReferenceArea y1={80} y2={100} fill="#4ADE80" fillOpacity={0.05}/>
                    {/* zone boundary lines */}
                    <ReferenceLine y={60} stroke="#FBBF24" strokeDasharray="4 4" strokeOpacity={0.25} strokeWidth={1}/>
                    <ReferenceLine y={80} stroke="#4ADE80" strokeDasharray="4 4" strokeOpacity={0.25} strokeWidth={1}/>
                    {/* avg line */}
                    <ReferenceLine y={avgScore} stroke={sc(avgScore)} strokeDasharray="6 3" strokeOpacity={0.4} strokeWidth={1.5}/>
                    <XAxis dataKey="date" tick={{ fill:'#4A5A78', fontSize:10, fontFamily:"'Inter',sans-serif" }} axisLine={false} tickLine={false} dy={8}/>
                    <Tooltip content={<CTooltip/>}/>
                    <Line type="monotoneX" dataKey="score" stroke="rgba(255,255,255,0.15)" strokeWidth={2} dot={<CustomDot/>} activeDot={false} isAnimationActive={true} animationDuration={800}/>
                  </LineChart>
                </ResponsiveContainer>

                {/* Zone key strip */}
                <div style={{ display:'flex', gap:14, marginBottom:16, marginTop:4, paddingLeft:4 }}>
                  {[['#F87171','Needs Work','< 60%'],['#FBBF24','Average','60–79%'],['#4ADE80','Excellent','80–100%']].map(([c,l,r])=>(
                    <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:10, height:10, borderRadius:3, background:c, opacity:0.8 }}/>
                      <span style={{ fontSize:10, fontWeight:700, color:c }}>{l}</span>
                      <span style={{ fontSize:10, color:'#2E3A55' }}>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Tip of the Day — inline compact */}
                {tip && (
                  <div style={{ marginBottom:16, padding:'12px 16px', borderRadius:14, background:'rgba(244,114,182,0.07)', border:'1px solid rgba(244,114,182,0.18)', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:'rgba(244,114,182,0.15)', border:'1px solid rgba(244,114,182,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2"><path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.2 4.16-3 5.2V17H9v-2.8A6 6 0 016 9a6 6 0 016-6z"/></svg>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                        <span style={{ fontSize:9, fontWeight:800, letterSpacing:'2px', color:'#F472B6' }}>TIP OF THE DAY</span>
                        <span style={{ padding:'1px 7px', borderRadius:20, background:'rgba(244,114,182,0.12)', border:'1px solid rgba(244,114,182,0.2)', fontSize:9, fontWeight:700, color:'#F472B6' }}>FROM YOUR TEAM LEAD</span>
                      </div>
                      <p style={{ margin:0, fontSize:12, fontWeight:600, color:'#C8D8EC', lineHeight:1.5, fontStyle:'italic', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>"{tip}"</p>
                    </div>
                  </div>
                )}

                {/* Average bar */}
                <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'12px 16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <span style={{ fontSize:11, color:'#4A5A78', fontWeight:600 }}>Your overall average</span>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:20, fontWeight:900, color:sc(avgScore), letterSpacing:'-0.5px' }}>{avgScore}%</span>
                      <span style={{ padding:'3px 10px', borderRadius:20, background:sbg(avgScore), fontSize:11, fontWeight:700, color:sc(avgScore) }}>{slb(avgScore)}</span>
                    </div>
                  </div>
                  <div style={{ position:'relative', height:8, borderRadius:6, background:'rgba(255,255,255,0.05)' }}>
                    <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${avgScore}%`, background:`linear-gradient(90deg,#F87171 0%,#FBBF24 60%,#4ADE80 100%)`, borderRadius:6 }}/>
                    <div style={{ position:'absolute', top:-1, left:`${avgScore}%`, transform:'translateX(-50%)', width:2, height:10, background:'#FFF', borderRadius:2, boxShadow:`0 0 8px ${sc(avgScore)}` }}/>
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Latest Evaluation + Sessions */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Latest Eval */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'20px 22px', flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#A78BFA', marginBottom:4 }}>LATEST</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#FFFFFF', marginBottom:14 }}>Most Recent Evaluation</div>
            {!latest ? (
              <div style={{ color:'#4A5A78', fontSize:13 }}>No evaluations yet</div>
            ) : (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <span style={{ padding:'6px 16px', borderRadius:20, background:sbg(latest.overall_score_percentage||0), fontSize:16, fontWeight:800, color:sc(latest.overall_score_percentage||0) }}>{latest.overall_score_percentage}%</span>
                  <span style={{ fontSize:12, color:'#4A5A78' }}>
                    {latest.evaluation_date?new Date(latest.evaluation_date).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'}):'—'}
                  </span>
                </div>
                {[
                  { l:'Category',     v:latest.level1||'—' },
                  { l:'Coaching',     v:latest.coaching_completed?'✓ Done':'⏳ Pending' },
                  { l:'Feedback',     v:latest.feedback||'—' },
                ].map((f,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:i<2?'1px solid rgba(255,255,255,0.05)':'none' }}>
                    <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', color:'#4A5A78' }}>{f.l}</span>
                    <span style={{ fontSize:12, fontWeight:600, color: f.l==='Coaching'?(latest.coaching_completed?'#4ADE80':'#FBBF24'):'#C8D8EC', maxWidth:180, textAlign:'right' }}>{f.v}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Upcoming session */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'18px 22px' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#60A5FA', marginBottom:4 }}>NEXT</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#FFFFFF', marginBottom:12 }}>Upcoming Session</div>
            {(() => {
              const next = sessions.find(s=>s.status==='upcoming');
              if (!next) return <div style={{ fontSize:13, color:'#4A5A78' }}>No upcoming sessions</div>;
              return (
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:'rgba(96,165,250,0.15)', border:'1px solid rgba(96,165,250,0.25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#60A5FA', flexShrink:0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#FFFFFF' }}>{next.title}</div>
                    <div style={{ fontSize:11, color:'#4A5A78', marginTop:3 }}>
                      {next.date?new Date(next.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—'} · {next.duration} min
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>



      {/* Evaluations + Leaderboard side by side */}
      {(() => {

        // Demo leaderboard fallback
        const DEMO_BOARD = [
          { name:'Halland Hemn',    avg:97, queue:'Sorani'  },
          { name:'Baran Omer',      avg:95, queue:'Arabic'  },
          { name:'Daryan Bakr',     avg:93, queue:'Badini'  },
          { name:'Sozhin Karim',    avg:91, queue:'Sorani'  },
          { name:'Govand Wali',     avg:90, queue:'Sorani'  },
          { name:'Agent 1',         avg:88, queue:'Sorani'  },
          { name:'Lawin Kosrat',    avg:87, queue:'Arabic'  },
          { name:'Tara Omer',       avg:85, queue:'Badini'  },
          { name:'Sakar Ahmed',     avg:84, queue:'Arabic'  },
          { name:'Rzgar Ali',       avg:83, queue:'Sorani'  },
          { name:'Wrya Hasan',      avg:82, queue:'Badini'  },
          { name:'Zana Kareem',     avg:81, queue:'Sorani'  },
          { name:'Yad Jalal',       avg:80, queue:'Arabic'  },
          { name:'Neamat Anwar',    avg:79, queue:'Badini'  },
          { name:'Rayan Jaafar',    avg:78, queue:'Arabic'  },
          { name:'Shelan Fraidoon', avg:77, queue:'Sorani'  },
          { name:'Karwan Wali',     avg:76, queue:'Arabic'  },
          { name:'Mohammed Soran',  avg:75, queue:'Sorani'  },
          { name:'Aya Edris',       avg:74, queue:'Arabic'  },
          { name:'Barham Qasim',    avg:73, queue:'Badini'  },
        ];

        // Build leaderboard
        const map = {};
        allEvals.forEach(e => {
          const n = e.agent_name; if(!n) return;
          if(!map[n]) map[n]={ name:n, sum:0, total:0, queue:e.queue||'—' };
          map[n].total++; map[n].sum+=(e.overall_score_percentage||0);
          if(e.queue) map[n].queue = e.queue; // keep latest queue
        });
        const liveBoard = Object.values(map).map(a=>({...a, avg:Math.round(a.sum/a.total)})).sort((a,b)=>b.avg-a.avg);
        const board = liveBoard.length >= 3 ? liveBoard : DEMO_BOARD;
        const top20 = board.slice(0,20);
        const myRank = board.findIndex(a=>a.name===user?.name);
        const isInTop20 = myRank>=0 && myRank<20;

        const ac2 = n => { const C=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C']; let h=0; for(let i=0;i<(n||'').length;i++) h=(h*31+n.charCodeAt(i))&0xffff; return C[h%C.length]; };
        const av2 = n => n ? n.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) : '?';
        const queueColor = q => q==='Sorani'?'#60A5FA':q==='Arabic'?'#34D399':q==='Badini'?'#A78BFA':'#4A5A78';
        const medals = ['🥇','🥈','🥉'];

        return (
          <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>

            {/* Left — Evaluations table */}
            <div style={{ flex:1, minWidth:0, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
              <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#34D399', marginBottom:3 }}>HISTORY</div>
                  <div style={{ fontSize:16, fontWeight:800, color:'#FFFFFF' }}>My Evaluations</div>
                </div>
                <span style={{ fontSize:12, color:'#4A5A78' }}>{evals.length} total</span>
              </div>
              <div>
                {evals.length === 0 ? (
                  <div style={{ padding:'50px', textAlign:'center', color:'#4A5A78' }}>No evaluations yet</div>
                ) : [...evals].sort((a,b)=>new Date(b.evaluation_date)-new Date(a.evaluation_date)).slice(0,8).map((e,i,arr)=>(
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 1fr 110px 110px', padding:'13px 20px', borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.04)':'none', alignItems:'center' }}>
                    <span style={{ padding:'5px 10px', borderRadius:20, background:sbg(e.overall_score_percentage||0), fontSize:13, fontWeight:800, color:sc(e.overall_score_percentage||0), textAlign:'center' }}>{e.overall_score_percentage??'—'}%</span>
                    <div style={{ paddingLeft:14 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'#E2E8F0' }}>{e.level1||'—'}</div>
                      <div style={{ fontSize:11, color:'#4A5A78', marginTop:2 }}>{e.improvement_area && e.improvement_area!=='None'?`Improve: ${e.improvement_area}`:e.feedback||'—'}</div>
                    </div>
                    <span style={{ padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:e.coaching_completed?'rgba(74,222,128,0.1)':'rgba(251,191,36,0.12)', color:e.coaching_completed?'#4ADE80':'#FBBF24', textAlign:'center' }}>
                      {e.coaching_completed?'✓ Coached':'⏳ Pending'}
                    </span>
                    <div style={{ fontSize:12, color:'#4A5A78', textAlign:'right' }}>
                      {e.evaluation_date?new Date(e.evaluation_date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Leaderboard panel */}
            <div style={{ width:300, flexShrink:0, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
              {/* Panel header */}
              <div style={{ padding:'16px 18px', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'linear-gradient(135deg,rgba(251,191,36,0.06),rgba(255,107,53,0.04))', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#FBBF24', marginBottom:3 }}>TOP PERFORMERS</div>
                  <div style={{ fontSize:14, fontWeight:800, color:'#FFF' }}>Leaderboard</div>
                </div>
                <div style={{ padding:'4px 10px', borderRadius:20, background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.2)', fontSize:11, fontWeight:700, color:'#FBBF24' }}>Top 20</div>
              </div>

              {/* Scrollable list */}
              <div style={{ maxHeight:480, overflowY:'auto' }}>
                {top20.length===0 ? (
                  <div style={{ padding:'32px 18px', textAlign:'center', color:'#4A5A78', fontSize:12 }}>No data yet</div>
                ) : top20.map((a,i)=>{
                  const isMe = a.name===user?.name;
                  return (
                    <div key={a.name} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:isMe?'rgba(255,107,53,0.08)':'transparent', borderLeft:isMe?'3px solid #FF6B35':'3px solid transparent', transition:'background 0.15s' }}>
                      {/* Rank */}
                      <div style={{ width:26, textAlign:'center', flexShrink:0 }}>
                        {i<3
                          ? <span style={{ fontSize:16 }}>{medals[i]}</span>
                          : <span style={{ fontSize:12, fontWeight:800, color:'#4A5A78' }}>{i+1}</span>
                        }
                      </div>
                      {/* Avatar */}
                      <div style={{ width:28, height:28, borderRadius:7, background:`${ac2(a.name)}22`, border:isMe?`1px solid ${ac2(a.name)}55`:'1px solid transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:800, color:ac2(a.name), flexShrink:0 }}>{av2(a.name)}</div>
                      {/* Name + Queue */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:isMe?700:600, color:isMe?'#FF8C5A':'#FFF', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.name}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
                          {isMe && <span style={{ fontSize:9, fontWeight:800, color:'#FF6B35', letterSpacing:'0.5px' }}>YOU ·</span>}
                          <span style={{ fontSize:9, fontWeight:700, color:queueColor(a.queue) }}>{a.queue}</span>
                        </div>
                      </div>
                      {/* Score */}
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontSize:14, fontWeight:800, color:sc(a.avg) }}>{a.avg}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* My rank if not in top 20 — just a footer note */}
              {!isInTop20 && myRank>=0 && (
                <div style={{ padding:'12px 14px', borderTop:'1px dashed rgba(255,255,255,0.08)', background:'rgba(255,107,53,0.04)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:11, color:'#FF6B35', fontWeight:700 }}>Your rank</span>
                  <span style={{ fontSize:13, fontWeight:800, color:'#FF8C5A' }}>#{myRank+1}</span>
                </div>
              )}
            </div>

          </div>
        );
      })()}
    </div>
  );
}