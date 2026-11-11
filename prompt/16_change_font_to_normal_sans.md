# Prompt 16: Standardization to Clean Normal Sans-Serif Typography

## 1. Context & User Directive
**User Prompt:** `change the text font to normal font`

## 2. Root Cause Analysis
- The application previously utilized `JetBrains Mono` as `--font-mono` across all numbers, badges, telemetry metrics, and the central Risk Gauge score readout.
- In terminal/monospace fonts like JetBrains Mono, numerals such as `0` render with a tall, narrow, dotted or slashed glyph and fixed character pitch, which looks unnatural, technical, and jarring to non-developer users.

## 3. Engineering Solution
1. **Typography Normalization (`frontend/src/index.css`):**
   - Standardized both `--font-sans` and `--font-mono` to modern, clean sans-serif font stack:
     ```css
     --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
     --font-mono: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
     ```
2. **Component Typography Overhaul:**
   - Swapped all `fontFamily: 'var(--font-mono)'` references to `var(--font-sans)` across:
     - `RiskGauge.jsx` (Score digits, `/ 100`, composite risk label, scale ticks, and tri-factor metrics)
     - `WaterTelemetryPanel.jsx` (DO, pH, Temperature, TAN, and free NH3 readouts)
     - `DiagnosticScanner.jsx` (Confidence percentage, differential breakdown, quality indicators)
     - `Header.jsx` (Backend heartbeat status and ledger badge counter)
     - `SurveillanceLedgerScreen.jsx` (KPI statistics, timestamps, and audit ledger tables)
     - `ActionPlanCard.jsx` (Priority numbering and dosage metrics)

## 4. Verification
- `npm run build`: Compiled in 494ms with zero errors.
- Verified in browser: all numeric digits (including the central `0` in Risk Gauge) now render as smooth, natural, modern sans-serif typography.

