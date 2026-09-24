import React, { useState, useEffect } from 'react';
import axios from 'axios';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR = ['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const acol  = (n) => ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const ini   = (n) => n ? n.trim().split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase() : '?';
const fmt   = (d) => d ? new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—';
const sc    = (s) => s>=80?'#4ADE80':s>=60?'#FBBF24':'#F87171';
const sbg   = (s) => s>=80?'rgba(74,222,128,0.15)':s>=60?'rgba(251,191,36,0.15)':'rgba(248,113,113,0.15)';
const sbd   = (s) => s>=80?'rgba(74,222,128,0.35)':s>=60?'rgba(251,191,36,0.35)':'rgba(248,113,113,0.35)';
const slb   = (s) => s>=80?'Excellent':s>=60?'Average':'Needs Work';

const AllEvaluations = () => {
  const [evaluations,setEvaluations] = useState([]);
  const [selected,setSelected]       = useState(null);
  const [search,setSearch]           = useState('');
  const [fAgent,setFAgent]           = useState('all');
  const [fQA,setFQA]                 = useState('all');
  const [fScore,setFScore]           = useState('all');
  const [fCoach,setFCoach]           = useState('all');
  const [sort,setSort]               = useState('date_desc');
  const [loading,setLoading]         = useState(false);
  const [hovRow,setHovRow]           = useState(null);

  useEffect(()=>{
    fetchData();
    const s=document.createElement('style'); s.id='ae-s';
    s.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      .ae-in::placeholder{color:#4A5A75!important;}
      .ae-in:focus{border-color:#FF6B35!important;box-shadow:0 0 0 3px rgba(255,107,53,0.15)!important;outline:none;}
      .ae-sel:focus{border-color:#FF6B35!important;outline:none;}
      .ae-sel option{background:#141728;color:#F1F5F9;}
      .ae-row:hover{background:rgba(255,255,255,0.05)!important;}
      .ae-stat:hover{background:rgba(255,255,255,0.08)!important;border-color:rgba(255,255,255,0.2)!important;transform:translateY(-2px);}
      .ae-vbtn:hover{background:#FF6B35!important;color:#fff!important;border-color:#FF6B35!important;}
      ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);} ::-webkit-scrollbar-thumb{background:#252A45;border-radius:10px;} ::-webkit-scrollbar-thumb:hover{background:#FF6B35;}
    `;
    if(!document.getElementById('ae-s')) document.head.appendChild(s);
  },[]);

  const fetchData = async()=>{
    setLoading(true);
    try{ const r=await axios.get('http://localhost:8080/api/evaluations'); setEvaluations(r.data); }catch(e){console.error(e);}
    finally{setLoading(false);}
  };

  const agents = [...new Set(evaluations.map(e=>e.agent_name).filter(Boolean))].sort();
  const qas    = [...new Set(evaluations.map(e=>e.qa_name).filter(Boolean))].sort();

  const filtered = evaluations.filter(ev=>{
    const ms = (ev.agent_name||'').toLowerCase().includes(search.toLowerCase())||(ev.qa_name||'').toLowerCase().includes(search.toLowerCase());
    const ma = fAgent==='all'||ev.agent_name===fAgent;
    const mq = fQA==='all'||ev.qa_name===fQA;
    const msc= fScore==='all'||(fScore==='high'?ev.overall_score_percentage>=80:fScore==='medium'?(ev.overall_score_percentage>=60&&ev.overall_score_percentage<80):ev.overall_score_percentage<60);
    const mc = fCoach==='all'||(fCoach==='done'?ev.coaching_completed:!ev.coaching_completed);
    return ms&&ma&&mq&&msc&&mc;
  }).sort((a,b)=>{
    if(sort==='date_desc') return new Date(b.evaluation_date)-new Date(a.evaluation_date);
    if(sort==='date_asc')  return new Date(a.evaluation_date)-new Date(b.evaluation_date);
    if(sort==='score_desc') return b.overall_score_percentage-a.overall_score_percentage;
    if(sort==='score_asc')  return a.overall_score_percentage-b.overall_score_percentage;
    return 0;
  });

  const avg     = filtered.length ? Math.round(filtered.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/filtered.length) : 0;
  const pending = filtered.filter(e=>!e.coaching_completed).length;
  const high    = filtered.filter(e=>e.overall_score_percentage>=80).length;
  const low     = filtered.filter(e=>e.overall_score_percentage<60).length;

  const inSt  = {...F,width:'100%',padding:'9px 13px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',fontSize:'13px',color:'#F1F5F9',outline:'none',transition:'all 0.15s',boxSizing:'border-box'};
  const selSt = {...inSt,cursor:'pointer',appearance:'none',backgroundColor:'rgba(255,255,255,0.07)',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23C8D4E8' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 11px center',paddingRight:'30px'};

  return (
    <div style={{...F,minHeight:'100vh',background:'#0D0F1E',color:'#F1F5F9'}}>
      {/* HEADER */}
      <div style={{padding:'0 40px',height:'72px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.09)',background:'rgba(255,255,255,0.025)',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{width:'38px',height:'38px',borderRadius:'11px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(255,107,53,0.45)'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
          </div>
          <div>
            <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',lineHeight:1}}>Runaki QA</div>
            <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF',letterSpacing:'-0.4px',lineHeight:1.25}}>All Evaluations</div>
          </div>
        </div>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {[['#4ADE80','High'],['#FBBF24','Mid'],['#F87171','Low']].map(([c,l])=>(
            <div key={l} style={{display:'flex',alignItems:'center',gap:'5px',padding:'4px 10px',borderRadius:'6px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)'}}>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:c,boxShadow:`0 0 6px ${c}`}}/>
              <span style={{fontSize:'11px',fontWeight:'700',color:'#C8D4E8'}}>{l}</span>
            </div>
          ))}
          <div style={{width:'1px',height:'24px',background:'rgba(255,255,255,0.1)'}}/>
          <button onClick={fetchData} style={{...F,padding:'8px 16px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',color:'#C8D4E8',fontSize:'13px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',transition:'all 0.15s'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Refresh
          </button>
          <div style={{padding:'8px 18px',background:'rgba(255,107,53,0.15)',border:'1px solid rgba(255,107,53,0.35)',borderRadius:'9px',fontSize:'13px',fontWeight:'800',color:'#FF8C5A'}}>{filtered.length} Records</div>
        </div>
      </div>

      <div style={{padding:'32px 40px'}}>
        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'28px'}}>
          {[
            {label:'Total Evaluations',val:evaluations.length,sub:'all time',accent:'#FF6B35',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>},
            {label:'Filtered Results', val:filtered.length,sub:'current view',accent:'#A78BFA',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>},
            {label:'Average Score',    val:`${avg}%`,sub:slb(avg),accent:sc(avg),icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>},
            {label:'Pending Coaching', val:pending,sub:`${high} excellent`,accent:'#FBBF24',icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>},
          ].map((s,i)=>(
            <div key={i} className="ae-stat" style={{background:'rgba(255,255,255,0.055)',border:'1px solid rgba(255,255,255,0.11)',borderRadius:'18px',padding:'22px 24px',position:'relative',overflow:'hidden',transition:'all 0.2s',cursor:'default'}}>
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

        {/* FILTER BAR */}
        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',padding:'14px 18px',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr',gap:'10px',marginBottom:'20px',alignItems:'center'}}>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',color:'#4A5A75',pointerEvents:'none'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <input type="text" className="ae-in" placeholder="Search agent or QA name..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inSt,paddingLeft:'38px'}}/>
          </div>
          {[
            {v:fAgent,s:setFAgent,opts:[['all','All Agents'],...agents.map(a=>[a,a])]},
            {v:fQA,   s:setFQA,   opts:[['all','All QA Officers'],...qas.map(q=>[q,q])]},
            {v:fScore,s:setFScore, opts:[['all','All Scores'],['high','≥80% High'],['medium','60–79% Mid'],['low','<60% Low']]},
            {v:fCoach,s:setFCoach, opts:[['all','All Coaching'],['done','Coaching Done'],['pending','Coaching Pending']]},
            {v:sort,  s:setSort,   opts:[['date_desc','Newest First'],['date_asc','Oldest First'],['score_desc','Score ↓'],['score_asc','Score ↑']]},
          ].map((f,i)=>(
            <select key={i} className="ae-sel" value={f.v} onChange={e=>f.s(e.target.value)} style={selSt}>
              {f.opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          ))}
        </div>

        {/* TABLE */}
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',overflow:'hidden'}}>
          <div style={{display:'grid',gridTemplateColumns:'2.2fr 1.4fr 1fr 110px 130px 90px',padding:'13px 28px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            {['Agent','QA Officer','Date','Score','Coaching',''].map(c=>(
              <div key={c} style={{fontSize:'11px',fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase',color:'#8FA3C4'}}>{c}</div>
            ))}
          </div>
          <div style={{maxHeight:'520px',overflowY:'auto'}}>
            {loading ? (
              <div style={{display:'flex',justifyContent:'center',alignItems:'center',padding:'72px',color:'#8FA3C4',fontSize:'14px',fontWeight:'600'}}>Loading...</div>
            ) : filtered.length===0 ? (
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'80px 40px',gap:'16px'}}>
                <div style={{width:'64px',height:'64px',borderRadius:'20px',background:'rgba(255,107,53,0.1)',border:'1px solid rgba(255,107,53,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#FF6B35'}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                </div>
                <div style={{fontSize:'17px',fontWeight:'800',color:'#E8EFF8'}}>No evaluations found</div>
                <div style={{fontSize:'13px',color:'#8FA3C4',fontWeight:'600'}}>Try adjusting your filters</div>
              </div>
            ) : filtered.map(ev=>(
              <div key={ev.id} className="ae-row" style={{display:'grid',gridTemplateColumns:'2.2fr 1.4fr 1fr 110px 130px 90px',padding:'14px 28px',borderBottom:'1px solid rgba(255,255,255,0.05)',alignItems:'center',transition:'background 0.1s'}}
                onMouseEnter={()=>setHovRow(ev.id)} onMouseLeave={()=>setHovRow(null)}>
                <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'10px',flexShrink:0,background:`linear-gradient(135deg,${acol(ev.agent_name)},${acol(ev.agent_name)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'800',color:'white',boxShadow:`0 2px 10px ${acol(ev.agent_name)}55`}}>{ini(ev.agent_name)}</div>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:'700',color:'#FFFFFF'}}>{ev.agent_name||'—'}</div>
                    {ev.queue && <div style={{fontSize:'11px',color:'#8FA3C4',fontWeight:'500',marginTop:'1px'}}>{ev.queue}</div>}
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'7px'}}>
                  <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#A78BFA',boxShadow:'0 0 5px #A78BFA',flexShrink:0}}/>
                  <span style={{fontSize:'13px',fontWeight:'600',color:'#C8D8EC'}}>{ev.qa_name||'—'}</span>
                </div>
                <span style={{fontSize:'12px',fontWeight:'600',color:'#8FA3C4'}}>{fmt(ev.evaluation_date)}</span>
                <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'72px',height:'28px',borderRadius:'8px',background:sbg(ev.overall_score_percentage),border:`1.5px solid ${sbd(ev.overall_score_percentage)}`}}>
                  <span style={{fontSize:'13px',fontWeight:'800',color:sc(ev.overall_score_percentage)}}>{ev.overall_score_percentage??'—'}%</span>
                </div>
                <div style={{display:'inline-flex',alignItems:'center',gap:'5px',padding:'4px 11px',borderRadius:'7px',background:ev.coaching_completed?'rgba(74,222,128,0.1)':'rgba(251,191,36,0.1)',border:`1px solid ${ev.coaching_completed?'rgba(74,222,128,0.3)':'rgba(251,191,36,0.3)'}`}}>
                  <div style={{width:'5px',height:'5px',borderRadius:'50%',background:ev.coaching_completed?'#4ADE80':'#FBBF24',boxShadow:`0 0 5px ${ev.coaching_completed?'#4ADE80':'#FBBF24'}`,flexShrink:0}}/>
                  <span style={{fontSize:'12px',fontWeight:'700',color:ev.coaching_completed?'#4ADE80':'#FBBF24'}}>{ev.coaching_completed?'Done':'Pending'}</span>
                </div>
                <button className="ae-vbtn" onClick={()=>setSelected(ev)} style={{...F,padding:'6px 14px',background:'rgba(255,107,53,0.12)',border:'1px solid rgba(255,107,53,0.35)',borderRadius:'8px',color:'#FF8C5A',fontSize:'12px',fontWeight:'700',cursor:'pointer',transition:'all 0.15s'}}>
                  View →
                </button>
              </div>
            ))}
          </div>
          {filtered.length>0 && (
            <div style={{padding:'12px 28px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'600'}}>Showing <strong style={{color:'#C8D8EC'}}>{filtered.length}</strong> of <strong style={{color:'#C8D8EC'}}>{evaluations.length}</strong></span>
              <div style={{display:'flex',gap:'16px'}}>
                {[['#4ADE80','High',e=>e.overall_score_percentage>=80],['#FBBF24','Mid',e=>e.overall_score_percentage>=60&&e.overall_score_percentage<80],['#F87171','Low',e=>e.overall_score_percentage<60]].map(([c,l,fn])=>(
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

      {/* MODAL */}
      {selected && (
        <div onClick={()=>setSelected(null)} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
          <div onClick={e=>e.stopPropagation()} style={{...F,background:'#131626',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'24px',width:'100%',maxWidth:'540px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 60px 120px rgba(0,0,0,0.85)'}}>
            <div style={{padding:'26px 30px 22px',borderBottom:'1px solid rgba(255,255,255,0.09)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:'13px'}}>
                <div style={{width:'46px',height:'46px',borderRadius:'13px',background:`linear-gradient(135deg,${acol(selected.agent_name)},${acol(selected.agent_name)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',fontWeight:'900',color:'white',boxShadow:`0 4px 16px ${acol(selected.agent_name)}55`}}>{ini(selected.agent_name)}</div>
                <div>
                  <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:'3px'}}>Evaluation Details</div>
                  <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF'}}>{selected.agent_name}</div>
                </div>
              </div>
              <button onClick={()=>setSelected(null)} style={{...F,width:'34px',height:'34px',borderRadius:'9px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'#94A3B8',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.12)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}>✕</button>
            </div>
            <div style={{padding:'22px 30px 0'}}>
              <div style={{padding:'20px 24px',borderRadius:'16px',background:sbg(selected.overall_score_percentage),border:`1.5px solid ${sbd(selected.overall_score_percentage)}`,display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <div>
                  <div style={{fontSize:'10px',fontWeight:'700',color:sc(selected.overall_score_percentage),letterSpacing:'2px',textTransform:'uppercase',marginBottom:'5px'}}>Overall Score</div>
                  <div style={{fontSize:'56px',fontWeight:'900',color:sc(selected.overall_score_percentage),lineHeight:1,letterSpacing:'-2px'}}>{selected.overall_score_percentage??'—'}%</div>
                </div>
                <div style={{padding:'10px 18px',borderRadius:'12px',background:'rgba(255,255,255,0.07)',border:`1.5px solid ${sbd(selected.overall_score_percentage)}`,fontSize:'14px',fontWeight:'800',color:sc(selected.overall_score_percentage)}}>{slb(selected.overall_score_percentage)}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                {[{l:'QA Officer',v:selected.qa_name},{l:'Evaluation Date',v:fmt(selected.evaluation_date)},{l:'Queue',v:selected.queue},{l:'Coaching Status',v:selected.coaching_completed?'✓ Done':'⏳ Pending'}].map((f,i)=>(
                  <div key={i} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'12px',padding:'14px 16px'}}>
                    <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'5px'}}>{f.l}</div>
                    <div style={{fontSize:'14px',fontWeight:'700',color:'#E8EFF8'}}>{f.v||'—'}</div>
                  </div>
                ))}
                {[{l:'Improvement Area',v:selected.improvement_area},{l:'Good Comment',v:selected.good_comment},{l:'Bad Comment',v:selected.bad_comment},{l:'Feedback',v:selected.feedback}].filter(f=>f.v).map((f,i)=>(
                  <div key={i} style={{gridColumn:'span 2',background:f.l==='Bad Comment'?'rgba(248,113,113,0.08)':'rgba(255,255,255,0.04)',border:`1px solid ${f.l==='Bad Comment'?'rgba(248,113,113,0.25)':'rgba(255,255,255,0.08)'}`,borderRadius:'12px',padding:'14px 16px'}}>
                    <div style={{fontSize:'10px',fontWeight:'700',color:f.l==='Bad Comment'?'#F87171':'#FF6B35',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'5px'}}>{f.l}</div>
                    <div style={{fontSize:'13px',color:'#C8D8EC',lineHeight:'1.65',fontWeight:'500'}}>{f.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{padding:'18px 30px 28px'}}>
              <button onClick={()=>setSelected(null)} style={{...F,width:'100%',padding:'13px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',borderRadius:'12px',color:'white',fontSize:'14px',fontWeight:'800',cursor:'pointer',boxShadow:'0 6px 22px rgba(255,107,53,0.4)'}}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvaluations;