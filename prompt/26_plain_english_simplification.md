# Prompt 26: Complete Plain English Simplification & "Choose Pond" Feature Explanation

## Objective
1. Explain the **"Active Pond" / "Choose Pond"** feature in clear, simple terms for everyday fish farmers.
2. Eliminate all medical, mathematical, and algorithmic jargon across the entire web application (`frontend/src/`).
3. Replace technical labels, headings, descriptions, disease names, and instructions with friendly, accessible plain English while preserving all backend test contracts, calculations, and glassmorphic aesthetics.

---

## What is the "Choose Pond" (Active Pond) Feature?
In aquaculture, a fish farm rarely has just one pond. Usually, a farm is divided into several ponds for different stages of fish growth:
- **Nursery Pond Alpha:** For small baby fish (fingerlings) that need gentle water and protection.
- **Grow-out Pond Bravo:** For growing fish eating regular feed on their way to market size.
- **Broodstock Pond Charlie:** For adult parent fish kept in optimal breeding conditions.

The **"Choose Pond"** dropdown allows the farmer to:
1. **Target their inspection:** Select which specific pond they are checking right now.
2. **Organize records:** When water readings are saved or photos are checked, the results are tagged to that pond.
3. **Filter history:** On the **Past Records** screen, the farmer can filter the ledger to inspect the history of that specific pond over time.

---

## Summary of Plain English Changes Across Components

### 1. Header (`Header.jsx`)
- `"Active Pond:"` $\rightarrow$ `"Choose Pond:"` (with tooltip explaining pond selection).
- `"Live Diagnostics"` tab $\rightarrow$ `"Live Pond Check"`.
- `"Surveillance Ledger"` tab $\rightarrow$ `"Past Records"`.
- Status: `"FastAPI + MobileNetV3 CPU"` $\rightarrow$ `"AI System Online"`.
- Connecting: `"Backend Connecting..."` $\rightarrow$ `"Connecting to System..."`.

### 2. Example Tests Bar (`JudgePresetsBar.jsx`)
- Title: `"Judge Evaluation Presets (PRD FR-07):"` $\rightarrow$ `"Quick Example Tests:"`.
- Tier capsules: `NORMAL` $\rightarrow$ `SAFE`, `WARNING` $\rightarrow$ `WARNING`, `EMERGENCY` $\rightarrow$ `DANGER`.
- Stack protection: Added explicit `position: 'relative', zIndex: 10` so Header dropdown stays cleanly above it.

### 3. Danger Level Gauge (`RiskGauge.jsx`)
- Title: `"MULTIMODAL POND RISK INDEX"` $\rightarrow$ `"POND DANGER LEVEL"`.
- Subtitle: `"Calibrated Early Warning Fusion Engine..."` $\rightarrow$ `"Combines fish photo check (55%) and water test results (45%)"`.
- Center label: `"COMPOSITE RISK"` $\rightarrow$ `"DANGER LEVEL"`.
- Severity Tiers:
  - `NORMAL` $\rightarrow$ `SAFE / HEALTHY`
  - `ADVISORY` $\rightarrow$ `WATCH CLOSELY`
  - `WARNING` $\rightarrow$ `NEEDS ATTENTION`
  - `EMERGENCY` $\rightarrow$ `CRITICAL DANGER`
- Guardrail Alert: `"Emergency Warning: Water numbers are at dangerous levels for fish (oxygen is too low or ammonia is too high). Urgent action needed!"`.
- Synergy Alert: `"Extra Risk Alert (+X pts): Bad water conditions are making fish sickness worse faster!"`.
- Metric breakdown cards: `"Fish Health (55%)"`, `"Water Quality (45%)"`, `"Extra Risk"`.

### 4. Fish Photo Check (`DiagnosticScanner.jsx`)
- Title: `"Fish Dermal Pathology Scanner"` $\rightarrow$ `"Fish Health Photo Check"`.
- Subtitle: `"Smart AI photo check to spot fish illnesses, skin sores, and gill problems"`.
- Toggle button: `"CLAHE: ON/OFF"` $\rightarrow$ `"Clear Photo Mode: ON/OFF"`.
- Dropzone prompt: `"Upload a photo of your fish or drag it here"`.
- Support hint: `"Supports phone photos, JPG, and PNG files."`.
- Results: `"Main Health Finding"`, Certainty percentage, `"Other Possible Conditions:"`, `"Signs Spotted on the Fish:"`.
- Disease names translated into everyday English:
  - `Bacterial gill disease` $\rightarrow$ `Gill Disease (Swollen, Pale Gills)`
  - `Bacterial Red disease` $\rightarrow$ `Red Spot Disease (Body Sores)`
  - `Bacterial diseases - Aeromoniasis` $\rightarrow$ `Dropsy (Swollen Belly & Raised Scales)`
  - `Fungal diseases Saprolegniasis` $\rightarrow$ `Fungal Infection (Cotton-like Spots)`
  - `Healthy Fish` $\rightarrow$ `Healthy Fish (No signs of illness)`
  - `Parasitic diseases` $\rightarrow$ `Parasites (White Spot Disease)`
  - `Viral diseases White tail disease` $\rightarrow$ `Fin & Tail Rot (Frayed White Tail)`
- Symptoms translated to plain language (e.g. "Cotton-like fuzzy white growths on head and skin", "Open red sores and ulcers on the fish body", "Clear, clean scales and healthy skin").

### 5. Water Test Readings (`WaterTelemetryPanel.jsx`)
- Title: `"Physicochemical Water Telemetry"` $\rightarrow$ `"Pond Water Test Readings"`.
- Subtitle: `"Checks 4 key water quality numbers to keep your fish safe and breathing easy"`.
- Sliders:
  - `"Dissolved Oxygen (Air for fish to breathe)"` (Safe: above 5.0 mg/L)
  - `"Water Acidity (pH Level)"` (Safe: 6.8 - 8.2)
  - `"Water Temperature"` (Best: 24 - 30 °C)
  - `"Total Ammonia (Fish waste in water)"` (Safe: < 0.50 mg/L)
- Emerson box: `"Poisonous Ammonia Gas (Free NH₃)"`, `"Deadly Level - Danger!"` / `"High - Stressful for Fish"` / `"Safe Level"`.
- Danger score: `"Water Danger Score: X / 100"`.
- Action button: `"Check Water Safety Now"`.

### 6. Action Plan (`ActionPlanCard.jsx`)
- Title: `"Recommended Care & Treatment Steps"`.
- Subtitle: `"Safe, natural treatments to help your fish recover without harmful antibiotics"`.
- Pill: `X Steps to Take`.
- Step tag: `Step X`.
- Friendly categories: `"Urgent Emergency Step"`, `"Clean & Aerate Pond"`, `"Balance Water pH"`, `"Salt Water Dip Treatment"`, `"Fungus Treatment Dip"`, `"Epsom Salt Soak"`, `"Disinfect Nets & Gear"`, `"Daily Routine Care"`.
- Bottom standard: `"Safe Fish Farming Standard: AquaGuard AI recommends natural salt dips, air pumps, clean water exchanges, and agricultural lime instead of antibiotics to keep fish healthy and safe to eat."`.

### 7. Past Records Screen (`SurveillanceLedgerScreen.jsx`)
- Title: `"Pond Checkup Records"`.
- Subtitle: `"Past checkups, water test results, and health records for all your ponds"`.
- KPI Cards: `"Total Checks Done"`, `"Average Danger Score"`, `"Ponds Needing Attention"`, `"Ponds in Safe Condition"`.
- Headers: `FISH PHOTO`, `DATE & TIME`, `POND`, `HEALTH RESULT`, `WATER READINGS`, `DANGER SCORE`, `ACTIONS`.
- Action buttons: `"View Details"`, `"Load into Live Check"`.
- Modal: `"Full Pond Checkup Details"`, `"WATER TEST READINGS"`, `"RECOMMENDED CARE STEPS"`.

---

## Verification
- `npm run build`: Passed in 571ms without errors.
- `pytest backend/tests/ -v`: 9/9 passed in 13.33s.
- FastAPI background daemon running on `127.0.0.1:8000`.
- Vite dev server running on `127.0.0.1:5173`.

