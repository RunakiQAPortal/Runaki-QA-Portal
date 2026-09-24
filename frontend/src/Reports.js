import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const sc=(s)=>s>=80?'#4ADE80':s>=60?'#FBBF24':'#F87171';
const sbg=(s)=>s>=80?'rgba(74,222,128,0.15)':s>=60?'rgba(251,191,36,0.15)':'rgba(248,113,113,0.15)';

const Reports = () => {
  const [evaluations,setEvaluations] = useState([]);
  const [sessions,setSessions]       = useState([]);
  const [spots,setSpots]             = useState([]);
  const [period,setPeriod]           = useState('month');
  const [activeTab,setActiveTab]     = useState('overview');
  const [loading,setLoading]         = useState(false);
  const printRef = useRef();

  useEffect(()=>{
    fetchAll();
    const s=document.createElement('style');s.id='rp-s';
    s.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      .rp-sel option{background:#141728;color:#F1F5F9;}
      .rp-sel:focus{border-color:#FF6B35!important;outline:none;}
      .rp-tab:hover{background:rgba(255,255,255,0.06)!important;}
      .rp-card:hover{border-color:rgba(255,255,255,0.18)!important;}
      .rp-exp:hover{background:rgba(255,255,255,0.1)!important;}
      ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);} ::-webkit-scrollbar-thumb{background:#252A45;border-radius:10px;} ::-webkit-scrollbar-thumb:hover{background:#FF6B35;}
    `;
    if(!document.getElementById('rp-s'))document.head.appendChild(s);
  },[]);

  const fetchAll=async()=>{
    setLoading(true);
    try{
      const [e,s,sp]=await Promise.all([
        axios.get('http://localhost:8080/api/evaluations'),
        axios.get('http://localhost:8080/api/sessions'),
        axios.get('http://localhost:8080/api/spot-checks'),
      ]);
      setEvaluations(e.data);setSessions(s.data);setSpots(sp.data);
    }catch(err){console.error(err);}
    finally{setLoading(false);}
  };

  // Filter by period
  const filterByPeriod=(data,dateKey)=>{
    const now=new Date(); const d=new Date(now);
    if(period==='week') d.setDate(now.getDate()-7);
    else if(period==='month') d.setMonth(now.getMonth()-1);
    else if(period==='quarter') d.setMonth(now.getMonth()-3);
    else return data;
    return data.filter(it=>new Date(it[dateKey])>=d);
  };

  const filteredEvals = filterByPeriod(evaluations,'evaluation_date');
  const filteredSpots = filterByPeriod(spots,'check_date');

  // Computed stats
  const avgScore = filteredEvals.length ? Math.round(filteredEvals.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/filteredEvals.length):0;
  const passRate  = filteredEvals.length ? Math.round(filteredEvals.filter(e=>e.overall_score_percentage>=60).length/filteredEvals.length*100):0;
  const coachDone = filteredEvals.filter(e=>e.coaching_completed).length;
  const coachPend = filteredEvals.filter(e=>!e.coaching_completed).length;
  const correctSp = filteredSpots.filter(s=>s.result==='Correct').length;

  // Per QA stats
  const qaStats=Object.entries(
    filteredEvals.reduce((acc,e)=>{
      const qa=e.qa_name||'Unknown';
      if(!acc[qa])acc[qa]={name:qa,count:0,total:0,coaching:0};
      acc[qa].count++;acc[qa].total+=e.overall_score_percentage||0;
      if(!e.coaching_completed)acc[qa].coaching++;
      return acc;
    },{})
  ).map(([,v])=>({...v,avg:Math.round(v.total/v.count)})).sort((a,b)=>b.avg-a.avg);

  // Per agent stats (bottom performers)
  const agentStats=Object.entries(
    filteredEvals.reduce((acc,e)=>{
      const ag=e.agent_name||'Unknown';
      if(!acc[ag])acc[ag]={name:ag,count:0,total:0};
      acc[ag].count++;acc[ag].total+=e.overall_score_percentage||0;
      return acc;
    },{})
  ).map(([,v])=>({...v,avg:Math.round(v.total/v.count)})).sort((a,b)=>a.avg-b.avg).slice(0,8);

  // Monthly trend (last 6 months)
  const monthlyTrend=(()=>{
    const months=[];
    for(let i=5;i>=0;i--){
      const d=new Date();d.setMonth(d.getMonth()-i);
      const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const label=d.toLocaleDateString('en-GB',{month:'short'});
      const evs=evaluations.filter(e=>(e.evaluation_date||'').startsWith(key));
      const avg=evs.length?Math.round(evs.reduce((s,e)=>s+(e.overall_score_percentage||0),0)/evs.length):0;
      months.push({label,avg,count:evs.length});
    }
    return months;
  })();

  const maxAvg=Math.max(...monthlyTrend.map(m=>m.avg),1);

  // Queue breakdown
  const queueStats=Object.entries(
    filteredEvals.reduce((acc,e)=>{
      const q=e.queue||'Unspecified';
      if(!acc[q])acc[q]={count:0,total:0};
      acc[q].count++;acc[q].total+=e.overall_score_percentage||0;
      return acc;
    },{})
  ).map(([q,v])=>({queue:q,count:v.count,avg:Math.round(v.total/v.count)}));

  const exportCSV=()=>{
    const headers=['Agent','QA Officer','Date','Score','Coaching','Queue','Improvement Area'];
    const rows=filteredEvals.map(e=>[e.agent_name,e.qa_name,e.evaluation_date,e.overall_score_percentage,e.coaching_completed?'Done':'Pending',e.queue,e.improvement_area].map(v=>`"${v||''}"`));
    const csv=[headers,...rows].map(r=>r.join(',')).join('\n');
    const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download=`qa-report-${new Date().toISOString().split('T')[0]}.csv`;a.click();
  };

  const selSt={...F,padding:'9px 13px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',fontSize:'13px',color:'#F1F5F9',outline:'none',cursor:'pointer',appearance:'none',backgroundColor:'rgba(255,255,255,0.07)',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23C8D4E8' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 11px center',paddingRight:'30px'};

  const TABS=[['overview','Overview'],['qa','QA Officers'],['agents','Agents'],['trends','Trends']];

  return (
    <div style={{...F,minHeight:'100vh',background:'#0D0F1E',color:'#F1F5F9'}}>
      {/* HEADER */}
      <div style={{padding:'0 40px',height:'72px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.09)',background:'rgba(255,255,255,0.025)',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{width:'38px',height:'38px',borderRadius:'11px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(255,107,53,0.45)'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div>
            <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',lineHeight:1}}>Runaki QA</div>
            <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF',letterSpacing:'-0.4px',lineHeight:1.25}}>Reports Center</div>
          </div>
        </div>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <select className="rp-sel" value={period} onChange={e=>setPeriod(e.target.value)} style={selSt}>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
            <option value="all">All Time</option>
          </select>
          <button onClick={fetchAll} style={{...F,padding:'8px 16px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',color:'#C8D4E8',fontSize:'13px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Refresh
          </button>
          <button className="rp-exp" onClick={exportCSV} style={{...F,padding:'8px 16px',background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.3)',borderRadius:'9px',color:'#4ADE80',fontSize:'13px',fontWeight:'700',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',transition:'all 0.15s'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export CSV
          </button>
        </div>
      </div>

      <div style={{padding:'32px 40px'}}>
        {/* KPI CARDS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'14px',marginBottom:'28px'}}>
          {[
            {label:'Evaluations',  val:filteredEvals.length, sub:'in period',    accent:'#FF6B35',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>},
            {label:'Avg Score',    val:`${avgScore}%`,        sub:avgScore>=80?'Excellent':avgScore>=60?'Average':'Needs Work', accent:sc(avgScore),icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>},
            {label:'Pass Rate',    val:`${passRate}%`,        sub:'≥60% score',  accent:'#4ADE80',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>},
            {label:'Coaching Done',val:coachDone,             sub:`${coachPend} pending`, accent:'#FBBF24',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>},
            {label:'Spot Checks',  val:filteredSpots.length,  sub:`${correctSp} correct`,accent:'#38BDF8',icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>},
          ].map((s,i)=>(
            <div key={i} className="rp-card" style={{background:'rgba(255,255,255,0.055)',border:'1px solid rgba(255,255,255,0.11)',borderRadius:'18px',padding:'20px 22px',position:'relative',overflow:'hidden',transition:'border-color 0.15s'}}>
              <div style={{position:'absolute',top:'-20px',right:'-20px',width:'80px',height:'80px',borderRadius:'50%',background:`radial-gradient(circle,${s.accent}22 0%,transparent 70%)`,pointerEvents:'none'}}/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                <div style={{width:'36px',height:'36px',borderRadius:'10px',background:`${s.accent}22`,border:`1px solid ${s.accent}44`,display:'flex',alignItems:'center',justifyContent:'center',color:s.accent}}>{s.icon}</div>
                <div style={{width:'7px',height:'7px',borderRadius:'50%',background:s.accent,boxShadow:`0 0 8px ${s.accent}`}}/>
              </div>
              <div style={{fontSize:'11px',fontWeight:'700',color:'#8FA3C4',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'5px'}}>{s.label}</div>
              <div style={{fontSize:'30px',fontWeight:'900',color:'#FFFFFF',letterSpacing:'-0.8px',lineHeight:1}}>{s.val}</div>
              <div style={{fontSize:'11px',fontWeight:'600',color:'#7B8FAD',marginTop:'5px'}}>{s.sub}</div>
              <div style={{position:'absolute',bottom:0,left:0,right:0,height:'2.5px',background:`linear-gradient(90deg,${s.accent} 0%,transparent 65%)`}}/>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{display:'flex',gap:'6px',marginBottom:'22px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'13px',padding:'5px'}}>
          {TABS.map(([k,l])=>(
            <button key={k} className="rp-tab" onClick={()=>setActiveTab(k)} style={{...F,flex:1,padding:'9px',borderRadius:'9px',border:activeTab===k?'1px solid rgba(255,107,53,0.4)':'1px solid transparent',background:activeTab===k?'rgba(255,107,53,0.15)':'transparent',color:activeTab===k?'#FF8C5A':'#8FA3C4',fontSize:'13px',fontWeight:'700',cursor:'pointer',transition:'all 0.15s'}}>{l}</button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab==='overview'&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            {/* Score Distribution */}
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'24px 26px'}}>
              <div style={{fontSize:'13px',fontWeight:'800',color:'#FFFFFF',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#FF6B35',boxShadow:'0 0 8px #FF6B35'}}/>
                Score Distribution
              </div>
              {[['≥80% Excellent','#4ADE80',filteredEvals.filter(e=>e.overall_score_percentage>=80).length],
                ['60–79% Average','#FBBF24',filteredEvals.filter(e=>e.overall_score_percentage>=60&&e.overall_score_percentage<80).length],
                ['<60% Needs Work','#F87171',filteredEvals.filter(e=>e.overall_score_percentage<60).length]
              ].map(([l,c,n])=>{const pct=filteredEvals.length?Math.round(n/filteredEvals.length*100):0;return(
                <div key={l} style={{marginBottom:'16px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                    <span style={{fontSize:'13px',fontWeight:'700',color:'#C8D8EC'}}>{l}</span>
                    <span style={{fontSize:'13px',fontWeight:'800',color:c}}>{n} ({pct}%)</span>
                  </div>
                  <div style={{height:'8px',borderRadius:'4px',background:'rgba(255,255,255,0.07)'}}>
                    <div style={{height:'100%',width:`${pct}%`,borderRadius:'4px',background:c,boxShadow:`0 0 8px ${c}55`,transition:'width 0.5s ease'}}/>
                  </div>
                </div>
              );})}
            </div>
            {/* Queue Breakdown */}
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'24px 26px'}}>
              <div style={{fontSize:'13px',fontWeight:'800',color:'#FFFFFF',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#A78BFA',boxShadow:'0 0 8px #A78BFA'}}/>
                Queue Performance
              </div>
              {queueStats.length===0?<div style={{fontSize:'13px',color:'#8FA3C4',textAlign:'center',padding:'28px 0'}}>No queue data available</div>:
              queueStats.map((q,i)=>{
                const colors=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA'];
                const c=colors[i%colors.length];
                return(
                  <div key={q.queue} style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'14px'}}>
                    <div style={{width:'36px',height:'36px',borderRadius:'10px',background:`${c}22`,border:`1px solid ${c}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'800',color:c,flexShrink:0}}>{q.queue[0]}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
                        <span style={{fontSize:'13px',fontWeight:'700',color:'#C8D8EC'}}>{q.queue}</span>
                        <span style={{fontSize:'13px',fontWeight:'800',color:c}}>{q.avg}%</span>
                      </div>
                      <div style={{height:'6px',borderRadius:'3px',background:'rgba(255,255,255,0.07)'}}>
                        <div style={{height:'100%',width:`${q.avg}%`,borderRadius:'3px',background:c,transition:'width 0.5s ease'}}/>
                      </div>
                      <div style={{fontSize:'11px',color:'#7B8FAD',marginTop:'3px',fontWeight:'600'}}>{q.count} evaluations</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Coaching Progress */}
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'24px 26px'}}>
              <div style={{fontSize:'13px',fontWeight:'800',color:'#FFFFFF',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#FBBF24',boxShadow:'0 0 8px #FBBF24'}}/>
                Coaching Progress
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'20px',marginBottom:'22px'}}>
                <div style={{position:'relative',width:'90px',height:'90px',flexShrink:0}}>
                  <svg width="90" height="90" viewBox="0 0 90 90">
                    <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10"/>
                    <circle cx="45" cy="45" r="36" fill="none" stroke="#4ADE80" strokeWidth="10"
                      strokeDasharray={`${2*Math.PI*36}`} strokeDashoffset={`${2*Math.PI*36*(1-(coachDone/(coachDone+coachPend||1)))}`}
                      strokeLinecap="round" transform="rotate(-90 45 45)" style={{transition:'stroke-dashoffset 0.5s ease'}}/>
                  </svg>
                  <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                    <span style={{fontSize:'18px',fontWeight:'900',color:'#FFFFFF'}}>{coachDone+coachPend?Math.round(coachDone/(coachDone+coachPend)*100):0}%</span>
                  </div>
                </div>
                <div style={{flex:1}}>
                  {[['Done',coachDone,'#4ADE80'],['Pending',coachPend,'#FBBF24']].map(([l,n,c])=>(
                    <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',borderRadius:'10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',marginBottom:'8px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'7px'}}>
                        <div style={{width:'8px',height:'8px',borderRadius:'50%',background:c,boxShadow:`0 0 6px ${c}`}}/>
                        <span style={{fontSize:'13px',fontWeight:'700',color:'#C8D8EC'}}>{l}</span>
                      </div>
                      <span style={{fontSize:'16px',fontWeight:'900',color:c}}>{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Spot Check Accuracy */}
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'24px 26px'}}>
              <div style={{fontSize:'13px',fontWeight:'800',color:'#FFFFFF',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#38BDF8',boxShadow:'0 0 8px #38BDF8'}}/>
                Spot Check Accuracy
              </div>
              {filteredSpots.length===0?<div style={{fontSize:'13px',color:'#8FA3C4',textAlign:'center',padding:'28px 0'}}>No spot checks in this period</div>:(()=>{
                const pct=filteredSpots.length?Math.round(correctSp/filteredSpots.length*100):0;
                return(
                  <>
                    <div style={{display:'flex',justifyContent:'center',marginBottom:'22px'}}>
                      <div style={{position:'relative',width:'110px',height:'110px'}}>
                        <svg width="110" height="110" viewBox="0 0 110 110">
                          <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12"/>
                          <circle cx="55" cy="55" r="44" fill="none" stroke={pct>=70?'#4ADE80':'#F87171'} strokeWidth="12"
                            strokeDasharray={`${2*Math.PI*44}`} strokeDashoffset={`${2*Math.PI*44*(1-pct/100)}`}
                            strokeLinecap="round" transform="rotate(-90 55 55)" style={{transition:'stroke-dashoffset 0.5s ease'}}/>
                        </svg>
                        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                          <span style={{fontSize:'24px',fontWeight:'900',color:'#FFFFFF'}}>{pct}%</span>
                          <span style={{fontSize:'10px',fontWeight:'700',color:'#8FA3C4'}}>Accuracy</span>
                        </div>
                      </div>
                    </div>
                    {[['Correct',correctSp,'#4ADE80'],['Incorrect',filteredSpots.length-correctSp,'#F87171']].map(([l,n,c])=>(
                      <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',borderRadius:'10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',marginBottom:'8px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'7px'}}>
                          <div style={{width:'8px',height:'8px',borderRadius:'50%',background:c,boxShadow:`0 0 6px ${c}`}}/>
                          <span style={{fontSize:'13px',fontWeight:'700',color:'#C8D8EC'}}>{l}</span>
                        </div>
                        <span style={{fontSize:'16px',fontWeight:'900',color:c}}>{n}</span>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* QA OFFICERS TAB */}
        {activeTab==='qa'&&(
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',overflow:'hidden'}}>
            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 120px',padding:'13px 28px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              {['QA Officer','Evaluations','Avg Score','Pending Coaching','Performance'].map(c=>(
                <div key={c} style={{fontSize:'11px',fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase',color:'#8FA3C4'}}>{c}</div>
              ))}
            </div>
            {qaStats.length===0?<div style={{padding:'60px',textAlign:'center',color:'#8FA3C4',fontWeight:'600',fontSize:'14px'}}>No data available</div>:
            qaStats.map((qa,i)=>{
              const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6'];
              const c=ACLR[i%ACLR.length];
              return(
                <div key={qa.name} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 120px',padding:'16px 28px',borderBottom:'1px solid rgba(255,255,255,0.05)',alignItems:'center'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                    <div style={{width:'38px',height:'38px',borderRadius:'11px',background:`linear-gradient(135deg,${c},${c}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'900',color:'white',flexShrink:0}}>
                      {qa.name.trim().split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
                    </div>
                    <span style={{fontSize:'14px',fontWeight:'700',color:'#FFFFFF'}}>{qa.name}</span>
                  </div>
                  <span style={{fontSize:'22px',fontWeight:'900',color:'#FFFFFF'}}>{qa.count}</span>
                  <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'72px',height:'28px',borderRadius:'8px',background:sbg(qa.avg),border:`1.5px solid ${sc(qa.avg)}55`}}>
                    <span style={{fontSize:'13px',fontWeight:'800',color:sc(qa.avg)}}>{qa.avg}%</span>
                  </div>
                  <span style={{fontSize:'14px',fontWeight:'700',color:qa.coaching>0?'#FBBF24':'#4ADE80'}}>{qa.coaching}</span>
                  <div>
                    <div style={{height:'6px',borderRadius:'3px',background:'rgba(255,255,255,0.07)',marginBottom:'4px'}}>
                      <div style={{height:'100%',width:`${qa.avg}%`,borderRadius:'3px',background:sc(qa.avg),boxShadow:`0 0 6px ${sc(qa.avg)}55`,transition:'width 0.5s ease'}}/>
                    </div>
                    <span style={{fontSize:'11px',color:'#8FA3C4',fontWeight:'600'}}>{i===0?'Top Performer':''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* AGENTS TAB */}
        {activeTab==='agents'&&(
          <div>
            <div style={{fontSize:'13px',fontWeight:'700',color:'#8FA3C4',marginBottom:'14px',padding:'0 4px'}}>
              Showing agents with the lowest average scores — <span style={{color:'#FF8C5A'}}>needs immediate attention</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'14px'}}>
              {agentStats.map((ag,i)=>(
                <div key={ag.name} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'20px 24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'13px'}}>
                    <div style={{width:'42px',height:'42px',borderRadius:'12px',background:`linear-gradient(135deg,${sc(ag.avg)},${sc(ag.avg)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'900',color:'#0D0F1E',flexShrink:0}}>
                      {ag.name.trim().split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <div style={{fontSize:'14px',fontWeight:'800',color:'#FFFFFF'}}>{ag.name}</div>
                      <div style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'600'}}>{ag.count} evaluation{ag.count!==1?'s':''}</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'28px',fontWeight:'900',color:sc(ag.avg)}}>{ag.avg}%</div>
                    <div style={{fontSize:'11px',fontWeight:'700',color:sc(ag.avg),textTransform:'uppercase'}}>{ag.avg>=80?'Excellent':ag.avg>=60?'Average':'Needs Work'}</div>
                  </div>
                </div>
              ))}
              {agentStats.length===0&&<div style={{gridColumn:'span 2',padding:'60px',textAlign:'center',color:'#8FA3C4',fontWeight:'600',fontSize:'14px',background:'rgba(255,255,255,0.03)',borderRadius:'18px',border:'1px solid rgba(255,255,255,0.08)'}}>No agent data available</div>}
            </div>
          </div>
        )}

        {/* TRENDS TAB */}
        {activeTab==='trends'&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'16px'}}>
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'28px'}}>
              <div style={{fontSize:'13px',fontWeight:'800',color:'#FFFFFF',marginBottom:'8px',display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#FF6B35',boxShadow:'0 0 8px #FF6B35'}}/>
                Monthly Average Score — Last 6 Months
              </div>
              <div style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'600',marginBottom:'28px'}}>Average evaluation score per month across all QA officers</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:'14px',height:'180px',paddingBottom:'8px'}}>
                {monthlyTrend.map((m,i)=>{
                  const h=maxAvg>0?Math.round((m.avg/maxAvg)*160):0;
                  const c=sc(m.avg);
                  return(
                    <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',height:'100%',justifyContent:'flex-end'}}>
                      <div style={{fontSize:'13px',fontWeight:'800',color:c}}>{m.avg>0?`${m.avg}%`:''}</div>
                      <div style={{width:'100%',borderRadius:'8px 8px 0 0',background:m.avg>0?`${c}33`:'rgba(255,255,255,0.04)',border:m.avg>0?`1px solid ${c}55`:'1px solid rgba(255,255,255,0.07)',height:`${Math.max(h,6)}px`,position:'relative',transition:'height 0.5s ease',overflow:'hidden'}}>
                        {m.avg>0&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:'40%',background:`linear-gradient(0deg,${c}55,transparent)`}}/>}
                      </div>
                      <div style={{fontSize:'12px',fontWeight:'700',color:'#8FA3C4'}}>{m.label}</div>
                      <div style={{fontSize:'10px',color:'#4A5A75',fontWeight:'600'}}>{m.count>0?`${m.count} evals`:''}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Reports;