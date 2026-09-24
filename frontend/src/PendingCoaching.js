import React, { useState, useEffect } from 'react';
import axios from 'axios';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const acol=(n)=>ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const ini=(n)=>n?n.trim().split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase():'?';
const fmt=(d)=>d?new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—';
const sc=(s)=>s>=80?'#4ADE80':s>=60?'#FBBF24':'#F87171';
const sbg=(s)=>s>=80?'rgba(74,222,128,0.15)':s>=60?'rgba(251,191,36,0.15)':'rgba(248,113,113,0.15)';
const sbd=(s)=>s>=80?'rgba(74,222,128,0.35)':s>=60?'rgba(251,191,36,0.35)':'rgba(248,113,113,0.35)';
const slb=(s)=>s>=80?'Excellent':s>=60?'Average':'Needs Work';

const PendingCoaching = () => {
  const [items,setItems]     = useState([]);
  const [selected,setSelected] = useState(null);
  const [completing,setCompleting] = useState(null);
  const [search,setSearch]   = useState('');
  const [fQA,setFQA]         = useState('all');
  const [fScore,setFScore]   = useState('all');
  const [hovCard,setHovCard] = useState(null);

  useEffect(()=>{
    fetchData();
    const s=document.createElement('style'); s.id='co-s';
    s.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      .co-in::placeholder{color:#4A5A75!important;}
      .co-in:focus{border-color:#FF6B35!important;box-shadow:0 0 0 3px rgba(255,107,53,0.15)!important;outline:none;}
      .co-sel:focus{border-color:#FF6B35!important;outline:none;}
      .co-sel option{background:#141728;color:#F1F5F9;}
      .co-card:hover{border-color:rgba(255,107,53,0.5)!important;transform:translateY(-3px)!important;box-shadow:0 16px 48px rgba(0,0,0,0.6)!important;}
      .co-mark:hover{background:#4ADE80!important;color:#000!important;border-color:#4ADE80!important;}
      ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);} ::-webkit-scrollbar-thumb{background:#252A45;border-radius:10px;} ::-webkit-scrollbar-thumb:hover{background:#FF6B35;}
    `;
    if(!document.getElementById('co-s')) document.head.appendChild(s);
  },[]);

  const fetchData = async()=>{ try{ const r=await axios.get('http://localhost:8080/api/evaluations'); setItems(r.data.filter(e=>!e.coaching_completed)); }catch(e){console.error(e);} };

  const markDone = async(id)=>{
    setCompleting(id);
    try{ await axios.patch(`http://localhost:8080/api/evaluations/${id}/coaching`,{coaching_status:'completed'}); await fetchData(); setSelected(null); }catch(e){console.error(e);}
    finally{setCompleting(null);}
  };

  const qas = [...new Set(items.map(e=>e.qa_name).filter(Boolean))].sort();
  const filtered = items.filter(it=>{
    const ms=(it.agent_name||'').toLowerCase().includes(search.toLowerCase())||(it.qa_name||'').toLowerCase().includes(search.toLowerCase());
    const mq=fQA==='all'||it.qa_name===fQA;
    const msc=fScore==='all'||(fScore==='high'?it.overall_score_percentage>=80:fScore==='medium'?(it.overall_score_percentage>=60&&it.overall_score_percentage<80):it.overall_score_percentage<60);
    return ms&&mq&&msc;
  });

  const avg=filtered.length?Math.round(filtered.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/filtered.length):0;
  const low=filtered.filter(i=>i.overall_score_percentage<60).length;

  const inSt ={...F,width:'100%',padding:'9px 13px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',fontSize:'13px',color:'#F1F5F9',outline:'none',transition:'all 0.15s',boxSizing:'border-box'};
  const selSt={...inSt,cursor:'pointer',appearance:'none',backgroundColor:'rgba(255,255,255,0.07)',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23C8D4E8' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 11px center',paddingRight:'30px'};

  return (
    <div style={{...F,minHeight:'100vh',background:'#0D0F1E',color:'#F1F5F9'}}>
      {/* HEADER */}
      <div style={{padding:'0 40px',height:'72px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.09)',background:'rgba(255,255,255,0.025)',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{width:'38px',height:'38px',borderRadius:'11px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(255,107,53,0.45)'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <div>
            <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',lineHeight:1}}>Runaki QA</div>
            <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF',letterSpacing:'-0.4px',lineHeight:1.25}}>Pending Coaching</div>
          </div>
        </div>
        <div style={{padding:'8px 18px',background:'rgba(251,191,36,0.12)',border:'1px solid rgba(251,191,36,0.35)',borderRadius:'9px',fontSize:'13px',fontWeight:'800',color:'#FBBF24'}}>{filtered.length} Pending</div>
      </div>

      <div style={{padding:'32px 40px'}}>
        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'28px'}}>
          {[
            {label:'Total Pending',   val:items.length,        sub:'awaiting coaching', accent:'#FBBF24',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>},
            {label:'Filtered View',   val:filtered.length,     sub:'current results',   accent:'#A78BFA',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>},
            {label:'Needs Attention', val:low,                 sub:'score below 60%',   accent:'#F87171',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>},
            {label:'Average Score',   val:filtered.length?`${avg}%`:'—', sub:slb(avg), accent:sc(avg),  icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>},
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

        {/* FILTER */}
        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',padding:'14px 18px',display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr',gap:'10px',marginBottom:'20px'}}>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',color:'#4A5A75',pointerEvents:'none'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></div>
            <input type="text" className="co-in" placeholder="Search agent or QA name..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inSt,paddingLeft:'38px'}}/>
          </div>
          <select className="co-sel" value={fQA} onChange={e=>setFQA(e.target.value)} style={selSt}>
            <option value="all">All QA Officers</option>
            {qas.map(q=><option key={q} value={q}>{q}</option>)}
          </select>
          <select className="co-sel" value={fScore} onChange={e=>setFScore(e.target.value)} style={selSt}>
            <option value="all">All Scores</option>
            <option value="high">≥80% High</option>
            <option value="medium">60–79% Mid</option>
            <option value="low">&lt;60% Low</option>
          </select>
        </div>

        {/* CARDS */}
        {filtered.length===0 ? (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'80px 40px',gap:'16px',background:'rgba(255,255,255,0.03)',border:'1px dashed rgba(74,222,128,0.25)',borderRadius:'18px'}}>
            <div style={{width:'64px',height:'64px',borderRadius:'20px',background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#4ADE80'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{fontSize:'17px',fontWeight:'800',color:'#E8EFF8'}}>All caught up!</div>
            <div style={{fontSize:'13px',color:'#8FA3C4',fontWeight:'600'}}>No pending coaching items found</div>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'14px'}}>
            {filtered.map(item=>(
              <div key={item.id} className="co-card" onClick={()=>setSelected(item)} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'22px 24px',cursor:'pointer',transition:'all 0.2s',position:'relative',overflow:'hidden'}}
                onMouseEnter={()=>setHovCard(item.id)} onMouseLeave={()=>setHovCard(null)}>
                <div style={{position:'absolute',left:0,top:0,bottom:0,width:'3.5px',background:`linear-gradient(180deg,${sc(item.overall_score_percentage)},${sc(item.overall_score_percentage)}44)`,borderRadius:'18px 0 0 18px'}}/>
                <div style={{position:'absolute',top:'-20px',right:'-20px',width:'80px',height:'80px',borderRadius:'50%',background:`radial-gradient(circle,${sc(item.overall_score_percentage)}15 0%,transparent 70%)`,pointerEvents:'none'}}/>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                    <div style={{width:'42px',height:'42px',borderRadius:'12px',flexShrink:0,background:`linear-gradient(135deg,${acol(item.agent_name)},${acol(item.agent_name)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'800',color:'white',boxShadow:`0 2px 10px ${acol(item.agent_name)}55`}}>{ini(item.agent_name)}</div>
                    <div>
                      <div style={{fontSize:'15px',fontWeight:'800',color:'#FFFFFF',marginBottom:'3px'}}>{item.agent_name}</div>
                      <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                        <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#A78BFA',boxShadow:'0 0 5px #A78BFA'}}/>
                        <span style={{fontSize:'12px',color:'#C8D8EC',fontWeight:'600'}}>{item.qa_name||'—'}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'10px 16px',borderRadius:'12px',background:sbg(item.overall_score_percentage),border:`1.5px solid ${sbd(item.overall_score_percentage)}`}}>
                    <span style={{fontSize:'22px',fontWeight:'900',color:sc(item.overall_score_percentage),lineHeight:1}}>{item.overall_score_percentage}%</span>
                    <span style={{fontSize:'10px',fontWeight:'700',color:sc(item.overall_score_percentage),textTransform:'uppercase',letterSpacing:'0.5px',marginTop:'2px'}}>{slb(item.overall_score_percentage)}</span>
                  </div>
                </div>
                <div style={{display:'flex',gap:'12px',alignItems:'center',paddingTop:'12px',borderTop:'1px solid rgba(255,255,255,0.07)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8FA3C4" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'500'}}>{fmt(item.evaluation_date)}</span>
                  </div>
                  {item.improvement_area && <span style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'500',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{item.improvement_area}</span>}
                  <span style={{fontSize:'12px',fontWeight:'700',color:'#FF8C5A',opacity:hovCard===item.id?1:0,transition:'opacity 0.15s',marginLeft:'auto',whiteSpace:'nowrap'}}>View →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selected && (
        <div onClick={()=>setSelected(null)} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
          <div onClick={e=>e.stopPropagation()} style={{...F,background:'#131626',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'24px',width:'100%',maxWidth:'520px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 60px 120px rgba(0,0,0,0.85)'}}>
            <div style={{padding:'26px 30px 22px',borderBottom:'1px solid rgba(255,255,255,0.09)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:'13px'}}>
                <div style={{width:'46px',height:'46px',borderRadius:'13px',background:`linear-gradient(135deg,${acol(selected.agent_name)},${acol(selected.agent_name)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',fontWeight:'900',color:'white',boxShadow:`0 4px 16px ${acol(selected.agent_name)}55`}}>{ini(selected.agent_name)}</div>
                <div>
                  <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:'3px'}}>Coaching Session</div>
                  <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF'}}>{selected.agent_name}</div>
                </div>
              </div>
              <button onClick={()=>setSelected(null)} style={{...F,width:'34px',height:'34px',borderRadius:'9px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'#94A3B8',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.12)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}>✕</button>
            </div>
            <div style={{padding:'22px 30px 0'}}>
              <div style={{padding:'20px 24px',borderRadius:'16px',background:sbg(selected.overall_score_percentage),border:`1.5px solid ${sbd(selected.overall_score_percentage)}`,display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <div>
                  <div style={{fontSize:'10px',fontWeight:'700',color:sc(selected.overall_score_percentage),letterSpacing:'2px',textTransform:'uppercase',marginBottom:'5px'}}>Evaluation Score</div>
                  <div style={{fontSize:'56px',fontWeight:'900',color:sc(selected.overall_score_percentage),lineHeight:1,letterSpacing:'-2px'}}>{selected.overall_score_percentage}%</div>
                </div>
                <div style={{padding:'10px 18px',borderRadius:'12px',background:'rgba(255,255,255,0.07)',border:`1.5px solid ${sbd(selected.overall_score_percentage)}`,fontSize:'14px',fontWeight:'800',color:sc(selected.overall_score_percentage)}}>{slb(selected.overall_score_percentage)}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                {[{l:'QA Officer',v:selected.qa_name},{l:'Date',v:fmt(selected.evaluation_date)},{l:'Improvement Area',v:selected.improvement_area},{l:'Good Comment',v:selected.good_comment}].filter(f=>f.v).map((f,i)=>(
                  <div key={i} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'12px',padding:'14px 16px'}}>
                    <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'5px'}}>{f.l}</div>
                    <div style={{fontSize:'14px',fontWeight:'700',color:'#E8EFF8'}}>{f.v}</div>
                  </div>
                ))}
                {selected.bad_comment && (
                  <div style={{gridColumn:'span 2',background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.25)',borderRadius:'12px',padding:'14px 16px'}}>
                    <div style={{fontSize:'10px',fontWeight:'700',color:'#F87171',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'5px'}}>Bad Comment</div>
                    <div style={{fontSize:'13px',color:'#C8D8EC',lineHeight:'1.65',fontWeight:'500'}}>{selected.bad_comment}</div>
                  </div>
                )}
                {selected.feedback && (
                  <div style={{gridColumn:'span 2',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',padding:'14px 16px'}}>
                    <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'5px'}}>Feedback</div>
                    <div style={{fontSize:'13px',color:'#C8D8EC',lineHeight:'1.65',fontWeight:'500'}}>{selected.feedback}</div>
                  </div>
                )}
              </div>
            </div>
            <div style={{padding:'18px 30px 28px',display:'flex',gap:'12px'}}>
              <button className="co-mark" onClick={()=>markDone(selected.id)} disabled={completing===selected.id} style={{...F,flex:1,padding:'13px',background:'rgba(74,222,128,0.1)',border:'1.5px solid rgba(74,222,128,0.35)',borderRadius:'12px',color:'#4ADE80',fontSize:'14px',fontWeight:'800',cursor:'pointer',transition:'all 0.15s',opacity:completing===selected.id?0.6:1}}>
                {completing===selected.id?'Saving...':'✓ Mark as Done'}
              </button>
              <button onClick={()=>setSelected(null)} style={{...F,flex:1,padding:'13px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'12px',color:'#C8D4E8',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PendingCoaching;