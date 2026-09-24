import React, { useState, useEffect } from 'react';
import axios from 'axios';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const fmt=(d)=>d?new Date(d).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—';
const fmtTime=(d)=>d?new Date(d).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}):'—';
const fmtDate=(d)=>d?new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—';

const ACTION_CFG={
  evaluation_created: {label:'Evaluation Created', color:'#4ADE80', bg:'rgba(74,222,128,0.12)', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/></svg>},
  evaluation_updated: {label:'Evaluation Updated', color:'#60A5FA', bg:'rgba(96,165,250,0.12)', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>},
  coaching_completed: {label:'Coaching Completed', color:'#FBBF24', bg:'rgba(251,191,36,0.12)', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>},
  viva_created:       {label:'VIVA Created',       color:'#A78BFA', bg:'rgba(167,139,250,0.12)', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>},
  viva_conducted:     {label:'VIVA Conducted',     color:'#F472B6', bg:'rgba(244,114,182,0.12)', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>},
  session_created:    {label:'Session Created',    color:'#38BDF8', bg:'rgba(56,189,248,0.12)',   icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
  session_deleted:    {label:'Session Deleted',    color:'#F87171', bg:'rgba(248,113,113,0.12)',   icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>},
  spot_check_created: {label:'Spot Check Added',   color:'#FB923C', bg:'rgba(251,146,60,0.12)',   icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>},
  login:              {label:'User Login',         color:'#34D399', bg:'rgba(52,211,153,0.12)',   icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>},
};
const DEMO_LOGS=[
  {id:1,action:'evaluation_created',user:'Brwa',details:'Created evaluation for Agent Rawa | Score: 85%',timestamp:new Date(Date.now()-2*60000).toISOString()},
  {id:2,action:'coaching_completed',user:'Sizar',details:'Marked coaching as done for Agent Karwan',timestamp:new Date(Date.now()-15*60000).toISOString()},
  {id:3,action:'viva_conducted',user:'Mohammed',details:'Conducted VIVA for Agent Dilan | Pass',timestamp:new Date(Date.now()-38*60000).toISOString()},
  {id:4,action:'evaluation_created',user:'Brwa',details:'Created evaluation for Agent Lana | Score: 72%',timestamp:new Date(Date.now()-62*60000).toISOString()},
  {id:5,action:'session_created',user:'Miran',details:'Created session: Communication Skills Q2',timestamp:new Date(Date.now()-3*3600000).toISOString()},
  {id:6,action:'spot_check_created',user:'Sizar',details:'Added spot check for Agent Harivan | Correct',timestamp:new Date(Date.now()-5*3600000).toISOString()},
  {id:7,action:'viva_created',user:'Miran',details:'Created VIVA template: New Levels Assessment',timestamp:new Date(Date.now()-8*3600000).toISOString()},
  {id:8,action:'evaluation_updated',user:'Mohammed',details:'Updated feedback for Agent Rawa',timestamp:new Date(Date.now()-12*3600000).toISOString()},
  {id:9,action:'login',user:'Brwa',details:'Logged into the system',timestamp:new Date(Date.now()-24*3600000).toISOString()},
  {id:10,action:'session_deleted',user:'Miran',details:'Deleted session: Outdated Protocol Review',timestamp:new Date(Date.now()-2*24*3600000).toISOString()},
  {id:11,action:'evaluation_created',user:'Sizar',details:'Created evaluation for Agent Hozan | Score: 55%',timestamp:new Date(Date.now()-2*24*3600000+1000*60*30).toISOString()},
  {id:12,action:'coaching_completed',user:'Brwa',details:'Marked coaching as done for Agent Rawa',timestamp:new Date(Date.now()-3*24*3600000).toISOString()},
];

const getRelativeTime=(d)=>{
  const diff=(Date.now()-new Date(d).getTime())/1000;
  if(diff<60) return 'Just now';
  if(diff<3600) return `${Math.floor(diff/60)}m ago`;
  if(diff<86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
};

const ActivityLog = () => {
  const [logs,setLogs]           = useState([]);
  const [search,setSearch]       = useState('');
  const [fAction,setFAction]     = useState('all');
  const [fUser,setFUser]         = useState('all');
  const [loading,setLoading]     = useState(false);
  const [page,setPage]           = useState(1);
  const PER_PAGE=15;

  useEffect(()=>{
    fetchLogs();
    const s=document.createElement('style');s.id='al-s';
    s.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      .al-in::placeholder{color:#4A5A75!important;}
      .al-in:focus{border-color:#FF6B35!important;box-shadow:0 0 0 3px rgba(255,107,53,0.15)!important;outline:none;}
      .al-sel:focus{border-color:#FF6B35!important;outline:none;}
      .al-sel option{background:#141728;color:#F1F5F9;}
      .al-row:hover{background:rgba(255,255,255,0.04)!important;}
      .al-pg:hover:not(:disabled){background:rgba(255,107,53,0.2)!important;border-color:rgba(255,107,53,0.4)!important;color:#FF8C5A!important;}
      ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);} ::-webkit-scrollbar-thumb{background:#252A45;border-radius:10px;} ::-webkit-scrollbar-thumb:hover{background:#FF6B35;}
    `;
    if(!document.getElementById('al-s'))document.head.appendChild(s);
  },[]);

  const fetchLogs=async()=>{
    setLoading(true);
    try{ const r=await axios.get('http://localhost:8080/api/activity-logs'); setLogs(r.data); }
    catch(e){ setLogs(DEMO_LOGS); }
    finally{setLoading(false);}
  };

  const users=[...new Set(logs.map(l=>l.user).filter(Boolean))].sort();
  const actions=[...new Set(logs.map(l=>l.action).filter(Boolean))].sort();

  const filtered=logs.filter(l=>{
    const ms=(l.user||'').toLowerCase().includes(search.toLowerCase())||(l.details||'').toLowerCase().includes(search.toLowerCase());
    const ma=fAction==='all'||l.action===fAction;
    const mu=fUser==='all'||l.user===fUser;
    return ms&&ma&&mu;
  });

  const totalPages=Math.ceil(filtered.length/PER_PAGE);
  const paged=filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);

  const inSt ={...F,width:'100%',padding:'9px 13px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',fontSize:'13px',color:'#F1F5F9',outline:'none',transition:'all 0.15s',boxSizing:'border-box'};
  const selSt={...inSt,cursor:'pointer',appearance:'none',backgroundColor:'rgba(255,255,255,0.07)',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23C8D4E8' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 11px center',paddingRight:'30px'};

  // Counts by action type
  const counts=logs.reduce((acc,l)=>{acc[l.action]=(acc[l.action]||0)+1;return acc;},{});

  return (
    <div style={{...F,minHeight:'100vh',background:'#0D0F1E',color:'#F1F5F9'}}>
      {/* HEADER */}
      <div style={{padding:'0 40px',height:'72px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.09)',background:'rgba(255,255,255,0.025)',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{width:'38px',height:'38px',borderRadius:'11px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(255,107,53,0.45)'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',lineHeight:1}}>Runaki QA</div>
            <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF',letterSpacing:'-0.4px',lineHeight:1.25}}>Activity Log</div>
          </div>
        </div>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <div style={{fontSize:'12px',fontWeight:'700',color:'#8FA3C4',background:'rgba(255,255,255,0.05)',padding:'6px 12px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.09)'}}>
            Last refreshed: <span style={{color:'#C8D8EC'}}>{new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</span>
          </div>
          <button onClick={fetchLogs} style={{...F,padding:'8px 16px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',color:'#C8D4E8',fontSize:'13px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Refresh
          </button>
          <div style={{padding:'8px 18px',background:'rgba(255,107,53,0.12)',border:'1px solid rgba(255,107,53,0.35)',borderRadius:'9px',fontSize:'13px',fontWeight:'800',color:'#FF8C5A'}}>{logs.length} Events</div>
        </div>
      </div>

      <div style={{padding:'32px 40px'}}>
        {/* STATS STRIP */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px',marginBottom:'28px'}}>
          {[
            {label:'Total Events',  val:logs.length,   accent:'#FF6B35',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>},
            {label:'Evaluations',   val:counts['evaluation_created']||0, accent:'#4ADE80',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/></svg>},
            {label:'VIVA Events',   val:(counts['viva_created']||0)+(counts['viva_conducted']||0), accent:'#A78BFA',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/></svg>},
            {label:'Session Events',val:(counts['session_created']||0)+(counts['session_deleted']||0), accent:'#38BDF8',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
          ].map((s,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.055)',border:'1px solid rgba(255,255,255,0.11)',borderRadius:'18px',padding:'18px 22px',position:'relative',overflow:'hidden',display:'flex',alignItems:'center',gap:'14px'}}>
              <div style={{width:'40px',height:'40px',borderRadius:'12px',background:`${s.accent}22`,border:`1px solid ${s.accent}44`,display:'flex',alignItems:'center',justifyContent:'center',color:s.accent,flexShrink:0}}>{s.icon}</div>
              <div>
                <div style={{fontSize:'11px',fontWeight:'700',color:'#8FA3C4',letterSpacing:'1.2px',textTransform:'uppercase'}}>{s.label}</div>
                <div style={{fontSize:'28px',fontWeight:'900',color:'#FFFFFF',letterSpacing:'-0.5px',lineHeight:1.1}}>{s.val}</div>
              </div>
              <div style={{position:'absolute',bottom:0,left:0,right:0,height:'2.5px',background:`linear-gradient(90deg,${s.accent} 0%,transparent 65%)`}}/>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',padding:'14px 18px',display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'10px',marginBottom:'20px'}}>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',color:'#4A5A75',pointerEvents:'none'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></div>
            <input type="text" className="al-in" placeholder="Search events, users, details..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} style={{...inSt,paddingLeft:'38px'}}/>
          </div>
          <select className="al-sel" value={fAction} onChange={e=>{setFAction(e.target.value);setPage(1);}} style={selSt}>
            <option value="all">All Actions</option>
            {Object.entries(ACTION_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
          </select>
          <select className="al-sel" value={fUser} onChange={e=>{setFUser(e.target.value);setPage(1);}} style={selSt}>
            <option value="all">All Users</option>
            {users.map(u=><option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        {/* TIMELINE */}
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',overflow:'hidden'}}>
          {/* Table Header */}
          <div style={{display:'grid',gridTemplateColumns:'200px 1fr 160px 100px',padding:'13px 28px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            {['Action','Details','User','Time'].map(c=>(
              <div key={c} style={{fontSize:'11px',fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase',color:'#8FA3C4'}}>{c}</div>
            ))}
          </div>

          <div style={{maxHeight:'560px',overflowY:'auto'}}>
            {loading?(
              <div style={{padding:'60px',textAlign:'center',color:'#8FA3C4',fontWeight:'600',fontSize:'14px'}}>Loading activity...</div>
            ):paged.length===0?(
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'80px 40px',gap:'16px'}}>
                <div style={{width:'56px',height:'56px',borderRadius:'18px',background:'rgba(255,107,53,0.1)',border:'1px solid rgba(255,107,53,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#FF6B35'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div style={{fontSize:'16px',fontWeight:'800',color:'#E8EFF8'}}>No activity found</div>
                <div style={{fontSize:'13px',color:'#8FA3C4',fontWeight:'600'}}>Try adjusting your filters</div>
              </div>
            ):paged.map((log,i)=>{
              const cfg=ACTION_CFG[log.action]||{label:log.action,color:'#8FA3C4',bg:'rgba(255,255,255,0.07)',icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/></svg>};
              const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6'];
              const uc=ACLR[(log.user?.charCodeAt(0)||0)%ACLR.length];
              return(
                <div key={log.id} className="al-row" style={{display:'grid',gridTemplateColumns:'200px 1fr 160px 100px',padding:'14px 28px',borderBottom:'1px solid rgba(255,255,255,0.05)',alignItems:'center',transition:'background 0.1s'}}>
                  <div style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'5px 12px',borderRadius:'9px',background:cfg.bg,border:`1px solid ${cfg.color}33`,width:'fit-content'}}>
                    <span style={{color:cfg.color,display:'flex',alignItems:'center',flexShrink:0}}>{cfg.icon}</span>
                    <span style={{fontSize:'12px',fontWeight:'700',color:cfg.color,whiteSpace:'nowrap'}}>{cfg.label}</span>
                  </div>
                  <div style={{fontSize:'13px',fontWeight:'600',color:'#C8D8EC',paddingLeft:'16px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:'20px'}}>{log.details}</div>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <div style={{width:'28px',height:'28px',borderRadius:'8px',background:`linear-gradient(135deg,${uc},${uc}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'900',color:'white',flexShrink:0}}>
                      {log.user?.[0]?.toUpperCase()||'?'}
                    </div>
                    <span style={{fontSize:'13px',fontWeight:'700',color:'#FFFFFF'}}>{log.user||'System'}</span>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'12px',fontWeight:'700',color:'#C8D8EC'}}>{getRelativeTime(log.timestamp)}</div>
                    <div style={{fontSize:'11px',color:'#4A5A75',marginTop:'2px'}}>{fmtTime(log.timestamp)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          {filtered.length>PER_PAGE&&(
            <div style={{padding:'14px 28px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'600'}}>
                Showing <strong style={{color:'#C8D8EC'}}>{(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)}</strong> of <strong style={{color:'#C8D8EC'}}>{filtered.length}</strong>
              </span>
              <div style={{display:'flex',gap:'6px'}}>
                <button className="al-pg" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{...F,padding:'6px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',color:'#8FA3C4',fontSize:'12px',fontWeight:'700',cursor:page===1?'not-allowed':'pointer',opacity:page===1?0.4:1,transition:'all 0.15s'}}>← Prev</button>
                {Array.from({length:Math.min(5,totalPages)},(_, i)=>{
                  const p=Math.max(1,Math.min(page-2,totalPages-4))+i;
                  return(
                    <button key={p} className="al-pg" onClick={()=>setPage(p)} style={{...F,padding:'6px 12px',background:page===p?'rgba(255,107,53,0.2)':'rgba(255,255,255,0.06)',border:`1px solid ${page===p?'rgba(255,107,53,0.4)':'rgba(255,255,255,0.12)'}`,borderRadius:'8px',color:page===p?'#FF8C5A':'#8FA3C4',fontSize:'12px',fontWeight:'800',cursor:'pointer',transition:'all 0.15s'}}>{p}</button>
                  );
                })}
                <button className="al-pg" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{...F,padding:'6px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',color:'#8FA3C4',fontSize:'12px',fontWeight:'700',cursor:page===totalPages?'not-allowed':'pointer',opacity:page===totalPages?0.4:1,transition:'all 0.15s'}}>Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ActivityLog;