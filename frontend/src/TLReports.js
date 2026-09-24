import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const QA_COLORS = ['#FF6B35','#A78BFA','#34D399','#60A5FA'];

const MONTHLY = [
  { month:'Oct', Miran:72, Sizar:69, Brwa:71, Mohammed:0 },
  { month:'Nov', Miran:74, Sizar:72, Brwa:70, Mohammed:0 },
  { month:'Dec', Miran:75, Sizar:73, Brwa:72, Mohammed:0 },
  { month:'Jan', Miran:77, Sizar:75, Brwa:73, Mohammed:0 },
  { month:'Feb', Miran:78, Sizar:75, Brwa:73, Mohammed:0 },
  { month:'Mar', Miran:79, Sizar:76, Brwa:74, Mohammed:0 },
];

const EVALS_WEEKLY = [
  { week:'W1 Mar', Miran:18, Sizar:21, Brwa:16 },
  { week:'W2 Mar', Miran:22, Sizar:19, Brwa:18 },
  { week:'W3 Mar', Miran:20, Sizar:23, Brwa:17 },
  { week:'W4 Mar', Miran:25, Sizar:22, Brwa:20 },
];

const COACHING_MONTHLY = [
  { month:'Jan', pending:35, coached:28 },
  { month:'Feb', pending:31, coached:26 },
  { month:'Mar', pending:28, coached:18 },
];

const RADAR_DATA = [
  { criterion:'Greeting',        Miran:8.2, Sizar:7.9, Brwa:7.7 },
  { criterion:'Problem ID',      Miran:7.8, Sizar:8.1, Brwa:7.5 },
  { criterion:'Solution',        Miran:8.0, Sizar:7.7, Brwa:7.8 },
  { criterion:'Hold-Unhold',     Miran:8.5, Sizar:7.5, Brwa:7.2 },
  { criterion:'Communication',   Miran:7.9, Sizar:8.0, Brwa:7.6 },
  { criterion:'Empathy',         Miran:8.1, Sizar:7.8, Brwa:8.0 },
];

const QA_TABLE = [
  { qa:'Miran',    evals:85, avg:79, pending:6,  coached:9,  spotChecks:14, vivaPass:'8/9' },
  { qa:'Sizar',    evals:85, avg:76, pending:8,  coached:7,  spotChecks:16, vivaPass:'6/8' },
  { qa:'Brwa',     evals:71, avg:74, pending:9,  coached:6,  spotChecks:12, vivaPass:'7/9' },
  { qa:'Mohammed', evals:0,  avg:0,  pending:5,  coached:0,  spotChecks:0,  vivaPass:'—' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#131626', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'10px 14px', ...F, fontSize:12 }}>
      <div style={{ color:'#8FA3C4', marginBottom:6, fontWeight:700 }}>{label}</div>
      {payload.map((p,i)=><div key={i} style={{ color:p.color, marginBottom:2 }}>{p.name}: <b>{p.value}</b></div>)}
    </div>
  );
};

export default function TLReports({ user }) {
  const [period, setPeriod] = useState('This Month');

  const exportCSV = () => {
    const rows = [['QA Officer','Evaluations','Avg Score','Pending Coaching','Coached','Spot Checks','VIVA Pass'],...QA_TABLE.map(q=>[q.qa,q.evals,q.avg?`${q.avg}%`:'—',q.pending,q.coached,q.spotChecks,q.vivaPass])];
    const csv = rows.map(r=>r.join(',')).join('\n');
    const a = document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='qa-team-report.csv'; a.click();
  };

  const sel = { background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#FFF', padding:'9px 14px', fontSize:13, cursor:'pointer', ...F };

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`select option{background:#131626!important;color:#FFF!important} select{color-scheme:dark}`}</style>

      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#34D399', marginBottom:5 }}>QA TEAM LEAD</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:'#FFF' }}>Reports & <span style={{ background:'linear-gradient(90deg,#34D399,#10B981)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Analytics</span></h1>
          <div style={{ display:'flex', gap:10 }}>
            <select value={period} onChange={e=>setPeriod(e.target.value)} style={sel}>
              {['This Week','This Month','Last Month','Last 3 Months','This Year'].map(p=><option key={p}>{p}</option>)}
            </select>
            <button onClick={exportCSV} style={{ padding:'10px 18px', borderRadius:12, background:'rgba(52,211,153,0.12)', border:'1px solid rgba(52,211,153,0.3)', color:'#34D399', fontSize:13, fontWeight:700, cursor:'pointer', ...F }}>↓ Export Report</button>
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Evaluations', value:'347', color:'#60A5FA', delta:'+12% vs last month' },
          { label:'Team Avg Score',    value:'76%',  color:'#4ADE80', delta:'+2% improvement' },
          { label:'Coaching Rate',     value:'24%',  color:'#FBBF24', delta:'28 of 117 evals' },
          { label:'VIVA Pass Rate',    value:'78%',  color:'#34D399', delta:'7 of 9 passed' },
          { label:'Spot Checks Done',  value:'64',   color:'#A78BFA', delta:'across all types' },
        ].map((k,i)=>(
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'20px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${k.color},${k.color}44)`, borderRadius:'0 0 18px 18px' }}/>
            <div style={{ position:'absolute', top:-20, right:-20, width:90, height:90, borderRadius:'50%', background:k.color, opacity:0.08, filter:'blur(28px)' }}/>
            <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:k.color, boxShadow:`0 0 8px ${k.color},0 0 14px ${k.color}88` }}/>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#4A5A78', marginBottom:8 }}>{k.label}</div>
            <div style={{ fontSize:32, fontWeight:800, color:'#FFF', marginBottom:4 }}>{k.value}</div>
            <div style={{ fontSize:11, color:k.color, fontWeight:600 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px' }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#60A5FA', marginBottom:3 }}>SCORE TREND</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#FFF' }}>Average Score — Last 6 Months</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill:'#4A5A78', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[60,100]} tick={{ fill:'#4A5A78', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend wrapperStyle={{ fontSize:11, color:'#8FA3C4' }}/>
              {['Miran','Sizar','Brwa'].map((qa,i)=>(
                <Line key={qa} type="monotone" dataKey={qa} stroke={QA_COLORS[i]} strokeWidth={2.5} dot={{ r:3 }}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px' }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#FBBF24', marginBottom:3 }}>VOLUME TREND</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#FFF' }}>Weekly Evaluations</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={EVALS_WEEKLY} barGap={4} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false}/>
              <XAxis dataKey="week" tick={{ fill:'#4A5A78', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#4A5A78', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend wrapperStyle={{ fontSize:11, color:'#8FA3C4' }}/>
              {['Miran','Sizar','Brwa'].map((qa,i)=>(
                <Bar key={qa} dataKey={qa} fill={QA_COLORS[i]} radius={[4,4,0,0]}/>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px' }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#F87171', marginBottom:3 }}>COACHING</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#FFF' }}>Pending vs Coached — Monthly</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={COACHING_MONTHLY} barGap={4} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill:'#4A5A78', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#4A5A78', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend wrapperStyle={{ fontSize:11, color:'#8FA3C4' }}/>
              <Bar dataKey="pending" name="Pending" fill="#FBBF24" radius={[4,4,0,0]}/>
              <Bar dataKey="coached" name="Coached" fill="#4ADE80" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px' }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#A78BFA', marginBottom:3 }}>CRITERIA RADAR</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#FFF' }}>QA Officer Category Breakdown</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.08)"/>
              <PolarAngleAxis dataKey="criterion" tick={{ fill:'#4A5A78', fontSize:9 }}/>
              {['Miran','Sizar','Brwa'].map((qa,i)=>(
                <Radar key={qa} name={qa} dataKey={qa} stroke={QA_COLORS[i]} fill={QA_COLORS[i]} fillOpacity={0.12} strokeWidth={2}/>
              ))}
              <Legend wrapperStyle={{ fontSize:11, color:'#8FA3C4' }}/>
              <Tooltip content={<CustomTooltip/>}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* QA Breakdown Table */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#FF6B35', marginBottom:3 }}>BREAKDOWN</div>
            <div style={{ fontSize:16, fontWeight:800, color:'#FFF' }}>Performance by QA Officer</div>
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'rgba(255,255,255,0.03)' }}>
                {['QA Officer','Evaluations','Avg Score','Pending','Coached','Spot Checks','VIVA Pass'].map((h,i)=>(
                  <th key={i} style={{ padding:'12px 20px', textAlign:'left', fontSize:10, fontWeight:700, letterSpacing:'1.5px', color:'#4A5A78', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QA_TABLE.map((q,i)=>(
                <tr key={i} style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding:'14px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:30, height:30, borderRadius:8, background:`${QA_COLORS[i]}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:QA_COLORS[i] }}>{q.qa[0]}</div>
                      <span style={{ fontSize:13, fontWeight:700, color:'#FFF' }}>{q.qa}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 20px', fontSize:13, fontWeight:700, color:'#FFF' }}>{q.evals||'—'}</td>
                  <td style={{ padding:'14px 20px' }}>
                    <span style={{ padding:'4px 12px', borderRadius:20, background:q.avg>=80?'rgba(74,222,128,0.12)':q.avg>=60?'rgba(251,191,36,0.12)':'rgba(255,255,255,0.06)', fontSize:12, fontWeight:700, color:q.avg>=80?'#4ADE80':q.avg>=60?'#FBBF24':'#4A5A78' }}>{q.avg?`${q.avg}%`:'—'}</span>
                  </td>
                  <td style={{ padding:'14px 20px', fontSize:13, color:'#FBBF24', fontWeight:600 }}>{q.pending}</td>
                  <td style={{ padding:'14px 20px', fontSize:13, color:'#4ADE80', fontWeight:600 }}>{q.coached}</td>
                  <td style={{ padding:'14px 20px', fontSize:13, color:'#A78BFA', fontWeight:600 }}>{q.spotChecks||'—'}</td>
                  <td style={{ padding:'14px 20px', fontSize:13, color:'#34D399', fontWeight:600 }}>{q.vivaPass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}