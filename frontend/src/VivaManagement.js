import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Icon = {
  book:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  plus:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  play:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  results: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  star:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  trash:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  x:       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  refresh: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  user:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  cal:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  q:       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  export:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
};

const F = { fontFamily: "'Inter','Segoe UI',sans-serif" };
const COLORS = ['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const avatarColor = (n) => COLORS[(n?.charCodeAt(0)||0) % COLORS.length];
const initials    = (n) => n ? n.trim().split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase() : '?';
const fmtDate     = (d) => d ? new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—';
const scoreColor  = (s) => s >= 80 ? '#4ADE80' : s >= 60 ? '#FBBF24' : '#F87171';
const scoreBg     = (s) => s >= 80 ? 'rgba(74,222,128,0.15)'  : s >= 60 ? 'rgba(251,191,36,0.15)'  : 'rgba(248,113,113,0.15)';
const scoreBorder = (s) => s >= 80 ? 'rgba(74,222,128,0.35)'  : s >= 60 ? 'rgba(251,191,36,0.35)'  : 'rgba(248,113,113,0.35)';
const scoreLabel  = (s) => s >= 80 ? 'Excellent' : s >= 60 ? 'Average' : 'Needs Work';

const DEFAULT_QUESTIONS = [
  'What is the correct greeting script?',
  'How do you verify customer identity?',
  'What is the escalation process?',
  'How do you handle a billing dispute?',
  'What is the hold-unhold procedure?',
];

const VivaManagement = () => {
  const [quizzes, setQuizzes]           = useState([]);
  const [results, setResults]           = useState([]);
  const [activeTab, setActiveTab]       = useState('quizzes');
  const [searchTerm, setSearchTerm]     = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hoveredCard, setHoveredCard]   = useState(null);
  const [hoveredRow, setHoveredRow]     = useState(null);

  const [showCreate, setShowCreate]   = useState(false);
  const [showConduct, setShowConduct] = useState(false);
  const [showDetail, setShowDetail]   = useState(null);

  const [newQuiz, setNewQuiz] = useState({ title: '', description: '', questions: ['','',''] });
  const [conductForm, setConductForm] = useState({
    vivaId: '', agentName: '', questions: [], answers: [], date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
    const style = document.createElement('style');
    style.id = 'viva-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      .viva-select option { background:#141728; color:#F1F5F9; }
      .viva-input::placeholder { color:#5A6A88 !important; }
      .viva-input:focus { border-color:#FF6B35 !important; box-shadow:0 0 0 3px rgba(255,107,53,0.15) !important; outline:none; }
      .viva-select:focus { border-color:#FF6B35 !important; outline:none; }
      .viva-card:hover { border-color:rgba(255,107,53,0.5) !important; transform:translateY(-3px) !important; box-shadow:0 16px 48px rgba(0,0,0,0.6) !important; background:rgba(255,255,255,0.07) !important; }
      .viva-row:hover { background:rgba(255,255,255,0.05) !important; }
      .viva-tab-inactive:hover { color:#E2EAF4 !important; border-color:rgba(255,107,53,0.3) !important; }
      .viva-btn-ghost:hover { background:rgba(255,255,255,0.1) !important; color:#F1F5F9 !important; }
      .viva-close:hover { background:rgba(255,255,255,0.12) !important; color:#fff !important; }
      ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:rgba(255,255,255,0.03);} ::-webkit-scrollbar-thumb{background:#2A3050;border-radius:10px;}
      ::-webkit-scrollbar-thumb:hover{background:#FF6B35;}
    `;
    if (!document.getElementById('viva-styles')) document.head.appendChild(style);
  }, []);

  const fetchData = async () => {
    try {
      const res  = await axios.get('http://localhost:8080/api/viva');
      if (Array.isArray(res.data)) setQuizzes(res.data);
      const resR = await axios.get('http://localhost:8080/api/viva/results');
      if (Array.isArray(resR.data)) setResults(resR.data);
    } catch { setQuizzes([]); setResults([]); }
  };

  const createQuiz = async () => {
    const questions = newQuiz.questions.filter(q => q.trim());
    if (!newQuiz.title.trim() || questions.length === 0) return;
    try {
      await axios.post('http://localhost:8080/api/viva', { ...newQuiz, questions, status: 'active' });
      fetchData();
    } catch {
      const local = { id: Date.now(), ...newQuiz, questions, status: 'active', created_at: new Date().toISOString() };
      setQuizzes(prev => [...prev, local]);
    }
    setNewQuiz({ title: '', description: '', questions: ['','',''] });
    setShowCreate(false);
  };

  const conductViva = async () => {
    if (!conductForm.agentName.trim() || !conductForm.vivaId) return;
    const quiz    = quizzes.find(q => q.id == conductForm.vivaId);
    if (!quiz) return;
    const total   = quiz.questions?.length || 0;
    const correct = conductForm.answers.filter(a => a === true).length;
    const score   = total > 0 ? Math.round((correct / total) * 100) : 0;
    const entry   = { id: Date.now(), viva_title: quiz.title, agent_name: conductForm.agentName, date: conductForm.date, total_questions: total, score_achieved: correct, avg_percentage: score, status: 'completed', answers: conductForm.answers };
    try { await axios.post('http://localhost:8080/api/viva/results', entry); } catch {}
    setResults(prev => [entry, ...prev]);
    setConductForm({ vivaId: '', agentName: '', questions: [], answers: [], date: new Date().toISOString().split('T')[0] });
    setShowConduct(false);
    setActiveTab('results');
  };

  const openConduct = (quiz) => {
    setConductForm({ vivaId: quiz.id, agentName: '', questions: quiz.questions||[], answers: (quiz.questions||[]).map(()=>null), date: new Date().toISOString().split('T')[0] });
    setShowConduct(true);
  };

  const exportResults = () => {
    const rows = [['Agent','VIVA','Date','Questions','Score','Avg %','Status']];
    results.forEach(r => rows.push([r.agent_name,r.viva_title,r.date,r.total_questions,r.score_achieved,`${r.avg_percentage}%`,r.status]));
    const blob = new Blob([rows.map(r=>r.join(',')).join('\n')], {type:'text/csv'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'VIVA_Results.csv'; a.click();
  };

  const filteredQuizzes  = quizzes.filter(q => q.title?.toLowerCase().includes(searchTerm.toLowerCase()) && (filterStatus==='all'||q.status===filterStatus));
  const filteredResults  = results.filter(r => r.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) || r.viva_title?.toLowerCase().includes(searchTerm.toLowerCase()));
  const avgResultScore   = results.length ? Math.round(results.reduce((s,r)=>s+(r.avg_percentage||0),0)/results.length) : 0;
  const passCount        = results.filter(r=>r.avg_percentage>=60).length;

  // ── shared styles
  const inputSt  = { ...F, width:'100%', padding:'10px 14px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:'10px', fontSize:'13px', color:'#F1F5F9', outline:'none', transition:'all 0.15s', boxSizing:'border-box' };
  const labelSt  = { fontSize:'11px', fontWeight:'700', color:'#C8D4E8', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'7px', display:'block' };
  const selectSt = { 
  ...inputSt, 
  cursor:'pointer', 
  appearance:'none', 
  backgroundColor:'rgba(255,255,255,0.07)',   // ← add this
  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23C8D4E8' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`, 
  backgroundRepeat:'no-repeat', 
  backgroundPosition:'right 12px center', 
  paddingRight:'30px' 
};

  return (
    <div style={{...F, minHeight:'100vh', background:'#0D0F1E', color:'#F1F5F9'}}>

      {/* ── HEADER ── */}
      <div style={{padding:'0 40px',height:'72px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.09)',background:'rgba(255,255,255,0.025)',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{width:'38px',height:'38px',borderRadius:'11px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(255,107,53,0.45)',color:'white'}}>
            {Icon.book}
          </div>
          <div>
            <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',lineHeight:1}}>Runaki QA</div>
            <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF',letterSpacing:'-0.4px',lineHeight:1.25}}>VIVA Management</div>
          </div>
        </div>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <button onClick={fetchData} className="viva-btn-ghost" style={{...F,padding:'8px 16px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',color:'#C8D4E8',fontSize:'13px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',transition:'all 0.15s'}}>
            {Icon.refresh} Refresh
          </button>
          {activeTab==='results' && results.length>0 && (
            <button onClick={exportResults} style={{...F,padding:'8px 16px',background:'rgba(74,222,128,0.12)',border:'1px solid rgba(74,222,128,0.35)',borderRadius:'9px',color:'#4ADE80',fontSize:'13px',fontWeight:'700',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}>
              {Icon.export} Export CSV
            </button>
          )}
          <button onClick={()=>setShowConduct(true)} style={{...F,padding:'8px 18px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.16)',borderRadius:'9px',color:'#FFFFFF',fontSize:'13px',fontWeight:'700',cursor:'pointer',display:'flex',alignItems:'center',gap:'7px'}}>
            {Icon.play} Conduct VIVA
          </button>
          <button onClick={()=>setShowCreate(true)} style={{...F,padding:'8px 18px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',borderRadius:'9px',color:'white',fontSize:'13px',fontWeight:'700',cursor:'pointer',display:'flex',alignItems:'center',gap:'7px',boxShadow:'0 4px 16px rgba(255,107,53,0.4)'}}>
            {Icon.plus} New VIVA
          </button>
        </div>
      </div>

      <div style={{padding:'32px 40px'}}>

        {/* ── STAT CARDS ── */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'28px'}}>
          {[
            {label:'Total VIVAs',  value:quizzes.length,                                              sub:'created templates',   accent:'#FF6B35', icon:Icon.book},
            {label:'Conducted',    value:results.length,                                              sub:'sessions completed',  accent:'#A78BFA', icon:Icon.results},
            {label:'Pass Rate',    value:results.length?`${Math.round((passCount/results.length)*100)}%`:'—', sub:`${passCount} passed`, accent:'#4ADE80', icon:Icon.check},
            {label:'Avg Score',    value:`${avgResultScore}%`,                                        sub:scoreLabel(avgResultScore), accent:scoreColor(avgResultScore), icon:Icon.star},
          ].map((s,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.055)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'18px',padding:'22px 24px',position:'relative',overflow:'hidden',transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.borderColor='rgba(255,255,255,0.2)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.055)';e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';}}>
              <div style={{position:'absolute',top:'-24px',right:'-24px',width:'90px',height:'90px',borderRadius:'50%',background:`radial-gradient(circle,${s.accent}22 0%,transparent 70%)`,pointerEvents:'none'}}/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'18px'}}>
                <div style={{width:'40px',height:'40px',borderRadius:'12px',background:`${s.accent}22`,border:`1px solid ${s.accent}44`,display:'flex',alignItems:'center',justifyContent:'center',color:s.accent}}>{s.icon}</div>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:s.accent,boxShadow:`0 0 10px ${s.accent},0 0 20px ${s.accent}55`}}/>
              </div>
              <div style={{fontSize:'11px',fontWeight:'700',color:'#8FA3C4',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'6px'}}>{s.label}</div>
              <div style={{fontSize:'34px',fontWeight:'900',color:'#FFFFFF',letterSpacing:'-1px',lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:'12px',fontWeight:'600',color:'#7B8FAD',marginTop:'6px'}}>{s.sub}</div>
              <div style={{position:'absolute',bottom:0,left:0,right:0,height:'2.5px',background:`linear-gradient(90deg,${s.accent} 0%,transparent 65%)`}}/>
            </div>
          ))}
        </div>

        {/* ── TABS + FILTER BAR ── */}
        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.11)',borderRadius:'14px',padding:'14px 18px',display:'flex',gap:'12px',marginBottom:'20px',alignItems:'center',flexWrap:'wrap'}}>
          {[{id:'quizzes',label:'VIVA Templates',count:quizzes.length,icon:Icon.book},{id:'results',label:'Results',count:results.length,icon:Icon.results}].map(tab=>(
            <button key={tab.id} className={activeTab!==tab.id?'viva-tab-inactive':''} onClick={()=>{setActiveTab(tab.id);setSearchTerm('');}} style={{
              ...F,padding:'9px 18px',
              background:activeTab===tab.id?'rgba(255,107,53,0.18)':'rgba(255,255,255,0.05)',
              border:activeTab===tab.id?'1px solid rgba(255,107,53,0.5)':'1px solid rgba(255,255,255,0.1)',
              borderRadius:'9px',color:activeTab===tab.id?'#FF8C5A':'#B0C0D8',
              fontSize:'13px',fontWeight:'700',cursor:'pointer',display:'flex',alignItems:'center',gap:'7px',transition:'all 0.15s',
            }}>
              {tab.icon} {tab.label}
              <span style={{padding:'2px 8px',borderRadius:'5px',fontSize:'11px',fontWeight:'800',background:activeTab===tab.id?'rgba(255,107,53,0.25)':'rgba(255,255,255,0.09)',color:activeTab===tab.id?'#FF8C5A':'#94A3B8'}}>
                {tab.count}
              </span>
            </button>
          ))}

          <div style={{width:'1px',height:'28px',background:'rgba(255,255,255,0.1)'}}/>

          <div style={{position:'relative',flex:1,minWidth:'160px'}}>
            <div style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',color:'#7A8BAA',pointerEvents:'none'}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <input type="text" className="viva-input" placeholder={activeTab==='quizzes'?'Search VIVA name...':'Search agent or VIVA...'} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} style={{...inputSt,paddingLeft:'36px'}}/>
          </div>

          {activeTab==='quizzes' && (
            <select className="viva-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{...selectSt,width:'auto'}}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          )}
        </div>

        {/* ── QUIZZES GRID ── */}
        {activeTab==='quizzes' && (
          filteredQuizzes.length===0 ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'80px 40px',gap:'16px',background:'rgba(255,255,255,0.03)',border:'1px dashed rgba(255,107,53,0.25)',borderRadius:'18px'}}>
              <div style={{width:'64px',height:'64px',borderRadius:'20px',background:'rgba(255,107,53,0.1)',border:'1px solid rgba(255,107,53,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#FF6B35'}}>
                {React.cloneElement(Icon.book,{width:28,height:28})}
              </div>
              <div style={{fontSize:'17px',fontWeight:'800',color:'#E8EFF8'}}>No VIVA templates yet</div>
              <div style={{fontSize:'13px',color:'#8FA3C4',fontWeight:'600'}}>Click "New VIVA" to create your first template</div>
              <button onClick={()=>setShowCreate(true)} style={{...F,marginTop:'8px',padding:'10px 24px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',borderRadius:'10px',color:'white',fontSize:'13px',fontWeight:'700',cursor:'pointer',display:'flex',alignItems:'center',gap:'7px',boxShadow:'0 4px 16px rgba(255,107,53,0.4)'}}>
                {Icon.plus} Create First VIVA
              </button>
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:'16px'}}>
              {filteredQuizzes.map(quiz=>(
                <div key={quiz.id} className="viva-card" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.11)',borderRadius:'18px',padding:'24px',cursor:'pointer',transition:'all 0.2s',position:'relative',overflow:'hidden'}}
                  onMouseEnter={()=>setHoveredCard(quiz.id)} onMouseLeave={()=>setHoveredCard(null)} onClick={()=>setShowDetail(quiz)}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:'2.5px',background:'linear-gradient(90deg,#FF6B35,rgba(255,107,53,0.1))'}}/>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'14px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                      <div style={{width:'42px',height:'42px',borderRadius:'12px',background:'rgba(255,107,53,0.18)',border:'1px solid rgba(255,107,53,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'#FF8C5A'}}>
                        {Icon.book}
                      </div>
                      <div>
                        <div style={{fontSize:'15px',fontWeight:'800',color:'#FFFFFF',marginBottom:'3px'}}>{quiz.title}</div>
                        <div style={{fontSize:'11px',color:'#8FA3C4',fontWeight:'500'}}>{fmtDate(quiz.created_at)}</div>
                      </div>
                    </div>
                    <span style={{padding:'4px 10px',borderRadius:'6px',fontSize:'11px',fontWeight:'700',textTransform:'uppercase',background:quiz.status==='active'?'rgba(74,222,128,0.15)':'rgba(255,255,255,0.07)',border:`1px solid ${quiz.status==='active'?'rgba(74,222,128,0.4)':'rgba(255,255,255,0.12)'}`,color:quiz.status==='active'?'#4ADE80':'#8FA3C4'}}>
                      {quiz.status||'active'}
                    </span>
                  </div>

                  {quiz.description && (
                    <p style={{fontSize:'13px',color:'#A0B2CC',marginBottom:'16px',lineHeight:'1.65',margin:'0 0 16px'}}>{quiz.description}</p>
                  )}

                  {quiz.questions?.length>0 && (
                    <div style={{marginBottom:'16px'}}>
                      {quiz.questions.slice(0,2).map((q,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                          <div style={{width:'20px',height:'20px',borderRadius:'5px',background:'rgba(255,107,53,0.15)',border:'1px solid rgba(255,107,53,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:'800',color:'#FF8C5A',flexShrink:0}}>{i+1}</div>
                          <span style={{fontSize:'12px',color:'#B8C8DC',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:'500'}}>{q}</span>
                        </div>
                      ))}
                      {quiz.questions.length>2 && (
                        <div style={{fontSize:'12px',color:'#6A7D9A',marginTop:'7px',fontWeight:'600'}}>+{quiz.questions.length-2} more questions</div>
                      )}
                    </div>
                  )}

                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'16px',paddingTop:'14px',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'12px',color:'#8FA3C4',fontWeight:'600'}}>
                      {Icon.q} {quiz.questions?.length||0} questions
                    </div>
                    <button onClick={e=>{e.stopPropagation();openConduct(quiz);}} style={{...F,padding:'6px 14px',background:'rgba(255,107,53,0.12)',border:'1px solid rgba(255,107,53,0.35)',borderRadius:'8px',color:'#FF8C5A',fontSize:'12px',fontWeight:'700',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px',transition:'all 0.15s'}}
                      onMouseEnter={e=>{e.currentTarget.style.background='#FF6B35';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='#FF6B35';}}
                      onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,107,53,0.12)';e.currentTarget.style.color='#FF8C5A';e.currentTarget.style.borderColor='rgba(255,107,53,0.35)';}}>
                      {Icon.play} Conduct
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── RESULTS TABLE ── */}
        {activeTab==='results' && (
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',overflow:'hidden'}}>
            <div style={{display:'grid',gridTemplateColumns:'2fr 1.6fr 0.9fr 100px 100px 120px 110px',padding:'13px 28px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.09)'}}>
              {['Agent','VIVA Name','Date','Questions','Score','Avg %','Status'].map(col=>(
                <div key={col} style={{fontSize:'11px',fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase',color:'#8FA3C4'}}>{col}</div>
              ))}
            </div>
            <div style={{maxHeight:'520px',overflowY:'auto'}}>
              {filteredResults.length===0 ? (
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'80px 40px',gap:'16px'}}>
                  <div style={{width:'64px',height:'64px',borderRadius:'20px',background:'rgba(255,107,53,0.1)',border:'1px solid rgba(255,107,53,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#FF6B35'}}>
                    {React.cloneElement(Icon.results,{width:28,height:28})}
                  </div>
                  <div style={{fontSize:'17px',fontWeight:'800',color:'#E8EFF8'}}>No results yet</div>
                  <div style={{fontSize:'13px',color:'#8FA3C4',fontWeight:'600'}}>Conduct a VIVA session to see results here</div>
                </div>
              ) : filteredResults.map(r=>(
                <div key={r.id} className="viva-row" style={{display:'grid',gridTemplateColumns:'2fr 1.6fr 0.9fr 100px 100px 120px 110px',padding:'14px 28px',borderBottom:'1px solid rgba(255,255,255,0.05)',alignItems:'center',transition:'background 0.12s'}}
                  onMouseEnter={()=>setHoveredRow(r.id)} onMouseLeave={()=>setHoveredRow(null)}>
                  <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
                    <div style={{width:'34px',height:'34px',borderRadius:'9px',flexShrink:0,background:`linear-gradient(135deg,${avatarColor(r.agent_name)},${avatarColor(r.agent_name)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'800',color:'white',boxShadow:`0 2px 10px ${avatarColor(r.agent_name)}55`}}>
                      {initials(r.agent_name)}
                    </div>
                    <span style={{fontSize:'14px',fontWeight:'700',color:'#FFFFFF'}}>{r.agent_name||'—'}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'7px'}}>
                    <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#FF6B35',boxShadow:'0 0 6px #FF6B35',flexShrink:0}}/>
                    <span style={{fontSize:'13px',fontWeight:'600',color:'#C8D8EC'}}>{r.viva_title||'—'}</span>
                  </div>
                  <span style={{fontSize:'12px',fontWeight:'600',color:'#8FA3C4'}}>{fmtDate(r.date)}</span>
                  <span style={{fontSize:'13px',fontWeight:'700',color:'#C8D8EC'}}>{r.total_questions||'—'}</span>
                  <span style={{fontSize:'13px',fontWeight:'700',color:'#C8D8EC'}}>{r.score_achieved}/{r.total_questions}</span>
                  <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'72px',height:'28px',borderRadius:'7px',background:scoreBg(r.avg_percentage||0),border:`1.5px solid ${scoreBorder(r.avg_percentage||0)}`}}>
                    <span style={{fontSize:'13px',fontWeight:'800',color:scoreColor(r.avg_percentage||0)}}>{r.avg_percentage??'—'}%</span>
                  </div>
                  <div style={{display:'inline-flex',alignItems:'center',gap:'5px',padding:'4px 10px',borderRadius:'7px',background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.3)'}}>
                    <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#4ADE80',boxShadow:'0 0 6px #4ADE80'}}/>
                    <span style={{fontSize:'11px',fontWeight:'700',color:'#4ADE80'}}>Done</span>
                  </div>
                </div>
              ))}
            </div>
            {filteredResults.length>0 && (
              <div style={{padding:'12px 28px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'600'}}><span style={{color:'#C8D8EC',fontWeight:'700'}}>{filteredResults.length}</span> results</span>
                <div style={{display:'flex',gap:'16px'}}>
                  {[['#4ADE80','Pass',r=>r.avg_percentage>=60],['#F87171','Fail',r=>r.avg_percentage<60]].map(([c,l,fn])=>(
                    <div key={l} style={{display:'flex',alignItems:'center',gap:'5px'}}>
                      <div style={{width:'6px',height:'6px',borderRadius:'50%',background:c,boxShadow:`0 0 6px ${c}`}}/>
                      <span style={{fontSize:'11px',fontWeight:'700',color:'#8FA3C4'}}>{l}: {filteredResults.filter(fn).length}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ MODAL: CREATE VIVA ══ */}
      {showCreate && (
        <div onClick={()=>setShowCreate(false)} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
          <div onClick={e=>e.stopPropagation()} style={{...F,background:'#131626',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'24px',width:'100%',maxWidth:'560px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 60px 120px rgba(0,0,0,0.85)'}}>
            <div style={{padding:'26px 30px 22px',borderBottom:'1px solid rgba(255,255,255,0.09)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:'3px'}}>New Template</div>
                <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF'}}>Create VIVA</div>
              </div>
              <button className="viva-close" onClick={()=>setShowCreate(false)} style={{...F,width:'34px',height:'34px',borderRadius:'9px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'#94A3B8',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>{Icon.x}</button>
            </div>
            <div style={{padding:'22px 30px',display:'flex',flexDirection:'column',gap:'18px'}}>
              <div>
                <label style={labelSt}>VIVA Name *</label>
                <input className="viva-input" placeholder="e.g. High Bill VIVA" value={newQuiz.title} onChange={e=>setNewQuiz({...newQuiz,title:e.target.value})} style={inputSt}/>
              </div>
              <div>
                <label style={labelSt}>Description</label>
                <textarea className="viva-input" placeholder="What this VIVA covers..." value={newQuiz.description} onChange={e=>setNewQuiz({...newQuiz,description:e.target.value})} rows={3} style={{...inputSt,resize:'vertical',lineHeight:'1.6'}}/>
              </div>
              <div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
                  <label style={{...labelSt,marginBottom:0}}>Questions *</label>
                  <button onClick={()=>setNewQuiz({...newQuiz,questions:[...newQuiz.questions,'']})} style={{...F,padding:'5px 12px',background:'rgba(255,107,53,0.12)',border:'1px solid rgba(255,107,53,0.35)',borderRadius:'7px',color:'#FF8C5A',fontSize:'12px',fontWeight:'700',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px'}}>
                    {Icon.plus} Add
                  </button>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                  {newQuiz.questions.map((q,i)=>(
                    <div key={i} style={{display:'flex',gap:'8px',alignItems:'center'}}>
                      <div style={{width:'24px',height:'24px',borderRadius:'6px',background:'rgba(255,107,53,0.15)',border:'1px solid rgba(255,107,53,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:'800',color:'#FF8C5A',flexShrink:0}}>{i+1}</div>
                      <input className="viva-input" placeholder={`Question ${i+1}...`} value={q} onChange={e=>{const qs=[...newQuiz.questions];qs[i]=e.target.value;setNewQuiz({...newQuiz,questions:qs});}} style={{...inputSt,flex:1}}/>
                      {newQuiz.questions.length>1 && (
                        <button onClick={()=>setNewQuiz({...newQuiz,questions:newQuiz.questions.filter((_,j)=>j!==i)})} style={{...F,width:'30px',height:'30px',borderRadius:'7px',background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.25)',color:'#F87171',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                          {Icon.trash}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{marginTop:'10px',display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'center'}}>
                  <span style={{fontSize:'11px',color:'#6A7D9A',fontWeight:'600'}}>Quick add:</span>
                  {DEFAULT_QUESTIONS.slice(0,3).map((q,i)=>(
                    <button key={i} onClick={()=>setNewQuiz({...newQuiz,questions:[...newQuiz.questions,q]})} style={{...F,padding:'3px 10px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'5px',color:'#A0B2CC',fontSize:'11px',cursor:'pointer',fontWeight:'600'}}>
                      + {q.length>28?q.slice(0,28)+'…':q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{padding:'0 30px 28px',display:'flex',gap:'12px'}}>
              <button onClick={createQuiz} style={{...F,flex:1,padding:'13px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',borderRadius:'12px',color:'white',fontSize:'14px',fontWeight:'800',cursor:'pointer',boxShadow:'0 6px 22px rgba(255,107,53,0.4)'}}>Save VIVA</button>
              <button onClick={()=>setShowCreate(false)} style={{...F,flex:1,padding:'13px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'12px',color:'#C8D4E8',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: CONDUCT VIVA ══ */}
      {showConduct && (
        <div onClick={()=>setShowConduct(false)} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
          <div onClick={e=>e.stopPropagation()} style={{...F,background:'#131626',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'24px',width:'100%',maxWidth:'580px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 60px 120px rgba(0,0,0,0.85)'}}>
            <div style={{padding:'26px 30px 22px',borderBottom:'1px solid rgba(255,255,255,0.09)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:'3px'}}>New Session</div>
                <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF'}}>Conduct VIVA</div>
              </div>
              <button className="viva-close" onClick={()=>setShowConduct(false)} style={{...F,width:'34px',height:'34px',borderRadius:'9px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'#94A3B8',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>{Icon.x}</button>
            </div>
            <div style={{padding:'22px 30px',display:'flex',flexDirection:'column',gap:'16px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                <div>
                  <label style={labelSt}>VIVA Template *</label>
                  <select className="viva-select" value={conductForm.vivaId} onChange={e=>{const quiz=quizzes.find(q=>q.id==e.target.value);setConductForm({...conductForm,vivaId:e.target.value,questions:quiz?.questions||[],answers:(quiz?.questions||[]).map(()=>null)});}} style={selectSt}>
                    <option value="">Select VIVA...</option>
                    {quizzes.map(q=><option key={q.id} value={q.id}>{q.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Agent Name *</label>
                  <input className="viva-input" placeholder="Agent full name..." value={conductForm.agentName} onChange={e=>setConductForm({...conductForm,agentName:e.target.value})} style={inputSt}/>
                </div>
              </div>
              <div>
                <label style={labelSt}>Date</label>
                <input type="date" className="viva-input" value={conductForm.date} onChange={e=>setConductForm({...conductForm,date:e.target.value})} style={{...inputSt,colorScheme:'dark'}}/>
              </div>
              {conductForm.questions.length>0 && (
                <div>
                  <label style={labelSt}>Mark Answers</label>
                  <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                    {conductForm.questions.map((q,i)=>(
                      <div key={i} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'14px 16px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'10px',flex:1}}>
                            <div style={{width:'22px',height:'22px',borderRadius:'6px',background:'rgba(255,107,53,0.15)',border:'1px solid rgba(255,107,53,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:'800',color:'#FF8C5A',flexShrink:0}}>{i+1}</div>
                            <span style={{fontSize:'13px',color:'#D8E4F0',fontWeight:'500',lineHeight:'1.45'}}>{q}</span>
                          </div>
                          <div style={{display:'flex',gap:'6px',flexShrink:0}}>
                            {[{v:true,label:'✓',c:'#4ADE80',bg:'rgba(74,222,128,0.15)',bd:'rgba(74,222,128,0.4)'},{v:false,label:'✗',c:'#F87171',bg:'rgba(248,113,113,0.15)',bd:'rgba(248,113,113,0.4)'}].map(btn=>(
                              <button key={String(btn.v)} onClick={()=>{const a=[...conductForm.answers];a[i]=btn.v;setConductForm({...conductForm,answers:a});}} style={{...F,width:'36px',height:'32px',borderRadius:'8px',cursor:'pointer',fontSize:'14px',fontWeight:'800',background:conductForm.answers[i]===btn.v?btn.bg:'rgba(255,255,255,0.05)',border:`1px solid ${conductForm.answers[i]===btn.v?btn.bd:'rgba(255,255,255,0.1)'}`,color:conductForm.answers[i]===btn.v?btn.c:'#5A6A88',transition:'all 0.12s'}}>{btn.label}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {conductForm.answers.some(a=>a!==null) && (
                    <div style={{marginTop:'14px',padding:'14px 18px',borderRadius:'12px',background:'rgba(255,107,53,0.1)',border:'1px solid rgba(255,107,53,0.25)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:'13px',color:'#FF8C5A',fontWeight:'700'}}>Live Score Preview</span>
                      <span style={{fontSize:'21px',fontWeight:'900',color:scoreColor(Math.round((conductForm.answers.filter(a=>a===true).length/conductForm.questions.length)*100))}}>
                        {conductForm.answers.filter(a=>a===true).length}/{conductForm.questions.length} — {Math.round((conductForm.answers.filter(a=>a===true).length/conductForm.questions.length)*100)}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{padding:'0 30px 28px',display:'flex',gap:'12px'}}>
              <button onClick={conductViva} style={{...F,flex:1,padding:'13px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',borderRadius:'12px',color:'white',fontSize:'14px',fontWeight:'800',cursor:'pointer',boxShadow:'0 6px 22px rgba(255,107,53,0.4)'}}>Save Result</button>
              <button onClick={()=>setShowConduct(false)} style={{...F,flex:1,padding:'13px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'12px',color:'#C8D4E8',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: VIVA DETAIL ══ */}
      {showDetail && (
        <div onClick={()=>setShowDetail(null)} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
          <div onClick={e=>e.stopPropagation()} style={{...F,background:'#131626',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'24px',width:'100%',maxWidth:'500px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 60px 120px rgba(0,0,0,0.85)'}}>
            <div style={{padding:'26px 30px 22px',borderBottom:'1px solid rgba(255,255,255,0.09)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:'3px'}}>VIVA Details</div>
                <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF'}}>{showDetail.title}</div>
              </div>
              <button className="viva-close" onClick={()=>setShowDetail(null)} style={{...F,width:'34px',height:'34px',borderRadius:'9px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'#94A3B8',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>{Icon.x}</button>
            </div>
            <div style={{padding:'22px 30px'}}>
              {showDetail.description && <p style={{fontSize:'14px',color:'#A0B2CC',lineHeight:'1.7',marginBottom:'20px',fontWeight:'500'}}>{showDetail.description}</p>}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'20px'}}>
                {[{l:'Status',v:showDetail.status||'active'},{l:'Created',v:fmtDate(showDetail.created_at)},{l:'Questions',v:showDetail.questions?.length||0},{l:'Conducted',v:results.filter(r=>r.viva_title===showDetail.title).length+' times'}].map((f,i)=>(
                  <div key={i} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'14px 16px'}}>
                    <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'1.8px',textTransform:'uppercase',marginBottom:'6px'}}>{f.l}</div>
                    <div style={{fontSize:'14px',fontWeight:'700',color:'#E8EFF8'}}>{f.v}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:'11px',fontWeight:'700',color:'#8FA3C4',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'12px'}}>All Questions</div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {showDetail.questions?.map((q,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'12px 14px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'10px'}}>
                    <div style={{width:'22px',height:'22px',borderRadius:'6px',background:'rgba(255,107,53,0.15)',border:'1px solid rgba(255,107,53,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:'800',color:'#FF8C5A',flexShrink:0}}>{i+1}</div>
                    <span style={{fontSize:'13px',color:'#D8E4F0',fontWeight:'500'}}>{q}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{padding:'0 30px 28px',display:'flex',gap:'12px'}}>
              <button onClick={()=>{setShowDetail(null);openConduct(showDetail);}} style={{...F,flex:1,padding:'13px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',borderRadius:'12px',color:'white',fontSize:'14px',fontWeight:'800',cursor:'pointer',boxShadow:'0 6px 22px rgba(255,107,53,0.4)',display:'flex',alignItems:'center',justifyContent:'center',gap:'7px'}}>
                {Icon.play} Conduct This VIVA
              </button>
              <button onClick={()=>setShowDetail(null)} style={{...F,flex:1,padding:'13px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'12px',color:'#C8D4E8',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VivaManagement;