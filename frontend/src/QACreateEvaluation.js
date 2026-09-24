import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api';
const F = { fontFamily: "'Inter','Segoe UI',sans-serif" };

/* ─── Agent DB per QA officer ─── */
const AGENT_DB = {
  'Miran': [
    {name:'Abdullrahman Ali Mahdi',  email:'abdullrahman.mahdi@highperformanceco.net',   coordinator:'Blend'},
    {name:'Aran Eimad Qadir',        email:'aran.qadir@highperformanceco.net',            coordinator:'Blend'},
    {name:'Awdang Saman',            email:'awdang.saman@highperformanceco.net',          coordinator:'Muhammed'},
    {name:'Azad Brifkani',           email:'azad.ameen@highperformanceco.net',            coordinator:'Blend'},
    {name:'Barham Qasim Ahmed',      email:'barham.qasim@highperformanceco.net',          coordinator:'Blend'},
    {name:'Didar Pirbal',            email:'didar.pirbal@highperformanceco.net',          coordinator:'Blend'},
    {name:'Haryad Shakr Abdulla',    email:'haryad.abdulla@highperformanceco.net',        coordinator:'Muhammed'},
    {name:'Hawrin Amir Ahmed',       email:'hawrin.ahmed@highperformanceco.net',          coordinator:'Blend'},
    {name:'Kaiwan Pshtiwan Mustafa', email:'kaiwan.mustafa@highperformanceco.net',        coordinator:'Muhammed'},
    {name:'Muhammad Ali Osman',      email:'ali.osman@highperformanceco.net',             coordinator:'Blend'},
    {name:'Muhammed Abdulbari Majid',email:'muhammed.abdulbari@highperformanceco.net',   coordinator:'Blend'},
    {name:'Omer Tasim Omer',         email:'omer.Omer@highperformanceco.net',             coordinator:'Blend'},
    {name:'Rayan Jaafar',            email:'rayan.jaafar@highperformanceco.net',          coordinator:'Muhammed'},
    {name:'Ronar Rasul',             email:'ronar.rasul@highperformanceco.net',           coordinator:'Blend'},
    {name:'Safar Mikeail Ismail',    email:'safar.ismail@highperformanceco.net',          coordinator:'Muhammed'},
    {name:'Salih Sangar',            email:'salih.sangar@highperformanceco.net',          coordinator:'Blend'},
    {name:'Sazgar Hassan',           email:'sazgar.hassan@highperformanceco.net',         coordinator:'Muhammed'},
    {name:'Suzan Sarmad',            email:'suzan.sarmad@highperformanceco.net',          coordinator:'Blend'},
  ],
  'Sizar': [
    {name:'Adbulqadir Salam',         email:'abdul.qadir@highperformanceco.net',           coordinator:'Nashwan'},
    {name:'Ahmed Khafut Xdr',         email:'ahmed.khafut@highperformanceco.net',          coordinator:'Muhammed'},
    {name:'Ali Khalid',               email:'ali.khalid@highperformanceco.net',            coordinator:'Nashwan'},
    {name:'Ammar Mamnd Salih',        email:'ammar.salih@highperformanceco.net',           coordinator:'Nashwan'},
    {name:'Aya Edris',                email:'aya.edris@highperformanceco.net',             coordinator:'Nashwan'},
    {name:'Bahaa Shamsadeen Sulaiman',email:'bahaa.sulaiman@highperformanceco.net',        coordinator:'Muhammed'},
    {name:'Darbin Omer Abubakr',      email:'darbin.abubakr@highperformanceco.net',        coordinator:'Nashwan'},
    {name:'Esra Sabah Salim',         email:'esra.sabah@highperformanceco.net',            coordinator:'Muhammed'},
    {name:'Govand Wali',              email:'govand.wali@highperformanceco.net',           coordinator:'Nashwan'},
    {name:'Israa Peshkawt',           email:'israa.peshkawt@highperformanceco.net',        coordinator:'Nashwan'},
    {name:'Muhammed Fairq Hadu',      email:'muhammed.fairq@highperformanceco.net',        coordinator:'Nashwan'},
    {name:'Muhammed Jalal Majid',     email:'muhammed.jalalmajid@highperformanceco.net',   coordinator:'Nashwan'},
    {name:'Mustafa Khudhur Ali',      email:'mustafa.khudhur@highperformanceco.net',       coordinator:'Muhammed'},
    {name:'Rasul Najmadeen',          email:'rasul.najmadeen@highperformanceco.net',        coordinator:'Muhammed'},
    {name:'Ruya Yaqub',               email:'ruya.yaqub@highperformanceco.net',            coordinator:'Muhammed'},
    {name:'Rzgar Ali Ismail',         email:'rzgar.ali@highperformanceco.net',             coordinator:'Nashwan'},
    {name:'Safeen Jahfar',            email:'safeen.jahfar@highperformanceco.net',         coordinator:'Muhammed'},
    {name:'Yasser Ameen',             email:'yasser.ameen@highperformanceco.net',          coordinator:'Nashwan'},
    {name:'Yousif Hussen Bahram',     email:'yousif.bahram@highperformanceco.net',         coordinator:'Nashwan'},
  ],
  'Brwa': [
    {name:'Ahmed Jasim Rashid',   email:'ahmed.rashid@highperformanceco.net',    coordinator:'Karzan'},
    {name:'Ahmed Saman',          email:'ahmed.saman@highperformanceco.net',     coordinator:'Karzan'},
    {name:'Bawar Fazl Muhammad',  email:'bawar.muhammad@highperformanceco.net',  coordinator:'Edres'},
    {name:'Daryan Bakr Kakamand', email:'daryan.kakmand@highperformanceco.net',  coordinator:'Karzan'},
    {name:'Dlovan Maraan Ibrahim',email:'dlovan.ibrahim@highperformanceco.net',  coordinator:'Karzan'},
    {name:'Gailan Xalid',         email:'gailan.xalid@highperformanceco.net',    coordinator:'Edres'},
    {name:'Halland Hemn',         email:'halland.hemn@highperformanceco.net',    coordinator:'Edres'},
    {name:'Haryad Muhsin',        email:'haryad.muhsen@highperformanceco.net',   coordinator:'Karzan'},
    {name:'Karwan Wali',          email:'karwan.wali@highperformanceco.net',     coordinator:'Karzan'},
    {name:'Lawin Kosrat Saadi',   email:'lawin.Saadi@highperformanceco.net',     coordinator:'Karzan'},
    {name:'Malik Rashid',         email:'rashid.hasan@highperformanceco.net',    coordinator:'Karzan'},
    {name:'Mohammed Soran Hassan',email:'mohammed.hassan@highperformanceco.net', coordinator:'Edres'},
    {name:'Neamat Anwar Kareem',  email:'neamat.anwar@highperformanceco.net',    coordinator:'Karzan'},
    {name:'Salm Khairulla Saeed', email:'salm.saeed@highperformanceco.net',      coordinator:'Karzan'},
    {name:'Shaida Faizan Kawiz',  email:'shaida.Kawiz@highperformanceco.net',    coordinator:'Edres'},
    {name:'Sozhin Karim',         email:'sozhin.karim@highperformanceco.net',    coordinator:'Karzan'},
    {name:'Zhiya Najmadin',       email:'zhiyar.najmadin@highperformanceco.net', coordinator:'Karzan'},
  ],
  'Mohammed': [],
};

/* ─── Resolution tree ─── */
const TREE = {
  'Inquiries': {
    'KYC': [],
    'Runaki Project': ['Rollout','Smart Meters','Private generators'],
    'Billing Inquiries': ['Tariff','Discounts','Bill amount','Consumption','Payment location'],
    'Dunning': ['Dunning process','Dunning Amount/date'],
    'E-psule': [], 'USSD': [],
  },
  'Billing complaints': {
    'High Bill/ High Debt': [], 'Bill not received': [],
    'Wrong tariff applied': [], 'Zero bill': [],
    'Other billing complaints': [],
  },
  'General complaints': {
    'Outage (cutoff)': ['Planned outage','Unplanned outage','Non-payment','SM issue','Other'],
    'Message not received': ['Not KYCed','No readings'],
    'USSD code': [], 'Fraud': [], 'Block comms': [], 'Private Generators': [],
  },
  'Service requests': {
    'Smart meter': [], 'Linking': [], 'Installation Request': [],
    'Data amendment': [], 'Move in': [], 'Move out': [],
    'Temporary disconnection': [], 'Debt clearance': [], 'Instalment contract': [],
    'Change account holder': [],
    'TR access scheduling': ['Warning leaflet','Disconnection leaflet'],
  },
  'Feedback & others': { 'Feedback': [], 'Others': [] },
};

/* ─── 10 criteria — 0 or 1 each ─── */
const CRITERIA = [
  'Greeting Script',
  'Ask about customer name and information',
  'FAQ Alignment',
  'Correcting Tagging Topic',
  'Communication / Problem Solving',
  'Tone of Voice',
  'Ending',
  'Rude Behaviour',
  'Hang Up',
  'Active Listening',
];

/* ─── helpers ─── */
const todayStr = () => new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
const sc  = p => p >= 80 ? '#4ADE80' : p >= 60 ? '#FBBF24' : '#F87171';
const sbg = p => p >= 80 ? 'rgba(74,222,128,0.12)' : p >= 60 ? 'rgba(251,191,36,0.12)' : 'rgba(248,113,113,0.12)';
const sbd = p => p >= 80 ? 'rgba(74,222,128,0.3)'  : p >= 60 ? 'rgba(251,191,36,0.3)'  : 'rgba(248,113,113,0.3)';
const slb = p => p >= 80 ? 'Excellent' : p >= 60 ? 'Average' : 'Needs Work';

/* ─── shared styles ─── */
const inputSt = err => ({
  width:'100%', padding:'10px 14px', borderRadius:10,
  background:'rgba(255,255,255,0.05)',
  border:`1.5px solid ${err ? '#F87171' : 'rgba(255,255,255,0.12)'}`,
  color:'#FFFFFF', fontSize:13, outline:'none',
  fontFamily:"'Inter','Segoe UI',sans-serif",
  transition:'border-color 0.2s, box-shadow 0.2s',
});
const readonlySt = {
  width:'100%', padding:'10px 14px', borderRadius:10,
  background:'rgba(255,255,255,0.02)',
  border:'1.5px solid rgba(255,255,255,0.06)',
  color:'#4A5A78', fontSize:13, outline:'none',
  fontFamily:"'Inter','Segoe UI',sans-serif",
  cursor:'not-allowed',
};
const selectSt = err => ({
  ...inputSt(err),
  boxSizing:'border-box',
  backgroundColor:'rgba(255,255,255,0.05)',
  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238FA3C4' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center',
  backgroundSize:'12px', paddingRight:36,
  cursor:'pointer', appearance:'none', WebkitAppearance:'none',
});
const disabledSelectSt = {
  ...selectSt(false),
  background:'rgba(255,255,255,0.02)', color:'#2E3A55',
  cursor:'not-allowed', border:'1.5px solid rgba(255,255,255,0.05)',
  boxSizing:'border-box',
};

/* ─── sub-components ─── */
const Lbl = ({ children, required }) => (
  <div style={{ fontSize:11.5, fontWeight:700, color:'#8FA3C4', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:7 }}>
    {children}{required && <span style={{ color:'#F87171', marginLeft:3 }}>*</span>}
  </div>
);
const ErrMsg = ({ msg }) => msg
  ? <div style={{ fontSize:11, color:'#F87171', marginTop:5, fontWeight:600 }}>⚠ {msg}</div>
  : null;

const SectionCard = ({ title, color='#FF6B35', children }) => (
  <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden', marginBottom:20 }}>
    <div style={{ padding:'13px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:10, background:`linear-gradient(90deg,${color}14,transparent)` }}>
      <div style={{ width:4, height:18, background:`linear-gradient(180deg,${color},${color}55)`, borderRadius:4, boxShadow:`0 0 8px ${color}66` }}/>
      <span style={{ fontSize:12, fontWeight:800, color:'#FFFFFF', letterSpacing:'0.5px', textTransform:'uppercase' }}>{title}</span>
    </div>
    <div style={{ padding:'20px 20px 24px' }}>{children}</div>
  </div>
);

/* ════════════════════════════════════════════
   MAIN COMPONENT  — user prop from App.js
════════════════════════════════════════════ */
export default function QACreateEvaluation({ user }) {
  /* The QA officer name comes straight from the logged-in user */
  const qaOfficer = user?.name || '';

  /* agent list filtered to this QA's agents */
  const agentList = (AGENT_DB[qaOfficer] || []).slice().sort((a,b) => a.name.localeCompare(b.name));

  /* form state */
  const [agentName,    setAgentName]    = useState('');
  const [coordinator,  setCoordinator]  = useState('');
  const [agentEmail,   setAgentEmail]   = useState('');
  const [phone,        setPhone]        = useState('');
  const [ticketId,     setTicketId]     = useState('');
  const [waitingTime,  setWaitingTime]  = useState('');
  const [callDuration, setCallDuration] = useState('');
  const [level1,       setLevel1]       = useState('');
  const [level2,       setLevel2]       = useState('');
  const [level3,       setLevel3]       = useState('');
  const [holdUnhold,   setHoldUnhold]   = useState('');
  const [coachStatus,  setCoachStatus]  = useState('');
  const [improvement,  setImprovement]  = useState('');
  const [posComments,  setPosComments]  = useState('');
  const [badComments,  setBadComments]  = useState('');
  const [feedback,     setFeedback]     = useState('');
  const [scores,       setScores]       = useState(Object.fromEntries(CRITERIA.map(c => [c, null])));
  const [errors,       setErrors]       = useState({});
  const [submitting,   setSubmitting]   = useState(false);
  const [submitted,    setSubmitted]    = useState(false);

  /* derived */
  const level2Options = level1 ? Object.keys(TREE[level1] || {}) : [];
  const level3Options = (level1 && level2 && TREE[level1]?.[level2]) || [];
  const filledScores  = CRITERIA.filter(c => scores[c] !== null);
  const totalScore    = filledScores.reduce((a,c) => a + scores[c], 0);
  const allFilled     = filledScores.length === CRITERIA.length;
  const overallPct    = allFilled ? (totalScore / CRITERIA.length) * 100 : null;

  /* handlers */
  const clearErr = k => setErrors(p => ({ ...p, [k]: false }));

  const selectAgent = name => {
    setAgentName(name); clearErr('agentName');
    const found = agentList.find(a => a.name === name);
    if (found) { setCoordinator(found.coordinator); setAgentEmail(found.email); }
    else        { setCoordinator(''); setAgentEmail(''); }
  };

  const setScore = (criterion, val) =>
    setScores(p => ({ ...p, [criterion]: p[criterion] === val ? null : val }));

  const validate = () => {
    const e = {};
    if (!agentName)     e.agentName   = 'Please select an agent.';
    if (!phone.trim())  e.phone       = 'Phone number is required.';
    if (!ticketId.trim()) e.ticketId  = 'Ticket ID is required.';
    if (!level1)        e.level1      = 'Please select Level 1.';
    if (!level2)        e.level2      = 'Please select Level 2.';
    if (!holdUnhold)    e.holdUnhold  = 'Please select Hold–UnHold status.';
    if (!coachStatus)   e.coachStatus = 'Please select coaching status.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setAgentName(''); setCoordinator(''); setAgentEmail('');
    setPhone(''); setTicketId(''); setWaitingTime(''); setCallDuration('');
    setLevel1(''); setLevel2(''); setLevel3('');
    setHoldUnhold(''); setCoachStatus('');
    setImprovement(''); setPosComments(''); setBadComments(''); setFeedback('');
    setScores(Object.fromEntries(CRITERIA.map(c => [c, null])));
    setErrors({}); setSubmitted(false);
  };

  const handleSubmit = async () => {
    if (!validate()) { document.getElementById('qa-form-top')?.scrollIntoView({ behavior:'smooth' }); return; }
    setSubmitting(true);
    try {
      await axios.post(`${API}/evaluations`, {
        qaOfficer, agentName, coordinator, agentEmail,
        evalDate: todayStr(),
        phoneNumber: phone, ticketId, waitingTime, callDuration,
        level1, level2, level3,
        scores,
        overallScore: allFilled ? `${totalScore}/${CRITERIA.length}` : null,
        holdUnhold, coachStatus, improvement,
        positiveComments: posComments, badComments, feedback,
      });
      setSubmitted(true);
    } catch {
      alert('Submission failed. Please check your connection and try again.');
    }
    setSubmitting(false);
  };

  /* ── SUCCESS SCREEN ── */
  if (submitted) return (
    <div style={{ ...F, background:'#0D0F1E', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .qa-inp, .qa-sel { box-sizing: border-box !important; width: 100% !important; min-width: 0 !important; }
  select option { background: #131626; color: #fff; }
`}</style>
      <div style={{ textAlign:'center', maxWidth:420 }}>
        <div style={{ width:80, height:80, borderRadius:24, background:'rgba(74,222,128,0.12)', border:'2px solid rgba(74,222,128,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', boxShadow:'0 0 40px rgba(74,222,128,0.15)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ color:'#FFFFFF', fontSize:24, fontWeight:900, marginBottom:10 }}>Evaluation Submitted</h2>
        <p style={{ color:'#6A7D98', fontSize:14, marginBottom:12 }}>
          Agent <span style={{ color:'#FF8C5A', fontWeight:700 }}>{agentName}</span> evaluated by <span style={{ color:'#A78BFA', fontWeight:700 }}>{qaOfficer}</span>
        </p>
        {allFilled && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'10px 24px', borderRadius:50, background:sbg(overallPct), border:`1.5px solid ${sbd(overallPct)}`, margin:'4px 0 28px' }}>
            <span style={{ fontSize:28, fontWeight:900, color:sc(overallPct) }}>{totalScore}/{CRITERIA.length}</span>
            <span style={{ fontSize:13, fontWeight:700, color:sc(overallPct), opacity:0.8 }}>{slb(overallPct)}</span>
          </div>
        )}
        <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
          <button onClick={resetForm} style={{ padding:'11px 28px', borderRadius:10, background:'linear-gradient(135deg,#FF6B35,#FF9F1C)', border:'none', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'Inter','Segoe UI',sans-serif" }}>
            New Evaluation
          </button>
        </div>
      </div>
    </div>
  );

  /* ── MAIN FORM ── */
  return (
    <div style={{ ...F, background:'#0D0F1E', minHeight:'100vh', padding:'28px 32px 60px', color:'#FFFFFF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .qa-inp:focus { border-color:#FF6B35 !important; box-shadow:0 0 0 3px rgba(255,107,53,0.15) !important; }
        .qa-sel:focus { border-color:#FF6B35 !important; box-shadow:0 0 0 3px rgba(255,107,53,0.15) !important; }
        .qa-sel option { background:#131626; color:#FFFFFF; }
        .qa-inp, .qa-sel { box-sizing:border-box !important; width:100% !important; }
        .tog:hover { transform:translateY(-2px); }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div id="qa-form-top"/>

      {/* ── PAGE HEADER ── */}
      <div style={{ marginBottom:28, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:'#FF8C5A', letterSpacing:'2.5px', textTransform:'uppercase', marginBottom:6 }}>
            QA OFFICER · {qaOfficer}
          </div>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900, letterSpacing:'-0.6px' }}>
            Create{' '}
            <span style={{ background:'linear-gradient(90deg,#FF6B35,#FBBF24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Evaluation
            </span>
          </h1>
          <p style={{ margin:'6px 0 0', fontSize:13, color:'#4A5A78' }}>
            Fill all required fields · Scores are 0 or 1 · Total out of {CRITERIA.length}
          </p>
        </div>

        {/* Logos — background matches sidebar (#0C0E1D) */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
          <div style={{ display:'flex', gap:8 }}>
            {/* Runaki logo */}
            <div style={{ background:'#0C0E1D', borderRadius:10, padding:'8px 14px', display:'flex', alignItems:'center', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 4px 16px rgba(0,0,0,0.3)' }}>
              <svg width="90" height="23" viewBox="0 0 137 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M51.7881 20.5134H50.5541V23.7089H46V11.0017H52.5023C53.7504 11.0017 54.8377 11.1963 55.7623 11.5822C56.6887 11.9698 57.4029 12.5254 57.9032 13.2523C58.4053 13.9793 58.6563 14.826 58.6563 15.7941C58.6563 16.7024 58.4371 17.4942 58.0004 18.1729C57.5638 18.8516 56.9326 19.3889 56.1088 19.7881L58.9445 23.7089H54.0828L51.7863 20.5134H51.7881ZM53.6019 14.6946C53.2925 14.4351 52.8294 14.3036 52.2124 14.3036H50.5523V17.2812H52.2124C52.8294 17.2812 53.2925 17.1515 53.6019 16.8903C53.9113 16.6308 54.0651 16.2632 54.0651 15.7925C54.0651 15.3217 53.9113 14.9541 53.6019 14.6946Z" fill="#FFFFFF"/>
                <path d="M62.4202 22.4197C61.2622 21.3667 60.6841 19.8896 60.6841 17.9899V11H65.2382V17.8618C65.2382 18.7933 65.415 19.472 65.7686 19.8946C66.1221 20.3187 66.633 20.53 67.3031 20.53C67.9731 20.53 68.4823 20.3187 68.8376 19.8946C69.1912 19.4704 69.368 18.7933 69.368 17.8618V11H73.8443V17.9899C73.8443 19.8896 73.2662 21.3667 72.1082 22.4197C70.9502 23.4727 69.3362 24 67.266 24C65.1958 24 63.5817 23.4727 62.4237 22.4197" fill="#FFFFFF"/>
                <path d="M89.6633 11V23.7072H85.9207L80.7868 17.935V23.7072H76.3494V11H80.0938L85.226 16.7722V11H89.6633Z" fill="#FFFFFF"/>
                <path d="M96.3583 21.4932L95.4514 23.7089H90.8213L96.7261 11H101.202L107.107 23.7089H102.399L101.492 21.4932H96.3583ZM100.235 18.4074L98.9235 15.2119L97.6118 18.4074H100.235Z" fill="#FFFFFF"/>
                <path d="M113.761 19.4953L112.738 20.5666V23.7072H108.262V11H112.738V15.6111L117.175 11H122.134L116.731 16.5909L122.405 23.7072H117.138L113.761 19.4953Z" fill="#FFFFFF"/>
                <path d="M128 11H123.446V23.7072H128V11Z" fill="#FFFFFF"/>
                <path d="M3.00121 22.1253C3.00121 22.1253 11.6608 18.0844 25.6074 18.0518C22.6829 19.7929 22.0145 20.7011 22.0145 20.7011C22.0145 20.7011 31.5423 19.5018 37.717 22.1545C31.7191 21.6206 22.0278 22.4827 15.64 24.5004C15.8035 23.8698 17.316 21.8004 18.8236 20.6168C18.8236 20.6168 5.57329 21.443 3 22.1253" fill="#FFFFFF"/>
                <path d="M39.5625 11.6645L31.1669 12.7942L34.2198 5.44857L27.1853 9.8492L26.5035 2L22.2216 8.79597L17.936 2L17.2554 9.84808L10.2197 5.45082L13.275 12.7964L4.87942 11.6668L11.065 17.0555L4.38535 20.3759C6.20542 19.643 8.39483 18.9011 10.9221 18.3088C13.1503 17.7861 15.2004 17.4826 16.9926 17.3095C16.7589 17.1993 16.5252 17.088 16.2927 16.9779L8.41905 13.2494L17.8706 16.1989L12.6695 8.30139L19.5211 15.0254L18.8115 5.55535L22.0484 14.6905L25.628 5.55423L24.1179 14.8265L31.77 8.29915L26.3994 15.8853L36.0229 13.2461C34.5019 14.016 29.4619 17.7895 25.8532 19.4193C29.2149 18.9202 33.2013 19.2833 36.8669 20.8615C34.9015 19.2372 32.1539 18.1042 31.4648 18.0502L39.5625 11.6634V11.6645Z" fill="#D2AD50"/>
              </svg>
            </div>
            {/* HP logo */}
            <div style={{ background:'#0C0E1D', borderRadius:10, padding:'8px 12px', display:'flex', alignItems:'center', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 4px 16px rgba(0,0,0,0.3)' }}>
              <svg width="32" height="23" viewBox="0 0 60 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="28" fontSize="30" fontWeight="900" fill="#FFFFFF" fontFamily="Arial,sans-serif">hp</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:860, margin:'0 auto' }}>

        {/* ══ 1. AGENT INFORMATION ══ */}
        <SectionCard title="Agent Information" color="#FF6B35">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, minWidth:0, overflow:'hidden' }}>
            <div style={{ gridColumn:'1/-1' }}>
              <Lbl required>Agent Name</Lbl>
              {agentList.length === 0 ? (
                <div style={{ padding:'12px 16px', background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, fontSize:13, color:'#F87171', fontWeight:600 }}>
                  ⚠ No agents assigned to {qaOfficer || 'this account'}
                </div>
              ) : (
                <select className="qa-sel" value={agentName} onChange={e => selectAgent(e.target.value)} style={selectSt(errors.agentName)}>
                  <option value="">— Select agent —</option>
                  {agentList.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                </select>
              )}
              <ErrMsg msg={errors.agentName} />
            </div>
            <div style={{minWidth:0}}>
              <Lbl>Coordinator</Lbl>
              <input readOnly value={coordinator} placeholder="Auto-filled on agent select" style={readonlySt} />
            </div>
            <div style={{minWidth:0}}>
              <Lbl>Agent Email</Lbl>
              <input readOnly value={agentEmail} placeholder="Auto-filled on agent select" style={readonlySt} />
            </div>
            <div style={{minWidth:0}}>
              <Lbl>QA Officer</Lbl>
              <input readOnly value={qaOfficer} style={readonlySt} />
            </div>
            <div style={{minWidth:0}}>
              <Lbl>Evaluation Date</Lbl>
              <input readOnly value={todayStr()} style={readonlySt} />
            </div>
          </div>
        </SectionCard>

        {/* ══ 2. CALL DETAILS ══ */}
        <SectionCard title="Call Details" color="#60A5FA">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, minWidth:0, overflow:'hidden' }}>
            <div style={{minWidth:0}}>
              <Lbl required>Phone Number</Lbl>
              <input className="qa-inp" type="text" placeholder="e.g. 07501234567" value={phone}
                onChange={e => { setPhone(e.target.value); clearErr('phone'); }} style={inputSt(errors.phone)} />
              <ErrMsg msg={errors.phone} />
            </div>
            <div style={{minWidth:0}}>
              <Lbl required>Ticket ID</Lbl>
              <input className="qa-inp" type="text" placeholder="Enter ticket ID" value={ticketId}
                onChange={e => { setTicketId(e.target.value); clearErr('ticketId'); }} style={inputSt(errors.ticketId)} />
              <ErrMsg msg={errors.ticketId} />
            </div>
            <div style={{minWidth:0}}>
              <Lbl>Waiting Time</Lbl>
              <input className="qa-inp" type="text" placeholder="e.g. 1:30" value={waitingTime} onChange={e => setWaitingTime(e.target.value)} style={inputSt(false)} />
            </div>
            <div style={{minWidth:0}}>
              <Lbl>Call Duration</Lbl>
              <input className="qa-inp" type="text" placeholder="e.g. 4:22" value={callDuration} onChange={e => setCallDuration(e.target.value)} style={inputSt(false)} />
            </div>
          </div>
        </SectionCard>

        {/* ══ 3. RESOLUTION TREE ══ */}
        <SectionCard title="Subject – Resolution Tree" color="#A78BFA">
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Level 1 */}
            <div>
              <Lbl required>Level 1</Lbl>
              <select className="qa-sel" value={level1}
                onChange={e => { setLevel1(e.target.value); setLevel2(''); setLevel3(''); clearErr('level1'); }}
                style={selectSt(errors.level1)}>
                <option value="">— Select Level 1 —</option>
                {Object.keys(TREE).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
              <ErrMsg msg={errors.level1} />
            </div>
            {/* Level 2 */}
            <div style={{ opacity:level1 ? 1 : 0.4, transition:'opacity 0.2s', pointerEvents:level1 ? 'auto' : 'none' }}>
              <Lbl required>Level 2</Lbl>
              <select className="qa-sel" value={level2} disabled={!level1}
                onChange={e => { setLevel2(e.target.value); setLevel3(''); clearErr('level2'); }}
                style={level1 ? selectSt(errors.level2) : disabledSelectSt}>
                <option value="">{level1 ? '— Select Level 2 —' : '— Select Level 1 first —'}</option>
                {level2Options.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
              <ErrMsg msg={errors.level2} />
            </div>
            {/* Level 3 */}
            <div style={{ opacity:level2 ? 1 : 0.4, transition:'opacity 0.2s', pointerEvents:level2 ? 'auto' : 'none' }}>
              <Lbl>Level 3</Lbl>
              {level3Options.length > 0 ? (
                <select className="qa-sel" value={level3} disabled={!level2}
                  onChange={e => setLevel3(e.target.value)}
                  style={level2 ? selectSt(false) : disabledSelectSt}>
                  <option value="">— Select Level 3 (if applicable) —</option>
                  {level3Options.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              ) : level2 ? (
                <div style={{ padding:'10px 14px', background:'rgba(167,139,250,0.06)', border:'1px solid rgba(167,139,250,0.2)', borderRadius:10, fontSize:12, color:'#A78BFA', fontWeight:600 }}>
                  ✓ No sub-level for this category
                </div>
              ) : (
                <select disabled style={disabledSelectSt}><option>— Select Level 2 first —</option></select>
              )}
            </div>
          </div>
        </SectionCard>

        {/* ══ 4. EVALUATION SCORES ══ */}
        <SectionCard title={`Evaluation Scores — each out of 1, total out of ${CRITERIA.length}`} color="#FBBF24">
          {/* overall bar */}
          <div style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 16px', borderRadius:12, marginBottom:20,
            background:allFilled ? sbg(overallPct) : 'rgba(255,255,255,0.03)',
            border:`1px solid ${allFilled ? sbd(overallPct) : 'rgba(255,255,255,0.08)'}` }}>
            <div style={{ flex:1, height:8, background:'rgba(255,255,255,0.08)', borderRadius:8, overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:8, transition:'width 0.4s ease, background 0.3s',
                width: allFilled ? `${overallPct}%` : `${(filledScores.length/CRITERIA.length)*100}%`,
                background: allFilled ? `linear-gradient(90deg,${sc(overallPct)},${sc(overallPct)}AA)` : 'linear-gradient(90deg,rgba(255,255,255,0.15),rgba(255,255,255,0.08))',
                boxShadow: allFilled ? `0 0 10px ${sc(overallPct)}44` : 'none',
              }}/>
            </div>
            <div style={{ flexShrink:0, textAlign:'right', minWidth:90 }}>
              <div style={{ fontSize:allFilled ? 22 : 15, fontWeight:900, color:allFilled ? sc(overallPct) : '#4A5A78', lineHeight:1 }}>
                {allFilled ? `${totalScore}/${CRITERIA.length}` : `${filledScores.length}/${CRITERIA.length} scored`}
              </div>
              {allFilled && <div style={{ fontSize:11, fontWeight:700, color:sc(overallPct), opacity:0.75, marginTop:2 }}>{slb(overallPct)}</div>}
            </div>
          </div>

          {/* rows */}
          {CRITERIA.map(name => {
            const val = scores[name];
            return (
              <div key={name} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
                padding:'12px 16px', borderRadius:12, marginBottom:8, transition:'all 0.2s',
                background: val === 1 ? 'rgba(74,222,128,0.07)' : val === 0 ? 'rgba(248,113,113,0.07)' : 'rgba(255,255,255,0.03)',
                border: val === 1 ? '1.5px solid rgba(74,222,128,0.2)' : val === 0 ? '1.5px solid rgba(248,113,113,0.2)' : '1.5px solid rgba(255,255,255,0.07)',
              }}>
                <span style={{ fontSize:13, fontWeight:600, color:val === null ? '#8FA3C4' : '#FFFFFF', flex:1 }}>{name}</span>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <button className="tog" onClick={() => setScore(name, 0)} style={{
                    width:42, height:42, borderRadius:10, cursor:'pointer',
                    fontFamily:"'Inter','Segoe UI',sans-serif", fontSize:15, fontWeight:800,
                    border: val === 0 ? 'none' : '1.5px solid rgba(255,255,255,0.12)',
                    background: val === 0 ? '#ef4444' : 'rgba(255,255,255,0.04)',
                    color: val === 0 ? '#fff' : '#4A5A78',
                    boxShadow: val === 0 ? '0 4px 14px rgba(239,68,68,0.4)' : 'none',
                    transition:'all 0.18s',
                  }}>0</button>
                  <button className="tog" onClick={() => setScore(name, 1)} style={{
                    width:42, height:42, borderRadius:10, cursor:'pointer',
                    fontFamily:"'Inter','Segoe UI',sans-serif", fontSize:15, fontWeight:800,
                    border: val === 1 ? 'none' : '1.5px solid rgba(255,255,255,0.12)',
                    background: val === 1 ? '#22c55e' : 'rgba(255,255,255,0.04)',
                    color: val === 1 ? '#fff' : '#4A5A78',
                    boxShadow: val === 1 ? '0 4px 14px rgba(34,197,94,0.4)' : 'none',
                    transition:'all 0.18s',
                  }}>1</button>
                </div>
              </div>
            );
          })}
        </SectionCard>

        {/* ══ 5. ADDITIONAL EVALUATION ══ */}
        <SectionCard title="Additional Evaluation" color="#34D399">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, minWidth:0, overflow:'hidden' }}>
            <div>
              <Lbl required>Hold – UnHold</Lbl>
              <select className="qa-sel" value={holdUnhold}
                onChange={e => { setHoldUnhold(e.target.value); clearErr('holdUnhold'); }}
                style={selectSt(errors.holdUnhold)}>
                <option value="">— Select —</option>
                <option>Correct</option>
                <option>Incorrect</option>
              </select>
              <ErrMsg msg={errors.holdUnhold} />
            </div>
            <div>
              <Lbl required>QA/Trainer Coaching Status</Lbl>
              <select className="qa-sel" value={coachStatus}
                onChange={e => { setCoachStatus(e.target.value); clearErr('coachStatus'); }}
                style={selectSt(errors.coachStatus)}>
                <option value="">— Select —</option>
                <option>Pending Coaching</option>
                <option>Coached</option>
              </select>
              <ErrMsg msg={errors.coachStatus} />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <Lbl>Improvement Areas</Lbl>
              <textarea className="qa-inp" rows={3} placeholder="Describe areas the agent should improve..." value={improvement}
                onChange={e => setImprovement(e.target.value)} style={{ ...inputSt(false), resize:'vertical', minHeight:80 }} />
            </div>
            <div>
              <Lbl>Positive Comments</Lbl>
              <textarea className="qa-inp" rows={3} placeholder="What did the agent do well?" value={posComments}
                onChange={e => setPosComments(e.target.value)} style={{ ...inputSt(false), resize:'vertical', minHeight:80 }} />
            </div>
            <div>
              <Lbl>Bad Comments</Lbl>
              <textarea className="qa-inp" rows={3} placeholder="What needs to be corrected?" value={badComments}
                onChange={e => setBadComments(e.target.value)} style={{ ...inputSt(false), resize:'vertical', minHeight:80 }} />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <Lbl>Feedback</Lbl>
              <textarea className="qa-inp" rows={3} placeholder="General feedback for the agent..." value={feedback}
                onChange={e => setFeedback(e.target.value)} style={{ ...inputSt(false), resize:'vertical', minHeight:80 }} />
            </div>
          </div>
        </SectionCard>

        {/* ══ ACTIONS ══ */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8 }}>
          <button onClick={resetForm} style={{ padding:'11px 24px', borderRadius:10, cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:"'Inter','Segoe UI',sans-serif", background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#6A7D98' }}>
            Clear Form
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            {allFilled && (
              <div style={{ padding:'8px 16px', borderRadius:10, background:sbg(overallPct), border:`1px solid ${sbd(overallPct)}`, fontSize:14, fontWeight:800, color:sc(overallPct) }}>
                {totalScore}/{CRITERIA.length} · {slb(overallPct)}
              </div>
            )}
            <button onClick={handleSubmit} disabled={submitting} style={{
              padding:'12px 36px', borderRadius:10, cursor:submitting ? 'not-allowed' : 'pointer',
              fontSize:14, fontWeight:800, fontFamily:"'Inter','Segoe UI',sans-serif",
              background:submitting ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#FF6B35,#FF9F1C)',
              border:'none', color:'#fff', opacity:submitting ? 0.6 : 1,
              boxShadow:submitting ? 'none' : '0 6px 20px rgba(255,107,53,0.35)',
              transition:'all 0.2s', display:'flex', alignItems:'center', gap:8,
            }}>
              {submitting
                ? <><span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.6s linear infinite' }}/> Submitting...</>
                : 'Submit Evaluation'}
            </button>
          </div>
        </div>

        <p style={{ textAlign:'center', fontSize:11, color:'#2E3A55', marginTop:28, letterSpacing:'1px', textTransform:'uppercase', fontWeight:600 }}>
          QA Team – Runaki Call Center
        </p>
      </div>
    </div>
  );
}