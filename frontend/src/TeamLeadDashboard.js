import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const ac = n => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const av = n => n?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?';
const sc = p => p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';
const sbg= p => p>=80?'rgba(74,222,128,0.12)':p>=60?'rgba(251,191,36,0.12)':'rgba(248,113,113,0.12)';

const QA_OFFICERS = ['Miran','Sizar','Brwa','Mohammed'];
const QA_COLORS   = ['#FF6B35','#A78BFA','#34D399','#60A5FA'];

const DEMO = {
  kpi: { totalEvals:347, pendingCoaching:28, spotChecks:64, vivaPassRate:78, activeAgents:103, sessions:12, avgScore:76, tipSent:9 },
  weeklyEvals: [
    { week:'Week 1', Miran:18, Sizar:21, Brwa:16, Mohammed:0 },
    { week:'Week 2', Miran:22, Sizar:19, Brwa:18, Mohammed:0 },
    { week:'Week 3', Miran:20, Sizar:23, Brwa:17, Mohammed:0 },
    { week:'Week 4', Miran:25, Sizar:22, Brwa:20, Mohammed:0 },
  ],
  qaScores: [
    { name:'Miran', avg:79, evals:85, pending:6 },
    { name:'Sizar', avg:76, evals:85, pending:8 },
    { name:'Brwa',  avg:74, evals:71, pending:9 },
    { name:'Mohammed', avg:0, evals:0, pending:5 },
  ],
  coachingPie: [
    { name:'Pending Coaching', value:28, color:'#FBBF24' },
    { name:'Coached',          value:89, color:'#4ADE80' },
    { name:'No Issue',         value:230,color:'#60A5FA' },
  ],
  recentEvals: [
    { agent:'Abdullrahman Ali', qa:'Miran', score:82, date:'11 Mar', queue:'Sorani' },
    { agent:'Govand Wali',      qa:'Sizar', score:71, date:'11 Mar', queue:'Arabic' },
    { agent:'Halland Hemn',     qa:'Brwa',  score:58, date:'10 Mar', queue:'Badini' },
    { agent:'Aya Edris',        qa:'Sizar', score:91, date:'10 Mar', queue:'Arabic' },
    { agent:'Rayan Jaafar',     qa:'Miran', score:67, date:'10 Mar', queue:'Sorani' },
    { agent:'Barham Qasim',     qa:'Brwa',  score:85, date:'09 Mar', queue:'Badini' },
  ],
  activity: [
    { type:'eval',     msg:'Sizar evaluated Govand Wali — 71%', time:'2h ago', color:'#60A5FA' },
    { type:'coaching', msg:'Miran marked coaching done for Rayan Jaafar', time:'3h ago', color:'#4ADE80' },
    { type:'spot',     msg:'Brwa completed Hold-Unhold spot check (8 agents)', time:'5h ago', color:'#A78BFA' },
    { type:'viva',     msg:'3 agents passed High Bill VIVA', time:'Yesterday', color:'#FBBF24' },
    { type:'tip',      msg:'Tip of the Day was published', time:'Yesterday', color:'#F472B6' },
    { type:'eval',     msg:'Miran evaluated Abdullrahman Ali — 82%', time:'Yesterday', color:'#60A5FA' },
  ],
  latestTip: 'Always confirm the customer\'s name and account before diving into the issue. It shows professionalism and saves time.',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#131626', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'10px 14px', ...F, fontSize:12 }}>
      <div style={{ color:'#8FA3C4', marginBottom:6, fontWeight:700 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color:p.color, marginBottom:2 }}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
};

export default function TeamLeadDashboard({ user }) {
  const [data, setData] = useState(DEMO);
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/evaluations').catch(()=>null),
      fetch('http://localhost:8080/api/coaching').catch(()=>null),
      fetch('http://localhost:8080/api/tips/active').catch(()=>null),
    ]).then(async ([er, cr, tr]) => {
      try {
        const tip = tr ? await tr.json() : null;
        if (tip?.content) setTip(tip.content);
        else setTip(DEMO.latestTip);
      } catch { setTip(DEMO.latestTip); }
      setLoading(false);
    });
    setLoading(false);
  }, []);

  const hour = new Date().getHours();
  const greet = hour<12?'Good Morning':hour<17?'Good Afternoon':'Good Evening';

  const KPIs = [
    { label:'Total Evaluations', value:data.kpi.totalEvals,     color:'#60A5FA', sub:'this month' },
    { label:'Pending Coaching',  value:data.kpi.pendingCoaching,color:'#FBBF24', sub:'need follow-up' },
    { label:'Avg Quality Score', value:`${data.kpi.avgScore}%`, color:sc(data.kpi.avgScore), sub:'across all agents' },
    { label:'VIVA Pass Rate',    value:`${data.kpi.vivaPassRate}%`,color:sc(data.kpi.vivaPassRate), sub:'this period' },
    { label:'Active Agents',     value:data.kpi.activeAgents,   color:'#34D399', sub:'across 3 queues' },
    { label:'Spot Checks',       value:data.kpi.spotChecks,     color:'#A78BFA', sub:'completed' },
    { label:'Sessions Held',     value:data.kpi.sessions,       color:'#FF6B35', sub:'this month' },
    { label:'Tips Published',    value:data.kpi.tipSent,        color:'#F472B6', sub:'this month' },
  ];

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`.tld-row:hover{background:rgba(255,255,255,0.04)!important}`}</style>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#FF6B35', marginBottom:5 }}>QA TEAM LEAD PORTAL</div>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ margin:0, fontSize:30, fontWeight:800, color:'#FFF', lineHeight:1.1 }}>
              {greet}, <span style={{ background:'linear-gradient(135deg,#FF6B35,#FBBF24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{user?.name||'Miran'}</span> 👋
            </h1>
            <p style={{ margin:'6px 0 0', fontSize:14, color:'#4A5A78' }}>Here's your team's full quality overview for today</p>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ padding:'7px 16px', borderRadius:20, background:'rgba(255,107,53,0.12)', border:'1px solid rgba(255,107,53,0.3)', fontSize:12, fontWeight:700, color:'#FF6B35' }}>
              QA Team Lead
            </div>
            <div style={{ padding:'7px 16px', borderRadius:20, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', fontSize:12, color:'#8FA3C4' }}>
              {new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {KPIs.slice(0,4).map((k,i)=>(
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
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:28 }}>
        {KPIs.slice(4).map((k,i)=>(
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

      {/* Charts Row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:20, marginBottom:20 }}>

        {/* Weekly Evals Line Chart */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px' }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#60A5FA', marginBottom:3 }}>WEEKLY TREND</div>
            <div style={{ fontSize:16, fontWeight:800, color:'#FFF' }}>Evaluations Per QA Officer</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.weeklyEvals}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false}/>
              <XAxis dataKey="week" tick={{ fill:'#4A5A78', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#4A5A78', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend wrapperStyle={{ fontSize:11, color:'#8FA3C4', paddingTop:10 }}/>
              {QA_OFFICERS.map((qa,i)=>(
                <Line key={qa} type="monotone" dataKey={qa} stroke={QA_COLORS[i]} strokeWidth={2.5} dot={{ r:4, fill:QA_COLORS[i] }} activeDot={{ r:6 }}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Coaching Pie */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px' }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#FBBF24', marginBottom:3 }}>COACHING</div>
            <div style={{ fontSize:16, fontWeight:800, color:'#FFF' }}>Status Breakdown</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={data.coachingPie} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {data.coachingPie.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip content={<CustomTooltip/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:8 }}>
            {data.coachingPie.map((d,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:d.color }}/>
                  <span style={{ fontSize:12, color:'#8FA3C4' }}>{d.name}</span>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:d.color }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>

        {/* QA Officer Bar Chart */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px' }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#34D399', marginBottom:3 }}>QA PERFORMANCE</div>
            <div style={{ fontSize:16, fontWeight:800, color:'#FFF' }}>Average Score by Officer</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.qaScores} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false}/>
              <XAxis dataKey="name" tick={{ fill:'#8FA3C4', fontSize:12 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{ fill:'#4A5A78', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="avg" name="Avg Score" radius={[6,6,0,0]}>
                {data.qaScores.map((e,i)=><Cell key={i} fill={QA_COLORS[i]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* QA Officer Cards */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px' }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#A78BFA', marginBottom:3 }}>TEAM</div>
            <div style={{ fontSize:16, fontWeight:800, color:'#FFF' }}>QA Officer Overview</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {data.qaScores.map((qa,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:'rgba(255,255,255,0.04)', borderRadius:12, border:`1px solid ${QA_COLORS[i]}22` }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${QA_COLORS[i]}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:QA_COLORS[i] }}>{av(qa.name)}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#FFF' }}>{qa.name}</div>
                    <div style={{ fontSize:11, color:'#4A5A78', marginTop:1 }}>{qa.evals} evals · {qa.pending} pending</div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:18, fontWeight:800, color:sc(qa.avg) }}>{qa.avg>0?`${qa.avg}%`:'—'}</div>
                  <div style={{ fontSize:10, color:sc(qa.avg), fontWeight:600 }}>{qa.avg>=80?'Excellent':qa.avg>=60?'Average':qa.avg>0?'Needs Work':'No Data'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20 }}>

        {/* Recent Evaluations */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#FF6B35', marginBottom:3 }}>RECENT</div>
              <div style={{ fontSize:16, fontWeight:800, color:'#FFF' }}>Latest Evaluations</div>
            </div>
          </div>
          {data.recentEvals.map((e,i)=>(
            <div key={i} className="tld-row" style={{ padding:'14px 24px', borderBottom:i<data.recentEvals.length-1?'1px solid rgba(255,255,255,0.04)':'none', display:'flex', alignItems:'center', justifyContent:'space-between', background:'transparent', transition:'background 0.15s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:`${ac(e.agent)}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:ac(e.agent), flexShrink:0 }}>{av(e.agent)}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#FFF' }}>{e.agent}</div>
                  <div style={{ fontSize:11, color:'#4A5A78', marginTop:1 }}>by {e.qa} · {e.queue} · {e.date}</div>
                </div>
              </div>
              <div style={{ padding:'4px 12px', borderRadius:20, background:sbg(e.score), fontSize:13, fontWeight:800, color:sc(e.score) }}>{e.score}%</div>
            </div>
          ))}
        </div>

        {/* Right: Tip + Activity */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Tip of the Day */}
          <div style={{ background:'linear-gradient(135deg,rgba(244,114,182,0.12),rgba(167,139,250,0.08))', border:'1px solid rgba(244,114,182,0.25)', borderRadius:18, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'rgba(244,114,182,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2"><path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.2 4.16-3 5.2V17H9v-2.8A6 6 0 016 9a6 6 0 016-6z"/></svg>
              </div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#F472B6' }}>TIP OF THE DAY</div>
            </div>
            <p style={{ margin:0, fontSize:13, color:'#C8D8EC', lineHeight:1.7, fontStyle:'italic' }}>"{tip || DEMO.latestTip}"</p>
            <div style={{ marginTop:10, fontSize:11, color:'#F472B6', fontWeight:600 }}>— {user?.name||'Team Lead'}</div>
          </div>

          {/* Activity Feed */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'20px 22px', flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#8FA3C4', marginBottom:14 }}>ACTIVITY FEED</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {data.activity.map((a,i)=>(
                <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:a.color, marginTop:5, flexShrink:0, boxShadow:`0 0 6px ${a.color}` }}/>
                  <div>
                    <div style={{ fontSize:12, color:'#C8D8EC', lineHeight:1.5 }}>{a.msg}</div>
                    <div style={{ fontSize:10, color:'#4A5A78', marginTop:2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}