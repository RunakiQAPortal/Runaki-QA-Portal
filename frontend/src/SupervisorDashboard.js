import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';
const slb= p => p>=80?'Excellent':p>=60?'Average':'Needs Work';

const DEMO = {
  kpis: { totalAgents:103, totalEvals:147, avgScore:76, pendingCoaching:24, activeSessions:3, spotChecks:38 },
  qaOfficers: [
    { name:'Miran',    evals:42, avgScore:84, pending:6  },
    { name:'Sizar',    evals:38, avgScore:78, pending:8  },
    { name:'Brwa',     evals:36, avgScore:91, pending:2  },
    { name:'Mohammed', evals:31, avgScore:66, pending:8  },
  ],
  recentEvals: [
    { agent:'Abdullrahman Ali', qa:'Miran',    score:90, date:'10 Mar' },
    { agent:'Govand Wali',      qa:'Sizar',    score:70, date:'10 Mar' },
    { agent:'Halland Hemn',     qa:'Brwa',     score:100,date:'09 Mar' },
    { agent:'Aya Edris',        qa:'Sizar',    score:50, date:'09 Mar' },
    { agent:'Rayan Jaafar',     qa:'Miran',    score:80, date:'08 Mar' },
  ],
  queueStats: [
    { name:'Sorani',  agents:82, avgScore:78 },
    { name:'Arabic',  agents:10, avgScore:74 },
    { name:'Badini',  agents:11, avgScore:71 },
  ],
};

export default function SupervisorDashboard({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/evaluations').catch(()=>null),
      fetch('http://localhost:8080/api/sessions').catch(()=>null),
    ]).then(async ([er, sr]) => {
      try {
        const evals = er ? await er.json() : [];
        const sessions = sr ? await sr.json() : [];
        if (!Array.isArray(evals) || evals.length === 0) { setData(DEMO); setLoading(false); return; }
        const avgScore = evals.length ? Math.round(evals.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/evals.length) : 0;
        const pending = evals.filter(e=>!e.coaching_completed).length;
        setData({
          kpis: { totalAgents:103, totalEvals:evals.length, avgScore, pendingCoaching:pending, activeSessions:sessions.length, spotChecks:0 },
          qaOfficers: DEMO.qaOfficers,
          recentEvals: evals.slice(-5).reverse().map(e=>({ agent:e.agent_name, qa:e.qa_name, score:e.overall_score_percentage, date: e.evaluation_date ? new Date(e.evaluation_date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : '—' })),
          queueStats: DEMO.queueStats,
        });
      } catch { setData(DEMO); }
      setLoading(false);
    });
  }, []);

  const d = data || DEMO;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  /* ── chart data ── */
  const now2 = new Date();
  const monthTrend = Array.from({length:6}).map((_,i)=>{
    const dt = new Date(now2); dt.setMonth(dt.getMonth()-5+i);
    const mo = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`;
    const me = (Array.isArray(d.recentEvals)?d.recentEvals:[]).filter(e=>{
      const ds = e.date||''; return ds.includes(mo)||ds.includes(dt.toLocaleString('default',{month:'short'}));
    });
    return { name: dt.toLocaleString('default',{month:'short'}), score: me.length ? Math.round(me.reduce((a,e)=>a+(e.score||0),0)/me.length) : 0 };
  });
  // Use DEMO trend if all zeros
  const trendChart = monthTrend.every(m=>m.score===0)
    ? [{ name:'Oct',score:72},{ name:'Nov',score:74},{ name:'Dec',score:69},{ name:'Jan',score:78},{ name:'Feb',score:75},{ name:'Mar',score:76}]
    : monthTrend;

  const qaBarData = (d.qaOfficers||[]).map((qa,i)=>({ name:qa.name.split(' ')[0], avg:qa.avgScore, evals:qa.evals, color:['#FF6B35','#A78BFA','#34D399','#FBBF24'][i] }));

  const queuePie = (d.queueStats||[]).map((q,i)=>({ name:q.name, value:q.agents, avg:q.avgScore, color:['#60A5FA','#FF6B35','#34D399'][i] }));

  const radarData = [
    { subject:'Sorani',  avg: d.queueStats?.[0]?.avgScore||0 },
    { subject:'Arabic',  avg: d.queueStats?.[1]?.avgScore||0 },
    { subject:'Badini',  avg: d.queueStats?.[2]?.avgScore||0 },
    { subject:'Coaching',avg: d.kpis.totalEvals>0 ? Math.round((d.kpis.totalEvals-d.kpis.pendingCoaching)/d.kpis.totalEvals*100) : 0 },
    { subject:'Sessions',avg: Math.min(100,d.kpis.activeSessions*20) },
  ];

  const SVTip = (label, color='#FF6B35') => ({ active, payload }) => {
    if (!active||!payload?.length) return null;
    return <div style={{ background:'#131626', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'8px 14px', fontFamily:"'Inter',sans-serif" }}><div style={{ fontSize:11, color:'#4A5A78', marginBottom:3 }}>{payload[0].payload.name||payload[0].payload.subject}</div><div style={{ fontSize:15, fontWeight:800, color }}>{payload[0].value}{label}</div></div>;
  };

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`
        .sv-card { transition: transform 0.2s, box-shadow 0.2s; }
        .sv-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important; }
        .sv-row:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:'32px' }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#FF6B35', marginBottom:6 }}>SUPERVISOR PORTAL</div>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ margin:0, fontSize:30, fontWeight:800, color:'#FFFFFF', lineHeight:1.1 }}>
              {greet}, <span style={{ background:'linear-gradient(135deg,#FF6B35,#FBBF24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{user?.name || 'Supervisor'}</span>
            </h1>
            <p style={{ margin:'6px 0 0', fontSize:14, color:'#4A5A78' }}>Here's what's happening across all queues today</p>
          </div>
          <div style={{ padding:'8px 16px', borderRadius:20, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', fontSize:12, color:'#8FA3C4' }}>
            {new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:14, marginBottom:28 }}>
        {[
          { label:'Total Agents',      value: d.kpis.totalAgents,      color:'#60A5FA', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
          { label:'Total Evaluations', value: d.kpis.totalEvals,       color:'#FF6B35', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg> },
          { label:'Avg Score',         value:`${d.kpis.avgScore}%`,    color:sc(d.kpis.avgScore), icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
          { label:'Pending Coaching',  value: d.kpis.pendingCoaching,  color:'#FBBF24', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
          { label:'Active Sessions',   value: d.kpis.activeSessions,   color:'#34D399', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          { label:'Spot Checks',       value: d.kpis.spotChecks,       color:'#A78BFA', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
        ].map((k,i) => (
          <div key={i} className="sv-card" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'18px 20px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 16px 16px'}}/>            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:k.color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ width:36, height:36, borderRadius:10, background:`${k.color}18`, border:`1px solid ${k.color}30`, display:'flex', alignItems:'center', justifyContent:'center', color:k.color, marginBottom:12 }}>{k.icon}</div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#4A5A78', marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:26, fontWeight:800, color:'#FFFFFF' }}>{loading ? '—' : k.value}</div>
          </div>
        ))}
      </div>

      {/* ── CHARTS ROW ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 300px', gap:16, marginBottom:24 }}>

        {/* Score Trend — AreaChart */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'22px 24px' }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#60A5FA', marginBottom:4 }}>6-MONTH TREND</div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:800, color:'#FFF' }}>Avg Score Over Time</div>
            <div style={{ padding:'4px 12px', borderRadius:20, background:'rgba(96,165,250,0.1)', border:'1px solid rgba(96,165,250,0.2)', fontSize:12, fontWeight:700, color:'#60A5FA' }}>{trendChart[5]?.score||0}% this month</div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={trendChart} margin={{ top:5, right:5, bottom:0, left:-22 }}>
              <defs>
                <linearGradient id="svTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="name" tick={{ fill:'#4A5A78', fontSize:10, fontFamily:"'Inter',sans-serif" }} axisLine={false} tickLine={false}/>
              <YAxis domain={[50,100]} tick={{ fill:'#4A5A78', fontSize:9 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={SVTip('%','#60A5FA')}/>
              <Area type="monotone" dataKey="score" stroke="#60A5FA" strokeWidth={2.5} fill="url(#svTrendGrad)" dot={{ fill:'#60A5FA', r:4, stroke:'#0D0F1E', strokeWidth:2 }} activeDot={{ r:6, fill:'#60A5FA', stroke:'#0D0F1E', strokeWidth:2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* QA Officer Comparison — BarChart */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'22px 24px' }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#FF6B35', marginBottom:4 }}>QA PERFORMANCE</div>
          <div style={{ fontSize:15, fontWeight:800, color:'#FFF', marginBottom:16 }}>Officer Score Comparison</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={qaBarData} barSize={38} margin={{ top:5, right:5, bottom:0, left:-22 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="name" tick={{ fill:'#8FA3C4', fontSize:11, fontFamily:"'Inter',sans-serif" }} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{ fill:'#4A5A78', fontSize:9 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={({ active, payload }) => {
                if (!active||!payload?.length) return null;
                const d2 = payload[0].payload;
                return <div style={{ background:'#131626', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'8px 14px', fontFamily:"'Inter',sans-serif" }}><div style={{ fontSize:12, fontWeight:800, color:d2.color }}>{d2.name}</div><div style={{ fontSize:14, fontWeight:900, color:'#FFF' }}>{d2.avg}%</div><div style={{ fontSize:11, color:'#4A5A78' }}>{d2.evals} evals</div></div>;
              }} cursor={{ fill:'rgba(255,255,255,0.04)' }}/>
              <Bar dataKey="avg" radius={[8,8,0,0]}>
                {qaBarData.map((d2,i)=><Cell key={i} fill={d2.color} style={{ filter:`drop-shadow(0 0 8px ${d2.color}66)` }}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Queue Pie */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'22px 20px' }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#A78BFA', marginBottom:4 }}>QUEUE SPLIT</div>
          <div style={{ fontSize:15, fontWeight:800, color:'#FFF', marginBottom:10 }}>Agent Distribution</div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={queuePie} cx="50%" cy="50%" innerRadius={32} outerRadius={54} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {queuePie.map((d2,i)=><Cell key={i} fill={d2.color} style={{ filter:`drop-shadow(0 0 6px ${d2.color}55)` }}/>)}
                </Pie>
                <Tooltip content={({ active, payload }) => {
                  if (!active||!payload?.length) return null;
                  const d2 = payload[0].payload;
                  return <div style={{ background:'#131626', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'8px 12px', fontFamily:"'Inter',sans-serif" }}><div style={{ fontSize:12, fontWeight:800, color:d2.color }}>{d2.name}</div><div style={{ fontSize:13, color:'#FFF' }}>{d2.value} agents</div><div style={{ fontSize:11, color:'#4A5A78' }}>Avg {d2.avg}%</div></div>;
                }}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', flexDirection:'column', gap:8, width:'100%', marginTop:4 }}>
              {queuePie.map((q2,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:q2.color, boxShadow:`0 0 6px ${q2.color}` }}/>
                    <span style={{ fontSize:12, color:'#C8D8EC', fontWeight:600 }}>{q2.name}</span>
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    <span style={{ fontSize:11, color:'#4A5A78' }}>{q2.value} agents</span>
                    <span style={{ fontSize:12, fontWeight:700, color:q2.color }}>{q2.avg}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: QA Officers + Queue Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:20, marginBottom:20 }}>

        {/* QA Officers Leaderboard */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#FF6B35', marginBottom:4 }}>QA TEAM</div>
            <div style={{ fontSize:17, fontWeight:800, color:'#FFFFFF' }}>Officer Performance Overview</div>
          </div>
          <div style={{ padding:'8px 0' }}>
            {d.qaOfficers.map((qa, i) => (
              <div key={i} className="sv-row" style={{ display:'grid', gridTemplateColumns:'44px 1fr 80px 80px 80px', alignItems:'center', padding:'14px 24px', borderBottom:i<d.qaOfficers.length-1?'1px solid rgba(255,255,255,0.04)':'none', background:'transparent', transition:'background 0.15s' }}>
                <div style={{ fontSize:18 }}>{['🥇','🥈','🥉','#4'][i]}</div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${ac(qa.name)}22`, border:`1px solid ${ac(qa.name)}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:ac(qa.name) }}>{qa.name[0]}</div>
                  <span style={{ fontSize:14, fontWeight:700, color:'#FFFFFF' }}>{qa.name}</span>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:'#60A5FA', textAlign:'center' }}>{qa.evals} evals</div>
                <div>
                  <span style={{ padding:'4px 10px', borderRadius:20, background:sbg(qa.avgScore), fontSize:12, fontWeight:700, color:sc(qa.avgScore) }}>{qa.avgScore}%</span>
                </div>
                <div>
                  {qa.pending > 0
                    ? <span style={{ padding:'4px 10px', borderRadius:20, background:'rgba(251,191,36,0.12)', fontSize:12, fontWeight:700, color:'#FBBF24' }}>{qa.pending} pending</span>
                    : <span style={{ padding:'4px 10px', borderRadius:20, background:'rgba(74,222,128,0.1)', fontSize:12, fontWeight:700, color:'#4ADE80' }}>✓ Clear</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Queue Stats */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'20px 24px' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#A78BFA', marginBottom:4 }}>QUEUES</div>
          <div style={{ fontSize:17, fontWeight:800, color:'#FFFFFF', marginBottom:20 }}>Queue Breakdown</div>
          {d.queueStats.map((q,i) => {
            const clrs = ['#60A5FA','#FF6B35','#34D399'];
            return (
              <div key={i} style={{ marginBottom:i<d.queueStats.length-1?20:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:clrs[i] }}/>
                    <span style={{ fontSize:14, fontWeight:700, color:'#FFFFFF' }}>{q.name}</span>
                  </div>
                  <div style={{ display:'flex', gap:12 }}>
                    <span style={{ fontSize:12, color:'#4A5A78' }}>{q.agents} agents</span>
                    <span style={{ fontSize:13, fontWeight:700, color:sc(q.avgScore) }}>{q.avgScore}%</span>
                  </div>
                </div>
                <div style={{ height:8, background:'rgba(255,255,255,0.07)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${q.avgScore}%`, background:`linear-gradient(90deg,${clrs[i]},${clrs[i]}aa)`, borderRadius:4, transition:'width 0.6s ease' }}/>
                </div>
              </div>
            );
          })}

          {/* Overall avg */}
          <div style={{ marginTop:24, padding:'16px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#4A5A78', marginBottom:6 }}>OVERALL AVERAGE</div>
            <div style={{ fontSize:32, fontWeight:800, color:sc(d.kpis.avgScore) }}>{d.kpis.avgScore}%</div>
            <div style={{ fontSize:12, color:'#4A5A78', marginTop:2 }}>{slb(d.kpis.avgScore)}</div>
          </div>
        </div>
      </div>

      {/* Recent Evaluations */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#34D399', marginBottom:4 }}>LIVE FEED</div>
            <div style={{ fontSize:17, fontWeight:800, color:'#FFFFFF' }}>Recent Evaluations</div>
          </div>
          <span style={{ fontSize:12, color:'#4A5A78' }}>Last 5 submissions</span>
        </div>
        <div style={{ padding:'8px 0' }}>
          {d.recentEvals.map((e,i) => (
            <div key={i} className="sv-row" style={{ display:'grid', gridTemplateColumns:'1fr 140px 100px 80px', alignItems:'center', padding:'14px 24px', borderBottom:i<d.recentEvals.length-1?'1px solid rgba(255,255,255,0.04)':'none', background:'transparent', transition:'background 0.15s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:`${ac(e.agent)}22`, border:`1px solid ${ac(e.agent)}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:ac(e.agent) }}>
                  {e.agent?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <span style={{ fontSize:14, fontWeight:600, color:'#E2E8F0' }}>{e.agent}</span>
              </div>
              <div style={{ fontSize:13, color:'#8FA3C4' }}>by <span style={{ color:'#C8D8EC', fontWeight:600 }}>{e.qa}</span></div>
              <div>
                <span style={{ padding:'5px 12px', borderRadius:20, background:sbg(e.score||0), fontSize:13, fontWeight:700, color:sc(e.score||0) }}>{e.score ?? '—'}%</span>
              </div>
              <div style={{ fontSize:12, color:'#4A5A78', textAlign:'right' }}>{e.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}