import React, { useState, useEffect } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };

const DEMO_TIPS = [
  { id:1, content:"Always confirm the customer's name and account before diving into the issue. It shows professionalism and saves time.", date:'2026-03-11', active:true },
  { id:2, content:"When a customer is angry, lower your voice — don't match their energy. Calm is contagious.", date:'2026-03-10', active:false },
  { id:3, content:"Use the hold procedure correctly every time — it only takes 5 seconds and protects your score.", date:'2026-03-09', active:false },
  { id:4, content:"If you don't know the answer, say 'Let me check that for you' — never guess on a customer call.", date:'2026-03-08', active:false },
  { id:5, content:"End every call with a clear summary: what was resolved, what comes next, and a warm closing.", date:'2026-03-07', active:false },
];

export default function TLTipOfDay({ user }) {
  const [tips, setTips] = useState(DEMO_TIPS);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/tips').then(r=>r.json()).then(d=>{ if(Array.isArray(d)&&d.length>0) setTips(d); }).catch(()=>{});
  }, []);

  const activeTip = tips.find(t=>t.active)||tips[0];

  const publishTip = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    const newTip = { id:Date.now(), content:draft.trim(), date:new Date().toISOString().split('T')[0], active:true };
    try { await fetch('http://localhost:8080/api/tips', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newTip) }); } catch {}
    setTips(t=>[newTip, ...t.map(x=>({...x,active:false}))]);
    setDraft('');
    setSaving(false);
    setSaved(true);
    setTimeout(()=>setSaved(false),3000);
  };

  const setActive = async (id) => {
    try { await fetch(`http://localhost:8080/api/tips/${id}/activate`, { method:'PATCH' }); } catch {}
    setTips(t=>t.map(x=>({...x,active:x.id===id})));
  };

  const saveEdit = (id) => {
    setTips(t=>t.map(x=>x.id===id?{...x,content:editText}:x));
    setEditId(null);
  };

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#F472B6', marginBottom:5 }}>QA TEAM LEAD</div>
        <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:'#FFF' }}>Tip of <span style={{ background:'linear-gradient(90deg,#F472B6,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>the Day</span></h1>
        <p style={{ margin:'6px 0 0', fontSize:13, color:'#4A5A78' }}>Write a tip here — it appears on every agent's dashboard automatically</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:24 }}>
        {/* Left: Compose + History */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* Compose */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'28px' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#F472B6', marginBottom:16 }}>WRITE NEW TIP</div>
            <textarea
              value={draft}
              onChange={e=>setDraft(e.target.value)}
              placeholder="Write today's tip for your agents... Be specific, practical, and clear."
              rows={5}
              style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, color:'#FFF', padding:'16px', fontSize:14, resize:'vertical', outline:'none', boxSizing:'border-box', lineHeight:1.7, ...F }}
            />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14 }}>
              <span style={{ fontSize:12, color:'#4A5A78' }}>{draft.length} characters</span>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                {saved && <span style={{ fontSize:12, color:'#4ADE80', fontWeight:600 }}>✓ Published to all agents!</span>}
                <button onClick={()=>setDraft('')} disabled={!draft} style={{ padding:'10px 18px', borderRadius:12, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#8FA3C4', fontSize:13, fontWeight:600, cursor:'pointer', opacity:!draft?0.4:1, ...F }}>Clear</button>
                <button onClick={publishTip} disabled={saving||!draft.trim()} style={{ padding:'10px 24px', borderRadius:12, background:'linear-gradient(135deg,#F472B6,#A78BFA)', border:'none', color:'#FFF', fontSize:13, fontWeight:700, cursor:'pointer', opacity:saving||!draft.trim()?0.5:1, ...F }}>
                  {saving?'Publishing…':'🚀 Publish Tip'}
                </button>
              </div>
            </div>
          </div>

          {/* History */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#8FA3C4', marginBottom:3 }}>TIP HISTORY</div>
              <div style={{ fontSize:15, fontWeight:800, color:'#FFF' }}>Previous Tips</div>
            </div>
            {tips.map((t,i)=>(
              <div key={t.id} style={{ padding:'18px 24px', borderBottom:i<tips.length-1?'1px solid rgba(255,255,255,0.04)':'none', background:t.active?'rgba(244,114,182,0.05)':'transparent' }}>
                {editId===t.id ? (
                  <div>
                    <textarea value={editText} onChange={e=>setEditText(e.target.value)} rows={3} style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#FFF', padding:'10px 12px', fontSize:13, resize:'none', outline:'none', boxSizing:'border-box', ...F }}/>
                    <div style={{ display:'flex', gap:8, marginTop:10 }}>
                      <button onClick={()=>saveEdit(t.id)} style={{ padding:'7px 16px', borderRadius:8, background:'#4ADE80', border:'none', color:'#0D0F1E', fontSize:12, fontWeight:700, cursor:'pointer', ...F }}>Save</button>
                      <button onClick={()=>setEditId(null)} style={{ padding:'7px 16px', borderRadius:8, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#8FA3C4', fontSize:12, cursor:'pointer', ...F }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:8 }}>
                      <p style={{ margin:0, fontSize:13, color:t.active?'#FFF':'#8FA3C4', lineHeight:1.7, flex:1 }}>"{t.content}"</p>
                      {t.active && <span style={{ padding:'3px 10px', borderRadius:20, background:'rgba(244,114,182,0.15)', fontSize:11, fontWeight:700, color:'#F472B6', flexShrink:0 }}>Active</span>}
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:11, color:'#4A5A78' }}>{t.date}</span>
                      <div style={{ display:'flex', gap:8 }}>
                        {!t.active && <button onClick={()=>setActive(t.id)} style={{ padding:'5px 12px', borderRadius:8, background:'rgba(244,114,182,0.1)', border:'1px solid rgba(244,114,182,0.25)', color:'#F472B6', fontSize:11, fontWeight:600, cursor:'pointer', ...F }}>Set Active</button>}
                        <button onClick={()=>{setEditId(t.id);setEditText(t.content);}} style={{ padding:'5px 12px', borderRadius:8, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#8FA3C4', fontSize:11, cursor:'pointer', ...F }}>Edit</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Preview */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#F472B6', marginBottom:16 }}>AGENT PREVIEW</div>
            <div style={{ fontSize:12, color:'#4A5A78', marginBottom:14 }}>This is how agents see your tip on their dashboard:</div>

            {/* Agent dashboard preview */}
            <div style={{ background:'linear-gradient(135deg,rgba(244,114,182,0.10),rgba(167,139,250,0.07))', border:'1px solid rgba(244,114,182,0.2)', borderRadius:18, padding:'20px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-15, right:-15, width:80, height:80, borderRadius:'50%', background:'#F472B6', opacity:0.08, filter:'blur(20px)' }}/>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:'rgba(244,114,182,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2"><path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.2 4.16-3 5.2V17H9v-2.8A6 6 0 016 9a6 6 0 016-6z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#F472B6' }}>TIP OF THE DAY</div>
                  <div style={{ fontSize:11, color:'#4A5A78', marginTop:1 }}>From your Team Lead</div>
                </div>
              </div>
              <p style={{ margin:0, fontSize:13, color:'#C8D8EC', lineHeight:1.75, fontStyle:'italic' }}>
                "{draft.trim() || activeTip?.content || 'Your tip will appear here...'}"
              </p>
              <div style={{ marginTop:12, fontSize:11, color:'#F472B6', fontWeight:600 }}>— {user?.name||'Miran'} · {new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#8FA3C4', marginBottom:16 }}>STATS</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { label:'Tips Published',    value:tips.length,            color:'#F472B6' },
                { label:'Agents Seeing It',  value:'103',                  color:'#34D399' },
                { label:'Active Since',      value:activeTip?.date||'—',  color:'#60A5FA' },
              ].map((s,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', background:'rgba(255,255,255,0.04)', borderRadius:12 }}>
                  <span style={{ fontSize:12, color:'#8FA3C4' }}>{s.label}</span>
                  <span style={{ fontSize:15, fontWeight:800, color:s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding:'16px 20px', background:'rgba(255,107,53,0.08)', border:'1px solid rgba(255,107,53,0.2)', borderRadius:16, fontSize:12, color:'#FF8C5A', lineHeight:1.7 }}>
            <strong>How it works:</strong> When you publish a tip, it immediately becomes the active tip and shows up as a card on every agent's dashboard. Only one tip is active at a time.
          </div>
        </div>
      </div>
    </div>
  );
}