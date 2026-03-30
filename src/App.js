import { useState } from "react";

var BLUE   = "#003087";
var LBLUE  = "#0067B1";
var RED    = "#E4002B";
var GREEN  = "#00875A";
var AMBER  = "#FF8B00";
var PURPLE = "#6554C0";
var TEAL   = "#00A896";
var ORANGE = "#FF6B35";
var WHITE  = "#FFFFFF";
var G100   = "#F0F2F5";
var G200   = "#E2E6EC";
var G400   = "#9AAABF";
var G600   = "#5A6A82";
var G800   = "#2C3A4F";

var SAMPLE_FNOLS = [
  {
    id: "FNOL-7821",
    claimType: "Auto",
    policyNumber: "PA-2024-88341",
    insured: "Marcus Reid",
    dateOfLoss: "2025-03-12",
    reportedBy: "Insured",
    narrative: "I was driving on I-95 northbound at approximately 7:45am during rush hour. A truck in front of me braked suddenly and I was unable to stop in time. My front bumper struck the rear of the truck. The truck driver said he was fine and drove away without stopping. I have a witness who saw everything. My airbags deployed, my car is not driveable. I was taken to hospital by ambulance with neck and back pain. My two passengers, my wife and daughter aged 8, were also in the vehicle.",
    location: "I-95 Northbound, Exit 22, Miami FL",
    vehicleYear: "2022",
    vehicleMake: "Honda Accord",
    coverages: ["Collision", "Medical Payments", "Uninsured Motorist"],
  },
  {
    id: "FNOL-7822",
    claimType: "Property",
    policyNumber: "HO3-2024-55129",
    insured: "Sandra White",
    dateOfLoss: "2025-03-10",
    reportedBy: "Insured",
    narrative: "I came home from work around 6pm to find my back door had been kicked in. Several rooms were ransacked. My laptop, jewelry, and cash were taken. My TV and stereo are also gone. I called the police immediately and they filed a report, number 2025-MIA-04471. My neighbor said she saw a white van parked outside for about an hour around 3pm but did not think anything of it at the time. Nothing like this has ever happened to me before in 15 years in this house.",
    location: "1842 Palm Grove Drive, Miami FL 33101",
    vehicleYear: "",
    vehicleMake: "",
    coverages: ["Dwelling", "Personal Property", "Other Structures"],
  },
  {
    id: "FNOL-7823",
    claimType: "Auto",
    policyNumber: "CA-2024-11203",
    insured: "Metro Delivery LLC",
    dateOfLoss: "2025-03-11",
    reportedBy: "Third Party Attorney",
    narrative: "Our client, Mr. James Kowalski, was struck by one of your insured's delivery vehicles while crossing at a marked crosswalk on Brickell Avenue. The driver ran a red light at approximately 40mph. Mr. Kowalski sustained fractures to his left leg and hip and was hospitalised for 4 days. He is currently unable to work. We are representing Mr. Kowalski and demand full compensation for medical expenses, lost wages, pain and suffering. We have obtained traffic camera footage. Demand letter to follow within 7 days.",
    location: "Brickell Ave and SE 8th St, Miami FL",
    vehicleYear: "2021",
    vehicleMake: "Ford Transit",
    coverages: ["Commercial Auto Liability", "Uninsured Motorist"],
  },
];

var TRIAGE_RESULTS = {
  "FNOL-7821": {
    claimType: "Auto -- Rear End Collision with Bodily Injury",
    severityBand: "MODERATE-COMPLEX",
    severityScore: 72,
    adjusterTier: "L2 -- Senior Adjuster",
    estimatedReserve: "$45,000 -- $85,000",
    priority: "HIGH",
    sla: "4 hours",
    fraudScore: 12,
    fraudLevel: "LOW",
    keyFindings: [
      "Airbag deployment confirms significant impact force -- vehicle likely total loss",
      "Insured transported by ambulance -- bodily injury claim certain for insured and up to 2 passengers",
      "Hit and run element -- uninsured motorist coverage likely triggered",
      "Child passenger (age 8) involved -- minor injury claim may require guardian coordination",
      "Witness present -- obtain statement immediately before recollection fades",
      "Rush hour I-95 -- traffic camera footage likely available from FDOT",
    ],
    immediateActions: [
      "Assign to L2 senior adjuster with BI experience within 4 hours",
      "Contact insured to confirm injuries and obtain hospital/treating physician details",
      "Order vehicle inspection and salvage assessment -- likely total loss",
      "Obtain witness contact information and take recorded statement today",
      "Request FDOT traffic camera footage for I-95 Exit 22 for 2025-03-12 07:30-08:00",
      "Set initial reserves: vehicle $28,000 / BI insured $25,000 / BI passengers $15,000 / UM $12,000",
      "Open minor claimant file for daughter -- appoint independent guardian if required by FL law",
    ],
    coverageVerification: [
      { coverage: "Collision", status: "CONFIRMED", note: "Active on policy PA-2024-88341" },
      { coverage: "Medical Payments", status: "CONFIRMED", note: "Covers insured and passengers regardless of fault" },
      { coverage: "Uninsured Motorist", status: "CONFIRMED", note: "Triggered by hit and run -- FL UM applies" },
    ],
    complianceFlags: [
      "FL statute 627.736 -- PIP mandatory for FL auto -- verify PIP election on policy",
      "Minor claimant (age 8) -- FL guardian ad litem may be required for settlement",
      "UM claim -- written rejection of UM coverage required if not elected (verify on file)",
    ],
    similarClaims: [
      { id: "CLM-4401", similarity: "94%", outcome: "Settled $62,000", note: "Similar BI + UM, 3 occupants, Miami" },
      { id: "CLM-4287", similarity: "87%", outcome: "Settled $48,500", note: "Rear-end + airbag deploy, 2 occupants" },
    ],
  },
  "FNOL-7822": {
    claimType: "Property -- Residential Burglary",
    severityBand: "MODERATE",
    severityScore: 51,
    adjusterTier: "L1 -- Standard Adjuster",
    estimatedReserve: "$12,000 -- $22,000",
    priority: "STANDARD",
    sla: "24 hours",
    fraudScore: 28,
    fraudLevel: "MEDIUM",
    keyFindings: [
      "Police report on file -- key indicator of genuine loss; obtain copy immediately",
      "Cash claim noted -- cash losses are unverifiable and require careful documentation",
      "15-year policy tenure with no prior claims -- positive credibility indicator",
      "Witness to suspicious vehicle -- potential lead for law enforcement, document fully",
      "Multiple high-value items claimed (jewelry, electronics) -- schedule and receipts needed",
      "Fraud score elevated due to cash claim and value of personal property items",
    ],
    immediateActions: [
      "Assign to L1 adjuster -- standard residential burglary, no injury",
      "Request police report MIA-2025-04471 immediately",
      "Contact insured within 24 hours -- schedule in-home inspection within 5 days",
      "Request receipts, photos, or serial numbers for all claimed items",
      "Cash claim: document insured's explanation of why cash was kept at home",
      "Engage personal property specialist for jewelry valuation (if claim >$5,000)",
      "Set initial reserves: personal property $14,000 / dwelling damage (door) $1,500",
    ],
    coverageVerification: [
      { coverage: "Personal Property", status: "CONFIRMED", note: "HO3 open peril personal property covers theft" },
      { coverage: "Dwelling", status: "CONFIRMED", note: "Door damage covered under dwelling" },
      { coverage: "Other Structures", status: "REVIEW", note: "Verify if any outbuildings affected" },
    ],
    complianceFlags: [
      "FL statute 627.70131 -- insurer must acknowledge claim within 14 days",
      "Sworn proof of loss may be required for theft claims over $5,000 under policy terms",
      "Document all communications regarding cash loss separately for SIU referral threshold",
    ],
    similarClaims: [
      { id: "CLM-3892", similarity: "91%", outcome: "Settled $16,200", note: "Residential burglary, Miami, electronics + jewelry" },
      { id: "CLM-3741", similarity: "83%", outcome: "Denied (fraud)", note: "Similar cash claim pattern -- SIU referral" },
    ],
  },
  "FNOL-7823": {
    claimType: "Commercial Auto -- Third Party Bodily Injury (Attorney Represented)",
    severityBand: "COMPLEX-SEVERE",
    severityScore: 89,
    adjusterTier: "L3 -- Specialist / Litigation",
    estimatedReserve: "$150,000 -- $350,000",
    priority: "CRITICAL",
    sla: "1 hour",
    fraudScore: 18,
    fraudLevel: "LOW",
    keyFindings: [
      "ATTORNEY REPRESENTED -- do not contact claimant directly; all communication via counsel",
      "Fractures to leg and hip with hospitalisation -- serious BI, high settlement exposure",
      "Traffic camera footage exists -- could establish liability clearly; obtain before attorney does",
      "Red light violation alleged -- if confirmed, clear liability for insured; no comparative fault defence",
      "Commercial vehicle involved -- heightened regulatory and reputational exposure",
      "Demand letter within 7 days -- litigation preparation must begin immediately",
      "Lost wages claim in addition to medical -- economic damages significantly increase exposure",
    ],
    immediateActions: [
      "URGENT: Assign to L3 specialist / litigation adjuster within 1 hour",
      "Do NOT contact claimant or claimant's attorney without legal review",
      "Retain defence counsel immediately -- attorney demand letter in 7 days",
      "Request Brickell Ave / SE 8th St traffic camera footage from Miami-Dade DOT today",
      "Obtain full recorded statement from insured driver before attorney coaching occurs",
      "Preserve all telematics data from Ford Transit 2021 for date/time of loss",
      "Set initial reserves: BI $200,000 / legal $35,000 / lost wages $15,000",
      "Notify commercial lines underwriter -- potential policy review and non-renewal",
    ],
    coverageVerification: [
      { coverage: "Commercial Auto Liability", status: "CONFIRMED", note: "Active -- verify policy limits, likely $1M CSL" },
      { coverage: "Uninsured Motorist", status: "NOT APPLICABLE", note: "Third party claim -- UM not triggered" },
    ],
    complianceFlags: [
      "FL bad faith statute 624.155 -- attorney involvement triggers enhanced documentation requirements",
      "40-day rule: FL requires coverage decision within 40 days of proof of loss for BI claims",
      "Commercial auto -- FMCSA regulations may apply if vehicle used in interstate commerce",
      "Minor crosswalk pedestrian rights under FL 316.130 -- pedestrian has right of way",
    ],
    similarClaims: [
      { id: "CLM-5102", similarity: "92%", outcome: "Settled $245,000", note: "Commercial auto BI, attorney rep, pedestrian" },
      { id: "CLM-4988", similarity: "85%", outcome: "Litigated $310,000", note: "Red light violation, fracture injuries, camera footage" },
    ],
  },
};

var SEV_THEME = {
  "COMPLEX-SEVERE": { bg:"#FFF0EB", border:ORANGE, text:ORANGE    },
  "MODERATE-COMPLEX":{ bg:"#FFF8EC", border:AMBER,  text:"#CC6600" },
  "MODERATE":        { bg:"#FFF8EC", border:AMBER,  text:"#CC6600" },
  "MINOR":           { bg:"#E3FCEF", border:GREEN,  text:GREEN     },
};

var PRIORITY_THEME = {
  CRITICAL: { bg:"#FFF0EB", border:ORANGE, text:ORANGE    },
  HIGH:     { bg:"#FFF8EC", border:AMBER,  text:"#CC6600" },
  STANDARD: { bg:"#E3FCEF", border:GREEN,  text:GREEN     },
};

var FRAUD_THEME = {
  HIGH:   { color:RED,    label:"HIGH RISK"   },
  MEDIUM: { color:AMBER,  label:"MEDIUM RISK" },
  LOW:    { color:GREEN,  label:"LOW RISK"    },
};

var PHASES = [
  "Parsing FNOL narrative with NLP...",
  "Classifying claim type and severity...",
  "Running fraud indicator analysis...",
  "Checking comparable closed claims...",
  "Generating triage report and reserve recommendation...",
];

function NTTLogo() {
  return (
    <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
      <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
        <span style={{ fontFamily:"Arial Black,Arial", fontWeight:900, fontSize:20, color:BLUE }}>NTT</span>
        <span style={{ fontFamily:"Arial,sans-serif", fontWeight:700, fontSize:16, color:BLUE }}>DATA</span>
      </div>
      <div style={{ height:2, background:RED, marginTop:2, borderRadius:1 }}/>
    </div>
  );
}

function ScoreMeter(props) {
  var score = props.score;
  var color = score > 70 ? ORANGE : score > 45 ? AMBER : GREEN;
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:36, fontWeight:800, color:color, lineHeight:1 }}>{score}</div>
      <div style={{ fontSize:9, color:G400, marginTop:2, textTransform:"uppercase", letterSpacing:1 }}>{props.label}</div>
      <div style={{ height:5, background:G200, borderRadius:3, marginTop:5, width:60, margin:"5px auto 0" }}>
        <div style={{ height:"100%", width:score+"%", background:color, borderRadius:3 }}/>
      </div>
    </div>
  );
}

export default function App() {
  var [selected,   setSelected]   = useState(null);
  var [result,     setResult]     = useState(null);
  var [loading,    setLoading]    = useState(false);
  var [phaseIdx,   setPhaseIdx]   = useState(0);
  var [activeTab,  setActiveTab]  = useState("findings");
  var [doneMap,    setDoneMap]    = useState({});
  var [triageCount,setTriageCount]= useState(0);

  function runTriage(fnol) {
    if (loading) return;
    setSelected(fnol);
    setResult(null);
    setLoading(true);
    setActiveTab("findings");
    setPhaseIdx(0);
    var p = 0;
    function tick() {
      p++; setPhaseIdx(p);
      if (p < PHASES.length - 1) setTimeout(tick, 600);
    }
    setTimeout(tick, 600);
    setTimeout(function() {
      var data = TRIAGE_RESULTS[fnol.id];
      setResult(data);
      setDoneMap(function(prev) { var n = Object.assign({}, prev); n[fnol.id] = data; return n; });
      setTriageCount(function(c) { return c + 1; });
      setLoading(false);
    }, 3200);
  }

  var avgScore = Object.values(doneMap).length > 0
    ? Math.round(Object.values(doneMap).reduce(function(s,r) { return s+r.severityScore; }, 0) / Object.values(doneMap).length) : 0;

  return (
    <div style={{ fontFamily:"'Segoe UI',Arial,sans-serif", background:G100, minHeight:"100vh", display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ background:WHITE, borderBottom:"3px solid "+BLUE, padding:"10px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 6px rgba(0,0,0,0.07)", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:18 }}>
          <NTTLogo/>
          <div style={{ width:1, height:30, background:G200 }}/>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:BLUE }}>FNOL Triage Copilot</div>
            <div style={{ fontSize:10, color:G600 }}>AI-Powered Claims Intake Intelligence -- ClaimCenter AMS Accelerator</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:22 }}>
          {[
            { v:SAMPLE_FNOLS.length, l:"Incoming FNOLs",  c:BLUE   },
            { v:triageCount,         l:"Triaged",          c:GREEN  },
            { v:avgScore||"--",      l:"Avg Severity",     c:AMBER  },
            { v:Object.values(doneMap).filter(function(r) { return r.priority==="CRITICAL"; }).length, l:"Critical", c:ORANGE },
          ].map(function(s) {
            return (
              <div key={s.l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:800, color:s.c, lineHeight:1 }}>{s.v}</div>
                <div style={{ fontSize:9, color:G400, textTransform:"uppercase", letterSpacing:1 }}>{s.l}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* Sidebar -- FNOL queue */}
        <div style={{ width:280, background:WHITE, borderRight:"1px solid "+G200, overflowY:"auto", padding:"14px 10px", flexShrink:0 }}>
          <div style={{ fontSize:10, fontWeight:700, color:G400, letterSpacing:2, marginBottom:10 }}>FNOL QUEUE -- SELECT TO TRIAGE</div>
          {SAMPLE_FNOLS.map(function(fnol) {
            var cached = doneMap[fnol.id];
            var isAct  = selected && selected.id === fnol.id;
            var pt     = cached ? PRIORITY_THEME[cached.priority] || PRIORITY_THEME.STANDARD : null;
            return (
              <div key={fnol.id} onClick={function() { runTriage(fnol); }}
                style={{ background:isAct?"#EBF2FF":WHITE, border:"1.5px solid "+(isAct?BLUE:G200), borderRadius:10, padding:"11px 12px", marginBottom:7, cursor:loading?"not-allowed":"pointer", opacity:loading&&!isAct?0.5:1, boxShadow:isAct?"0 2px 8px rgba(0,48,135,0.08)":"0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:BLUE, fontFamily:"monospace" }}>{fnol.id}</span>
                  {pt && <span style={{ fontSize:9, fontWeight:700, color:pt.text, background:pt.bg, border:"1px solid "+pt.border, borderRadius:3, padding:"0 5px" }}>{cached.priority}</span>}
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:G800, marginBottom:4 }}>{fnol.insured}</div>
                <div style={{ fontSize:10, color:G600, marginBottom:4 }}>{fnol.claimType} -- {fnol.policyNumber}</div>
                <div style={{ fontSize:10, color:G400 }}>Loss: {fnol.dateOfLoss}</div>
                {cached && (
                  <div style={{ marginTop:6, display:"flex", gap:8, borderTop:"1px solid "+G200, paddingTop:5 }}>
                    <span style={{ fontSize:9, color:AMBER }}>Score: {cached.severityScore}</span>
                    <span style={{ fontSize:9, color:PURPLE }}>{cached.adjusterTier.split("--")[0].trim()}</span>
                    <span style={{ fontSize:9, color:GREEN }}>SLA: {cached.sla}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main panel */}
        <div style={{ flex:1, overflowY:"auto", padding:"18px 22px" }}>

          {!selected && !loading && (
            <div style={{ textAlign:"center", paddingTop:80, opacity:0.4 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>&#128203;</div>
              <div style={{ fontSize:15, fontWeight:700, color:G800 }}>Select an FNOL to triage</div>
              <div style={{ fontSize:12, color:G600, marginTop:6, lineHeight:1.7, maxWidth:400, margin:"6px auto 0" }}>
                The FNOL Triage Copilot reads the loss narrative, classifies severity, assigns the right adjuster tier, detects fraud signals, checks comparable claims, and generates the complete triage report.
              </div>
            </div>
          )}

          {loading && selected && (
            <div style={{ maxWidth:700 }}>
              <FNOLHeader fnol={selected}/>
              <div style={{ marginTop:14, background:WHITE, borderRadius:12, padding:"22px 20px", border:"1px solid "+G200, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize:13, color:BLUE, fontWeight:700, marginBottom:18 }}>AI Triage in progress...</div>
                {PHASES.map(function(label, i) {
                  var done = i < phaseIdx;
                  var act  = i === phaseIdx;
                  var pct  = [20,40,60,80,100][i];
                  return (
                    <div key={i} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:11, color:act?BLUE:done?GREEN:G400, fontWeight:act?700:400 }}>
                          {done?"v ":act?"> ":"o "}{label}
                        </span>
                        <span style={{ fontSize:10, color:G400 }}>{done||act?pct:0}%</span>
                      </div>
                      <div style={{ height:4, background:G200, borderRadius:4 }}>
                        <div style={{ height:"100%", width:(done||act)?pct+"%":"0%", background:done?GREEN:act?BLUE:"transparent", borderRadius:4, transition:"width 0.5s" }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!loading && result && selected && (
            <div style={{ maxWidth:860 }}>
              <FNOLHeader fnol={selected}/>

              {/* Summary banner */}
              {(function() {
                var st = SEV_THEME[result.severityBand] || SEV_THEME.MODERATE;
                var ft = FRAUD_THEME[result.fraudLevel] || FRAUD_THEME.LOW;
                var pt = PRIORITY_THEME[result.priority] || PRIORITY_THEME.STANDARD;
                return (
                  <div style={{ marginTop:12, padding:"14px 18px", background:WHITE, border:"2px solid "+st.border, borderRadius:12, display:"flex", gap:18, flexWrap:"wrap", alignItems:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    <ScoreMeter score={result.severityScore} label="Severity Score"/>
                    <div style={{ width:1, height:52, background:G200 }}/>
                    <div style={{ display:"flex", gap:16, flexWrap:"wrap", flex:1 }}>
                      <div>
                        <div style={{ fontSize:9, color:G400, marginBottom:3 }}>CLAIM TYPE</div>
                        <div style={{ fontSize:11, fontWeight:700, color:G800 }}>{result.claimType}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:9, color:G400, marginBottom:3 }}>SEVERITY</div>
                        <span style={{ fontSize:10, fontWeight:700, color:st.text, background:st.bg, border:"1px solid "+st.border, borderRadius:4, padding:"2px 8px" }}>{result.severityBand}</span>
                      </div>
                      <div>
                        <div style={{ fontSize:9, color:G400, marginBottom:3 }}>ADJUSTER TIER</div>
                        <div style={{ fontSize:11, fontWeight:700, color:BLUE }}>{result.adjusterTier}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:9, color:G400, marginBottom:3 }}>EST. RESERVE</div>
                        <div style={{ fontSize:11, fontWeight:700, color:AMBER }}>{result.estimatedReserve}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:9, color:G400, marginBottom:3 }}>PRIORITY / SLA</div>
                        <span style={{ fontSize:10, fontWeight:700, color:pt.text, background:pt.bg, border:"1px solid "+pt.border, borderRadius:4, padding:"2px 8px" }}>{result.priority} -- {result.sla}</span>
                      </div>
                      <div>
                        <div style={{ fontSize:9, color:G400, marginBottom:3 }}>FRAUD INDICATOR</div>
                        <span style={{ fontSize:10, fontWeight:700, color:ft.color }}>Score {result.fraudScore}/100 -- {ft.label}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Tabs */}
              <div style={{ display:"flex", marginTop:16, marginBottom:14, borderBottom:"2px solid "+G200 }}>
                {[
                  { k:"findings",    l:"Key Findings" },
                  { k:"actions",     l:"Immediate Actions" },
                  { k:"coverage",    l:"Coverage Check" },
                  { k:"compliance",  l:"Compliance Flags" },
                  { k:"comparable",  l:"Comparable Claims" },
                ].map(function(tab) {
                  var a = activeTab === tab.k;
                  return (
                    <button key={tab.k} onClick={function() { setActiveTab(tab.k); }}
                      style={{ background:"transparent", border:"none", borderBottom:"3px solid "+(a?BLUE:"transparent"), color:a?BLUE:G600, padding:"7px 12px", fontSize:11, fontWeight:a?700:400, cursor:"pointer", marginBottom:-2 }}>
                      {tab.l}
                    </button>
                  );
                })}
              </div>

              {activeTab === "findings" && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {result.keyFindings.map(function(f, i) {
                    var isWarn = f.indexOf("ATTORNEY") !== -1 || f.indexOf("URGENT") !== -1 || f.indexOf("camera") !== -1;
                    return (
                      <div key={i} style={{ background:WHITE, borderRadius:9, padding:"11px 14px", border:"1px solid "+G200, borderLeft:"4px solid "+(isWarn?ORANGE:BLUE), display:"flex", gap:10 }}>
                        <div style={{ width:22, height:22, borderRadius:"50%", background:isWarn?ORANGE:BLUE, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:WHITE, flexShrink:0 }}>{i+1}</div>
                        <div style={{ fontSize:12, color:G800, lineHeight:1.6 }}>{f}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "actions" && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {result.immediateActions.map(function(a, i) {
                    var isUrgent = a.indexOf("URGENT") !== -1 || a.indexOf("Do NOT") !== -1;
                    return (
                      <div key={i} style={{ background:WHITE, borderRadius:9, padding:"11px 14px", border:"1px solid "+(isUrgent?ORANGE:G200), display:"flex", gap:10 }}>
                        <div style={{ width:22, height:22, borderRadius:"50%", background:isUrgent?ORANGE:GREEN, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:WHITE, flexShrink:0 }}>{i+1}</div>
                        <div style={{ fontSize:12, color:G800, lineHeight:1.6 }}>{a}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "coverage" && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {result.coverageVerification.map(function(c, i) {
                    var sc = c.status === "CONFIRMED" ? GREEN : c.status === "REVIEW" ? AMBER : RED;
                    return (
                      <div key={i} style={{ background:WHITE, borderRadius:9, padding:"13px 15px", border:"1px solid "+G200, display:"flex", gap:14, alignItems:"center" }}>
                        <div style={{ width:10, height:10, borderRadius:"50%", background:sc, flexShrink:0 }}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, fontWeight:700, color:G800 }}>{c.coverage}</div>
                          <div style={{ fontSize:11, color:G600, marginTop:2 }}>{c.note}</div>
                        </div>
                        <span style={{ fontSize:10, fontWeight:700, color:sc, border:"1px solid "+sc, borderRadius:4, padding:"2px 8px" }}>{c.status}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "compliance" && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {result.complianceFlags.map(function(f, i) {
                    return (
                      <div key={i} style={{ background:"#FFF8EC", borderRadius:9, padding:"12px 14px", border:"1px solid "+AMBER, display:"flex", gap:10 }}>
                        <span style={{ fontSize:14, flexShrink:0 }}>&#9888;</span>
                        <div style={{ fontSize:12, color:G800, lineHeight:1.6 }}>{f}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "comparable" && (
                <div>
                  <div style={{ fontSize:11, color:G600, marginBottom:10 }}>
                    Based on {result.similarClaims.length} comparable closed claims from the last 36 months:
                  </div>
                  {result.similarClaims.map(function(c, i) {
                    return (
                      <div key={i} style={{ background:WHITE, borderRadius:9, padding:"13px 15px", border:"1px solid "+G200, marginBottom:8, display:"flex", gap:14, alignItems:"center" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", gap:10, marginBottom:4 }}>
                            <span style={{ fontSize:11, fontWeight:700, color:BLUE, fontFamily:"monospace" }}>{c.id}</span>
                            <span style={{ fontSize:10, color:GREEN, fontWeight:600 }}>{c.similarity} match</span>
                          </div>
                          <div style={{ fontSize:12, color:G800, fontWeight:600 }}>{c.outcome}</div>
                          <div style={{ fontSize:11, color:G600, marginTop:2 }}>{c.note}</div>
                        </div>
                        <div style={{ width:48, height:48, borderRadius:"50%", background:G100, border:"2px solid "+GREEN, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:GREEN, flexShrink:0 }}>
                          {c.similarity}
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ marginTop:10, padding:"10px 12px", background:"#EBF2FF", border:"1px solid "+LBLUE, borderRadius:8, fontSize:11, color:BLUE }}>
                    Reserve recommendation based on comparable outcomes: {result.estimatedReserve}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background:WHITE, borderTop:"1px solid "+G200, padding:"6px 24px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:GREEN }}/>
          <span style={{ fontSize:10, color:GREEN, fontWeight:700 }}>PoC -- Static Data</span>
        </div>
        {["ClaimCenter","NLP Narrative Parser","Fraud Scoring","Comparable Claims","Claude Sonnet (Prod)","ServiceNow (Prod)"].map(function(t) {
          return <span key={t} style={{ fontSize:9, color:G600, border:"1px solid "+G200, padding:"2px 7px", borderRadius:3, background:G100 }}>{t}</span>;
        })}
        <span style={{ marginLeft:"auto", fontSize:10, color:G400 }}>NTT DATA -- FNOL Triage Copilot 2025</span>
      </div>
    </div>
  );
}

function FNOLHeader(props) {
  var f = props.fnol;
  return (
    <div style={{ background:WHITE, border:"1px solid "+G200, borderRadius:10, padding:"13px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:8 }}>
        <div><div style={{ fontSize:9, color:G400 }}>FNOL ID</div><div style={{ fontSize:13, fontWeight:700, color:BLUE, fontFamily:"monospace" }}>{f.id}</div></div>
        <div><div style={{ fontSize:9, color:G400 }}>CLAIM TYPE</div><div style={{ fontSize:13, fontWeight:700, color:G800 }}>{f.claimType}</div></div>
        <div><div style={{ fontSize:9, color:G400 }}>INSURED</div><div style={{ fontSize:13, fontWeight:700, color:G800 }}>{f.insured}</div></div>
        <div><div style={{ fontSize:9, color:G400 }}>POLICY</div><div style={{ fontSize:11, fontWeight:600, color:PURPLE }}>{f.policyNumber}</div></div>
        <div><div style={{ fontSize:9, color:G400 }}>DATE OF LOSS</div><div style={{ fontSize:11, fontWeight:600, color:G800 }}>{f.dateOfLoss}</div></div>
        <div><div style={{ fontSize:9, color:G400 }}>REPORTED BY</div><div style={{ fontSize:11, fontWeight:600, color:G800 }}>{f.reportedBy}</div></div>
      </div>
      <div style={{ fontSize:10, color:G400, marginBottom:4 }}>LOSS NARRATIVE</div>
      <div style={{ fontSize:11, color:G600, lineHeight:1.7, padding:"8px 10px", background:G100, borderRadius:7 }}>{f.narrative}</div>
      {f.location && (
        <div style={{ marginTop:6, fontSize:10, color:G600 }}>
          <strong>Location:</strong> {f.location}
          {f.vehicleMake && <span style={{ marginLeft:12 }}><strong>Vehicle:</strong> {f.vehicleYear} {f.vehicleMake}</span>}
        </div>
      )}
    </div>
  );
}
