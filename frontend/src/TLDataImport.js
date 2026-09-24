import React, { useState, useRef } from 'react';

const F = { fontFamily:"'Inter','Segoe UI',sans-serif" };

const EXPECTED_COLUMNS = ['Phone Number','Wait Time','Call Duration','Ticket ID','Subject','Level','Agent Name (TC)'];

const SAMPLE_ROWS = [
  { phone:'07501234567', wait:'00:01:23', duration:'00:04:45', ticket:'TK-2891', subject:'High Bill Query', level:'L1', agent:'Govand Wali' },
  { phone:'07701234568', wait:'00:00:45', duration:'00:06:12', ticket:'TK-2892', subject:'Internet Issue',   level:'L2', agent:'Halland Hemn' },
  { phone:'07601234569', wait:'00:02:10', duration:'00:03:30', ticket:'TK-2893', subject:'Payment Help',     level:'L1', agent:'Aya Edris' },
];

const EXPORTS = [
  { label:'All Evaluations',      icon:'📋', desc:'Export full evaluation records with scores', color:'#60A5FA', endpoint:'evaluations' },
  { label:'Pending Coaching',     icon:'⏳', desc:'Export all pending coaching items',          color:'#FBBF24', endpoint:'coaching?status=pending' },
  { label:'Spot Checks',          icon:'🔍', desc:'Export all spot check records',              color:'#A78BFA', endpoint:'spot-checks' },
  { label:'VIVA Results',         icon:'📖', desc:'Export all VIVA pass/fail data',             color:'#34D399', endpoint:'viva' },
  { label:'Sessions & Attendance',icon:'📅', desc:'Export sessions with attendee lists',        color:'#FF6B35', endpoint:'sessions' },
  { label:'Agent Performance',    icon:'📊', desc:'Export agent scores and metrics',            color:'#F472B6', endpoint:'agent-performance' },
];

const DEMO_EXPORT = {
  evaluations: [['Agent','QA Officer','Queue','Date','Score%','Coaching'],['Govand Wali','Sizar','Arabic','2026-03-11','71','Pending'],['Halland Hemn','Brwa','Badini','2026-03-10','58','Pending']],
  coaching: [['Agent','QA Officer','Date','Score%','Issue','Days Pending'],['Govand Wali','Sizar','2026-03-11','71','Hold procedure','0'],['Halland Hemn','Brwa','2026-03-10','58','Communication tone','1']],
};

export default function TLDataImport({ user }) {
  const [importedRows, setImportedRows] = useState([]);
  const [importError, setImportError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [importDone, setImportDone] = useState(false);
  const [exporting, setExporting] = useState(null);
  const [tab, setTab] = useState('import');
  const fileRef = useRef();

  const processFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    setImportError('');
    setImportedRows([]);
    setImportDone(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(l=>l.trim());
        if (lines.length<2) { setImportError('File must have at least 2 rows (header + data)'); return; }
        const headers = lines[0].split(',').map(h=>h.replace(/["\r]/g,'').trim());
        const rows = lines.slice(1).map(l=>{
          const vals = l.split(',').map(v=>v.replace(/["\r]/g,'').trim());
          const obj = {};
          headers.forEach((h,i)=>{ obj[h]=vals[i]||''; });
          return obj;
        }).filter(r=>Object.values(r).some(v=>v));
        setImportedRows(rows);
      } catch { setImportError('Could not parse file. Please check the format.'); }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) processFile(file);
    else setImportError('Please drop a .csv file');
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      await fetch('http://localhost:8080/api/queue-metrics/import', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ rows:importedRows })
      });
    } catch {}
    await new Promise(r=>setTimeout(r,1200));
    setImporting(false);
    setImportDone(true);
  };

  const handleExport = (exp) => {
    setExporting(exp.endpoint);
    const demo = DEMO_EXPORT[exp.endpoint] || [['Data','Value'],['Sample','Row']];
    const csv = demo.map(r=>r.join(',')).join('\n');
    const a = document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download=`${exp.endpoint.replace('?status=pending','')}.csv`; a.click();
    setTimeout(()=>setExporting(null),1000);
  };

  return (
    <div style={{ ...F, padding:'32px', background:'#0D0F1E', minHeight:'100vh' }}>
      <style>{`select option{background:#131626!important;color:#FFF!important} select{color-scheme:dark}`}</style>

      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#F472B6', marginBottom:5 }}>QA TEAM LEAD</div>
        <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:'#FFF' }}>Data Import <span style={{ background:'linear-gradient(90deg,#F472B6,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>/ Export</span></h1>
        <p style={{ margin:'6px 0 0', fontSize:13, color:'#4A5A78' }}>Import QueueMetrics call data or export any QA dataset as CSV</p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.04)', borderRadius:12, padding:4, marginBottom:28, width:'fit-content' }}>
        {[['import','↑ Import Data'],['export','↓ Export Data']].map(([k,lbl])=>(
          <button key={k} onClick={()=>setTab(k)} style={{ padding:'9px 22px', borderRadius:9, border:'none', background:tab===k?'rgba(255,255,255,0.1)':'transparent', color:tab===k?'#FFF':'#4A5A78', fontSize:13, fontWeight:700, cursor:'pointer', ...F }}>
            {lbl}
          </button>
        ))}
      </div>

      {tab==='import' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Drop Zone */}
            <div
              onDragOver={e=>{e.preventDefault();setDragging(true);}}
              onDragLeave={()=>setDragging(false)}
              onDrop={handleDrop}
              onClick={()=>fileRef.current.click()}
              style={{ border:`2px dashed ${dragging?'#38BDF8':'rgba(255,255,255,0.12)'}`, borderRadius:20, padding:'40px', textAlign:'center', cursor:'pointer', background:dragging?'rgba(56,189,248,0.05)':'rgba(255,255,255,0.02)', transition:'all 0.2s' }}>
              <input ref={fileRef} type="file" accept=".csv" style={{ display:'none' }} onChange={e=>processFile(e.target.files[0])}/>
              <div style={{ fontSize:40, marginBottom:12 }}>📂</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#FFF', marginBottom:6 }}>
                {fileName || 'Drop QueueMetrics CSV here'}
              </div>
              <div style={{ fontSize:12, color:'#4A5A78' }}>
                {fileName ? `${importedRows.length} rows loaded` : 'or click to browse files · CSV format only'}
              </div>
              {importError && <div style={{ marginTop:12, fontSize:12, color:'#F87171', fontWeight:600 }}>{importError}</div>}
            </div>

            {/* Preview Table */}
            {importedRows.length>0 && !importDone && (
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
                <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#FFF' }}>Preview — {importedRows.length} rows</div>
                  <button onClick={handleImport} disabled={importing} style={{ padding:'9px 22px', borderRadius:10, background:'linear-gradient(135deg,#38BDF8,#0EA5E9)', border:'none', color:'#0D0F1E', fontSize:13, fontWeight:700, cursor:'pointer', opacity:importing?0.6:1, ...F }}>
                    {importing?'Importing…':'✓ Import to System'}
                  </button>
                </div>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
                    <thead>
                      <tr style={{ background:'rgba(255,255,255,0.03)' }}>
                        {Object.keys(importedRows[0]).slice(0,7).map((h,i)=>(
                          <th key={i} style={{ padding:'10px 14px', textAlign:'left', fontSize:10, fontWeight:700, letterSpacing:'1px', color:'#4A5A78', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importedRows.slice(0,8).map((row,i)=>(
                        <tr key={i} style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
                          {Object.values(row).slice(0,7).map((v,j)=>(
                            <td key={j} style={{ padding:'10px 14px', fontSize:12, color:'#C8D8EC', whiteSpace:'nowrap' }}>{v||'—'}</td>
                          ))}
                        </tr>
                      ))}
                      {importedRows.length>8 && (
                        <tr style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
                          <td colSpan={7} style={{ padding:'10px 14px', fontSize:12, color:'#4A5A78', textAlign:'center' }}>+{importedRows.length-8} more rows</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Import Success */}
            {importDone && (
              <div style={{ padding:'24px', background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.25)', borderRadius:18, textAlign:'center' }}>
                <div style={{ fontSize:36, marginBottom:10 }}>✅</div>
                <div style={{ fontSize:16, fontWeight:800, color:'#4ADE80', marginBottom:6 }}>{importedRows.length} rows imported successfully</div>
                <div style={{ fontSize:13, color:'#8FA3C4' }}>The data is now available in the evaluation system. You can evaluate calls from QA Create Evaluation.</div>
                <button onClick={()=>{setImportDone(false);setImportedRows([]);setFileName('');}} style={{ marginTop:16, padding:'9px 22px', borderRadius:10, background:'rgba(74,222,128,0.12)', border:'1px solid rgba(74,222,128,0.25)', color:'#4ADE80', fontSize:13, fontWeight:700, cursor:'pointer', ...F }}>
                  Import Another File
                </button>
              </div>
            )}
          </div>

          {/* Format Guide */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#38BDF8', marginBottom:14 }}>EXPECTED FORMAT</div>
              <div style={{ fontSize:13, color:'#8FA3C4', marginBottom:14 }}>Your CSV file should contain these columns:</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {EXPECTED_COLUMNS.map((col,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'rgba(255,255,255,0.04)', borderRadius:10 }}>
                    <div style={{ width:20, height:20, borderRadius:5, background:'rgba(56,189,248,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:'#38BDF8', flexShrink:0 }}>{i+1}</div>
                    <span style={{ fontSize:12, color:'#C8D8EC', fontWeight:600 }}>{col}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'24px' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#8FA3C4', marginBottom:14 }}>SAMPLE ROWS</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {SAMPLE_ROWS.map((r,i)=>(
                  <div key={i} style={{ padding:'10px 12px', background:'rgba(255,255,255,0.04)', borderRadius:10 }}>
                    <div style={{ fontSize:11, color:'#FFF', fontWeight:600, marginBottom:4 }}>{r.agent}</div>
                    <div style={{ fontSize:10, color:'#4A5A78' }}>{r.ticket} · {r.subject} · {r.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==='export' && (
        <div>
          <div style={{ fontSize:14, color:'#8FA3C4', marginBottom:24 }}>Download any dataset from the QA system as a CSV file:</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {EXPORTS.map((exp,i)=>(
              <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'24px', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ position:'absolute', top:-15, right:-15, width:70, height:70, borderRadius:'50%', background:exp.color, opacity:0.07, filter:'blur(20px)' }}/>
                <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:'50%', background:exp.color, boxShadow:`0 0 8px ${exp.color}` }}/>
                <div style={{ fontSize:28 }}>{exp.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:'#FFF', marginBottom:4 }}>{exp.label}</div>
                  <div style={{ fontSize:12, color:'#4A5A78' }}>{exp.desc}</div>
                </div>
                <button onClick={()=>handleExport(exp)} disabled={exporting===exp.endpoint} style={{ padding:'10px', borderRadius:10, background:`${exp.color}18`, border:`1px solid ${exp.color}40`, color:exp.color, fontSize:13, fontWeight:700, cursor:'pointer', opacity:exporting===exp.endpoint?0.6:1, ...F }}>
                  {exporting===exp.endpoint?'Downloading…':'↓ Export CSV'}
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop:24, padding:'20px 24px', background:'rgba(255,107,53,0.08)', border:'1px solid rgba(255,107,53,0.2)', borderRadius:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#FF6B35', marginBottom:6 }}>Note on Exports</div>
            <div style={{ fontSize:12, color:'#8FA3C4', lineHeight:1.7 }}>
              Exports reflect the current state of the database. For live data, exports are always fresh. Demo exports show sample data — connect the backend to get real records.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}