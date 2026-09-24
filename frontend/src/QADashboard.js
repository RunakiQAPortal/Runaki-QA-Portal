import React, { useState, useEffect } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const API = 'http://localhost:8080/api';
const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const sc  = p => p===100?'#4ADE80':p>0?'#FBBF24':'#F87171';
const sbg = p => p===100?'rgba(74,222,128,0.12)':p>0?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';
const sbd = p => p===100?'rgba(74,222,128,0.3)':p>0?'rgba(251,191,36,0.3)':'rgba(248,113,113,0.3)';
const slb = p => p===100?'10 / 10':p>0?`${p/10} / 10`:'0 / 10';
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const av=(n)=>{ if(!n)return'?'; const w=n.trim().split(' '); return(w[0][0]+(w[1]?w[1][0]:'')).toUpperCase(); };
const ac=(n)=>ACLR[(n?.charCodeAt(0)||0)%ACLR.length];

const AGENT_DB = {
  'Miran': ['Abdullrahman Ali Mahdi','Aran Eimad Qadir','Awdang Saman','Azad Brifkani','Barham Qasim Ahmed','Didar Pirbal','Haryad Shakr Abdulla','Hawrin Amir Ahmed','Kaiwan Pshtiwan Mustafa','Muhammad Ali Osman','Muhammed Abdulbari Majid','Omer Tasim Omer','Rayan Jaafar','Ronar Rasul','Safar Mikeail Ismail','Salih Sangar','Sazgar Hassan','Suzan Sarmad'],
  'Sizar': ['Adbulqadir Salam','Ahmed Khafut Xdr','Ali Khalid','Ammar Mamnd Salih','Aya Edris','Bahaa Shamsadeen Sulaiman','Darbin Omer Abubakr','Esra Sabah Salim','Govand Wali','Israa Peshkawt','Muhammed Fairq Hadu','Muhammed Jalal Majid','Mustafa Khudhur Ali','Rasul Najmadeen','Ruya Yaqub','Rzgar Ali Ismail','Safeen Jahfar','Yasser Ameen','Yousif Hussen Bahram'],
  'Brwa': ['Ahmed Jasim Rashid','Ahmed Saman','Bawar Fazl Muhammad','Daryan Bakr Kakamand','Dlovan Maraan Ibrahim','Gailan Xalid','Halland Hemn','Haryad Muhsin','Karwan Wali','Lawin Kosrat Saadi','Malik Rashid','Mohammed Soran Hassan','Neamat Anwar Kareem','Salm Khairulla Saeed','Shaida Faizan Kawiz','Sozhin Karim','Zhiya Najmadin'],
  'Mohammed': [],
};

const Stat = ({ label, value, sub, color='#FF6B35', icon }) => (
  <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'20px 22px', position:'relative', overflow:'hidden' }}>
    <div style={{ position:'absolute', top:16, right:16, width:8, height:8, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}` }}/>
    <div style={{ width:40, height:40, borderRadius:12, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
      {icon}
    </div>
    <div style={{ fontSize:28, fontWeight:900, color:'#FFFFFF', lineHeight:1 }}>{value}</div>
    <div style={{ fontSize:12, fontWeight:600, color:'#4A5A78', marginTop:4 }}>{label}</div>
    {sub && <div style={{ fontSize:11, color:color, fontWeight:600, marginTop:6 }}>{sub}</div>}
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${color},${color}55)` }}/>
    <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:color, opacity:0.1, filter:'blur(24px)', pointerEvents:'none' }}/>
    <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color},0 0 14px ${color}88` }}/>
  </div>
);

export default function QADashboard({ user }) {
  const qaName = user?.name || '';
  const myAgents = AGENT_DB[qaName] || [];
  const [evals, setEvals]     = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/evaluations`).catch(()=>({data:[]})),
      axios.get(`${API}/sessions`).catch(()=>({data:[]})),
    ]).then(([e,s]) => {
      setEvals(Array.isArray(e.data)?e.data:[]);
      setSessions(Array.isArray(s.data)?s.data:[]);
      setLoading(false);
    });
  }, []);

  // filter to only this QA's evaluations
  const myEvals = evals.filter(e => (e.qaOfficer||e.qa_name||'').toLowerCase() === qaName.toLowerCase());
  const totalEvals = myEvals.length;
  const scores = myEvals.map(e => Number(e.score||e.overallScore||0)).filter(s=>s>0);
  const avgScore = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
  const pending  = myEvals.filter(e=>(e.coachStatus||e.coaching_status||'').toLowerCase().includes('pending')).length;

  // agent score map
  const agentScores = {};
  myEvals.forEach(e => {
    const n = e.agentName||e.agent_name||'';
    if (!agentScores[n]) agentScores[n] = [];
    agentScores[n].push(Number(e.score||e.overallScore||0));
  });
  const agentRank = Object.entries(agentScores).map(([n,s])=>({ name:n, avg:Math.round(s.reduce((a,b)=>a+b,0)/s.length), count:s.length })).sort((a,b)=>b.avg-a.avg).slice(0,5);

  // recent 5
  const recent = [...myEvals].sort((a,b)=>new Date(b.date||b.evalDate||0)-new Date(a.date||a.evalDate||0)).slice(0,5);

  // score distribution — 10-criteria system (scores are multiples of 10)
  const score10   = myEvals.filter(e=>Number(e.score||e.overallScore||0)===100).length;
  const score1to9 = myEvals.filter(e=>{ const s=Number(e.score||e.overallScore||0); return s>=10&&s<=90; }).length;
  const score0    = myEvals.filter(e=>Number(e.score||e.overallScore||0)===0).length;

  const DEMO = totalEvals === 0;

  return (
    <div style={{ ...F, background:'#0D0F1E', minHeight:'100vh', padding:'28px 32px 60px', color:'#FFFFFF' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#FF8C5A', letterSpacing:'2.5px', textTransform:'uppercase', marginBottom:6 }}>QA OFFICER DASHBOARD</div>
        <h1 style={{ margin:0, fontSize:26, fontWeight:900, letterSpacing:'-0.6px' }}>
          Welcome back,{' '}
          <span style={{ background:'linear-gradient(90deg,#FF6B35,#FBBF24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{qaName}</span>
        </h1>
        <p style={{ margin:'6px 0 0', fontSize:13, color:'#4A5A78' }}>
          You manage <span style={{ color:'#C8D8EC', fontWeight:700 }}>{myAgents.length} agents</span> · {loading ? 'Loading...' : `${totalEvals} evaluations submitted`}
        </p>
        {DEMO && !loading && <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:20, background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)', fontSize:11, fontWeight:700, color:'#FBBF24' }}>⚡ Demo mode — no evaluations yet</div>}
      </div>

      {/* stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <Stat label="Total Evaluations" value={DEMO?0:totalEvals} color="#FF6B35"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>}
          sub="This QA officer" />
        <Stat label="Average Score" value={DEMO?'—':`${avgScore}%`} color={avgScore>0?sc(avgScore):'#4A5A78'}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
          sub={avgScore>0?slb(avgScore):'No evals yet'} />
        <Stat label="Pending Coaching" value={DEMO?0:pending} color="#FBBF24"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>}
          sub="Agents to coach" />
        <Stat label="My Agents" value={myAgents.length} color="#60A5FA"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>}
          sub="Assigned to you" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        {/* recent evaluations */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:4, height:18, background:'linear-gradient(180deg,#FF6B35,#FF6B3555)', borderRadius:4, boxShadow:'0 0 8px #FF6B3566' }}/>
              <span style={{ fontSize:12, fontWeight:800, color:'#FFFFFF', textTransform:'uppercase', letterSpacing:'0.5px' }}>Recent Evaluations</span>
            </div>
            <span style={{ fontSize:11, color:'#4A5A78', fontWeight:600 }}>Latest 5</span>
          </div>
          <div style={{ padding:'12px 20px' }}>
            {(DEMO ? [
              { agentName:'Demo Agent A', date:'10 Mar 2026', score:100 },
              { agentName:'Demo Agent B', date:'09 Mar 2026', score:60 },
              { agentName:'Demo Agent C', date:'08 Mar 2026', score:40 },
            ] : recent).map((e,i) => {
              const s = Number(e.score||e.overallScore||0);
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:i<4?'1px solid rgba(255,255,255,0.04)':'' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:ac(e.agentName||e.agent_name), display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff', flexShrink:0 }}>
                    {av(e.agentName||e.agent_name)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#FFFFFF', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{e.agentName||e.agent_name||'—'}</div>
                    <div style={{ fontSize:11, color:'#4A5A78', fontWeight:500 }}>{e.date||e.evalDate||'—'}</div>
                  </div>
                  <div style={{ padding:'4px 10px', borderRadius:8, background:sbg(s), border:`1px solid ${sbd(s)}`, fontSize:12, fontWeight:800, color:sc(s), flexShrink:0 }}>
                    {s>0?`${s}%`:'—'}
                  </div>
                </div>
              );
            })}
            {!DEMO && recent.length===0 && <div style={{ padding:'20px 0', textAlign:'center', fontSize:13, color:'#4A5A78' }}>No evaluations yet</div>}
          </div>
        </div>

        {/* right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* score distribution — donut chart */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:4, height:18, background:'linear-gradient(180deg,#FBBF24,#FBBF2455)', borderRadius:4, boxShadow:'0 0 8px #FBBF2466' }}/>
              <span style={{ fontSize:12, fontWeight:800, color:'#FFFFFF', textTransform:'uppercase', letterSpacing:'0.5px' }}>Score Distribution</span>
            </div>
            <div style={{ padding:'16px 20px' }}>
              {(() => {
                const distData = [
                  { label:'10 / 10', range:'100%',    val:DEMO?2:score10,   color:'#4ADE80' },
                  { label:'1–9 / 10',range:'10–90%',  val:DEMO?3:score1to9, color:'#FBBF24' },
                  { label:'0 / 10',  range:'0%',      val:DEMO?1:score0,    color:'#F87171' },
                ];
                const total2 = distData.reduce((a,d)=>a+d.val,0)||1;
                const DTip = ({ active, payload }) => {
                  if (!active||!payload?.length) return null;
                  const d2 = payload[0].payload;
                  return <div style={{ background:'#131626', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'8px 12px', fontFamily:"'Inter',sans-serif" }}><div style={{ fontSize:12, fontWeight:800, color:d2.color }}>{d2.label}</div><div style={{ fontSize:11, color:'#8FA3C4', marginBottom:4 }}>{d2.range}</div><div style={{ fontSize:14, fontWeight:900, color:'#FFF' }}>{d2.val} evals</div></div>;
                };
                return (
                  <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                    <ResponsiveContainer width={110} height={110}>
                      <PieChart>
                        <Pie data={distData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={4} dataKey="val" strokeWidth={0}>
                          {distData.map((d2,i)=><Cell key={i} fill={d2.color} style={{ filter:`drop-shadow(0 0 5px ${d2.color}55)` }}/>)}
                        </Pie>
                        <Tooltip content={<DTip/>}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ flex:1 }}>
                      {distData.map((r,i) => {
                        const pct = Math.round(r.val/total2*100);
                        return (
                          <div key={i} style={{ marginBottom:i<2?10:0 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                              <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:7, height:7, borderRadius:'50%', background:r.color, boxShadow:`0 0 5px ${r.color}` }}/><span style={{ fontSize:11, color:'#8FA3C4', fontWeight:600 }}>{r.label}</span></div>
                              <span style={{ fontSize:12, fontWeight:800, color:r.color }}>{r.val}</span>
                            </div>
                            <div style={{ height:5, background:'rgba(255,255,255,0.06)', borderRadius:4 }}>
                              <div style={{ width:`${pct}%`, height:'100%', background:r.color, borderRadius:4, boxShadow:`0 0 6px ${r.color}55`, transition:'width 0.6s ease' }}/>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* top agents */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden', flex:1 }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:4, height:18, background:'linear-gradient(180deg,#A78BFA,#A78BFA55)', borderRadius:4, boxShadow:'0 0 8px #A78BFA66' }}/>
              <span style={{ fontSize:12, fontWeight:800, color:'#FFFFFF', textTransform:'uppercase', letterSpacing:'0.5px' }}>My Top Agents</span>
            </div>
            <div style={{ padding:'12px 20px' }}>
              {(DEMO ? [
                { name:'Demo Agent A', avg:90, count:4 },
                { name:'Demo Agent B', avg:80, count:3 },
                { name:'Demo Agent C', avg:40, count:2 },
              ] : agentRank).map((a,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0', borderBottom:i<agentRank.length-1?'1px solid rgba(255,255,255,0.04)':'' }}>
                  <div style={{ width:24, height:24, borderRadius:8, background:i===0?'rgba(251,191,36,0.2)':i===1?'rgba(148,163,184,0.15)':'rgba(180,120,60,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:i===0?'#FBBF24':i===1?'#94A3B8':'#B4783C', flexShrink:0 }}>{i+1}</div>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:ac(a.name), display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>{av(a.name)}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#FFFFFF', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.name}</div>
                    <div style={{ fontSize:10, color:'#4A5A78' }}>{a.count} eval{a.count!==1?'s':''}</div>
                  </div>
                  <div style={{ padding:'3px 10px', borderRadius:8, background:sbg(a.avg), border:`1px solid ${sbd(a.avg)}`, fontSize:12, fontWeight:800, color:sc(a.avg) }}>{a.avg}%</div>
                </div>
              ))}
              {!DEMO && agentRank.length===0 && <div style={{ padding:'20px 0', textAlign:'center', fontSize:13, color:'#4A5A78' }}>No data yet</div>}
            </div>
          </div>
        </div>
      </div>

      {/* my agents list */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:4, height:18, background:'linear-gradient(180deg,#60A5FA,#60A5FA55)', borderRadius:4, boxShadow:'0 0 8px #60A5FA66' }}/>
          <span style={{ fontSize:12, fontWeight:800, color:'#FFFFFF', textTransform:'uppercase', letterSpacing:'0.5px' }}>My Assigned Agents</span>
          <span style={{ marginLeft:'auto', fontSize:11, color:'#4A5A78', fontWeight:600 }}>{myAgents.length} agents</span>
        </div>
        <div style={{ padding:'16px 20px', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
          {myAgents.length === 0
            ? <div style={{ gridColumn:'1/-1', textAlign:'center', fontSize:13, color:'#4A5A78', padding:'20px 0' }}>No agents assigned</div>
            : myAgents.map(name => {
                const aData = agentScores[name];
                const aAvg = aData ? Math.round(aData.reduce((a,b)=>a+b,0)/aData.length) : null;
                return (
                  <div key={name} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:ac(name), display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>{av(name)}</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:'#FFFFFF', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</div>
                      {aAvg !== null
                        ? <div style={{ fontSize:10, fontWeight:700, color:sc(aAvg) }}>{aAvg}%</div>
                        : <div style={{ fontSize:10, color:'#4A5A78' }}>Not evaluated</div>}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}