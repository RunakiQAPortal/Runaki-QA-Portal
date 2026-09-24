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

const TYPE_COLORS={
  'Communication':'#60A5FA','New Levels':'#A78BFA','Hold-UnHold':'#34D399',
  'INDRA':'#FBBF24','Hung-Up':'#F87171','E-psule':'#F472B6'
};

const SpotChecksAudits = () => {
  const [tab,setTab]           = useState('spots');
  const [spots,setSpots]       = useState([]);
  const [audits,setAudits]     = useState([]);
  const [selected,setSelected] = useState(null);
  const [search,setSearch]     = useState('');
  const [fType,setFType]       = useState('all');
  const [fScore,setFScore]     = useState('all');
  const [fResult,setFResult]   = useState('all');
  const [loading,setLoading]   = useState(false);

  useEffect(()=>{
    fetchAll();
    const s=document.createElement('style'); s.id='sca-s';
    s.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      .sca-in::placeholder{color:#4A5A75!important;}
      .sca-in:focus{border-color:#FF6B35!important;box-shadow:0 0 0 3px rgba(255,107,53,0.15)!important;outline:none;}
      .sca-sel:focus{border-color:#FF6B35!important;outline:none;}
      .sca-sel option{background:#141728;color:#F1F5F9;}
      .sca-row:hover{background:rgba(255,255,255,0.05)!important;}
      .sca-tab:hover{background:rgba(255,255,255,0.06)!important;}
      ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);} ::-webkit-scrollbar-thumb{background:#252A45;border-radius:10px;} ::-webkit-scrollbar-thumb:hover{background:#FF6B35;}
    `;
    if(!document.getElementById('sca-s')) document.head.appendChild(s);
  },[]);

  const fetchAll=async()=>{
    setLoading(true);
    try{
      const [sr,ar]=await Promise.all([
        axios.get('http://localhost:8080/api/spot-checks'),
        axios.get('http://localhost:8080/api/audits')
      ]);
      setSpots(sr.data); setAudits(ar.data);
    }catch(e){console.error(e);}
    finally{setLoading(false);}
  };

  const data=tab==='spots'?spots:audits;
  const filtered=data.filter(it=>{
    const ms=(it.agent_name||'').toLowerCase().includes(search.toLowerCase())||(it.qa_name||'').toLowerCase().includes(search.toLowerCase());
    const mt=fType==='all'||(it.check_type||it.audit_type)===fType;
    const msc=fScore==='all'||(fScore==='high'?it.score>=80:fScore==='medium'?(it.score>=60&&it.score<80):it.score<60);
    const mr=tab==='spots'?(fResult==='all'||it.result===fResult):true;
    return ms&&mt&&msc&&mr;
  });

  const spotTypes=[...new Set(spots.map(s=>s.check_type).filter(Boolean))];
  const auditTypes=[...new Set(audits.map(a=>a.audit_type).filter(Boolean))];
  const types=tab==='spots'?spotTypes:auditTypes;
  const avgScore=filtered.length?Math.round(filtered.reduce((s,i)=>s+(i.score||0),0)/filtered.length):0;
  const needsAttn=filtered.filter(i=>i.score<60).length;
  const correct=spots.filter(s=>s.result==='Correct').length;

  const inSt ={...F,width:'100%',padding:'9px 13px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',fontSize:'13px',color:'#F1F5F9',outline:'none',transition:'all 0.15s',boxSizing:'border-box'};
  const selSt={...inSt,cursor:'pointer',appearance:'none',backgroundColor:'rgba(255,255,255,0.07)',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23C8D4E8' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 11px center',paddingRight:'30px'};

  return (
    <div style={{...F,minHeight:'100vh',background:'#0D0F1E',color:'#F1F5F9'}}>
      {/* HEADER */}
      <div style={{padding:'0 40px',height:'72px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.09)',background:'rgba(255,255,255,0.025)',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{width:'38px',height:'38px',borderRadius:'11px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(255,107,53,0.45)'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div>
            <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',lineHeight:1}}>Runaki QA</div>
            <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF',letterSpacing:'-0.4px',lineHeight:1.25}}>Spot Checks & Audits</div>
          </div>
        </div>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <button onClick={fetchAll} style={{...F,padding:'8px 16px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',color:'#C8D4E8',fontSize:'13px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Refresh
          </button>
          <div style={{padding:'8px 18px',background:'rgba(255,107,53,0.12)',border:'1px solid rgba(255,107,53,0.35)',borderRadius:'9px',fontSize:'13px',fontWeight:'800',color:'#FF8C5A'}}>{filtered.length} Records</div>
        </div>
      </div>

      <div style={{padding:'32px 40px'}}>
        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'28px'}}>
          {[
            {label:'Total Spot Checks',val:spots.length,       sub:'all records',      accent:'#FF6B35',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>},
            {label:'Total Audits',     val:audits.length,      sub:'all records',      accent:'#A78BFA',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>},
            {label:'Correct Results',  val:correct,            sub:`of ${spots.length} spot checks`,accent:'#4ADE80',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>},
            {label:'Avg Score',        val:`${avgScore}%`,     sub:slb(avgScore),      accent:sc(avgScore),icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>},
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

        {/* TABS + FILTERS */}
        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',padding:'14px 18px',marginBottom:'20px'}}>
          <div style={{display:'flex',gap:'10px',marginBottom:'12px'}}>
            {[['spots','Spot Checks',spots.length,<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>],
              ['audits','Audits',audits.length,<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>]
            ].map(([t,l,c,icon])=>(
              <button key={t} className="sca-tab" onClick={()=>{setTab(t);setSearch('');setFType('all');setFScore('all');setFResult('all');}} style={{...F,display:'flex',alignItems:'center',gap:'7px',padding:'9px 18px',borderRadius:'10px',border:`1.5px solid ${tab===t?'rgba(255,107,53,0.55)':'rgba(255,255,255,0.1)'}`,background:tab===t?'rgba(255,107,53,0.15)':'transparent',color:tab===t?'#FF8C5A':'#8FA3C4',fontSize:'13px',fontWeight:'700',cursor:'pointer',transition:'all 0.15s'}}>
                {icon} {l} <span style={{padding:'2px 8px',borderRadius:'5px',background:tab===t?'rgba(255,107,53,0.25)':'rgba(255,255,255,0.08)',fontSize:'11px',fontWeight:'800'}}>{c}</span>
              </button>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr'+(tab==='spots'?' 1fr':''),gap:'10px'}}>
            <div style={{position:'relative'}}>
              <div style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',color:'#4A5A75',pointerEvents:'none'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></div>
              <input type="text" className="sca-in" placeholder="Search agent name..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inSt,paddingLeft:'38px'}}/>
            </div>
            <select className="sca-sel" value={fType} onChange={e=>setFType(e.target.value)} style={selSt}>
              <option value="all">All Types</option>
              {types.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <select className="sca-sel" value={fScore} onChange={e=>setFScore(e.target.value)} style={selSt}>
              <option value="all">All Scores</option>
              <option value="high">≥80% High</option>
              <option value="medium">60–79% Mid</option>
              <option value="low">&lt;60% Low</option>
            </select>
            {tab==='spots' && (
              <select className="sca-sel" value={fResult} onChange={e=>setFResult(e.target.value)} style={selSt}>
                <option value="all">All Results</option>
                <option value="Correct">Correct</option>
                <option value="Incorrect">Incorrect</option>
              </select>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',overflow:'hidden'}}>
          {tab==='spots' ? (
            <>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1.3fr 1.1fr 1fr 110px 130px 90px',padding:'13px 28px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                {['Agent','QA Officer','Type','Date','Score','Result',''].map(c=>(
                  <div key={c} style={{fontSize:'11px',fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase',color:'#8FA3C4'}}>{c}</div>
                ))}
              </div>
              <div style={{maxHeight:'520px',overflowY:'auto'}}>
                {loading?<div style={{padding:'60px',textAlign:'center',color:'#8FA3C4',fontWeight:'600',fontSize:'14px'}}>Loading...</div>:
                filtered.length===0?<EmptyState label="No spot checks found"/>:filtered.map(it=>(
                  <div key={it.id} className="sca-row" onClick={()=>setSelected({...it,_type:'spot'})} style={{display:'grid',gridTemplateColumns:'2fr 1.3fr 1.1fr 1fr 110px 130px 90px',padding:'14px 28px',borderBottom:'1px solid rgba(255,255,255,0.05)',alignItems:'center',transition:'background 0.1s',cursor:'pointer'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
                      <div style={{width:'36px',height:'36px',borderRadius:'10px',flexShrink:0,background:`linear-gradient(135deg,${acol(it.agent_name)},${acol(it.agent_name)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'800',color:'white'}}>{ini(it.agent_name)}</div>
                      <span style={{fontSize:'14px',fontWeight:'700',color:'#FFFFFF'}}>{it.agent_name||'—'}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'7px'}}>
                      <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#A78BFA',flexShrink:0}}/>
                      <span style={{fontSize:'13px',fontWeight:'600',color:'#C8D8EC'}}>{it.qa_name||'—'}</span>
                    </div>
                    <div style={{display:'inline-flex',padding:'4px 10px',borderRadius:'7px',background:`${TYPE_COLORS[it.check_type]||'#8FA3C4'}22`,border:`1px solid ${TYPE_COLORS[it.check_type]||'#8FA3C4'}44`}}>
                      <span style={{fontSize:'12px',fontWeight:'700',color:TYPE_COLORS[it.check_type]||'#8FA3C4'}}>{it.check_type||'—'}</span>
                    </div>
                    <span style={{fontSize:'12px',fontWeight:'600',color:'#8FA3C4'}}>{fmt(it.check_date)}</span>
                    <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'72px',height:'28px',borderRadius:'8px',background:sbg(it.score),border:`1.5px solid ${sbd(it.score)}`}}>
                      <span style={{fontSize:'13px',fontWeight:'800',color:sc(it.score)}}>{it.score??'—'}%</span>
                    </div>
                    <div style={{display:'inline-flex',alignItems:'center',gap:'5px',padding:'4px 11px',borderRadius:'7px',background:it.result==='Correct'?'rgba(74,222,128,0.1)':'rgba(248,113,113,0.1)',border:`1px solid ${it.result==='Correct'?'rgba(74,222,128,0.3)':'rgba(248,113,113,0.3)'}`}}>
                      <div style={{width:'5px',height:'5px',borderRadius:'50%',background:it.result==='Correct'?'#4ADE80':'#F87171'}}/>
                      <span style={{fontSize:'12px',fontWeight:'700',color:it.result==='Correct'?'#4ADE80':'#F87171'}}>{it.result||'—'}</span>
                    </div>
                    <span style={{fontSize:'12px',fontWeight:'700',color:'#FF8C5A'}}>View →</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1.3fr 1.1fr 1fr 110px 90px',padding:'13px 28px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                {['Agent','QA Officer','Type','Date','Score',''].map(c=>(
                  <div key={c} style={{fontSize:'11px',fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase',color:'#8FA3C4'}}>{c}</div>
                ))}
              </div>
              <div style={{maxHeight:'520px',overflowY:'auto'}}>
                {loading?<div style={{padding:'60px',textAlign:'center',color:'#8FA3C4',fontWeight:'600',fontSize:'14px'}}>Loading...</div>:
                filtered.length===0?<EmptyState label="No audits found"/>:filtered.map(it=>(
                  <div key={it.id} className="sca-row" onClick={()=>setSelected({...it,_type:'audit'})} style={{display:'grid',gridTemplateColumns:'2fr 1.3fr 1.1fr 1fr 110px 90px',padding:'14px 28px',borderBottom:'1px solid rgba(255,255,255,0.05)',alignItems:'center',transition:'background 0.1s',cursor:'pointer'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
                      <div style={{width:'36px',height:'36px',borderRadius:'10px',flexShrink:0,background:`linear-gradient(135deg,${acol(it.agent_name)},${acol(it.agent_name)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'800',color:'white'}}>{ini(it.agent_name)}</div>
                      <span style={{fontSize:'14px',fontWeight:'700',color:'#FFFFFF'}}>{it.agent_name||'—'}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'7px'}}>
                      <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#A78BFA',flexShrink:0}}/>
                      <span style={{fontSize:'13px',fontWeight:'600',color:'#C8D8EC'}}>{it.qa_name||'—'}</span>
                    </div>
                    <div style={{display:'inline-flex',padding:'4px 10px',borderRadius:'7px',background:`${TYPE_COLORS[it.audit_type]||'#8FA3C4'}22`,border:`1px solid ${TYPE_COLORS[it.audit_type]||'#8FA3C4'}44`}}>
                      <span style={{fontSize:'12px',fontWeight:'700',color:TYPE_COLORS[it.audit_type]||'#8FA3C4'}}>{it.audit_type||'—'}</span>
                    </div>
                    <span style={{fontSize:'12px',fontWeight:'600',color:'#8FA3C4'}}>{fmt(it.audit_date)}</span>
                    <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'72px',height:'28px',borderRadius:'8px',background:sbg(it.score),border:`1.5px solid ${sbd(it.score)}`}}>
                      <span style={{fontSize:'13px',fontWeight:'800',color:sc(it.score)}}>{it.score??'—'}%</span>
                    </div>
                    <span style={{fontSize:'12px',fontWeight:'700',color:'#FF8C5A'}}>View →</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {filtered.length>0&&(
            <div style={{padding:'12px 28px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'600'}}>Showing <strong style={{color:'#C8D8EC'}}>{filtered.length}</strong> records</span>
              <div style={{display:'flex',gap:'16px'}}>
                {[['#4ADE80','High',i=>i.score>=80],['#FBBF24','Mid',i=>i.score>=60&&i.score<80],['#F87171','Low',i=>i.score<60]].map(([c,l,fn])=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:'5px'}}>
                    <div style={{width:'6px',height:'6px',borderRadius:'50%',background:c,boxShadow:`0 0 5px ${c}`}}/>
                    <span style={{fontSize:'11px',fontWeight:'700',color:'#8FA3C4'}}>{l}: {filtered.filter(fn).length}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selected&&(
        <div onClick={()=>setSelected(null)} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
          <div onClick={e=>e.stopPropagation()} style={{...F,background:'#131626',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'24px',width:'100%',maxWidth:'500px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 60px 120px rgba(0,0,0,0.85)'}}>
            <div style={{padding:'26px 30px 22px',borderBottom:'1px solid rgba(255,255,255,0.09)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:'13px'}}>
                <div style={{width:'46px',height:'46px',borderRadius:'13px',background:`linear-gradient(135deg,${acol(selected.agent_name)},${acol(selected.agent_name)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',fontWeight:'900',color:'white'}}>{ini(selected.agent_name)}</div>
                <div>
                  <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:'3px'}}>{selected._type==='spot'?'Spot Check':'Audit'} Details</div>
                  <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF'}}>{selected.agent_name}</div>
                </div>
              </div>
              <button onClick={()=>setSelected(null)} style={{...F,width:'34px',height:'34px',borderRadius:'9px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'#94A3B8',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.12)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}>✕</button>
            </div>
            <div style={{padding:'22px 30px 28px'}}>
              <div style={{padding:'20px 24px',borderRadius:'16px',background:sbg(selected.score),border:`1.5px solid ${sbd(selected.score)}`,display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <div>
                  <div style={{fontSize:'10px',fontWeight:'700',color:sc(selected.score),letterSpacing:'2px',textTransform:'uppercase',marginBottom:'5px'}}>Score</div>
                  <div style={{fontSize:'52px',fontWeight:'900',color:sc(selected.score),lineHeight:1,letterSpacing:'-2px'}}>{selected.score??'—'}%</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'13px',fontWeight:'800',color:sc(selected.score)}}>{slb(selected.score)}</div>
                  {selected.result&&<div style={{marginTop:'8px',padding:'6px 14px',borderRadius:'9px',background:selected.result==='Correct'?'rgba(74,222,128,0.15)':'rgba(248,113,113,0.15)',border:`1.5px solid ${selected.result==='Correct'?'rgba(74,222,128,0.35)':'rgba(248,113,113,0.35)'}`,fontSize:'12px',fontWeight:'800',color:selected.result==='Correct'?'#4ADE80':'#F87171'}}>{selected.result}</div>}
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                {[{l:'QA Officer',v:selected.qa_name},{l:'Date',v:fmt(selected.check_date||selected.audit_date)},{l:'Type',v:selected.check_type||selected.audit_type},{l:'Notes',v:selected.notes}].filter(f=>f.v).map((f,i)=>(
                  <div key={i} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'12px',padding:'14px 16px'}}>
                    <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'5px'}}>{f.l}</div>
                    <div style={{fontSize:'14px',fontWeight:'700',color:'#E8EFF8'}}>{f.v}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>setSelected(null)} style={{...F,width:'100%',marginTop:'18px',padding:'13px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',borderRadius:'12px',color:'white',fontSize:'14px',fontWeight:'800',cursor:'pointer',boxShadow:'0 6px 22px rgba(255,107,53,0.4)'}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyState=({label})=>(
  <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'80px 40px',gap:'16px'}}>
    <div style={{width:'56px',height:'56px',borderRadius:'18px',background:'rgba(255,107,53,0.1)',border:'1px solid rgba(255,107,53,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#FF6B35'}}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
    </div>
    <div style={{fontSize:'16px',fontWeight:'800',color:'#E8EFF8'}}>{label}</div>
    <div style={{fontSize:'13px',color:'#8FA3C4',fontWeight:'600'}}>Adjust your filters</div>
  </div>
);

export default SpotChecksAudits;