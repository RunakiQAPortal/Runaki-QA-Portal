import React, { useState, useEffect } from 'react';
import axios from 'axios';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const acol=(n)=>ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const ini=(n)=>n?n.trim().split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase():'?';
const fmt=(d)=>d?new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—';
const STATUS_CFG={
  active:  {label:'Active',  bg:'rgba(74,222,128,0.12)', border:'rgba(74,222,128,0.3)', color:'#4ADE80'},
  pending: {label:'Pending', bg:'rgba(251,191,36,0.12)', border:'rgba(251,191,36,0.3)', color:'#FBBF24'},
  completed:{label:'Completed',bg:'rgba(160,139,250,0.12)',border:'rgba(160,139,250,0.3)',color:'#A78BFA'},
};

const SessionsManagement = () => {
  const [sessions,setSessions]   = useState([]);
  const [showForm,setShowForm]   = useState(false);
  const [attModal,setAttModal]   = useState(null);
  const [search,setSearch]       = useState('');
  const [fStatus,setFStatus]     = useState('all');
  const [attSearch,setAttSearch] = useState('');
  const [loading,setLoading]     = useState(false);
  const [deleting,setDeleting]   = useState(null);
  const [form,setForm]           = useState({title:'',trainer:'',date:'',duration:'',description:''});

  useEffect(()=>{
    fetchSessions();
    const s=document.createElement('style'); s.id='sm-s';
    s.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      .sm-in::placeholder{color:#4A5A75!important;}
      .sm-in:focus{border-color:#FF6B35!important;box-shadow:0 0 0 3px rgba(255,107,53,0.15)!important;outline:none;}
      .sm-sel:focus{border-color:#FF6B35!important;outline:none;}
      .sm-sel option{background:#141728;color:#F1F5F9;}
      .sm-row:hover{background:rgba(255,255,255,0.04)!important;}
      .sm-del:hover{background:rgba(248,113,113,0.2)!important;border-color:rgba(248,113,113,0.4)!important;color:#F87171!important;}
      .sm-att:hover{background:rgba(255,107,53,0.2)!important;border-color:rgba(255,107,53,0.4)!important;}
      .sm-sub:hover{background:linear-gradient(135deg,#e05a28,#e08514)!important;}
      ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);} ::-webkit-scrollbar-thumb{background:#252A45;border-radius:10px;} ::-webkit-scrollbar-thumb:hover{background:#FF6B35;}
    `;
    if(!document.getElementById('sm-s')) document.head.appendChild(s);
  },[]);

  const fetchSessions=async()=>{setLoading(true);try{const r=await axios.get('http://localhost:8080/api/sessions');setSessions(r.data);}catch(e){console.error(e);}finally{setLoading(false);}};

  const createSession=async()=>{
    if(!form.title||!form.trainer||!form.date){alert('Title, Trainer, and Date are required.');return;}
    try{await axios.post('http://localhost:8080/api/sessions',form);setForm({title:'',trainer:'',date:'',duration:'',description:''});setShowForm(false);await fetchSessions();}catch(e){console.error(e);}
  };

  const deleteSession=async(id)=>{
    if(!window.confirm('Delete this session?'))return;
    setDeleting(id);try{await axios.delete(`http://localhost:8080/api/sessions/${id}`);await fetchSessions();}catch(e){console.error(e);}finally{setDeleting(null);}
  };

  const toggleAttendance=async(sessionId,agentId,current)=>{
    try{
      await axios.patch(`http://localhost:8080/api/sessions/${sessionId}/attendance/${agentId}`,{status:current==='attended'?'pending':'attended'});
      const r=await axios.get('http://localhost:8080/api/sessions');
      setSessions(r.data);
      const updated=r.data.find(s=>s.id===sessionId);
      if(updated)setAttModal(updated);
    }catch(e){console.error(e);}
  };

  const filtered=sessions.filter(s=>{
    const ms=(s.title||'').toLowerCase().includes(search.toLowerCase())||(s.trainer||'').toLowerCase().includes(search.toLowerCase());
    const mst=fStatus==='all'||s.status===fStatus;
    return ms&&mst;
  });

  const total=sessions.length;
  const active=sessions.filter(s=>s.status==='active').length;
  const pending=sessions.filter(s=>s.status==='pending').length;
  const completed=sessions.filter(s=>s.status==='completed').length;

  const inSt ={...F,width:'100%',padding:'9px 13px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',fontSize:'13px',color:'#F1F5F9',outline:'none',transition:'all 0.15s',boxSizing:'border-box'};
  const selSt={...inSt,cursor:'pointer',appearance:'none',backgroundColor:'rgba(255,255,255,0.07)',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23C8D4E8' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 11px center',paddingRight:'30px'};
  const lblSt={display:'block',fontSize:'11px',fontWeight:'700',color:'#8FA3C4',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'7px'};

  const attendedCount=(s)=>(s.attendees||[]).filter(a=>a.status==='attended').length;
  const totalCount=(s)=>(s.attendees||[]).length;

  return (
    <div style={{...F,minHeight:'100vh',background:'#0D0F1E',color:'#F1F5F9'}}>
      {/* HEADER */}
      <div style={{padding:'0 40px',height:'72px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.09)',background:'rgba(255,255,255,0.025)',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{width:'38px',height:'38px',borderRadius:'11px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(255,107,53,0.45)'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
          </div>
          <div>
            <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',lineHeight:1}}>Runaki QA</div>
            <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF',letterSpacing:'-0.4px',lineHeight:1.25}}>Sessions Management</div>
          </div>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <button onClick={fetchSessions} style={{...F,padding:'8px 16px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',color:'#C8D4E8',fontSize:'13px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Refresh
          </button>
          <button onClick={()=>setShowForm(v=>!v)} style={{...F,padding:'8px 18px',background:showForm?'rgba(255,107,53,0.2)':'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:showForm?'1px solid rgba(255,107,53,0.4)':'none',borderRadius:'9px',color:'white',fontSize:'13px',fontWeight:'700',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',boxShadow:showForm?'none':'0 4px 16px rgba(255,107,53,0.4)'}}>
            {showForm?'✕ Cancel':'+ New Session'}
          </button>
        </div>
      </div>

      <div style={{padding:'32px 40px'}}>
        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'28px'}}>
          {[
            {label:'Total Sessions', val:total,     sub:'all time',    accent:'#FF6B35',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
            {label:'Active',         val:active,    sub:'in progress', accent:'#4ADE80',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>},
            {label:'Pending',        val:pending,   sub:'not started', accent:'#FBBF24',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>},
            {label:'Completed',      val:completed, sub:'finished',    accent:'#A78BFA',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>},
          ].map((s,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.055)',border:'1px solid rgba(255,255,255,0.11)',borderRadius:'18px',padding:'22px 24px',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:'-24px',right:'-24px',width:'90px',height:'90px',borderRadius:'50%',background:`radial-gradient(circle,${s.accent}22 0%,transparent 70%)`,pointerEvents:'none'}}/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'18px'}}>
                <div style={{width:'40px',height:'40px',borderRadius:'12px',background:`${s.accent}22`,border:`1px solid ${s.accent}44`,display:'flex',alignItems:'center',justifyContent:'center',color:s.accent}}>{s.icon}</div>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:s.accent,boxShadow:`0 0 10px ${s.accent},0 0 20px ${s.accent}55`}}/>
              </div>
              <div style={{fontSize:'11px',fontWeight:'700',color:'#8FA3C4',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'6px'}}>{s.label}</div>
              <div style={{fontSize:'34px',fontWeight:'900',color:'#FFFFFF',letterSpacing:'-1px',lineHeight:1}}>{s.val}</div>
              <div style={{fontSize:'12px',fontWeight:'600',color:'#7B8FAD',marginTop:'6px'}}>{s.sub}</div>
              <div style={{position:'absolute',bottom:0,left:0,right:0,height:'2.5px',background:`linear-gradient(90deg,${s.accent} 0%,transparent 65%)`}}/>
            </div>
          ))}
        </div>

        {/* CREATE FORM */}
        {showForm&&(
          <div style={{background:'rgba(255,107,53,0.06)',border:'1.5px solid rgba(255,107,53,0.3)',borderRadius:'18px',padding:'26px 28px',marginBottom:'22px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'20px'}}>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#FF6B35',boxShadow:'0 0 10px #FF6B35'}}/>
              <span style={{fontSize:'13px',fontWeight:'800',color:'#FF8C5A',textTransform:'uppercase',letterSpacing:'1.5px'}}>Create New Session</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'14px',marginBottom:'14px'}}>
              {[{k:'title',l:'Title *',ph:'Session title'},{k:'trainer',l:'Trainer *',ph:'Trainer name'},{k:'date',l:'Date *',type:'date'},{k:'duration',l:'Duration',ph:'e.g. 90 min'}].map(f=>(
                <div key={f.k}>
                  <label style={lblSt}>{f.l}</label>
                  <input type={f.type||'text'} className="sm-in" placeholder={f.ph} value={form[f.k]} onChange={e=>setForm(v=>({...v,[f.k]:e.target.value}))} style={inSt}/>
                </div>
              ))}
            </div>
            <div style={{marginBottom:'16px'}}>
              <label style={lblSt}>Description</label>
              <textarea className="sm-in" placeholder="Session description or objectives..." value={form.description} onChange={e=>setForm(v=>({...v,description:e.target.value}))} style={{...inSt,height:'68px',resize:'vertical'}}/>
            </div>
            <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
              <button onClick={()=>setShowForm(false)} style={{...F,padding:'10px 22px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'10px',color:'#C8D4E8',fontSize:'13px',fontWeight:'700',cursor:'pointer'}}>Cancel</button>
              <button className="sm-sub" onClick={createSession} style={{...F,padding:'10px 28px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',borderRadius:'10px',color:'white',fontSize:'13px',fontWeight:'800',cursor:'pointer',boxShadow:'0 4px 16px rgba(255,107,53,0.4)',transition:'all 0.15s'}}>+ Create Session</button>
            </div>
          </div>
        )}

        {/* FILTER */}
        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',padding:'14px 18px',display:'grid',gridTemplateColumns:'2fr 1fr',gap:'10px',marginBottom:'20px'}}>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',color:'#4A5A75',pointerEvents:'none'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></div>
            <input type="text" className="sm-in" placeholder="Search sessions or trainers..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inSt,paddingLeft:'38px'}}/>
          </div>
          <select className="sm-sel" value={fStatus} onChange={e=>setFStatus(e.target.value)} style={selSt}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* TABLE */}
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',overflow:'hidden'}}>
          <div style={{display:'grid',gridTemplateColumns:'2.5fr 1.3fr 1fr 1fr 150px 110px 110px',padding:'13px 28px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            {['Session','Trainer','Date','Duration','Attendance','Status',''].map(c=>(
              <div key={c} style={{fontSize:'11px',fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase',color:'#8FA3C4'}}>{c}</div>
            ))}
          </div>
          <div style={{maxHeight:'520px',overflowY:'auto'}}>
            {loading?<div style={{padding:'60px',textAlign:'center',color:'#8FA3C4',fontWeight:'600'}}>Loading...</div>:
            filtered.length===0?(
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'80px 40px',gap:'16px'}}>
                <div style={{width:'56px',height:'56px',borderRadius:'18px',background:'rgba(255,107,53,0.1)',border:'1px solid rgba(255,107,53,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#FF6B35'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div style={{fontSize:'16px',fontWeight:'800',color:'#E8EFF8'}}>No sessions found</div>
                <div style={{fontSize:'13px',color:'#8FA3C4',fontWeight:'600'}}>Create your first session</div>
              </div>
            ):filtered.map(session=>{
              const att=attendedCount(session); const tot=totalCount(session); const pct=tot?Math.round(att/tot*100):0;
              const cfg=STATUS_CFG[session.status]||STATUS_CFG.pending;
              return (
                <div key={session.id} className="sm-row" style={{display:'grid',gridTemplateColumns:'2.5fr 1.3fr 1fr 1fr 150px 110px 110px',padding:'14px 28px',borderBottom:'1px solid rgba(255,255,255,0.05)',alignItems:'center',transition:'background 0.1s'}}>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:'700',color:'#FFFFFF'}}>{session.title}</div>
                    {session.description&&<div style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'500',marginTop:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'260px'}}>{session.description}</div>}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
                    <div style={{width:'30px',height:'30px',borderRadius:'8px',background:`linear-gradient(135deg,${acol(session.trainer)},${acol(session.trainer)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'800',color:'white',flexShrink:0}}>{ini(session.trainer)}</div>
                    <span style={{fontSize:'13px',fontWeight:'600',color:'#C8D8EC'}}>{session.trainer}</span>
                  </div>
                  <span style={{fontSize:'12px',fontWeight:'600',color:'#8FA3C4'}}>{fmt(session.date)}</span>
                  <span style={{fontSize:'12px',fontWeight:'600',color:'#8FA3C4'}}>{session.duration||'—'}</span>
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'5px'}}>
                      <span style={{fontSize:'11px',fontWeight:'700',color:'#8FA3C4'}}>{att}/{tot}</span>
                      <span style={{fontSize:'11px',fontWeight:'800',color:pct>=80?'#4ADE80':pct>=50?'#FBBF24':'#F87171'}}>{pct}%</span>
                    </div>
                    <div style={{height:'5px',borderRadius:'3px',background:'rgba(255,255,255,0.08)',overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${pct}%`,borderRadius:'3px',background:pct>=80?'linear-gradient(90deg,#4ADE80,#22C55E)':pct>=50?'linear-gradient(90deg,#FBBF24,#F59E0B)':'linear-gradient(90deg,#F87171,#EF4444)',transition:'width 0.5s ease'}}/>
                    </div>
                  </div>
                  <div style={{display:'inline-flex',alignItems:'center',gap:'5px',padding:'5px 11px',borderRadius:'8px',background:cfg.bg,border:`1px solid ${cfg.border}`}}>
                    <div style={{width:'5px',height:'5px',borderRadius:'50%',background:cfg.color,boxShadow:`0 0 5px ${cfg.color}`}}/>
                    <span style={{fontSize:'12px',fontWeight:'700',color:cfg.color}}>{cfg.label}</span>
                  </div>
                  <div style={{display:'flex',gap:'7px'}}>
                    <button className="sm-att" onClick={()=>setAttModal(session)} style={{...F,padding:'6px 10px',background:'rgba(255,107,53,0.1)',border:'1px solid rgba(255,107,53,0.3)',borderRadius:'8px',color:'#FF8C5A',fontSize:'11px',fontWeight:'700',cursor:'pointer',transition:'all 0.15s'}}>Attend</button>
                    <button className="sm-del" onClick={()=>deleteSession(session.id)} disabled={deleting===session.id} style={{...F,padding:'6px 10px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',color:'#8FA3C4',fontSize:'11px',fontWeight:'700',cursor:'pointer',transition:'all 0.15s',opacity:deleting===session.id?0.5:1}}>
                      {deleting===session.id?'...':'Del'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length>0&&(
            <div style={{padding:'12px 28px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'600'}}>Showing <strong style={{color:'#C8D8EC'}}>{filtered.length}</strong> of <strong style={{color:'#C8D8EC'}}>{sessions.length}</strong> sessions</span>
            </div>
          )}
        </div>
      </div>

      {/* ATTENDANCE MODAL */}
      {attModal&&(
        <div onClick={()=>setAttModal(null)} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
          <div onClick={e=>e.stopPropagation()} style={{...F,background:'#131626',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'24px',width:'100%',maxWidth:'520px',maxHeight:'88vh',overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'0 60px 120px rgba(0,0,0,0.85)'}}>
            <div style={{padding:'26px 30px 20px',borderBottom:'1px solid rgba(255,255,255,0.09)',flexShrink:0}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'18px'}}>
                <div>
                  <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:'4px'}}>Attendance</div>
                  <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF'}}>{attModal.title}</div>
                  <div style={{fontSize:'13px',color:'#8FA3C4',fontWeight:'600',marginTop:'3px'}}>{attModal.trainer} · {fmt(attModal.date)}</div>
                </div>
                <button onClick={()=>setAttModal(null)} style={{...F,width:'34px',height:'34px',borderRadius:'9px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'#94A3B8',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.12)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}>✕</button>
              </div>
              {/* Mini Stats */}
              {(()=>{const att=attendedCount(attModal);const tot=totalCount(attModal);const pct=tot?Math.round(att/tot*100):0;return(
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'14px'}}>
                  {[['Total',tot,'#60A5FA'],['Attended',att,'#4ADE80'],['Pending',tot-att,'#FBBF24']].map(([l,v,c])=>(
                    <div key={l} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'12px',padding:'12px 14px',textAlign:'center'}}>
                      <div style={{fontSize:'11px',fontWeight:'700',color:'#8FA3C4',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>{l}</div>
                      <div style={{fontSize:'24px',fontWeight:'900',color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
              );})()}
              <div style={{height:'6px',borderRadius:'4px',background:'rgba(255,255,255,0.08)',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${totalCount(attModal)?Math.round(attendedCount(attModal)/totalCount(attModal)*100):0}%`,background:'linear-gradient(90deg,#FF6B35,#FF9F1C)',borderRadius:'4px',transition:'width 0.5s ease'}}/>
              </div>
              <div style={{marginTop:'12px',position:'relative'}}>
                <div style={{position:'absolute',left:'11px',top:'50%',transform:'translateY(-50%)',color:'#4A5A75',pointerEvents:'none'}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></div>
                <input type="text" className="sm-in" placeholder="Search agents..." value={attSearch} onChange={e=>setAttSearch(e.target.value)} style={{...inSt,paddingLeft:'34px'}}/>
              </div>
            </div>
            <div style={{overflowY:'auto',flex:1,padding:'8px 0'}}>
              {((attModal.attendees||[]).filter(a=>(a.name||'').toLowerCase().includes(attSearch.toLowerCase()))).map(agent=>(
                <div key={agent.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 28px',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
                    <div style={{width:'34px',height:'34px',borderRadius:'9px',background:`linear-gradient(135deg,${acol(agent.name)},${acol(agent.name)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'800',color:'white',flexShrink:0}}>{ini(agent.name)}</div>
                    <div>
                      <div style={{fontSize:'14px',fontWeight:'700',color:'#FFFFFF'}}>{agent.name}</div>
                      {agent.coordinator&&<div style={{fontSize:'11px',color:'#8FA3C4',fontWeight:'500'}}>{agent.coordinator}</div>}
                    </div>
                  </div>
                  <button onClick={()=>toggleAttendance(attModal.id,agent.id,agent.status)} style={{...F,padding:'6px 16px',borderRadius:'8px',border:`1.5px solid ${agent.status==='attended'?'rgba(74,222,128,0.4)':'rgba(251,191,36,0.35)'}`,background:agent.status==='attended'?'rgba(74,222,128,0.12)':'rgba(251,191,36,0.1)',color:agent.status==='attended'?'#4ADE80':'#FBBF24',fontSize:'12px',fontWeight:'800',cursor:'pointer',transition:'all 0.15s'}}>
                    {agent.status==='attended'?'✓ Done':'Pending'}
                  </button>
                </div>
              ))}
            </div>
            <div style={{padding:'16px 28px 24px',borderTop:'1px solid rgba(255,255,255,0.08)',flexShrink:0}}>
              <button onClick={()=>setAttModal(null)} style={{...F,width:'100%',padding:'12px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',borderRadius:'12px',color:'white',fontSize:'14px',fontWeight:'800',cursor:'pointer',boxShadow:'0 6px 22px rgba(255,107,53,0.4)'}}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsManagement;