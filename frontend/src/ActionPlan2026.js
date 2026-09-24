import React, { useState, useMemo } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };

// result = 'Pass' | 'Fail'
const rc  = r => r==='Fail' ? '#F87171' : '#4ADE80';
const rbg = r => r==='Fail' ? 'rgba(248,113,113,0.12)' : 'rgba(74,222,128,0.10)';

// ─── DATA  [date, agent, phone, result, details] ──────────────────────────
const INIT_TC = [
  ["04 Jan","Ahmed Saman","7508934757","Pass","Bill amount — handled successfully."],
  ["04 Jan","Zhiya Najmadin","7508934757","Pass","Bill amount — handled successfully."],
  ["04 Jan","Daryan Bakr Kakamand","7508934757","Fail","Bill amount call — agent is not an active listener."],
  ["04 Jan","Barham Qasim Ahmed","7508934757","Fail","SM issue — did not provide the right process."],
  ["04 Jan","Awdang Saman","7508934757","Pass","Bill amount — handled successfully."],
  ["05 Jan","Ahmed Saman","7508934757","Pass","Bill amount — handled successfully."],
  ["07 Jan","Yasser Amin","7508934757","Pass","KYC submit — handled successfully."],
  ["11 Jan","Ali Khalid","7508934757","Pass","Unplanned outage — handled successfully."],
  ["11 Jan","Darbin Omer Abubakr","7508934757","Pass","Unplanned outage — handled successfully."],
  ["12 Jan","Malik Rashid","7508934757","Pass","Unplanned outage — handled successfully."],
  ["12 Jan","Mohammad Jalil","7508934757","Pass","Unplanned outage — handled successfully."],
  ["12 Jan","Lawin Kosrat Saadi","7508934757","Pass","Unplanned outage — handled successfully."],
  ["14 Jan","Sozhin Karim","7507594216","Pass","Bill amount — handled successfully."],
  ["14 Jan","Yasser Ameen","7507594216","Fail","SM issue — wrong process, missed instructions, not an active listener."],
  ["14 Jan","Muhamad Shakr","7507594216","Pass","KYC — handled successfully."],
  ["24 Jan","Salm Khairulla Saeed","7507594216","Pass","Bill amount — handled successfully."],
  ["24 Jan","Lawin Kosrat Saadi","7507594216","Pass","KYC submit — handled successfully."],
  ["24 Jan","Haryad Muhsin","7507594216","Pass","Unplanned outage — handled successfully."],
  ["24 Jan","Sazgar Hassan","7507594216","Pass","Unplanned outage — handled successfully."],
  ["24 Jan","Neamat Anwar Kareem","7507594216","Pass","Unplanned outage — handled successfully."],
  ["26 Jan","Sozhin Karim","7507594216","Pass","Bill amount — handled successfully."],
  ["26 Jan","Ahmed Jasim Rashid","7507594216","Pass","Unplanned outage — handled successfully."],
  ["26 Jan","Aya Edris","7507594216","Pass","Unplanned outage — handled successfully."],
  ["28 Jan","Dlovan Maraan Ibrahim","7507594216","Pass","High bill/High debt — handled perfectly."],
  ["28 Jan","Abdullrahman Ali Mahdi","7507594216","Pass","High bill/High debt — handled perfectly."],
  ["10 Feb","Shallaw Abdulrahman","7507594216","Pass","E-Psula — handled successfully."],
  ["10 Feb","Muhamad Jalil","7507594216","Pass","E-Psula — handled successfully."],
  ["10 Feb","Lawin Kosrat Saadi","7507594216","Pass","E-Psula — handled successfully."],
  ["10 Feb","Abdulrahim Muhammed","7507594216","Pass","E-Psula — handled successfully."],
  ["10 Feb","Muhammed Fairq Hadu","7507594216","Pass","E-Psula — handled successfully."],
  ["10 Feb","Sazgar Hassan","7507735600","Pass","High bill/High debt — handled successfully."],
  ["10 Feb","Salm Khairulla Saeed","7507735600","Pass","Bill amount/High bill — handled successfully."],
  ["10 Feb","Haryad Muhsin","7507735600","Pass","E-Psula — handled successfully."],
  ["17 Feb","Ahmad Ghafor","7508934757","Pass","E-Psula — handled successfully."],
  ["17 Feb","Haryad Shakir","7508934757","Pass","E-Psula — handled successfully."],
  ["17 Feb","Ammar Mamnd","7507594216","Pass","Bill amount — handled successfully."],
  ["17 Feb","Azad Brifkany","7507594216","Fail","E-Psula — agent hung up before finishing script, didn't provide full requested info."],
  ["17 Feb","Aya Edris","7507594216","Pass","E-Psula — handled successfully."],
  ["17 Feb","Sazgar Hassan","7507594216","Pass","E-Psula — handled successfully."],
  ["17 Feb","Ahmed Jasim Rashid","7507594216","Pass","E-Psula — handled successfully."],
  ["18 Feb","Didar Pirbal","7508934757","Pass","High bill/High debt — handled successfully."],
  ["18 Feb","Sozhin Karim","7508934757","Pass","Bill amount/High bill — handled successfully."],
  ["18 Feb","Sazgar Hassan","7508934757","Pass","E-Psula — handled successfully."],
  ["18 Feb","Muhammed Abdulbari","7508934757","Pass","Bill amount — handled successfully."],
  ["18 Feb","Didar Pirbal","7507594216","Pass","KYC submit — handled successfully."],
  ["18 Feb","Omer Tasim Omer","7507594216","Pass","Unplanned outage — handled successfully."],
  ["18 Feb","Hawrin Amir Ahmed","7507594216","Pass","Unplanned outage — handled successfully."],
  ["18 Feb","Mohammed Soran Hassan","7507594216","Pass","Disconnection — non payment — handled successfully."],
  ["19 Feb","Bawar Fazl Muhammad","7507594216","Pass","Disconnection — non payment — handled successfully."],
  ["19 Feb","Muhamad Shakr","7507594216","Pass","Unplanned outage — handled successfully."],
  ["19 Feb","Rawaz Muhammed","7507594216","Pass","KYC submit — handled successfully."],
];

const INIT_LATE = [
  ["04 Jan","Daryan Bakr Kakamand","7730160491","Pass","Clear"],
  ["04 Jan","Dlovan Maraan Ibrahim","7503232666","Pass","Clear"],
  ["04 Jan","Haryad Muhsin","7503649089","Pass","Clear"],
  ["04 Jan","Karwan Wali","7504635635","Pass","Clear"],
  ["04 Jan","Malik Rashid","7507492077","Pass","Clear"],
  ["05 Jan","Ali Khalid","7506399494","Pass","Clear"],
  ["05 Jan","Ammar Mamnd Salih","7504817136","Pass","Clear"],
  ["05 Jan","Aya Edris","7702090240","Pass","Clear"],
  ["05 Jan","Darbin Omer Abubakr","7711110556","Pass","Clear"],
  ["05 Jan","Govand Wali","7505949909","Pass","Clear"],
  ["06 Jan","Halland Hemn","7703332551","Pass","Clear"],
  ["06 Jan","Shaida Faizan Kawiz","7504022095","Pass","Clear"],
  ["06 Jan","Mohammed Soran Hassan","7504328304","Pass","Clear"],
  ["06 Jan","Ahmed Jasim Rashid","7508886900","Pass","Clear"],
  ["06 Jan","Ahmed Saman","7725469940","Pass","Clear"],
  ["07 Jan","Zhiya Najmadin","7510517798","Pass","Clear"],
  ["07 Jan","Gailan Xalid","7501190907","Pass","Clear"],
  ["07 Jan","Halland Hemn","7701452102","Pass","Clear"],
  ["07 Jan","Shaida Faizan Kawiz","7707663606","Pass","Clear"],
  ["07 Jan","Mohammed Soran Hassan","7709355054","Pass","Clear"],
  ["08 Jan","Bawar Fazl Muhammad","7706435454","Pass","Clear"],
  ["08 Jan","Omer Tasim Omer","7714003820","Pass","Clear"],
  ["08 Jan","Hawrin Amir Ahmed","7504523725","Pass","Clear"],
  ["08 Jan","Muhammad Ali Osman","7701596037","Pass","Clear"],
  ["08 Jan","Ronar Rasul","7503728986","Pass","Clear"],
  ["11 Jan","Suzan Sarmad","7508174041","Pass","Clear"],
  ["11 Jan","Awdang Saman","7507038079","Pass","Clear"],
  ["11 Jan","Haryad Shakr Abdulla","7715440544","Pass","Clear"],
  ["11 Jan","Kaiwan Pshtiwan Mustafa","7504550251","Pass","Clear"],
  ["11 Jan","Rayan Jaafar","7517939308","Pass","Clear"],
  ["12 Jan","Safar Mikeail Ismail","7503404143","Pass","Clear"],
  ["12 Jan","Sazgar Hassan","7504497386","Pass","Clear"],
  ["12 Jan","Mustafa Khudhur Ali","7507608432","Pass","Clear"],
  ["12 Jan","Rasul Najmadeen","7502073728","Pass","Clear"],
  ["12 Jan","Safeen Jahfar","7504470098","Pass","Clear"],
  ["13 Jan","Aya Edris","7724100479","Pass","Clear"],
  ["13 Jan","Darbin Omer Abubakr","7508808538","Pass","Clear"],
  ["13 Jan","Govand Wali","7510452977","Pass","Clear"],
  ["13 Jan","Israa Peshkawt","7507985071","Pass","Clear"],
  ["13 Jan","Muhammed Fairq Hadu","7701399036","Pass","Clear"],
  ["14 Jan","Malik Rashid","7701469851","Pass","Clear"],
  ["14 Jan","Neamat Anwar Kareem","7501274585","Pass","Clear"],
  ["14 Jan","Lawin Kosrat Saadi","7504477038","Pass","Clear"],
  ["14 Jan","Salm Khairulla Saeed","7502052606","Pass","Clear"],
  ["14 Jan","Sozhin Karim","7507594216","Pass","Clear"],
  ["15 Jan","Ahmed Saman","7722070581","Pass","Clear"],
  ["15 Jan","Daryan Bakr Kakamand","7721698516","Pass","Clear"],
  ["15 Jan","Dlovan Maraan Ibrahim","7701421402","Pass","Clear"],
  ["15 Jan","Haryad Muhsin","7514946967","Pass","Clear"],
  ["15 Jan","Karwan Wali","7518694861","Pass","Clear"],
  ["16 Jan","Malik Rashid","7506302151","Pass","Clear"],
];

const INIT_MISTAKES = [
  ["20 Jan","Esra Sabah Salim","7507398680","Fail","Selected incorrect level — should be Billing complaints / Blue bill not received. Did not ask CST how many months the bill was not received."],
  ["20 Jan","Muhammed Jalal Majid","7503487312","Fail","Told customer E-Psula can be paid by RT Bank (incorrect info). Also placed customer on hold for 1 minute 40 seconds."],
  ["04 Feb","Ahmed Saman","7501084488","Fail","Did not follow correct procedures — wrong level selected and BNF should not have been sent to the CO."],
  ["06 Feb","Gailan Xalid","7504546046","Fail","Did not follow full greeting script — omitted 'How can I assist you?'. Also selected incorrect case level."],
  ["08 Feb","Azad Brifkani","7504511542","Fail","Incorrect category selection and failed to complete the call transfer."],
  ["08 Feb","Haryad Shakr Abdulla","7506504909","Fail","Provided incorrect information and failed to give a clear explanation."],
  ["12 Feb","Sozhin Karim","7725226579","Fail","Informal communication style and low engagement. Tone did not reflect professional service standards. Unclear delivery."],
  ["15 Feb","Daryan Bakr Kakamand","7507162090","Fail","Did not fully adhere to required greeting and further assistance scripts. Full script compliance required."],
];

const INIT_TARIFF = [
  ["04 Jan","Sarmand Swara Kakakhan","7701376290","Pass","Clear"],
  ["04 Jan","Govand Wali Sleman","7705463236","Pass","Clear"],
  ["04 Jan","Srwd Shwan Hashim","7511432423","Pass","Clear"],
  ["04 Jan","Israa Peshkawt","7504492315","Pass","Clear"],
  ["04 Jan","Ahmed Saman","7725469940","Pass","Clear"],
  ["05 Jan","Lawin Kosrat Saadi","7504403479","Pass","Clear"],
  ["05 Jan","Ahmed Rashad","7507914060","Pass","Clear"],
  ["05 Jan","Karwan Wali Sleman","7727389202","Pass","Clear"],
  ["05 Jan","Muhamad Shakr","7504311710","Pass","Clear"],
  ["05 Jan","Mustafa Khudhur Ali","7719486058","Pass","Clear"],
  ["06 Jan","Safar Mikeail Ismail","7508282297","Pass","Clear"],
  ["06 Jan","Zuher Anwer","7502729161","Pass","Clear"],
  ["06 Jan","Abdulrahim Muhammed","7515201295","Pass","Clear"],
  ["06 Jan","Azad Brifkani","7511505644","Pass","Clear"],
  ["06 Jan","Hawrin Amir Ahmed","7708642250","Pass","Clear"],
  ["07 Jan","Muhammad Ali Osman","7504764552","Pass","Clear"],
  ["07 Jan","Rawaz Muhammed","7504778837","Pass","Clear"],
  ["07 Jan","Harman Hemn Ibrahim","7507461066","Pass","Clear"],
  ["07 Jan","Safar Mikeail Ismail","7503292647","Pass","Clear"],
  ["07 Jan","Muhammad Ali Osman","7504914871","Pass","Clear"],
  ["08 Jan","Muhammad Ali Osman","7705052009","Pass","Clear"],
  ["08 Jan","Ahmed Jasim Rashid","7504233990","Pass","Clear"],
  ["08 Jan","Ahmed Jasim Rashid","7504690046","Pass","Clear"],
  ["08 Jan","Harman Hemn Ibrahim","7504412446","Pass","Clear"],
  ["08 Jan","Safar Mikeail Ismail","7514550223","Pass","Clear"],
  ["09 Jan","Ahmed Jasim Rashid","7504204266","Pass","Clear"],
  ["09 Jan","Muhammed Fairq Hadu","7504072478","Pass","Clear"],
  ["09 Jan","Rayan Jaafar Haydar","7504240203","Pass","Clear"],
  ["09 Jan","Sarmand Swara Kakakhan","7502172768","Pass","Clear"],
  ["09 Jan","Bestoon Hamid Majid","7501314434","Pass","Clear"],
  ["15 Jan","Lara Haval Hassan","7517211086","Pass","Clear"],
  ["15 Jan","Lara Haval Hassan","7504884772","Pass","Clear"],
  ["15 Jan","Mustafa Khudhur Ali","7508420317","Pass","Clear"],
  ["15 Jan","Lana Tahsin Maghdid","7515235771","Pass","Clear"],
  ["15 Jan","Redar Ahmed Karim","7740887955","Pass","Clear"],
  ["16 Jan","Karwan Wali Sleman","7709961997","Pass","Clear"],
  ["16 Jan","Israa Peshkawt","7504458793","Pass","Clear"],
  ["16 Jan","Ronar Rasul","7725281028","Pass","Clear"],
  ["16 Jan","Muhammed Jalal Majid","7504601964","Pass","Clear"],
  ["16 Jan","Bawar Fazl Muhammad","7505020609","Pass","Clear"],
  ["17 Jan","Mohammed Soran Hassan","7502474771","Pass","Clear"],
  ["17 Jan","Mohammed Soran Hassan","7504759174","Pass","Clear"],
  ["17 Jan","Shallaw Abdullrahman","7501991222","Pass","Clear"],
  ["17 Jan","Fremsk Wali Sleman","7705973230","Pass","Clear"],
  ["17 Jan","Shallaw Abdullrahman","7701943448","Pass","Clear"],
  ["18 Jan","Redar Ahmed Karim","7500698167","Pass","Clear"],
  ["18 Jan","Awdang Saman Abdulqahar","7725326323","Pass","Clear"],
  ["18 Jan","Muhamad Shakr","7504641781","Pass","Clear"],
  ["18 Jan","Shallaw Abdullrahman","7719941786","Pass","Clear"],
  ["18 Jan","Neamat Anwar Kareem","7504313375","Pass","Clear"],
  ["19 Jan","Shaida Faizan Kawiz","7503262085","Pass","Clear"],
];

const PAGE_SIZE = 15;
const BLANK = { date:'', agent:'', phone:'', result:'Pass', details:'' };

const OUTLINING = [
  { title:'📞 Test Calls',      rows:[['Description','Simulated QA test calls to evaluate agent performance'],['Testing','Evaluate call recordings and scripts'],['Factors','Call quality, compliance, script accuracy'],['Question','Did the agent follow the standard script?']] },
  { title:'⚠️ Major Mistakes', rows:[['Description','Error tracking & retraining documentation'],['Testing','Log analysis, coaching documentation'],['Factors','Error type, recurrence, agent improvement rate'],['Question','Is there a reduction in repeated mistakes?']] },
  { title:'⏱ Late Answering',  rows:[['Description','Monitor speed of response across all agents'],['Testing','Call center metrics — ASA, response time'],['Factors','Time-to-answer, frequency of late answers'],['Question','Is the ASA below company standard?']] },
  { title:'💰 Tariff Mistakes', rows:[['Description','Training and monitoring of tariff communications'],['Testing','Call audits, quiz scores, feedback records'],['Factors','Accuracy of tariff info, training coverage'],['Question','Are correct tariffs being communicated to customers?']] },
];

const TABS = [
  { key:'outlining', label:'Outlining',      icon:'📋' },
  { key:'testcalls', label:'Test Calls',      icon:'📞', data:'tc'  },
  { key:'late',      label:'Late Answering',  icon:'⏱', data:'late'},
  { key:'mistakes',  label:'Major Mistakes',  icon:'⚠️', data:'mk'  },
  { key:'tariff',    label:'Tariff Mistakes', icon:'💰', data:'tf'  },
];

export default function ActionPlan2026({ user }) {
  const role    = user?.role?.toLowerCase();
  const canEdit = role === 'qa' || role === 'qa_officer' || role === 'teamlead';

  const [activeTab, setActiveTab] = useState('outlining');
  const [search,    setSearch]    = useState('');
  const [page,      setPage]      = useState(1);

  const [tc,   setTc]   = useState(INIT_TC);
  const [late, setLate] = useState(INIT_LATE);
  const [mk,   setMk]   = useState(INIT_MISTAKES);
  const [tf,   setTf]   = useState(INIT_TARIFF);

  const [showModal, setShowModal] = useState(false);
  const [editIdx,   setEditIdx]   = useState(null);
  const [form,      setForm]      = useState(BLANK);

  // which dataset is active
  const dsMap = { testcalls:[tc,setTc], late:[late,setLate], mistakes:[mk,setMk], tariff:[tf,setTf] };
  const [currentData, setCurrentData] = activeTab !== 'outlining' ? dsMap[activeTab] : [[], ()=>{}];

  // filtered + paged
  const filtered = useMemo(()=>{
    const q = search.toLowerCase();
    if (activeTab === 'outlining') return [];
    return currentData.filter(r => !q || r[1].toLowerCase().includes(q) || r[4].toLowerCase().includes(q));
  },[activeTab,currentData,search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData   = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const onTab = k => { setActiveTab(k); setSearch(''); setPage(1); };

  // stats
  const failCount = (d) => d.filter(r=>r[3]==='Fail').length;

  // modal
  const openCreate = () => { setEditIdx(null); setForm(BLANK); setShowModal(true); };
  const openEdit   = (globalIdx) => {
    const r = currentData[globalIdx];
    setEditIdx(globalIdx);
    setForm({ date:r[0], agent:r[1], phone:r[2], result:r[3], details:r[4] });
    setShowModal(true);
  };
  const saveModal = () => {
    const row = [form.date, form.agent, form.phone, form.result, form.details];
    if (editIdx === null) setCurrentData(p=>[...p, row]);
    else setCurrentData(p=>p.map((r,i)=>i===editIdx?row:r));
    setShowModal(false);
  };
  const deleteRow = (gi) => {
    if (!window.confirm('Delete this entry?')) return;
    setCurrentData(p=>p.filter((_,i)=>i!==gi));
  };

  const globalIdx = (li) => currentData.indexOf(pageData[li]);

  const INP = (extra={}) => ({
    style:{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:10, padding:'11px 14px', color:'#FFF', fontSize:13, ...F, outline:'none', ...extra }
  });

  const LBL = { fontSize:11, fontWeight:700, color:'#C8D8EC', marginBottom:7, letterSpacing:'0.8px', display:'block' };

  return (
    <div style={{...F, padding:'28px 32px', background:'#0D0F1E', minHeight:'100vh', color:'#FFF'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:#1E2840;border-radius:4px}
        .ap-tab{transition:all .18s;cursor:pointer;padding:14px 20px;background:none;border:none;color:#4A5A78;font-size:13px;font-weight:600;white-space:nowrap;position:relative;font-family:'Inter',sans-serif;}
        .ap-tab.active{color:#FFF;}
        .ap-tab.active::after{content:'';position:absolute;bottom:0;left:12px;right:12px;height:2px;background:#FF6B35;border-radius:2px 2px 0 0;}
        .ap-tab:hover:not(.active){color:#C8D8EC;}
        .ap-row:hover{background:rgba(255,255,255,0.04)!important}
        .ap-btn:hover{opacity:.85;transform:translateY(-1px)}
        .ap-card{transition:transform .18s}.ap-card:hover{transform:translateY(-2px)}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;}
        input::placeholder,textarea::placeholder{color:#2E3A55}
        select option{background:#131626;color:#FFF}
      `}</style>

      {/* HEADER */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28,flexWrap:'wrap',gap:14}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'3px',color:'#34D399',marginBottom:5}}>ACTION PLAN</div>
          <h1 style={{margin:0,fontSize:26,fontWeight:900,letterSpacing:'-0.5px'}}>
            Action Plan{' '}
            <span style={{background:'linear-gradient(90deg,#34D399,#10B981)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>2026</span>
          </h1>
          <p style={{margin:'5px 0 0',fontSize:13,color:'#4A5A78'}}>Runaki Call Center · QA Monitoring · Jan–Feb 2026</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{padding:'6px 14px',borderRadius:20,background:canEdit?'rgba(255,107,53,0.1)':'rgba(96,165,250,0.1)',border:`1px solid ${canEdit?'rgba(255,107,53,0.25)':'rgba(96,165,250,0.25)'}`,fontSize:11,fontWeight:700,color:canEdit?'#FF6B35':'#60A5FA'}}>
            {canEdit ? '✏️ Edit Access' : '👁 View Only'}
          </div>
          <div style={{padding:'6px 14px',borderRadius:20,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',fontSize:11,color:'#4A5A78'}}>Data as of 19 Feb 2026</div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:22}}>
        {[
          { l:'Test Calls',      v:tc.length,   sub:`${failCount(tc)} flagged`,   c:'#FF6B35' },
          { l:'Late Answering',  v:late.length,  sub:`${failCount(late)} violations`, c:failCount(late)>0?'#F87171':'#4ADE80' },
          { l:'Major Mistakes',  v:failCount(mk),sub:`out of ${mk.length} monitored`, c:'#F87171' },
          { l:'Tariff Mistakes', v:failCount(tf),sub:`out of ${tf.length} monitored`, c:failCount(tf)>0?'#F87171':'#4ADE80' },
        ].map((k,i)=>(
          <div key={i} className="ap-card" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'20px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${k.c},${k.c}44)`,borderRadius:'0 0 16px 16px'}}/>
            <div style={{position:'absolute',top:-15,right:-15,width:60,height:60,borderRadius:'50%',background:k.c,opacity:0.08,filter:'blur(20px)'}}/>
            <div style={{position:'absolute',top:12,right:12,width:6,height:6,borderRadius:'50%',background:k.c,boxShadow:`0 0 8px ${k.c}`}}/>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#4A5A78',marginBottom:8}}>{k.l}</div>
            <div style={{fontSize:32,fontWeight:900,color:k.c,letterSpacing:'-1px',lineHeight:1}}>{k.v}</div>
            <div style={{fontSize:10,color:'#2E3A55',marginTop:6,fontWeight:600}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* MAIN CARD */}
      <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,overflow:'hidden'}}>

        {/* TAB BAR */}
        <div style={{display:'flex',borderBottom:'1px solid rgba(255,255,255,0.07)',overflowX:'auto'}}>
          {TABS.map(t => {
            const ds = t.data ? dsMap[t.key]?.[0] : null;
            const fails = ds ? failCount(ds) : 0;
            const total = ds ? ds.length : 0;
            return (
              <button key={t.key} className={`ap-tab${activeTab===t.key?' active':''}`} onClick={()=>onTab(t.key)}>
                <span style={{marginRight:6}}>{t.icon}</span>{t.label}
                {ds && (
                  <span style={{marginLeft:8,padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:800,
                    background:fails>0?'rgba(248,113,113,0.12)':'rgba(74,222,128,0.10)',
                    color:fails>0?'#F87171':'#4ADE80'}}>
                    {fails>0 ? `${fails} Fail` : `${total} Pass`}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* OUTLINING */}
        {activeTab==='outlining' && (
          <div style={{padding:24,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            {OUTLINING.map((card,ci)=>(
              <div key={ci} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:'20px 22px',position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:'#FF6B35',borderRadius:'0 2px 2px 0'}}/>
                <div style={{fontSize:15,fontWeight:800,marginBottom:16,paddingLeft:12}}>{card.title}</div>
                {card.rows.map(([k,v],ri)=>(
                  <div key={ri} style={{display:'flex',gap:12,marginBottom:10,paddingLeft:12}}>
                    <span style={{fontSize:10,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:'#FF6B35',minWidth:82,paddingTop:1,flexShrink:0}}>{k}</span>
                    <span style={{fontSize:12,color:'#8FA3C4',lineHeight:1.6}}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* DATA TABS */}
        {activeTab !== 'outlining' && (
          <>
            {/* sub-header */}
            <div style={{padding:'14px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
              <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                <div style={{padding:'4px 12px',borderRadius:20,background:'rgba(255,255,255,0.05)',fontSize:11,fontWeight:700,color:'#8FA3C4'}}>{filtered.length} Total</div>
                <div style={{padding:'4px 12px',borderRadius:20,background:'rgba(74,222,128,0.10)',fontSize:11,fontWeight:700,color:'#4ADE80'}}>{filtered.filter(r=>r[3]==='Pass').length} Pass</div>
                {failCount(currentData)>0 && <div style={{padding:'4px 12px',borderRadius:20,background:'rgba(248,113,113,0.12)',fontSize:11,fontWeight:700,color:'#F87171'}}>{failCount(currentData)} Fail</div>}
              </div>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <input placeholder="Search agent name..." value={search}
                  onChange={e=>{setSearch(e.target.value);setPage(1);}}
                  style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'7px 13px',color:'#FFF',fontSize:12,width:210,...F,outline:'none'}}/>
                {canEdit && (
                  <button className="ap-btn" onClick={openCreate}
                    style={{padding:'8px 18px',borderRadius:10,background:'linear-gradient(135deg,#FF6B35,#FF8C5A)',border:'none',color:'#FFF',fontSize:12,fontWeight:700,cursor:'pointer',...F,display:'flex',alignItems:'center',gap:6,transition:'all .15s'}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Entry
                  </button>
                )}
              </div>
            </div>

            {/* TABLE */}
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{borderBottom:'1px solid rgba(255,255,255,0.07)',background:'rgba(255,255,255,0.02)'}}>
                    {['Date','Agent Name','Phone No.','Result','Details', canEdit?'':''].map((h,i)=>(
                      <th key={i} style={{padding:'10px 20px',textAlign:'left',fontSize:9,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#2E3A55',whiteSpace:'nowrap'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageData.length===0 ? (
                    <tr><td colSpan={6} style={{textAlign:'center',padding:'40px',color:'#2E3A55',fontSize:13}}>No results found.</td></tr>
                  ) : pageData.map((r,li) => {
                    const gi  = globalIdx(li);
                    const res = r[3];
                    const det = r[4];
                    return (
                      <tr key={li} className="ap-row" style={{borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background .12s'}}>
                        <td style={{padding:'12px 20px',fontSize:11,fontWeight:700,color:'#4A5A78',whiteSpace:'nowrap',...F}}>{r[0]}</td>
                        <td style={{padding:'12px 20px',fontSize:13,fontWeight:600,color:'#FFF',whiteSpace:'nowrap',...F}}>{r[1]}</td>
                        <td style={{padding:'12px 20px',fontSize:11,color:'#4A5A78',fontFamily:'monospace',whiteSpace:'nowrap'}}>{r[2]}</td>
                        <td style={{padding:'12px 20px'}}>
                          <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:7,background:rbg(res),fontSize:11,fontWeight:700,color:rc(res)}}>
                            <span style={{width:5,height:5,borderRadius:'50%',background:'currentColor',display:'inline-block'}}/>
                            {res}
                          </span>
                        </td>
                        <td style={{padding:'12px 20px',fontSize:12,maxWidth:400,lineHeight:1.6,...F,
                          color: det==='Clear' ? '#2E3A55' : rc(res)}}>
                          {det==='Clear' ? '—' : det}
                        </td>
                        {canEdit && (
                          <td style={{padding:'12px 20px',whiteSpace:'nowrap'}}>
                            <div style={{display:'flex',gap:6}}>
                              <button onClick={()=>openEdit(gi)} style={{padding:'4px 10px',borderRadius:7,background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.2)',color:'#60A5FA',fontSize:11,fontWeight:700,cursor:'pointer',...F}}>Edit</button>
                              <button onClick={()=>deleteRow(gi)} style={{padding:'4px 10px',borderRadius:7,background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.15)',color:'#F87171',fontSize:11,fontWeight:700,cursor:'pointer',...F}}>Del</button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div style={{padding:'13px 24px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
                <span style={{fontSize:11,color:'#2E3A55'}}>Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE,filtered.length)} of {filtered.length}</span>
                <div style={{display:'flex',gap:5}}>
                  <button disabled={page===1} onClick={()=>setPage(p=>p-1)} style={{padding:'5px 12px',borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:page===1?'#2E3A55':'#8FA3C4',fontSize:11,cursor:page===1?'default':'pointer',...F}}>← Prev</button>
                  {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                    <button key={n} onClick={()=>setPage(n)} style={{padding:'5px 10px',borderRadius:8,background:n===page?'#FF6B35':'rgba(255,255,255,0.04)',border:`1px solid ${n===page?'#FF6B35':'rgba(255,255,255,0.08)'}`,color:n===page?'#FFF':'#4A5A78',fontSize:11,fontWeight:n===page?700:400,cursor:'pointer',...F}}>{n}</button>
                  ))}
                  <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)} style={{padding:'5px 12px',borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:page===totalPages?'#2E3A55':'#8FA3C4',fontSize:11,cursor:page===totalPages?'default':'pointer',...F}}>Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-bg" onClick={e=>{if(e.target===e.currentTarget)setShowModal(false)}}>
          <div style={{background:'#131626',border:'1px solid rgba(255,255,255,0.12)',borderRadius:20,padding:28,width:'100%',maxWidth:500,...F}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
              <div>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:'2px',color:'#FF6B35',marginBottom:4,textTransform:'uppercase'}}>
                  {TABS.find(t=>t.key===activeTab)?.label}
                </div>
                <div style={{fontSize:16,fontWeight:800,color:'#FFF'}}>{editIdx===null?'Add New Entry':'Edit Entry'}</div>
              </div>
              <button onClick={()=>setShowModal(false)} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#8FA3C4',fontSize:20,cursor:'pointer',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>×</button>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:16}}>

              {/* Row 1: Date + Agent */}
              <div style={{display:'flex',gap:16,width:'100%'}}>
                <div style={{flex:'0 0 calc(50% - 8px)',width:'calc(50% - 8px)'}}>
                  <label style={LBL}>DATE</label>
                  <input {...INP()} placeholder="e.g. 15 Mar" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/>
                </div>
                <div style={{flex:'0 0 calc(50% - 8px)',width:'calc(50% - 8px)'}}>
                  <label style={LBL}>AGENT NAME</label>
                  <input {...INP()} placeholder="Full name" value={form.agent} onChange={e=>setForm(p=>({...p,agent:e.target.value}))}/>
                </div>
              </div>

              {/* Row 2: Phone + Result */}
              <div style={{display:'flex',gap:16,width:'100%'}}>
                <div style={{flex:'0 0 calc(50% - 8px)',width:'calc(50% - 8px)'}}>
                  <label style={LBL}>PHONE NUMBER</label>
                  <input {...INP()} placeholder="75XXXXXXXX" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
                </div>
                <div style={{flex:'0 0 calc(50% - 8px)',width:'calc(50% - 8px)'}}>
                  <label style={LBL}>RESULT</label>
                  <select {...INP({cursor:'pointer',colorScheme:'dark'})} value={form.result} onChange={e=>setForm(p=>({...p,result:e.target.value}))}>
                    <option value="Pass">✅ Pass</option>
                    <option value="Fail">❌ Fail</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Details */}
              <div style={{width:'100%'}}>
                <label style={LBL}>DETAILS / COMMENT</label>
                <textarea {...INP({resize:'vertical',minHeight:90,lineHeight:1.6})}
                  placeholder={form.result==='Fail'?'Describe the issue clearly...':'e.g. Handled successfully.'}
                  value={form.details} onChange={e=>setForm(p=>({...p,details:e.target.value}))}/>
              </div>

            </div>

            <div style={{display:'flex',gap:10,marginTop:22,justifyContent:'flex-end'}}>
              <button onClick={()=>setShowModal(false)} style={{padding:'9px 20px',borderRadius:10,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'#8FA3C4',fontSize:13,fontWeight:600,cursor:'pointer',...F}}>Cancel</button>
              <button onClick={saveModal} style={{padding:'9px 22px',borderRadius:10,background:'linear-gradient(135deg,#FF6B35,#FF8C5A)',border:'none',color:'#FFF',fontSize:13,fontWeight:700,cursor:'pointer',...F}}>
                {editIdx===null?'Add Entry':'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}