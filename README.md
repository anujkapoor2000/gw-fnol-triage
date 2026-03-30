# GW FNOL Triage Copilot
### NTT DATA -- ClaimCenter AMS Accelerator

AI-powered claims intake intelligence. Paste a loss narrative, get instant claim classification, severity scoring, adjuster tier assignment, fraud detection, comparable claims, and a full triage action plan.

---

## Quick Start

```bash
npm install && npm start
# Open http://localhost:3000
```

## Deploy to Vercel (5 minutes)

```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_ORG/gw-fnol-triage.git
git push -u origin main
# vercel.com -> Add New Project -> Deploy
```

Or Netlify: `npm run build` then drag `/build` to app.netlify.com/drop

## Production Roadmap

| Phase | What | When |
|---|---|---|
| PoC (now) | Static triage results, 3 sample FNOLs, full UI | Live today |
| Phase 2 | Replace static data with Claude API -- paste any FNOL narrative | Week 1-2 |
| Phase 3 | Connect to ClaimCenter FNOL intake -- auto-triage on submission | Week 3-4 |
| Phase 4 | Comparable claims from real closed claim database | Week 5-6 |
| Phase 5 | Reserve recommendation connected to actuarial tables | Week 7-8 |

## Phase 2 -- Connect Claude API

Replace the `TRIAGE_RESULTS` lookup in `App.js` with a real Claude call:

```javascript
async function triageFNOL(fnol) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      system: `You are a GW AMS senior claims adjuster AI. Given an FNOL,
               return ONLY valid JSON with keys:
               claimType, severityBand, severityScore (0-100), adjusterTier,
               estimatedReserve, priority, sla, fraudScore (0-100), fraudLevel,
               keyFindings (array), immediateActions (array),
               coverageVerification (array of {coverage, status, note}),
               complianceFlags (array), similarClaims (array of {id, similarity, outcome, note})`,
      messages: [{ role: 'user', content: JSON.stringify(fnol) }],
    }),
  });
  const data = await response.json();
  return JSON.parse(data.content[0].text);
}
```

## NTT DATA -- Guidewire AMS Accelerators 2025
