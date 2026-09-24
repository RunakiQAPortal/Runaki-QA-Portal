import React, { useState, useEffect } from 'react';
import axios from 'axios';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };
const ACLR=['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const acol=(n)=>ACLR[(n?.charCodeAt(0)||0)%ACLR.length];
const ini=(n)=>n?n.trim().split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase():'?';

const ROLE_CFG={
  owner:      {label:'Owner',        color:'#FF6B35',bg:'rgba(255,107,53,0.12)',border:'rgba(255,107,53,0.35)'},
  teamlead:   {label:'QA Team Lead', color:'#F472B6',bg:'rgba(244,114,182,0.12)',border:'rgba(244,114,182,0.35)'},
  qa_officer: {label:'QA Officer',   color:'#60A5FA',bg:'rgba(96,165,250,0.12)',border:'rgba(96,165,250,0.35)'},
  trainer:    {label:'Trainer',      color:'#34D399',bg:'rgba(52,211,153,0.12)',border:'rgba(52,211,153,0.35)'},
  supervisor: {label:'Supervisor',   color:'#FBBF24',bg:'rgba(251,191,36,0.12)',border:'rgba(251,191,36,0.35)'},
};

const DEMO_USERS=[
  {id:1,name:'Miran',email:'miran@runaki.com',role:'owner',queue:'All',status:'active',last_active:'2026-03-09T10:30:00Z'},
  {id:2,name:'Kak Masror',email:'masror@runaki.com',role:'qa_manager',queue:'All',status:'active',last_active:'2026-03-09T09:15:00Z'},
  {id:3,name:'Brwa',email:'brwa@runaki.com',role:'qa_officer',queue:'Sorani',status:'active',last_active:'2026-03-09T11:00:00Z'},
  {id:4,name:'Sizar',email:'sizar@runaki.com',role:'qa_officer',queue:'Badini',status:'active',last_active:'2026-03-08T16:45:00Z'},
  {id:5,name:'Mohammed',email:'mohammed@runaki.com',role:'qa_officer',queue:'Arabic',status:'active',last_active:'2026-03-09T08:30:00Z'},
  {id:6,name:'Kak Arsalan',email:'arsalan@runaki.com',role:'supervisor',queue:'All',status:'active',last_active:'2026-03-07T14:20:00Z'},
];

const QUEUE_OPTIONS=['All','Arabic','Sorani','Badini'];

const AdminPanel = () => {
  const [activeTab,setActiveTab]   = useState('users');
  const [users,setUsers]           = useState(DEMO_USERS);
  const [showAddUser,setShowAddUser]= useState(false);
  const [editUser,setEditUser]     = useState(null);
  const [confirm,setConfirm]       = useState(null);
  const [newUser,setNewUser]       = useState({name:'',email:'',role:'qa_officer',queue:'All',password:''});
  const [settings,setSettings]     = useState({
    pass_threshold:60,coaching_sla:72,viva_pass_score:70,
    spot_check_required:5,audit_frequency:'monthly',
    email_notifications:true,coaching_reminders:true,weekly_reports:true,
    company_name:'Runaki Call Center',system_version:'2.0.0',timezone:'Asia/Baghdad'
  });
  const [saved,setSaved]           = useState(false);

  useEffect(()=>{
    fetchUsers();
    const s=document.createElement('style');s.id='ap-s';
    s.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      .ap-in::placeholder{color:#4A5A75!important;}
      .ap-in:focus{border-color:#FF6B35!important;box-shadow:0 0 0 3px rgba(255,107,53,0.15)!important;outline:none;}
      .ap-sel:focus{border-color:#FF6B35!important;outline:none;}
      .ap-sel option{background:#141728;color:#F1F5F9;}
      .ap-tab:hover{background:rgba(255,255,255,0.06)!important;}
      .ap-del:hover{background:rgba(248,113,113,0.2)!important;border-color:rgba(248,113,113,0.4)!important;color:#F87171!important;}
      .ap-edit:hover{background:rgba(255,107,53,0.2)!important;border-color:rgba(255,107,53,0.4)!important;color:#FF8C5A!important;}
      .ap-tog{transition:all 0.2s;}
      ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);} ::-webkit-scrollbar-thumb{background:#252A45;border-radius:10px;} ::-webkit-scrollbar-thumb:hover{background:#FF6B35;}
    `;
    if(!document.getElementById('ap-s'))document.head.appendChild(s);
  },[]);

  const fetchUsers=async()=>{try{const r=await axios.get('http://localhost:8080/api/users');if(r.data.length)setUsers(r.data);}catch(e){}};

  const addUser=async()=>{
    if(!newUser.name||!newUser.email||!newUser.role){alert('Name, email and role are required.');return;}
    const u={...newUser,id:Date.now(),status:'active',last_active:new Date().toISOString()};
    try{await axios.post('http://localhost:8080/api/users',newUser);await fetchUsers();}
    catch(e){setUsers(v=>[...v,u]);}
    setNewUser({name:'',email:'',role:'qa_officer',queue:'All',password:''});setShowAddUser(false);
  };

  const updateUser=async(id,updates)=>{
    setUsers(v=>v.map(u=>u.id===id?{...u,...updates}:u));
    try{await axios.patch(`http://localhost:8080/api/users/${id}`,updates);}catch(e){}
    setEditUser(null);
  };

  const deleteUser=async(id)=>{
    setUsers(v=>v.filter(u=>u.id!==id));
    try{await axios.delete(`http://localhost:8080/api/users/${id}`);}catch(e){}
    setConfirm(null);
  };

  const saveSettings=()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);};

  const inSt ={...F,width:'100%',padding:'9px 13px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'9px',fontSize:'13px',color:'#F1F5F9',outline:'none',transition:'all 0.15s',boxSizing:'border-box'};
  const selSt={...inSt,cursor:'pointer',appearance:'none',backgroundColor:'rgba(255,255,255,0.07)',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23C8D4E8' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 11px center',paddingRight:'30px'};
  const lblSt={display:'block',fontSize:'11px',fontWeight:'700',color:'#8FA3C4',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'7px'};
  const numSt={...inSt,width:'90px',textAlign:'center'};

  const TABS=[['users','User Management'],['settings','System Settings'],['queues','Queue Config'],['about','About']];
  const roleCount=(r)=>users.filter(u=>u.role===r).length;

  return (
    <div style={{...F,minHeight:'100vh',background:'#0D0F1E',color:'#F1F5F9'}}>
      {/* HEADER */}
      <div style={{padding:'0 40px',height:'72px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.09)',background:'rgba(255,255,255,0.025)',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{width:'38px',height:'38px',borderRadius:'11px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(255,107,53,0.45)'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>
          </div>
          <div>
            <div style={{fontSize:'10px',fontWeight:'700',color:'#FF6B35',letterSpacing:'2.5px',textTransform:'uppercase',lineHeight:1}}>Runaki QA</div>
            <div style={{fontSize:'20px',fontWeight:'800',color:'#FFFFFF',letterSpacing:'-0.4px',lineHeight:1.25}}>Admin Panel</div>
          </div>
        </div>
        <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
          <div style={{padding:'6px 14px',background:'rgba(255,107,53,0.12)',border:'1px solid rgba(255,107,53,0.3)',borderRadius:'8px',fontSize:'12px',fontWeight:'800',color:'#FF8C5A'}}>{users.length} Users</div>
          <div style={{padding:'6px 14px',background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.25)',borderRadius:'8px',fontSize:'12px',fontWeight:'800',color:'#4ADE80'}}>{users.filter(u=>u.status==='active').length} Active</div>
        </div>
      </div>

      <div style={{padding:'32px 40px'}}>
        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'12px',marginBottom:'28px'}}>
          {Object.entries(ROLE_CFG).map(([k,v])=>(
            <div key={k} style={{background:'rgba(255,255,255,0.055)',border:'1px solid rgba(255,255,255,0.11)',borderRadius:'16px',padding:'18px 20px',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:'-16px',right:'-16px',width:'70px',height:'70px',borderRadius:'50%',background:`radial-gradient(circle,${v.color}22 0%,transparent 70%)`,pointerEvents:'none'}}/>
              <div style={{fontSize:'10px',fontWeight:'700',color:'#8FA3C4',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'8px'}}>{v.label}</div>
              <div style={{fontSize:'30px',fontWeight:'900',color:'#FFFFFF'}}>{roleCount(k)}</div>
              <div style={{position:'absolute',bottom:0,left:0,right:0,height:'2.5px',background:`linear-gradient(90deg,${v.color} 0%,transparent 65%)`}}/>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{display:'flex',gap:'6px',marginBottom:'24px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'13px',padding:'5px'}}>
          {TABS.map(([k,l])=>(
            <button key={k} className="ap-tab" onClick={()=>setActiveTab(k)} style={{...F,flex:1,padding:'9px',borderRadius:'9px',border:activeTab===k?'1px solid rgba(255,107,53,0.4)':'1px solid transparent',background:activeTab===k?'rgba(255,107,53,0.15)':'transparent',color:activeTab===k?'#FF8C5A':'#8FA3C4',fontSize:'13px',fontWeight:'700',cursor:'pointer',transition:'all 0.15s'}}>{l}</button>
          ))}
        </div>

        {/* USERS TAB */}
        {activeTab==='users'&&(
          <div>
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'14px'}}>
              <button onClick={()=>setShowAddUser(v=>!v)} style={{...F,padding:'9px 20px',background:showAddUser?'rgba(255,107,53,0.15)':'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:showAddUser?'1px solid rgba(255,107,53,0.4)':'none',borderRadius:'10px',color:'white',fontSize:'13px',fontWeight:'700',cursor:'pointer',boxShadow:showAddUser?'none':'0 4px 16px rgba(255,107,53,0.4)',display:'flex',alignItems:'center',gap:'6px'}}>
                {showAddUser?'✕ Cancel':'+ Add User'}
              </button>
            </div>
            {showAddUser&&(
              <div style={{background:'rgba(255,107,53,0.05)',border:'1.5px solid rgba(255,107,53,0.25)',borderRadius:'16px',padding:'24px 26px',marginBottom:'18px'}}>
                <div style={{fontSize:'13px',fontWeight:'800',color:'#FF8C5A',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:'18px',display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#FF6B35',boxShadow:'0 0 8px #FF6B35'}}/>
                  Add New User
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr',gap:'12px',marginBottom:'14px'}}>
                  {[{k:'name',l:'Full Name *',ph:'Full name'},{k:'email',l:'Email *',ph:'email@runaki.com'},{k:'password',l:'Password *',ph:'Password',type:'password'}].map(f=>(
                    <div key={f.k}>
                      <label style={lblSt}>{f.l}</label>
                      <input type={f.type||'text'} className="ap-in" placeholder={f.ph} value={newUser[f.k]} onChange={e=>setNewUser(v=>({...v,[f.k]:e.target.value}))} style={inSt}/>
                    </div>
                  ))}
                  <div>
                    <label style={lblSt}>Role *</label>
                    <select className="ap-sel" value={newUser.role} onChange={e=>setNewUser(v=>({...v,role:e.target.value}))} style={selSt}>
                      {Object.entries(ROLE_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lblSt}>Queue</label>
                    <select className="ap-sel" value={newUser.queue} onChange={e=>setNewUser(v=>({...v,queue:e.target.value}))} style={selSt}>
                      {QUEUE_OPTIONS.map(q=><option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{display:'flex',justifyContent:'flex-end',gap:'10px'}}>
                  <button onClick={()=>setShowAddUser(false)} style={{...F,padding:'9px 20px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'10px',color:'#C8D4E8',fontSize:'13px',fontWeight:'700',cursor:'pointer'}}>Cancel</button>
                  <button onClick={addUser} style={{...F,padding:'9px 24px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',borderRadius:'10px',color:'white',fontSize:'13px',fontWeight:'800',cursor:'pointer',boxShadow:'0 4px 14px rgba(255,107,53,0.35)'}}>Create User</button>
                </div>
              </div>
            )}

            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',overflow:'hidden'}}>
              <div style={{display:'grid',gridTemplateColumns:'2.2fr 1.5fr 120px 100px 1fr 120px',padding:'13px 28px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                {['User','Email','Role','Queue','Last Active',''].map(c=>(
                  <div key={c} style={{fontSize:'11px',fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase',color:'#8FA3C4'}}>{c}</div>
                ))}
              </div>
              {users.map(user=>{
                const rc=ROLE_CFG[user.role]||ROLE_CFG.qa_officer;
                const isEditing=editUser?.id===user.id;
                return(
                  <div key={user.id} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    {isEditing?(
                      <div style={{padding:'14px 28px',background:'rgba(255,107,53,0.04)'}}>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'10px',marginBottom:'12px'}}>
                          {[{k:'name',l:'Name'},{k:'email',l:'Email'}].map(f=>(
                            <div key={f.k}>
                              <label style={lblSt}>{f.l}</label>
                              <input className="ap-in" value={editUser[f.k]||''} onChange={e=>setEditUser(v=>({...v,[f.k]:e.target.value}))} style={inSt}/>
                            </div>
                          ))}
                          <div>
                            <label style={lblSt}>Role</label>
                            <select className="ap-sel" value={editUser.role} onChange={e=>setEditUser(v=>({...v,role:e.target.value}))} style={selSt}>
                              {Object.entries(ROLE_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={lblSt}>Queue</label>
                            <select className="ap-sel" value={editUser.queue} onChange={e=>setEditUser(v=>({...v,queue:e.target.value}))} style={selSt}>
                              {QUEUE_OPTIONS.map(q=><option key={q} value={q}>{q}</option>)}
                            </select>
                          </div>
                        </div>
                        <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
                          <button onClick={()=>setEditUser(null)} style={{...F,padding:'7px 16px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'9px',color:'#C8D4E8',fontSize:'12px',fontWeight:'700',cursor:'pointer'}}>Cancel</button>
                          <button onClick={()=>updateUser(user.id,editUser)} style={{...F,padding:'7px 18px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',borderRadius:'9px',color:'white',fontSize:'12px',fontWeight:'800',cursor:'pointer',boxShadow:'0 3px 10px rgba(255,107,53,0.3)'}}>Save Changes</button>
                        </div>
                      </div>
                    ):(
                      <div style={{display:'grid',gridTemplateColumns:'2.2fr 1.5fr 120px 100px 1fr 120px',padding:'14px 28px',alignItems:'center'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
                          <div style={{width:'36px',height:'36px',borderRadius:'10px',flexShrink:0,background:`linear-gradient(135deg,${acol(user.name)},${acol(user.name)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'800',color:'white'}}>{ini(user.name)}</div>
                          <div>
                            <div style={{fontSize:'14px',fontWeight:'700',color:'#FFFFFF'}}>{user.name}</div>
                            <div style={{display:'flex',alignItems:'center',gap:'4px',marginTop:'2px'}}>
                              <div style={{width:'5px',height:'5px',borderRadius:'50%',background:user.status==='active'?'#4ADE80':'#F87171',boxShadow:`0 0 4px ${user.status==='active'?'#4ADE80':'#F87171'}`}}/>
                              <span style={{fontSize:'11px',color:'#8FA3C4',fontWeight:'500'}}>{user.status==='active'?'Active':'Inactive'}</span>
                            </div>
                          </div>
                        </div>
                        <span style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'500'}}>{user.email}</span>
                        <div style={{display:'inline-flex',padding:'4px 10px',borderRadius:'7px',background:rc.bg,border:`1px solid ${rc.border}`,width:'fit-content'}}>
                          <span style={{fontSize:'12px',fontWeight:'700',color:rc.color}}>{rc.label}</span>
                        </div>
                        <span style={{fontSize:'13px',fontWeight:'600',color:'#C8D8EC'}}>{user.queue}</span>
                        <span style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'500'}}>{user.last_active?new Date(user.last_active).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}):'Never'}</span>
                        <div style={{display:'flex',gap:'7px'}}>
                          <button className="ap-edit" onClick={()=>setEditUser({...user})} style={{...F,padding:'6px 12px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',color:'#8FA3C4',fontSize:'11px',fontWeight:'700',cursor:'pointer',transition:'all 0.15s'}}>Edit</button>
                          <button className="ap-del" onClick={()=>setConfirm(user)} style={{...F,padding:'6px 10px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',color:'#8FA3C4',fontSize:'11px',fontWeight:'700',cursor:'pointer',transition:'all 0.15s'}}>Del</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab==='settings'&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
            {/* QA Thresholds */}
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'26px'}}>
              <div style={{fontSize:'14px',fontWeight:'800',color:'#FFFFFF',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#FF6B35',boxShadow:'0 0 8px #FF6B35'}}/>
                QA Thresholds
              </div>
              {[
                {k:'pass_threshold',l:'Pass Score Threshold (%)',min:0,max:100},
                {k:'coaching_sla',   l:'Coaching SLA (hours)',min:1,max:720},
                {k:'viva_pass_score',l:'VIVA Pass Score (%)',min:0,max:100},
                {k:'spot_check_required',l:'Monthly Spot Checks Required',min:1,max:50},
              ].map(f=>(
                <div key={f.k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:'700',color:'#E8EFF8'}}>{f.l}</div>
                  </div>
                  <input type="number" className="ap-in" min={f.min} max={f.max} value={settings[f.k]} onChange={e=>setSettings(v=>({...v,[f.k]:Number(e.target.value)}))} style={{...numSt,width:'80px'}}/>
                </div>
              ))}
              <div style={{marginTop:'12px',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                <div style={{fontSize:'13px',fontWeight:'700',color:'#E8EFF8'}}>Audit Frequency</div>
                <select className="ap-sel" value={settings.audit_frequency} onChange={e=>setSettings(v=>({...v,audit_frequency:e.target.value}))} style={{...selSt,width:'160px'}}>
                  <option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option>
                </select>
              </div>
            </div>

            {/* Notifications */}
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'26px'}}>
              <div style={{fontSize:'14px',fontWeight:'800',color:'#FFFFFF',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#4ADE80',boxShadow:'0 0 8px #4ADE80'}}/>
                Notifications
              </div>
              {[
                {k:'email_notifications',l:'Email Notifications',d:'Send alerts via email'},
                {k:'coaching_reminders',l:'Coaching Reminders',d:'Remind about pending coaching'},
                {k:'weekly_reports',l:'Weekly Reports',d:'Auto-send weekly summaries'},
              ].map(f=>(
                <div key={f.k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:'700',color:'#E8EFF8'}}>{f.l}</div>
                    <div style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'500',marginTop:'2px'}}>{f.d}</div>
                  </div>
                  <div className="ap-tog" onClick={()=>setSettings(v=>({...v,[f.k]:!v[f.k]}))} style={{width:'44px',height:'24px',borderRadius:'12px',background:settings[f.k]?'#FF6B35':'rgba(255,255,255,0.1)',border:`1px solid ${settings[f.k]?'rgba(255,107,53,0.5)':'rgba(255,255,255,0.15)'}`,cursor:'pointer',position:'relative',transition:'all 0.2s',flexShrink:0,boxShadow:settings[f.k]?'0 0 12px rgba(255,107,53,0.4)':'none'}}>
                    <div style={{position:'absolute',top:'3px',left:settings[f.k]?'22px':'3px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.4)'}}/>
                  </div>
                </div>
              ))}
              {/* General settings */}
              <div style={{marginTop:'16px'}}>
                {[{k:'company_name',l:'Company Name'},{k:'timezone',l:'Timezone'}].map(f=>(
                  <div key={f.k} style={{marginBottom:'14px'}}>
                    <label style={lblSt}>{f.l}</label>
                    <input className="ap-in" value={settings[f.k]} onChange={e=>setSettings(v=>({...v,[f.k]:e.target.value}))} style={inSt}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div style={{gridColumn:'span 2',display:'flex',justifyContent:'flex-end'}}>
              <button onClick={saveSettings} style={{...F,padding:'12px 40px',background:saved?'linear-gradient(135deg,#22C55E,#16A34A)':'linear-gradient(135deg,#FF6B35,#FF9F1C)',border:'none',borderRadius:'12px',color:'white',fontSize:'14px',fontWeight:'800',cursor:'pointer',boxShadow:saved?'0 6px 22px rgba(34,197,94,0.4)':'0 6px 22px rgba(255,107,53,0.4)',transition:'all 0.3s',display:'flex',alignItems:'center',gap:'8px'}}>
                {saved?<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>Saved!</>:<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Save Settings</>}
              </button>
            </div>
          </div>
        )}

        {/* QUEUE CONFIG TAB */}
        {activeTab==='queues'&&(
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
            {[{name:'Arabic',color:'#FF6B35'},{name:'Sorani',color:'#A78BFA'},{name:'Badini',color:'#38BDF8'}].map(q=>{
              const assigned=users.filter(u=>u.queue===q.name||u.queue==='All');
              const officers=users.filter(u=>(u.queue===q.name||u.queue==='All')&&u.role==='qa_officer');
              return(
                <div key={q.name} style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${q.color}33`,borderRadius:'20px',padding:'26px',position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:'-30px',right:'-30px',width:'110px',height:'110px',borderRadius:'50%',background:`radial-gradient(circle,${q.color}18 0%,transparent 70%)`,pointerEvents:'none'}}/>
                  <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
                    <div style={{width:'42px',height:'42px',borderRadius:'12px',background:`${q.color}22`,border:`1.5px solid ${q.color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',fontWeight:'900',color:q.color}}>{q.name[0]}</div>
                    <div>
                      <div style={{fontSize:'16px',fontWeight:'800',color:'#FFFFFF'}}>{q.name}</div>
                      <div style={{fontSize:'12px',color:'#8FA3C4',fontWeight:'600'}}>Queue</div>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'18px'}}>
                    {[['QA Officers',officers.length,q.color],['Total Assigned',assigned.length,'#8FA3C4']].map(([l,v,c])=>(
                      <div key={l} style={{background:'rgba(255,255,255,0.05)',borderRadius:'12px',padding:'14px',textAlign:'center'}}>
                        <div style={{fontSize:'26px',fontWeight:'900',color:c}}>{v}</div>
                        <div style={{fontSize:'11px',color:'#8FA3C4',fontWeight:'600',marginTop:'3px'}}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:'14px'}}>
                    <div style={{fontSize:'11px',fontWeight:'700',color:'#8FA3C4',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px'}}>Officers</div>
                    {officers.length===0?<div style={{fontSize:'13px',color:'#4A5A75',fontWeight:'600'}}>None assigned</div>:officers.map(u=>(
                      <div key={u.id} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                        <div style={{width:'28px',height:'28px',borderRadius:'8px',background:`linear-gradient(135deg,${acol(u.name)},${acol(u.name)}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:'900',color:'white',flexShrink:0}}>{ini(u.name)}</div>
                        <span style={{fontSize:'13px',fontWeight:'600',color:'#C8D8EC'}}>{u.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab==='about'&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'30px',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:'16px'}}>
              <div style={{width:'72px',height:'72px',borderRadius:'20px',background:'linear-gradient(135deg,#FF6B35,#FF9F1C)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 32px rgba(255,107,53,0.5)'}}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
              </div>
              <div>
                <div style={{fontSize:'22px',fontWeight:'900',color:'#FFFFFF',letterSpacing:'-0.5px'}}>Runaki QA System</div>
                <div style={{fontSize:'13px',color:'#8FA3C4',fontWeight:'600',marginTop:'4px'}}>Quality Assurance Management Platform</div>
              </div>
              <div style={{padding:'8px 18px',borderRadius:'10px',background:'rgba(255,107,53,0.12)',border:'1px solid rgba(255,107,53,0.3)',fontSize:'13px',fontWeight:'800',color:'#FF8C5A'}}>v{settings.system_version}</div>
              <div style={{fontSize:'12px',color:'#4A5A75',fontWeight:'500',lineHeight:'1.7',maxWidth:'300px'}}>Built for Runaki Call Center · Powered by High Performance Co. · QA Team Management System</div>
            </div>
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'26px'}}>
              <div style={{fontSize:'13px',fontWeight:'800',color:'#FFFFFF',marginBottom:'18px',display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#A78BFA',boxShadow:'0 0 8px #A78BFA'}}/>
                System Modules
              </div>
              {[
                ['Evaluations','Full QA evaluation lifecycle','#4ADE80'],
                ['Pending Coaching','Coaching management & tracking','#FBBF24'],
                ['Spot Checks','Call spot check auditing','#FF6B35'],
                ['Sessions','Training session management','#38BDF8'],
                ['VIVA','Knowledge assessment system','#A78BFA'],
                ['Reports','Analytics & export center','#F472B6'],
                ['Activity Log','Full audit trail','#34D399'],
              ].map(([m,d,c])=>(
                <div key={m} style={{display:'flex',alignItems:'center',gap:'11px',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',background:c,boxShadow:`0 0 6px ${c}`,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'13px',fontWeight:'700',color:'#E8EFF8'}}>{m}</div>
                    <div style={{fontSize:'11px',color:'#8FA3C4',fontWeight:'500'}}>{d}</div>
                  </div>
                  <div style={{fontSize:'11px',fontWeight:'700',color:'#4ADE80',background:'rgba(74,222,128,0.1)',padding:'3px 8px',borderRadius:'5px',border:'1px solid rgba(74,222,128,0.2)'}}>Active</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {confirm&&(
        <div onClick={()=>setConfirm(null)} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
          <div onClick={e=>e.stopPropagation()} style={{...F,background:'#131626',border:'1px solid rgba(248,113,113,0.3)',borderRadius:'20px',width:'100%',maxWidth:'380px',padding:'30px',boxShadow:'0 40px 80px rgba(0,0,0,0.8)'}}>
            <div style={{width:'52px',height:'52px',borderRadius:'15px',background:'rgba(248,113,113,0.15)',border:'1.5px solid rgba(248,113,113,0.35)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'18px',color:'#F87171'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
            </div>
            <div style={{fontSize:'18px',fontWeight:'800',color:'#FFFFFF',marginBottom:'8px'}}>Delete User?</div>
            <div style={{fontSize:'13px',color:'#8FA3C4',fontWeight:'600',marginBottom:'24px',lineHeight:'1.6'}}>Are you sure you want to delete <strong style={{color:'#FFFFFF'}}>{confirm.name}</strong>? This action cannot be undone.</div>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={()=>setConfirm(null)} style={{...F,flex:1,padding:'12px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'11px',color:'#C8D4E8',fontSize:'13px',fontWeight:'700',cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>deleteUser(confirm.id)} style={{...F,flex:1,padding:'12px',background:'linear-gradient(135deg,#EF4444,#DC2626)',border:'none',borderRadius:'11px',color:'white',fontSize:'13px',fontWeight:'800',cursor:'pointer',boxShadow:'0 4px 14px rgba(239,68,68,0.35)'}}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminPanel;