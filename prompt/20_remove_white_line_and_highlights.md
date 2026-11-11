# Prompt 20: Elimination of White Lines and Specular Highlights

## 1. Context & User Directive
**User Prompt:**
`remove the white line`

**Analysis:**
1. The animated highlight pulses in [`AmbientRibbonBackground.jsx`](file:///e:/project/AquaGuard%20AI/frontend/src/components/AmbientRibbonBackground.jsx) (`.left-stream-pulse`, `.right-stream-pulse`) used white highlight gradient stops (`#ffffff`) with thicker stroke widths, rendering as white lines moving across the ribbon waves.
2. The card panels had a top-edge 1px specular line (`inset 0 1px 0 0 rgba(255, 255, 255, 0.28)`) and bright border in [`index.css`](file:///e:/project/AquaGuard%20AI/frontend/src/index.css).
3. The circular risk indicator pip in [`RiskGauge.jsx`](file:///e:/project/AquaGuard%20AI/frontend/src/components/RiskGauge.jsx) contained an inner circle with `fill="#ffffff"`.

---

## 2. Changes Made
1. **Background Wave Ribbons (`AmbientRibbonBackground.jsx`):**
   - Completely removed the white gradient definitions (`violetPulseGrad`, `orangePulseGrad`) and their associated moving paths (`.left-stream-pulse`, `.right-stream-pulse`).
   - Removed their GSAP tween controls.
   - Preserved only the pure gradient-colored lines and stippled particle streams (`url(#violetRibbonGrad)` and `url(#orangeRibbonGrad)`). Every strand in the background is now 100% colored (violet, magenta, pink, fiery orange, amber, gold) with zero white lines.
2. **Card Borders & Bevels (`index.css`):**
   - Removed the 1px white inset line (`inset 0 1px 0 0 rgba(255, 255, 255, 0.28)`) from `--glass-top-shine`.
   - Softened `--border-glass` to a subtle `rgba(255, 255, 255, 0.08)`.
3. **Risk Gauge Pip (`RiskGauge.jsx`):**
   - Changed target pip inner fill from `#ffffff` to dynamic `{tierColor}` with `#030407` stroke.

---

## 3. Verification
- `npm run build`: Compiled in 492ms with zero errors.
- `pytest backend/tests/ -q`: 9/9 passed in 11.57s (100% pass rate).
- Verified servers active on port 8000 and 5173.

