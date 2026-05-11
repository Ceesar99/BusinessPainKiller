import { useEffect, useRef, useState } from "react";

const SUPABASE_URL = "https://rbzteggbpscchnvvllum.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJienRlZ2dicHNjY2hudnZsbHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzU3NDMsImV4cCI6MjA5MzkxMTc0M30.frzwTOlwq64-BUcWM4k5f-uu9NHW4HU3anvuHnm1jB4";

const apiFetch = async (path, opts = {}) => {
  const { headers: extraHeaders, ...restOpts } = opts;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    mode: "cors",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
      ...(extraHeaders || {}),
    },
    ...restOpts,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(msg);
  }
  const t = await res.text();
  return t ? JSON.parse(t) : null;
};

const ALL_INDUSTRIES = [
  "Dental / Medical Practice","Plumbing","HVAC","Real Estate",
  "Salon / Beauty","Fitness / Gym","Legal Services","Accounting / Finance",
  "Restaurant / Food & Beverage","Logistics / Delivery","Retail",
  "Cleaning Services","Construction / Trades","Auto Repair",
  "Childcare / Education","Other",
];
const ALL_PAINS = [
  "No-shows & missed appointments","Manual invoicing & chasing payments",
  "Inventory & supply chain issues","Scattered customer communications",
  "Staff scheduling & time tracking","Reporting & business insights",
  "Lead follow-up & sales pipeline","Other (describe below)",
];

const fd = iso => !iso ? "—" : new Date(iso).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const ft = iso => !iso ? "" : new Date(iso).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});

const doExport = rows => {
  const esc = s => `"${(s||"").replace(/"/g,"''")}"`;
  const h = ["Date","Business","Industry","Email","Pain Category","Description","Status"];
  const body = rows.map(r => [fd(r.created_at),esc(r.business_name),esc(r.industry),r.email||"",esc(r.pain_category),esc(r.pain_description),r.status||"Pending"].join(","));
  const blob = new Blob([[h.join(","),...body].join("\n")], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `bpk-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
};

/* colour tokens */
const K = {
  red:"#C8102E", green:"#059669", amber:"#D97706", blue:"#2563EB",
  text:"#111827", text2:"#374151", gray:"#6B7280", gray2:"#9CA3AF",
  border:"#E5E7EB", bg:"#F4F5F7", card:"#FFFFFF",
};

const stStyle = s => ({
  Pending:   {color:"#D97706", bg:"#FFFBEB",              border:"#FCD34D"},
  Validated: {color:"#059669", bg:"#ECFDF5",              border:"#A7F3D0"},
  Rejected:  {color:"#C8102E", bg:"rgba(200,16,46,0.07)", border:"rgba(200,16,46,0.2)"},
}[s] || {color:"#D97706", bg:"#FFFBEB", border:"#FCD34D"});

/* ── tiny SVG icons ── */
const IMenu     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IGrid     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IUsers    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ICheck    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IChart    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IClock    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ISearch   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IRefresh  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const IDL       = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IEye      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IX        = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ITrophy   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H17v7a5 5 0 0 1-10 0V4z"/><path d="M7 4H4v3a3 3 0 0 0 3 3"/><path d="M17 4h3v3a3 3 0 0 1-3 3"/></svg>;
const IZap      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IInbox    = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;

/* ── Detail Modal ── */
function Modal({ row, onClose, onStatus }) {
  if (!row) return null;
  const st = row.status || "Pending";
  const sty = stStyle(st);
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(3px)"}}
    >
      <div style={{background:"#fff",border:`1px solid ${K.border}`,borderRadius:16,padding:28,width:"100%",maxWidth:520,position:"relative",boxShadow:"0 20px 60px rgba(0,0,0,0.12)"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"#F3F4F6",border:`1px solid ${K.border}`,borderRadius:6,color:K.gray,padding:"4px 8px",cursor:"pointer",fontWeight:700,fontSize:12}}><IX/></button>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1,color:K.text,marginBottom:18}}>Submission Detail</div>
        {[["Business",row.business_name],["Industry",row.industry],["Email",row.email],["Pain Category",row.pain_category]].map(([l,v])=>(
          <div key={l} style={{marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:K.gray2,marginBottom:3}}>{l}</div>
            <div style={{fontSize:14,color:K.text,fontWeight:500}}>{v||"—"}</div>
          </div>
        ))}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:K.gray2,marginBottom:3}}>Description</div>
          <div style={{fontSize:13,color:K.text2,lineHeight:1.65,background:"#F9FAFB",border:`1px solid ${K.border}`,borderRadius:8,padding:12}}>{row.pain_description||"No description."}</div>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:K.gray2,marginBottom:3}}>Submitted</div>
          <div style={{fontSize:14,color:K.text,fontWeight:500}}>{fd(row.created_at)} at {ft(row.created_at)}</div>
        </div>
        <div style={{marginBottom:4}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:K.gray2,marginBottom:6}}>Status</div>
          <span style={{display:"inline-flex",padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:700,color:sty.color,background:sty.bg,border:`1px solid ${sty.border}`}}>{st}</span>
        </div>
        <div style={{display:"flex",gap:8,marginTop:18}}>
          {[["Pending","Set Pending"],["Validated","✓ Validate"],["Rejected","✕ Reject"]].map(([v,label])=>{
            const s = stStyle(v);
            return (
              <button key={v} onClick={()=>onStatus(row.id,v)} style={{flex:1,padding:"10px 0",borderRadius:8,fontFamily:"Manrope,sans-serif",fontWeight:800,fontSize:12,cursor:"pointer",border:`1px solid ${s.border}`,background:s.bg,color:s.color}}>
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function Dashboard() {
  const [rows,      setRows]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [tab,       setTab]       = useState("overview");
  const [search,    setSearch]    = useState("");
  const [fInd,      setFInd]      = useState("all");
  const [fSt,       setFSt]       = useState("all");
  const [fPain,     setFPain]     = useState("all");
  const [selected,  setSelected]  = useState(null);
  const [refreshed, setRefreshed] = useState(null);

  /* ── sidebar auto-close after 10 s ── */
  const [sbOpen, setSbOpen] = useState(true);
  const timer = useRef(null);

  const resetTimer = () => {
    setSbOpen(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSbOpen(false), 1000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timer.current);
  }, []);

  /* ── data ── */
  const load = async () => {
    setLoading(true); setError("");
    try {
      const d = await apiFetch("waitlist_submissions?select=*&order=created_at.desc");
      setRows(d || []);
      setRefreshed(new Date());
    } catch(e) {
      // If fetch is blocked by sandbox, show helpful message
      const msg = e.message || "Unknown error";
      if (msg.includes("fetch") || msg.includes("Failed") || msg.includes("network")) {
        setError("⚠️ Network blocked in preview. Data will load when deployed. Showing demo data.");
        // Load demo data so the UI is usable
        setRows([
          {id:"demo-1",created_at:new Date().toISOString(),business_name:"Demo Dental Clinic",industry:"Dental / Medical Practice",email:"demo@dental.com",pain_category:"No-shows & missed appointments",pain_description:"We lose about $8,000 a month from no-shows with no automated recovery.",status:"Pending"},
          {id:"demo-2",created_at:new Date(Date.now()-86400000).toISOString(),business_name:"City Plumbing Co",industry:"Plumbing",email:"info@cityplumbing.com",pain_category:"Manual invoicing & chasing payments",pain_description:"Spend 3 hours every day chasing invoices manually.",status:"Validated"},
          {id:"demo-3",created_at:new Date(Date.now()-172800000).toISOString(),business_name:"Verde Salon Group",industry:"Salon / Beauty",email:"verde@salon.com",pain_category:"Staff scheduling & time tracking",pain_description:"Staff scheduling is a nightmare across 3 locations.",status:"Pending"},
          {id:"demo-4",created_at:new Date(Date.now()-259200000).toISOString(),business_name:"BluePeak Fitness",industry:"Fitness / Gym",email:"ops@bluepeak.com",pain_category:"No-shows & missed appointments",pain_description:"PT session no-shows cost us $4k/month.",status:"Validated"},
          {id:"demo-5",created_at:new Date(Date.now()-345600000).toISOString(),business_name:"Apex Real Estate",industry:"Real Estate",email:"admin@apexre.com",pain_category:"Lead follow-up & sales pipeline",pain_description:"Leads fall through the cracks constantly.",status:"Rejected"},
        ]);
      } else {
        setError(msg);
      }
    }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    setRows(p => p.map(r => r.id===id ? {...r,status} : r));
    if (selected?.id === id) setSelected(p => ({...p, status}));
    try { await apiFetch(`waitlist_submissions?id=eq.${id}`, {method:"PATCH", body:JSON.stringify({status})}); }
    catch(e) { console.error(e); }
  };

  /* ── derived stats ── */
  const total     = rows.length;
  const validated = rows.filter(r => r.status==="Validated").length;
  const pending   = rows.filter(r => !r.status||r.status==="Pending").length;
  const thisWeek  = rows.filter(r => r.created_at && (Date.now()-new Date(r.created_at))<604800000).length;

  /* analysis counts — every known option always shown */
  const indCounts = Object.fromEntries(ALL_INDUSTRIES.map(i=>[i,0]));
  rows.forEach(r => { if(r.industry) indCounts[r.industry] = (indCounts[r.industry]||0)+1; });
  const indData = Object.entries(indCounts).sort((a,b)=>b[1]-a[1]);
  const maxInd  = Math.max(...Object.values(indCounts), 1);

  const painCounts = Object.fromEntries(ALL_PAINS.map(p=>[p,0]));
  rows.forEach(r => { if(r.pain_category) painCounts[r.pain_category] = (painCounts[r.pain_category]||0)+1; });
  const painData = Object.entries(painCounts).sort((a,b)=>b[1]-a[1]);
  const maxPain  = Math.max(...Object.values(painCounts), 1);

  const topInd  = indData[0];
  const topPain = painData[0];

  /* filtered table rows */
  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    const ms = !q || ["business_name","email","pain_description","industry"].some(k=>(r[k]||"").toLowerCase().includes(q));
    const mi  = fInd==="all"  || r.industry===fInd;
    const mst = fSt==="all"   || (r.status||"Pending")===fSt;
    const mp  = fPain==="all" || r.pain_category===fPain;
    if (tab==="validated") return ms&&mi&&mst&&mp && r.status==="Validated";
    if (tab==="pending")   return ms&&mi&&mst&&mp && (!r.status||r.status==="Pending");
    return ms&&mi&&mst&&mp;
  });

  const showTable    = ["overview","all","pending","validated"].includes(tab);
  const showAnalysis = tab==="analysis";

  const TABS = [
    {id:"overview",  label:"Overview",        Icon:IGrid,  badge:null},
    {id:"all",       label:"All Submissions",  Icon:IUsers, badge:{n:total,    c:K.red}},
    {id:"pending",   label:"Pending",          Icon:IClock, badge:{n:pending,  c:K.amber}},
    {id:"validated", label:"Validated",        Icon:ICheck, badge:{n:validated,c:K.green}},
    {id:"analysis",  label:"Analysis",         Icon:IChart, badge:null},
  ];

  const STATS = [
    {label:"Total Submissions", Icon:IUsers, val:total,     accent:K.red,   sub:"All time"},
    {label:"This Week",         Icon:IClock, val:thisWeek,  accent:K.blue,  sub:"Last 7 days"},
    {label:"Validated",         Icon:ICheck, val:validated, accent:K.green, sub:"Greenlit for build"},
    {label:"Pending",           Icon:IClock, val:pending,   accent:K.amber, sub:"Awaiting review"},
  ];

  const tabTitles = {overview:"Dashboard Overview",all:"All Submissions",pending:"Pending Review",validated:"Validated",analysis:"Analysis"};

  /* shared style helpers */
  const card = {background:K.card,border:`1px solid ${K.border}`,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"};
  const fnt  = "Manrope,sans-serif";
  const bebas= "'Bebas Neue',sans-serif";

  return (
    <div style={{display:"flex",minHeight:"100vh",background:K.bg,fontFamily:fnt,color:K.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800;900&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:#F4F5F7;} @keyframes spin{to{transform:rotate(360deg);}}`}</style>

      {selected && <Modal row={selected} onClose={()=>setSelected(null)} onStatus={(id,st)=>updateStatus(id,st)} />}

      {/* ════════════ SIDEBAR ════════════
          - opens on load (sbOpen=true)
          - auto-closes after 10 s (timer)
          - hamburger button in topbar resets timer & reopens
          - clicking any nav item also resets timer
      */}
      <aside style={{
        width:          sbOpen ? 224 : 0,
        minWidth:       sbOpen ? 224 : 0,
        overflow:       "hidden",
        transition:     "width 0.35s ease, min-width 0.35s ease",
        background:     K.card,
        borderRight:    sbOpen ? `1px solid ${K.border}` : "none",
        display:        "flex",
        flexDirection:  "column",
        flexShrink:     0,
        position:       "sticky",
        top:            0,
        height:         "100vh",
        boxShadow:      sbOpen ? "1px 0 4px rgba(0,0,0,0.05)" : "none",
        pointerEvents:  sbOpen ? "auto" : "none",
        visibility:     sbOpen ? "visible" : "hidden",
      }}>
        {/* brand */}
        <div style={{padding:"20px 18px 16px",borderBottom:`1px solid ${K.border}`,whiteSpace:"nowrap"}}>
          <div style={{fontFamily:fnt,fontWeight:900,fontSize:15,color:K.text}}>
            Business<span style={{color:K.red}}>PainKiller</span>
          </div>
          <div style={{fontSize:10,color:K.gray2,marginTop:2,fontWeight:500}}>Admin Dashboard</div>
        </div>

        {/* nav items */}
        <nav style={{padding:"10px 10px",flex:1,overflowY:"auto",overflowX:"hidden"}}>
          <div style={{fontSize:9,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:K.gray2,padding:"8px 8px 5px",whiteSpace:"nowrap"}}>Navigation</div>
          {TABS.map(({id,label,Icon,badge}) => {
            const active = tab===id;
            return (
              <div
                key={id}
                onClick={() => { setTab(id); resetTimer(); }}
                style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:8,fontSize:13,fontWeight:active?700:600,color:active?K.red:K.gray,cursor:"pointer",marginBottom:1,border:active?`1px solid rgba(200,16,46,0.22)`:"1px solid transparent",background:active?"rgba(200,16,46,0.08)":"transparent",transition:"all 0.15s",userSelect:"none",whiteSpace:"nowrap"}}
              >
                <Icon/>
                <span style={{flex:1}}>{label}</span>
                {badge && (
                  <span style={{fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:20,background:`${badge.c}20`,color:badge.c,border:`1px solid ${badge.c}50`}}>
                    {badge.n}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* footer */}
        <div style={{padding:"14px 18px",borderTop:`1px solid ${K.border}`,fontSize:11,color:K.gray2,whiteSpace:"nowrap"}}>
          {refreshed && <div style={{marginBottom:2}}>Updated {ft(refreshed.toISOString())}</div>}
          <div>BPK © 2026</div>
        </div>
      </aside>

      {/* ════════════ MAIN ════════════ */}
      <main style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>

        {/* TOPBAR */}
        <div style={{height:58,padding:"0 24px",borderBottom:`1px solid ${K.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:K.card,position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>

            {/* hamburger — tap to reopen sidebar & restart 10s timer */}
            <button
              onClick={() => {
                if (sbOpen) {
                  // close immediately
                  clearTimeout(timer.current);
                  setSbOpen(false);
                } else {
                  // open and start 1s auto-close timer
                  resetTimer();
                }
              }}
              title={sbOpen ? "Close navigation" : "Open navigation"}
              style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",background:sbOpen?"rgba(200,16,46,0.07)":"#F3F4F6",border:`1px solid ${sbOpen?"rgba(200,16,46,0.3)":K.border}`,borderRadius:8,cursor:"pointer",color:sbOpen?K.red:K.text2,flexShrink:0,transition:"all 0.2s"}}
            >
              <IMenu/>
            </button>

            {/* live dot */}
            <div style={{width:7,height:7,background:K.green,borderRadius:"50%",boxShadow:`0 0 0 3px ${K.green}30`,flexShrink:0}}/>

            <span style={{fontFamily:bebas,fontSize:22,letterSpacing:1,color:K.text}}>
              {tabTitles[tab]}
            </span>
          </div>

          <div style={{display:"flex",gap:8}}>
            <button onClick={load} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:7,fontFamily:fnt,fontWeight:700,fontSize:12,cursor:"pointer",border:`1px solid ${K.border}`,background:K.card,color:K.text2}}>
              <IRefresh/> Refresh
            </button>
            <button onClick={()=>doExport(showTable?filtered:rows)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:7,fontFamily:fnt,fontWeight:700,fontSize:12,cursor:"pointer",border:"none",background:K.red,color:"#fff"}}>
              <IDL/> Export CSV
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{padding:"22px 28px",flex:1,overflowY:"auto"}}>

          {/* ── STAT CARDS ── */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
            {STATS.map(({label,Icon,val,accent,sub}) => (
              <div key={label} style={{...card,padding:"18px 20px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${accent},${accent}99)`}}/>
                <div style={{fontSize:10,fontWeight:800,letterSpacing:0.8,textTransform:"uppercase",color:K.gray,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
                  <Icon/>{label}
                </div>
                <div style={{fontFamily:bebas,fontSize:48,lineHeight:1,letterSpacing:1,color:accent}}>
                  {loading?"…":val}
                </div>
                <div style={{fontSize:11,color:K.gray2,marginTop:5,fontWeight:500}}>{sub}</div>
              </div>
            ))}
          </div>

          {/* ── ANALYSIS TAB ── */}
          {showAnalysis && (
            <>
              {/* winner cards */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
                {[
                  {Ic:ITrophy,ibg:"rgba(200,16,46,0.1)",ic:K.red,  tag:"🏆 Top Industry to Build For",val:topInd?.[0]||"—", cnt:`${topInd?.[1]||0} submissions`},
                  {Ic:IZap,   ibg:"rgba(37,99,235,0.1)", ic:K.blue, tag:"⚡ Top Pain to Solve First",  val:topPain?.[0]||"—",cnt:`${topPain?.[1]||0} submissions`},
                ].map(w => (
                  <div key={w.tag} style={{...card,padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:44,height:44,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:w.ibg,color:w.ic,flexShrink:0}}><w.Ic/></div>
                    <div>
                      <div style={{fontSize:9,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:K.gray,marginBottom:3}}>{w.tag}</div>
                      <div style={{fontSize:14,fontWeight:900,color:K.text,lineHeight:1.3}}>{w.val}</div>
                      <div style={{fontSize:11,color:K.gray,marginTop:2,fontWeight:500}}>{w.cnt}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* bar charts */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
                {[
                  {title:"Industry Demand Breakdown", sub:`All ${ALL_INDUSTRIES.length} industries`,  data:indData,  max:maxInd,  accent:K.red},
                  {title:"Pain Category Demand",      sub:`All ${ALL_PAINS.length} pain types`,       data:painData, max:maxPain, accent:K.blue},
                ].map(({title,sub,data,max,accent},ci) => (
                  <div key={title} style={{...card,padding:20}}>
                    <div style={{fontSize:13,fontWeight:800,color:K.text,marginBottom:3,display:"flex",alignItems:"center",gap:7}}>
                      <IChart/>{title}
                    </div>
                    <div style={{fontSize:11,color:K.gray,marginBottom:16,fontWeight:500}}>{sub} · sorted by submissions</div>

                    {data.map(([label,count]) => (
                      <div key={label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
                        <div style={{fontSize:11,color:K.text2,width:164,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}} title={label}>{label}</div>
                        <div style={{flex:1,background:"#F3F4F6",borderRadius:100,height:8,border:`1px solid ${K.border}`}}>
                          <div style={{height:"100%",borderRadius:100,background:`linear-gradient(90deg,${accent},${accent}99)`,width:count===0?"2px":`${Math.max((count/max)*100,2)}%`,opacity:count===0?0.15:1,transition:"width 0.6s ease"}}/>
                        </div>
                        <div style={{fontSize:11,fontWeight:800,color:K.text,width:20,textAlign:"right"}}>{count}</div>
                        <div style={{fontSize:10,color:K.gray2,width:28,textAlign:"right"}}>{total>0?Math.round((count/total)*100):0}%</div>
                      </div>
                    ))}

                    {/* recommendation only on pain chart */}
                    {ci===1 && total>0 && (
                      <div style={{marginTop:16,padding:"12px 14px",background:"rgba(200,16,46,0.05)",border:"1px solid rgba(200,16,46,0.15)",borderRadius:10}}>
                        <div style={{fontSize:10,fontWeight:800,color:K.red,letterSpacing:1,marginBottom:5,textTransform:"uppercase"}}>Build Recommendation</div>
                        <div style={{fontSize:13,color:K.text2,lineHeight:1.6}}>
                          Prioritise <strong style={{color:K.text}}>{topInd?.[0]||"—"}</strong> businesses experiencing <strong style={{color:K.text}}>{topPain?.[0]||"—"}</strong>. Highest validated demand signal.
                        </div>
                      </div>
                    )}
                    {ci===1 && total===0 && (
                      <div style={{marginTop:12,fontSize:12,color:K.gray2}}>Submit from the landing page to see data populate here.</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── TABLE ── */}
          {showTable && (
            <>
              {/* filters */}
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,flexWrap:"wrap"}}>
                <div style={{position:"relative",flex:1,minWidth:180}}>
                  <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:K.gray,pointerEvents:"none"}}><ISearch/></span>
                  <input
                    placeholder="Search business, email, description…"
                    value={search} onChange={e=>setSearch(e.target.value)}
                    style={{width:"100%",background:K.card,border:`1px solid ${K.border}`,borderRadius:8,padding:"9px 12px 9px 34px",fontFamily:fnt,fontSize:13,color:K.text,outline:"none"}}
                  />
                </div>

                <select value={fInd}  onChange={e=>setFInd(e.target.value)}  style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:8,padding:"9px 12px",fontFamily:fnt,fontSize:12,color:K.text2,outline:"none",fontWeight:600}}>
                  <option value="all">All Industries</option>
                  {ALL_INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
                </select>

                <select value={fPain} onChange={e=>setFPain(e.target.value)} style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:8,padding:"9px 12px",fontFamily:fnt,fontSize:12,color:K.text2,outline:"none",fontWeight:600}}>
                  <option value="all">All Pain Types</option>
                  {ALL_PAINS.map(p=><option key={p} value={p}>{p}</option>)}
                </select>

                <select value={fSt}   onChange={e=>setFSt(e.target.value)}   style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:8,padding:"9px 12px",fontFamily:fnt,fontSize:12,color:K.text2,outline:"none",fontWeight:600}}>
                  {["all","Pending","Validated","Rejected"].map(s=><option key={s} value={s}>{s==="all"?"All Statuses":s}</option>)}
                </select>
              </div>

              {/* table card */}
              <div style={{...card,overflow:"hidden"}}>
                {/* table header bar */}
                <div style={{display:"flex",alignItems:"center",gap:8,padding:"13px 18px",borderBottom:`1px solid ${K.border}`,background:"#F9FAFB",fontSize:13,fontWeight:700,color:K.text}}>
                  <IUsers/>
                  {tab==="overview"?"Recent Submissions":tab==="pending"?"Pending Review":tab==="validated"?"Validated":"All Submissions"}
                  <span style={{background:"rgba(200,16,46,0.08)",border:"1px solid rgba(200,16,46,0.18)",color:K.red,fontSize:11,fontWeight:800,padding:"2px 8px",borderRadius:100}}>{filtered.length}</span>
                </div>

                {loading ? (
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:48,gap:10,color:K.gray,fontSize:14}}>
                    <div style={{width:20,height:20,border:`2px solid ${K.border}`,borderTopColor:K.red,borderRadius:"50%",animation:"spin 0.75s linear infinite"}}/>
                    Loading…
                  </div>
                ) : error ? (
                  <div style={{padding:32,color:K.red,fontSize:14}}>{error}</div>
                ) : filtered.length===0 ? (
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:64,gap:10,color:K.gray}}>
                    <div style={{opacity:0.2}}><IInbox/></div>
                    <div style={{fontFamily:bebas,fontSize:22,letterSpacing:1}}>No Submissions Yet</div>
                    <div style={{fontSize:13,textAlign:"center",maxWidth:280,lineHeight:1.6}}>Submissions from the landing page appear here in real time.</div>
                  </div>
                ) : (
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",minWidth:900}}>
                      <thead>
                        <tr style={{background:"#F9FAFB",borderBottom:`1px solid ${K.border}`}}>
                          {["Date","Business","Industry","Email","Pain Category","Description","Status",""].map(h=>(
                            <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",color:K.gray,whiteSpace:"nowrap"}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(tab==="overview" ? filtered.slice(0,10) : filtered).map(r => {
                          const st  = r.status || "Pending";
                          const sty = stStyle(st);
                          return (
                            <tr key={r.id} style={{borderBottom:`1px solid ${K.border}`}}>
                              <td style={{padding:"12px 14px",fontSize:11,color:K.gray,whiteSpace:"nowrap"}}>
                                {fd(r.created_at)}<br/>
                                <span style={{fontSize:10,color:K.gray2}}>{ft(r.created_at)}</span>
                              </td>
                              <td style={{padding:"12px 14px",fontWeight:700,color:K.text,fontSize:13}}>{r.business_name||"—"}</td>
                              <td style={{padding:"12px 14px"}}>
                                <span style={{display:"inline-flex",background:"#F3F4F6",border:`1px solid ${K.border}`,borderRadius:5,padding:"3px 8px",fontSize:11,color:K.text2,fontWeight:600,whiteSpace:"nowrap"}}>
                                  {r.industry||"—"}
                                </span>
                              </td>
                              <td style={{padding:"12px 14px",fontSize:11,color:K.gray}}>{r.email||"—"}</td>
                              <td style={{padding:"12px 14px",fontSize:11,color:K.text2,fontWeight:500}}>{r.pain_category||"—"}</td>
                              <td style={{padding:"12px 14px",fontSize:11,color:K.gray,lineHeight:1.5,maxWidth:180}}>
                                {(r.pain_description||"—").slice(0,80)}{(r.pain_description||"").length>80?"…":""}
                              </td>
                              <td style={{padding:"12px 14px"}}>
                                <span style={{display:"inline-flex",alignItems:"center",padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:700,color:sty.color,background:sty.bg,border:`1px solid ${sty.border}`}}>
                                  <select
                                    value={st}
                                    onChange={e=>{e.stopPropagation();updateStatus(r.id,e.target.value);}}
                                    style={{background:"transparent",border:"none",fontFamily:fnt,fontSize:11,fontWeight:700,cursor:"pointer",outline:"none",color:"inherit"}}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Validated">Validated</option>
                                    <option value="Rejected">Rejected</option>
                                  </select>
                                </span>
                              </td>
                              <td style={{padding:"12px 14px"}}>
                                <button
                                  onClick={()=>setSelected(r)}
                                  style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",border:`1px solid ${K.border}`,background:K.card,color:K.text2}}
                                >
                                  <IEye/> View
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
