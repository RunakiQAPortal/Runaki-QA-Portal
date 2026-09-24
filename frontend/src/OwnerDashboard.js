import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';

const API = 'http://localhost:8080/api';
const F   = { fontFamily:"'Inter','Segoe UI',sans-serif" };

const ROLE_CFG = {
  owner:      { label:'Owner',        color:'#FF6B35', bg:'rgba(255,107,53,0.12)',  icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  teamlead:   { label:'QA Team Lead', color:'#F472B6', bg:'rgba(244,114,182,0.12)', icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/><path d="M12 14l2 2 4-4"/></svg> },
  supervisor: { label:'Supervisor',   color:'#FBBF24', bg:'rgba(251,191,36,0.12)',  icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  qa_officer: { label:'QA Officer',   color:'#60A5FA', bg:'rgba(96,165,250,0.12)',  icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  trainer:    { label:'Trainer',      color:'#34D399', bg:'rgba(52,211,153,0.12)',  icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> },
  agent:      { label:'Agent',        color:'#A78BFA', bg:'rgba(167,139,250,0.12)', icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.8 19.8 0 01.02 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.8 12.8 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.8 12.8 0 002.81.7A2 2 0 0122 14v2.92z"/></svg> },
};

const DEMO_USERS = [
  {id:1, name:'Miran',       email:'miran@runaki.com',    role:'owner',      queue:'All',    status:'active',   last_active:'2026-03-11T10:30:00Z'},
  {id:2, name:'Kak Masroor', email:'masroor@runaki.com',  role:'supervisor', queue:'All',    status:'active',   last_active:'2026-03-11T09:15:00Z'},
  {id:3, name:'Brwa',        email:'brwa@runaki.com',     role:'qa_officer', queue:'Sorani', status:'active',   last_active:'2026-03-11T11:00:00Z'},
  {id:4, name:'Sizar',       email:'sizar@runaki.com',    role:'qa_officer', queue:'Badini', status:'active',   last_active:'2026-03-10T16:45:00Z'},
  {id:5, name:'Mohammed',    email:'mohammed@runaki.com', role:'qa_officer', queue:'Arabic', status:'active',   last_active:'2026-03-11T08:30:00Z'},
  {id:6, name:'Kak Arsalan', email:'arsalan@runaki.com',  role:'trainer',    queue:'All',    status:'active',   last_active:'2026-03-09T14:20:00Z'},
  {id:7, name:'Soza',        email:'soza@runaki.com',     role:'teamlead',   queue:'All',    status:'active',   last_active:'2026-03-11T07:55:00Z'},
  {id:8, name:'Ahmad Ali',   email:'a.ali@runaki.com',    role:'agent',      queue:'Sorani', status:'active',   last_active:'2026-03-11T09:00:00Z'},
  {id:9, name:'Govand Wali', email:'g.wali@runaki.com',   role:'agent',      queue:'Sorani', status:'active',   last_active:'2026-03-10T11:30:00Z'},
  {id:10,name:'Halland Hemn',email:'h.hemn@runaki.com',   role:'agent',      queue:'Sorani', status:'inactive', last_active:'2026-03-05T10:00:00Z'},
  {id:11,name:'Ahmed Saman', email:'a.saman@runaki.com',  role:'agent',      queue:'Arabic', status:'active',   last_active:'2026-03-11T08:45:00Z'},
  {id:12,name:'Tara Omer',   email:'t.omer@runaki.com',   role:'agent',      queue:'Badini', status:'active',   last_active:'2026-03-11T10:10:00Z'},
];

const ACTIVITY_LOG = [
  {id:1, user:'Miran',  action:'Created user account',  target:'Ahmad Ali',    time:'2026-03-11T10:30:00Z', type:'create'},
  {id:2, user:'Miran',  action:'Updated role',          target:'Soza → Team Lead', time:'2026-03-11T09:45:00Z', type:'edit'},
  {id:3, user:'System', action:'Auto backup completed', target:'Database',     time:'2026-03-11T04:00:00Z', type:'system'},
  {id:4, user:'Miran',  action:'Deleted user',          target:'Test Account', time:'2026-03-10T14:20:00Z', type:'delete'},
  {id:5, user:'Miran',  action:'Changed queue config',  target:'Badini queue', time:'2026-03-10T11:00:00Z', type:'edit'},
  {id:6, user:'System', action:'System restarted',      target:'Server',       time:'2026-03-10T00:00:00Z', type:'system'},
  {id:7, user:'Miran',  action:'Added 5 new agents',    target:'Arabic queue', time:'2026-03-09T16:30:00Z', type:'create'},
  {id:8, user:'Miran',  action:'Reset password',        target:'Mohammed',     time:'2026-03-09T10:15:00Z', type:'edit'},
];

export default function OwnerDashboard({ setPage }) {
  const [users,     setUsers]     = useState(DEMO_USERS);
  const [loading,   setLoading]   = useState(true);
  const [sysStatus, setSysStatus] = useState({ api:'checking', db:'checking' });
  const now = new Date();

  useEffect(() => {
    axios.get(`${API}/users`).then(r => { if(r.data?.length) setUsers(r.data); })
      .catch(()=>{}).finally(()=>setLoading(false));
    axios.get(`${API}/users`).then(()=>setSysStatus({api:'online',db:'online'}))
      .catch(()=>setSysStatus({api:'offline',db:'offline'}));
  }, []);

  /* ── computed ── */
  const totalUsers    = users.length;
  const activeUsers   = users.filter(u=>u.status==='active').length;
  const inactiveUsers = users.filter(u=>u.status!=='active').length;
  const onlineNow     = users.filter(u => u.last_active && (now-new Date(u.last_active)) < 3*60*60*1000).length;
  const uptimePct     = 99.9;

  const roleBarData = Object.entries(ROLE_CFG).map(([k,c])=>({ name:k==='qa_officer'?'QA':c.label.split(' ')[0], full:c.label, count:users.filter(u=>u.role===k).length, color:c.color })).filter(r=>r.count>0);
  const statusPie   = [{ name:'Active', value:activeUsers, color:'#4ADE80' },{ name:'Inactive', value:inactiveUsers||1, color:'rgba(248,113,113,0.5)' }];

  const loginTrend = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>({ name:d, logins:[4,9,11,7,13,6,onlineNow||5][i] }));

  const responseTime = [
    {name:'Mon',ms:180},{name:'Tue',ms:142},{name:'Wed',ms:165},{name:'Thu',ms:130},{name:'Fri',ms:118},{name:'Sat',ms:155},{name:'Sun',ms:122},
  ];

  const radialData = [
    { name:'Uptime',  value:99.9, fill:'#4ADE80' },
    { name:'Health',  value:96,   fill:'#60A5FA' },
    { name:'Storage', value:34,   fill:'#FBBF24' },
  ];

  const recentUsers = [...users].filter(u=>u.last_active).sort((a,b)=>new Date(b.last_active)-new Date(a.last_active)).slice(0,6);

  const timeAgo = iso => {
    if(!iso) return '—';
    const d = Math.floor((now-new Date(iso))/60000);
    if(d<60) return `${d}m ago`; if(d<1440) return `${Math.floor(d/60)}h ago`; return `${Math.floor(d/1440)}d ago`;
  };
  const ac = n => { const C=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6']; let h=0; for(let i=0;i<(n||'').length;i++) h=(h*31+n.charCodeAt(i))&0xffff; return C[h%C.length]; };
  const av = n => n?n.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2):'?';
  const actionMeta = t => t==='create'?{color:'#4ADE80',icon:'+'} : t==='delete'?{color:'#F87171',icon:'×'} : t==='system'?{color:'#60A5FA',icon:'⊙'} : {color:'#FBBF24',icon:'✎'};

  const CTooltip = ({ active, payload, label }) => {
    if(!active||!payload?.length) return null;
    return <div style={{background:'#131626',border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,padding:'8px 14px',...F}}><div style={{fontSize:11,color:'#4A5A78',marginBottom:3}}>{label}</div><div style={{fontSize:15,fontWeight:800,color:payload[0].color||payload[0].fill||'#FFF'}}>{payload[0].value}{payload[0].name==='ms'?'ms':''}</div></div>;
  };

  const hour = now.getHours();
  const greet = hour<12?'Good Morning':hour<17?'Good Afternoon':'Good Evening';

  return (
    <div style={{...F, padding:'28px 32px', background:'#0D0F1E', minHeight:'100vh', color:'#FFF'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#1E2840;border-radius:4px}
        .oc{transition:transform .18s,box-shadow .18s} .oc:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.5)!important}
        .or:hover{background:rgba(255,255,255,.04)!important}
        .oq{transition:all .14s} .oq:hover{transform:translateY(-2px);opacity:.92}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28,flexWrap:'wrap',gap:14}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'3px',color:'#FF6B35',marginBottom:5}}>OWNER PORTAL</div>
          <h1 style={{margin:0,fontSize:26,fontWeight:900,letterSpacing:'-0.5px',lineHeight:1.1}}>
            {greet},{' '}
            <span style={{background:'linear-gradient(135deg,#FF6B35,#FBBF24)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Miran</span>
          </h1>
          <p style={{margin:'5px 0 0',fontSize:13,color:'#4A5A78'}}>Runaki QA System — Administration & System Control</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:9}}>
          {['api','db'].map(k=>{
            const ok=sysStatus[k]==='online'; const chk=sysStatus[k]==='checking';
            const col=chk?'#FBBF24':ok?'#4ADE80':'#F87171';
            return <div key={k} style={{display:'flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:20,background:`${col}12`,border:`1px solid ${col}33`,fontSize:11,fontWeight:700,color:col}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:col,boxShadow:`0 0 7px ${col}`}}/>{k==='api'?'API':'Database'} {chk?'…':ok?'Online':'Offline'}
            </div>;
          })}
          <div style={{padding:'6px 14px',borderRadius:20,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',fontSize:11,color:'#4A5A78'}}>
            {now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
          </div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:22}}>
        {[
          {l:'Total Users',   v:totalUsers,   c:'#FF6B35', sub:`Across ${Object.keys(ROLE_CFG).length} roles`},
          {l:'Active',        v:activeUsers,  c:'#4ADE80', sub:`${inactiveUsers} inactive`},
          {l:'Online Now',    v:onlineNow,    c:'#60A5FA', sub:'Active < 3h ago'},
          {l:'System Uptime', v:'99.9%',       c:'#A78BFA', sub:'Last 30 days'},
          {l:'Avg Response',  v:'142ms',       c:'#FBBF24', sub:'API latency today'},
        ].map((k,i)=>(
          <div key={i} className="oc" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'20px 18px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${k.c},${k.c}44)`,borderRadius:'0 0 16px 16px'}}/>
            <div style={{position:'absolute',top:-15,right:-15,width:60,height:60,borderRadius:'50%',background:k.c,opacity:0.1,filter:'blur(20px)'}}/>
            <div style={{position:'absolute',top:12,right:12,width:6,height:6,borderRadius:'50%',background:k.c,boxShadow:`0 0 8px ${k.c}`}}/>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#4A5A78',marginBottom:8}}>{k.l}</div>
            <div style={{fontSize:26,fontWeight:900,color:'#FFF',letterSpacing:'-0.5px',lineHeight:1}}>{loading?'—':k.v}</div>
            <div style={{fontSize:10,color:'#2E3A55',marginTop:5,fontWeight:600}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── CHARTS ROW 1 ── */}
      <div style={{display:'grid',gridTemplateColumns:'1.3fr 1fr 0.9fr',gap:14,marginBottom:14}}>

        {/* Login Activity — AreaChart */}
        <div className="oc" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:'20px 22px'}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:'2px',color:'#60A5FA',marginBottom:3}}>ACTIVITY</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:800,color:'#FFF'}}>Login Activity</div>
            <span style={{padding:'3px 10px',borderRadius:20,background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.2)',fontSize:10,fontWeight:700,color:'#60A5FA'}}>Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={loginTrend} margin={{top:4,right:4,bottom:0,left:-22}}>
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#60A5FA" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="name" tick={{fill:'#4A5A78',fontSize:10,...F}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#4A5A78',fontSize:9}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <Tooltip content={<CTooltip/>}/>
              <Area type="monotone" dataKey="logins" stroke="#60A5FA" strokeWidth={2.5} fill="url(#lg1)" dot={{fill:'#60A5FA',r:3,stroke:'#0D0F1E',strokeWidth:2}} activeDot={{r:5,fill:'#60A5FA',stroke:'#0D0F1E',strokeWidth:2}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* API Response Time — LineChart */}
        <div className="oc" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:'20px 22px'}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:'2px',color:'#FBBF24',marginBottom:3}}>PERFORMANCE</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:800,color:'#FFF'}}>API Response</div>
            <span style={{padding:'3px 10px',borderRadius:20,background:'rgba(251,191,36,0.1)',border:'1px solid rgba(251,191,36,0.2)',fontSize:10,fontWeight:700,color:'#FBBF24'}}>ms</span>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={responseTime} margin={{top:4,right:4,bottom:0,left:-22}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="name" tick={{fill:'#4A5A78',fontSize:10,...F}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#4A5A78',fontSize:9}} axisLine={false} tickLine={false} domain={[80,220]}/>
              <Tooltip content={({active,payload,label})=>{ if(!active||!payload?.length) return null; return <div style={{background:'#131626',border:'1px solid rgba(251,191,36,0.3)',borderRadius:10,padding:'8px 12px',...F}}><div style={{fontSize:10,color:'#4A5A78'}}>{label}</div><div style={{fontSize:15,fontWeight:800,color:'#FBBF24'}}>{payload[0].value}ms</div></div>; }}/>
              <Line type="monotone" dataKey="ms" stroke="#FBBF24" strokeWidth={2.5} dot={{fill:'#FBBF24',r:3,stroke:'#0D0F1E',strokeWidth:2}} activeDot={{r:5}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* System Health — Radial + bars */}
        <div className="oc" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:'20px 22px'}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:'2px',color:'#4ADE80',marginBottom:3}}>HEALTH</div>
          <div style={{fontSize:14,fontWeight:800,color:'#FFF',marginBottom:14}}>System Status</div>
          {[
            {l:'Uptime',  v:99.9, c:'#4ADE80'},
            {l:'Health',  v:96,   c:'#60A5FA'},
            {l:'Storage', v:34,   c:'#FBBF24'},
            {l:'Memory',  v:61,   c:'#A78BFA'},
          ].map((r,i)=>(
            <div key={i} style={{marginBottom:i<3?12:0}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:10,fontWeight:700,color:'#8FA3C4'}}>{r.l}</span>
                <span style={{fontSize:11,fontWeight:800,color:r.c}}>{r.v}%</span>
              </div>
              <div style={{height:5,borderRadius:4,background:'rgba(255,255,255,0.06)',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${r.v}%`,background:r.c,borderRadius:4,boxShadow:`0 0 8px ${r.c}55`}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CHARTS ROW 2 ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>

        {/* Users by Role — BarChart */}
        <div className="oc" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:'20px 22px'}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:'2px',color:'#FF6B35',marginBottom:3}}>BREAKDOWN</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:800,color:'#FFF'}}>Users by Role</div>
            <span style={{fontSize:13,fontWeight:900,color:'#FF6B35'}}>{totalUsers} total</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={roleBarData} barSize={30} margin={{top:4,right:4,bottom:0,left:-22}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="name" tick={{fill:'#8FA3C4',fontSize:11,...F}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#4A5A78',fontSize:9}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <Tooltip content={({active,payload})=>{ if(!active||!payload?.length) return null; const d=payload[0].payload; return <div style={{background:'#131626',border:`1px solid ${d.color}44`,borderRadius:10,padding:'8px 14px',...F}}><div style={{fontSize:12,fontWeight:800,color:d.color}}>{d.full}</div><div style={{fontSize:15,fontWeight:900,color:'#FFF'}}>{d.count} user{d.count!==1?'s':''}</div></div>; }} cursor={{fill:'rgba(255,255,255,0.03)'}}/>
              <Bar dataKey="count" radius={[8,8,0,0]}>
                {roleBarData.map((d,i)=><Cell key={i} fill={d.color} style={{filter:`drop-shadow(0 0 6px ${d.color}55)`}}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active vs Inactive + Queue split */}
        <div className="oc" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:'20px 22px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          {/* Active/Inactive donut */}
          <div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'2px',color:'#4ADE80',marginBottom:3}}>STATUS</div>
            <div style={{fontSize:13,fontWeight:800,color:'#FFF',marginBottom:10}}>User Status</div>
            <ResponsiveContainer width="100%" height={110}>
              <PieChart>
                <Pie data={statusPie} cx="50%" cy="50%" innerRadius={28} outerRadius={46} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {statusPie.map((d,i)=><Cell key={i} fill={d.color} style={{filter:`drop-shadow(0 0 5px ${d.color}55)`}}/>)}
                </Pie>
                <Tooltip content={({active,payload})=>{ if(!active||!payload?.length) return null; const d=payload[0].payload; return <div style={{background:'#131626',border:`1px solid ${d.color}44`,borderRadius:10,padding:'8px 12px',...F}}><div style={{fontSize:12,fontWeight:800,color:d.color}}>{d.name}</div><div style={{fontSize:14,fontWeight:900,color:'#FFF'}}>{d.value}</div></div>; }}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:6}}>
              {statusPie.map(d=>(
                <div key={d.name} style={{textAlign:'center'}}>
                  <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:2}}><div style={{width:6,height:6,borderRadius:'50%',background:d.color}}/><span style={{fontSize:10,color:'#8FA3C4'}}>{d.name}</span></div>
                  <span style={{fontSize:16,fontWeight:900,color:d.color}}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Queue distribution */}
          <div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'2px',color:'#A78BFA',marginBottom:3}}>QUEUES</div>
            <div style={{fontSize:13,fontWeight:800,color:'#FFF',marginBottom:14}}>By Queue</div>
            {['Sorani','Arabic','Badini','All'].map((q,i)=>{
              const cnt=users.filter(u=>u.queue===q).length;
              const colors=['#60A5FA','#34D399','#A78BFA','#4A5A78'];
              return cnt>0?(
                <div key={q} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:10,fontWeight:700,color:colors[i]}}>{q}</span>
                    <span style={{fontSize:10,fontWeight:800,color:'#C8D8EC'}}>{cnt}</span>
                  </div>
                  <div style={{height:5,borderRadius:4,background:'rgba(255,255,255,0.06)'}}>
                    <div style={{height:'100%',width:`${(cnt/totalUsers)*100}%`,background:colors[i],borderRadius:4,boxShadow:`0 0 6px ${colors[i]}44`}}/>
                  </div>
                </div>
              ):null;
            })}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>

        {/* Quick Actions — FULL 3×4 grid */}
        <div className="oc" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:'20px 22px'}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:'2px',color:'#34D399',marginBottom:3}}>SHORTCUTS</div>
          <div style={{fontSize:14,fontWeight:800,color:'#FFF',marginBottom:18}}>Quick Actions</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {[
              {l:'Add New User',     d:'Create a new account',    c:'#FF6B35', page:'admin-panel',
                ic:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>},
              {l:'Manage Roles',     d:'Edit role permissions',   c:'#FBBF24', page:'admin-panel',
                ic:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>},
              {l:'Queue Settings',   d:'Configure call queues',   c:'#60A5FA', page:'admin-panel',
                ic:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>},
              {l:'System Settings',  d:'App configuration',       c:'#A78BFA', page:'admin-panel',
                ic:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>},
              {l:'Activity Log',     d:'Full system audit trail', c:'#34D399', page:'activity-log',
                ic:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>},
              {l:'Reset Password',   d:'Force password change',   c:'#F87171', page:'admin-panel',
                ic:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="9" width="20" height="13" rx="2"/><circle cx="7" cy="15" r="1" fill="currentColor"/><circle cx="12" cy="15" r="1" fill="currentColor"/><circle cx="17" cy="15" r="1" fill="currentColor"/><path d="M7 9V5a5 5 0 0110 0v4"/></svg>},
              {l:'Export Users',     d:'Download user list CSV',  c:'#F472B6', page:'admin-panel',
                ic:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>},
              {l:'System Backup',    d:'Trigger manual backup',   c:'#38BDF8', page:'admin-panel',
                ic:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 16 20 20 4 20 4 16"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="2" x2="12" y2="16"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>},
            ].map((a,i)=>(
              <button key={i} className="oq" onClick={()=>setPage&&setPage(a.page)}
                style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px',borderRadius:13,background:`${a.c}0e`,border:`1px solid ${a.c}22`,cursor:'pointer',textAlign:'left',...F,width:'100%'}}>
                <div style={{width:34,height:34,borderRadius:9,background:`${a.c}1a`,border:`1px solid ${a.c}30`,display:'flex',alignItems:'center',justifyContent:'center',color:a.c,flexShrink:0}}>{a.ic}</div>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:'#FFF',marginBottom:2}}>{a.l}</div>
                  <div style={{fontSize:10,color:'#4A5A78',fontWeight:500}}>{a.d}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right column — recent users + activity */}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>

          {/* Recently Active Users */}
          <div className="oc" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,overflow:'hidden',flex:1}}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:'2px',color:'#A78BFA',marginBottom:2}}>USERS</div>
                <div style={{fontSize:13,fontWeight:800,color:'#FFF'}}>Recently Active</div>
              </div>
              <button onClick={()=>setPage&&setPage('admin-panel')} style={{padding:'6px 14px',borderRadius:10,background:'linear-gradient(135deg,#FF6B35,#FF8C5A)',border:'none',color:'#FFF',fontSize:11,fontWeight:700,cursor:'pointer',...F}}>
                + Add User
              </button>
            </div>
            {recentUsers.map((u,i)=>{
              const rc=ROLE_CFG[u.role]||ROLE_CFG.agent;
              return (
                <div key={u.id} className="or" style={{display:'flex',alignItems:'center',gap:10,padding:'11px 20px',borderBottom:i<recentUsers.length-1?'1px solid rgba(255,255,255,0.04)':'none',background:'transparent',transition:'background .15s'}}>
                  <div style={{width:30,height:30,borderRadius:8,background:`${ac(u.name)}22`,border:`1px solid ${ac(u.name)}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:ac(u.name),flexShrink:0}}>{av(u.name)}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:'#FFF',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.name}</div>
                    <div style={{fontSize:10,color:'#4A5A78'}}>{rc.label} · {u.queue}</div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                    <div style={{width:5,height:5,borderRadius:'50%',background:u.status==='active'?'#4ADE80':'#F87171',boxShadow:u.status==='active'?'0 0 5px #4ADE80':''}}/>
                    <span style={{fontSize:10,color:'#2E3A55'}}>{timeAgo(u.last_active)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* System Activity */}
          <div className="oc" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,overflow:'hidden'}}>
            <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:'2px',color:'#60A5FA',marginBottom:2}}>AUDIT TRAIL</div>
              <div style={{fontSize:13,fontWeight:800,color:'#FFF'}}>Recent Activity</div>
            </div>
            <div style={{padding:'4px 0',maxHeight:220,overflowY:'auto'}}>
              {ACTIVITY_LOG.map((log,i)=>{
                const m=actionMeta(log.type);
                return (
                  <div key={log.id} className="or" style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 20px',borderBottom:i<ACTIVITY_LOG.length-1?'1px solid rgba(255,255,255,0.04)':'none',background:'transparent',transition:'background .15s'}}>
                    <div style={{width:24,height:24,borderRadius:7,background:`${m.color}18`,border:`1px solid ${m.color}30`,display:'flex',alignItems:'center',justifyContent:'center',color:m.color,fontSize:13,fontWeight:900,flexShrink:0,marginTop:1}}>{m.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',justifyContent:'space-between',gap:6}}>
                        <span style={{fontSize:11,fontWeight:700,color:'#C8D8EC'}}>{log.user}</span>
                        <span style={{fontSize:10,color:'#2E3A55',flexShrink:0}}>{timeAgo(log.time)}</span>
                      </div>
                      <div style={{fontSize:10,color:'#4A5A78'}}>{log.action} <span style={{color:m.color,fontWeight:600}}>→ {log.target}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}